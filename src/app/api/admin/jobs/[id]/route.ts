import { NextRequest, NextResponse } from "next/server";
import { getJobs, saveJobs } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/jobs/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const jobs = await getJobs();
  const job = jobs.find((j) => j.id === id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}

// PUT /api/admin/jobs/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const jobs = await getJobs();
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  jobs[idx] = { ...jobs[idx], ...body, id };
  await saveJobs(jobs);
  return NextResponse.json(jobs[idx]);
}

// DELETE /api/admin/jobs/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const jobs = await getJobs();
  const filtered = jobs.filter((j) => j.id !== id);
  if (filtered.length === jobs.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await saveJobs(filtered);
  return NextResponse.json({ ok: true });
}
