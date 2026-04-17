import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getApplications, saveApplications } from "@/lib/data";
import type { Application } from "@/types/index";

const CV_DIR = path.join(process.cwd(), "uploads", "cvs");

// POST /api/apply — public job application submission (multipart/form-data)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = String(formData.get("firstName") ?? "").slice(0, 100);
    const email = String(formData.get("email") ?? "").slice(0, 200);
    const role = String(formData.get("role") ?? "").slice(0, 200);

    if (!firstName || !email || !role) {
      return NextResponse.json(
        { error: "First name, email, and role are required" },
        { status: 400 },
      );
    }

    let cvFileName: string | undefined;
    const cvFile = formData.get("cv") as File | null;

    if (cvFile && cvFile.size > 0) {
      if (cvFile.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
      }
      if (cvFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
      }

      // Ensure upload directory exists
      await fs.mkdir(CV_DIR, { recursive: true });

      // Sanitise original name and prefix with timestamp
      const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      cvFileName = `${Date.now()}-${safeName}`;
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      await fs.writeFile(path.join(CV_DIR, cvFileName), buffer);
    }

    const application: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      firstName,
      lastName: String(formData.get("lastName") ?? "").slice(0, 100),
      email,
      phone: String(formData.get("phone") ?? "").slice(0, 50),
      role,
      linkedin: String(formData.get("linkedin") ?? "").slice(0, 300),
      portfolio: String(formData.get("portfolio") ?? "").slice(0, 300),
      message: String(formData.get("message") ?? "").slice(0, 5000),
      cvFileName,
      submittedAt: new Date().toISOString(),
    };

    const applications = await getApplications();
    applications.unshift(application);
    await saveApplications(applications);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
