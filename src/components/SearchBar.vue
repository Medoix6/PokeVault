<template>
  <div class="search-container">
    <div class="search-bar">
      <div class="search-icon">
        <i class="fas fa-search"></i>
      </div>
      <input
        type="text"
        class="search-input"
        placeholder="Search Pokémon by name or type..."
        v-model="searchQuery"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <div class="search-clear" v-if="searchQuery" @click="clearSearch">
        <i class="fas fa-times"></i>
      </div>
      <div class="search-loading" v-if="isSearching">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    </div>
    <div class="search-suggestions" v-if="showSuggestions && searchQuery">
      <div class="suggestion-item" v-for="suggestion in filteredSuggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
        <i class="fas fa-lightbulb"></i>
        <span>{{ suggestion }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'search'])
const isFocused = ref(false)
const isSearching = ref(false)

const suggestions = [
  'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Mew',
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Dragon'
]

const showSuggestions = computed(() => isFocused.value && props.modelValue.length > 0)

const filteredSuggestions = computed(() => {
  if (!props.modelValue) return []
  return suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(props.modelValue.toLowerCase())
  ).slice(0, 6)
})

const emitSearch = () => {
  isSearching.value = true
  emit('search', props.modelValue)
  setTimeout(() => {
    isSearching.value = false
  }, 300)
}

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
  emit('search', e.target.value)
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  }, 200)
}

const clearSearch = () => {
  emit('update:modelValue', '')
  emitSearch()
}

const selectSuggestion = (suggestion) => {
  emit('update:modelValue', suggestion)
  emitSearch()
  isFocused.value = false
}
</script>

<style scoped>
.search-container {
  max-width: 600px;
  margin: 0 auto 3rem;
  position: relative;
}

.search-bar {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-bar:hover {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-bar:focus-within {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.search-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  animation: pulse 2s ease-in-out infinite;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

.search-clear,
.search-loading {
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-loading {
  cursor: default;
}

.search-clear:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-top: 0.5rem;
  padding: 0.5rem;
  z-index: 1000;
  animation: slideDown 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  border-radius: 15px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(5px);
}

.suggestion-item i {
  color: #ffd700;
  font-size: 0.9rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .search-container {
    max-width: 90%;
  }
  
  .search-bar {
    padding: 0.8rem 1.2rem;
  }
  
  .search-input {
    font-size: 1rem;
  }
}
</style>