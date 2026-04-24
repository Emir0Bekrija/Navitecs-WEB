import type { Metadata } from "next";
import TermsOfServiceClient from "@/components/pages/TermsOfServiceClient";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing use of the NAVITECS website.",
  alternates: { canonical: "https://navitecs.ba/terms-of-service" },
  robots: { index: true, follow: false },
};

export default function Page() {
  return <TermsOfServiceClient />;
}
