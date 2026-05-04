import type { Metadata } from "next";
import ContactClient from "../../components/pages/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with NAVITECS for your next BIM, engineering, or architecture project. Contact our team in Sarajevo for a consultation on coordination, design, and technical solutions.",
  alternates: {
    canonical: "https://navitecs.ba/contact",
  },
  openGraph: {
    title: "Contact Us | NAVITECS",
    description:
      "Get in touch with NAVITECS for your next BIM, engineering, or architecture project. Contact our team for a consultation on coordination and design.",
    url: "https://navitecs.ba/contact",
  },
};

export default function Page() {
  return <ContactClient />;
}
