import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const SESSION_COOKIE = "nca_sess";
export const SESSION_MAX_AGE_S = 4 * 60 * 60; // 4 hours

export type AdminSessionUser = {
  id: number;
  username: string;
  role: string;
  sessionId: string;
  sessionToken: string;
};

export async function createSession(
  userId: number,
  ip: string,
  userAgent: string | null,
): Promise<string> {
  const token = crypto.randomBytes(48).toString("hex"); // 96 hex chars
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_S * 1000);
  await prisma.adminSession.create({
    data: {
      userId,
      token,
      ip,
      userAgent: userAgent ? userAgent.slice(0, 500) : null,
      expiresAt,
    },
  });
  return token;
}

export async function getSessionUser(token: string): Promise<AdminSessionUser | null> {
  try {
    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { user: { select: { id: true, username: true, role: true } } },
    });
    if (!session) return null;
    if (session.expiresAt <= new Date()) {
      await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }
    return {
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
      sessionId: session.id,
      sessionToken: token,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookie(): Promise<AdminSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionUser(token);
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { token } }).catch(() => {});
}

export async function deleteSessionById(id: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { id } }).catch(() => {});
}

export async function deleteAllUserSessions(userId: number): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { userId } }).catch(() => {});
}

export async function logAudit(
  action: string,
  userId: number | null,
  username: string | null,
  ip: string | null,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await prisma.auditLog
    .create({ data: { action, userId, username, ip, metadata: metadata as any } })
    .catch(() => {});
}
