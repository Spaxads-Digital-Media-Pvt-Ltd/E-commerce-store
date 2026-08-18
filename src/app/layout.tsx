import type { Metadata, Viewport } from "next";
import { Baloo_2, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { StickyCartBar } from "@/components/cart/sticky-cart-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/sonner";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

// Typography per blueprint §7.3 — Baloo 2 (display), Inter (body),
// JetBrains Mono (order numbers / SKU), self-hosted via next/font.
const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-baloo",
});
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${STORE_NAME} — ${STORE_TAGLINE}`,
    template: `%s · ${STORE_NAME}`,
  },
  description:
    "India's honest budget store — mobile accessories, fashion, home, beauty, toys & more, every single product ₹999 or under. Cash on Delivery, no login needed.",
  openGraph: {
    siteName: STORE_NAME,
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E2A28",
  width: "device-width",
  initialScale: 1,
  // Forbids the mobile "zoom-out-to-fit" heuristic that Chrome's device
  // emulation applies when it estimates the page as wider than the screen
  // (our horizontal product rails trigger that estimate). Without this,
  // the layout viewport inflates ~4x and every position:fixed element
  // (bottom nav, cart bar) is sized/positioned off-screen. Zooming IN is
  // still fully allowed — we deliberately do NOT set maximumScale.
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-marigold focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="min-h-[60vh] pb-24 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <StickyCartBar />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
