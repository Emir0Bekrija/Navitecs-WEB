import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

type Params = { params: Promise<{ id: string }> };

const JobUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  summary: z.string().min(1).max(500).optional(),
  department: z.string().min(1).max(100).optional(),
  location: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(50).optional(),
  description: z.string().min(1).optional(),
  requirements: z.array(z.string().max(200)).optional(),
  active: z.boolean().optional(),
  isGeneral: z.boolean().optional(),
});

// GET /api/admin/jobs/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}

// PUT /api/admin/jobs/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const body = await request.json();
  const parsed = JobUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const job = await prisma.job.update({ where: { id }, data: parsed.data });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// DELETE /api/admin/jobs/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, select: { order: true } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.job.delete({ where: { id } }),
    prisma.job.updateMany({
      where: { order: { gt: job.order } },
      data: { order: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
