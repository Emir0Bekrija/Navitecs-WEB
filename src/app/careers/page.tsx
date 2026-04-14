import type { Metadata } from "next";
import CareersClient from "../../components/pages/CareersClient";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join our team. Check out the latest job openings at NAVITECS.",
  alternates: {
    canonical: "https://navitecs.ba/careers",
  },
  openGraph: {
    title: "Careers | NAVITECS",
    description:
      "Join our team. Check out the latest job openings at NAVITECS.",
    url: "https://navitecs.ba/careers",
  },
};

export default function Page() {
  return <CareersClient />;
}
