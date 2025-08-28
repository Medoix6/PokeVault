<template>
  <div class="search-bar">
    <input
      type="text"
      class="form-control"
      placeholder="Search Pokémon..."
      v-model="searchQuery"
      @input="emitSearch"
    >
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const searchQuery = ref('')
const emit = defineEmits(['search'])

const emitSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<style scoped>
.search-bar {
  max-width: 500px;
  margin: 0 auto 2rem;
}
</style>