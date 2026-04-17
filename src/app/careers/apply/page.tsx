import type { Metadata } from "next";
import ApplyClient from "../../../components/pages/ApplyClient";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Submit your application to join the NAVITECS team.",
  alternates: {
    canonical: "https://navitecs.ba/careers/apply",
  },
  openGraph: {
    title: "Apply Now | NAVITECS",
    description: "Submit your application to join the NAVITECS team.",
    url: "https://navitecs.ba/careers/apply",
  },
};

type Props = { searchParams: Promise<{ role?: string }> };

export default async function Page({ searchParams }: Props) {
  const { role } = await searchParams;
  return <ApplyClient initialRole={role ?? ""} />;
}
