"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import PublicRestaurantMenu from "@/components/menu/PublicRestaurantMenu";
import { fetchPublicRestaurantMenu } from "@/lib/firestore-service";
import type { Branch, MenuCategory, Product, Restaurant } from "@/lib/types";

function PublicMenuContent() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params?.slug || "";
  const branchParam = searchParams.get("branch") || undefined;
  const tableParam = searchParams.get("table") || undefined;

  const { publicUser, isAuthReady } = useAuth();
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState<{
    restaurant: Restaurant;
    branches: Branch[];
    categories: MenuCategory[];
    products: Product[];
    isFallbackPreview: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isAuthReady || !slug) return;
    let active = true;
    setLoading(true);
    fetchPublicRestaurantMenu(slug, Boolean(publicUser))
      .then((res) => {
        if (!active) return;
        setMenuData(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, isAuthReady, publicUser]);

  if (loading || !isAuthReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        Loading digital menu...
      </main>
    );
  }

  if (!menuData) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5">
        <div className="panel w-full max-w-md p-7 text-center">
          <h1 className="font-display text-3xl font-semibold text-[#f5f5f1]">
            Menu unavailable
          </h1>
          <p className="muted mt-2 text-sm">
            This restaurant menu is either unpublished or does not exist.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/r/the-house"
              className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
            >
              Open The House demo
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <PublicRestaurantMenu
      restaurant={menuData.restaurant}
      branches={menuData.branches}
      categories={menuData.categories}
      products={menuData.products}
      initialBranchId={branchParam}
      initialTable={tableParam}
      isFallbackPreview={menuData.isFallbackPreview}
    />
  );
}

export default function PublicMenuPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
          Loading digital menu...
        </main>
      }
    >
      <PublicMenuContent />
    </Suspense>
  );
}
