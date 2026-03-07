<template>
  <section class="tasks">
    <header class="tasks-header">
      <div>
        <h1 class="title-main">Tareas</h1>
        <p>Gestión de tareas del sistema</p>
      </div>

      <div class="actions">
        <button class="btn ghost" type="button" @click="loadTasks" :disabled="loading">
          {{ loading ? "Recargando…" : "Recargar" }}
        </button>
      </div>
    </header>

    <div class="toolbar card">
      <div class="toolbar-grid">
        <label class="field">
          <span class="label">Buscar</span>
          <input v-model.trim="search"
                 class="input"
                 type="text"
                 placeholder="Buscar por tarea o proyecto" />
        </label>

        <label class="field">
          <span class="label">Estado</span>
          <select v-model="statusFilter" class="input">
            <option value="">Todos</option>
            <option value="0">Idea</option>
            <option value="1">To Do</option>
            <option value="2">In Progress</option>
            <option value="3">Blocked</option>
            <option value="4">Done</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Mostrar archivados</span>
          <select v-model="showArchived" class="input">
            <option :value="false">No</option>
            <option :value="true">Sí</option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="error" class="state error">
      {{ error }}
    </div>

    <div v-else-if="loading" class="state">
      Cargando tareas…
    </div>

    <div v-else-if="filteredTasks.length === 0" class="empty">
      No se encontraron tareas.
    </div>

    <div v-else class="card table-card">
      <div class="table-wrap">
        <table class="tasks-table">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Proyecto</th>
              <th>Repositorio</th>
              <th>Actualizada</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="task in filteredTasks" :key="task.taskId">
              <td>
                <div class="task-cell">
                  <div class="task-title">{{ task.taskTitle }}</div>
                  <div v-if="task.taskDescription" class="task-description">
                    {{ task.taskDescription }}
                  </div>
                </div>
              </td>

              <td>
                <span class="status-badge" :class="statusClass(task.taskProgressStatus)">
                  {{ statusText(task.taskProgressStatus) }}
                </span>
              </td>

              <td>
                <div class="priority-stack">
                  <span class="priority-chip">
                    T: {{ task.taskPriority ?? 0 }}
                  </span>
                  <span class="priority-chip subtle">
                    P: {{ task.projectPriority ?? 0 }}
                  </span>
                </div>
              </td>

              <td>
                <div class="project-cell">
                  <router-link class="project-link"
                               :to="`/projects/${task.projectId}`">
                    {{ task.projectTitle }}
                  </router-link>
                </div>
              </td>

              <td>
                <a v-if="task.projectRepository"
                   class="repo-link"
                   :href="task.projectRepository"
                   target="_blank"
                   rel="noopener noreferrer">
                  Abrir
                </a>
                <span v-else class="muted">—</span>
              </td>

              <td>
                <span class="muted">{{ formatDate(task.taskUpdatedAt) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { getAllTasks, type ProjectTaskRowDto } from "@/services/projectsTasks.services";

  const loading = ref(true);
  const error = ref<string | null>(null);
  const tasks = ref<ProjectTaskRowDto[]>([]);

  const search = ref("");
  const statusFilter = ref("");
  const showArchived = ref(false);

  function statusText(status: number) {
    switch (status) {
      case 0: return "Idea";
      case 1: return "To Do";
      case 2: return "In Progress";
      case 3: return "Blocked";
      case 4: return "Done";
      default: return "Unknown";
    }
  }

  function statusClass(status: number) {
    switch (status) {
      case 0: return "idea";
      case 1: return "todo";
      case 2: return "progress";
      case 3: return "blocked";
      case 4: return "done";
      default: return "default";
    }
  }

  function formatDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString();
  }

  async function loadTasks() {
    loading.value = true;
    error.value = null;

    try {
      const data = await getAllTasks();

      tasks.value = [...data].sort((a, b) => {
        const projectPriorityDiff = (b.projectPriority ?? 0) - (a.projectPriority ?? 0);
        if (projectPriorityDiff !== 0) return projectPriorityDiff;

        const taskPriorityDiff = (b.taskPriority ?? 0) - (a.taskPriority ?? 0);
        if (taskPriorityDiff !== 0) return taskPriorityDiff;

        return new Date(b.taskUpdatedAt ?? 0).getTime() - new Date(a.taskUpdatedAt ?? 0).getTime();
      });
    } catch (e: any) {
      error.value = e?.message ?? "No se pudieron cargar las tareas";
    } finally {
      loading.value = false;
    }
  }

  const filteredTasks = computed(() => {
    const text = search.value.trim().toLowerCase();

    return tasks.value.filter((task) => {
      const matchesSearch =
        !text ||
        (task.taskTitle ?? "").toLowerCase().includes(text) ||
        (task.taskDescription ?? "").toLowerCase().includes(text) ||
        (task.projectTitle ?? "").toLowerCase().includes(text);

      const matchesStatus =
        statusFilter.value === "" ||
        String(task.taskProgressStatus) === statusFilter.value;

      const matchesArchived =
        showArchived.value || !task.projectIsArchive;

      return matchesSearch && matchesStatus && matchesArchived;
    });
  });

  onMounted(loadTasks);
</script>

<style scoped>
  .tasks {
    padding: 1rem;
  }

  .tasks-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

    .tasks-header h1 {
      font-size: 1.4rem;
    }

    .tasks-header p {
      color: var(--text-muted);
    }

  .actions {
    display: flex;
    gap: 0.6rem;
  }

  .card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    background: rgba(255,255,255,0.02);
    padding: 1rem;
  }

  .toolbar {
    margin-bottom: 1rem;
  }

  .toolbar-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 0.9rem;
  }

  .field {
    display: grid;
    gap: 0.4rem;
  }

  .label {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .input {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: var(--bg-secondary);
    color: var(--text-main);
    outline: none;
  }

  .state {
    padding: 2rem;
    text-align: center;
    color: var(--text-secondary);
  }

    .state.error {
      padding: 0.8rem 1rem;
      text-align: left;
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.22);
      background: rgba(239, 68, 68, 0.12);
      border-radius: 12px;
      margin-bottom: 1rem;
    }

  .empty {
    padding: 2rem;
    text-align: center;
    color: var(--text-muted);
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
  }

  .table-card {
    padding: 0;
    overflow: hidden;
  }

  .table-wrap {
    overflow-x: auto;
  }

  .tasks-table {
    width: 100%;
    border-collapse: collapse;
  }

    .tasks-table th,
    .tasks-table td {
      padding: 0.9rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      vertical-align: top;
    }

    .tasks-table th {
      font-size: 0.82rem;
      color: var(--text-muted);
      font-weight: 700;
      background: rgba(255,255,255,0.02);
    }

  .task-cell {
    display: grid;
    gap: 0.25rem;
    min-width: 240px;
  }

  .task-title {
    font-weight: 700;
    color: var(--text-main);
  }

  .task-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .project-cell {
    min-width: 180px;
  }

  .project-link {
    color: var(--text-main);
    text-decoration: none;
    font-weight: 700;
  }

    .project-link:hover {
      text-decoration: underline;
    }

  .repo-link {
    color: rgb(56,189,248);
    text-decoration: none;
    font-weight: 700;
  }

    .repo-link:hover {
      text-decoration: underline;
    }

  .priority-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    min-width: 100px;
  }

  .priority-chip {
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
  }

    .priority-chip.subtle {
      opacity: 0.8;
    }

  .status-badge {
    padding: 0.25rem 0.55rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    white-space: nowrap;
    border: 1px solid rgba(255,255,255,0.08);
  }

    .status-badge.idea {
      background: rgba(148, 163, 184, 0.12);
    }

    .status-badge.todo {
      background: rgba(59, 130, 246, 0.12);
    }

    .status-badge.progress {
      background: rgba(245, 158, 11, 0.12);
    }

    .status-badge.blocked {
      background: rgba(239, 68, 68, 0.12);
    }

    .status-badge.done {
      background: rgba(34, 197, 94, 0.12);
    }

  .muted {
    color: var(--text-muted);
  }

  .btn {
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.02);
    color: var(--text-main);
    cursor: pointer;
    font-weight: 700;
  }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn.ghost {
      background: transparent;
    }

  @media (max-width: 768px) {
    .tasks-header {
      flex-direction: column;
      align-items: stretch;
    }

    .actions {
      justify-content: flex-end;
    }

    .toolbar-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
