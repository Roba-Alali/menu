"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import SuperAdminConsole, {
  type SuperAdminInitialData,
} from "@/components/admin/SuperAdminConsole";
import { BOOT_ADMIN_EMAIL } from "@/lib/demo-fallback";
import {
  fetchSuperAdminPlatformData,
  seedInitialDemoDataIfEmpty,
} from "@/lib/firestore-service";

export default function AdminPage() {
  const {
    publicUser,
    isAuthReady,
    isPlatformAdmin,
    isSigningIn,
    authError,
    signInWithGoogle,
    signOutUser,
  } = useAuth();

  const [data, setData] = useState<SuperAdminInitialData | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const loadPlatform = useCallback(async () => {
    if (!publicUser || !isPlatformAdmin) return;
    setLoadingData(true);
    try {
      await seedInitialDemoDataIfEmpty(publicUser.id);
      const payload = await fetchSuperAdminPlatformData();
      setData({
        currentUser: publicUser,
        ...payload,
      });
    } finally {
      setLoadingData(false);
    }
  }, [publicUser, isPlatformAdmin]);

  useEffect(() => {
    if (isAuthReady && publicUser && isPlatformAdmin) {
      void loadPlatform();
    }
  }, [isAuthReady, publicUser, isPlatformAdmin, loadPlatform]);

  if (!isAuthReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        Verifying platform session...
      </main>
    );
  }

  if (!publicUser || !isPlatformAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5 py-12">
        <div className="panel w-full max-w-md p-7 md:p-8">
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#c8a66a]">
            <ShieldCheck size={15} />
            <span>SUPER ADMIN ACCESS</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-semibold">
            Platform operator sign-in required
          </h1>
          <p className="muted mt-2 text-sm leading-6">
            {publicUser
              ? `Signed in as ${publicUser.email}, which does not hold a Platform Admin role. Sign in with ${BOOT_ADMIN_EMAIL} or an authorized operator account.`
              : `Sign in with your Platform Admin Google account (${BOOT_ADMIN_EMAIL}) to access tenant provisioning and Firestore controls.`}
          </p>

          {authError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-200"
            >
              {authError}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {publicUser ? (
              <button
                type="button"
                onClick={() => void signOutUser()}
                className="h-11 flex-1 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e]"
              >
                Switch Google account
              </button>
            ) : (
              <button
                type="button"
                disabled={isSigningIn}
                onClick={() => void signInWithGoogle()}
                className="h-11 flex-1 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSigningIn ? "Connecting Google..." : "Continue with Google"}
              </button>
            )}
            <Link
              href="/"
              className="flex h-11 items-center rounded-full border border-[#39413e] px-5 text-xs font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        {loadingData ? "Loading QLUB Firestore control plane..." : "Initializing workspace..."}
      </main>
    );
  }

  return <SuperAdminConsole initialData={data} onRefresh={loadPlatform} />;
}
