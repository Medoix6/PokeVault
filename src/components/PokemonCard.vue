<template>
  <div class="pokemon-card" @click="handleClick">
    <div class="card-glow"></div>
    <div class="particles">
      <div class="particle" v-for="n in 6" :key="n" :style="{ '--delay': n * 0.5 + 's' }"></div>
    </div>
    <div class="card-content">
      <div class="image-container">
        <div class="image-background"></div>
        <img 
          :src="pokemon.image" 
          :alt="pokemon.name" 
          class="pokemon-image"
          @load="imageLoaded = true"
          @error="imageError = true"
          v-show="imageLoaded && !imageError"
        >
        <div v-if="!imageLoaded && !imageError" class="image-loading">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <div v-if="imageError" class="image-error">
          <i class="fas fa-image"></i>
        </div>
        <div class="pokemon-number">#{{ String(pokemon.id).padStart(3, '0') }}</div>
        <div class="image-overlay"></div>
      </div>
      <div class="card-info">
        <h3 class="pokemon-name">{{ pokemon.name }}</h3>
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
                 <div class="card-actions">
           <button class="action-btn details-btn" @click.stop="viewDetails">
             <i class="fas fa-info-circle"></i>
           </button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'details'])
const router = useRouter()
const imageLoaded = ref(false)
const imageError = ref(false)

const handleClick = () => {
  emit('click', props.pokemon)
  // Navigate to detail page using Vue Router
  router.push(`/pokemon/${props.pokemon.id}`)
}



const viewDetails = () => {
  emit('details', props.pokemon)
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
</script>

<style scoped>
.pokemon-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.pokemon-card:hover {
  transform: translateY(-15px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.pokemon-card:hover .card-glow {
  opacity: 1;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float-particle 3s ease-in-out infinite;
  animation-delay: var(--delay);
}

.particle:nth-child(1) { top: 20%; left: 10%; }
.particle:nth-child(2) { top: 30%; right: 15%; }
.particle:nth-child(3) { top: 60%; left: 20%; }
.particle:nth-child(4) { top: 70%; right: 25%; }
.particle:nth-child(5) { top: 40%; left: 80%; }
.particle:nth-child(6) { top: 80%; right: 80%; }

.card-content {
  padding: 1.5rem;
  position: relative;
  z-index: 2;
}

.image-container {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pokemon-card:hover .image-background {
  opacity: 1;
}

.pokemon-image {
  width: 100%;
  height: auto;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
}

.image-loading,
.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 2rem;
}

.image-loading i {
  animation: spin 1s linear infinite;
}

.image-error {
  color: rgba(255, 255, 255, 0.4);
}

.pokemon-card:hover .pokemon-image {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
}

.pokemon-number {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
  letter-spacing: 1px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.pokemon-card:hover .image-overlay {
  transform: translateX(100%);
}

.card-info {
  text-align: center;
}

.pokemon-name {
  font-size: 1.6rem;
  color: white;
  margin: 0.5rem 0 1rem;
  text-transform: capitalize;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.pokemon-types {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.type-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.type-badge i {
  font-size: 0.8rem;
}

.card-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}



.details-btn:hover {
  color: #4ecdc4;
  border-color: #4ecdc4;
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

@keyframes float-particle {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .pokemon-card {
    margin-bottom: 1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .image-container {
    padding: 1.5rem;
  }
  
  .pokemon-name {
    font-size: 1.4rem;
  }
  
  .type-badge {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>