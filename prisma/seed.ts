import "dotenv/config"; // load .env into process.env so S3_* vars are visible
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { CATEGORIES, PRODUCTS } from "./seed-data";

const prisma = new PrismaClient();

// Real product photos live in public/images/products named `<slug>-<n>.<ext>`
// (e.g. wireless-tws-earbuds-1.jpg). Any product with matching files gets
// them automatically on re-seed — no code changes needed when adding photos.
const IMAGES_DIR = path.join(__dirname, "..", "public", "images", "products");

// When S3 is configured (after `npm run images:upload`), the seed stores S3
// URLs in the DB instead of local /images paths. Kept identical to
// scripts/upload-images-to-s3.ts and next.config.ts.
function s3PublicBase(): string | null {
  const explicit = process.env.S3_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (explicit) return explicit;
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (bucket && region) return `https://${bucket}.s3.${region}.amazonaws.com`;
  return null;
}

const S3_BASE = s3PublicBase();
const S3_PREFIX = (process.env.S3_KEY_PREFIX ?? "products").replace(
  /^\/+|\/+$/g,
  ""
);

function urlForImageFile(file: string): string {
  return S3_BASE
    ? `${S3_BASE}/${S3_PREFIX}/${file}`
    : `/images/products/${file}`;
}

function localImagesFor(slug: string): string[] {
  let files: string[];
  try {
    files = fs.readdirSync(IMAGES_DIR);
  } catch {
    return [];
  }
  const pattern = new RegExp(`^${slug}-(\\d+)\\.(jpe?g|png|webp|avif)$`, "i");
  return files
    .map((f) => ({ f, m: f.match(pattern) }))
    .filter((x): x is { f: string; m: RegExpMatchArray } => x.m !== null)
    .sort((a, b) => Number(a.m[1]) - Number(b.m[1]))
    .map((x) => urlForImageFile(x.f));
}

// Deterministic pseudo-random from a slug, so re-seeding never churns data.
function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const ratingFor = (slug: string) =>
  Math.round((3.8 + (hashSlug(slug) % 11) / 10) * 10) / 10; // 3.8 – 4.8

const ratingCountFor = (slug: string) => 25 + (hashSlug(slug + "-count") % 875);

const stockFor = (slug: string) => 8 + (hashSlug(slug + "-stock") % 56); // 8 – 63

// Placeholder strategy per blueprint §6.4: deterministic picsum seeds per
// product slug. Swapping in real photography later = replacing these URLs.
const imagesFor = (slug: string) =>
  JSON.stringify(
    [1, 2, 3, 4].map(
      (i) => `https://picsum.photos/seed/${slug}-${i}/600/600`
    )
  );

async function main() {
  console.log("Seeding categories…");
  const categoryIdBySlug = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon, position: c.position },
      create: c,
    });
    categoryIdBySlug.set(c.slug, row.id);
  }

  console.log("Seeding products…");
  for (const p of PRODUCTS) {
    if (p.price > 999) {
      throw new Error(`Catalog rule violated: ${p.slug} is over ₹999`);
    }
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Unknown category: ${p.categorySlug}`);

    // priority: explicit list in seed-data > local slug-named files > placeholder
    const localImages = localImagesFor(p.slug);
    const data = {
      name: p.name,
      description: p.description,
      price: p.price,
      mrp: p.mrp,
      images: p.images?.length
        ? JSON.stringify(p.images)
        : localImages.length
          ? JSON.stringify(localImages)
          : imagesFor(p.slug),
      sizes: p.sizes?.length ? JSON.stringify(p.sizes) : null,
      attributes:
        p.attributes && Object.keys(p.attributes).length
          ? JSON.stringify(p.attributes)
          : null,
      categoryId,
      stock: p.stock ?? stockFor(p.slug),
      rating: ratingFor(p.slug),
      ratingCount: ratingCountFor(p.slug),
      isActive: true,
      isFeatured: p.isFeatured ?? false,
    };

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });
  }

  const count = await prisma.product.count();
  console.log(`Done. ${CATEGORIES.length} categories, ${count} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
