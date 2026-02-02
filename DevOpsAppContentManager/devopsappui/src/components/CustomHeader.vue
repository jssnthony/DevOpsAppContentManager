<template>
  <header :class="['header', { dark: isDarkMode }]">
    <div class="left">
      <p class="font-200">VicHub</p>
    </div>
    <div class="center">
      <input type="text" placeholder="Buscar..." class="search" />
    </div>
    <div class="right">
     ased
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
</script>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    color: #fff;
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

    .left, .right {
      justify-content: center;
    }
  }
</style>
