import { NextRequest, NextResponse } from "next/server";
import { getApplications, saveApplications } from "@/lib/data";
import type { Application } from "@/types/index";

// POST /api/apply — public job application submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.firstName || !body.email || !body.role) {
      return NextResponse.json(
        { error: "First name, email, and role are required" },
        { status: 400 },
      );
    }

    const application: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      firstName: String(body.firstName).slice(0, 100),
      lastName: String(body.lastName || "").slice(0, 100),
      email: String(body.email).slice(0, 200),
      phone: String(body.phone || "").slice(0, 50),
      role: String(body.role).slice(0, 200),
      linkedin: String(body.linkedin || "").slice(0, 300),
      portfolio: String(body.portfolio || "").slice(0, 300),
      message: String(body.message || "").slice(0, 5000),
      cvFileName: body.cvFileName ? String(body.cvFileName).slice(0, 200) : undefined,
      submittedAt: new Date().toISOString(),
    };

    const applications = await getApplications();
    applications.unshift(application); // newest first
    await saveApplications(applications);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
