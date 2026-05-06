import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";
import { tzStartOfDay } from "@/lib/dateUtils";

const BUSINESS_TZ = "Europe/Sarajevo";

// GET /api/admin/dashboard/quick — fast mini-stats for dashboard header
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const nowInSarajevo = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const todayStart = tzStartOfDay(nowInSarajevo);

  const weekAgoDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  const weekAgoStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(weekAgoDate);
  const weekStart = tzStartOfDay(weekAgoStr);

  try {
    const [pageViewsToday, pageViewsThisWeek, popupClicksTotal, popupClicksToday, avgDurationRaw] =
      await Promise.all([
        prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
        prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
        prisma.popupClick.count(),
        prisma.popupClick.count({ where: { createdAt: { gte: todayStart } } }),
        prisma.pageView.aggregate({
          _avg: { duration: true },
          where: { duration: { not: null }, createdAt: { gte: weekStart } },
        }),
      ]);

    const avgSessionDuration = avgDurationRaw._avg.duration
      ? Math.round(avgDurationRaw._avg.duration)
      : null;

    return NextResponse.json({
      pageViewsToday,
      pageViewsThisWeek,
      popupClicksTotal,
      popupClicksToday,
      avgSessionDuration,
    });
  } catch (err) {
    console.error("[GET /api/admin/dashboard/quick]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
