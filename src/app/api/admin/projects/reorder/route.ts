import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const ReorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});

// POST /api/admin/projects/reorder
// Body: { ids: string[] } — full ordered list of project IDs
export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = ReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
  }

  const { ids } = parsed.data;

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.project.updateMany({ where: { id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
