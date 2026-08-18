import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-marigold text-ink hover:bg-marigold-deep active:bg-marigold-deep",
        outline:
          "border border-gray-200 bg-canvas text-ink hover:border-marigold hover:text-marigold-deep",
        ghost: "text-ink hover:bg-canvas-alt",
        dark: "bg-ink text-canvas hover:bg-ink/90",
        success: "bg-mehendi text-canvas hover:bg-mehendi/90",
        link: "text-marigold-deep underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-sm [&_svg]:size-4",
        sm: "h-9 px-3 text-xs [&_svg]:size-3.5",
        lg: "h-12 px-7 text-base [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
