import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page through
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all other /admin/* UI routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySessionToken(token))) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect all /api/admin/* routes (except the auth/login endpoint itself)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/auth") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
