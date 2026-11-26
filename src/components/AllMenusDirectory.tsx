"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import {
  ArrowUpRight,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Store,
  Volume2,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useAuth } from "@/components/AuthProvider";
import { getStarterBundle } from "@/lib/demo-fallback";
import { db } from "@/lib/firebase";
import { fetchLandingPreviewData } from "@/lib/firestore-service";
import type { Restaurant } from "@/lib/types";

export default function AllMenusDirectory({
  initialRestaurants,
}: {
  initialRestaurants: Restaurant[];
}) {
  const { isPlatformAdmin, isAuthReady } = useAuth();
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(initialRestaurants);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    async function loadMenus() {
      try {
        if (isAuthReady && isPlatformAdmin) {
          const snap = await getDocs(collection(db, "restaurants"));
          if (active && !snap.empty) {
            const adminList = snap.docs.map((d) => {
              const data = d.data() as Record<string, unknown>;
              return {
                id: String(data.id || d.id),
                name: String(data.name || ""),
                nameAr: String(data.nameAr || ""),
                slug: String(data.slug || d.id),
                description: String(data.description || ""),
                descriptionAr: String(data.descriptionAr || ""),
                logoText: String(data.logoText || "V"),
                logoUrl: typeof data.logoUrl === "string" ? data.logoUrl : "",
                coverUrl: String(
                  data.coverUrl || "/images/restaurant_hero_interior.jpg"
                ),
                primaryColor: String(data.primaryColor || "#c8a66a"),
                secondaryColor: String(data.secondaryColor || "#111515"),
                currency: String(data.currency || "SAR"),
                defaultLocale: (data.defaultLocale === "ar" ? "ar" : "en") as
                  | "en"
                  | "ar",
                isPublished: Boolean(data.isPublished),
                voiceAgentEnabled: data.voiceAgentEnabled !== false,
                voiceAgentVoice: (data.voiceAgentVoice || "Kore") as Restaurant["voiceAgentVoice"],
                plan: (data.plan || "Starter") as Restaurant["plan"],
                status: (data.status || "Active") as Restaurant["status"],
                ownerUid: String(data.ownerUid || ""),
                createdAt: "",
                updatedAt: "",
              } satisfies Restaurant;
            });
            const hasNakheel = adminList.some((r) => r.slug === "al-nakheel");
            const starterNakheel = getStarterBundle("al-nakheel")?.restaurant;
            setRestaurants(
              hasNakheel || !starterNakheel
                ? adminList
                : [...adminList, starterNakheel]
            );
            return;
          }
        }

        const res = await fetchLandingPreviewData();
        if (active && res.tenants.length > 0) {
          setRestaurants(res.tenants.map((t) => t.restaurant));
        }
      } catch {
        // Keep starter list if offline or unseeded
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadMenus();
    return () => {
      active = false;
    };
  }, [isAuthReady, isPlatformAdmin]);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.nameAr.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [restaurants, queryText]);

  return (
    <section
      id="menus"
      className="border-t border-[#252d2b] bg-[#0b0e0d] py-16"
    >
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="gold text-xs font-medium tracking-[0.22em]">
              ALL RESTAURANT MENUS · جميع المنيوهات
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">
              Direct access to every live menu &amp; workspace.
            </h2>
            <p className="muted mt-2 max-w-2xl text-sm leading-6">
              Open any restaurant&apos;s live digital menu with Smart Voice Dish
              Assistant, or jump directly into its dedicated management dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isPlatformAdmin && (
              <Link
                href="/admin"
                className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[#c8a66a] bg-[#1a1812] px-5 text-xs font-semibold text-[#e5c991] transition-colors hover:bg-[#c8a66a] hover:text-[#10110e]"
              >
                <ShieldCheck size={14} />
                Super Admin Console
              </Link>
            )}
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[#39413e] px-5 text-xs font-medium text-[#f5f5f1] transition-colors hover:border-[#c8a66a]"
            >
              <LayoutDashboard size={14} />
              Client Workspace Login
            </Link>
          </div>
        </div>

        {restaurants.length > 3 && (
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f8b86]"
              />
              <input
                type="search"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search menus (name, Arabic title, or slug)..."
                className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#111515] pl-10 pr-4 text-sm text-[#f5f5f1] placeholder:text-[#6f7c77]"
              />
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.slug}
              className="panel flex flex-col justify-between p-5 transition-colors hover:border-[#3c4844]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <BrandLogo
                      logoUrl={r.logoUrl}
                      logoText={r.logoText}
                      alt={r.name}
                      accentColor={r.primaryColor}
                      size="md"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-[#f5f5f1]">
                        {r.name}
                      </h3>
                      {r.nameAr && (
                        <p
                          dir="rtl"
                          className="truncate text-xs text-[#c8a66a]"
                        >
                          {r.nameAr}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-medium ${
                      r.isPublished ? "text-[#86efac]" : "text-[#e5c991]"
                    }`}
                  >
                    {r.isPublished ? "Live" : "Draft"}
                  </span>
                </div>

                <p className="muted mt-3 line-clamp-2 text-xs leading-5">
                  {r.description ||
                    r.descriptionAr ||
                    "Digital restaurant menu with live ordering and smart assistant."}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[#9aa6a1]">
                  <span className="font-mono-num">/r/{r.slug}</span>
                  <span>· {r.currency}</span>
                  {r.voiceAgentEnabled !== false && (
                    <span className="inline-flex items-center gap-1 text-[#d6b77d]">
                      <Volume2 size={12} />
                      Smart voice
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2.5 border-t border-[#252d2b] pt-4">
                <Link
                  href={`/r/${r.slug}`}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 text-xs font-semibold text-[#10110e] transition-opacity hover:opacity-90"
                  style={{ backgroundColor: r.primaryColor || "#c8a66a" }}
                >
                  <Store size={13} />
                  Open Menu
                  <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/dashboard/${r.slug}`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#39413e] px-3.5 text-xs font-medium text-[#f5f5f1] transition-colors hover:border-[#c8a66a]"
                >
                  <LayoutDashboard size={13} />
                  Dashboard
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="panel mt-6 p-8 text-center text-sm text-[#9aa6a1]">
            No restaurant menus match &ldquo;{queryText}&rdquo;.
          </div>
        )}
      </div>
    </section>
  );
}
