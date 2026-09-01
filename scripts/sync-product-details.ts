import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../prisma/seed-data";

// One-off/idempotent: syncs description + sizes + attributes from seed-data
// into the DB WITHOUT touching stock, price, images, or ratings — so it's
// safe to run against a live store. Re-run any time seed-data changes.

const db = new PrismaClient();

async function main() {
  let updated = 0;
  let withSizes = 0;
  for (const p of PRODUCTS) {
    const sizes = p.sizes?.length ? JSON.stringify(p.sizes) : null;
    const attributes =
      p.attributes && Object.keys(p.attributes).length
        ? JSON.stringify(p.attributes)
        : null;
    if (sizes) withSizes++;
    try {
      await db.product.update({
        where: { slug: p.slug },
        data: { description: p.description, sizes, attributes },
      });
      updated++;
    } catch (e) {
      console.error("FAIL", p.slug, (e as Error).message.split("\n")[0]);
    }
  }
  console.log(
    `Synced ${updated}/${PRODUCTS.length} products · ${withSizes} now have sizes.`
  );
  await db.$disconnect();
}

main();
