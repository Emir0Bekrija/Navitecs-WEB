import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";
import type { Project, MediaItem } from "@/types/index";
import type { ContentBlock } from "@/lib/blocks";

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
  const project = await prisma.project.findUnique({ where: { id }, select: { order: true } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.project.delete({ where: { id } }),
    prisma.project.updateMany({
      where: { order: { gt: project.order } },
      data: { order: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
