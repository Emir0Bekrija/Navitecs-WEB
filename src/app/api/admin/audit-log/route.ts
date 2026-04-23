import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/proxy";

const PAGE_SIZE = 50;

// GET /api/admin/audit-log — paginated security event log
export async function GET(request: NextRequest) {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const action = searchParams.get("action") ?? undefined;
  const skip = (page - 1) * PAGE_SIZE;

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where: action ? { action } : {} }),
    prisma.auditLog.findMany({
      where: action ? { action } : {},
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        action: true,
        ip: true,
        username: true,
        userId: true,
        metadata: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    data: logs,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}
