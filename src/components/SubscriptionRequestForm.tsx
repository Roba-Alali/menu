"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Globe,
  Send,
  Sparkles,
  Store,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import {
  slugify,
  submitSubscriptionRequestInFirestore,
} from "@/lib/firestore-service";
import type { SubscriptionRequest } from "@/lib/types";

export default function SubscriptionRequestForm() {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantNameAr, setRestaurantNameAr] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [branchCount, setBranchCount] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<SubscriptionRequest | null>(null);

  const previewSlug = useMemo(
    () => slugify(restaurantName || "your-brand"),
    [restaurantName]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const req = await submitSubscriptionRequestInFirestore({
        restaurantName,
        restaurantNameAr,
        ownerName,
        ownerEmail,
        phone,
        city,
        branchCount,
      });
      setSubmitted(req);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit subscription request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setSubmitted(null);
    setRestaurantName("");
    setRestaurantNameAr("");
    setOwnerName("");
    setOwnerEmail("");
    setPhone("");
    setCity("");
    setBranchCount(1);
    setError("");
  }

  if (submitted) {
    return (
      <div className="panel p-7 md:p-9">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-emerald-300">
              APPLICATION RECEIVED
            </p>
            <h3 className="font-display mt-2 text-3xl font-semibold">
              Subscription request submitted
            </h3>
            <p className="muted mt-2 text-sm leading-6">
              Thank you,{" "}
              <span className="text-[#f5f5f1]">{submitted.ownerName}</span>. Our
              platform administrator will review{" "}
              <strong className="text-[#f5f5f1]">
                {submitted.restaurantName}
              </strong>{" "}
              and provision your isolated restaurant dashboard and login
              credentials for{" "}
              <span className="font-mono-num text-[#c8a66a]">
                {submitted.ownerEmail}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-[#252d2b] bg-[#0d1010] p-5 text-xs sm:grid-cols-3">
          <div>
            <p className="muted">Request ID</p>
            <p className="font-mono-num mt-1 text-[#f5f5f1]">{submitted.id}</p>
          </div>
          <div>
            <p className="muted">Reserved Brand Storefront</p>
            <p className="font-mono-num mt-1 text-[#c8a66a]">
              https://{submitted.preferredSlug}.viral.app
            </p>
          </div>
          <div>
            <p className="muted">Dedicated Dashboard URL</p>
            <p className="font-mono-num mt-1 text-[#f5f5f1]">
              /dashboard/{submitted.preferredSlug}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
          >
            Client sign-in page
          </Link>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium text-[#f5f5f1] hover:border-[#c8a66a]"
          >
            Submit another restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel grid gap-8 p-6 md:p-9 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="flex flex-col justify-between">
        <div>
          <p className="gold text-xs font-medium tracking-[0.22em]">
            REQUEST RESTAURANT SUBSCRIPTION
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold leading-tight md:text-4xl">
            Get your own VIRAL dashboard &amp; branded menu.
          </h2>
          <p className="muted mt-3 text-sm leading-6">
            Apply below to receive a dedicated restaurant workspace where you
            can add, edit, or delete menu items, upload your custom logo and
            dish photos, configure brand colors, currency, and custom domain, and
            manage QR orders.
          </p>
          <p className="muted mt-3 text-sm leading-7" dir="rtl">
            أرسل طلب اشتراكك للحصول على لوحة تحكم مستقلة لمطعمك لإضافة المنتجات
            وتعديلها وحذفها، رفع شعارك المخصص، وتخصيص الألوان والعملة والدومين
            من لوحة التحكم الخاصة بك.
          </p>
        </div>

        <div className="mt-8 space-y-4 rounded-2xl border border-[#252d2b] bg-[#0d1010] p-5">
          <div className="flex items-center gap-3">
            <BrandLogo
              logoUrl=""
              logoText={restaurantName.trim().charAt(0).toUpperCase() || "V"}
              alt={restaurantName || "Brand preview"}
              accentColor="#c8a66a"
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#f5f5f1]">
                {restaurantName.trim() || "Your Restaurant Brand"}
              </p>
              <p className="font-mono-num truncate text-xs text-[#c8a66a]">
                https://{previewSlug}.viral.app
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#252d2b] pt-4 text-xs">
            <div className="flex items-center gap-2 text-[#aab4af]">
              <Store size={14} className="text-[#c8a66a]" />
              <span>/dashboard/{previewSlug}</span>
            </div>
            <div className="flex items-center gap-2 text-[#aab4af]">
              <Globe size={14} className="text-[#c8a66a]" />
              <span>/r/{previewSlug}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#8e9994]">
            <Sparkles size={13} className="text-[#c8a66a]" />
            <span>
              Logo, brand colors, currency, and custom domains can be configured
              directly inside your customer dashboard after approval.
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col justify-center space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-200"
          >
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              Restaurant name (EN) *
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="e.g. Saffron Table"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              اسم المطعم بالعربية (اختياري)
            </label>
            <input
              type="text"
              dir="rtl"
              maxLength={120}
              value={restaurantNameAr}
              onChange={(e) => setRestaurantNameAr(e.target.value)}
              placeholder="مائدة الزعفران"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              Owner full name *
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Khalid Al-Mansour"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              Business email (for dashboard login) *
            </label>
            <input
              type="email"
              required
              maxLength={200}
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="owner@saffrontable.com"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              required
              maxLength={40}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 50 000 0000"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              City
            </label>
            <input
              type="text"
              maxLength={100}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Riyadh"
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
              Branches
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={branchCount}
              onChange={(e) =>
                setBranchCount(Math.max(1, Number(e.target.value) || 1))
              }
              className="h-11 w-full rounded-xl border border-[#2d3633] bg-[#0e1211] px-3.5 text-sm text-[#f5f5f1]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c8a66a] px-6 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Send size={15} />
          <span>
            {submitting
              ? "Submitting request..."
              : "Submit Subscription Request · إرسال طلب الاشتراك"}
          </span>
        </button>
      </form>
    </div>
  );
}
