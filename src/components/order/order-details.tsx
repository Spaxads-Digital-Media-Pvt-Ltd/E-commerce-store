"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, CircleAlert, MapPin, Phone } from "lucide-react";
import type { OrderDTO } from "@/types";
import { ORDER_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } from "@/lib/constants";
import { cn, formatINR } from "@/lib/utils";
import { gstFromTotal } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { OrderSummary } from "@/components/checkout/order-summary";

// Labels for every method this codebase has ever created orders with,
// including ones no longer offered at checkout (e.g. legacy MANPAY rows) —
// old orders must still render a sensible label, not fall through to a
// wrong or missing one.
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  [PAYMENT_METHODS.RAZORPAY]: "Online (Razorpay)",
  [PAYMENT_METHODS.PAYU]: "Online (PayU)",
  [PAYMENT_METHODS.SPRINTPGX]: "Online (SprintPGX)",
};

const TIMELINE = [
  { status: ORDER_STATUS.PLACED, label: "Placed" },
  { status: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
  { status: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { status: ORDER_STATUS.DELIVERED, label: "Delivered" },
] as const;

function StatusTimeline({ status }: { status: string }) {
  const currentIndex = TIMELINE.findIndex((s) => s.status === status);

  if (status === ORDER_STATUS.CANCELLED) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-sindoor/10 px-4 py-3 text-sm font-semibold text-sindoor">
        <CircleAlert className="size-4 shrink-0" aria-hidden />
        This order was cancelled.
      </p>
    );
  }

  return (
    <div>
      {status === ORDER_STATUS.PENDING_PAYMENT ? (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-marigold/10 px-4 py-3 text-sm font-semibold text-marigold-deep">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          Payment pending — the order will be confirmed once payment completes.
        </p>
      ) : null}
      <ol className="flex items-center">
        {TIMELINE.map((step, i) => {
          const done = currentIndex >= i;
          return (
            <li
              key={step.status}
              className={cn("flex items-center", i > 0 && "flex-1")}
            >
              {i > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full",
                    done ? "bg-mehendi" : "bg-gray-200"
                  )}
                />
              ) : null}
              <span className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full",
                    done
                      ? "bg-mehendi text-canvas"
                      : "border-2 border-gray-200 bg-canvas text-gray-400"
                  )}
                >
                  {done ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <span className="size-1.5 rounded-full bg-gray-300" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    done ? "text-mehendi" : "text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function OrderDetails({ order }: { order: OrderDTO }) {
  const placedOn = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 p-5">
        <div>
          <p className="text-xs text-gray-500">Order number</p>
          <p className="font-mono text-sm font-bold text-ink">
            {order.orderNumber}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Placed on</p>
          <p className="text-sm font-medium">{placedOn}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Payment</p>
          <p className="flex items-center gap-2 text-sm font-medium">
            {order.paymentMethod === PAYMENT_METHODS.COD
              ? "Cash on Delivery"
              : (PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                "Online payment")}
            {order.paymentStatus === PAYMENT_STATUS.PAID ? (
              <Badge variant="mehendi">Paid</Badge>
            ) : order.paymentStatus === PAYMENT_STATUS.FAILED ? (
              <Badge variant="sindoor">Failed</Badge>
            ) : (
              <Badge variant="outline">
                {order.paymentMethod === PAYMENT_METHODS.COD
                  ? "Pay on delivery"
                  : "Pending"}
              </Badge>
            )}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <StatusTimeline status={order.status} />
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <h3 className="font-display text-base font-bold text-ink">Items</h3>
        <ul className="mt-3 divide-y divide-gray-200">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              <Image
                src={item.image}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                {item.productSlug ? (
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="line-clamp-2 text-sm font-medium text-ink hover:text-marigold-deep"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                )}
                <p className="text-xs text-gray-500">
                  {formatINR(item.price)} × {item.qty}
                </p>
              </div>
              <p className="shrink-0 font-display text-sm font-bold">
                {formatINR(item.price * item.qty)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink">
            <MapPin className="size-4 text-marigold-deep" aria-hidden />
            Delivery address
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            <span className="font-medium text-ink">{order.customerName}</span>
            <br />
            {order.addressLine1}
            {order.addressLine2 ? (
              <>
                <br />
                {order.addressLine2}
              </>
            ) : null}
            <br />
            {order.city}, {order.state} — {order.pincode}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
            <Phone className="size-3.5" aria-hidden />
            {order.phone}
          </p>
        </div>

        <OrderSummary
          totals={{
            subtotal: order.subtotal,
            shippingFee: order.shippingFee,
            discount: order.discount,
            membershipFee: order.membershipFee,
            total: order.total,
            gst: gstFromTotal(order.total),
          }}
          couponCode={order.couponCode}
        />
      </div>
    </div>
  );
}
