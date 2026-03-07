<template>
  <section class="projects">
    <header class="projects-header">
      <div>
        <h1 class="title-main">Proyectos</h1>
        <p>Catálogo de proyectos disponibles</p>
      </div>

      <input v-model="query"
             class="search"
             type="text"
             placeholder="Recherche par titre ou description…" />
      <button class="btn primary" type="button" @click="router.push('/projects/new')">
        + Nuevo
      </button>
       
    </header>


    <div v-if="loading" class="state">Cargando proyectos…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <div v-else class="list">
      <div class="list-head">
        <span>Título</span>
        <span>Descripción</span>
        <span>Repositorio</span>
      </div>

      <div v-for="p in filtered"
              :key="p.id"
              class="row"
              @click="goToProject(p.id)"
              title="Abrir proyecto">
        <div class="cell title">
          <div class="main">{{ p.title || "(Sin título)" }}</div>
          <div class="sub">ID: {{ p.id }}</div>
        </div>

        <div class="cell desc">
          {{ p.description || "—" }}
        </div>

        <div class="cell repo">
          <a v-if="p.repository"
             :href="p.repository"
             target="_blank"
             rel="noreferrer"
             class="repoLink"
             @click.stop>
            → Abrir Repositorio
          </a>
          <span v-else class="muted">—</span>
        </div>
      </div>

      
      <div v-if="filtered.length === 0" class="empty">
        No hay proyectos que coincidan con tu búsqueda.
      </div>
    </div>
</section>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import { getProjects, type Project } from "@/services/projects.services";

  const router = useRouter();

  const projects = ref<Project[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const query = ref("");

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return projects.value;

    return projects.value.filter((p) => {
      const t = (p.title ?? "").toLowerCase();
      const d = (p.description ?? "").toLowerCase();
      return t.includes(q) || d.includes(q);
    });
  });

  function goToCreateTask(projectId: string) {
    router.push(`/projects/${projectId}/tasks/create`);
  }

  function goToProject(id: string) {
    // listo para cuando crees /projects/:id
    router.push(`/projects/${id}`);
  }

  onMounted(async () => {
    try {
      projects.value = await getProjects();
    } catch (e) {
      error.value = "No se pudieron cargar los proyectos";
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .projects {
    padding: 1rem;
  }

  .projects-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

    .projects-header h1 {
      font-size: 1.4rem;
    }

    .projects-header p {
      color: var(--text-muted);
    }

  .search {
    width: min(420px, 100%);
    padding: 0.55rem 0.8rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: var(--bg-secondary);
    color: var(--text-main);
  }

    .search::placeholder {
      color: var(--text-muted);
    }

  .state {
    padding: 2rem;
    text-align: center;
    color: var(--text-secondary);
  }

    .state.error {
      color: var(--error);
    }

  .list {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(255,255,255,0.02);
  }

  .list-head {
    display: grid;
    grid-template-columns: 1.2fr 2fr 0.8fr;
    gap: 1rem;
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    background: rgba(255,255,255,0.04);
  }

  .row {
    width: 100%;
    display: grid;
    grid-template-columns: 1.2fr 2fr 0.8fr;
    gap: 1rem;
    padding: 0.9rem 1rem;
    text-align: left;
    background: transparent;
    border: none;
    border-top: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    color: var(--text-main);
    transition: background 0.12s ease, transform 0.12s ease;
  }

    .row:hover {
      background: rgba(56,189,248,0.06);
    }

  .cell {
    min-width: 0;
  }

  .title .main {
    font-weight: 700;
  }

  .title .sub {
    margin-top: 0.2rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .desc {
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 2 líneas */
    -webkit-box-orient: vertical;
  }

  .repoLink {
    color: var(--primary);
    font-weight: 700;
    text-decoration: none;
  }

  .muted {
    color: var(--text-muted);
  }

  .empty {
    padding: 1rem;
    color: var(--text-muted);
    text-align: center;
  }

  /* Responsive: en móvil colapsa columnas */
  @media (max-width: 768px) {
    .projects-header {
      flex-direction: column;
      align-items: stretch;
    }

    .list-head {
      display: none;
    }

    .row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .repo {
      justify-content: flex-start;
    }
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
</style>
