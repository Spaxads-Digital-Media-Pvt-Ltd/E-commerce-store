"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import {
  selectCartCount,
  selectCartSubtotal,
  useCart,
} from "@/lib/cart-store";
import { COPY, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartLineItem } from "./cart-line-item";

export function CartDrawer() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const count = useCart(selectCartCount);
  const subtotal = useCart(selectCartSubtotal);
  const drawerOpen = useCart((s) => s.drawerOpen);
  const setDrawerOpen = useCart((s) => s.setDrawerOpen);

  const remainingForFree = FREE_SHIPPING_THRESHOLD - subtotal;

  function go(path: string) {
    setDrawerOpen(false);
    router.push(path);
  }

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>
            Your Cart{count > 0 ? ` (${count})` : ""}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review the items in your cart, then continue to checkout.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyState icon={ShoppingCart} title={COPY.emptyCartTitle}>
            <Button onClick={() => go("/categories")}>
              {COPY.emptyCartCta}
            </Button>
          </EmptyState>
        ) : (
          <>
            <div className="flex-1 divide-y divide-gray-200 overflow-y-auto px-5">
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} compact />
              ))}
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              {remainingForFree > 0 ? (
                <div className="mb-3">
                  <p className="text-xs font-medium text-marigold-deep">
                    Add {formatINR(remainingForFree)} more for FREE delivery
                  </p>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-marigold transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (subtotal / FREE_SHIPPING_THRESHOLD) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mb-3 text-xs font-semibold text-mehendi">
                  You&apos;ve unlocked FREE delivery
                </p>
              )}

              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-display text-lg font-bold">
                  {formatINR(subtotal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => go("/cart")}>
                  View Cart
                </Button>
                <Button onClick={() => go("/checkout")}>Checkout</Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function CartDrawerLink({ children }: { children: React.ReactNode }) {
  // convenience trigger for arbitrary children (not currently used by header,
  // which manages open state via the store)
  return <Link href="/cart">{children}</Link>;
}
