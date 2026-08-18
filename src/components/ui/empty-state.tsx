import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Reused for empty cart, empty search results, and no order found (§7.5).
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-canvas-alt">
        <Icon aria-hidden className="size-8 text-marigold-deep" />
      </div>
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      {description ? (
        <p className="max-w-sm text-sm text-gray-500">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
