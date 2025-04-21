<template>
  <header :class="['header', { dark: isDarkMode }]">
    <div class="left">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
    </div>
    <div class="center">
      <input type="text" placeholder="Buscar..." class="search" />
    </div>
    <div class="right">
      <button @click="toggleDarkMode" class="toggle-button">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'

const isDarkMode = ref(false)

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: #ffffff;
  color: #000;
  transition: background 0.3s, color 0.3s;
  flex-wrap: wrap;
}

.header.dark {
  background: #121212;
  color: #ffffff;
}

.logo {
  height: 40px;
}

.search {
  width: 100%;
  max-width: 400px;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.toggle-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Responsivo */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .center {
    margin: 0.5rem 0;
  }

  .left, .right {
    justify-content: center;
  }
}
</style>
