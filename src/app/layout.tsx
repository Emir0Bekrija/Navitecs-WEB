import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutWrapper from "@/components/RootLayoutWrapper";
import "@/styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "NAVITECS | BIM-Focused Engineering & Architecture",
    template: "%s | NAVITECS",
  },
  description:
    "BIM-focused engineering and architecture consulting company. Delivering precision coordination and technical solutions for building development.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://navitecs.ba",
  },
  openGraph: {
    title: "NAVITECS | BIM-Focused Engineering & Architecture",
    description:
      "BIM-focused engineering and architecture consulting company. Delivering precision coordination and technical solutions for building development.",
    url: "https://navitecs.ba",
    siteName: "NAVITECS",
    images: [
      {
        url: "https://navitecs.ba/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVITECS Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <RootLayoutWrapper>{children}</RootLayoutWrapper>
      </body>
    </html>
  );
}
