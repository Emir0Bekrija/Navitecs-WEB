import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// PATCH /api/track/duration — update session duration on page leave (beacon)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = typeof body?.id === "number" ? body.id : null;
    const duration = typeof body?.duration === "number" ? Math.round(body.duration) : null;

    if (!id || !duration || duration < 1 || duration > 86400) {
      return new Response(null, { status: 204 });
    }

    await prisma.pageView.update({
      where: { id },
      data: { duration },
    });
  } catch {
    // fire-and-forget
  }
  return new Response(null, { status: 204 });
}
