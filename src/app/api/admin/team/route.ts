import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const TeamMemberSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  bio: z.string().max(2000).optional().default(""),
  imageUrl: z.string().max(500).optional().default(""),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
});

// GET /api/admin/team
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(members);
}

// POST /api/admin/team
export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = TeamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const maxOrder = await prisma.teamMember.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const member = await prisma.teamMember.create({
    data: { ...parsed.data, order: nextOrder },
  });
  return NextResponse.json(member, { status: 201 });
}
