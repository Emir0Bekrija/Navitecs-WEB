import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

// GET /api/admin/applications/stale-count
// Returns the count of applications and applicants older than 12 months.
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const cutoff = new Date(Date.now() - TWELVE_MONTHS_MS);

  const [staleApplications, recentApplicantIds] = await Promise.all([
    // All applications older than 12 months
    prisma.application.count({
      where: { submittedAt: { lt: cutoff } },
    }),
    // Applicants who have at least one RECENT application (should NOT be deleted)
    prisma.application.findMany({
      where: { submittedAt: { gte: cutoff }, applicantId: { not: null } },
      select: { applicantId: true },
      distinct: ["applicantId"],
    }),
  ]);

  const recentIds = new Set(recentApplicantIds.map((r) => r.applicantId!));

  // Applicants whose every application is stale (no recent activity)
  const staleApplicants = await prisma.applicant.count({
    where: {
      id: { notIn: [...recentIds] },
      applications: { some: { submittedAt: { lt: cutoff } } },
    },
  });

  return NextResponse.json({ staleApplications, staleApplicants });
}
