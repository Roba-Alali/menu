import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, signSessionToken } from "@/lib/auth";
import { getStore, getUserMemberships, toPublicUser, verifyPassword } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const store = getStore();
    const user = store.users.find((u) => u.email.toLowerCase() === email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const memberships = getUserMemberships(user.id);
    const redirectTo =
      user.platformRole === "owner" || user.platformRole === "support"
        ? "/admin"
        : memberships[0]?.restaurantSlug
          ? `/dashboard/${memberships[0].restaurantSlug}`
          : "/";

    const token = signSessionToken(user.id);
    const res = NextResponse.json({
      user: toPublicUser(user),
      memberships,
      redirectTo,
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
