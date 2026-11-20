"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AuthFormPanel from "@/components/AuthFormPanel";
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
    firebaseUser,
    publicUser,
    isAuthReady,
    isEmailVerified,
    isPlatformAdmin,
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
    const signedInUnverified = Boolean(firebaseUser && !isEmailVerified);
    const wrongVerifiedAccount = Boolean(
      publicUser && isEmailVerified && !isPlatformAdmin
    );

    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5 py-12">
        <div className="panel w-full max-w-md p-7 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#c8a66a]">
              <ShieldCheck size={15} />
              <span>SUPER ADMIN ACCESS</span>
            </div>
            <Link
              href="/"
              className="text-xs text-[#9aa6a1] transition-colors hover:text-[#f5f5f1]"
            >
              Home
            </Link>
          </div>

          <h1 className="font-display mt-3 text-3xl font-semibold">
            Platform operator sign-in
          </h1>
          <p className="muted mt-2 text-sm leading-6">
            {wrongVerifiedAccount
              ? `Signed in as ${publicUser?.email}, which does not hold a Platform Admin role. Switch to ${BOOT_ADMIN_EMAIL} or an authorized operator account.`
              : signedInUnverified
                ? `Complete email verification for ${firebaseUser?.email} to unlock Super Admin access.`
                : `Sign in with your Platform Admin email (${BOOT_ADMIN_EMAIL}) and password, or continue with Google.`}
          </p>

          <div className="mt-6">
            {wrongVerifiedAccount ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void signOutUser()}
                  className="h-11 flex-1 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e]"
                >
                  Sign out &amp; switch account
                </button>
                <Link
                  href="/login"
                  className="flex h-11 items-center rounded-full border border-[#39413e] px-5 text-xs font-medium"
                >
                  Workspace login
                </Link>
              </div>
            ) : (
              <AuthFormPanel
                defaultEmail={BOOT_ADMIN_EMAIL}
                submitLabel="Sign in to Super Admin"
              />
            )}
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
