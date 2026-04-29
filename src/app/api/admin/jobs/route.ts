import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const JobSchema = z.object({
  title: z.string().min(1).max(255),
  summary: z.string().min(1).max(500),
  department: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  description: z.string().min(1),
  requirements: z.array(z.string().max(200)).optional().default([]),
  active: z.boolean().optional().default(true),
  isGeneral: z.boolean().optional().default(false),
});

// GET /api/admin/jobs
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const jobs = await prisma.job.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(jobs);
}

// POST /api/admin/jobs
export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = JobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const maxOrder = await prisma.job.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const id = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 36);

  const job = await prisma.job.create({
    data: { ...data, id, order: nextOrder },
  });
  return NextResponse.json(job, { status: 201 });
}
