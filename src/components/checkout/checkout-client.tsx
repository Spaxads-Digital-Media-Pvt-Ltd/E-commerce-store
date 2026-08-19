"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addressSchema, type AddressInput } from "@/lib/validations/address";
import { useCart } from "@/store/cart-store";
import { computeTotals } from "@/lib/pricing";
import {
  COPY,
  INDIAN_STATES,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import type { CartItem, OrderDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummary } from "./order-summary";
import { PaymentMethodSelector } from "./payment-method-selector";
import { TurnstileWidget } from "./turnstile-widget";

const LAST_ORDER_KEY = "u999:last-order";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const src = "https://checkout.razorpay.com/v1/checkout.js";
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-gray-500">(optional)</span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs font-medium text-sindoor"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckoutClient({
  razorpayEnabled,
  defaultName,
  defaultEmail,
}: {
  razorpayEnabled: boolean;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(
    PAYMENT_METHODS.COD
  );
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(
    null
  );
  const [honeypot, setHoneypot] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [placed, setPlaced] = React.useState(false);
  // One idempotency key per checkout session: a double-tap or a
  // retry-on-timeout returns the SAME order server-side (§13).
  const idempotencyKey = React.useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`.padEnd(36, "0")
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    mode: "onTouched",
    defaultValues: {
      state: "",
      customerName: defaultName ?? "",
      email: defaultEmail ?? "",
    },
  });

  const totals = computeTotals(
    items.map((i) => ({ price: i.price, qty: i.qty }))
  );

  function finishSuccess(order: OrderDTO) {
    try {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {
      // storage full/blocked — success page falls back to track-order
    }
    setPlaced(true);
    router.push(`/checkout/success/${order.orderNumber}`);
    useCart.getState().clear();
  }

  async function startRazorpayPayment(order: OrderDTO) {
    const res = await fetch("/api/payments/razorpay/create-order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        phone: order.phone,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(
        data.error ??
          "Couldn't start the online payment — you can place the order again with Cash on Delivery."
      );
      setSubmitting(false);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      toast.error("Couldn't load the payment window — check your connection.");
      setSubmitting(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Under ₹999",
      description: `Order ${order.orderNumber}`,
      order_id: data.razorpayOrderId,
      prefill: {
        name: order.customerName,
        contact: order.phone,
        email: order.email ?? undefined,
      },
      notes: { orderNumber: order.orderNumber },
      theme: { color: "#FFA412" },
      handler: async (response) => {
        const vres = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(response),
        });
        const vdata = await vres.json().catch(() => ({}));
        if (vres.ok && vdata.order) {
          finishSuccess(vdata.order as OrderDTO);
        } else {
          setSubmitting(false);
          toast.error(
            vdata.error ??
              "Payment verification failed — if money was deducted it will be reconciled automatically."
          );
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          toast.info(
            `Payment not completed. Order ${order.orderNumber} is saved as pending — press Place Order to retry.`
          );
        },
      },
    });
    rzp.open();
  }

  const onSubmit = handleSubmit(async (customer) => {
    const cartItems = useCart.getState().items;
    if (cartItems.length === 0) {
      toast.error(COPY.emptyCartTitle);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          // ONLY productId + qty — the server re-derives all prices (§13)
          items: cartItems.map((i) => ({
            productId: i.productId,
            qty: i.qty,
          })),
          customer,
          paymentMethod,
          idempotencyKey: idempotencyKey.current,
          // display-honesty check only; never used for charging
          expectedTotal: computeTotals(
            cartItems.map((i) => ({ price: i.price, qty: i.qty }))
          ).total,
          turnstileToken: turnstileToken ?? undefined,
          website: honeypot || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if ((res.status === 201 || res.status === 200) && data.order) {
        const order = data.order as OrderDTO;
        // Route by the ORDER's method — an idempotent replay may return an
        // earlier pending online-payment order.
        if (
          order.paymentMethod === PAYMENT_METHODS.RAZORPAY &&
          order.paymentStatus !== "PAID"
        ) {
          await startRazorpayPayment(order);
        } else {
          finishSuccess(order);
        }
        return;
      }

      if (res.status === 409 && Array.isArray(data.cart)) {
        useCart.getState().replaceItems(data.cart as CartItem[]);
        toast.warning(
          data.error ?? "Your cart was updated — please review it."
        );
        for (const name of (data.removed as string[] | undefined) ?? []) {
          toast.info(`Removed from cart: ${name}`);
        }
        if ((data.cart as CartItem[]).length === 0) router.push("/cart");
        setSubmitting(false);
        return;
      }

      toast.error(data.error ?? COPY.checkoutError);
      setSubmitting(false);
    } catch {
      toast.error("Network error — check your connection and try again.");
      setSubmitting(false);
    }
  });

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-8 w-52" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EmptyState icon={ShoppingCart} title={COPY.emptyCartTitle}>
          <Button asChild>
            <Link href="/categories">{COPY.emptyCartCta}</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-marigold-deep" />
        <p className="mt-3 font-medium text-ink">
          Order placed — taking you to your confirmation…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Guest checkout — no account needed.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 gap-6 lg:grid lg:grid-cols-[1fr_380px] lg:items-start"
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 p-5">
            <h2 className="font-display text-lg font-bold text-ink">
              Contact details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                htmlFor="customerName"
                error={errors.customerName?.message}
              >
                <Input
                  id="customerName"
                  autoComplete="name"
                  aria-invalid={!!errors.customerName}
                  aria-describedby={
                    errors.customerName ? "customerName-error" : undefined
                  }
                  {...register("customerName")}
                />
              </Field>
              <Field
                label="Mobile number"
                htmlFor="phone"
                error={errors.phone?.message}
              >
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  autoComplete="tel-national"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  {...register("phone")}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label="Email"
                  htmlFor="email"
                  optional
                  error={errors.email?.message}
                >
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="For order updates"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-5">
            <h2 className="font-display text-lg font-bold text-ink">
              Delivery address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Flat / house no., building, street"
                  htmlFor="addressLine1"
                  error={errors.addressLine1?.message}
                >
                  <Input
                    id="addressLine1"
                    autoComplete="address-line1"
                    aria-invalid={!!errors.addressLine1}
                    aria-describedby={
                      errors.addressLine1 ? "addressLine1-error" : undefined
                    }
                    {...register("addressLine1")}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Area, landmark"
                  htmlFor="addressLine2"
                  optional
                  error={errors.addressLine2?.message}
                >
                  <Input
                    id="addressLine2"
                    autoComplete="address-line2"
                    {...register("addressLine2")}
                  />
                </Field>
              </div>
              <Field label="City" htmlFor="city" error={errors.city?.message}>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? "city-error" : undefined}
                  {...register("city")}
                />
              </Field>
              <Field
                label="State"
                htmlFor="state"
                error={errors.state?.message}
              >
                <NativeSelect
                  id="state"
                  autoComplete="address-level1"
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? "state-error" : undefined}
                  {...register("state")}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field
                label="Pincode"
                htmlFor="pincode"
                error={errors.pincode?.message}
              >
                <Input
                  id="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit pincode"
                  autoComplete="postal-code"
                  aria-invalid={!!errors.pincode}
                  aria-describedby={
                    errors.pincode ? "pincode-error" : undefined
                  }
                  {...register("pincode")}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-5">
            <h2 className="font-display text-lg font-bold text-ink">
              Payment method
            </h2>
            <div className="mt-4">
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
                razorpayEnabled={razorpayEnabled}
              />
            </div>
          </section>

          {/* honeypot — invisible to humans, tempting to bots (§13) */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto size-px overflow-hidden"
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <TurnstileWidget onToken={setTurnstileToken} />
        </div>

        <div className="mt-6 lg:sticky lg:top-32 lg:mt-0">
          <OrderSummary
            lines={items.map((i) => ({
              name: i.name,
              price: i.price,
              qty: i.qty,
            }))}
            showLines
          />
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-4 w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
                Placing order…
              </>
            ) : paymentMethod === PAYMENT_METHODS.COD ? (
              <>Place Order · {formatINR(totals.total)}</>
            ) : (
              <>Pay {formatINR(totals.total)}</>
            )}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <LockKeyhole className="size-3.5" aria-hidden />
            Prices are re-verified securely at order time.
          </p>
        </div>
      </form>
    </div>
  );
}
