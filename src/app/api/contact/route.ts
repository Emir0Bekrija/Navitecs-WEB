import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminEvents } from "@/lib/events";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  company: z.string().max(200).optional().default(""),
  phone: z.string().max(50).optional().default(""),
  projectType: z.string().max(100).optional().default(""),
  service: z.string().max(100).optional().default(""),
  projectServices: z.string().max(500).optional().default(""),
  message: z.string().min(1).max(5000),
});

// POST /api/contact — public contact form submission
export async function POST(request: NextRequest) {
  const { ok, retryAfter } = rateLimit(
    `contact:${getClientIp(request.headers)}`,
    5,           // 5 submissions
    60 * 60 * 1000, // per hour
  );
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a while before trying again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // Upsert CompanyContact for tracking repeated contacts
    const companyContact = await prisma.companyContact.upsert({
      where: { email: data.email },
      update: { name: data.name, company: data.company || null, phone: data.phone || null },
      create: { email: data.email, name: data.name, company: data.company || null, phone: data.phone || null },
    });

    await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        projectType: data.projectType || null,
        service: data.service || null,
        projectServices: data.projectServices || null,
        message: data.message,
        companyContactId: companyContact.id,
      },
    });

    adminEvents.emit("new_contact");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
