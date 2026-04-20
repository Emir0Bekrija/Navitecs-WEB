import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const Schema = z.object({
  password: z.string().min(1),
});

// POST /api/admin/verify-password
// Checks the provided password against the stored admin hash.
// Used by the delete-confirmation modal before destructive actions.
export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { username: "admin" } });
  if (!user) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
