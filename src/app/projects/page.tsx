import type { Metadata } from "next";
import ProjectsClient from "../../components/pages/ProjectsClient";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "View our portfolio of successful structural, mechanical, and architectural projects.",
  alternates: {
    canonical: "https://navitecs.ba/projects",
  },
  openGraph: {
    title: "Projects | NAVITECS",
    description:
      "View our portfolio of successful structural, mechanical, and architectural projects.",
    url: "https://navitecs.ba/projects",
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
  return <ProjectsClient initialProjects={projects} />;
}
