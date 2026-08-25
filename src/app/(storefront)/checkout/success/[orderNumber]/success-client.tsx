"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, PackageSearch, Truck } from "lucide-react";
import type { OrderDTO } from "@/types";
import { useCart } from "@/store/cart-store";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDetails } from "@/components/order/order-details";

const LAST_ORDER_KEY = "u999:last-order";

export function SuccessClient({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = React.useState<OrderDTO | null | undefined>(
    undefined
  );
  // PayU/SprintPGX redirect the whole browser away and back, so the
  // sessionStorage snapshot below is taken BEFORE payment completes and is
  // stale on paymentStatus. Their callback route appends the fresh,
  // server-decided outcome as ?paid=1|0 on the redirect so this page can
  // show the right message without trusting the query param for anything
  // beyond that cosmetic line — order details still only ever come from the
  // sessionStorage snapshot (see the IDOR note on the page component).
  const paidParam = useSearchParams().get("paid");

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OrderDTO;
        if (parsed.orderNumber === orderNumber) {
          setOrder(parsed);
          // belt-and-braces: the cart is cleared at checkout, but a refresh
          // mid-redirect shouldn't leave items behind
          useCart.getState().clear();
          return;
        }
      }
    } catch {
      // fall through to the track-order fallback
    }
    setOrder(null);
  }, [orderNumber]);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="mx-auto h-14 w-14 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-8 w-64" />
        <Skeleton className="mt-8 h-64 w-full" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          icon={PackageSearch}
          title="Order placed — details not available on this device"
          description="For your privacy, order details only appear on the device that placed the order. Look it up with your order number and phone number instead."
        >
          <Button asChild>
            <Link
              href={`/track-order?orderNumber=${encodeURIComponent(orderNumber)}`}
            >
              Track this order
            </Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const isCod = order.paymentMethod === PAYMENT_METHODS.COD;
  // ?paid= (set only by the PayU callback route) overrides the stale
  // pre-payment snapshot; falls back to the snapshot for COD/Razorpay flows
  // where it's already fresh.
  const isPaid =
    paidParam === "1"
      ? true
      : paidParam === "0"
        ? false
        : order.paymentStatus === PAYMENT_STATUS.PAID;
  const paymentFailed = !isCod && paidParam === "0";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center">
        <CheckCircle2
          aria-hidden
          className="mx-auto size-14 text-mehendi"
          strokeWidth={1.75}
        />
        <h1 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
          Order placed.
        </h1>
        <p className="mt-1 text-gray-500">
          Your order number is{" "}
          <span className="font-mono font-bold text-ink">
            {order.orderNumber}
          </span>
          {order.email ? " — we've noted your email for updates." : "."}
        </p>

        <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-xl bg-canvas-alt px-4 py-2.5 text-sm font-medium text-ink">
          <Truck className="size-4 text-marigold-deep" aria-hidden />
          Estimated delivery: 3–7 days
        </p>

        {isCod ? (
          <p className="mt-3 text-sm text-gray-500">
            Keep <strong className="text-ink">{formatINR(order.total)}</strong>{" "}
            ready — you'll pay the delivery partner in cash.
          </p>
        ) : isPaid ? (
          <p className="mt-3 text-sm font-medium text-mehendi">
            Payment received — nothing to pay on delivery.
          </p>
        ) : paymentFailed ? (
          <p className="mt-3 text-sm font-medium text-sindoor">
            Payment didn't go through. Track this order to retry, or contact
            support if money was deducted.
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="dark" asChild>
            <Link
              href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
            >
              Track this order
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
