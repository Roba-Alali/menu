"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fetchLandingPreviewData } from "@/lib/firestore-service";
import type { Restaurant } from "@/lib/types";

interface PreviewTenant {
  restaurant: Restaurant;
  sampleItems: Array<{
    name: string;
    category: string;
    price: number;
    imageUrl: string;
  }>;
}

export default function LandingPreview({
  tenants: initialTenants,
}: {
  tenants: PreviewTenant[];
}) {
  const [tenants, setTenants] = useState<PreviewTenant[]>(initialTenants);
  const [selectedSlug, setSelectedSlug] = useState(
    initialTenants[0]?.restaurant.slug || "the-house"
  );

  useEffect(() => {
    let active = true;
    fetchLandingPreviewData()
      .then((res) => {
        if (!active || !res.tenants.length) return;
        setTenants(res.tenants);
        setSelectedSlug((prev) =>
          res.tenants.some((t) => t.restaurant.slug === prev)
            ? prev
            : res.tenants[0].restaurant.slug
        );
      })
      .catch(() => {
        // Keep starter preview if unseeded or offline
      });
    return () => {
      active = false;
    };
  }, []);

  const current = tenants.find((t) => t.restaurant.slug === selectedSlug) || tenants[0];

  if (!current) return null;

  const { restaurant, sampleItems } = current;

  return (
    <div className="panel relative flex flex-col justify-between overflow-hidden p-5">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs tracking-[0.18em] text-[#aab4af]">
            LIVE TENANT PREVIEW
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-[#171d1b] p-1">
            {tenants.map((t) => (
              <button
                key={t.restaurant.slug}
                type="button"
                onClick={() => setSelectedSlug(t.restaurant.slug)}
                className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedSlug === t.restaurant.slug
                    ? "bg-[#252d2b] text-[#f5f5f1]"
                    : "text-[#9aa6a1] hover:text-[#f5f5f1]"
                }`}
              >
                {t.restaurant.name}
              </button>
            ))}
          </div>
        </div>

        <div
          className="overflow-hidden rounded-2xl border border-[#252d2b] p-5 transition-colors"
          style={{ backgroundColor: restaurant.secondaryColor }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p
                className="text-xs font-medium tracking-[0.2em]"
                style={{ color: restaurant.primaryColor }}
              >
                {restaurant.name.toUpperCase()}
              </p>
              <h2 className="font-display mt-1.5 text-3xl font-semibold tracking-tight text-[#f5f5f1]">
                Food, thoughtfully.
              </h2>
              <p className="mt-1 truncate text-xs text-[#9aa6a1]">
                {restaurant.description}
              </p>
            </div>
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border text-sm font-semibold"
              style={{
                borderColor: restaurant.primaryColor,
                color: restaurant.primaryColor,
              }}
            >
              {restaurant.logoText}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {sampleItems.slice(0, 2).map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1110]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1b2220]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-[#9aa6a1]">{item.category}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-[#f5f5f1]">
                    {item.name}
                  </p>
                  <p
                    className="tabular-nums mt-1 text-xs font-medium"
                    style={{ color: restaurant.primaryColor }}
                  >
                    {item.price} {restaurant.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#252d2b] pt-4 text-xs">
        <span className="text-[#9aa6a1]">
          Brand theme <span aria-hidden="true">·</span> {restaurant.currency}{" "}
          <span aria-hidden="true">·</span>{" "}
          {restaurant.isPublished ? "Published" : "Draft mode"}
        </span>
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/${restaurant.slug}`}
            className="whitespace-nowrap shrink-0 text-[#aab4af] transition-colors hover:text-[#f5f5f1]"
          >
            Client editor
          </Link>
          <Link
            href={`/r/${restaurant.slug}`}
            className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 font-medium"
            style={{ color: restaurant.primaryColor }}
          >
            Open storefront <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
