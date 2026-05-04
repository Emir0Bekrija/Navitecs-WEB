import type { Metadata } from "next";
import ServicesClient from "../../components/pages/ServicesClient";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore NAVITECS services: BIM consulting, MEP design, architectural and structural engineering, and project coordination. Precision solutions for residential, commercial, and infrastructure projects.",
  alternates: {
    canonical: "https://navitecs.ba/services",
  },
  openGraph: {
    title: "Our Services | NAVITECS",
    description:
      "Explore NAVITECS services: BIM consulting, MEP design, architectural and structural engineering, and project coordination for building development.",
    url: "https://navitecs.ba/services",
  },
};

export default function Page() {
  return <ServicesClient />;
}
