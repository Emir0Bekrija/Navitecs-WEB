import { NextRequest, NextResponse } from "next/server";
import { getSmtpConfig, saveSmtpConfig, sendEmail } from "@/lib/email";

// GET /api/admin/settings — get SMTP config
export async function GET() {
  const cfg = await getSmtpConfig();
  // Never expose the password in the response
  return NextResponse.json({ ...cfg, password: cfg.password ? "••••••••" : "" });
}

// PUT /api/admin/settings — update SMTP config
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const current = await getSmtpConfig();

  const updated = {
    host: String(body.host ?? current.host),
    port: Number(body.port ?? current.port),
    secure: Boolean(body.secure ?? current.secure),
    user: String(body.user ?? current.user),
    // If password field sent as masked placeholder, keep the current one
    password:
      body.password && body.password !== "••••••••"
        ? String(body.password)
        : current.password,
    fromName: String(body.fromName ?? current.fromName),
    fromEmail: String(body.fromEmail ?? current.fromEmail),
  };

  await saveSmtpConfig(updated);
  return NextResponse.json({ ok: true });
}

// POST /api/admin/settings/test — send a test email
export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    if (!testEmail) {
      return NextResponse.json({ error: "testEmail required" }, { status: 400 });
    }
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
