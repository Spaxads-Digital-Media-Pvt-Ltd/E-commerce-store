"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart, lineKey } from "@/store/cart-store";
import { reconcileCart, type CartChange } from "@/store/cart-reconcile";
import { COPY, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import type { ProductDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummary } from "@/components/checkout/order-summary";
import { CartLineItem } from "./cart-line-item";

function changeMessage(change: CartChange): string {
  switch (change.type) {
    case "removed":
      return change.reason === "out-of-stock"
        ? `"${change.name}" — ${COPY.outOfStock} Removed from your cart.`
        : `"${change.name}" is no longer available and was removed.`;
    case "price":
      return `Price of "${change.name}" changed: ${formatINR(change.from)} → ${formatINR(change.to)}.`;
    case "qty-clamped":
      return `Quantity of "${change.name}" adjusted to ${change.to} (stock limit).`;
  }
}

export function CartPageClient() {
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);

  // Revalidate the locally-persisted cart against live price/stock once per
  // visit — client cart state is never the source of truth for money (§9).
  React.useEffect(() => {
    if (!hasHydrated) return;
    const current = useCart.getState().items;
    if (current.length === 0) return;

    const controller = new AbortController();
    (async () => {
      try {
        const ids = current.map((i) => i.productId).join(",");
        const res = await fetch(
          `/api/products?ids=${encodeURIComponent(ids)}&pageSize=48`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { products: ProductDTO[] };
        const { items: next, changes } = reconcileCart(
          useCart.getState().items,
          data.products
        );
        if (changes.length > 0) {
          useCart.getState().replaceItems(next);
          changes.forEach((c) => toast.info(changeMessage(c)));
        }
      } catch {
        // offline — the server will re-verify at checkout anyway
      }
    })();
    return () => controller.abort();
  }, [hasHydrated]);

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EmptyState icon={ShoppingCart} title={COPY.emptyCartTitle}>
          <Button asChild>
            <Link href="/categories">{COPY.emptyCartCta}</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const remainingForFree = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Your Cart{" "}
        <span className="text-base font-normal text-gray-500">
          ({items.length} item{items.length === 1 ? "" : "s"})
        </span>
      </h1>

      <div className="mt-6 gap-6 lg:grid lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 px-4">
          {items.map((item) => (
            <CartLineItem key={lineKey(item)} item={item} />
          ))}
        </div>

        <div className="mt-6 lg:sticky lg:top-32 lg:mt-0">
          {remainingForFree > 0 ? (
            <p className="mb-3 rounded-xl bg-marigold/10 px-4 py-2.5 text-sm font-medium text-marigold-deep">
              Add {formatINR(remainingForFree)} more for FREE delivery
            </p>
          ) : null}

          <OrderSummary
            lines={items.map((i) => ({
              name: i.name,
              price: i.price,
              qty: i.qty,
            }))}
          />

          <Button size="lg" className="mt-4 w-full" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Link
            href="/categories"
            className="mt-3 block text-center text-sm font-medium text-gray-500 hover:text-marigold-deep"
          >
            or continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
