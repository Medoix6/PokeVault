<template>
  <div class="loader-container">
    <div class="pokeball-loader">
      <div class="pokeball-top"></div>
      <div class="pokeball-bottom"></div>
      <div class="pokeball-center"></div>
      <div class="pokeball-button"></div>
    </div>
    <div class="loading-text">
      <span>Catching Pokémon</span>
      <div class="dots">
        <span class="dot" v-for="n in 3" :key="n" :style="{ '--delay': n * 0.2 + 's' }"></span>
      </div>
    </div>
    <div class="loading-particles">
      <div class="particle" v-for="n in 8" :key="n" :style="{ '--delay': n * 0.3 + 's' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PokemonLoader'
}
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  position: relative;
}

.pokeball-loader {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
  animation: bounce 2s ease-in-out infinite;
}

.pokeball-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 40px;
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  border-radius: 40px 40px 0 0;
  border: 3px solid #333;
  border-bottom: none;
  animation: spin 3s linear infinite;
}

.pokeball-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 40px;
  background: linear-gradient(135deg, #f9d423, #ff4e50);
  border-radius: 0 0 40px 40px;
  border: 3px solid #333;
  border-top: none;
  animation: spin 3s linear infinite reverse;
}

.pokeball-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid #333;
  border-radius: 50%;
  z-index: 2;
}

.pokeball-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
  z-index: 3;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
}

.dots {
  display: flex;
  gap: 0.3rem;
}

.dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: dot-bounce 1.4s ease-in-out infinite;
  animation-delay: var(--delay);
}

.loading-particles {
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
  background: linear-gradient(45deg, #ff4e50, #f9d423);
  border-radius: 50%;
  animation: particle-float 3s ease-in-out infinite;
  animation-delay: var(--delay);
}

.particle:nth-child(1) { top: 20%; left: 10%; }
.particle:nth-child(2) { top: 30%; right: 15%; }
.particle:nth-child(3) { top: 60%; left: 20%; }
.particle:nth-child(4) { top: 70%; right: 25%; }
.particle:nth-child(5) { top: 40%; left: 80%; }
.particle:nth-child(6) { top: 80%; right: 80%; }
.particle:nth-child(7) { top: 15%; left: 60%; }
.particle:nth-child(8) { top: 85%; left: 40%; }

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30px) scale(1.2);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .pokeball-loader {
    width: 60px;
    height: 60px;
  }
  
  .pokeball-top,
  .pokeball-bottom {
    width: 60px;
    height: 30px;
    border-radius: 30px 30px 0 0;
  }
  
  .pokeball-bottom {
    border-radius: 0 0 30px 30px;
  }
  
  .pokeball-center {
    width: 15px;
    height: 15px;
  }
  
  .pokeball-button {
    width: 6px;
    height: 6px;
  }
  
  .loading-text {
    font-size: 1rem;
  }
}
</style>