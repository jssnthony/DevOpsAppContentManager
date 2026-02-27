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
  import { getProjectsStats } from "@/services/projects.services";

  const cards = reactive([
    {
      id: "projects",
      title: "Proyectos",
      description: "Ver la lista de proyectos y entrar a cada uno.",
      badge: "Core",
      meta: "—",
      to: "/projects",
      loading: true,
      variant: "navy",
      load: async () => {
        const stats = await getProjectsStats();
        return `${stats.totalItems} Proyectos`;
      },
    },
    {
      id: "tasks",
      title: "Tareas",
      description: "Administrar tareas por proyecto y seguimiento del trabajo.",
      badge: "Workflow",
      meta: "0 Tareas",
      to: "/tasks",
      loading: false,
      variant: "gold",
      load: null,
    },
    {
      id: "cards",
      title: "Colección de Cartas",
      description: "Inventario por juego, rareza y número de copias.",
      badge: "Inventory",
      meta: "0 cartas",
      to: "/cards",
      loading: false,
      variant: "scarlet",
      load: null,
    },
  ]);

  onMounted(async () => {
    // ejecuta loaders de todas las cards que tengan load
    await Promise.all(
      cards.map(async (c) => {
        if (!c.load) return;
        try {
          c.loading = true;
          c.meta = await c.load();
        } catch (e) {
          console.error(`Error loading ${c.id} stats`, e);
          c.meta = "—";
        } finally {
          c.loading = false;
        }
      })
    );
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
