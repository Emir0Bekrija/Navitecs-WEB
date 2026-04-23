import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/proxy";

// GET /api/admin/contacts
// Query params: email, name, projectType, service, dateFrom, dateTo
export async function GET(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = request.nextUrl;
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const projectType = searchParams.get("projectType");
  const service = searchParams.get("service");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const contacts = await prisma.contact.findMany({
    where: {
      ...(email ? { email: { contains: email } } : {}),
      ...(name ? { name: { contains: name } } : {}),
      ...(projectType ? { projectType } : {}),
      ...(service ? { service } : {}),
      // projectServices is comma-separated; filter by substring match
      ...(searchParams.get("projectServices")
        ? { projectServices: { contains: searchParams.get("projectServices")! } }
        : {}),
      ...(dateFrom || dateTo
        ? {
            submittedAt: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo + "T23:59:59") } : {}),
            },
          }
        : {}),
    },
    include: {
      companyContact: { select: { id: true, score: true, comments: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(contacts);
}
