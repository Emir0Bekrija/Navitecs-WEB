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
