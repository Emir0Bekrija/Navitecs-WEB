import type { Metadata } from "next";
import AboutClient from "../../components/pages/AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about NAVITECS, our vision, and our team of experts in BIM engineering.",
  alternates: {
    canonical: "https://navitecs.ba/about",
  },
  openGraph: {
    title: "About Us | NAVITECS",
    description:
      "Learn more about NAVITECS, our vision, and our team of experts in BIM engineering.",
    url: "https://navitecs.ba/about",
  },
};

export default function Page() {
  return <AboutClient />;
}
