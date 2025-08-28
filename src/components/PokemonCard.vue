<template>
  <div class="card h-100">
    <img :src="pokemon.image" class="card-img-top" :alt="pokemon.name">
    <div class="card-body">
      <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
      <div class="d-flex gap-2">
        <span 
          v-for="type in pokemon.types" 
          :key="type"
          class="badge"
          :class="'bg-' + type"
        >
          {{ type }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.card {
  transition: transform 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  padding: 1rem;
  background-color: #f8f9fa;
}

/* Pokemon type colors */
.bg-normal { background-color: #A8A878; }
.bg-fire { background-color: #F08030; }
.bg-water { background-color: #6890F0; }
.bg-electric { background-color: #F8D030; }
.bg-grass { background-color: #78C850; }
.bg-ice { background-color: #98D8D8; }
.bg-fighting { background-color: #C03028; }
.bg-poison { background-color: #A040A0; }
.bg-ground { background-color: #E0C068; }
.bg-flying { background-color: #A890F0; }
.bg-psychic { background-color: #F85888; }
.bg-bug { background-color: #A8B820; }
.bg-rock { background-color: #B8A038; }
.bg-ghost { background-color: #705898; }
.bg-dragon { background-color: #7038F8; }
.bg-dark { background-color: #705848; }
.bg-steel { background-color: #B8B8D0; }
.bg-fairy { background-color: #EE99AC; }
</style>