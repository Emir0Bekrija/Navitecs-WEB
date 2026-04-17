import { NextResponse } from "next/server";
import { getJobs } from "@/lib/data";

// GET /api/jobs — public endpoint: returns only active jobs
export async function GET() {
  const jobs = await getJobs();
  return NextResponse.json(jobs.filter((j) => j.active));
}
