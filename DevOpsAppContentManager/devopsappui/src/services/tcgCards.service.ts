const API_URL = import.meta.env.VITE_API_URL;
import type { TcgCardListItem } from "@/views/inventories/CardsView.vue";

export type CreateTcgCardRequest = {
  game: string;
  name: string;
  rarity: string;
  quantity: number;
  setCode?: string | null;
  cardNumber?: string | null;
  notes?: string | null;
};

export async function getTcgCards(): Promise<TcgCardListItem[]> {
  const res = await fetch(`${API_URL}/Inventories/tcg/cards`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error("Error al obtener cartas");
  return res.json();
}

export async function createTcgCard(payload: CreateTcgCardRequest): Promise<void> {
  const res = await fetch(`${API_URL}/Inventories/tcg/cards`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Error al crear carta");
  }
}
