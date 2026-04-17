import type { Metadata } from "next";
import CareersClient from "../../components/pages/CareersClient";
import { getJobs } from "@/lib/data";

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

export default async function Page() {
  const jobs = await getJobs();
  return <CareersClient initialJobs={jobs.filter((j) => j.active)} />;
}
