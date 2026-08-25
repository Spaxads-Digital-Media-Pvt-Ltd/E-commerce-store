import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyResponseHash } from "@/server/payu";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

// POST /api/payments/payu/callback — both PayU's surl and furl point here;
// the posted `status` field says which one it is. This is a browser POST
// originating from PayU's hosted page (not same-origin), so it's exempted
// from the CSRF same-origin check in middleware.ts and authenticated by the
// reverse hash instead — same trust model as the Razorpay webhook.
//
// Nothing is marked PAID before the hash verifies (§13 pattern, see
// src/server/razorpay.ts's webhook route for the sibling implementation).

export async function POST(req: NextRequest) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );

  try {
    const form = await req.formData();
    const get = (key: string) => String(form.get(key) ?? "");

    const txnid = get("txnid");
    const status = get("status");
    const hash = get("hash");
    const fields = {
      txnid,
      amount: get("amount"),
      productinfo: get("productinfo"),
      firstname: get("firstname"),
      email: get("email"),
    };

    if (!txnid || !hash) {
      return NextResponse.redirect(`${siteUrl}/checkout`, 303);
    }

    // txnid === orderNumber (see create-order/route.ts).
    const order = await db.order.findUnique({ where: { orderNumber: txnid } });
    if (!order) {
      return NextResponse.redirect(`${siteUrl}/checkout`, 303);
    }

    const valid = verifyResponseHash({ ...fields, status, hash });
    if (!valid) {
      console.warn(`[payu-callback] hash mismatch for order ${txnid}`);
      return NextResponse.redirect(
        `${siteUrl}/checkout/success/${order.orderNumber}?paid=0`,
        303
      );
    }

    if (status === "success") {
      await db.order.updateMany({
        where: { id: order.id, paymentStatus: { not: PAYMENT_STATUS.PAID } },
        data: { paymentStatus: PAYMENT_STATUS.PAID, status: ORDER_STATUS.PLACED },
      });
      return NextResponse.redirect(
        `${siteUrl}/checkout/success/${order.orderNumber}?paid=1`,
        303
      );
    }

    await db.order.updateMany({
      where: { id: order.id, paymentStatus: { not: PAYMENT_STATUS.PAID } },
      data: { paymentStatus: PAYMENT_STATUS.FAILED },
    });
    return NextResponse.redirect(
      `${siteUrl}/checkout/success/${order.orderNumber}?paid=0`,
      303
    );
  } catch (err) {
    console.error("[payu-callback] error", err);
    return NextResponse.redirect(`${siteUrl}/checkout`, 303);
  }
}
