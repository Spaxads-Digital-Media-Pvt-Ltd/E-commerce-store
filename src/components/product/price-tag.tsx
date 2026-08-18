import { cn, discountPercent, formatINR } from "@/lib/utils";

// Price + strikethrough MRP + "% off" — the money row used on cards, PDP
// and cart lines so the presentation never drifts.
export function PriceTag({
  price,
  mrp,
  size = "md",
  className,
}: {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const off = discountPercent(mrp, price);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-display font-bold text-ink",
          size === "sm" && "text-base",
          size === "md" && "text-lg",
          size === "lg" && "text-3xl"
        )}
      >
        {formatINR(price)}
      </span>
      {off > 0 ? (
        <>
          <s
            className={cn(
              "text-gray-500",
              size === "lg" ? "text-base" : "text-xs"
            )}
          >
            {formatINR(mrp)}
          </s>
          <span
            className={cn(
              "font-semibold text-sindoor",
              size === "lg" ? "text-base" : "text-xs"
            )}
          >
            {off}% off
          </span>
        </>
      ) : null}
    </div>
  );
}
