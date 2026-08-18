import "dotenv/config";
import fs from "fs";
import path from "path";
import {
  S3Client,
  PutObjectCommand,
  type ObjectCannedACL,
} from "@aws-sdk/client-s3";

// ─────────────────────────────────────────────────────────────────────────
// Uploads every image in public/images/products/ to your S3 bucket.
//
//   npm run images:upload
//
// Idempotent: re-running overwrites objects with the same key. After this,
// run `npm run db:seed` — with S3 configured, the seed stores the S3 URLs
// (not local /images paths) in Supabase. The public-URL derivation here is
// kept identical to prisma/seed.ts and next.config.ts.
// ─────────────────────────────────────────────────────────────────────────

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;
const prefix = (process.env.S3_KEY_PREFIX ?? "products").replace(
  /^\/+|\/+$/g,
  ""
);
const acl = process.env.S3_OBJECT_ACL as ObjectCannedACL | undefined;

const IMAGES_DIR = path.join(__dirname, "..", "public", "images", "products");

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

function publicBaseUrl(): string {
  const explicit = process.env.S3_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (explicit) return explicit;
  return `https://${bucket}.s3.${region}.amazonaws.com`;
}

function fail(msg: string): never {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

async function main() {
  if (!region) fail("AWS_REGION is not set in .env");
  if (!bucket) fail("S3_BUCKET is not set in .env");
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    fail("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are not set in .env");
  }

  let files: string[];
  try {
    files = fs.readdirSync(IMAGES_DIR);
  } catch {
    fail(`Image folder not found: ${IMAGES_DIR}`);
  }

  const images = files
    .filter((f) => CONTENT_TYPE[path.extname(f).toLowerCase()])
    .sort();

  if (images.length === 0) fail(`No images found in ${IMAGES_DIR}`);

  const client = new S3Client({ region }); // creds read from env automatically
  const base = publicBaseUrl();

  console.log(
    `Uploading ${images.length} images → s3://${bucket}/${prefix}/  (region ${region})\n`
  );

  let ok = 0;
  for (const file of images) {
    const key = `${prefix}/${file}`;
    const ext = path.extname(file).toLowerCase();
    const body = fs.readFileSync(path.join(IMAGES_DIR, file));
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: CONTENT_TYPE[ext],
          // product images are content-addressed by name; cache hard
          CacheControl: "public, max-age=31536000, immutable",
          ...(acl ? { ACL: acl } : {}),
        })
      );
      ok++;
      process.stdout.write(`  ✓ ${key}\n`);
    } catch (err) {
      console.error(`  ✗ ${key}:`, (err as Error).message);
    }
  }

  console.log(`\nDone. ${ok}/${images.length} uploaded.`);
  console.log(`Public base: ${base}/${prefix}/`);
  console.log(`Sample:      ${base}/${prefix}/${images[0]}`);
  console.log(
    `\nNext: ensure the same S3 vars are set, then run  npm run db:seed`
  );

  if (ok < images.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
