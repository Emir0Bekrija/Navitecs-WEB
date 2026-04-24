import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Schema = z.object({
  path: z.string().max(255).startsWith("/"),
});

// POST /api/track — public, no auth, fire-and-forget page view logging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json(null, { status: 204 });

    await prisma.pageView.create({ data: { path: parsed.data.path } });
  } catch {
    // silently ignore — tracking must never break the page
  }
  return new Response(null, { status: 204 });
}
