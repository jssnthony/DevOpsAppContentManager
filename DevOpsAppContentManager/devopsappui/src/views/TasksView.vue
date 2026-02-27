<template>
  <section class="tasks">
    <header class="tasks-header">
      <div>
        <h1 class="title-main">Tareas</h1>
        <p>Gestión de tareas del sistema</p>
      </div>
    </header>

    <div class="empty">
      Módulo de tareas en construcción 🚧
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.tasks {
  padding: 1rem;
}

.tasks-header {
  margin-bottom: 1rem;
}

.tasks-header h1 {
  font-size: 1.4rem;
}

.tasks-header p {
  color: var(--text-muted);
}

.empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 12px;
  background: rgba(255,255,255,0.02);
}
</style>
