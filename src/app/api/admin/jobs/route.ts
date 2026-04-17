import { NextRequest, NextResponse } from "next/server";
import { getJobs, saveJobs } from "@/lib/data";
import type { Job } from "@/types/index";

// GET /api/admin/jobs
export async function GET() {
  const jobs = await getJobs();
  return NextResponse.json(jobs);
}

// POST /api/admin/jobs
export async function POST(request: NextRequest) {
  const body = await request.json();
  const jobs = await getJobs();

  const newJob: Job = {
    id:
      body.id ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    title: body.title,
    department: body.department,
    location: body.location,
    type: body.type,
    description: body.description,
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  };

  // Ensure unique id
  const existingIds = new Set(jobs.map((j) => j.id));
  if (existingIds.has(newJob.id)) {
    newJob.id = `${newJob.id}-${Date.now()}`;
  }

  jobs.push(newJob);
  await saveJobs(jobs);
  return NextResponse.json(newJob, { status: 201 });
}
