<template>
  <RouterLink :class="['card', `card--${variant}`]" :to="to">
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
    variant: {
      type: String,
      default: "default", // default | scarlet
    },
  });
</script>

<style scoped>
  .card {
    display: block;
    padding: 1rem;
    border-radius: 14px;
    color: var(--text-main);
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.08);
    transition: transform 0.12s ease, border-color 0.12s ease;
    position: relative;
    overflow: hidden;
  }

    .card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 60%);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .card:hover::after {
      opacity: 1;
    }

    .card:hover {
      transform: translateY(-2px);
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
    border: 1px solid;
  }

  .pill {
    font-size: 0.8rem;
    padding: 0.25rem 0.55rem;
    border-radius: 999px;
    white-space: nowrap;
  }

  .desc {
    margin-top: 0.6rem;
    font-size: 0.92rem;
  }

  .bottom {
    margin-top: 0.9rem;
    display: flex;
    justify-content: flex-end;
  }

  .cta {
    font-weight: 600;
  }
</style>
