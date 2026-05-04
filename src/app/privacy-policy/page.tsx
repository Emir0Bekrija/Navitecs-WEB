import type { Metadata } from "next";
import PrivacyPolicyClient from "@/components/pages/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how NAVITECS collects, uses, and protects your personal information. Read our privacy policy covering data handling, cookies, and your rights under applicable regulations.",
  alternates: { canonical: "https://navitecs.ba/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | NAVITECS",
    description: "Learn how NAVITECS collects, uses, and protects your personal information.",
    url: "https://navitecs.ba/privacy-policy",
  },
  robots: { index: true, follow: false },
};

export default function Page() {
  return <PrivacyPolicyClient />;
}
