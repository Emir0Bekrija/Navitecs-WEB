import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProjectDetailsClient from "../../../components/pages/ProjectDetailsClient";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteSettings";
import type { Project, MediaItem } from "@/types/index";
import type { ContentBlock } from "@/lib/blocks";

export const dynamic = "force-dynamic";

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

  const settings = await getSiteSettings();
  if (settings.projectsComingSoon) redirect("/projects");

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

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.seoTitle ?? p.title,
    description: p.seoDescription ?? p.description.slice(0, 160),
    url: `https://navitecs.ba/projects/${id}`,
    creator: { "@type": "Organization", name: "NAVITECS" },
    ...(p.featuredImage ? { image: p.featuredImage } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://navitecs.ba/" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://navitecs.ba/projects" },
      { "@type": "ListItem", position: 3, name: p.seoTitle ?? p.title, item: `https://navitecs.ba/projects/${id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetailsClient project={project} />
    </>
  );
}
