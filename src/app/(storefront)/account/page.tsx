import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { db } from "@/server/db";
import { requireUser } from "@/server/auth/session";
import { ORDER_STATUS } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

const STATUS_BADGE: Record<string, "default" | "mehendi" | "sindoor" | "outline"> = {
  [ORDER_STATUS.PENDING_PAYMENT]: "outline",
  [ORDER_STATUS.PLACED]: "default",
  [ORDER_STATUS.CONFIRMED]: "default",
  [ORDER_STATUS.SHIPPED]: "default",
  [ORDER_STATUS.DELIVERED]: "mehendi",
  [ORDER_STATUS.CANCELLED]: "sindoor",
};

export default async function AccountPage() {
  const session = await requireUser("/account");

  const [user, orders] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: session.userId } }),
    db.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        My Account
      </h1>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-canvas p-5">
        <div>
          <p className="font-semibold text-ink">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">
        Your orders
      </h2>

      {orders.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={PackageSearch}
            title="No orders yet"
            description="Everything you order will show up here."
          />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200">
          {orders.map((order) => (
            <li key={order.orderNumber}>
              <Link
                href={`/account/orders/${order.orderNumber}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-canvas-alt"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-ink">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_BADGE[order.status] ?? "outline"}>
                    {order.status.replaceAll("_", " ")}
                  </Badge>
                  <p className="font-display text-sm font-bold">
                    {formatINR(order.total)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
