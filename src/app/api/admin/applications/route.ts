import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";
import { tzStartOfDay, tzEndOfDay } from "@/lib/dateUtils";

const PAGE_SIZE = 20;

// GET /api/admin/applications
// Returns applicants grouped with their applications, ordered by most recent submission.
// Query params: jobId, dateFrom, dateTo, minScore, hasScore, page
export async function GET(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const jobId    = searchParams.get("jobId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo   = searchParams.get("dateTo");
  const minScore = searchParams.get("minScore");
  // "yes" = must have a score, "no" = must not have a score, null = any
  const hasScore = searchParams.get("hasScore");
  // "yes" = application has a CV file, "no" = no CV file
  const hasCV    = searchParams.get("hasCV");
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  // Filter applied to applications (jobId / date range / hasCV)
  const applicationWhere = {
    ...(jobId ? { jobId } : {}),
    ...(dateFrom || dateTo
      ? {
          submittedAt: {
            ...(dateFrom ? { gte: tzStartOfDay(dateFrom) } : {}),
            ...(dateTo ? { lte: tzEndOfDay(dateTo) } : {}),
          },
        }
      : {}),
    ...(hasCV === "yes"      ? { cvPath: { not: null } }                       : {}),
    ...(hasCV === "no"       ? { cvPath: null }                                : {}),
    ...(hasCV === "deletable"? { cvDeletable: true, cvPath: { not: null } }    : {}),
  };

  // Applicant-level filter
  const applicantWhere = {
    applications: { some: applicationWhere },
    ...(minScore ? { score: { gte: parseInt(minScore, 10) } } : {}),
    ...(hasScore === "yes" ? { score: { not: null } } : {}),
    ...(hasScore === "no" ? { score: null } : {}),
  };

  // Build dynamic WHERE clauses for raw SQL (to get applicants ordered by most recent submittedAt)
  const conditions: Prisma.Sql[] = [Prisma.sql`app.applicantId IS NOT NULL`];

  if (jobId) {
    conditions.push(Prisma.sql`app.jobId = ${jobId}`);
  }
  if (dateFrom) {
    conditions.push(Prisma.sql`app.submittedAt >= ${tzStartOfDay(dateFrom)}`);
  }
  if (dateTo) {
    conditions.push(Prisma.sql`app.submittedAt <= ${tzEndOfDay(dateTo)}`);
  }
  if (minScore) {
    conditions.push(Prisma.sql`a.score >= ${parseInt(minScore, 10)}`);
  }
  if (hasScore === "yes") {
    conditions.push(Prisma.sql`a.score IS NOT NULL`);
  }
  if (hasScore === "no") {
    conditions.push(Prisma.sql`a.score IS NULL`);
  }
  if (hasCV === "yes") {
    conditions.push(Prisma.sql`app.cvPath IS NOT NULL`);
  }
  if (hasCV === "no") {
    conditions.push(Prisma.sql`app.cvPath IS NULL`);
  }
  if (hasCV === "deletable") {
    conditions.push(Prisma.sql`app.cvDeletable = 1 AND app.cvPath IS NOT NULL`);
  }

  const whereClause = Prisma.join(conditions, " AND ");

  try {
  // Get total count and ordered IDs in one raw query
  const [countRows, idRows] = await Promise.all([
    prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(DISTINCT a.id) AS total
      FROM applicants a
      INNER JOIN applications app ON app.applicantId = a.id
      WHERE ${whereClause}
    `,
    prisma.$queryRaw<{ id: string }[]>`
      SELECT a.id
      FROM applicants a
      INNER JOIN applications app ON app.applicantId = a.id
      WHERE ${whereClause}
      GROUP BY a.id
      ORDER BY MAX(app.submittedAt) DESC
      LIMIT ${PAGE_SIZE} OFFSET ${skip}
    `,
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  const orderedIds = idRows.map((r) => r.id);

  // Fetch full applicant data for this page, preserving the SQL-determined order
  const applicantsMap = orderedIds.length > 0
    ? await prisma.applicant.findMany({
        where: { id: { in: orderedIds }, ...applicantWhere },
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
          applications: {
            where: applicationWhere,
            select: {
              id: true,
              role: true,
              submittedAt: true,
              cvFileName: true,
              cvDeletable: true,
              message: true,
              phone: true,
              linkedin: true,
              portfolio: true,
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
      })
    : [];

  // Restore the order from the raw query (findMany with `in` doesn't guarantee order)
  const applicantsById = new Map(applicantsMap.map((a) => [a.id, a]));
  const applicants = orderedIds.map((id) => applicantsById.get(id)).filter(Boolean);

  return NextResponse.json({
    data: applicants,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
  } catch (err) {
    console.error("[GET /api/admin/applications]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
