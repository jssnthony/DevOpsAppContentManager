<template>
  <section class="create">
    <header class="create-header">
      <div>
        <h1 class="title-main">Nuevo proyecto</h1>
        <p>Agrega un proyecto al catálogo</p>
      </div>

      <div class="actions">
        <button class="btn ghost" type="button" @click="goBack" :disabled="saving">
          Cancelar
        </button>
        <button class="btn primary" type="button" @click="submit" :disabled="!canSubmit">
          {{ saving ? "Guardando…" : "Guardar" }}
        </button>
      </div>
    </header>

    <div v-if="error" class="state error">{{ error }}</div>

    <form class="card" @submit.prevent="submit">
      <div class="grid">
        <label class="field">
          <span class="label">Título <span class="req">*</span></span>
          <input v-model.trim="form.title"
                 class="input"
                 type="text"
                 placeholder="Ej. DevOpsApp"
                 :disabled="saving" />
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
                 :disabled="saving" />
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
        <div class="muted">* Campos requeridos</div>
        <button class="btn primary" type="submit" :disabled="!canSubmit">
          {{ saving ? "Guardando…" : "Guardar proyecto" }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { insertProject, type ProjectDtoToInsert } from "@/services/projects.services";

const router = useRouter();

const form = reactive<ProjectDtoToInsert>({
  title: "",
  description: "",
  repository: "",
});

const saving = ref(false);
const error = ref<string | null>(null);
const touched = ref(false);

function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const canSubmit = computed(() => {
  const titleOk = form.title.trim().length > 0;
  const repoOk = !form.repository || isValidUrl(form.repository);
  return titleOk && repoOk && !saving.value;
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
    const payload: ProjectDtoToInsert = {
      title: form.title.trim(),
      description: form.description?.trim() || null,
      repository: form.repository?.trim() || null,
    };

    const created = await insertProject(payload);

    // si todavía no tienes /projects/:id, mándalo a la lista:
    router.push("/projects");

    // (si ya tienes detalle) descomenta:
    // router.push(`/projects/${created.id}`);
  } catch (e: any) {
    error.value = e?.message ?? "Error insertando el proyecto";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
  .create {
    padding: 1rem;
  }

  .create-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

    .create-header h1 {
      font-size: 1.4rem;
    }

    .create-header p {
      color: var(--text-muted);
    }

  .actions {
    display: flex;
    gap: 0.6rem;
  }

  .state {
    padding: 0.8rem 1rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    background: rgba(255,255,255,0.03);
    color: var(--text-secondary);
  }

    .state.error {
      background: rgba(239, 68, 68, 0.12);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.22);
    }

  .card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
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

  .muted {
    color: var(--text-muted);
    font-size: 0.85rem;
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
    .create-header {
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
