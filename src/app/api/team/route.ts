import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/team — public, returns active team members
export async function GET(request: NextRequest) {
  const featured = request.nextUrl.searchParams.get("featured");

  const members = await prisma.teamMember.findMany({
    where: {
      active: true,
      ...(featured === "true" ? { featured: true } : {}),
    },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      imageUrl: true,
      featured: true,
      order: true,
    },
  });

  return NextResponse.json(members);
}
