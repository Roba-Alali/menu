"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  MailCheck,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase";
import type { PublicUser } from "@/lib/types";

interface AuthFormPanelProps {
  defaultEmail?: string;
  submitLabel?: string;
  allowCreateAccount?: boolean;
  onAuthenticated?: (user: PublicUser) => void | Promise<void>;
}

export default function AuthFormPanel({
  defaultEmail = "",
  submitLabel = "Sign in with Email",
  allowCreateAccount = true,
  onAuthenticated,
}: AuthFormPanelProps) {
  const {
    firebaseUser,
    publicUser,
    isAuthReady,
    isEmailVerified,
    isSigningIn,
    authError,
    clearAuthError,
    signInWithEmail,
    registerWithEmail,
    signInWithGoogle,
    resendVerificationEmail,
    refreshSessionUser,
    signOutUser,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError("");
    setInfoMessage("");
    clearAuthError();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setLocalError("Please enter both your email and password.");
      return;
    }

    const user =
      mode === "signup"
        ? await registerWithEmail({ email: cleanEmail, password, fullName })
        : await signInWithEmail(cleanEmail, password);

    if (!user) return;

    if (mode === "signup" && !auth.currentUser?.emailVerified) {
      setInfoMessage(
        `Account created. A verification link was sent to ${cleanEmail}.`
      );
    }

    if (onAuthenticated && auth.currentUser?.emailVerified) {
      await onAuthenticated(user);
    }
  }

  async function handleGoogleClick() {
    setLocalError("");
    setInfoMessage("");
    clearAuthError();
    const user = await signInWithGoogle();
    if (user && onAuthenticated) {
      await onAuthenticated(user);
    }
  }

  async function handleRefreshVerification() {
    setVerifying(true);
    setLocalError("");
    setInfoMessage("");
    try {
      const refreshed = await refreshSessionUser();
      if (refreshed && auth.currentUser?.emailVerified) {
        setInfoMessage("Email verified! Opening workspace...");
        if (onAuthenticated) {
          await onAuthenticated(refreshed);
        }
      } else {
        setLocalError(
          "Email is still unverified. Click the verification link in your inbox, then press refresh again."
        );
      }
    } finally {
      setVerifying(false);
    }
  }

  async function handleResendVerification() {
    setLocalError("");
    setInfoMessage("");
    const ok = await resendVerificationEmail();
    if (ok) {
      setInfoMessage(
        `Verification link sent to ${firebaseUser?.email || email}. Check your inbox or spam folder.`
      );
    }
  }

  if (isAuthReady && firebaseUser && !isEmailVerified) {
    return (
      <div className="space-y-4 rounded-2xl border border-[#c8a66a]/40 bg-[#121716] p-5">
        <div className="flex items-start gap-3">
          <MailCheck size={18} className="mt-0.5 shrink-0 text-[#c8a66a]" />
          <div>
            <p className="text-sm font-semibold text-[#f5f5f1]">
              Email verification required
            </p>
            <p className="muted mt-1 text-xs leading-5">
              Signed in as{" "}
              <span className="font-mono-num text-[#f5f5f1]">
                {firebaseUser.email}
              </span>
              . Security rules require verified email ownership before unlocking
              Super Admin or restaurant write access.
            </p>
          </div>
        </div>

        {(localError || authError) && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-200"
          >
            {localError || authError}
          </div>
        )}

        {infoMessage && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-200">
            {infoMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            disabled={verifying}
            onClick={() => void handleRefreshVerification()}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#c8a66a] px-4 text-xs font-semibold text-[#10110e] disabled:opacity-60"
          >
            <RefreshCw size={13} />
            {verifying ? "Checking..." : "I verified — Refresh"}
          </button>
          <button
            type="button"
            onClick={() => void handleResendVerification()}
            className="h-10 rounded-full border border-[#39413e] px-4 text-xs font-medium text-[#f5f5f1] hover:border-[#c8a66a]"
          >
            Resend email
          </button>
          <button
            type="button"
            onClick={() => void signOutUser()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#39413e] px-4 text-xs text-[#9aa6a1] hover:text-[#f5f5f1]"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {allowCreateAccount && (
        <div className="grid grid-cols-2 rounded-xl border border-[#252d2b] bg-[#121716] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setLocalError("");
              clearAuthError();
            }}
            className={`rounded-lg py-2 text-xs font-medium transition-colors ${
              mode === "signin"
                ? "bg-[#242b28] text-[#f5f5f1]"
                : "text-[#9aa6a1] hover:text-[#f5f5f1]"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setLocalError("");
              clearAuthError();
            }}
            className={`rounded-lg py-2 text-xs font-medium transition-colors ${
              mode === "signup"
                ? "bg-[#242b28] text-[#f5f5f1]"
                : "text-[#9aa6a1] hover:text-[#f5f5f1]"
            }`}
          >
            Create password account
          </button>
        </div>
      )}

      {(localError || authError) && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs leading-5 text-red-200"
        >
          {localError || authError}
        </div>
      )}

      {infoMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-xs leading-5 text-emerald-200">
          {infoMessage}
        </div>
      )}

      <form onSubmit={(e) => void handleEmailSubmit(e)} className="space-y-3.5">
        {mode === "signup" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Platform Operator"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1] placeholder:text-[#63706b]"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
            Email address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
            className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1] placeholder:text-[#63706b]"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-[#aab4af]">
              Password
            </label>
            <Link
              href={`/forgot-password${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`}
              className="text-[11px] text-[#c8a66a] hover:underline"
            >
              Forgot or set password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (min 6 chars)"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] pl-3.5 pr-10 text-sm text-[#f5f5f1] placeholder:text-[#63706b]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#9aa6a1] hover:text-[#f5f5f1]"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSigningIn || !isAuthReady}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <KeyRound size={15} />
          <span>
            {!isAuthReady
              ? "Checking session..."
              : isSigningIn
                ? "Authenticating..."
                : mode === "signup"
                  ? "Create Account & Verify Email"
                  : submitLabel}
          </span>
          <ArrowRight size={15} />
        </button>
      </form>

      <div className="relative flex items-center py-0.5">
        <div className="h-px flex-1 bg-[#252d2b]" />
        <span className="px-3 text-[11px] uppercase tracking-[0.16em] text-[#78837e]">
          or
        </span>
        <div className="h-px flex-1 bg-[#252d2b]" />
      </div>

      <button
        type="button"
        disabled={isSigningIn || !isAuthReady}
        onClick={() => void handleGoogleClick()}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#39413e] bg-[#121716] px-6 text-xs font-medium text-[#f5f5f1] transition-colors hover:border-[#c8a66a] disabled:opacity-60"
      >
        <span>
          {isSigningIn ? "Connecting..." : "Continue with Google"}
        </span>
      </button>

      {publicUser && isEmailVerified && (
        <p className="muted text-center text-[11px]">
          Currently signed in as {publicUser.email}
        </p>
      )}
    </div>
  );
}
