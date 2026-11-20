"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSent(false);
    if (!email.trim()) {
      setError("Enter your account email address.");
      return;
    }
    setSending(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send reset email."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090b0b] px-5 py-12">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-[0.22em]">
          QLUB<span className="gold">.</span>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#9aa6a1] hover:text-[#f5f5f1]"
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>

      <section className="panel mx-auto mt-12 max-w-lg p-7 md:p-9">
        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-[#c8a66a]">
          <ShieldCheck size={14} />
          <span>PASSWORD RECOVERY</span>
        </div>
        <h1 className="font-display mt-3 text-3xl font-semibold">
          Reset or set account password
        </h1>
        <p className="muted mt-3 text-sm leading-6">
          Enter your Super Admin or restaurant workspace email. Firebase
          Authentication will send a secure link to reset your password (or set
          a password if you previously used Google sign-in).
        </p>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs leading-5 text-red-200"
          >
            {error}
          </div>
        )}

        {sent && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-xs leading-5 text-emerald-200">
            <MailCheck size={16} className="mt-0.5 shrink-0" />
            <span>
              Password reset link sent to{" "}
              <strong className="font-mono-num">{email.trim()}</strong>. Check
              your inbox (and spam folder), set your password, then return to
              sign in.
            </span>
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              Account email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="robaalali86@gmail.com"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1] placeholder:text-[#63706b]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={sending}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <KeyRound size={15} />
              <span>{sending ? "Sending link..." : "Send password reset email"}</span>
            </button>
            <Link
              href="/admin"
              className="flex h-11 items-center justify-center rounded-full border border-[#39413e] px-5 text-xs font-medium text-[#f5f5f1] hover:border-[#c8a66a]"
            >
              Admin sign-in
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
          Loading password recovery...
        </main>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
