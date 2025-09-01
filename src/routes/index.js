import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import PokemonDetail from '../pages/PokemonDetail.vue'
import { usePokemonStore } from '../datastore/pokemonStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  // Disable keepAlive for Home to ensure it reloads cleanly when navigating back from details
  meta: { keepAlive: false }
  },
  {
    path: '/pokemon/:id',
    name: 'PokemonDetail',
    component: PokemonDetail,
    props: true,
    meta: { keepAlive: false } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(_to, _from, _savedPosition) {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const pokemonStore = usePokemonStore()
  
  if (to.name === 'Home') {
    try {
      pokemonStore.searchQuery = ''
      
      if (!pokemonStore.initialized || pokemonStore.pokemonList.length === 0) {
        await pokemonStore.fetchPokemon()
      } else {
        pokemonStore.$patch((state) => {
          state.lastUpdated = Date.now()
        })
      }
      next()
    } catch (error) {
      console.error('Error in navigation guard:', error)
      next(error)
    }
  } else {
    next()
  }
})

export default router