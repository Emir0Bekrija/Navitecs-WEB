import "server-only";
import { prisma } from "@/lib/db";

export type SiteSettings = {
  projectsComingSoon: boolean;
};

const DEFAULT: SiteSettings = {
  projectsComingSoon: false,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!row) return DEFAULT;
  return { projectsComingSoon: row.projectsComingSoon };
}

export async function saveSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const row = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...DEFAULT, ...data },
  });
  return { projectsComingSoon: row.projectsComingSoon };
}
