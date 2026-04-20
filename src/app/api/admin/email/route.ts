import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/proxy";

const EmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(10000),
});

// POST /api/admin/email — send a reply email
export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json();
  const parsed = EmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { to, subject, message } = parsed.data;
  const html = `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#222;">
${message.replace(/\n/g, "<br/>")}
<br/><br/>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>
<p style="font-size:13px;color:#888;">NAVITECS d.o.o. &mdash; Sarajevo, Bosnia and Herzegovina</p>
</div>`;

  try {
    await sendEmail(to, subject, html);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
