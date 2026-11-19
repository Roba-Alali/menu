"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        message?: string;
        resetToken?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Failed to generate reset token.");
        setLoading(false);
        return;
      }
      setMessage(data.message || "Reset instructions sent.");
      if (data.resetToken) {
        setToken(data.resetToken);
      }
      setStep("reset");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = (await res.json()) as { error?: string; email?: string };
      if (!res.ok) {
        setError(data.error || "Unable to reset password.");
        setLoading(false);
        return;
      }
      setMessage(`Password updated for ${data.email}. You can now sign in.`);
      setStep("done");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
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
        <p className="gold text-xs font-medium tracking-[0.2em]">
          PASSWORD RECOVERY
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold">
          Reset workspace password
        </h1>

        {step === "request" && (
          <form onSubmit={handleRequest} className="mt-6 space-y-5">
            <p className="muted text-sm leading-6">
              Enter your account email to generate a secure time-limited reset
              token.
            </p>
            <div>
              <label
                htmlFor="reset-email"
                className="mb-2 block text-xs font-medium text-[#aab4af]"
              >
                Account email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa6a1]"
                />
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="house@thehouse.com"
                  className="h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] pl-10 pr-4 text-sm text-[#f5f5f1]"
                />
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-300" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e]"
            >
              {loading ? "Generating..." : "Send reset token"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset} className="mt-6 space-y-5">
            {message && (
              <div className="rounded-xl border border-[#3a4942] bg-[#151e1b] p-4 text-xs text-[#cbe3d5]">
                {message}
              </div>
            )}
            <div>
              <label
                htmlFor="reset-token"
                className="mb-2 block text-xs font-medium text-[#aab4af]"
              >
                Reset token
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa6a1]"
                />
                <input
                  id="reset-token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="font-mono-num h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] pl-10 pr-4 text-xs text-[#f5f5f1]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-xs font-medium text-[#aab4af]"
              >
                New password (min 6 characters)
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-4 text-sm text-[#f5f5f1]"
              />
            </div>
            {error && (
              <p className="text-xs text-red-300" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e]"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-3 rounded-xl border border-[#2e4c3d] bg-[#13221b] p-4 text-sm text-[#cde6d7]">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#86efac]" />
              <span>{message}</span>
            </div>
            <Link
              href="/login"
              className="flex h-11 w-full items-center justify-center rounded-full bg-[#c8a66a] text-sm font-semibold text-[#10110e]"
            >
              Return to sign in
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
