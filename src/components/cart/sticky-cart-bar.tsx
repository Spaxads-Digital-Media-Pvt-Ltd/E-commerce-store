"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  selectCartCount,
  selectCartSubtotal,
  useCart,
} from "@/store/cart-store";
import { shippingFor } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

// Mobile persistent bar: "2 items · ₹1,598 · View Cart" (§7.4). Sits just
// above the bottom nav; hidden on cart/checkout where it would be redundant.
export function StickyCartBar() {
  const pathname = usePathname();
  const count = useCart(selectCartCount);
  const subtotal = useCart(selectCartSubtotal);
  const hasHydrated = useCart((s) => s.hasHydrated);

  const hidden =
    !hasHydrated ||
    count === 0 ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  if (hidden) return null;

  const total = subtotal + shippingFor(subtotal);

  return (
    <div className="fixed inset-x-3 bottom-[4.5rem] z-40 md:hidden">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-2.5 text-canvas shadow-xl">
        <p className="min-w-0 truncate text-sm">
          <span className="font-semibold">
            {count} item{count === 1 ? "" : "s"}
          </span>
          <span className="text-canvas/60"> · </span>
          <span className="font-display font-bold">{formatINR(total)}</span>
        </p>
        <Link
          href="/cart"
          className="shrink-0 rounded-xl bg-marigold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-marigold-deep"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
