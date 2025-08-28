<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f8f9fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
