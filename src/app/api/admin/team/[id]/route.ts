import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";
import fs from "fs/promises";
import path from "path";

const IMAGE_DIR = path.resolve(process.cwd(), "uploads", "images");

function extractImageFilename(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/^\/api\/images\/([0-9a-f-]+\.webp)$/i);
  return match ? match[1] : null;
}

type Params = { params: Promise<{ id: string }> };

const UpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.string().min(1).max(255).optional(),
  bio: z.string().max(2000).optional(),
  imageUrl: z.string().max(500).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

// GET /api/admin/team/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

// PUT /api/admin/team/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const body = await request.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const oldMember = await prisma.teamMember.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    const member = await prisma.teamMember.update({
      where: { id },
      data: parsed.data,
    });

    // Delete old image file if it was replaced or cleared
    if (oldMember && oldMember.imageUrl !== member.imageUrl) {
      const oldFile = extractImageFilename(oldMember.imageUrl);
      if (oldFile) {
        await fs.unlink(path.join(IMAGE_DIR, oldFile)).catch(() => {});
      }
    }

    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// DELETE /api/admin/team/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({
    where: { id },
    select: { order: true, imageUrl: true },
  });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.teamMember.delete({ where: { id } }),
    prisma.teamMember.updateMany({
      where: { order: { gt: member.order } },
      data: { order: { decrement: 1 } },
    }),
  ]);

  // Delete image file from disk
  const filename = extractImageFilename(member.imageUrl);
  if (filename) {
    await fs.unlink(path.join(IMAGE_DIR, filename)).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
