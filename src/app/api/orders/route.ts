import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { getSession } from "@/server/auth/session";
import { createOrderSchema } from "@/lib/validations/order";
import { computeTotals } from "@/lib/pricing";
import { generateOrderNumber } from "@/server/order-number";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { verifyTurnstile } from "@/server/turnstile";
import { parseImages, parseSizes, toOrderDTO } from "@/server/serializers";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";
import {
  MAX_QTY_PER_ITEM,
  MEMBERSHIP_FEE,
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from "@/lib/constants";
import { isRazorpayConfigured } from "@/server/razorpay";
import { isPayUConfigured } from "@/server/payu";
import { isSprintPGXConfigured } from "@/server/sprintpgx";
import { evaluateCoupon } from "@/server/coupons";

// ────────────────────────────────────────────────────────────────────────
// POST /api/orders — the money-integrity core (blueprint §10, §13).
//
// The client sends ONLY productId+qty pairs (plus customer details). The
// server:
//   1. re-fetches every product's current price & stock from the DB,
//   2. recomputes subtotal/shipping/total,
//   3. rejects with a corrected cart (409) if anything changed vs. what the
//      shopper saw — never silently charges a different amount,
//   4. creates Order+OrderItems and decrements stock in ONE transaction,
//      with a stock >= qty guard so concurrent checkouts can't oversell,
//   5. is idempotent per client-generated key — a double-tap or a
//      retry-on-timeout returns the same order instead of creating two.
// ────────────────────────────────────────────────────────────────────────

class OutOfStockError extends Error {
  constructor(public productName: string) {
    super(`Out of stock: ${productName}`);
  }
}

const isUniqueViolation = (err: unknown): boolean =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";

const orderIncludes = {
  items: { include: { product: { select: { slug: true } } } },
} as const;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("Please log in to place an order.", 401);
    }

    const ip = clientIp(req);

    // A handful of orders per minute is plenty for a real shopper (§13).
    const limited = await rateLimit("orders", ip, 5, 60);
    if (!limited.success) {
      return apiError(
        "Too many order attempts — please wait a minute and try again.",
        429
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const input = parsed.data;

    // Honeypot: humans never see the field — any value means a bot.
    // Deliberately generic response.
    if (input.website) return apiError("Something went wrong.", 400);

    const turnstile = await verifyTurnstile(input.turnstileToken, ip);
    if (!turnstile.ok) {
      return apiError(
        "Human verification failed — refresh the page and try again.",
        403
      );
    }

    const onlineMethodConfigured: Record<string, () => boolean> = {
      [PAYMENT_METHODS.RAZORPAY]: isRazorpayConfigured,
      [PAYMENT_METHODS.PAYU]: isPayUConfigured,
      [PAYMENT_METHODS.SPRINTPGX]: isSprintPGXConfigured,
    };
    const isConfiguredCheck = onlineMethodConfigured[input.paymentMethod];
    if (isConfiguredCheck && !isConfiguredCheck()) {
      return apiError(
        "Online payment is currently unavailable — please use Cash on Delivery.",
        400
      );
    }

    // Idempotency replay?
    const existing = await db.order.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      include: orderIncludes,
    });
    if (existing) {
      return NextResponse.json(
        { order: toOrderDTO(existing), idempotent: true },
        { status: 200 }
      );
    }

    // Merge duplicate lines by (product + size) and cap each line's qty.
    type ReqLine = { productId: string; size: string | null; qty: number };
    const lineMap = new Map<string, ReqLine>();
    for (const item of input.items) {
      const size = item.size?.trim() || null;
      const key = `${item.productId}::${size ?? ""}`;
      const prev = lineMap.get(key);
      lineMap.set(key, {
        productId: item.productId,
        size,
        qty: Math.min((prev?.qty ?? 0) + item.qty, MAX_QTY_PER_ITEM),
      });
    }
    const requested = [...lineMap.values()];

    // ---- server truth: current price, stock & sizes ----
    const products = await db.product.findMany({
      where: {
        id: { in: [...new Set(requested.map((r) => r.productId))] },
        isActive: true,
      },
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    const removedNames: string[] = [];
    // Stock is per-product (single count shared across sizes) — draw it down
    // as we allocate across a product's size lines so we can never oversell.
    const remaining = new Map<string, number>();
    for (const p of products) remaining.set(p.id, p.stock);

    const available: {
      product: (typeof products)[number];
      qty: number;
      size: string | null;
    }[] = [];
    for (const r of requested) {
      const product = productById.get(r.productId);
      if (!product) {
        removedNames.push("An unavailable item");
        continue;
      }
      // Size rules: a product WITH sizes requires a valid chosen size; a
      // product without sizes ignores any size sent.
      const sizes = parseSizes(product.sizes);
      let size: string | null = null;
      if (sizes.length > 0) {
        if (!r.size || !sizes.includes(r.size)) {
          removedNames.push(`${product.name} (choose a valid size)`);
          continue;
        }
        size = r.size;
      }
      const left = remaining.get(product.id) ?? 0;
      if (left <= 0) {
        removedNames.push(product.name);
        continue;
      }
      const qty = Math.min(r.qty, left);
      remaining.set(product.id, left - qty);
      available.push({ product, qty, size });
    }

    const correctedCart = available.map(({ product, qty, size }) => ({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: parseImages(product.images)[0] ?? "",
      qty,
      stock: product.stock,
      size,
    }));
    // Coupon: re-validated server-side against the DB subtotal. The client
    // only sends the code; the discount is computed here, never trusted (§13).
    const subtotalForCoupon = available.reduce(
      (s, a) => s + a.product.price * a.qty,
      0
    );
    let discount = 0;
    let appliedCouponCode: string | null = null;
    let couponError: string | null = null;
    if (input.couponCode) {
      const result = evaluateCoupon(input.couponCode, subtotalForCoupon);
      if (result.ok) {
        discount = result.discount;
        appliedCouponCode = result.coupon.code;
      } else {
        couponError = result.error;
      }
    }

    const membershipFee = input.membership ? MEMBERSHIP_FEE : 0;
    const totals = computeTotals(
      available.map((a) => ({ price: a.product.price, qty: a.qty })),
      discount,
      membershipFee
    );

    const qtyChanged = available.some(
      (a) => a.qty !== lineMap.get(`${a.product.id}::${a.size ?? ""}`)?.qty
    );
    const totalDrifted =
      typeof input.expectedTotal === "number" &&
      input.expectedTotal !== totals.total;

    // Never silently charge a different amount than what was shown (§10), and
    // surface an invalid/expired coupon instead of dropping it silently.
    if (removedNames.length > 0 || qtyChanged || totalDrifted || couponError) {
      return NextResponse.json(
        {
          error:
            couponError ??
            "Some items in your cart changed — we've updated it. Please review and place the order again.",
          cart: correctedCart,
          removed: removedNames,
          totals,
          couponInvalid: Boolean(couponError),
        },
        { status: 409 }
      );
    }

    if (available.length === 0) {
      return apiError("Your cart is empty — let's fix that.", 400);
    }

    const isCod = input.paymentMethod === PAYMENT_METHODS.COD;

    // ---- transactional create + guarded stock decrement ----
    let attempts = 0;
    for (;;) {
      attempts++;
      const orderNumber = generateOrderNumber();
      try {
        // Total units per product across its size lines — decrement once,
        // guarded, so concurrent checkouts can't oversell.
        const qtyByProduct = new Map<string, number>();
        for (const a of available) {
          qtyByProduct.set(
            a.product.id,
            (qtyByProduct.get(a.product.id) ?? 0) + a.qty
          );
        }

        const order = await db.$transaction(async (tx) => {
          for (const [productId, totalQty] of qtyByProduct) {
            const res = await tx.product.updateMany({
              where: { id: productId, isActive: true, stock: { gte: totalQty } },
              data: { stock: { decrement: totalQty } },
            });
            // count === 0 → a concurrent checkout took the last units
            if (res.count === 0) {
              throw new OutOfStockError(
                productById.get(productId)?.name ?? "an item"
              );
            }
          }

          return tx.order.create({
            data: {
              orderNumber,
              userId: session.userId,
              customerName: input.customer.customerName,
              phone: input.customer.phone,
              email: input.customer.email || null,
              addressLine1: input.customer.addressLine1,
              addressLine2: input.customer.addressLine2 || null,
              city: input.customer.city,
              state: input.customer.state,
              pincode: input.customer.pincode,
              subtotal: totals.subtotal,
              shippingFee: totals.shippingFee,
              discount: totals.discount,
              couponCode: appliedCouponCode,
              membershipFee: totals.membershipFee,
              total: totals.total,
              paymentMethod: input.paymentMethod,
              paymentStatus: PAYMENT_STATUS.PENDING,
              status: isCod
                ? ORDER_STATUS.PLACED
                : ORDER_STATUS.PENDING_PAYMENT,
              idempotencyKey: input.idempotencyKey,
              items: {
                create: available.map(({ product, qty, size }) => ({
                  productId: product.id,
                  // snapshot name/price/size at time of order (§10)
                  name: product.name,
                  price: product.price,
                  qty,
                  image: parseImages(product.images)[0] ?? "",
                  size,
                })),
              },
            },
            include: orderIncludes,
          });
        });

        return NextResponse.json({ order: toOrderDTO(order) }, { status: 201 });
      } catch (err) {
        if (err instanceof OutOfStockError) {
          return apiError(
            `"${err.productName}" just went out of stock — refresh your cart and try again.`,
            409
          );
        }
        if (isUniqueViolation(err)) {
          // Raced double-submit on the same idempotency key → return the
          // order the other request created.
          const raced = await db.order.findUnique({
            where: { idempotencyKey: input.idempotencyKey },
            include: orderIncludes,
          });
          if (raced) {
            return NextResponse.json(
              { order: toOrderDTO(raced), idempotent: true },
              { status: 200 }
            );
          }
          // Otherwise it was an orderNumber collision — regenerate and retry.
          if (attempts < 4) continue;
        }
        throw err;
      }
    }
  } catch (err) {
    return serverErrorResponse(err, "api/orders");
  }
}
