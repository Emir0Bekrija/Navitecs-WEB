import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminEvents } from "@/lib/events";

const CV_DIR = path.join(process.cwd(), "uploads", "cvs");

const ApplySchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).default(""),
  email: z.string().email().max(200),
  phone: z.string().max(50).default(""),
  role: z.string().min(1).max(200),
  linkedin: z.string().max(300).default(""),
  portfolio: z.string().max(300).default(""),
  message: z.string().max(5000).default(""),
  jobId: z.string().max(36).optional(),
});

// POST /api/apply — public job application (multipart/form-data)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fields = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      role: String(formData.get("role") ?? ""),
      linkedin: String(formData.get("linkedin") ?? ""),
      portfolio: String(formData.get("portfolio") ?? ""),
      message: String(formData.get("message") ?? ""),
      jobId: String(formData.get("jobId") ?? "") || undefined,
    };

    const parsed = ApplySchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // Handle CV upload
    let cvFileName: string | null = null;
    let cvPath: string | null = null;
    const cvFile = formData.get("cv") as File | null;

    if (cvFile && cvFile.size > 0) {
      if (cvFile.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
      }
      if (cvFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
      }

      await fs.mkdir(CV_DIR, { recursive: true });
      const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
      cvFileName = `${Date.now()}-${safeName}`;
      cvPath = `cvs/${cvFileName}`;
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      await fs.writeFile(path.join(CV_DIR, cvFileName), buffer);
    }

    // Upsert Applicant for cross-application tracking
    const applicant = await prisma.applicant.upsert({
      where: { email: data.email },
      update: { firstName: data.firstName, lastName: data.lastName, phone: data.phone || null },
      create: { email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone || null },
    });

    // Verify jobId exists if provided
    const jobId = data.jobId
      ? (await prisma.job.findUnique({ where: { id: data.jobId }, select: { id: true } }))?.id ?? null
      : null;

    await prisma.application.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        linkedin: data.linkedin || null,
        portfolio: data.portfolio || null,
        message: data.message || null,
        cvFileName,
        cvPath,
        jobId,
        applicantId: applicant.id,
      },
    });

    adminEvents.emit("new_application");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
