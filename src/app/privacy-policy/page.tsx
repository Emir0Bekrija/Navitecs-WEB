import type { Metadata } from "next";
import PrivacyPolicyClient from "@/components/pages/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NAVITECS collects, uses, and protects your personal information.",
  alternates: { canonical: "https://navitecs.ba/privacy-policy" },
  robots: { index: true, follow: false },
};

export default function Page() {
  return <PrivacyPolicyClient />;
}
