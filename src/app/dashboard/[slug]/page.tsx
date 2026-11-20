"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, Store } from "lucide-react";
import AuthFormPanel from "@/components/AuthFormPanel";
import { useAuth } from "@/components/AuthProvider";
import RestaurantDashboard from "@/components/dashboard/RestaurantDashboard";
import { DEFAULT_PLATFORM_SETTINGS } from "@/lib/demo-fallback";
import { ensureMembershipAndLoadDashboard } from "@/lib/firestore-service";
import type { RestaurantBundle } from "@/lib/types";

export default function DashboardPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const {
    firebaseUser,
    publicUser,
    isAuthReady,
    isEmailVerified,
    isPlatformAdmin,
    signOutUser,
  } = useAuth();

  const [bundle, setBundle] = useState<RestaurantBundle | null>(null);
  const [cnameTarget, setCnameTarget] = useState(
    DEFAULT_PLATFORM_SETTINGS.defaultCnameTarget
  );
  const [accessDenied, setAccessDenied] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!publicUser || !isEmailVerified || !slug) return;
    setLoading(true);
    try {
      const res = await ensureMembershipAndLoadDashboard(
        slug,
        publicUser,
        isPlatformAdmin
      );
      setCnameTarget(res.cnameTarget);
      if (res.accessDenied) {
        setAccessDenied(true);
        setBundle(null);
      } else if (!res.bundle) {
        setNotFoundState(true);
        setBundle(null);
      } else {
        setAccessDenied(false);
        setNotFoundState(false);
        setBundle(res.bundle);
      }
    } finally {
      setLoading(false);
    }
  }, [slug, publicUser, isEmailVerified, isPlatformAdmin]);

  useEffect(() => {
    if (isAuthReady && publicUser && isEmailVerified && slug) {
      void loadDashboard();
    }
  }, [isAuthReady, publicUser, isEmailVerified, slug, loadDashboard]);

  if (!isAuthReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        Verifying workspace session...
      </main>
    );
  }

  if (!publicUser || !isEmailVerified) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5 py-12">
        <div className="panel w-full max-w-md p-7 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#c8a66a]">
              <Store size={15} />
              <span>RESTAURANT WORKSPACE</span>
            </div>
            <Link
              href={`/r/${slug}`}
              className="text-xs text-[#9aa6a1] hover:text-[#f5f5f1]"
            >
              Public menu
            </Link>
          </div>
          <h1 className="font-display mt-3 text-3xl font-semibold">
            Sign in to manage /{slug}
          </h1>
          <p className="muted mt-2 text-sm leading-6">
            {firebaseUser && !isEmailVerified
              ? `Verify ${firebaseUser.email} to unlock this restaurant's brand editor, products, QR codes, and orders.`
              : "Sign in with your invited Email & Password or Google account to access this restaurant workspace."}
          </p>

          <div className="mt-6">
            <AuthFormPanel submitLabel={`Sign in to /${slug}`} />
          </div>
        </div>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5 py-12">
        <div className="panel w-full max-w-md p-7 md:p-8">
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#e5c991]">
            <ShieldCheck size={15} />
            <span>WORKSPACE PERMISSION REQUIRED</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-semibold">
            Access restricted for /{slug}
          </h1>
          <p className="muted mt-2 text-sm leading-6">
            Your signed-in account ({publicUser.email}) is not assigned to this
            restaurant yet. Ask your restaurant owner or Platform Admin to invite
            your email under Team &amp; Roles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void signOutUser()}
              className="h-11 flex-1 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e]"
            >
              Switch account
            </button>
            <Link
              href={`/r/${slug}`}
              className="flex h-11 items-center rounded-full border border-[#39413e] px-5 text-xs font-medium"
            >
              View menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (notFoundState) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5 py-12">
        <div className="panel w-full max-w-md p-7 text-center">
          <h1 className="font-display text-3xl font-semibold">
            Restaurant not found
          </h1>
          <p className="muted mt-2 text-sm">
            No tenant exists at <span className="font-mono-num">/{slug}</span> in
            Firestore yet.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {isPlatformAdmin ? (
              <Link
                href="/admin"
                className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
              >
                Open Super Admin
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-full border border-[#39413e] px-6 py-2.5 text-xs font-medium"
              >
                Return home
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!bundle) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        {loading ? `Loading ${slug} workspace...` : "Initializing dashboard..."}
      </main>
    );
  }

  return (
    <RestaurantDashboard
      initialBundle={bundle}
      currentUser={publicUser}
      cnameTarget={cnameTarget}
      onRefresh={loadDashboard}
    />
  );
}
