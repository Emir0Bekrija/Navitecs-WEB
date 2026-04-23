// NextAuth disabled — custom auth is used instead (see /api/auth/login and /api/auth/logout)
import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ error: "Not found" }, { status: 404 }); }
export async function POST() { return NextResponse.json({ error: "Not found" }, { status: 404 }); }
