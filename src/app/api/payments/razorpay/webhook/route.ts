import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { apiError, serverErrorResponse } from "@/server/api";
import { verifyWebhookSignature } from "@/server/razorpay";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

// POST /api/payments/razorpay/webhook
// Authenticated by HMAC signature over the RAW body — never the Origin
// header (this route is exempted from the same-origin middleware for exactly
// that reason). Nothing is trusted before the signature verifies (§13).

type RazorpayEvent = {
  event?: string;
  payload?: {
    payment?: { entity?: { order_id?: string } };
    order?: { entity?: { id?: string } };
  };
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return apiError("Webhook not configured.", 503);
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn("[rp-webhook] invalid signature");
      return apiError("Invalid signature.", 400);
    }

    let event: RazorpayEvent;
    try {
      event = JSON.parse(rawBody) as RazorpayEvent;
    } catch {
      return apiError("Invalid payload.", 400);
    }

    const rpOrderId =
      event.payload?.payment?.entity?.order_id ??
      event.payload?.order?.entity?.id;

    switch (event.event) {
      case "payment.captured":
      case "order.paid":
        if (rpOrderId) {
          // idempotent — replayed webhooks are no-ops
          await db.order.updateMany({
            where: {
              razorpayOrderId: rpOrderId,
              paymentStatus: { not: PAYMENT_STATUS.PAID },
            },
            data: {
              paymentStatus: PAYMENT_STATUS.PAID,
              status: ORDER_STATUS.PLACED,
            },
          });
        }
        break;
      case "payment.failed":
        if (rpOrderId) {
          await db.order.updateMany({
            where: {
              razorpayOrderId: rpOrderId,
              paymentStatus: { not: PAYMENT_STATUS.PAID },
            },
            data: { paymentStatus: PAYMENT_STATUS.FAILED },
          });
        }
        break;
      default:
        // unhandled event types are acknowledged and ignored
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return serverErrorResponse(err, "api/payments/razorpay/webhook");
  }
}
