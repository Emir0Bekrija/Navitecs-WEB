import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/proxy";
import { getSiteSettings, saveSiteSettings } from "@/lib/siteSettings";

const Schema = z.object({
  projectsComingSoon: z.boolean().optional(),
});

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await saveSiteSettings(parsed.data);
  return NextResponse.json(updated);
}
