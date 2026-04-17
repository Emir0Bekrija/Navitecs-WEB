import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/projects/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

// PUT /api/admin/projects/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  projects[idx] = {
    ...projects[idx],
    ...body,
    id,
    caseStudy: {
      ...projects[idx].caseStudy,
      ...(body.caseStudy || {}),
    },
  };
  await saveProjects(projects);
  return NextResponse.json(projects[idx]);
}

// DELETE /api/admin/projects/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await saveProjects(filtered);
  return NextResponse.json({ ok: true });
}
