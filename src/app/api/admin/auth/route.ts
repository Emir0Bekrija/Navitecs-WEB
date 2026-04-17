import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  COOKIE_NAME,
} from "@/lib/auth";

// POST /api/admin/auth — login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (typeof password !== "string" || !password) {
      return NextResponse.json(
        { error: "Password required" },
        { status: 400 },
      );
    }

    const valid = await verifyPassword(password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 },
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours in seconds
    });
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
