import { computeTotals, type PricedLine } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NamedLine = PricedLine & { name?: string };

// ONE component for cart, checkout and confirmation — the math is computed
// by lib/pricing, never re-implemented per page (§7.5). Pages that already
// hold server-computed totals (order confirmation) pass `totals` directly.
export function OrderSummary({
  lines,
  totals,
  showLines = false,
  className,
}: {
  lines?: NamedLine[];
  totals?: { subtotal: number; shippingFee: number; total: number };
  showLines?: boolean;
  className?: string;
}) {
  const t = totals ?? computeTotals(lines ?? []);

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
      <p className="mt-2 text-xs text-gray-500">Inclusive of all taxes</p>
    </div>
  );
}
