<template>
  <section class="view">
    <header class="header">
      <div>
        <h1 class="title">Agregar Carta</h1>
        <p class="subtitle">Crea una carta y agrega copias a tu inventario.</p>
      </div>

      <div class="actions">
        <RouterLink class="btn" to="/cards">← Volver</RouterLink>
      </div>
    </header>

    <form class="formCard" @submit.prevent="submit">
      <!-- ICON SLOT (200px) DENTRO DEL FORM -->
      <div class="iconSlot">
        <div class="iconInner">
          <img v-if="gameIconUrl" :src="gameIconUrl" class="iconImg" alt="Game icon" />
          <div v-else class="iconPlaceholder">
            <div class="phTitle">Icono del juego</div>
            <div class="phSub">Espacio de 200px (tú agregas la imagen)</div>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="field">
          <label>Juego (TCG)</label>
          <input v-model.trim="form.game" placeholder="Pokémon, MTG, Yu-Gi-Oh!..." />
        </div>

        <div class="field">
          <label>Nombre</label>
          <input v-model.trim="form.name" placeholder="Charizard EX" />
        </div>

        <div class="field">
          <label>Rareza</label>
          <select v-model="form.rarity">
            <option value="">Selecciona…</option>
            <option>Common</option>
            <option>Uncommon</option>
            <option>Rare</option>
            <option>Ultra Rare</option>
            <option>Secret Rare</option>
          </select>
        </div>

        <div class="field">
          <label>Copias</label>
          <input v-model.number="form.quantity" type="number" min="0" />
        </div>

        <div class="field">
          <label>Set Code</label>
          <input v-model.trim="form.setCode" placeholder="SVI, LOB, MH2..." />
        </div>

        <div class="field">
          <label>Número</label>
          <input v-model.trim="form.cardNumber" placeholder="123/198" />
        </div>

        <div class="field full">
          <label>Notas (opcional)</label>
          <textarea v-model.trim="form.notes" rows="3" placeholder="Ej: foil, binder A, condición NM..." />
        </div>
      </div>

      <div class="footer">
        <div class="hint" v-if="error">{{ error }}</div>

        <button class="btn btn-scarlet" type="submit" :disabled="saving">
          {{ saving ? "Guardando…" : "Guardar carta" }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
  import { reactive, ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { createTcgCard } from "@/services/tcgCards.service";

  type CreateTcgCardRequest = {
    game: string;
    name: string;
    rarity: string;
    quantity: number;
    setCode?: string | null;
    cardNumber?: string | null;
    notes?: string | null;
  };

  const router = useRouter();
  const saving = ref(false);
  const error = ref<string>("");

  const form = reactive<CreateTcgCardRequest>({
    game: "",
    name: "",
    rarity: "",
    quantity: 1,
    setCode: "",
    cardNumber: "",
    notes: "",
  });

  // Icon mapping (tú cambias las rutas cuando metas las imágenes)
  const gameIconUrl = computed(() => {
    const game = form.game.trim().toLowerCase();
    if (!game) return "";

    if (game.includes("pokemon")) return "/assets/games/pokemon.png";
    if (game.includes("yugioh")) return "/assets/games/yugioh.png";
    if (game.includes("mtg") || game.includes("magic")) return "/assets/games/mtg.png";
    if (game.includes("one piece")) return "/assets/games/onepiece.png";

    return "";
  });

  function validate() {
    if (!form.game.trim()) return "El juego es requerido.";
    if (!form.name.trim()) return "El nombre es requerido.";
    if (!form.rarity.trim()) return "La rareza es requerida.";
    if (form.quantity == null || Number.isNaN(form.quantity) || form.quantity < 0)
      return "La cantidad debe ser 0 o mayor.";
    return "";
  }

  async function submit() {
    error.value = validate();
    if (error.value) return;

    try {
      saving.value = true;

      await createTcgCard({
        game: form.game.trim(),
        name: form.name.trim(),
        rarity: form.rarity.trim(),
        quantity: Number(form.quantity),
        setCode: form.setCode?.trim() || null,
        cardNumber: form.cardNumber?.trim() || null,
        notes: form.notes?.trim() || null,
      });

      router.push("/cards");
    } catch (e) {
      console.error(e);
      error.value = "No se pudo guardar la carta.";
    } finally {
      saving.value = false;
    }
  }
</script>

<style scoped>
  .view {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

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
  }

  /* FORM */
  .formCard {
    background: var(--bg-card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 1rem;
  }

  /* ICON SLOT inside form */
  .iconSlot {
    margin-bottom: 1rem;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  }

  .iconInner {
    height: 200px; /* ✅ espacio de 200px */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .iconImg {
    max-height: 150px;
    max-width: 85%;
    object-fit: contain;
    opacity: 0.95;
  }

  .iconPlaceholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-secondary);
    text-align: center;
  }

  .phTitle {
    font-weight: 800;
    color: var(--text-main);
  }

  .phSub {
    font-weight: 400;
    opacity: 0.75;
  }

  .grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

    .field.full {
      grid-column: 1 / -1;
    }

  label {
    color: var(--text-secondary);
    font-size: 0.82rem;
    font-weight: 700;
  }

  input, select, textarea {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-main);
    border-radius: 10px;
    padding: 0.65rem 0.75rem;
  }

  textarea {
    resize: vertical;
  }

  .footer {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .hint {
    color: #fecaca;
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
    background: rgba(255,255,255,0.02);
    color: var(--text-main);
  }

  .btn-scarlet {
    background: rgba(220, 38, 38, 0.18);
    border-color: rgba(248, 113, 113, 0.35);
    color: #fecaca;
  }

  @media (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
