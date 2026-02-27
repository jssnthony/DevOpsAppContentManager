<template>
  <section class="board">
    <DashboardCard v-for="card in cards"
                   :key="card.id"
                   :title="card.title"
                   :description="card.description"
                   :badge="card.badge"
                   :meta="card.meta"
                   :to="card.to"
                   :loading="card.loading"
                   :variant="card.variant" />
    
  </section>
</template>

<script setup>
  import { reactive, onMounted } from "vue";
  import DashboardCard from "./DashboardCard.vue";

  // tarjetas del dashboard (core modules)
  const cards = reactive([
    {
      id: "projects",
      title: "Proyectos",
      description: "Ver la lista de proyectos y entrar a cada uno.",
      badge: "Core",
      meta: "",
      to: "/projects",
      loading: false,
      variant: "navy",
    },
    {
      id: "tasks",
      title: "Tareas",
      description: "Administrar tareas por proyecto y seguimiento del trabajo.",
      badge: "Workflow",
      meta: "", // después aquí puedes poner "34 tareas activas"
      to: "/tasks", // ruta futura
      loading: false,
      load: null,
      variant: "gold",
    },
    {
      id: "cards",
      title: "Colección de Cartas",
      description: "Inventario por juego, rareza y número de copias.",
      badge: "Inventory",
      meta: "0 cartas", // luego lo cargas del API
      to: "/cards",
      loading: false,
      variant: "scarlet",
    },
  ]);

  onMounted(async () => {
    // después podemos cargar stats:
    // ej: cards.find(c => c.id === "tasks").meta = "12 tareas";
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
