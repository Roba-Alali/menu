import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserMemberships } from "@/lib/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null, memberships: [] });
  }
  return NextResponse.json({
    user,
    memberships: getUserMemberships(user.id),
  });
}
