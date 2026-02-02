<template>
  <RouterLink class="card" :to="to">
    <div class="top">
      <div class="titleWrap">
        <h3 class="title">{{ title }}</h3>
        <span v-if="badge" class="badge">{{ badge }}</span>
      </div>

      <div v-if="loading" class="pill">Cargando…</div>
      <div v-else-if="meta" class="pill">{{ meta }}</div>
    </div>

    <p class="desc">{{ description }}</p>

    <div class="bottom">
      <span class="cta">Abrir →</span>
    </div>
  </RouterLink>
</template>

<script setup>
  defineProps({
    title: String,
    description: String,
    badge: String,
    meta: String,
    to: { type: [String, Object], required: true },
    loading: Boolean,
  });
</script>

<style scoped>
  .card {
    display: block;
    padding: 1rem;
    border-radius: 14px;
    background: var(--bg-card);
    color: var(--text-main);
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.08);
    transition: transform 0.12s ease, border-color 0.12s ease;
  }

    .card:hover {
      transform: translateY(-2px);
      border-color: rgba(56,189,248,0.35); /* usa tu primary */
    }

  .top {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .titleWrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .title {
    font-size: 1.05rem;
  }

  .badge {
    font-size: 0.75rem;
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    background: rgba(56,189,248,0.16);
    color: var(--text-secondary);
    border: 1px solid rgba(56,189,248,0.25);
  }

  .pill {
    font-size: 0.8rem;
    padding: 0.25rem 0.55rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .desc {
    margin-top: 0.6rem;
    color: var(--text-secondary);
    font-size: 0.92rem;
  }

  .bottom {
    margin-top: 0.9rem;
    display: flex;
    justify-content: flex-end;
  }

  .cta {
    color: var(--primary);
    font-weight: 600;
  }
</style>
