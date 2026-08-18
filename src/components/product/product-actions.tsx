"use client";

import * as React from "react";
import type { ProductDTO } from "@/types";
import { MAX_QTY_PER_ITEM } from "@/lib/constants";
import { QtyStepper } from "@/components/cart/qty-stepper";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductActions({ product }: { product: ProductDTO }) {
  const [qty, setQty] = React.useState(1);
  const max = Math.min(product.stock, MAX_QTY_PER_ITEM);

  return (
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
        className="flex-1"
      />
    </div>
  );
}
