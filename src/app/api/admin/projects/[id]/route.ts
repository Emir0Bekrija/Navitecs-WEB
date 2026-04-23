import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

type Params = { params: Promise<{ id: string }> };

const ProjectUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  category: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  scope: z.string().min(1).optional(),
  image: z.string().max(500).optional(),
  caseStudy: z.object({
    challenge: z.string().optional(),
    solution: z.string().optional(),
    results: z.array(z.string()).optional(),
  }).optional(),
});

function toResponse(p: {
  id: string; title: string; category: string; description: string;
  scope: string; image: string; challenge: string; solution: string;
  results: unknown; order: number; createdAt: Date; updatedAt: Date;
}) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    scope: p.scope,
    image: p.image,
    order: p.order,
    caseStudy: {
      challenge: p.challenge,
      solution: p.solution,
      results: Array.isArray(p.results) ? p.results : [],
    },
  };
}

// GET /api/admin/projects/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(toResponse(project));
}

// PUT /api/admin/projects/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const body = await request.json();
  const parsed = ProjectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { caseStudy, ...rest } = parsed.data;
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(caseStudy?.challenge !== undefined && { challenge: caseStudy.challenge }),
        ...(caseStudy?.solution !== undefined && { solution: caseStudy.solution }),
        ...(caseStudy?.results !== undefined && { results: caseStudy.results }),
      },
    });
    return NextResponse.json(toResponse(project));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// DELETE /api/admin/projects/[id]
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
