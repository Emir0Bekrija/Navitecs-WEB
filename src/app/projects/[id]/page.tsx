import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailsClient from "../../../components/pages/ProjectDetailsClient";
import { prisma } from "@/lib/db";
import type { Project, MediaItem } from "@/types/index";
import type { ContentBlock } from "@/lib/blocks";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await prisma.project.findUnique({ where: { id }, select: { title: true, seoTitle: true, seoDescription: true, description: true } });
  if (!p) return { title: "Project Not Found" };
  return {
    title: p.seoTitle ?? p.title,
    description: p.seoDescription ?? p.description.slice(0, 160),
    alternates: { canonical: `https://navitecs.ba/projects/${id}` },
    openGraph: {
      title: `${p.seoTitle ?? p.title} | NAVITECS`,
      description: p.seoDescription ?? p.description.slice(0, 160),
      url: `https://navitecs.ba/projects/${id}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const p = await prisma.project.findUnique({ where: { id } });
  if (!p || p.status === "draft") notFound();

  const project: Project = {
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
    status:         p.status === "draft" ? "draft" : "published",
    featured:       p.featured,
    seoTitle:       p.seoTitle,
    seoDescription: p.seoDescription,
    order:          p.order,
  };

  return <ProjectDetailsClient project={project} />;
}
