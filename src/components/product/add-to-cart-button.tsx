"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { ProductDTO } from "@/types";
import { useCart } from "@/lib/cart-store";
import { COPY, MAX_QTY_PER_ITEM } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Shared by ProductCard (compact) and the product page (full size).
export function AddToCartButton({
  product,
  qty = 1,
  size = "card",
  className,
}: {
  product: ProductDTO;
  qty?: number;
  size?: "card" | "full";
  className?: string;
}) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const reduceMotion = useReducedMotion();

  const inCart = items.find((i) => i.productId === product.id)?.qty ?? 0;
  const cap = Math.min(product.stock, MAX_QTY_PER_ITEM);
  const outOfStock = product.stock <= 0;
  const maxed = !outOfStock && inCart >= cap;

  function handleAdd(e: React.MouseEvent) {
    // cards are wrapped in a Link — don't navigate
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || maxed) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
        stock: product.stock,
      },
      qty
    );
    toast.success("Added to cart", { description: product.name });
  }

  if (size === "card") {
    return (
      <motion.button
        type="button"
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        onClick={handleAdd}
        disabled={outOfStock || maxed}
        aria-label={
          outOfStock
            ? `${product.name} is out of stock`
            : `Add ${product.name} to cart`
        }
        className={cn(
          "flex items-center gap-1 rounded-lg border border-marigold bg-canvas px-2.5 py-1.5 text-xs font-bold text-marigold-deep transition-colors hover:bg-marigold hover:text-ink disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-canvas",
          className
        )}
      >
        <Plus className="size-3.5" />
        {maxed ? "Max" : "Add"}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      onClick={handleAdd}
      disabled={outOfStock || maxed}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-marigold px-7 text-base font-semibold text-ink transition-colors hover:bg-marigold-deep disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500",
        className
      )}
    >
      <ShoppingCart className="size-5" />
      {outOfStock
        ? COPY.outOfStock
        : maxed
          ? "Max quantity in cart"
          : "Add to Cart"}
    </motion.button>
  );
}
