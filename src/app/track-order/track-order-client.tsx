"use client";

import * as React from "react";
import { Loader2, PackageSearch, PackageX } from "lucide-react";
import { toast } from "sonner";
import { trackOrderSchema } from "@/lib/validations/order";
import type { OrderDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderDetails } from "@/components/order/order-details";

type LookupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "found"; order: OrderDTO };

export function TrackOrderClient({
  initialOrderNumber,
}: {
  initialOrderNumber: string;
}) {
  const [orderNumber, setOrderNumber] = React.useState(initialOrderNumber);
  const [phone, setPhone] = React.useState("");
  const [errors, setErrors] = React.useState<{
    orderNumber?: string;
    phone?: string;
  }>({});
  const [state, setState] = React.useState<LookupState>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = trackOrderSchema.safeParse({ orderNumber, phone });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        orderNumber: flat.orderNumber?.[0],
        phone: flat.phone?.[0],
      });
      return;
    }
    setErrors({});
    setState({ kind: "loading" });
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(parsed.data.orderNumber)}?phone=${encodeURIComponent(parsed.data.phone)}`
      );
      if (res.status === 429) {
        toast.error("Too many lookups — please wait a minute.");
        setState({ kind: "idle" });
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.order) {
        setState({ kind: "found", order: data.order as OrderDTO });
      } else {
        setState({ kind: "not-found" });
      }
    } catch {
      toast.error("Network error — check your connection and try again.");
      setState({ kind: "idle" });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Track your order
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Enter your order number and the mobile number used at checkout — no
        login needed.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 grid gap-4 rounded-2xl border border-gray-200 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <div className="space-y-1.5">
          <Label htmlFor="track-order-number">Order number</Label>
          <Input
            id="track-order-number"
            placeholder="ORD-20260716-01234"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            className="font-mono"
            autoComplete="off"
            aria-invalid={!!errors.orderNumber}
            aria-describedby={
              errors.orderNumber ? "track-order-number-error" : undefined
            }
          />
          {errors.orderNumber ? (
            <p
              id="track-order-number-error"
              role="alert"
              className="text-xs font-medium text-sindoor"
            >
              {errors.orderNumber}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="track-phone">Mobile number</Label>
          <Input
            id="track-phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "track-phone-error" : undefined}
          />
          {errors.phone ? (
            <p
              id="track-phone-error"
              role="alert"
              className="text-xs font-medium text-sindoor"
            >
              {errors.phone}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={state.kind === "loading"}
          className="sm:mb-0"
        >
          {state.kind === "loading" ? (
            <>
              <Loader2 className="animate-spin" />
              Looking up…
            </>
          ) : (
            <>
              <PackageSearch />
              Track order
            </>
          )}
        </Button>
      </form>

      <div className="mt-8">
        {state.kind === "not-found" ? (
          <EmptyState
            icon={PackageX}
            title="We couldn't find that order"
            description="Double-check the order number and make sure the phone number matches the one used at checkout."
          />
        ) : null}

        {state.kind === "found" ? (
          <>
            <OrderDetails order={state.order} />
            <button
              type="button"
              onClick={() => setState({ kind: "idle" })}
              className="mt-4 text-sm font-medium text-gray-500 hover:text-marigold-deep"
            >
              Look up another order
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
