import type { Metadata } from "next";
import AboutClient from "../../components/pages/AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NAVITECS — a BIM-focused engineering consultancy delivering precision coordination and technical solutions. Meet our team of experts in architectural, structural, and MEP engineering.",
  alternates: {
    canonical: "https://navitecs.ba/about",
  },
  openGraph: {
    title: "About Us | NAVITECS",
    description:
      "Learn about NAVITECS — a BIM-focused engineering consultancy delivering precision coordination and technical solutions in architectural, structural, and MEP engineering.",
    url: "https://navitecs.ba/about",
  },
};

export default function Page() {
  return <AboutClient />;
}
