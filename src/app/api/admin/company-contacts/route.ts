import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";
import { tzStartOfDay, tzEndOfDay } from "@/lib/dateUtils";

const PAGE_SIZE = 20;

// GET /api/admin/company-contacts
// Query params: name, email, company, minScore, dateFrom, dateTo, page
export async function GET(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const company = searchParams.get("company");
  const minScore = searchParams.get("minScore");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(name ? { name: { contains: name } } : {}),
    ...(email ? { email: { contains: email } } : {}),
    ...(company ? { company: { contains: company } } : {}),
    ...(minScore ? { score: { gte: parseInt(minScore, 10) } } : {}),
    ...(dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom ? { gte: tzStartOfDay(dateFrom) } : {}),
            ...(dateTo ? { lte: tzEndOfDay(dateTo) } : {}),
          },
        }
      : {}),
  };

  try {
    const [total, contacts] = await prisma.$transaction([
      prisma.companyContact.count({ where }),
      prisma.companyContact.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          phone: true,
          score: true,
          comments: true,
          createdAt: true,
          updatedAt: true,
          contacts: {
            select: {
              id: true,
              projectType: true,
              service: true,
              projectServices: true,
              message: true,
              submittedAt: true,
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
      data: contacts,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (err) {
    console.error("[GET /api/admin/company-contacts]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
