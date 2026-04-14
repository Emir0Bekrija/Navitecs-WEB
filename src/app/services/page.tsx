import type { Metadata } from "next";
import ServicesClient from "../../components/pages/ServicesClient";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore the comprehensive BIM, engineering, and architecture services we offer.",
  alternates: {
    canonical: "https://navitecs.ba/services",
  },
  openGraph: {
    title: "Our Services | NAVITECS",
    description:
      "Explore the comprehensive BIM, engineering, and architecture services we offer.",
    url: "https://navitecs.ba/services",
  },
};

export default function Page() {
  return <ServicesClient />;
}
