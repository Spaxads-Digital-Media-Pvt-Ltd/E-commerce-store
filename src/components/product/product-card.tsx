"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/types";
import { discountPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "./price-tag";
import { RatingBadge } from "./rating-badge";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({
  product,
  sizes = "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px",
}: {
  product: ProductDTO;
  sizes?: string;
}) {
  const off = discountPercent(product.mrp, product.price);
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-canvas transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-canvas-alt">
        <Image
          src={product.images[0] ?? ""}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {off > 0 ? (
          <Badge variant="sindoor" className="absolute left-2 top-2">
            {off}% off
          </Badge>
        ) : null}
        {outOfStock ? (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <Badge variant="ink" className="px-3 py-1">
              Out of stock
            </Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-ink">
          {product.name}
        </h3>
        <RatingBadge rating={product.rating} count={product.ratingCount} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <PriceTag price={product.price} mrp={product.mrp} size="sm" />
          <AddToCartButton product={product} />
        </div>
      </div>
    </Link>
  );
}
