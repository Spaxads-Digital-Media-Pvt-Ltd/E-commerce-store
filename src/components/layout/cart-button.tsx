"use client";

import { ShoppingCart } from "lucide-react";
import { selectCartCount, useCart } from "@/store/cart-store";

export function CartButton() {
  const count = useCart(selectCartCount);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const setDrawerOpen = useCart((s) => s.setDrawerOpen);
  const shown = hasHydrated ? count : 0; // avoid SSR/CSR mismatch

  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      className="relative flex size-10 items-center justify-center rounded-xl text-canvas transition-colors hover:bg-canvas/10"
      aria-label={`Cart, ${shown} item${shown === 1 ? "" : "s"}`}
    >
      <ShoppingCart className="size-5" />
      {shown > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-marigold px-1 font-mono text-[11px] font-bold text-ink">
          {shown > 99 ? "99+" : shown}
        </span>
      ) : null}
      {/* announce updates without re-reading the whole button (§7.7) */}
      <span aria-live="polite" className="sr-only">
        {shown} items in cart
      </span>
    </button>
  );
}
