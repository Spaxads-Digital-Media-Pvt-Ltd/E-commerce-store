import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Derive the public host for product images from the same env the seed and
// upload script use, so next/image (remotePatterns) and the CSP allow it.
function imageHost(): string | null {
  const explicit = process.env.S3_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (explicit) {
    try {
      return new URL(explicit).host;
    } catch {
      return null;
    }
  }
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (bucket && region) return `${bucket}.s3.${region}.amazonaws.com`;
  return null;
}

const IMAGE_HOST = imageHost();
const imgSrcHost = IMAGE_HOST ? ` https://${IMAGE_HOST}` : "";

// Content-Security-Policy — blueprint §13. 'unsafe-eval' is required by the
// dev bundler only and is never sent in production. 'unsafe-inline' for
// scripts is required by Next's inline runtime bootstrapping; Razorpay
// checkout and Cloudflare Turnstile get the minimum origins they need.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://picsum.photos https://fastly.picsum.photos https://*.razorpay.com${imgSrcHost}`,
  "font-src 'self' data:",
  "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://checkout.razorpay.com",
  "frame-src https://api.razorpay.com https://checkout.razorpay.com https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // 'self' for our own <form> posts; PayU's merchant-hosted checkout is a
  // real cross-origin form POST that redirects through PayU's own
  // subdomains (checkout, bank pages, etc.) before landing back on our
  // callback — Chrome enforces form-action on those redirect hops too, so
  // the whole payu.in domain is allowlisted rather than one exact subdomain.
  // See src/components/checkout/checkout-client.tsx.
  "form-action 'self' https://*.payu.in",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), payment=(self "https://api.razorpay.com" "https://checkout.razorpay.com")',
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // S3 / CloudFront host for product images (added when S3 is configured)
      ...(IMAGE_HOST
        ? [{ protocol: "https" as const, hostname: IMAGE_HOST }]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
