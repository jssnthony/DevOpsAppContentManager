<template>
  <section class="view">
    <!-- HERO / ICON SLOT (200px) -->
    <div class="hero">
      <div class="heroInner">
        <img v-if="heroIconUrl" :src="heroIconUrl" class="heroIcon" alt="Game icon" />
        <div v-else class="heroPlaceholder">
          <div class="heroTitle">Colección TCG</div>
          <div class="heroSub">Espacio para icono/imagen del juego (200px)</div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <header class="header">
      <div>
        <h1 class="title">Colección de Cartas</h1>
        <p class="subtitle">Inventario por juego, rareza y número de copias.</p>
      </div>

      <div class="actions">
        <input v-model="search" class="search" placeholder="Buscar..." />
        <select v-model="gameFilter" class="select">
          <option value="">Todos los juegos</option>
          <option v-for="g in games" :key="g" :value="g">{{ g }}</option>
        </select>

        <RouterLink class="btn btn-scarlet" to="/cards/new">+ Agregar</RouterLink>
      </div>
    </header>

    <!-- Table -->
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Juego</th>
            <th>Rareza</th>
            <th class="num">Copias</th>
            <th>Set</th>
            <th class="actionsCol"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="state">Cargando cartas…</td>
          </tr>

          <tr v-else-if="filtered.length === 0">
            <td colspan="6" class="state">No hay cartas aún.</td>
          </tr>

          <tr v-for="c in filtered" :key="c.id">
            <td class="name">{{ c.name }}</td>

            <td>
              <span class="chip chip-navy">{{ c.game }}</span>
            </td>

            <td>
              <span :class="['chip', rarityClass(c.rarity)]">{{ c.rarity }}</span>
            </td>

            <td class="num strong">{{ c.quantity }}</td>

            <td class="muted">
              {{ c.setCode || "—" }} <span v-if="c.cardNumber">· {{ c.cardNumber }}</span>
            </td>

            <td class="actionsCol">
              <RouterLink class="link" :to="`/cards/${c.id}`">Ver</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { getTcgCards } from "@/services/tcgCards.service";

  export type TcgCardListItem = {
    id: number;
    name: string;
    game: string;
    rarity: string;
    quantity: number;
    setCode?: string | null;
    cardNumber?: string | null;
  };

  const loading = ref(true);
  const items = ref<TcgCardListItem[]>([]);

  const search = ref("");
  const gameFilter = ref("");

  const games = computed(() => {
    const set = new Set(items.value.map((x) => x.game).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();
    return items.value.filter((x) => {
      const okGame = !gameFilter.value || x.game === gameFilter.value;
      const okTerm =
        !term ||
        x.name.toLowerCase().includes(term) ||
        (x.setCode ?? "").toLowerCase().includes(term) ||
        (x.rarity ?? "").toLowerCase().includes(term);
      return okGame && okTerm;
    });
  });

  // HERO ICON: si eliges un juego en el filtro, se muestra su icono
  const heroIconUrl = computed(() => {
    const game = gameFilter.value.trim().toLowerCase();
    if (!game) return "";

    // Tú luego pones tus imágenes reales
    if (game.includes("pokemon")) return "/assets/games/pokemon.png";
    if (game.includes("yu-gi-oh")) return "/assets/games/yugioh.png";
    if (game.includes("mtg") || game.includes("magic")) return "/assets/games/mtg.png";
    if (game.includes("one piece")) return "/assets/games/onepiece.png";
    return "";
  });

  function rarityClass(rarity: string) {
    const r = (rarity || "").toLowerCase();
    if (r.includes("common")) return "chip-gray";
    if (r.includes("uncommon")) return "chip-blue";
    if (r.includes("rare") && !r.includes("ultra") && !r.includes("secret")) return "chip-navy";
    if (r.includes("ultra")) return "chip-gold";
    if (r.includes("secret")) return "chip-purple";
    return "chip-gray";
  }

  async function load() {
    try {
      loading.value = true;
      items.value = await getTcgCards();
    } catch (e) {
      console.error(e);
      items.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);
</script>

<style scoped>
  .view {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* HERO / ICON SLOT */
  .hero {
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  }

  .heroInner {
    height: 200px; /* ✅ espacio de 200px */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .heroIcon {
    max-height: 150px;
    max-width: 85%;
    object-fit: contain;
    opacity: 0.95;
  }

  .heroPlaceholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-secondary);
    text-align: center;
  }

  .heroTitle {
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--text-main);
  }

  .heroSub {
    font-weight: 400;
    opacity: 0.75;
  }

  /* HEADER */
  .header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
  }

  .title {
    font-size: 1.6rem;
    font-weight: 700;
  }

  .subtitle {
    margin-top: 0.25rem;
    color: var(--text-secondary);
    font-size: 0.92rem;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .search,
  .select {
    background: var(--bg-card);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-main);
    border-radius: 10px;
    padding: 0.55rem 0.7rem;
    min-width: 180px;
  }

  /* TABLE */
  .card {
    background: var(--bg-card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-secondary);
    padding: 0.9rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  td {
    padding: 0.85rem 0.9rem;
    font-size: 0.92rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  tr:hover td {
    background: rgba(255,255,255,0.02);
  }

  .state {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }

  .name {
    font-weight: 600;
  }

  .num {
    text-align: right;
  }

  .strong {
    font-weight: 800;
  }

  .muted {
    color: var(--text-secondary);
  }

  .actionsCol {
    width: 80px;
    text-align: right;
  }

  .link {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 0.75rem;
    border-radius: 10px;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.08);
    font-weight: 700;
  }

  .btn-scarlet {
    background: rgba(220, 38, 38, 0.18);
    border-color: rgba(248, 113, 113, 0.35);
    color: #fecaca;
  }

  /* Chips (con tu ajuste Poppins) */
  .chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    line-height: 1;
    padding: 0.3rem 0.6rem 0.1rem 0.6rem;
    border-radius: 999px;
    white-space: nowrap;
    border: 1px solid transparent;
  }

  .chip-gray {
    background: rgba(156,163,175,0.15);
    color: var(--text-secondary);
  }

  .chip-blue {
    background: rgba(59,130,246,0.16);
    border-color: rgba(59,130,246,0.22);
    color: #bfdbfe;
  }

  .chip-navy {
    background: rgba(56,189,248,0.14);
    border-color: rgba(56,189,248,0.22);
    color: #bae6fd;
  }

  .chip-gold {
    background: rgba(234,179,8,0.16);
    border-color: rgba(253,224,71,0.22);
    color: #fde68a;
  }

  .chip-purple {
    background: rgba(168,85,247,0.16);
    border-color: rgba(216,180,254,0.22);
    color: #e9d5ff;
  }
</style>
