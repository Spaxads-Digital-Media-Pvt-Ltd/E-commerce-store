"use client";

import { Banknote, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// COD is the default/primary method for a guest checkout in India (§1);
// "Pay Online" is offered when Razorpay (test mode) is configured.
export function PaymentMethodSelector({
  value,
  onChange,
  razorpayEnabled,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  razorpayEnabled: boolean;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as PaymentMethod)}
      aria-label="Payment method"
      className="gap-3"
    >
      <label
        htmlFor="pay-cod"
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
          value === "COD"
            ? "border-marigold bg-marigold/5"
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        <RadioGroupItem id="pay-cod" value="COD" className="mt-0.5" />
        <div className="flex-1">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Banknote className="size-4 text-mehendi" aria-hidden />
            Cash on Delivery
            <Badge variant="mehendi">Recommended</Badge>
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            Pay in cash when your order arrives. No advance payment.
          </p>
        </div>
      </label>

      <label
        htmlFor="pay-online"
        className={cn(
          "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
          !razorpayEnabled
            ? "cursor-not-allowed opacity-60"
            : value === "RAZORPAY"
              ? "cursor-pointer border-marigold bg-marigold/5"
              : "cursor-pointer border-gray-200 hover:border-gray-300"
        )}
      >
        <RadioGroupItem
          id="pay-online"
          value="RAZORPAY"
          disabled={!razorpayEnabled}
          className="mt-0.5"
        />
        <div className="flex-1">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <CreditCard className="size-4 text-marigold-deep" aria-hidden />
            Pay Online
            {razorpayEnabled ? (
              <Badge variant="outline">Test mode</Badge>
            ) : null}
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            {razorpayEnabled
              ? "UPI, cards or netbanking — secure checkout via Razorpay."
              : "Currently unavailable — Cash on Delivery works!"}
          </p>
        </div>
      </label>
    </RadioGroup>
  );
}
