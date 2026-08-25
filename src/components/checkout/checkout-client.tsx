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
  MEMBERSHIP_FEE,
  MEMBERSHIP_LABEL,
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
  payuEnabled,
  defaultName,
  defaultEmail,
}: {
  payuEnabled: boolean;
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
  // Coupon state — the discount is confirmed server-side; this is display-only.
  const [couponInput, setCouponInput] = React.useState("");
  const [couponCode, setCouponCode] = React.useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [membership, setMembership] = React.useState(false);
  // One idempotency key per checkout ATTEMPT: a double-tap or a
  // retry-on-timeout with the SAME payment method returns the SAME order
  // server-side (§13). It must be regenerated when the payment method
  // changes, though — otherwise /api/orders' idempotent replay hands back
  // the order created under the OLD method (e.g. a failed SprintPGX attempt
  // left a PENDING order behind; switching to PayU and submitting again
  // would silently resume that SprintPGX order instead of starting a PayU
  // one, since the key alone decides which row comes back).
  function generateIdempotencyKey(): string {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`.padEnd(36, "0");
  }
  const idempotencyKey = React.useRef<string>(generateIdempotencyKey());

  function handlePaymentMethodChange(method: PaymentMethod) {
    idempotencyKey.current = generateIdempotencyKey();
    setPaymentMethod(method);
  }

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
    items.map((i) => ({ price: i.price, qty: i.qty })),
    couponDiscount,
    membership ? MEMBERSHIP_FEE : 0
  );

  async function applyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    const cartItems = useCart.getState().items;
    if (cartItems.length === 0) {
      setCouponError("Add items to your cart first.");
      return;
    }
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code,
          items: cartItems.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.valid) {
        setCouponCode(data.code as string);
        setCouponDiscount(data.discount as number);
        setCouponInput(data.code as string);
        toast.success(`Coupon applied — ${formatINR(data.discount)} off`);
      } else {
        setCouponCode(null);
        setCouponDiscount(0);
        setCouponError(
          typeof data.error === "string"
            ? data.error
            : "This coupon code isn't valid."
        );
      }
    } catch {
      setCouponError("Couldn't check the coupon — please try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCouponCode(null);
    setCouponDiscount(0);
    setCouponInput("");
    setCouponError(null);
  }

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

  // PayU and SprintPGX both redirect the whole browser away to the
  // gateway's hosted page rather than opening an in-page modal like
  // Razorpay, so there's no client-side callback to hand a fresh order back
  // to finishSuccess() when the customer returns. Snapshot what we know now
  // (still PENDING) so the success page has something to render; the actual
  // paid/failed outcome is decided server-side by each gateway's own
  // callback route before the browser lands back on that page.
  function snapshotPendingOrder(order: OrderDTO) {
    try {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {
      // storage full/blocked — success page falls back to track-order
    }
  }

  async function startPayUPayment(order: OrderDTO) {
    const res = await fetch("/api/payments/payu/create-order", {
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

    snapshotPendingOrder(order);

    // PayU's merchant-hosted flow is a plain HTML form POST to their
    // action URL — build one and submit it to navigate the browser there.
    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.action;
    const fieldNames = [
      "key",
      "txnid",
      "amount",
      "productinfo",
      "firstname",
      "email",
      "phone",
      "surl",
      "furl",
      "hash",
      "service_provider",
    ] as const;
    for (const name of fieldNames) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(data[name] ?? "");
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }

  async function startSprintPGXPayment(order: OrderDTO) {
    const res = await fetch("/api/payments/sprintpgx/create-checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        phone: order.phone,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.checkoutUrl) {
      toast.error(
        data.error ??
          "Couldn't start the online payment — you can place the order again with Cash on Delivery."
      );
      setSubmitting(false);
      return;
    }

    snapshotPendingOrder(order);
    window.location.href = data.checkoutUrl as string;
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
          couponCode: couponCode ?? undefined,
          membership: membership || undefined,
          idempotencyKey: idempotencyKey.current,
          // display-honesty check only; never used for charging
          expectedTotal: computeTotals(
            cartItems.map((i) => ({ price: i.price, qty: i.qty })),
            couponDiscount,
            membership ? MEMBERSHIP_FEE : 0
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
        if (order.paymentStatus !== "PAID") {
          if (order.paymentMethod === PAYMENT_METHODS.RAZORPAY) {
            await startRazorpayPayment(order);
            return;
          }
          if (order.paymentMethod === PAYMENT_METHODS.PAYU) {
            await startPayUPayment(order);
            return;
          }
          if (order.paymentMethod === PAYMENT_METHODS.SPRINTPGX) {
            await startSprintPGXPayment(order);
            return;
          }
        }
        finishSuccess(order);
        return;
      }

      if (res.status === 409 && Array.isArray(data.cart)) {
        useCart.getState().replaceItems(data.cart as CartItem[]);
        if (data.couponInvalid) {
          setCouponCode(null);
          setCouponDiscount(0);
          setCouponError(
            typeof data.error === "string"
              ? data.error
              : "Coupon could not be applied."
          );
        }
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
                onChange={handlePaymentMethodChange}
                payuEnabled={payuEnabled}
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
          <div className="mb-4 rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-ink">Have a coupon?</p>
            {couponCode ? (
              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-mehendi/10 px-3 py-2">
                <span className="text-sm font-medium text-mehendi">
                  {couponCode} applied · {formatINR(couponDiscount)} off
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-gray-500 hover:text-sindoor"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <label htmlFor="coupon" className="sr-only">
                  Coupon code
                </label>
                <Input
                  id="coupon"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCoupon();
                    }
                  }}
                  placeholder="Enter code"
                  autoComplete="off"
                  autoCapitalize="characters"
                  className="uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                >
                  {couponLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            )}
            {couponError ? (
              <p role="alert" className="mt-1.5 text-xs font-medium text-sindoor">
                {couponError}
              </p>
            ) : null}
          </div>

          <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4 transition-colors hover:border-gray-300">
            <input
              type="checkbox"
              checked={membership}
              onChange={(e) => setMembership(e.target.checked)}
              className="mt-0.5 size-4.5 shrink-0 accent-marigold-deep"
            />
            <div className="flex-1">
              <p className="flex items-center justify-between gap-2 font-semibold text-ink">
                <span>Add {MEMBERSHIP_LABEL}</span>
                <span className="text-marigold-deep">
                  +{formatINR(MEMBERSHIP_FEE)}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                Optional — faster support and early access to deals. You can skip
                it.
              </p>
            </div>
          </label>

          <OrderSummary
            lines={items.map((i) => ({
              name: i.name,
              price: i.price,
              qty: i.qty,
            }))}
            discount={couponDiscount}
            membershipFee={membership ? MEMBERSHIP_FEE : 0}
            couponCode={couponCode}
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
