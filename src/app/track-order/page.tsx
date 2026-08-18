import type { Metadata } from "next";
import { TrackOrderClient } from "./track-order-client";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Check your order status with your order number and phone number — no login needed.",
  alternates: { canonical: "/track-order" },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TrackOrderPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.orderNumber;
  const initialOrderNumber = (Array.isArray(raw) ? raw[0] : raw) ?? "";

  return <TrackOrderClient initialOrderNumber={initialOrderNumber.slice(0, 40)} />;
}
