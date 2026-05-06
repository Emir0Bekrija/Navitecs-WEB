import type { Metadata } from "next";
import HomeClient from "@/components/pages/HomeClient";

export const metadata: Metadata = {
  title: "Home",
  description:
    "NAVITECS delivers precision-engineered BIM consulting and engineering solutions from Sarajevo, Bosnia and Herzegovina. Serving clients across Europe with coordination, MEP design, and architectural engineering for residential and commercial projects.",
  alternates: {
    canonical: "https://navitecs.ba/",
  },
  openGraph: {
    title: "Home | NAVITECS",
    description:
      "NAVITECS delivers precision-engineered BIM consulting and engineering solutions from Sarajevo, Bosnia and Herzegovina. Serving clients across Europe with coordination, MEP design, and architectural engineering.",
    url: "https://navitecs.ba/",
  },
};

export default function Page() {
  return <HomeClient />;
}
