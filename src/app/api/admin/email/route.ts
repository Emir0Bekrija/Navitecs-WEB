import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// POST /api/admin/email — send a reply email
export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "to, subject and message are required" },
        { status: 400 },
      );
    }

    // Wrap plain-text message in simple HTML
    const html = `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#222;">
${String(message).replace(/\n/g, "<br/>")}
<br/><br/>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>
<p style="font-size:13px;color:#888;">NAVITECS d.o.o. &mdash; Sarajevo, Bosnia and Herzegovina</p>
</div>`;

    await sendEmail(String(to), String(subject), html);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
