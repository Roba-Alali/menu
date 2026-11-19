"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, KeyRound, Lock, Mail } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    label: "Platform Super Admin",
    role: "Owner · Full Platform",
    email: "owner@qlub.app",
    pass: "QlubOwner2026!",
  },
  {
    label: "The House Admin",
    role: "Restaurant Admin · Growth",
    email: "house@thehouse.com",
    pass: "HouseMenu2026!",
  },
  {
    label: "Olive Garden Admin",
    role: "Restaurant Admin · Starter",
    email: "olive@olivegarden.com",
    pass: "OliveMenu2026!",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitLogin(loginEmail: string, loginPassword: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }
      const target = nextPath || data.redirectTo || "/admin";
      router.push(target);
      router.refresh();
    } catch {
      setError("Network error while signing in.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090b0b] px-5 py-12">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-[0.22em]">
          QLUB<span className="gold">.</span>
        </Link>
        <Link
          href="/r/the-house"
          className="text-sm text-[#9aa6a1] transition-colors hover:text-[#f5f5f1]"
        >
          View public menu demo
        </Link>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel p-7 md:p-9">
          <p className="gold text-xs font-medium tracking-[0.2em]">
            WORKSPACE ACCESS
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold">
            Sign in to QLUB
          </h1>
          <p className="muted mt-2 text-sm leading-6">
            Access your Super Admin portfolio or your restaurant&apos;s white-label
            control panel.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              void submitLogin(email, password);
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium text-[#aab4af]"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa6a1]"
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@qlub.app"
                  className="h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] pl-10 pr-4 text-sm text-[#f5f5f1] placeholder:text-[#66706c]"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#aab4af]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#c8a66a] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa6a1]"
                />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] pl-10 pr-4 text-sm text-[#f5f5f1] placeholder:text-[#66706c]"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-200"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to workspace"}
              <ArrowRight size={15} />
            </button>
          </form>
        </section>

        <aside className="panel flex flex-col justify-between p-7 md:p-9">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#c8a66a]">
              <KeyRound size={14} />
              <span>INSTANT ROLE PREVIEW</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">
              Seeded workspace credentials
            </h2>
            <p className="muted mt-2 text-sm leading-6">
              Select any workspace role below to sign in immediately, or sign in
              with credentials provisioned from Super Admin.
            </p>

            <div className="mt-6 space-y-3">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.pass);
                    void submitLogin(acc.email, acc.pass);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#252d2b] bg-[#151a19] p-4 text-left transition-colors hover:border-[#c8a66a]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#f5f5f1]">
                      {acc.label}
                    </p>
                    <p className="muted mt-0.5 truncate text-xs">
                      {acc.role} <span aria-hidden="true">·</span> {acc.email}
                    </p>
                  </div>
                  <span className="whitespace-nowrap shrink-0 text-xs font-medium text-[#c8a66a]">
                    Sign in →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="muted mt-6 border-t border-[#252d2b] pt-5 text-xs leading-5">
            Sessions are signed with HMAC-SHA256 HTTP-only cookies and enforce
            role-based isolation between platform owners and restaurant staff.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
          Loading sign-in...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
