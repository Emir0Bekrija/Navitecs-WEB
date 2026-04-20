import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/proxy";

const CV_DIR = path.join(process.cwd(), "uploads", "cvs");

type Params = { params: Promise<{ filename: string }> };

// GET /api/admin/cv/[filename] — protected, serve CV PDF
export async function GET(_req: NextRequest, { params }: Params) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { filename } = await params;

  // Prevent path traversal — only allow simple filenames ending in .pdf
  const safe = path.basename(filename);
  if (!safe.endsWith(".pdf") || safe !== filename) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const filePath = path.join(CV_DIR, safe);
  try {
    const buffer = await fs.readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safe}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
