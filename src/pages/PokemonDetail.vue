<template>
  <div>
    <div class="detail-container" v-if="pokemon">
      <div class="detail-background">
        <div class="background-pattern"></div>
      </div>
      
      <div class="detail-content">
        <div class="back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <span>Back to PokeVault</span>
        </div>
        
        <div class="pokemon-header">
          <div class="pokemon-image-section">
            <div class="image-container">
              <div class="image-glow"></div>
              <img :src="pokemon.image" :alt="pokemon.customName || pokemon.name" class="pokemon-image">
              <div class="image-particles">
                <div class="particle" v-for="n in 12" :key="n" :style="{ '--delay': n * 0.2 + 's' }"></div>
              </div>
            </div>
            <div class="pokemon-number">#{{ String(pokemon.id).padStart(3, '0') }}</div>
          </div>
          
          <div class="pokemon-info">
            <h1 class="pokemon-name">{{ pokemon.customName || pokemon.name }}</h1>
            <div class="pokemon-types">
              <span 
                v-for="type in pokemon.types" 
                :key="type"
                class="type-badge"
                :class="'type-' + type"
              >
                <i :class="getTypeIcon(type)"></i>
                {{ type }}
              </span>
            </div>
            <p class="pokemon-description">
              {{ pokemon.customDescription || pokemon.description || 'A mysterious and powerful Pokémon with unique abilities and characteristics.' }}
            </p>
            
            <div class="pokemon-basic-info">
              <div class="info-item">
                <i class="fas fa-ruler-vertical"></i>
                <span>Height: {{ (pokemon.customHeight / 10).toFixed(1) }}m</span>
              </div>
              <div class="info-item">
                <i class="fas fa-weight-hanging"></i>
                <span>Weight: {{ (pokemon.customWeight / 10).toFixed(1) }}kg</span>
              </div>
              <div class="info-item">
                <i class="fas fa-star"></i>
                <span>Base Experience: {{ pokemon.base_experience }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pokemon-stats">
          <h2 class="stats-title">Base Stats</h2>
          <div class="stats-grid">
            <div class="stat-item" v-for="stat in pokemonStats" :key="stat.name">
              <div class="stat-header">
                <span class="stat-name">{{ stat.name }}</span>
                <span class="stat-value">{{ stat.value }}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: (stat.value / 255) * 100 + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pokemon-abilities">
          <h2 class="section-title">Abilities</h2>
          <div class="abilities-grid">
            <div 
              v-for="ability in pokemon.abilities" 
              :key="ability.ability.name"
              class="ability-item"
              :class="{ 'hidden-ability': ability.is_hidden }"
            >
              <div class="ability-header">
                <i class="fas fa-magic"></i>
                <span class="ability-name">{{ formatAbilityName(ability.ability.name) }}</span>
                <span v-if="ability.is_hidden" class="hidden-badge">Hidden</span>
              </div>
              <p class="ability-description">{{ ability.description || 'This ability grants the Pokémon special powers.' }}</p>
            </div>
          </div>
        </div>
        
        <div class="pokemon-moves">
          <h2 class="section-title">Moves</h2>
          <div class="moves-container">
            <div class="moves-grid">
              <div 
                v-for="move in pokemon.moves.slice(0, 12)" 
                :key="move.move.name"
                class="move-item"
              >
                <div class="move-header">
                  <i class="fas fa-fist-raised"></i>
                  <span class="move-name">{{ formatMoveName(move.move.name) }}</span>
                </div>
                <div class="move-details">
                  <span class="move-type" :class="'type-' + move.type">{{ move.type }}</span>
                  <span class="move-power">{{ move.power || 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div v-if="pokemon.moves.length > 12" class="more-moves">
              <p>And {{ pokemon.moves.length - 12 }} more moves...</p>
            </div>
          </div>
        </div>
        
        <div class="pokemon-evolution">
          <h2 class="section-title">Evolution Chain</h2>
          <div class="evolution-chain">
            <div v-if="pokemon.evolutionChain && pokemon.evolutionChain.length > 0" class="evolution-items">
              <div 
                v-for="(evolution, index) in pokemon.evolutionChain" 
                :key="evolution.id"
                class="evolution-item"
              >
                <div class="evolution-image">
                  <img :src="evolution.image" :alt="evolution.name">
                </div>
                <div class="evolution-info">
                  <h3>{{ evolution.name }}</h3>
                  <p>{{ evolution.trigger }}</p>
                </div>
                <div v-if="index < pokemon.evolutionChain.length - 1" class="evolution-arrow">
                  <i class="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
            <div v-else class="no-evolution">
              <i class="fas fa-info-circle"></i>
              <p>This Pokémon has no evolution chain.</p>
            </div>
          </div>
        </div>
        
        <div class="pokemon-actions">
          <button class="action-button edit-btn" @click="openEditModal">
            <i class="fas fa-edit"></i>
            <span>Edit Pokémon</span>
          </button>
        </div>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading-detail">
      <Loader />
    </div>
    <div v-else class="error-detail">
      <div class="error-content">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Pokémon Not Found</h3>
        <p>Sorry, we couldn't find this Pokémon. Please try again.</p>
        <button class="back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <span>Back to PokeVault</span>
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Edit {{ pokemon?.customName || pokemon?.name }}</h2>
          <button class="modal-close" @click="closeEditModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveChanges" class="edit-form">
          <div class="form-group">
            <label for="customName">Name</label>
            <input 
              id="customName"
              v-model="editForm.customName" 
              type="text" 
              class="form-input"
              placeholder="Enter custom name"
            >
          </div>
          
          <div class="form-group">
            <label for="customDescription">Description</label>
            <textarea 
              id="customDescription"
              v-model="editForm.customDescription" 
              class="form-textarea"
              rows="4"
              placeholder="Enter custom description"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="customHeight">Height (cm)</label>
              <input 
                id="customHeight"
                v-model.number="editForm.customHeight" 
                type="number" 
                class="form-input"
                min="1"
                max="1000"
              >
            </div>
            
            <div class="form-group">
              <label for="customWeight">Weight (g)</label>
              <input 
                id="customWeight"
                v-model.number="editForm.customWeight" 
                type="number" 
                class="form-input"
                min="1"
                max="1000000"
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeEditModal">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '../datastore/pokemonStore'
import Loader from '../components/Loader.vue'

const props = defineProps({ id: String })
const router = useRouter()
const pokemonStore = usePokemonStore()

const pokemon = ref(null)
const loading = ref(true)
const showEditModal = ref(false)
const editForm = ref({
  customName: '',
  customDescription: '',
  customHeight: 0,
  customWeight: 0
})

const pokemonStats = computed(() => {
  if (!pokemon.value) return []
  
  return [
    { name: 'HP', value: pokemon.value.stats?.hp || 50 },
    { name: 'Attack', value: pokemon.value.stats?.attack || 50 },
    { name: 'Defense', value: pokemon.value.stats?.defense || 50 },
    { name: 'Special Attack', value: pokemon.value.stats?.['special-attack'] || 50 },
    { name: 'Special Defense', value: pokemon.value.stats?.['special-defense'] || 50 },
    { name: 'Speed', value: pokemon.value.stats?.speed || 50 }
  ]
})

onMounted(async () => {
  const pokemonId = props.id
  if (pokemonId) {
    try {
      loading.value = true
      const pokemonData = await pokemonStore.fetchPokemonDetail(pokemonId)
      pokemon.value = pokemonData
    } catch (error) {
      console.error('Error fetching Pokemon details:', error)
    } finally {
      loading.value = false
    }
  }
})

const openEditModal = () => {
  editForm.value = {
    customName: pokemon.value.customName || pokemon.value.name,
    customDescription: pokemon.value.customDescription || pokemon.value.description,
    customHeight: pokemon.value.customHeight || pokemon.value.height,
    customWeight: pokemon.value.customWeight || pokemon.value.weight
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveChanges = () => {
  pokemonStore.updatePokemon(pokemon.value.id, editForm.value)
  pokemon.value = { ...pokemon.value, ...editForm.value }
  closeEditModal()
}

const getTypeIcon = (type) => {
  const icons = {
    fire: 'fas fa-fire',
    water: 'fas fa-tint',
    grass: 'fas fa-leaf',
    electric: 'fas fa-bolt',
    ice: 'fas fa-snowflake',
    fighting: 'fas fa-fist-raised',
    poison: 'fas fa-skull-crossbones',
    ground: 'fas fa-mountain',
    flying: 'fas fa-feather-alt',
    psychic: 'fas fa-brain',
    bug: 'fas fa-bug',
    rock: 'fas fa-circle',
    ghost: 'fas fa-ghost',
    dragon: 'fas fa-dragon',
    dark: 'fas fa-moon',
    steel: 'fas fa-cog',
    fairy: 'fas fa-star',
    normal: 'fas fa-circle'
  }
  return icons[type] || 'fas fa-circle'
}

const formatAbilityName = (name) => {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatMoveName = (name) => {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const goBack = () => {
  // Navigate to home with a timestamp to ensure the page refreshes
  router.push({ name: 'Home', query: { _refresh: Date.now() } })
}


</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.detail-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-pattern {
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  animation: background-float 20s ease-in-out infinite;
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  font-weight: 500;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateX(-5px);
}

.pokemon-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 3rem;
  animation: fade-in-up 0.8s ease;
}

.pokemon-image-section {
  position: relative;
  text-align: center;
}

.image-container {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 3rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.image-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 3s ease-in-out infinite;
}

.pokemon-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  animation: float-image 4s ease-in-out infinite;
}

.image-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: particle-orbit 4s linear infinite;
  animation-delay: var(--delay);
}

.pokemon-number {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  display: inline-block;
}

.pokemon-info {
  animation: fade-in-up 0.8s ease 0.2s both;
}

.pokemon-name {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  text-transform: capitalize;
}

.pokemon-types {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.pokemon-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.pokemon-basic-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.info-item i {
  color: #4ecdc4;
  width: 20px;
}

.section-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.pokemon-stats {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 2rem;
  margin-bottom: 2rem;
  animation: fade-in-up 0.8s ease 0.4s both;
}

.stats-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.stats-grid {
  display: grid;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-name {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-transform: capitalize;
}

.stat-value {
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.stat-bar {
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
  border-radius: 6px;
  transition: width 1s ease;
  position: relative;
}

.stat-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s ease-in-out infinite;
}

.pokemon-abilities {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 2rem;
  margin-bottom: 2rem;
  animation: fade-in-up 0.8s ease 0.6s both;
}

.abilities-grid {
  display: grid;
  gap: 1rem;
}

.ability-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.ability-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.hidden-ability {
  border-color: #ffd700;
}

.ability-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.ability-header i {
  color: #4ecdc4;
}

.ability-name {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: capitalize;
}

.hidden-badge {
  background: #ffd700;
  color: #333;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.ability-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  font-size: 0.95rem;
}

.pokemon-moves {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 2rem;
  margin-bottom: 2rem;
  animation: fade-in-up 0.8s ease 0.8s both;
}

.moves-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.moves-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.move-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.move-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.move-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.move-header i {
  color: #ff6b6b;
}

.move-name {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-transform: capitalize;
}

.move-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.move-type {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
}

.move-power {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.more-moves {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.pokemon-evolution {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 2rem;
  margin-bottom: 2rem;
  animation: fade-in-up 0.8s ease 1s both;
}

.evolution-chain {
  display: flex;
  justify-content: center;
}

.evolution-items {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.evolution-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.evolution-image {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.evolution-image img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.evolution-info h3 {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 0.3rem;
}

.evolution-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-transform: capitalize;
}

.evolution-arrow {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
}

.no-evolution {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.no-evolution i {
  font-size: 2rem;
}

.pokemon-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fade-in-up 0.8s ease 1.2s both;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 1rem 2rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.edit-btn:hover {
  border-color: #ffd700;
  color: #ffd700;
}



.loading-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.error-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.error-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 3rem;
  text-align: center;
  max-width: 400px;
  animation: fade-in-up 0.6s ease;
}

.error-content i {
  font-size: 4rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.error-content h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.error-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fade-in 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-in-up 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.form-input,
.form-textarea {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4ecdc4;
  background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  border-color: #4ecdc4;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(78, 205, 196, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

/* Pokemon type colors with enhanced gradients */
.type-normal { background: linear-gradient(135deg, #A8A878, #8A8A59); }
.type-fire { background: linear-gradient(135deg, #F08030, #DD6610); }
.type-water { background: linear-gradient(135deg, #6890F0, #386CEB); }
.type-electric { background: linear-gradient(135deg, #F8D030, #FBD000); }
.type-grass { background: linear-gradient(135deg, #78C850, #5CAB2D); }
.type-ice { background: linear-gradient(135deg, #98D8D8, #69C6C6); }
.type-fighting { background: linear-gradient(135deg, #C03028, #9D2721); }
.type-poison { background: linear-gradient(135deg, #A040A0, #803380); }
.type-ground { background: linear-gradient(135deg, #E0C068, #D4A82F); }
.type-flying { background: linear-gradient(135deg, #A890F0, #9180C4); }
.type-psychic { background: linear-gradient(135deg, #F85888, #F61C5D); }
.type-bug { background: linear-gradient(135deg, #A8B820, #8D9A1B); }
.type-rock { background: linear-gradient(135deg, #B8A038, #93802D); }
.type-ghost { background: linear-gradient(135deg, #705898, #554374); }
.type-dragon { background: linear-gradient(135deg, #7038F8, #4C08EF); }
.type-dark { background: linear-gradient(135deg, #705848, #513F35); }
.type-steel { background: linear-gradient(135deg, #B8B8D0, #9797BA); }
.type-fairy { background: linear-gradient(135deg, #EE99AC, #E7798F); }

@keyframes background-float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(1deg);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes float-image {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes particle-orbit {
  0% {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
    opacity: 0;
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .pokemon-header {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .pokemon-name {
    font-size: 2.5rem;
  }
  
  .image-container {
    padding: 2rem;
  }
  
  .pokemon-actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
  
  .detail-content {
    padding: 0 1rem;
  }
  
  .evolution-items {
    flex-direction: column;
    gap: 1rem;
  }
  
  .evolution-arrow {
    transform: rotate(90deg);
  }
  
  .moves-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
