import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const ProjectSchema = z.object({
  title: z.string().min(1).max(255),
  category: z.string().min(1).max(100),
  description: z.string().min(1),
  scope: z.string().min(1),
  image: z.string().max(500).default(""),
  caseStudy: z.object({
    challenge: z.string().default(""),
    solution: z.string().default(""),
    results: z.array(z.string()).default([]),
  }).default({ challenge: "", solution: "", results: [] }),
});

/** Map flat DB row → frontend Project shape */
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

// GET /api/admin/projects
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects.map(toResponse));
}

// POST /api/admin/projects
export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = ProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, category, description, scope, image, caseStudy } = parsed.data;
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);

  const project = await prisma.project.create({
    data: {
      id,
      title,
      category,
      description,
      scope,
      image,
      challenge: caseStudy.challenge,
      solution: caseStudy.solution,
      results: caseStudy.results,
      order: nextOrder,
    },
  });
  return NextResponse.json(toResponse(project), { status: 201 });
}
