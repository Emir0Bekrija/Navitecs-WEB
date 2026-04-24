import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function groupByDay(dates: Date[]): { day: string; count: number }[] {
  const map = new Map<string, number>();
  for (const d of dates) {
    const key = toDayKey(d);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

function groupByField(values: (string | null | undefined)[], topN = 8): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const v of values) {
    if (!v) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

// GET /api/admin/dashboard/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const from = fromParam ? new Date(fromParam) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const to = toParam ? new Date(toParam + "T23:59:59") : new Date();

  try {
    const [applications, contacts, pageViews]: [
      { submittedAt: Date; role: string; job: { title: string } | null }[],
      { submittedAt: Date; projectType: string | null }[],
      { createdAt: Date; path: string }[],
    ] = await Promise.all([
      prisma.application.findMany({
        where: { submittedAt: { gte: from, lte: to } },
        select: { submittedAt: true, role: true, job: { select: { title: true } } },
      }),
      prisma.contact.findMany({
        where: { submittedAt: { gte: from, lte: to } },
        select: { submittedAt: true, projectType: true },
      }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: from, lte: to } },
        select: { createdAt: true, path: true },
      }),
    ]);

    const applicationsByDay = groupByDay(applications.map((a) => a.submittedAt));
    const contactsByDay = groupByDay(contacts.map((c) => c.submittedAt));

    const applicationsByRole = groupByField(
      applications.map((a) => a.job?.title ?? a.role)
    );
    const contactsByProjectType = groupByField(
      contacts.map((c) => c.projectType)
    );

    // Project views: paths that match /projects/<id> (not /projects itself)
    const projectPageViews = pageViews.filter(
      (p) => p.path.startsWith("/projects/")
    );
    const projectViews = groupByField(
      projectPageViews.map((p) => p.path.replace("/projects/", "")),
      20
    );

    // Page views: exclude /projects/<id> sub-pages (shown in project views above)
    // Normalise "/" and "/home" to the same bucket
    const normalizedPaths = pageViews
      .filter((p) => !p.path.startsWith("/projects/") || p.path === "/projects")
      .map((p) => (p.path === "/" ? "/home" : p.path));
    const pageViewsByPath = groupByField(normalizedPaths, 15);

    return NextResponse.json({
      totals: {
        applications: applications.length,
        contacts: contacts.length,
      },
      applicationsByDay,
      contactsByDay,
      applicationsByRole,
      contactsByProjectType,
      projectViews,
      pageViewsByPath,
    });
  } catch (err) {
    console.error("[GET /api/admin/dashboard/stats]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
