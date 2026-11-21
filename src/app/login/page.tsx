"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LogOut, ShieldCheck, Store } from "lucide-react";
import AuthFormPanel from "@/components/AuthFormPanel";
import { useAuth } from "@/components/AuthProvider";
import type { PublicUser } from "@/lib/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  const {
    publicUser,
    isAuthReady,
    isEmailVerified,
    isPlatformAdmin,
    signOutUser,
    resolveDefaultRoute,
  } = useAuth();

  const [continuing, setContinuing] = useState(false);

  async function handleSuccessRedirect(user: PublicUser) {
    const target = nextPath || (await resolveDefaultRoute(user));
    router.push(target);
  }

  async function handleContinueSignedIn() {
    if (!publicUser) return;
    setContinuing(true);
    const target = nextPath || (await resolveDefaultRoute(publicUser));
    router.push(target);
  }

  return (
    <main className="min-h-screen bg-[#090b0b] px-5 py-12">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-[0.22em]">
          VIRAL<span className="gold">.</span>
        </Link>
        <div className="flex items-center gap-5 text-sm text-[#9aa6a1]">
          <Link href="/#subscribe" className="transition-colors hover:text-[#c8a66a]">
            Request Subscription
          </Link>
          <Link
            href="/r/the-house"
            className="transition-colors hover:text-[#f5f5f1]"
          >
            View public menu demo
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel flex flex-col justify-between p-7 md:p-9">
          <div>
            <p className="gold text-xs font-medium tracking-[0.2em]">
              CLIENT WORKSPACE ACCESS
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold">
              Sign in to VIRAL
            </h1>
            <p className="muted mt-2 text-sm leading-6">
              Sign in with the Email &amp; Password or Google account assigned by
              the platform administrator to enter your restaurant&apos;s
              dedicated dashboard.
            </p>

            {isAuthReady && publicUser && isEmailVerified ? (
              <div className="mt-8 space-y-4 rounded-2xl border border-[#252d2b] bg-[#121716] p-5">
                <div>
                  <p className="text-xs font-medium text-[#86efac]">
                    Verified session active
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
                      Open Super Admin console →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-7">
                <AuthFormPanel
                  allowCreateAccount={false}
                  submitLabel="Sign in with Email & Password"
                  onAuthenticated={handleSuccessRedirect}
                />
              </div>
            )}
          </div>

          <p className="muted mt-8 border-t border-[#252d2b] pt-5 text-xs leading-5">
            Protected by Firebase Authentication and Firestore tenant security
            rules. Accounts are created exclusively by platform administrators.
          </p>
        </section>

        <aside className="panel flex flex-col justify-between p-7 md:p-9">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#c8a66a]">
              <ShieldCheck size={14} />
              <span>ADMIN-PROVISIONED ACCESS</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">
              Dedicated restaurant workspaces
            </h2>
            <p className="muted mt-2 text-sm leading-6">
              To preserve tenant isolation, public self-registration is disabled.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-[#252d2b] bg-[#151a19] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#f5f5f1]">
                  <Store size={15} className="text-[#c8a66a]" />
                  <span>Restaurant Owners &amp; Staff</span>
                </div>
                <p className="muted mt-1 text-xs leading-5">
                  Once your subscription request is approved, sign in using your
                  assigned credentials to add, edit, or delete menu items, upload
                  your custom logo, and publish your storefront.
                </p>
              </div>

              <div className="rounded-xl border border-[#252d2b] bg-[#151a19] p-4">
                <p className="text-sm font-semibold text-[#f5f5f1]">
                  New restaurant partner?
                </p>
                <p className="muted mt-1 text-xs leading-5">
                  Don&apos;t have a workspace yet? Submit a restaurant
                  subscription request and our team will provision your custom
                  dashboard.
                </p>
                <Link
                  href="/#subscribe"
                  className="mt-2.5 inline-block text-xs font-medium text-[#c8a66a] hover:underline"
                >
                  Request subscription dashboard →
                </Link>
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
              Reset / set password
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
