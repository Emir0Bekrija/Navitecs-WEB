/**
 * Next.js middleware — powered by Auth.js.
 * Protects all /admin/* UI pages; redirects unauthenticated users to /admin/login.
 * Auth.js automatically excludes the signIn page (pages.signIn in src/auth.ts).
 * API routes are protected server-side via src/lib/proxy.ts (not here).
 */
import { auth } from "@/auth";

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
