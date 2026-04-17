import { NextRequest, NextResponse } from "next/server";
import { getJobs, saveJobs } from "@/lib/data";

// POST /api/admin/jobs/reorder
// Body: { ids: string[] } — full ordered list of job IDs
export async function POST(request: NextRequest) {
  const { ids } = await request.json() as { ids: string[] };
  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "ids must be an array" }, { status: 400 });
  }

  const jobs = await getJobs();
  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  // Rebuild the array in the given order, keeping any jobs not in ids at the end
  const reordered = [
    ...ids.map((id) => jobMap.get(id)).filter(Boolean),
    ...jobs.filter((j) => !ids.includes(j.id)),
  ] as typeof jobs;

  await saveJobs(reordered);
  return NextResponse.json({ ok: true });
}
