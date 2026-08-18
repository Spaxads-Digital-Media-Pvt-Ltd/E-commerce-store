import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingBadge({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  if (rating <= 0) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <span className="inline-flex items-center gap-0.5 rounded-md bg-mehendi px-1.5 py-0.5 font-semibold text-canvas">
        {rating.toFixed(1)}
        <Star aria-hidden className="size-3 fill-current" />
      </span>
      {typeof count === "number" ? (
        <span className="text-gray-500">({count.toLocaleString("en-IN")})</span>
      ) : null}
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5</span>
    </span>
  );
}
