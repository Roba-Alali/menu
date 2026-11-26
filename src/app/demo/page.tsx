"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import PublicRestaurantMenu from "@/components/menu/PublicRestaurantMenu";
import { fetchPublicRestaurantMenu } from "@/lib/firestore-service";
import type { Branch, MenuCategory, Product, Restaurant } from "@/lib/types";

function DemoContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("tenant") || "al-nakheel";
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
    if (!isAuthReady) return;
    let active = true;
    setLoading(true);
    fetchPublicRestaurantMenu(slug, Boolean(publicUser))
      .then(async (res) => {
        if (res || slug === "al-nakheel") return res;
        return fetchPublicRestaurantMenu("al-nakheel", Boolean(publicUser));
      })
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
        Loading demo restaurant...
      </main>
    );
  }

  if (!menuData) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        Demo restaurant unavailable.
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

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
          Loading demo restaurant...
        </main>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
