import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { trackOrderSchema } from "@/lib/validations/order";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";
import {
  createCheckout,
  isSprintPGXConfigured,
  SprintPGXError,
} from "@/server/sprintpgx";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "@/lib/constants";

// POST /api/payments/sprintpgx/create-checkout
// Same auth + amount-truth pattern as the Razorpay/PayU create-order routes.
// NOTE: this only creates the checkout session and returns a redirect URL —
// there is no confirmed way (yet) to verify SprintPGX's payment outcome, so
// the order stays PENDING after redirect. See src/server/sprintpgx.ts.

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit("sprintpgx-create", clientIp(req), 10, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    if (!isSprintPGXConfigured()) {
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
      order.paymentMethod !== PAYMENT_METHODS.SPRINTPGX
    ) {
      return apiError("Order not found.", 404);
    }
    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return apiError("This order is already paid.", 400);
    }

    const { checkoutUrl, transactionId } = await createCheckout({
      orderId: order.orderNumber,
      amount: order.total,
      currency: "INR",
    });

    if (transactionId) {
      await db.order.update({
        where: { id: order.id },
        data: { sprintpgxTransactionId: transactionId },
      });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    if (err instanceof SprintPGXError) {
      console.error("[sprintpgx-create-checkout]", err.message);
      return apiError(
        "Couldn't start SprintPGX checkout — you can place the order again with Cash on Delivery.",
        502
      );
    }
    return serverErrorResponse(err, "api/payments/sprintpgx/create-checkout");
  }
}
