import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSmtpConfig, saveSmtpConfig, sendEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/proxy";

const SmtpSchema = z.object({
  host: z.string().max(255).optional(),
  port: z.number().int().min(1).max(65535).optional(),
  secure: z.boolean().optional(),
  user: z.string().max(255).optional(),
  password: z.string().max(255).optional(),
  fromName: z.string().max(100).optional(),
  fromEmail: z.string().max(255).optional(),
});

// GET /api/admin/settings — get SMTP config (password masked)
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const cfg = await getSmtpConfig();
  return NextResponse.json({ ...cfg, password: cfg.password ? "••••••••" : "" });
}

// PUT /api/admin/settings — update SMTP config
export async function PUT(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = SmtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const current = await getSmtpConfig();
  const updated = {
    host: parsed.data.host ?? current.host,
    port: parsed.data.port ?? current.port,
    secure: parsed.data.secure ?? current.secure,
    user: parsed.data.user ?? current.user,
    // Keep existing password if client sends the masked placeholder
    password:
      parsed.data.password && parsed.data.password !== "••••••••"
        ? parsed.data.password
        : current.password,
    fromName: parsed.data.fromName ?? current.fromName,
    fromEmail: parsed.data.fromEmail ?? current.fromEmail,
  };

  await saveSmtpConfig(updated);
  return NextResponse.json({ ok: true });
}

// POST /api/admin/settings — send test email
export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const testEmail = typeof body?.testEmail === "string" ? body.testEmail.trim() : "";
  if (!testEmail) {
    return NextResponse.json({ error: "testEmail required" }, { status: 400 });
  }

  try {
    await sendEmail(
      testEmail,
      "NAVITECS SMTP Test",
      "<p>Your SMTP configuration is working correctly.</p><p><strong>NAVITECS Admin Panel</strong></p>",
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Test failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
