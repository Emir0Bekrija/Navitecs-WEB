import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ApplyClient from "../../../components/pages/ApplyClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Submit your application to join the NAVITECS team.",
  alternates: { canonical: "https://navitecs.ba/careers/apply" },
  openGraph: {
    title: "Apply Now | NAVITECS",
    description: "Submit your application to join the NAVITECS team.",
    url: "https://navitecs.ba/careers/apply",
  },
};

type Props = { searchParams: Promise<{ role?: string; jobId?: string }> };

export type JobDetails = {
  title: string;
  summary: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

export default async function Page({ searchParams }: Props) {
  const { role, jobId } = await searchParams;

  let jobDetails: JobDetails | null = null;
  if (jobId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        title: true,
        summary: true,
        department: true,
        location: true,
        type: true,
        description: true,
        requirements: true,
      },
    });
    if (job) jobDetails = { ...job, requirements: (job.requirements as string[]) ?? [] };
  }

  return (
    <ApplyClient
      initialRole={role ?? ""}
      initialJobId={jobId ?? ""}
      jobDetails={jobDetails}
    />
  );
}
