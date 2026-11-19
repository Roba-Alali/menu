"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LogOut, ShieldCheck, Store } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { BOOT_ADMIN_EMAIL } from "@/lib/demo-fallback";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  const {
    publicUser,
    isAuthReady,
    isPlatformAdmin,
    isSigningIn,
    authError,
    clearAuthError,
    signInWithGoogle,
    signOutUser,
    resolveDefaultRoute,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [continuing, setContinuing] = useState(false);

  async function handleGoogleLogin() {
    setError("");
    clearAuthError();
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (!user) {
        setLoading(false);
        return;
      }
      const target = nextPath || (await resolveDefaultRoute(user));
      router.push(target);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to sign in with Google.";
      setError(msg);
      setLoading(false);
    }
  }

  async function handleContinueSignedIn() {
    if (!publicUser) return;
    setContinuing(true);
    const target = nextPath || (await resolveDefaultRoute(publicUser));
    router.push(target);
  }

  useEffect(() => {
    setError("");
  }, [publicUser?.id]);

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
        <section className="panel flex flex-col justify-between p-7 md:p-9">
          <div>
            <p className="gold text-xs font-medium tracking-[0.2em]">
              WORKSPACE ACCESS
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold">
              Sign in to QLUB
            </h1>
            <p className="muted mt-2 text-sm leading-6">
              Authenticate with your verified Google account to enter the
              Super Admin console or your restaurant&apos;s white-label dashboard.
            </p>

            {isAuthReady && publicUser ? (
              <div className="mt-8 space-y-4 rounded-2xl border border-[#252d2b] bg-[#121716] p-5">
                <div>
                  <p className="text-xs font-medium text-[#86efac]">
                    Signed in with Google
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#f5f5f1]">
                    {publicUser.fullName}
                  </p>
                  <p className="muted text-xs">{publicUser.email}</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    disabled={continuing}
                    onClick={() => void handleContinueSignedIn()}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {continuing ? "Opening workspace..." : "Continue to workspace"}
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => void signOutUser()}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[#39413e] px-5 text-xs font-medium text-[#aab4af] hover:border-[#c8a66a] hover:text-[#f5f5f1]"
                  >
                    <LogOut size={14} /> Switch account
                  </button>
                </div>

                {isPlatformAdmin && (
                  <div className="border-t border-[#252d2b] pt-3">
                    <Link
                      href="/admin"
                      className="text-xs font-medium text-[#c8a66a] hover:underline"
                    >
                      Go directly to Super Admin console →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {(error || authError) && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-200"
                  >
                    {error || authError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={loading || isSigningIn || !isAuthReady}
                  onClick={() => void handleGoogleLogin()}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <span>
                    {!isAuthReady
                      ? "Checking session..."
                      : loading || isSigningIn
                        ? "Connecting Google..."
                        : "Continue with Google"}
                  </span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>

          <p className="muted mt-8 border-t border-[#252d2b] pt-5 text-xs leading-5">
            Protected by Firebase Authentication and Firestore tenant security
            rules. Only verified emails authorized for a restaurant or platform
            role gain dashboard write access.
          </p>
        </section>

        <aside className="panel flex flex-col justify-between p-7 md:p-9">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#c8a66a]">
              <ShieldCheck size={14} />
              <span>ROLE-BASED ACCESS CONTROL</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">
              Multi-tenant Google onboarding
            </h2>
            <p className="muted mt-2 text-sm leading-6">
              Roles resolve automatically from your signed-in Google email.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-[#252d2b] bg-[#151a19] p-4">
                <p className="text-sm font-semibold text-[#f5f5f1]">
                  Platform Super Admin
                </p>
                <p className="muted mt-1 text-xs leading-5">
                  Bootstrapped owner{" "}
                  <span className="font-mono-num text-[#c8a66a]">
                    {BOOT_ADMIN_EMAIL}
                  </span>{" "}
                  and authorized platform operators manage tenants, seed starter
                  brands, and configure domains.
                </p>
              </div>

              <div className="rounded-xl border border-[#252d2b] bg-[#151a19] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#f5f5f1]">
                  <Store size={15} className="text-[#c8a66a]" />
                  <span>Restaurant Owners & Staff</span>
                </div>
                <p className="muted mt-1 text-xs leading-5">
                  Any restaurant owner or team email invited in Super Admin or
                  Team Settings claims their isolated dashboard automatically
                  upon signing in with Google.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#252d2b] pt-5 text-xs">
            <Link href="/demo" className="text-[#c8a66a] hover:underline">
              Explore live guest storefront →
            </Link>
            <Link
              href="/forgot-password"
              className="text-[#9aa6a1] hover:text-[#f5f5f1]"
            >
              Account recovery
            </Link>
          </div>
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
