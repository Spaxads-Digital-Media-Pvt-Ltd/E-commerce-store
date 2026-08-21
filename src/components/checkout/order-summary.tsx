import { computeTotals, type PricedLine, type Totals } from "@/lib/pricing";
import { GST_RATE_PERCENT, MEMBERSHIP_LABEL } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NamedLine = PricedLine & { name?: string };

// ONE component for cart, checkout and confirmation — the math is computed
// by lib/pricing, never re-implemented per page (§7.5). Pages that already
// hold server-computed totals (order confirmation) pass `totals` directly.
export function OrderSummary({
  lines,
  totals,
  discount = 0,
  membershipFee = 0,
  couponCode,
  showLines = false,
  className,
}: {
  lines?: NamedLine[];
  totals?: Totals;
  discount?: number;
  membershipFee?: number;
  couponCode?: string | null;
  showLines?: boolean;
  className?: string;
}) {
  const t = totals ?? computeTotals(lines ?? [], discount, membershipFee);
  // GST breakup (extracted — the total is unchanged). Solution-1 view: the
  // 18% slice is shown as a coupon amount; the remainder is the sale price.
  const salePrice = t.total - t.gst;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-canvas p-5",
        className
      )}
    >
      <h2 className="font-display text-lg font-bold">Order Summary</h2>

      {showLines && lines?.length ? (
        <ul className="mt-3 space-y-2 border-b border-gray-200 pb-3">
          {lines.map((line, i) => (
            <li
              key={`${line.name}-${i}`}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="min-w-0 flex-1 truncate text-gray-500">
                {line.name ?? "Item"}{" "}
                <span className="font-mono text-xs">×{line.qty}</span>
              </span>
              <span className="shrink-0 font-medium">
                {formatINR(line.price * line.qty)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className="font-medium">{formatINR(t.subtotal)}</dd>
        </div>
        {t.discount > 0 ? (
          <div className="flex justify-between">
            <dt className="text-mehendi">
              Coupon{couponCode ? ` (${couponCode})` : ""}
            </dt>
            <dd className="font-semibold text-mehendi">
              −{formatINR(t.discount)}
            </dd>
          </div>
        ) : null}
        {t.membershipFee > 0 ? (
          <div className="flex justify-between">
            <dt className="text-gray-500">{MEMBERSHIP_LABEL}</dt>
            <dd className="font-medium">{formatINR(t.membershipFee)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-gray-500">Delivery</dt>
          <dd
            className={cn(
              "font-medium",
              t.shippingFee === 0 && "font-semibold text-mehendi"
            )}
          >
            {t.shippingFee === 0 ? "FREE" : formatINR(t.shippingFee)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <dt className="font-display text-base font-bold">Total</dt>
          <dd className="font-display text-base font-bold">
            {formatINR(t.total)}
          </dd>
        </div>
      </dl>

      {/* GST / coupon breakup — extracted from the total (total unchanged). */}
      {t.total > 0 ? (
        <div className="mt-3 space-y-1 rounded-xl bg-canvas-alt px-3 py-2.5 text-xs text-gray-500">
          <p className="font-semibold text-ink/70">
            Price breakup (included in total)
          </p>
          <div className="flex justify-between">
            <span>Sale price</span>
            <span className="font-medium">{formatINR(salePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Coupon ({GST_RATE_PERCENT}%)</span>
            <span className="font-medium text-mehendi">{formatINR(t.gst)}</span>
          </div>
        </div>
      ) : null}
      <p className="mt-2 text-xs text-gray-500">Inclusive of all taxes</p>
    </div>
  );
}
