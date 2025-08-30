import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  // Improved Pokemon store to fix card display issues after navigation
  state: () => ({
    pokemonList: [],
    pokemonDetails: {}, // Store detailed Pokemon data
    loading: false,
    detailLoading: false, // Separate loading state for detail pages
    error: null,
    searchQuery: '',
    initialized: false, // Track if the store has been initialized
    lastUpdated: null, // Track when the data was last updated
    cacheTimestamp: null // Track when the cache was last updated
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['pokemonList', 'initialized', 'cacheTimestamp']
      }
    ]
  },
  
  getters: {
    filteredPokemon: (state) => {
      return state.pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    },
    
    getPokemonById: (state) => (id) => {
      return state.pokemonDetails[id] || null
    }
  },

  actions: {
    async fetchPokemonDetails(pokemon, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          const details = await axios.get(pokemon.url)
          return {
            id: details.data.id,
            name: details.data.name,
            image: details.data.sprites.other['official-artwork'].front_default,
            types: details.data.types.map(type => type.type.name)
          }
        } catch (error) {
          console.error(`Attempt ${i + 1}/${retries} failed for ${pokemon.name}:`, error.message)
          if (i === retries - 1) throw error
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) 
        }
      }
    },

    async fetchPokemon(force = false) {
      // Check if we need to fetch data
      const cacheAge = this.cacheTimestamp ? Date.now() - this.cacheTimestamp : Infinity
      const cacheValid = cacheAge < 3600000 // Cache valid for 1 hour

      // If in-memory list is empty, try to hydrate from localStorage first
      try {
        if ((this.pokemonList.length === 0) && localStorage.getItem('pokemonList')) {
          const cached = JSON.parse(localStorage.getItem('pokemonList'))
          if (Array.isArray(cached) && cached.length > 0) {
            this.$patch((state) => {
              state.pokemonList = cached
              state.initialized = true
              state.cacheTimestamp = Number(localStorage.getItem('pokemonCacheTimestamp')) || Date.now()
              state.lastUpdated = Date.now()
            })
            console.log('Hydrated pokemonList from localStorage cache')
            return this.pokemonList
          }
        }
      } catch (err) {
        console.warn('Failed to parse cached pokemonList from localStorage:', err)
      }

      if (!force && this.initialized && this.pokemonList.length > 0 && cacheValid) {
        console.log('Using cached Pokemon data')
        this.lastUpdated = Date.now()
        return this.pokemonList
      }
      
      this.loading = true
      this.error = null
      try {
        console.log('Fetching initial Pokemon list...')
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100")
        const results = response.data.results
        console.log('Initial Pokemon list fetched:', results.length, 'Pokemon')

        console.log('Fetching detailed Pokemon information...')

        const batchSize = 100
        const detailedPokemon = []
        
        for (let i = 0; i < results.length; i += batchSize) {
          const batch = results.slice(i, i + batchSize)
          console.log(`Fetching batch ${i/batchSize + 1}/${Math.ceil(results.length/batchSize)}`)
          
          const batchResults = await Promise.all(
            batch.map(pokemon => this.fetchPokemonDetails(pokemon))
          )
          
          detailedPokemon.push(...batchResults)
          console.log(`Fetched ${detailedPokemon.length}/${results.length} Pokemon`)
        }

        console.log('All Pokemon details fetched successfully')
        this.$patch((state) => {
          state.pokemonList = detailedPokemon
          state.initialized = true
          state.lastUpdated = Date.now()
          state.cacheTimestamp = Date.now()
          state.searchQuery = ''  // Reset search query when updating data
        })
        try {
          localStorage.setItem('pokemonList', JSON.stringify(detailedPokemon))
          localStorage.setItem('pokemonCacheTimestamp', String(Date.now()))
          console.log('Saved pokemonList to localStorage cache')
        } catch (err) {
          console.warn('Failed to save pokemonList to localStorage:', err)
        }
        console.log('Pokemon list updated and store initialized')
        return this.pokemonList
      } catch (error) {
        console.error('Error fetching Pokemon:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchPokemonDetail(id) {
      if (this.pokemonDetails[id]) {
        return this.pokemonDetails[id]
      }

      this.detailLoading = true
      this.error = null

  try {
        // Fetch detailed Pokemon data
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = response.data
        
        // Fetch species data for description
        const speciesResponse = await axios.get(data.species.url)
        const speciesData = speciesResponse.data
        
        // Get English description
        const englishEntry = speciesData.flavor_text_entries.find(
          entry => entry.language.name === 'en'
        )
        
        // Fetch evolution chain
        const evolutionResponse = await axios.get(speciesData.evolution_chain.url)
        const evolutionData = evolutionResponse.data
        
        // Process evolution chain
        const evolutions = await this.processEvolutionChain(evolutionData.chain)
        
        // Fetch move details
        const movesWithDetails = await Promise.all(
          data.moves.slice(0, 12).map(async (move) => {
            try {
              const moveResponse = await axios.get(move.move.url)
              const moveData = moveResponse.data
              return {
                move: move.move,
                type: moveData.type.name,
                power: moveData.power
              }
            } catch (error) {
              return {
                move: move.move,
                type: 'normal',
                power: null
              }
            }
          })
        )
        
        // Fetch ability descriptions
        const abilitiesWithDetails = await Promise.all(
          data.abilities.map(async (ability) => {
            try {
              const abilityResponse = await axios.get(ability.ability.url)
              const abilityData = abilityResponse.data
              const englishEffect = abilityData.effect_entries.find(
                entry => entry.language.name === 'en'
              )
              return {
                ...ability,
                description: englishEffect ? englishEffect.short_effect : null
              }
            } catch (error) {
              return {
                ...ability,
                description: null
              }
            }
          })
        )
        
        const pokemonDetail = {
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          types: data.types.map(type => type.type.name),
          stats: data.stats.reduce((acc, stat) => {
            acc[stat.stat.name] = stat.base_stat
            return acc
          }, {}),
          height: data.height,
          weight: data.weight,
          base_experience: data.base_experience,
          abilities: abilitiesWithDetails,
          moves: movesWithDetails,
          description: englishEntry ? englishEntry.flavor_text.replace(/\f|\n|\r/g, ' ') : null,
          evolutionChain: evolutions,
          // Add editable fields
          customName: data.name,
          customDescription: englishEntry ? englishEntry.flavor_text.replace(/\f|\n|\r/g, ' ') : null,
          customHeight: data.height,
          customWeight: data.weight
        }
        
        // Store in state
        this.pokemonDetails[id] = pokemonDetail
        return pokemonDetail
      } catch (error) {
        console.error('Error fetching Pokemon details:', error)
        this.error = error.message
        // Try to build a minimal detail object from the cached pokemonList if available
        const listEntry = this.pokemonList.find(p => Number(p.id) === Number(id))
        if (listEntry) {
          const fallback = {
            id: listEntry.id,
            name: listEntry.name,
            image: listEntry.image,
            types: listEntry.types || [],
            stats: listEntry.stats || {},
            height: listEntry.height || 0,
            weight: listEntry.weight || 0,
            base_experience: listEntry.base_experience || 0,
            abilities: listEntry.abilities || [],
            moves: listEntry.moves || [],
            description: listEntry.description || null,
            evolutionChain: listEntry.evolutionChain || []
          }
          this.pokemonDetails[id] = fallback
          return fallback
        }
        throw error
      } finally {
        this.detailLoading = false
      }
    },

    async processEvolutionChain(chain) {
      const evolutions = []
      
      const processChain = async (evolutionChain, trigger = 'Base form') => {
        try {
          const response = await axios.get(evolutionChain.species.url)
          const speciesData = response.data
          
          const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesData.id}`)
          const pokemonData = pokemonResponse.data
          
          evolutions.push({
            id: speciesData.id,
            name: speciesData.name,
            image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default,
            trigger: trigger
          })
          
          if (evolutionChain.evolves_to.length > 0) {
            for (const evolution of evolutionChain.evolves_to) {
              const evolutionTrigger = evolution.evolution_details[0]?.trigger?.name || 'Level up'
              await processChain(evolution, evolutionTrigger)
            }
          }
        } catch (error) {
          console.error('Error processing evolution chain:', error)
        }
      }
      
      await processChain(chain)
      return evolutions
    },

    updatePokemon(id, updates) {
      if (this.pokemonDetails[id]) {
        this.pokemonDetails[id] = {
          ...this.pokemonDetails[id],
          ...updates
        }
        
        // Also update the basic list if it exists
        const listIndex = this.pokemonList.findIndex(p => p.id === id)
        if (listIndex !== -1) {
          this.pokemonList[listIndex] = {
            ...this.pokemonList[listIndex],
            name: updates.customName || updates.name || this.pokemonList[listIndex].name
          }
        }
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },
    
    // Method to reset and refresh the Pokemon list
    resetPokemonList() {
      // Store the current list
      const currentList = [...this.pokemonList]
      // Clear the list to trigger reactivity
      this.pokemonList = []
      // Use setTimeout to ensure the DOM updates before adding the data back
      setTimeout(() => {
        this.pokemonList = currentList
      }, 0)
    }
  }
})