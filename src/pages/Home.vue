<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-word title-word-1">Discover</span>
          <span class="title-word title-word-2">Amazing</span>
          <span class="title-word title-word-3">Pokémon</span>
        </h1>
        <p class="hero-subtitle">Explore the world of Pokémon with our interactive PokeVault</p>
      </div>
    </div>
    
    <SearchBar v-model="pokemonStore.searchQuery" @search="handleSearch" />
    
    <div v-if="loading" class="loading-section">
      <Loader />
    </div>

    <div v-else class="pokemon-grid">
      <transition-group name="pokemon-list" tag="div" class="row g-4">
        <div v-for="(pokemon, index) in displayedPokemon" 
             :key="pokemon.id" 
             class="col-12 col-sm-6 col-md-4 col-lg-3"
             :style="{ '--animation-delay': index * 0.1 + 's' }">
                     <PokemonCard 
             :pokemon="pokemon" 
             @click="handlePokemonClick"
             @details="handleDetails"
           />
        </div>
      </transition-group>
      
      <div v-if="displayedPokemon.length === 0" class="no-results">
        <div class="no-results-content">
          <i class="fas fa-search"></i>
          <h3>No Pokémon Found</h3>
          <p>Try searching for a different Pokémon or type</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onActivated, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { usePokemonStore } from '../datastore/pokemonStore'
import PokemonCard from '../components/PokemonCard.vue'
import SearchBar from '../components/SearchBar.vue'
import Loader from '../components/Loader.vue'

export default {
  name: 'HomePage',
  components: {
    PokemonCard,
    SearchBar,
    Loader
  },
  setup() {
    const pokemonStore = usePokemonStore()
    const { loading, filteredPokemon } = storeToRefs(pokemonStore)
    const { fetchPokemon, setSearchQuery } = pokemonStore
    const route = useRoute()

    // Function to ensure Pokemon data is loaded and displayed
    const ensurePokemonData = async () => {
      try {
        const needsRefresh = route.query._refresh !== undefined
        
        if (!pokemonStore.initialized || pokemonStore.pokemonList.length === 0 || needsRefresh) {
          console.log('Refreshing Pokemon data')
          await fetchPokemon(needsRefresh ? true : false)
          setSearchQuery('') // Reset search query when returning
        } else {
          if (pokemonStore.pokemonList.length > 0 && pokemonStore.filteredPokemon.length === 0) {
            pokemonStore.$patch((state) => {
              state.searchQuery = ''
              state.lastUpdated = Date.now()
            })
          } else {
            pokemonStore.$patch((state) => { state.lastUpdated = Date.now() })
          }
        }
        setTimeout(() => {
          if (
            typeof window !== 'undefined' &&
            pokemonStore.pokemonList &&
            pokemonStore.pokemonList.length > 0 &&
            (Array.isArray(displayedPokemon.value) ? displayedPokemon.value.length : 0) === 0
          ) {
            console.warn('Hard reload triggered: store has data but UI is empty')
            window.location.reload()
          }
        }, 200)
      } catch (error) {
        console.error('Error loading Pokemon data:', error)
      }
    }

    // Load data when component is mounted
    onMounted(ensurePokemonData)
    
    // Also ensure data is fresh when navigating back to this page
    onActivated(ensurePokemonData)

    const handleSearch = (query) => {
      setSearchQuery(query)
    }

    // Computed property to determine which list to display
    const displayedPokemon = computed(() => {
      const filtered = filteredPokemon.value || []
      if (Array.isArray(filtered) && filtered.length > 0) return filtered
      return pokemonStore.pokemonList || []
    })

    const handlePokemonClick = (pokemon) => {
      console.log('Pokemon clicked:', pokemon.name)
    }



    const handleDetails = (pokemon) => {
      console.log('View details for:', pokemon.name)
    }

    return {
      loading,
      filteredPokemon,
      displayedPokemon,
      handleSearch,
      handlePokemonClick,
      handleDetails,
      pokemonStore,
      processEnv: process.env.NODE_ENV
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 2rem 0;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: hero-glow 4s ease-in-out infinite;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.title-word {
  animation: color-animation 4s linear infinite;
  opacity: 0;
  animation-fill-mode: forwards;
}

.title-word-1 {
  --color-1: #ff6b6b;
  --color-2: #4ecdc4;
  --color-3: #45b7d1;
  animation-delay: 0s;
}

.title-word-2 {
  --color-1: #4ecdc4;
  --color-2: #45b7d1;
  --color-3: #ff6b6b;
  animation-delay: 0.5s;
}

.title-word-3 {
  --color-1: #45b7d1;
  --color-2: #ff6b6b;
  --color-3: #4ecdc4;
  animation-delay: 1s;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fade-in-up 1s ease 1.5s both;
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.pokemon-grid {
  position: relative;
}

.pokemon-list-enter-active {
  animation: slide-in-up 0.6s ease both;
  animation-delay: var(--animation-delay);
}

.pokemon-list-leave-active {
  animation: slide-out-down 0.4s ease both;
}

.pokemon-list-move {
  transition: transform 0.4s ease;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  text-align: center;
}

.no-results-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 3rem;
  max-width: 400px;
  animation: fade-in-up 0.6s ease;
}

.no-results-content i {
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

.no-results-content h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.no-results-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.debug-overlay {
  position: fixed;
  bottom: 12px;
  right: 12px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 2000;
}

@keyframes color-animation {
  0% {
    color: var(--color-1);
    opacity: 0;
    transform: translateY(20px);
  }
  32% {
    color: var(--color-1);
    opacity: 1;
    transform: translateY(0);
  }
  33% {
    color: var(--color-2);
  }
  65% {
    color: var(--color-2);
  }
  66% {
    color: var(--color-3);
  }
  99% {
    color: var(--color-3);
  }
  100% {
    color: var(--color-1);
  }
}

@keyframes hero-glow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide-out-down {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .home-container {
    padding: 1rem 0;
  }
  
  .hero-section {
    padding: 2rem 0;
    margin-bottom: 2rem;
  }
  
  .no-results-content {
    padding: 2rem;
    margin: 0 1rem;
  }
}
</style>