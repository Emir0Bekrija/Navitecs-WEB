import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireSuperAdmin, getAdminSession } from "@/lib/proxy";
import { logAudit, deleteAllUserSessions } from "@/lib/adminAuth";
import { getClientIp } from "@/lib/rateLimit";

const ChangePasswordSchema = z.object({
  password: z.string().min(12).max(200),
});

// PATCH /api/admin/users/[id] — change a user's password (invalidates all their sessions)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const ip = getClientIp(request.headers);
  const currentUser = await getAdminSession();

  const body = await request.json().catch(() => null);
  const parsed = ChangePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const hash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.adminUser.update({ where: { id: userId }, data: { password: hash } });

  // Invalidate all sessions for this user — forces re-login everywhere
  await deleteAllUserSessions(userId);

  await logAudit("password_changed", currentUser?.id ?? null, currentUser?.username ?? null, ip, {
    targetUserId: userId,
    targetUsername: target.username,
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/users/[id] — delete an admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const ip = getClientIp(request.headers);
  const currentUser = await getAdminSession();

  if (userId === currentUser?.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  // Prevent deleting the last superadmin
  const target = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (target.role === "superadmin") {
    const superadminCount = await prisma.adminUser.count({ where: { role: "superadmin" } });
    if (superadminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the last superadmin." }, { status: 400 });
    }
  }

  await deleteAllUserSessions(userId);
  await prisma.adminUser.delete({ where: { id: userId } });

  await logAudit("user_deleted", currentUser?.id ?? null, currentUser?.username ?? null, ip, {
    deletedUserId: userId,
    deletedUsername: target.username,
  });

  return NextResponse.json({ ok: true });
}
