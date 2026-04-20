import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/jobs — public: returns only active jobs, ordered
export async function GET() {
  const jobs = await prisma.job.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      department: true,
      location: true,
      type: true,
      description: true,
      active: true,
      createdAt: true,
    },
  });
  return NextResponse.json(jobs);
}
