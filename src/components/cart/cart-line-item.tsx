"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { useCart, lineKey } from "@/store/cart-store";
import { MAX_QTY_PER_ITEM } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { QtyStepper } from "./qty-stepper";

export function CartLineItem({
  item,
  compact = false,
}: {
  item: CartItem;
  compact?: boolean;
}) {
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);
  const max = Math.min(item.stock, MAX_QTY_PER_ITEM);
  const key = lineKey(item);

  return (
    <div className="flex gap-3 py-4">
      <Link href={`/product/${item.slug}`} className="shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={compact ? 64 : 88}
          height={compact ? 64 : 88}
          className={
            compact
              ? "size-16 rounded-xl object-cover"
              : "size-22 rounded-xl object-cover"
          }
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${item.slug}`}
            className="line-clamp-2 text-sm font-medium text-ink hover:text-marigold-deep"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(key)}
            aria-label={`Remove ${item.name} from cart`}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-sindoor/10 hover:text-sindoor"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <p className="mt-0.5 text-xs text-gray-500">
          {formatINR(item.price)} each
          {item.size ? (
            <>
              {" · "}
              <span className="font-medium text-ink">Size {item.size}</span>
            </>
          ) : null}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <QtyStepper
            value={item.qty}
            max={max}
            onChange={(qty) => updateQty(key, qty)}
            label={item.name}
          />
          <span className="font-display text-base font-bold text-ink">
            {formatINR(item.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}
