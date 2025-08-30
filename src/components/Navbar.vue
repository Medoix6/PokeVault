<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <div class="pokeball-container">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
               alt="Pokéball" 
               class="pokeball-icon">
          <div class="pokeball-glow"></div>
        </div>
        <span class="brand-text">PokeVault</span>
      </router-link>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link" active-class="active">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>

<style scoped>
.navbar {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: 700;
  color: white !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.pokeball-container {
  position: relative;
  margin-right: 15px;
}

.pokeball-icon {
  width: 35px;
  height: 35px;
  filter: brightness(0) invert(1);
  animation: spin 3s linear infinite;
  position: relative;
  z-index: 2;
}

.pokeball-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  z-index: 1;
}

.brand-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-left: auto;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.nav-link.active {
  color: white !important;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.nav-link i {
  font-size: 1.1rem;
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
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
  }
  
  .nav-link span {
    display: none;
  }
  
  .brand-text {
    font-size: 1.5rem;
  }
}
</style>