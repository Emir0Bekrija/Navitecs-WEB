import type { Metadata } from "next";
import ContactClient from "../../components/pages/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with NAVITECS for your next engineering or BIM project.",
  alternates: {
    canonical: "https://navitecs.ba/contact",
  },
  openGraph: {
    title: "Contact Us | NAVITECS",
    description:
      "Get in touch with NAVITECS for your next engineering or BIM project.",
    url: "https://navitecs.ba/contact",
  },
};

export default function Page() {
  return <ContactClient />;
}
