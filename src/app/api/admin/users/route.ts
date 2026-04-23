import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireSuperAdmin, getAdminSession } from "@/lib/proxy";
import { logAudit } from "@/lib/adminAuth";
import { getClientIp } from "@/lib/rateLimit";

// GET /api/admin/users — list all admin users
export async function GET() {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const users = await prisma.adminUser.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(users);
}

const CreateUserSchema = z.object({
  username: z.string().min(3).max(100).regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, _ and - only"),
  password: z.string().min(12).max(200),
  role: z.enum(["admin", "superadmin"]).default("admin"),
});

// POST /api/admin/users — create a new admin user
export async function POST(request: NextRequest) {
  const deny = await requireSuperAdmin();
  if (deny) return deny;

  const ip = getClientIp(request.headers);
  const currentUser = await getAdminSession();

  const body = await request.json().catch(() => null);
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { username, password, role } = parsed.data;

  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.create({
    data: { username, password: hash, role },
    select: { id: true, username: true, role: true, createdAt: true },
  });

  await logAudit("user_created", currentUser?.id ?? null, currentUser?.username ?? null, ip, {
    newUserId: user.id,
    newUsername: username,
    role,
  });

  return NextResponse.json(user, { status: 201 });
}
