import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/data";
import type { Project } from "@/types/index";

// GET /api/admin/projects
export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

// POST /api/admin/projects
export async function POST(request: NextRequest) {
  const body = await request.json();
  const projects = await getProjects();

  const newProject: Project = {
    id:
      body.id ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    title: body.title,
    category: body.category,
    description: body.description,
    scope: body.scope,
    image: body.image || "",
    caseStudy: {
      challenge: body.caseStudy?.challenge || "",
      solution: body.caseStudy?.solution || "",
      results: body.caseStudy?.results || [],
    },
  };

  const existingIds = new Set(projects.map((p) => p.id));
  if (existingIds.has(newProject.id)) {
    newProject.id = `${newProject.id}-${Date.now()}`;
  }

  projects.push(newProject);
  await saveProjects(projects);
  return NextResponse.json(newProject, { status: 201 });
}
