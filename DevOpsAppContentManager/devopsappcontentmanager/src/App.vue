<script setup lang="ts">
  import CustomHeader from './components/CustomHeader.vue'
</script>

<template>
  <CustomHeader />

  <main>
    
  </main>
</template>

<style scoped>

.logo {
  display: block;
  margin: 0 auto 2rem;
}

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

</style>
