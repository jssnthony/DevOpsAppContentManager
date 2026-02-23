<template>
  <section class="edit">
    <header class="edit-header">
      <div>
        <h1 class="title-main">Editar proyecto</h1>
        <p v-if="projectId" class="muted">ID: {{ projectId }}</p>
      </div>

      <div class="actions">
        <button class="btn ghost" type="button" @click="goBack" :disabled="saving">
          Volver
        </button>
        <button class="btn primary" type="button" @click="submit" :disabled="!canSubmit">
          {{ saving ? "Guardando…" : "Guardar cambios" }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="state">Cargando proyecto…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <form v-else class="card" @submit.prevent="submit">
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
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProjectById, updateProject, type ProjectDtoToUpdate } from "@/services/projects.services";

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

function goBack() {
  router.push("/projects");
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

    // refresca snapshot para que quede "Sin cambios"
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

onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    const p = await getProjectById(projectId.value);

    form.title = p.title ?? "";
    form.description = p.description ?? "";
    form.repository = p.repository ?? "";

    original.value = {
      title: form.title,
      description: form.description,
      repository: form.repository,
      id: form.id
    };
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

    .state.error {
      color: var(--error);
    }

  .card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(255,255,255,0.02);
    padding: 1rem;
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

  @media (max-width: 768px) {
    .edit-header {
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
  }
</style>
