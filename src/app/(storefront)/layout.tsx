import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { StickyCartBar } from "@/components/cart/sticky-cart-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { getSession } from "@/lib/auth/session";

export default async function StorefrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-[60vh] pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav loggedIn={!!session} />
      <StickyCartBar />
      <CartDrawer />
    </>
  );
}
