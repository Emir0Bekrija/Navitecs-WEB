"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import PromoPopup from "@/components/PromoPopup";
import CookieConsent from "@/components/CookieConsent";

export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Admin panel gets no public chrome (nav, footer, analytics, consent banner)
  const isAdmin = pathname.startsWith("/navitecs-control-admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <CustomCursor />
      <Navigation />
      <main className="pt-20">{children}</main>
      <Footer />
      <PromoPopup />
      {/* Cookie consent banner — shown on first visit, manages GA4 loading */}
      <CookieConsent />
    </>
  );
}
