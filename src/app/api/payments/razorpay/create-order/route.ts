import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackOrderSchema } from "@/lib/validations/order";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/lib/api";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "@/lib/constants";

// POST /api/payments/razorpay/create-order
// Creates the Razorpay order using the SERVER-computed total stored on the
// order row — the client's number is never used (§10, §13). Authenticated
// the same way as order lookup: orderNumber + matching phone.

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit("rp-create", clientIp(req), 10, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    if (!isRazorpayConfigured()) {
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
      order.paymentMethod !== PAYMENT_METHODS.RAZORPAY
    ) {
      return apiError("Order not found.", 404);
    }
    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return apiError("This order is already paid.", 400);
    }

    const amountPaise = order.total * 100; // server total — never the client's

    let razorpayOrderId = order.razorpayOrderId;
    if (!razorpayOrderId) {
      const rpOrder = await getRazorpay().orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: order.orderNumber,
        notes: { orderNumber: order.orderNumber },
      });
      razorpayOrderId = rpOrder.id;
      await db.order.update({
        where: { id: order.id },
        data: { razorpayOrderId },
      });
    }

    return NextResponse.json({
      razorpayOrderId,
      amount: amountPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return serverErrorResponse(err, "api/payments/razorpay/create-order");
  }
}
