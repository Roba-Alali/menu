"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import PublicRestaurantMenu from "@/components/menu/PublicRestaurantMenu";
import { fetchPublicRestaurantByDomain } from "@/lib/firestore-service";
import type { Branch, MenuCategory, Product, Restaurant } from "@/lib/types";

function CustomDomainMenuContent() {
  const params = useParams<{ host: string }>();
  const searchParams = useSearchParams();
  const hostname = decodeURIComponent(params?.host || "");
  const branchParam = searchParams.get("branch") || undefined;
  const tableParam = searchParams.get("table") || undefined;

  const { publicUser, isAuthReady } = useAuth();
  const [loading, setLoading] = useState(true);
  const [domainMenu, setDomainMenu] = useState<{
    restaurant: Restaurant;
    branches: Branch[];
    categories: MenuCategory[];
    products: Product[];
    isFallbackPreview: boolean;
    hostname: string;
    isVerified: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isAuthReady || !hostname) return;
    let active = true;
    setLoading(true);
    fetchPublicRestaurantByDomain(hostname, Boolean(publicUser))
      .then((res) => {
        if (!active) return;
        setDomainMenu(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [hostname, isAuthReady, publicUser]);

  if (loading || !isAuthReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        Resolving storefront for {hostname}...
      </main>
    );
  }

  if (!domainMenu) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5">
        <div className="panel w-full max-w-md p-7 text-center">
          <h1 className="font-display text-3xl font-semibold text-[#f5f5f1]">
            Domain not configured
          </h1>
          <p className="muted mt-2 text-sm leading-6">
            The custom domain{" "}
            <span className="font-mono-num text-[#c8a66a]">{hostname}</span> is
            not verified or linked to a published restaurant menu yet.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
            >
              Sign in to verify
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium"
            >
              QLUB Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <PublicRestaurantMenu
      restaurant={domainMenu.restaurant}
      branches={domainMenu.branches}
      categories={domainMenu.categories}
      products={domainMenu.products}
      initialBranchId={branchParam}
      initialTable={tableParam}
      isFallbackPreview={domainMenu.isFallbackPreview}
    />
  );
}

export default function CustomDomainStorefrontPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
          Loading storefront...
        </main>
      }
    >
      <CustomDomainMenuContent />
    </Suspense>
  );
}
