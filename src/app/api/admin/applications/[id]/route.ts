import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

type Params = { params: Promise<{ id: string }> };

// DELETE /api/admin/applications/[id] — delete application and its CV file
export async function DELETE(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    select: { cvPath: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.application.delete({ where: { id } });

  // Delete CV file if one was uploaded
  if (application.cvPath) {
    try {
      await fs.unlink(path.join(UPLOADS_DIR, application.cvPath));
    } catch {
      // File may already be missing; continue silently
    }
  }

  return NextResponse.json({ ok: true });
}
