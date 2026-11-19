"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
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
          <span>ACCOUNT ACCESS</span>
        </div>
        <h1 className="font-display mt-3 text-3xl font-semibold">
          Google-managed workspace security
        </h1>
        <p className="muted mt-3 text-sm leading-6">
          QLUB uses Google Authentication powered by Firebase. No separate
          workspace password is stored—sign in directly with your invited Google
          account, or manage recovery through Google Account Recovery if you lose
          access to your Google inbox.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e]"
          >
            Continue to Google sign-in
          </Link>
        </div>
      </section>
    </main>
  );
}
