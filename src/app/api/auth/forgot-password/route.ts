import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getStore, persistStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = (body.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const store = getStore();
    const user = store.users.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      // Return neutral confirmation while keeping response helpful for local testing
      return NextResponse.json({
        ok: true,
        message: "If an account exists for that email, a reset token has been generated.",
      });
    }

    const token = crypto.randomBytes(16).toString("hex");
    store.passwordResets = store.passwordResets.filter((r) => r.email !== email);
    store.passwordResets.push({
      token,
      email,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    });
    persistStore(store);

    return NextResponse.json({
      ok: true,
      message: "Password reset token generated. Use it below to set a new password.",
      resetToken: token,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process reset request." }, { status: 500 });
  }
}
