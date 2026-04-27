import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

/**
 * DELETE /api/admin/cv/bulk
 *
 * Deletes all CV files on disk where cvDeletable = true and cvPath is set,
 * then clears cvPath / cvFileName / cvDeletable in the DB.
 * Returns { deleted: number } — the count of files removed.
 */
export async function DELETE() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const applications = await prisma.application.findMany({
    where: { cvDeletable: true, cvPath: { not: null } },
    select: { id: true, cvPath: true },
  });

  let deleted = 0;

  await Promise.all(
    applications.map(async (app) => {
      if (!app.cvPath) return;

      const filePath = path.resolve(UPLOADS_DIR, app.cvPath);
      // Path traversal guard
      if (filePath.startsWith(UPLOADS_DIR + path.sep)) {
        await fs.unlink(filePath).catch(() => {});
      }
      deleted++;
    }),
  );

  // Clear all CV fields in one batch update
  if (applications.length > 0) {
    await prisma.application.updateMany({
      where: { id: { in: applications.map((a) => a.id) } },
      data: { cvPath: null, cvFileName: null, cvDeletable: false },
    });
  }

  return NextResponse.json({ deleted });
}
