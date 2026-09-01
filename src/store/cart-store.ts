import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { MAX_QTY_PER_ITEM } from "@/lib/constants";

// Guest cart — client-side only (blueprint §9). Persisted to localStorage via
// zustand/persist. This state is a UI convenience: the server re-verifies
// every price and stock level at checkout; nothing here is trusted for money.
//
// A line is identified by product + size, so the same garment added in two
// sizes is two separate lines. `lineKey` is that identity everywhere.

export function lineKey(item: { productId: string; size?: string | null }): string {
  return `${item.productId}::${item.size ?? ""}`;
}

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  replaceItems: (items: CartItem[]) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
  setDrawerOpen: (open: boolean) => void;
  setHasHydrated: (v: boolean) => void;
};

function capQty(qty: number, stock: number): number {
  const cap = Math.min(stock > 0 ? stock : 0, MAX_QTY_PER_ITEM);
  return Math.max(1, Math.min(qty, Math.max(cap, 1)));
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      hasHydrated: false,

      // Adding an already-carted line (same product AND size) increments its
      // qty — never a duplicate line (§9).
      addItem: (item, qty = 1) =>
        set((state) => {
          const key = lineKey(item);
          const existing = state.items.find((i) => lineKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i) === key
                  ? { ...i, ...item, qty: capQty(i.qty + qty, item.stock) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, qty: capQty(qty, item.stock) }],
          };
        }),

      updateQty: (key, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            lineKey(i) === key ? { ...i, qty: capQty(qty, i.stock) } : i
          ),
        })),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => lineKey(i) !== key),
        })),

      replaceItems: (items) => set({ items }),

      clear: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      setDrawerOpen: (open) => set({ drawerOpen: open }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "under999-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const selectCartCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.qty, 0);
export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
