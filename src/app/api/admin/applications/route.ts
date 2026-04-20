import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const PAGE_SIZE = 20;

// GET /api/admin/applications
// Query params: jobId, dateFrom, dateTo, minScore, page
export async function GET(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const jobId = searchParams.get("jobId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const minScore = searchParams.get("minScore");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(jobId ? { jobId } : {}),
    ...(dateFrom || dateTo
      ? {
          submittedAt: {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo ? { lte: new Date(dateTo + "T23:59:59") } : {}),
          },
        }
      : {}),
    ...(minScore
      ? { applicant: { score: { gte: parseInt(minScore, 10) } } }
      : {}),
  };

  const [total, applications] = await prisma.$transaction([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      include: {
        job: { select: { id: true, title: true } },
        applicant: {
          select: {
            id: true,
            score: true,
            comments: true,
            fitsRoles: true,
            doesNotFit: true,
            _count: { select: { applications: true } },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json({
    data: applications,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}
