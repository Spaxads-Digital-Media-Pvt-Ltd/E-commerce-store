import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Distributed rate limiting via Upstash when configured; otherwise an
// in-memory sliding window (fine for local dev / a single instance —
// configure Upstash in production, see .env.example).

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

if (!hasUpstash && process.env.NODE_ENV === "production") {
  console.warn(
    "[rate-limit] Upstash not configured — falling back to in-memory limiter (single-instance only)."
  );
}

const upstashLimiters = new Map<string, Ratelimit>();
const memoryHits = new Map<string, number[]>();

export type RateLimitResult = { success: boolean; remaining: number };

export async function rateLimit(
  bucket: string,
  id: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (hasUpstash) {
    const cacheKey = `${bucket}:${limit}:${windowSeconds}`;
    let limiter = upstashLimiters.get(cacheKey);
    if (!limiter) {
      limiter = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        prefix: `u999:${bucket}`,
      });
      upstashLimiters.set(cacheKey, limiter);
    }
    const res = await limiter.limit(id);
    return { success: res.success, remaining: res.remaining };
  }

  // In-memory sliding window
  const key = `${bucket}:${id}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    memoryHits.set(key, hits);
    return { success: false, remaining: 0 };
  }
  hits.push(now);
  memoryHits.set(key, hits);

  // Opportunistic prune so the map can't grow without bound.
  if (memoryHits.size > 5000) {
    for (const [k, v] of memoryHits) {
      const fresh = v.filter((t) => now - t < windowMs);
      if (fresh.length === 0) memoryHits.delete(k);
      else memoryHits.set(k, fresh);
    }
  }
  return { success: true, remaining: limit - hits.length };
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
