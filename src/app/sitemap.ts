import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://navitecs.ba";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/careers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${BASE}/terms-of-service`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const [projects, jobs] = await Promise.all([
    prisma.project.findMany({
      where: { status: "published" },
      select: { id: true, updatedAt: true },
    }),
    prisma.job.findMany({
      where: { active: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Jobs are listed on /careers, but individual URLs can be added here
  // if dedicated job detail pages are created in the future.

  return [...staticRoutes, ...projectRoutes];
}
