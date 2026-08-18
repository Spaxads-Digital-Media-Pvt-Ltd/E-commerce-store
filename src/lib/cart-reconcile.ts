import type { CartItem, ProductDTO } from "@/types";
import { MAX_QTY_PER_ITEM } from "./constants";

// Reconciles the locally-persisted cart against fresh product data from the
// server (price/stock may have changed since the item was added). Pure and
// unit-tested — the cart page and checkout both use it.

export type CartChange =
  | { type: "removed"; name: string; reason: "unavailable" | "out-of-stock" }
  | { type: "price"; name: string; from: number; to: number }
  | { type: "qty-clamped"; name: string; from: number; to: number };

export function reconcileCart(
  items: CartItem[],
  products: ProductDTO[]
): { items: CartItem[]; changes: CartChange[] } {
  const bySlugId = new Map(products.map((p) => [p.id, p]));
  const next: CartItem[] = [];
  const changes: CartChange[] = [];

  for (const item of items) {
    const product = bySlugId.get(item.productId);
    if (!product || !product.isActive) {
      changes.push({ type: "removed", name: item.name, reason: "unavailable" });
      continue;
    }
    if (product.stock <= 0) {
      changes.push({ type: "removed", name: item.name, reason: "out-of-stock" });
      continue;
    }
    if (product.price !== item.price) {
      changes.push({
        type: "price",
        name: product.name,
        from: item.price,
        to: product.price,
      });
    }
    const cappedQty = Math.min(item.qty, product.stock, MAX_QTY_PER_ITEM);
    if (cappedQty !== item.qty) {
      changes.push({
        type: "qty-clamped",
        name: product.name,
        from: item.qty,
        to: cappedQty,
      });
    }
    next.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? item.image,
      qty: cappedQty,
      stock: product.stock,
    });
  }

  return { items: next, changes };
}
