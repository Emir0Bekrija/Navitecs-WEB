"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin panel: no cursor overlay, no nav, no footer, no top padding
    return <>{children}</>;
  }

  return (
    <>
      <CustomCursor />
      <Navigation />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
