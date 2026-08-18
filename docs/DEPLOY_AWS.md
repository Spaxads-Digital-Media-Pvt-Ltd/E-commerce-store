# Deploy: images → S3, data → Supabase, app → AWS

Your flow, in order. Everything is driven by `.env` — no code edits needed.

## 0. One-time cloud setup

### Supabase (Postgres)
1. Create a project → **Settings → Database → Connection string**.
2. Copy **two** strings into `.env`:
   - `DATABASE_URL` = the **Pooled** string (host contains `pooler`, port **6543**). Keep `?pgbouncer=true`.
   - `DIRECT_URL` = the **Direct** string (port **5432**). Migrations use this.

### AWS S3 bucket (public-read for images)
1. Create a bucket in your region (e.g. `ap-south-1`). Note the exact name.
2. **Permissions → Block public access** → uncheck *“Block public access to buckets and objects granted through new public bucket policies”* (and the “any” variant). Save.
3. **Permissions → Bucket policy** → paste (replace `YOUR_BUCKET`):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadProducts",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::YOUR_BUCKET/products/*"
     }]
   }
   ```
4. **IAM** → create a user with programmatic access and this least-privilege policy (upload only), then put its keys in `.env`:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": ["s3:PutObject"],
       "Resource": "arn:aws:s3:::YOUR_BUCKET/products/*"
     }]
   }
   ```

Modern buckets have ACLs disabled (“Bucket owner enforced”) — the upload script sets **no** ACL, so public read comes from the bucket policy above. Leave `S3_OBJECT_ACL` empty.

> **CloudFront (optional, recommended for real traffic):** put a distribution in
> front of the bucket and set `S3_PUBLIC_BASE_URL=https://your-distribution-domain`.
> The seed and `next.config.ts` pick it up automatically.

## 1. Fill `.env`

```
DATABASE_URL / DIRECT_URL   → Supabase (above)
AWS_REGION                  → e.g. ap-south-1
AWS_ACCESS_KEY_ID           → IAM user key
AWS_SECRET_ACCESS_KEY       → IAM user secret
S3_BUCKET                   → your bucket name
S3_KEY_PREFIX               → products   (default)
NEXT_PUBLIC_SITE_URL        → https://your-domain  (in production)
```

## 2. Run the pipeline (from your Mac)

```bash
npm run db:push        # create the tables in Supabase (no migration files needed)
npm run images:upload  # push public/images/products/* → S3
npm run db:seed        # write catalog + S3 image URLs into Supabase
npm run build          # sanity-check the production build
```

After `images:upload` you’ll see the public base and a sample URL — open it in a
browser to confirm the bucket policy makes it publicly readable. The seed stores
that exact URL shape in Supabase, so product images now load from S3, not disk.

Re-runs are safe: `images:upload` overwrites, `db:seed` upserts.

## 3. Deploy the app to AWS

The app is a standard `next build` + `next start` server. Set the **same env
vars** on the server (Supabase + S3 + `NEXT_PUBLIC_SITE_URL` + any Razorpay/
Upstash/Turnstile keys). Do **not** copy your `.env` up with dev values.

Typical build-on-server steps (EC2 / any Linux box):

```bash
git clone <repo> && cd <project>
npm ci
npx prisma generate      # picks the right engine for the server OS
npm run build
npm run start            # or run under pm2 / systemd, behind Nginx/Caddy for TLS
```

Notes:
- **Prisma engines:** `schema.prisma` already lists the Debian + RHEL Linux
  targets, so a client built on your Mac also runs on Ubuntu/Amazon Linux. If you
  build **on** the server, `native` covers it anyway.
- **`db:push` vs migrations:** `db:push` syncs the schema with no history — ideal
  for first deploy. Want versioned migrations later? Run
  `npx prisma migrate dev --name init` against `DIRECT_URL` to generate them.
- **Rate limiting:** the in-memory limiter is per-instance. For more than one
  instance, set the Upstash env vars so limits are shared.
- **Secrets hygiene:** the git repo root is your home folder — never
  `git add -A` from there. `.env` is gitignored; keep real keys only in `.env`
  and in your host’s env settings.
```
