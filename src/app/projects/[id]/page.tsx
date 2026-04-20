import type { Metadata } from "next";
import ProjectDetailsClient from "../../../components/pages/ProjectDetailsClient";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Project Details",
  description: "Explore a detailed NAVITECS project case study.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
  const projects = rows.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    scope: p.scope,
    image: p.image,
    caseStudy: {
      challenge: p.challenge,
      solution: p.solution,
      results: Array.isArray(p.results) ? (p.results as string[]) : [],
    },
  }));
  return <ProjectDetailsClient allProjects={projects} />;
}
