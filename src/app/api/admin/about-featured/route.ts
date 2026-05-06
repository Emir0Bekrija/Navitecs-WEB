import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const Schema = z.object({
  title: z.string().min(1).max(255),
  text: z.string().min(1).max(5000),
  imageUrl: z.string().max(500).optional().default(""),
  enabled: z.boolean().optional(),
});

// GET /api/admin/about-featured — returns the single record (or null)
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const record = await prisma.aboutTeamFeature.findFirst();
  return NextResponse.json(record);
}

// PUT /api/admin/about-featured — upsert the single record
export async function PUT(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.aboutTeamFeature.findFirst();

  const record = existing
    ? await prisma.aboutTeamFeature.update({
        where: { id: existing.id },
        data: parsed.data,
      })
    : await prisma.aboutTeamFeature.create({
        data: parsed.data,
      });

  return NextResponse.json(record);
}
