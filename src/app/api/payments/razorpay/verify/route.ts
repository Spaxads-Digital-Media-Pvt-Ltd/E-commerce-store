import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/lib/api";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";
import { toOrderDTO } from "@/lib/serializers";

// POST /api/payments/razorpay/verify — immediate post-checkout verification
// (the webhook is the safety net for missed callbacks). The payment is only
// marked PAID after the HMAC signature checks out server-side (§10).

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(256),
  razorpay_payment_id: z.string().min(1).max(256),
  razorpay_signature: z.string().min(1).max(512),
});

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit("rp-verify", clientIp(req), 10, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const input = parsed.data;

    const order = await db.order.findUnique({
      where: { razorpayOrderId: input.razorpay_order_id },
    });
    if (!order) return apiError("Order not found.", 404);

    const valid = verifyPaymentSignature({
      razorpayOrderId: input.razorpay_order_id,
      razorpayPaymentId: input.razorpay_payment_id,
      signature: input.razorpay_signature,
    });
    if (!valid) {
      console.warn(
        `[rp-verify] signature mismatch for order ${order.orderNumber}`
      );
      return apiError("Payment verification failed.", 400);
    }

    await db.order.updateMany({
      where: { id: order.id, paymentStatus: { not: PAYMENT_STATUS.PAID } },
      data: { paymentStatus: PAYMENT_STATUS.PAID, status: ORDER_STATUS.PLACED },
    });

    const updated = await db.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: { select: { slug: true } } } } },
    });

    return NextResponse.json({ order: toOrderDTO(updated!) });
  } catch (err) {
    return serverErrorResponse(err, "api/payments/razorpay/verify");
  }
}
