"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItems } from "./pricing";

interface CartState {
  items: CartItems;
  code: string | null;
  isOpen: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  applyCode: (code: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      code: null,
      isOpen: false,

      add: (slug, qty = 1) =>
        set((state) => ({
          items: { ...state.items, [slug]: (state.items[slug] ?? 0) + qty },
          isOpen: true,
        })),

      setQty: (slug, qty) =>
        set((state) => {
          const items = { ...state.items };
          if (qty <= 0) delete items[slug];
          else items[slug] = Math.min(qty, 99);
          return { items };
        }),

      remove: (slug) =>
        set((state) => {
          const items = { ...state.items };
          delete items[slug];
          return { items };
        }),

      clear: () => set({ items: {}, code: null }),
      applyCode: (code) => set({ code }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "releaf-cart",
      partialize: (state) => ({ items: state.items, code: state.code }),
    }
  )
);
