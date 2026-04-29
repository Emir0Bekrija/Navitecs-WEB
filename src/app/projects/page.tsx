import type { Metadata } from "next";
import ProjectsClient from "../../components/pages/ProjectsClient";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteSettings";
import type { Project, MediaItem } from "@/types/index";
import type { ContentBlock } from "@/lib/blocks";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "View our portfolio of successfully delivered BIM coordination and engineering projects across residential, commercial, and infrastructure sectors.",
  alternates: { canonical: "https://navitecs.ba/projects" },
  openGraph: {
    title: "Projects | NAVITECS",
    description: "View our portfolio of successfully delivered BIM coordination and engineering projects.",
    url: "https://navitecs.ba/projects",
  },
};

export default async function Page() {
  const [rows, settings] = await Promise.all([
    prisma.project.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    getSiteSettings(),
  ]);

  const projects: Project[] = rows.map((p) => ({
    id:             p.id,
    title:          p.title,
    category:       p.category,
    location:       p.location,
    projectSize:    p.projectSize,
    timeline:       p.timeline,
    numberOfUnits:  p.numberOfUnits,
    clientType:     p.clientType,
    description:    p.description,
    featuredImage:  p.featuredImage,
    scopeOfWork:    Array.isArray(p.scopeOfWork)    ? (p.scopeOfWork as string[])         : [],
    toolsAndTech:   Array.isArray(p.toolsAndTech)   ? (p.toolsAndTech as string[])        : [],
    challenge:      p.challenge,
    solution:       p.solution,
    results:        Array.isArray(p.results)        ? (p.results as string[])             : [],
    valueDelivered: Array.isArray(p.valueDelivered) ? (p.valueDelivered as string[])      : [],
    media:          Array.isArray(p.media)          ? (p.media as MediaItem[])            : [],
    contentBlocks:  Array.isArray(p.contentBlocks)  ? (p.contentBlocks as ContentBlock[]) : [],
    status:         (p.status === "draft" || p.status === "published") ? p.status : "published",
    featured:       p.featured,
    seoTitle:       p.seoTitle,
    seoDescription: p.seoDescription,
    order:          p.order,
  }));

  return <ProjectsClient initialProjects={projects} comingSoon={settings.projectsComingSoon} />;
}
