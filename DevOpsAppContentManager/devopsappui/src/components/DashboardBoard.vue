<template>
  <section class="board">
    <DashboardCard v-for="card in cards"
                   :key="card.id"
                   :title="card.title"
                   :description="card.description"
                   :badge="card.badge"
                   :meta="card.meta"
                   :to="card.to"
                   :loading="card.loading" />

    <DashboardCard v-for="card in cards"
                   :key="card.id"
                   :title="card.title"
                   :description="card.description"
                   :badge="card.badge"
                   :meta="card.meta"
                   :to="card.to"
                   :loading="card.loading" />

    <DashboardCard v-for="card in cards"
                   :key="card.id"
                   :title="card.title"
                   :description="card.description"
                   :badge="card.badge"
                   :meta="card.meta"
                   :to="card.to"
                   :loading="card.loading" />

    <DashboardCard v-for="card in cards"
                   :key="card.id"
                   :title="card.title"
                   :description="card.description"
                   :badge="card.badge"
                   :meta="card.meta"
                   :to="card.to"
                   :loading="card.loading" />
  </section>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import DashboardCard from "./DashboardCard.vue";

// aquí defines "qué tarjetas existen"
const cards = reactive([
  {
    id: "projects",
    title: "Proyectos",
    description: "Ver la lista de proyectos y entrar a cada uno.",
    badge: "Core",
    meta: "",          // aquí luego pones "12 proyectos"
    to: "/projects",
    loading: false,
    // load opcional, para traer stats de endpoints
    load: null,
  },
]);

onMounted(async () => {
  // en el futuro: cards[i].load() para traer conteos
});
</script>

<style scoped>
  .board {
    display: grid;
    gap: 6rem;
    padding: 3rem;
    /* Desktop */
    grid-template-columns: repeat(3, 1fr);
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .board {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Mobile */
  @media (max-width: 640px) {
    .board {
      grid-template-columns: 1fr;
    }
  }

</style>
