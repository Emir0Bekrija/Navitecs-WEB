import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/proxy";
import { tzStartOfDay, tzEndOfDay } from "@/lib/dateUtils";

const PAGE_SIZE = 50;

// GET /api/admin/audit-log — paginated, filterable security event log
// Query params: page, action, ip, username, dateFrom (ISO), dateTo (ISO)
export async function GET(request: NextRequest) {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const action   = searchParams.get("action")   || undefined;
  const ip       = searchParams.get("ip")       || undefined;
  const username = searchParams.get("username") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo   = searchParams.get("dateTo")   || undefined;

  const where = {
    ...(action   && { action }),
    ...(ip       && { ip:       { contains: ip } }),
    ...(username && { username: { contains: username } }),
    ...((dateFrom || dateTo) && {
      createdAt: {
        ...(dateFrom && { gte: tzStartOfDay(dateFrom) }),
        ...(dateTo   && { lte: tzEndOfDay(dateTo) }),
      },
    }),
  };

  const skip = (page - 1) * PAGE_SIZE;

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
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
