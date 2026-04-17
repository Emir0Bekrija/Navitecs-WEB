import { NextRequest, NextResponse } from "next/server";
import { getContacts, saveContacts } from "@/lib/data";
import type { ContactSubmission } from "@/types/index";

// POST /api/contact — public contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    const submission: ContactSubmission = {
      id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(body.name).slice(0, 200),
      email: String(body.email).slice(0, 200),
      company: String(body.company || "").slice(0, 200),
      phone: String(body.phone || "").slice(0, 50),
      projectType: String(body.projectType || "").slice(0, 100),
      message: String(body.message).slice(0, 5000),
      submittedAt: new Date().toISOString(),
    };

    const contacts = await getContacts();
    contacts.unshift(submission); // newest first
    await saveContacts(contacts);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
