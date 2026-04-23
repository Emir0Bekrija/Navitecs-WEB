import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin, getAdminSession } from "@/lib/proxy";
import { logAudit } from "@/lib/adminAuth";
import { getClientIp } from "@/lib/rateLimit";

// DELETE /api/admin/sessions/[id] — revoke a specific session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const { id } = await params;
  const ip = getClientIp(request.headers);
  const currentUser = await getAdminSession();

  if (id === currentUser?.sessionId) {
    return NextResponse.json(
      { error: "Use the logout button to end your current session." },
      { status: 400 },
    );
  }

  const deleted = await prisma.adminSession.deleteMany({ where: { id } });
  if (deleted.count === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await logAudit("session_revoked", currentUser?.id ?? null, currentUser?.username ?? null, ip, {
    revokedSessionId: id,
  });

  return NextResponse.json({ ok: true });
}
