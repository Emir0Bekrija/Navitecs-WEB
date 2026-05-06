import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

// GET /api/admin/dashboard/totals — static counts, not date-range dependent
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const [totalJobs, activeJobs, totalProjects, totalApplicants, totalCompanyContacts] =
      await Promise.all([
        prisma.job.count(),
        prisma.job.count({ where: { active: true } }),
        prisma.project.count(),
        prisma.applicant.count(),
        prisma.companyContact.count(),
      ]);

    return NextResponse.json({ totalJobs, activeJobs, totalProjects, totalApplicants, totalCompanyContacts });
  } catch (err) {
    console.error("[GET /api/admin/dashboard/totals]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
