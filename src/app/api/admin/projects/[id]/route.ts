import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";
import type { Project, MediaItem } from "@/types/index";
import type { ContentBlock } from "@/lib/blocks";

const IMAGE_DIR = path.resolve(process.cwd(), "uploads", "images");

type Params = { params: Promise<{ id: string }> };

// ── Zod schema ─────────────────────────────────────────────────────────────────

const ProjectUpdateSchema = z.object({
  title:          z.string().min(1).max(255).optional(),
  category:       z.string().min(1).max(100).optional(),
  location:       z.string().max(255).optional().transform(v => v === "" ? null : v),
  projectSize:    z.string().max(100).optional().transform(v => v === "" ? null : v),
  timeline:       z.string().max(100).optional().transform(v => v === "" ? null : v),
  numberOfUnits:  z.string().max(100).optional().transform(v => v === "" ? null : v),
  clientType:     z.string().max(100).optional().transform(v => v === "" ? null : v),
  description:    z.string().min(1).optional(),
  featuredImage:  z.string().max(500).optional().transform(v => v === "" ? null : v),
  scopeOfWork:    z.array(z.string()).optional(),
  toolsAndTech:   z.array(z.string()).optional(),
  challenge:      z.string().optional().transform(v => v === "" ? null : v),
  solution:       z.string().optional().transform(v => v === "" ? null : v),
  results:        z.array(z.string()).optional(),
  valueDelivered: z.array(z.string()).optional(),
  media:          z.array(z.object({
                    url:     z.string(),
                    caption: z.string().optional(),
                    type:    z.enum(["image", "video"]).optional(),
                  })).optional(),
  contentBlocks:  z.array(z.object({
                    id:    z.string(),
                    type:  z.string(),
                    order: z.number(),
                    data:  z.record(z.string(), z.unknown()),
                  })).optional(),
  status:         z.enum(["draft", "published"]).optional(),
  featured:       z.boolean().optional(),
  seoTitle:       z.string().max(255).optional().transform(v => v === "" ? null : v),
  seoDescription: z.string().optional().transform(v => v === "" ? null : v),
});

// ── DB row → frontend Project ──────────────────────────────────────────────────

function toResponse(p: {
  id: string; title: string; category: string; location: string | null;
  projectSize: string | null; timeline: string | null; numberOfUnits: string | null;
  clientType: string | null; description: string; featuredImage: string | null;
  scopeOfWork: unknown; toolsAndTech: unknown; challenge: string | null;
  solution: string | null; results: unknown; valueDelivered: unknown;
  media: unknown; contentBlocks: unknown; status: string; featured: boolean;
  seoTitle: string | null; seoDescription: string | null;
  order: number; createdAt: Date; updatedAt: Date;
}): Project {
  return {
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
    createdAt:      p.createdAt.toISOString(),
    updatedAt:      p.updatedAt.toISOString(),
  };
}

// ── GET /api/admin/projects/[id] ──────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(toResponse(project));
}

// ── Image file helpers (used by PUT and DELETE) ───────────────────────────────

/** Extract the UUID filename from a stored image URL like /api/images/{uuid}.webp */
function imageFilename(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/^\/api\/images\/([0-9a-f-]+\.webp)$/i);
  return match ? match[1] : null;
}

/** Collect all server-hosted image filenames referenced by a project. */
function collectImageFilenames(project: {
  featuredImage: string | null;
  media: unknown;
  contentBlocks: unknown;
}): string[] {
  const filenames = new Set<string>();

  const fi = imageFilename(project.featuredImage);
  if (fi) filenames.add(fi);

  const media = Array.isArray(project.media) ? (project.media as { url?: string }[]) : [];
  for (const item of media) {
    const f = imageFilename(item.url);
    if (f) filenames.add(f);
  }

  const blocks = Array.isArray(project.contentBlocks)
    ? (project.contentBlocks as ContentBlock[])
    : [];
  for (const block of blocks) {
    const data = block.data as Record<string, unknown>;
    for (const f of [
      imageFilename(data.url as string),
      imageFilename(data.beforeUrl as string),
      imageFilename(data.afterUrl as string),
    ]) {
      if (f) filenames.add(f);
    }
    if (Array.isArray(data.images)) {
      for (const img of data.images as { url?: string }[]) {
        const f = imageFilename(img.url);
        if (f) filenames.add(f);
      }
    }
  }

  return [...filenames];
}

// ── PUT /api/admin/projects/[id] ──────────────────────────────────────────────

export async function PUT(request: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const body = await request.json();
  const parsed = ProjectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Snapshot existing image filenames before the update so we can clean up removed ones
  const oldProject = await prisma.project.findUnique({
    where: { id },
    select: { featuredImage: true, media: true, contentBlocks: true },
  });

  try {
    const { scopeOfWork, toolsAndTech, results, valueDelivered, media, contentBlocks, ...scalarData } = parsed.data;
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...scalarData,
        ...(scopeOfWork    !== undefined && { scopeOfWork:    JSON.parse(JSON.stringify(scopeOfWork)) }),
        ...(toolsAndTech   !== undefined && { toolsAndTech:   JSON.parse(JSON.stringify(toolsAndTech)) }),
        ...(results        !== undefined && { results:        JSON.parse(JSON.stringify(results)) }),
        ...(valueDelivered !== undefined && { valueDelivered: JSON.parse(JSON.stringify(valueDelivered)) }),
        ...(media          !== undefined && { media:          JSON.parse(JSON.stringify(media)) }),
        ...(contentBlocks  !== undefined && { contentBlocks:  JSON.parse(JSON.stringify(contentBlocks)) }),
      },
    });

    // Delete any server-hosted image files that were removed during this edit
    if (oldProject) {
      const oldFilenames = new Set(collectImageFilenames(oldProject));
      const newFilenames = new Set(collectImageFilenames(project));
      for (const filename of oldFilenames) {
        if (!newFilenames.has(filename)) {
          await fs.unlink(path.join(IMAGE_DIR, filename)).catch(() => {});
        }
      }
    }

    return NextResponse.json(toResponse(project));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// ── DELETE /api/admin/projects/[id] ───────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { order: true, featuredImage: true, media: true, contentBlocks: true },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const imageFilenames = collectImageFilenames(project);

  await prisma.$transaction([
    prisma.project.delete({ where: { id } }),
    prisma.project.updateMany({
      where: { order: { gt: project.order } },
      data: { order: { decrement: 1 } },
    }),
  ]);

  // Delete image files from disk (best-effort — don't fail if a file is missing)
  for (const filename of imageFilenames) {
    await fs.unlink(path.join(IMAGE_DIR, filename)).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
