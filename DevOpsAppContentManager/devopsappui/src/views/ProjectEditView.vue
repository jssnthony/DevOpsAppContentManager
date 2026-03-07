<template>
  <section class="edit">
    <header class="edit-header">
      <div>
        <h1 class="title-main">Editar proyecto</h1>
        <p v-if="projectId" class="muted">ID: {{ projectId }}</p>
      </div>

      <div class="actions">
        <button class="btn ghost" type="button" @click="goBack" :disabled="saving || taskSaving">
          Volver
        </button>
        <button class="btn primary" type="button" @click="submit" :disabled="!canSubmit">
          {{ saving ? "Guardando…" : "Guardar cambios" }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="state">Cargando proyecto…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <template v-else>
      <form class="card" @submit.prevent="submit">
        <div class="grid">
          <label class="field">
            <span class="label">Título <span class="req">*</span></span>
            <input v-model.trim="form.title"
                   class="input"
                   type="text"
                   placeholder="Ej. DevOpsApp"
                   :disabled="saving"
                   @blur="touched = true" />
            <span v-if="touched && !form.title" class="hint error">
              El título es obligatorio.
            </span>
          </label>

          <label class="field">
            <span class="label">Repositorio</span>
            <input v-model.trim="form.repository"
                   class="input"
                   type="url"
                   placeholder="https://github.com/…"
                   :disabled="saving"
                   @blur="touched = true" />
            <span v-if="touched && form.repository && !isValidUrl(form.repository)" class="hint error">
              El repositorio debe ser una URL válida (http/https).
            </span>
          </label>

          <label class="field full">
            <span class="label">Descripción</span>
            <textarea v-model.trim="form.description"
                      class="textarea"
                      rows="4"
                      placeholder="¿De qué trata este proyecto?"
                      :disabled="saving" />
          </label>
        </div>

        <div class="footer">
          <div class="muted">
            <span v-if="!isDirty">Sin cambios</span>
            <span v-else>Cambios pendientes</span>
          </div>

          <button class="btn primary" type="submit" :disabled="!canSubmit">
            {{ saving ? "Guardando…" : "Guardar cambios" }}
          </button>
        </div>
      </form>

      <!-- PANEL DE TAREAS -->
      <section class="card tasks-panel">
        <header class="tasks-header">
          <div>
            <h2 class="section-title">Tareas del proyecto</h2>
            <p class="muted">Administra las tareas relacionadas con este proyecto</p>
          </div>

          <div class="actions">
            <button class="btn ghost"
                    type="button"
                    @click="showTaskForm = !showTaskForm"
                    :disabled="taskSaving">
              {{ showTaskForm ? "Cerrar" : "Nueva tarea" }}
            </button>
          </div>
        </header>

        <div v-if="taskError" class="state error compact">{{ taskError }}</div>

        <form v-if="showTaskForm"
              class="task-create"
              @submit.prevent="submitTask">
          <div class="grid">
            <label class="field">
              <span class="label">Título <span class="req">*</span></span>
              <input v-model.trim="taskForm.title"
                     class="input"
                     type="text"
                     placeholder="Ej. Crear endpoint de tareas"
                     :disabled="taskSaving" />
              <span v-if="taskTouched && !taskForm.title" class="hint error">
                El título es obligatorio.
              </span>
            </label>

            <div class="field">
              <span class="label">Proyecto</span>
              <input :value="form.title || 'Proyecto actual'"
                     class="input"
                     type="text"
                     disabled />
            </div>

            <label class="field full">
              <span class="label">Descripción</span>
              <textarea v-model.trim="taskForm.description"
                        class="textarea"
                        rows="4"
                        placeholder="¿Qué se necesita hacer en esta tarea?"
                        :disabled="taskSaving" />
            </label>
          </div>

          <div class="footer">
            <div class="muted">La tarea se agregará a este proyecto</div>
            <button class="btn primary" type="submit" :disabled="!canSubmitTask">
              {{ taskSaving ? "Guardando…" : "Guardar tarea" }}
            </button>
          </div>
        </form>

        <div v-if="tasksLoading" class="state compact">
          Cargando tareas…
        </div>

        <div v-else-if="tasks.length === 0" class="empty">
          Este proyecto todavía no tiene tareas.
        </div>

        <div v-else class="tasks-list">
          <article v-for="task in tasks" :key="task.taskId" class="task-item">
            <div class="task-main">
              <div class="task-top">
                <h3 class="task-title">{{ task.taskTitle }}</h3>
                <span class="status-badge" :class="statusClass(task.taskProgressStatus)">
                  {{ statusText(task.taskProgressStatus) }}
                </span>
              </div>

              <p v-if="task.taskDescription" class="task-description">
                {{ task.taskDescription }}
              </p>

              <div class="task-meta">
                <span>Prioridad: {{ task.taskPriority ?? 0 }}</span>
                <span>Actualizada: {{ formatDate(task.taskUpdatedAt) }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    getProjectById,
    updateProject,
    type ProjectDtoToUpdate
  } from "@/services/projects.services";
  import {
    getAllTasks,
    insertTask,
    type ProjectTaskDtoToInsert,
    type ProjectTaskRowDto
  } from "@/services/projectsTasks.services";

  const route = useRoute();
  const router = useRouter();

  const projectId = computed(() => String(route.params.id || ""));

  const loading = ref(true);
  const saving = ref(false);
  const error = ref<string | null>(null);
  const touched = ref(false);

  // snapshot del original para detectar "dirty"
  const original = ref<ProjectDtoToUpdate | null>(null);

  const form = reactive<ProjectDtoToUpdate>({
    title: "",
    description: "",
    repository: "",
    id: "0"
  });

  // tareas
  const tasks = ref<ProjectTaskRowDto[]>([]);
  const tasksLoading = ref(false);
  const taskSaving = ref(false);
  const taskError = ref<string | null>(null);
  const taskTouched = ref(false);
  const showTaskForm = ref(false);

  const taskForm = reactive<ProjectTaskDtoToInsert>({
    title: "",
    description: ""
  });

  function isValidUrl(value: string) {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  const isDirty = computed(() => {
    if (!original.value) return false;

    return (
      (form.title ?? "") !== (original.value.title ?? "") ||
      (form.description ?? "") !== (original.value.description ?? "") ||
      (form.repository ?? "") !== (original.value.repository ?? "")
    );
  });

  const canSubmit = computed(() => {
    const titleOk = (form.title ?? "").trim().length > 0;
    const repoOk = !form.repository || isValidUrl(form.repository);
    return titleOk && repoOk && isDirty.value && !saving.value && !loading.value;
  });

  const canSubmitTask = computed(() => {
    const titleOk = (taskForm.title ?? "").trim().length > 0;
    return titleOk && !taskSaving.value && !loading.value;
  });

  function goBack() {
    router.push("/projects");
  }

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
    tasksLoading.value = true;
    taskError.value = null;

    try {
      const allTasks = await getAllTasks();

      tasks.value = allTasks
        .filter(x => x.projectId === projectId.value)
        .sort((a, b) => {
          const priorityDiff = (b.taskPriority ?? 0) - (a.taskPriority ?? 0);
          if (priorityDiff !== 0) return priorityDiff;

          return new Date(b.taskUpdatedAt ?? 0).getTime() - new Date(a.taskUpdatedAt ?? 0).getTime();
        });
    } catch (e: any) {
      taskError.value = e?.message ?? "No se pudieron cargar las tareas";
    } finally {
      tasksLoading.value = false;
    }
  }

  async function submit() {
    touched.value = true;
    error.value = null;

    if (!canSubmit.value) return;

    saving.value = true;
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || null,
        repository: form.repository?.trim() || null,
      };

      const updated = await updateProject(projectId.value, payload);

      original.value = {
        title: updated.title ?? "",
        description: updated.description ?? "",
        repository: updated.repository ?? "",
        id: updated.id
      };
    } catch (e: any) {
      error.value = e?.message ?? "Error actualizando el proyecto";
    } finally {
      saving.value = false;
    }
  }

  async function submitTask() {
    taskTouched.value = true;
    taskError.value = null;

    if (!canSubmitTask.value) return;

    taskSaving.value = true;

    try {
      const payload: ProjectTaskDtoToInsert = {
        title: taskForm.title.trim(),
        description: taskForm.description?.trim() || null
      };

      await insertTask(projectId.value, payload);

      taskForm.title = "";
      taskForm.description = "";
      taskTouched.value = false;
      showTaskForm.value = false;

      await loadTasks();
    } catch (e: any) {
      taskError.value = e?.message ?? "Error insertando la tarea";
    } finally {
      taskSaving.value = false;
    }
  }

  onMounted(async () => {
    loading.value = true;
    error.value = null;

    try {
      const p = await getProjectById(projectId.value);

      form.title = p.title ?? "";
      form.description = p.description ?? "";
      form.repository = p.repository ?? "";
      form.id = p.id ?? projectId.value;

      original.value = {
        title: form.title,
        description: form.description,
        repository: form.repository,
        id: form.id
      };

      await loadTasks();
    } catch (e: any) {
      error.value = e?.message ?? "No se pudo cargar el proyecto";
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .edit {
    padding: 1rem;
  }

  .edit-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

    .edit-header h1 {
      font-size: 1.4rem;
    }

  .muted {
    color: var(--text-muted);
  }

  .actions {
    display: flex;
    gap: 0.6rem;
  }

  .state {
    padding: 2rem;
    text-align: center;
    color: var(--text-secondary);
  }

    .state.compact {
      padding: 0.8rem 1rem;
      text-align: left;
      border-radius: 12px;
      margin-bottom: 1rem;
      background: rgba(255,255,255,0.03);
    }

    .state.error {
      color: var(--error);
    }

    .state.compact.error {
      background: rgba(239, 68, 68, 0.12);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.22);
    }

  .card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(255,255,255,0.02);
    padding: 1rem;
  }

  .tasks-panel {
    margin-top: 1rem;
  }

  .tasks-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .section-title {
    color: white;
    font-size: 1.1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.9rem;
  }

  .field {
    display: grid;
    gap: 0.4rem;
  }

    .field.full {
      grid-column: 1 / -1;
    }

  .label {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .req {
    color: var(--error);
    font-weight: 800;
  }

  .input, .textarea {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: var(--bg-secondary);
    color: var(--text-main);
    outline: none;
  }

  .textarea {
    resize: vertical;
    min-height: 110px;
  }

  .hint {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

    .hint.error {
      color: var(--error);
    }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.08);
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

    .btn.primary {
      border-color: rgba(56,189,248,0.35);
      background: rgba(56,189,248,0.12);
    }

    .btn.ghost {
      background: transparent;
    }

  .empty {
    padding: 1rem;
    text-align: center;
    color: var(--text-muted);
    border: 1px dashed rgba(255,255,255,0.12);
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
  }

  .task-create {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    background: rgba(255,255,255,0.015);
  }

  .tasks-list {
    display: grid;
    gap: 0.8rem;
  }

  .task-item {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    padding: 0.9rem;
  }

  .task-main {
    display: grid;
    gap: 0.5rem;
  }

  .task-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .task-title {
    margin: 0;
    font-size: 1rem;
    color: white;
  }

  .task-description {
    margin: 0;
    color: var(--text-secondary);
  }

  .task-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.82rem;
    color: var(--text-muted);
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

  @media (max-width: 768px) {
    .edit-header,
    .tasks-header {
      flex-direction: column;
      align-items: stretch;
    }

    .actions {
      justify-content: flex-end;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .footer {
      flex-direction: column;
      align-items: stretch;
    }

    .task-top {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
