/**
 * Server-side admin auth guard for API routes.
 *
 * Usage inside any protected API route handler:
 *
 *   const deny = await requireAdmin();
 *   if (deny) return deny;
 *
 * Returns a 401 NextResponse if the request is unauthenticated,
 * or null if the session is valid (caller should continue).
 */
import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
