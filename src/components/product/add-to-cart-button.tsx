"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { ProductDTO } from "@/types";
import { useCart, lineKey } from "@/store/cart-store";
import { COPY, MAX_QTY_PER_ITEM } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Shared by ProductCard (compact) and the product page (full size).
// For products that have sizes, a size must be chosen first — so the compact
// card button routes to the product page rather than adding blindly, and the
// full button stays disabled until `selectedSize` is set.
export function AddToCartButton({
  product,
  qty = 1,
  size = "card",
  selectedSize = null,
  className,
}: {
  product: ProductDTO;
  qty?: number;
  size?: "card" | "full";
  selectedSize?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const reduceMotion = useReducedMotion();

  const hasSizes = product.sizes.length > 0;
  const outOfStock = product.stock <= 0;
  const chosenSize = hasSizes ? selectedSize : null;
  const inCart =
    items.find(
      (i) => lineKey(i) === lineKey({ productId: product.id, size: chosenSize })
    )?.qty ?? 0;
  const cap = Math.min(product.stock, MAX_QTY_PER_ITEM);
  const maxed = !outOfStock && inCart >= cap;
  const needsSize = hasSizes && !selectedSize;

  function doAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
        stock: product.stock,
        size: chosenSize,
      },
      qty
    );
    toast.success("Added to cart", {
      description: chosenSize
        ? `${product.name} · Size ${chosenSize}`
        : product.name,
    });
  }

  if (size === "card") {
    // Sized products can't be quick-added from a card — go pick a size.
    if (hasSizes) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/product/${product.slug}`);
          }}
          disabled={outOfStock}
          aria-label={`Choose a size for ${product.name}`}
          className={cn(
            "flex items-center gap-1 rounded-lg border border-marigold bg-canvas px-2.5 py-1.5 text-xs font-bold text-marigold-deep transition-colors hover:bg-marigold hover:text-ink disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-canvas",
            className
          )}
        >
          <Plus className="size-3.5" />
          Select
        </button>
      );
    }
    return (
      <motion.button
        type="button"
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (outOfStock || maxed) return;
          doAdd();
        }}
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
      onClick={(e) => {
        e.preventDefault();
        if (outOfStock || maxed || needsSize) return;
        doAdd();
      }}
      disabled={outOfStock || maxed || needsSize}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-marigold px-7 text-base font-semibold text-ink transition-colors hover:bg-marigold-deep disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500",
        className
      )}
    >
      <ShoppingCart className="size-5" />
      {outOfStock
        ? COPY.outOfStock
        : needsSize
          ? "Select a size"
          : maxed
            ? "Max quantity in cart"
            : "Add to Cart"}
    </motion.button>
  );
}
