import crypto from "crypto";
import { cookies } from "next/headers";
import { getStore, toPublicUser } from "./store";
import type { PublicUser } from "./types";

export const SESSION_COOKIE = "qlub_session";
const DEV_FALLBACK_SECRET = "qlub-foundation-local-session-secret-change-in-prod";

function getSecret(): string {
  return process.env.AUTH_SECRET || DEV_FALLBACK_SECRET;
}

export function signSessionToken(userId: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = Buffer.from(JSON.stringify({ userId, exp })).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): { userId: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      userId: string;
      exp: number;
    };
    if (!parsed.userId || Date.now() > parsed.exp) return null;
    return { userId: parsed.userId };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const verified = verifySessionToken(token);
  if (!verified) return null;
  const store = getStore();
  const user = store.users.find((u) => u.id === verified.userId);
  return user ? toPublicUser(user) : null;
}
