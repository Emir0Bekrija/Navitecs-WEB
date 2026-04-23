import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const PAGE_SIZE = 20;

// GET /api/admin/applicants
// Query params: minScore, fitsRoles, dateFrom, dateTo, page
export async function GET(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const minScore = searchParams.get("minScore");
  const fitsRoles = searchParams.get("fitsRoles");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(minScore ? { score: { gte: parseInt(minScore, 10) } } : {}),
    ...(fitsRoles ? { fitsRoles: { contains: fitsRoles } } : {}),
    ...(dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo ? { lte: new Date(dateTo + "T23:59:59") } : {}),
          },
        }
      : {}),
  };

  try {
    const [total, applicants] = await prisma.$transaction([
      prisma.applicant.count({ where }),
      prisma.applicant.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          score: true,
          comments: true,
          fitsRoles: true,
          doesNotFit: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { applications: true } },
          applications: {
            select: {
              id: true,
              role: true,
              submittedAt: true,
              job: { select: { id: true, title: true } },
              currentlyEmployed: true,
              noticePeriod: true,
              yearsOfExperience: true,
              location: true,
              bimSoftware: true,
            },
            orderBy: { submittedAt: "desc" },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
    ]);

    return NextResponse.json({
      data: applicants,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (err) {
    console.error("[GET /api/admin/applicants]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
