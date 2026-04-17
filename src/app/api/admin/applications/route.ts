import { NextResponse } from "next/server";
import { getApplications } from "@/lib/data";

// GET /api/admin/applications
export async function GET() {
  const applications = await getApplications();
  return NextResponse.json(applications);
}
