<template>
  <div id="app">
    <div class="animated-background">
      <div class="floating-pokeball" v-for="n in 6" :key="n" :style="{ '--delay': n * 2 + 's' }"></div>
      <div class="floating-star" v-for="n in 8" :key="n + 10" :style="{ '--delay': n * 1.5 + 's' }"></div>
    </div>
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.floating-pokeball {
  position: absolute;
  width: 60px;
  height: 60px;
  background: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png') no-repeat center;
  background-size: contain;
  opacity: 0.1;
  animation: float 8s ease-in-out infinite;
  animation-delay: var(--delay);
}

.floating-star {
  position: absolute;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #fff 30%, transparent 70%);
  border-radius: 50%;
  opacity: 0.3;
  animation: twinkle 6s ease-in-out infinite;
  animation-delay: var(--delay);
}

.floating-pokeball:nth-child(1) { top: 10%; left: 10%; }
.floating-pokeball:nth-child(2) { top: 20%; right: 15%; }
.floating-pokeball:nth-child(3) { top: 60%; left: 5%; }
.floating-pokeball:nth-child(4) { top: 80%; right: 10%; }
.floating-pokeball:nth-child(5) { top: 40%; left: 80%; }
.floating-pokeball:nth-child(6) { top: 70%; right: 80%; }

.floating-star:nth-child(7) { top: 15%; left: 30%; }
.floating-star:nth-child(8) { top: 25%; right: 40%; }
.floating-star:nth-child(9) { top: 45%; left: 60%; }
.floating-star:nth-child(10) { top: 65%; right: 30%; }
.floating-star:nth-child(11) { top: 85%; left: 40%; }
.floating-star:nth-child(12) { top: 35%; right: 70%; }
.floating-star:nth-child(13) { top: 55%; left: 20%; }
.floating-star:nth-child(14) { top: 75%; right: 60%; }

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.5s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
