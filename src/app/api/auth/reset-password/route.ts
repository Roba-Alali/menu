import { NextRequest, NextResponse } from "next/server";
import { getStore, hashPassword, persistStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { token?: string; newPassword?: string };
    const token = (body.token || "").trim();
    const newPassword = body.newPassword || "";

    if (!token || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Valid reset token and password (min 6 characters) are required." },
        { status: 400 }
      );
    }

    const store = getStore();
    const record = store.passwordResets.find((r) => r.token === token);
    if (!record || new Date(record.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Reset token is invalid or expired." },
        { status: 400 }
      );
    }

    const user = store.users.find((u) => u.email.toLowerCase() === record.email.toLowerCase());
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    user.passwordHash = hashPassword(newPassword);
    store.passwordResets = store.passwordResets.filter((r) => r.token !== token);
    persistStore(store);

    return NextResponse.json({ ok: true, email: user.email });
  } catch {
    return NextResponse.json({ error: "Unable to reset password." }, { status: 500 });
  }
}
