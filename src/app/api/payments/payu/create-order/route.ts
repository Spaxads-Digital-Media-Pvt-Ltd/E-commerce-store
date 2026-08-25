import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { trackOrderSchema } from "@/lib/validations/order";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";
import {
  buildRequestHash,
  getPayUActionUrl,
  isPayUConfigured,
} from "@/server/payu";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "@/lib/constants";

// POST /api/payments/payu/create-order
// Same auth + amount-truth pattern as the Razorpay create-order route: the
// order is looked up by orderNumber + matching phone, and the amount signed
// into the hash is the SERVER-stored total, never a client-supplied number.
//
// PayU's txnid is the orderNumber itself (already unique in our DB) — a
// retry after a failed attempt reuses it rather than minting a new one,
// mirroring how the Razorpay route reuses razorpayOrderId.

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit("payu-create", clientIp(req), 10, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    if (!isPayUConfigured()) {
      return apiError("Online payment is currently unavailable.", 503);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = trackOrderSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const order = await db.order.findUnique({
      where: { orderNumber: parsed.data.orderNumber },
    });
    if (
      !order ||
      order.phone !== parsed.data.phone ||
      order.paymentMethod !== PAYMENT_METHODS.PAYU
    ) {
      return apiError("Order not found.", 404);
    }
    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return apiError("This order is already paid.", 400);
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
      /\/+$/,
      ""
    );
    const callbackUrl = `${siteUrl}/api/payments/payu/callback`;

    const fields = {
      txnid: order.orderNumber,
      amount: order.total.toFixed(2), // order.total is whole rupees
      productinfo: `Order ${order.orderNumber}`,
      firstname: order.customerName.split(" ")[0] || order.customerName,
      // PayU requires an email; email is optional on our orders.
      email: order.email || `guest+${order.orderNumber}@${new URL(siteUrl).hostname}`,
    };

    const hash = buildRequestHash(fields);

    return NextResponse.json({
      action: getPayUActionUrl(),
      key: process.env.PAYU_MERCHANT_KEY,
      txnid: fields.txnid,
      amount: fields.amount,
      productinfo: fields.productinfo,
      firstname: fields.firstname,
      email: fields.email,
      phone: order.phone,
      surl: callbackUrl,
      furl: callbackUrl,
      hash,
      service_provider: "payu_paisa",
    });
  } catch (err) {
    return serverErrorResponse(err, "api/payments/payu/create-order");
  }
}
