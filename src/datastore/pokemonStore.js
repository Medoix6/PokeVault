import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [],
    loading: false,
    searchQuery: ''
  }),
  
  getters: {
    filteredPokemon: (state) => {
      return state.pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
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
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
        }
      }
    },

    async fetchPokemon() {
      this.loading = true
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
        this.pokemonList = detailedPokemon
      } catch (error) {
        console.error('Error fetching Pokemon:', error)
      } finally {
        this.loading = false
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    }
  }
})