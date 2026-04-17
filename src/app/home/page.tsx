import type { Metadata } from "next";
import HomeClient from "@/components/pages/HomeClient";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to NAVITECS, a BIM-focused engineering consulting company.",
  alternates: {
    canonical: "https://navitecs.ba/",
  },
  openGraph: {
    title: "Home | NAVITECS",
    description:
      "Welcome to NAVITECS, a BIM-focused engineering consulting company.",
    url: "https://navitecs.ba/",
  },
};

export default function Page() {
  return <HomeClient />;
}
