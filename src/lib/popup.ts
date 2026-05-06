import "server-only";
import { prisma } from "@/lib/db";

export type PopupConfig = {
  id: number;
  enabled: boolean;
  badge: string;
  category: string;
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  linkType: string;
  openInNewTab: boolean;
};

const DEFAULT: PopupConfig = {
  id: 1,
  enabled: false,
  badge: "INSIGHT",
  category: "",
  title: "New BIM Coordination Insight",
  description:
    "See how coordinated Revit models help reduce clashes, improve documentation accuracy, and streamline collaboration across architectural, structural, and MEP teams.",
  buttonText: "Read the article",
  linkUrl: "",
  linkType: "external",
  openInNewTab: true,
};

function serialize(row: Awaited<ReturnType<typeof prisma.popupConfig.findUnique>>): PopupConfig {
  if (!row) return DEFAULT;
  return {
    id: row.id,
    enabled: row.enabled,
    badge: row.badge,
    category: row.category,
    title: row.title,
    description: row.description,
    buttonText: row.buttonText,
    linkUrl: row.linkUrl,
    linkType: row.linkType,
    openInNewTab: row.openInNewTab,
  };
}

export async function getPopupConfig(): Promise<PopupConfig> {
  const row = await prisma.popupConfig.findUnique({ where: { id: 1 } });
  return serialize(row);
}

export async function savePopupConfig(data: Partial<Omit<PopupConfig, "id">>): Promise<PopupConfig> {
  const row = await prisma.popupConfig.upsert({
    where: { id: 1 },
    update: data,
    create: { ...DEFAULT, ...data, id: 1 },
  });
  return serialize(row);
}

// ── Templates ─────────────────────────────────────────────────────────────────

export type PopupTemplate = {
  id: number;
  name: string;
  badge: string;
  category: string;
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  linkType: string;
  openInNewTab: boolean;
  createdAt: string;
};

function serializeTemplate(row: {
  id: number; name: string; badge: string; category: string; title: string;
  description: string; buttonText: string; linkUrl: string; linkType: string;
  openInNewTab: boolean; createdAt: Date;
}): PopupTemplate {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

export async function listPopupTemplates(): Promise<PopupTemplate[]> {
  const rows = await prisma.popupTemplate.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(serializeTemplate);
}

export async function createPopupTemplate(data: Omit<PopupTemplate, "id" | "createdAt">): Promise<PopupTemplate> {
  const row = await prisma.popupTemplate.create({ data });
  return serializeTemplate(row);
}

export async function updatePopupTemplate(id: number, data: Partial<Omit<PopupTemplate, "id" | "createdAt">>): Promise<PopupTemplate> {
  const row = await prisma.popupTemplate.update({ where: { id }, data });
  return serializeTemplate(row);
}

export async function deletePopupTemplate(id: number): Promise<void> {
  await prisma.popupTemplate.delete({ where: { id } });
}
