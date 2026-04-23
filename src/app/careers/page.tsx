import type { Metadata } from "next";
import CareersClient from "../../components/pages/CareersClient";
import { prisma } from "@/lib/db";

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
  const rows = await prisma.job.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  const jobs = rows.map((j) => ({
    id: j.id,
    title: j.title,
    department: j.department,
    location: j.location,
    type: j.type,
    description: j.description,
    summary: j.summary,
    active: j.active,
    createdAt: j.createdAt.toISOString(),
  }));
  return <CareersClient initialJobs={jobs} />;
}
