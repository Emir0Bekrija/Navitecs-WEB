import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const PatchSchema = z.object({
  score: z.number().int().min(1).max(10).nullable().optional(),
  comments: z.string().max(5000).nullable().optional(),
  fitsRoles: z.string().max(2000).nullable().optional(),
  doesNotFit: z.string().max(2000).nullable().optional(),
});

// PATCH /api/admin/applicants/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;

  const body = await request.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const applicant = await prisma.applicant.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(applicant);
}
