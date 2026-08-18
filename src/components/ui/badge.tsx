import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-marigold/15 text-marigold-deep",
        sindoor: "bg-sindoor text-canvas",
        mehendi: "bg-mehendi text-canvas",
        outline: "border border-gray-200 text-gray-500",
        ink: "bg-ink text-canvas",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
