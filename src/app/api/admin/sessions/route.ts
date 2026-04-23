import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin, getAdminSession } from "@/lib/proxy";
import { logAudit } from "@/lib/adminAuth";
import { getClientIp } from "@/lib/rateLimit";

// GET /api/admin/sessions — list all active sessions
export async function GET() {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const currentUser = await getAdminSession();

  const sessions = await prisma.adminSession.findMany({
    where: { expiresAt: { gt: new Date() } },
    include: { user: { select: { id: true, username: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      username: s.user.username,
      role: s.user.role,
      ip: s.ip,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.id === currentUser?.sessionId,
    })),
  );
}

// DELETE /api/admin/sessions — revoke all sessions except the current one
export async function DELETE(request: NextRequest) {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const ip = getClientIp(request.headers);
  const currentUser = await getAdminSession();

  await prisma.adminSession.deleteMany({
    where: { id: { not: currentUser?.sessionId } },
  });

  await logAudit("sessions_revoke_all", currentUser?.id ?? null, currentUser?.username ?? null, ip);
  return NextResponse.json({ ok: true });
}
