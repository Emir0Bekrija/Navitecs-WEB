import { NextResponse } from "next/server";
import { getContacts } from "@/lib/data";

// GET /api/admin/contacts
export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json(contacts);
}
