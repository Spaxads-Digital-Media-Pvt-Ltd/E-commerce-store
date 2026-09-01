"use client";

import * as React from "react";
import type { ProductDTO } from "@/types";
import { MAX_QTY_PER_ITEM } from "@/lib/constants";
import { QtyStepper } from "@/components/cart/qty-stepper";
import { AddToCartButton } from "./add-to-cart-button";
import { SizeSelector } from "./size-selector";

export function ProductActions({ product }: { product: ProductDTO }) {
  const [qty, setQty] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const max = Math.min(product.stock, MAX_QTY_PER_ITEM);
  const hasSizes = product.sizes.length > 0;

  return (
    <div className="space-y-4">
      {hasSizes ? (
        <SizeSelector
          sizes={product.sizes}
          value={selectedSize}
          onChange={setSelectedSize}
          attributes={product.attributes}
        />
      ) : null}

      <div className="flex items-center gap-3">
        {product.stock > 0 ? (
          <QtyStepper
            value={qty}
            max={max}
            onChange={setQty}
            label={product.name}
            className="h-12 [&>button]:size-11 [&>span]:min-w-10"
          />
        ) : null}
        <AddToCartButton
          product={product}
          qty={qty}
          size="full"
          selectedSize={selectedSize}
          className="flex-1"
        />
      </div>
    </div>
  );
}
