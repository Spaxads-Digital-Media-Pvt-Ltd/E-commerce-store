import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/server/db";
import { requireUser } from "@/server/auth/session";
import { toOrderDTO } from "@/server/serializers";
import { OrderDetails } from "@/components/order/order-details";

export const metadata: Metadata = {
  title: "Order details",
  robots: { index: false },
};

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await requireUser(`/account/orders/${orderNumber}`);

  // Scoped to the logged-in user — never look up by orderNumber alone.
  const order = await db.order.findFirst({
    where: { orderNumber, userId: session.userId },
    include: { items: { include: { product: { select: { slug: true } } } } },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/account"
        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-marigold-deep"
      >
        <ChevronLeft className="size-4" aria-hidden />
        My Account
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
        Order {order.orderNumber}
      </h1>
      <div className="mt-6">
        <OrderDetails order={toOrderDTO(order)} />
      </div>
    </div>
  );
}
