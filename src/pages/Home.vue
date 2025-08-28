<template>
  <div class="container mt-4">
    <SearchBar @search="handleSearch" />
    
    <div v-if="loading" class="text-center mt-5">
      <Loader />
    </div>

    <div v-else class="row g-4 mt-2">
      <div v-for="pokemon in filteredPokemon" 
           :key="pokemon.id" 
           class="col-12 col-sm-6 col-md-4 col-lg-3">
        <PokemonCard :pokemon="pokemon" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
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
    const { pokemonList, loading, filteredPokemon } = storeToRefs(pokemonStore)
    const { fetchPokemon, setSearchQuery } = pokemonStore

    onMounted(async () => {
      console.log('Home component mounted')
      try {
        if (pokemonList.value.length === 0) {
          console.log('Starting Pokemon fetch')
          await fetchPokemon()
          console.log('Pokemon fetch completed, list length:', pokemonList.value.length)
        }
      } catch (error) {
        console.error('Error in Home component:', error)
      }
    })

    const handleSearch = (query) => {
      setSearchQuery(query)
    }

    return {
      loading,
      filteredPokemon,
      handleSearch
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
}
</style>