"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  Globe,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Square,
  Volume2,
  X,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import DishImage from "@/components/DishImage";
import { placePublicOrderInFirestore } from "@/lib/firestore-service";
import type {
  Branch,
  LocaleCode,
  MenuCategory,
  Order,
  Product,
  Restaurant,
  VoiceAgentVoice,
} from "@/lib/types";

const VOICE_OPTIONS: Array<{ value: VoiceAgentVoice; labelAr: string; labelEn: string }> = [
  { value: "Kore", labelAr: "كوري (ترحيبي دافئ)", labelEn: "Kore · Warm Host" },
  { value: "Charon", labelAr: "كارون (شيف رزين)", labelEn: "Charon · Deep Chef" },
  { value: "Puck", labelAr: "باك (حيوي ودود)", labelEn: "Puck · Lively Host" },
  { value: "Fenrir", labelAr: "فنرير (حماسي واضح)", labelEn: "Fenrir · Expressive" },
  { value: "Zephyr", labelAr: "زيفير (هادئ راقٍ)", labelEn: "Zephyr · Calm Guide" },
];

interface VoiceCacheEntry {
  scriptAr: string;
  audioBase64: string;
  mimeType: string;
  voiceName: VoiceAgentVoice;
  dishId: string;
  dishTitle: string;
  question?: string;
}

interface CartEntry {
  key: string;
  product: Product;
  quantity: number;
  selectedOptionValueIds: string[];
  selectedOptionLabels: string[];
  unitPrice: number;
}

export default function PublicRestaurantMenu({
  restaurant,
  branches,
  categories,
  products,
  initialBranchId,
  initialTable,
  isFallbackPreview = false,
}: {
  restaurant: Restaurant;
  branches: Branch[];
  categories: MenuCategory[];
  products: Product[];
  initialBranchId?: string;
  initialTable?: string;
  isFallbackPreview?: boolean;
}) {
  const [locale, setLocale] = useState<LocaleCode>(restaurant.defaultLocale || "en");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Selected product modal
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [pickedValues, setPickedValues] = useState<Record<string, string[]>>({});
  const [modalQty, setModalQty] = useState(1);

  // Cart drawer & checkout
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [orderType, setOrderType] = useState<"dine_in" | "pickup">(
    initialTable ? "dine_in" : "dine_in"
  );
  const [branchId, setBranchId] = useState<string>(
    initialBranchId || branches[0]?.id || ""
  );
  const [tableLabel, setTableLabel] = useState(
    initialTable ? `Table ${initialTable}` : "Table 01"
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Smart Saudi Arabic Voice Agent state
  const voiceAgentEnabled = restaurant.voiceAgentEnabled !== false;
  const [selectedVoice, setSelectedVoice] = useState<VoiceAgentVoice>(
    restaurant.voiceAgentVoice || "Kore"
  );
  const [loadingVoiceDishId, setLoadingVoiceDishId] = useState<string | null>(null);
  const [playingVoiceKey, setPlayingVoiceKey] = useState<string | null>(null);
  const [activeVoiceEntry, setActiveVoiceEntry] = useState<VoiceCacheEntry | null>(null);
  const [voiceError, setVoiceError] = useState("");
  const [dishQuestion, setDishQuestion] = useState("");
  const [voiceCache, setVoiceCache] = useState<Record<string, VoiceCacheEntry>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const isAr = locale === "ar";
  const accent = restaurant.primaryColor || "#c8a66a";
  const surface = restaurant.secondaryColor || "#111515";

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.isActive),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const catMatch =
        selectedCategoryId === "all" || p.categoryId === selectedCategoryId;
      const queryMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(q) ||
        p.description.toLowerCase().includes(q);
      return catMatch && queryMatch;
    });
  }, [products, selectedCategoryId, search]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const cartSubtotal = useMemo(
    () =>
      Number(
        cart
          .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
          .toFixed(2)
      ),
    [cart]
  );

  function openProductModal(product: Product) {
    if (!product.isAvailable) return;
    const defaults: Record<string, string[]> = {};
    for (const opt of product.options) {
      if (opt.isRequired && opt.values.length > 0) {
        defaults[opt.id] = [opt.values[0].id];
      } else {
        defaults[opt.id] = [];
      }
    }
    setPickedValues(defaults);
    setModalQty(1);
    setDishQuestion("");
    setActiveProduct(product);
  }

  function stopVoiceAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingVoiceKey(null);
  }

  function playCachedEntry(cacheKey: string, entry: VoiceCacheEntry) {
    stopVoiceAudio();
    setActiveVoiceEntry(entry);
    setVoiceError("");
    const src = `data:${entry.mimeType};base64,${entry.audioBase64}`;
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingVoiceKey(cacheKey);
    audio.onended = () => {
      setPlayingVoiceKey((prev) => (prev === cacheKey ? null : prev));
    };
    audio.onerror = () => {
      setPlayingVoiceKey(null);
      setVoiceError("Could not play the generated audio clip in this browser.");
    };
    void audio.play().catch((err) => {
      setPlayingVoiceKey(null);
      setVoiceError(
        err instanceof Error
          ? err.message
          : "Tap Play again to allow audio playback in your browser."
      );
    });
  }

  async function handleExplainDishVoice(product: Product, customQuestion?: string) {
    const cleanQ = (customQuestion || "").trim();
    const cacheKey = `${product.id}:${selectedVoice}:${cleanQ || "_intro"}`;

    if (playingVoiceKey === cacheKey) {
      stopVoiceAudio();
      return;
    }

    const cached = voiceCache[cacheKey];
    if (cached) {
      playCachedEntry(cacheKey, cached);
      return;
    }

    stopVoiceAudio();
    setVoiceError("");
    setLoadingVoiceDishId(product.id);
    const cat = categories.find((c) => c.id === product.categoryId);

    try {
      const res = await fetch("/api/menu-agent/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: product.name,
          dishNameAr: product.nameAr,
          description: product.description,
          descriptionAr: product.descriptionAr,
          categoryName: cat?.nameAr || cat?.name || "",
          price: product.price,
          currency: restaurant.currency,
          allergens: product.allergens,
          options: product.options.map((o) => ({
            name: o.name,
            values: o.values.map((v) => v.name),
          })),
          restaurantName: restaurant.name,
          restaurantNameAr: restaurant.nameAr,
          question: cleanQ,
          voiceName: selectedVoice,
        }),
      });
      const payload = (await res.json()) as {
        scriptAr?: string;
        audioBase64?: string;
        mimeType?: string;
        voiceName?: VoiceAgentVoice;
        error?: string;
      };
      if (!res.ok || !payload.audioBase64 || !payload.scriptAr) {
        throw new Error(
          payload.error || "Unable to generate Saudi voice explanation."
        );
      }

      const entry: VoiceCacheEntry = {
        scriptAr: payload.scriptAr,
        audioBase64: payload.audioBase64,
        mimeType: payload.mimeType || "audio/wav",
        voiceName: payload.voiceName || selectedVoice,
        dishId: product.id,
        dishTitle: product.nameAr || product.name,
        question: cleanQ || undefined,
      };
      setVoiceCache((prev) => ({ ...prev, [cacheKey]: entry }));
      playCachedEntry(cacheKey, entry);
      if (cleanQ) setDishQuestion("");
    } catch (err) {
      setVoiceError(
        err instanceof Error
          ? err.message
          : "Smart voice agent request failed."
      );
    } finally {
      setLoadingVoiceDishId((prev) => (prev === product.id ? null : prev));
    }
  }

  function quickAddProduct(product: Product) {
    if (!product.isAvailable) return;
    if (product.options.length > 0) {
      openProductModal(product);
      return;
    }
    addToCart(product, 1, [], [], product.price);
  }

  function addToCart(
    product: Product,
    quantity: number,
    valueIds: string[],
    labels: string[],
    unitPrice: number
  ) {
    const key = `${product.id}:${[...valueIds].sort().join(",")}`;
    setCart((prev) => {
      const existing = prev.find((c) => c.key === key);
      if (existing) {
        return prev.map((c) =>
          c.key === key ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [
        ...prev,
        {
          key,
          product,
          quantity,
          selectedOptionValueIds: valueIds,
          selectedOptionLabels: labels,
          unitPrice,
        },
      ];
    });
    setActiveProduct(null);
  }

  function confirmModalAdd() {
    if (!activeProduct) return;
    const selectedIds: string[] = [];
    const selectedLabels: string[] = [];
    let delta = 0;

    for (const opt of activeProduct.options) {
      const ids = pickedValues[opt.id] || [];
      for (const v of opt.values) {
        if (ids.includes(v.id)) {
          selectedIds.push(v.id);
          selectedLabels.push(v.name);
          delta += v.priceDelta;
        }
      }
    }
    addToCart(
      activeProduct,
      modalQty,
      selectedIds,
      selectedLabels,
      Number((activeProduct.price + delta).toFixed(2))
    );
  }

  function toggleOptionValue(optId: string, valId: string, maxSelect: number) {
    setPickedValues((prev) => {
      const cur = prev[optId] || [];
      if (maxSelect === 1) {
        return { ...prev, [optId]: cur.includes(valId) ? [] : [valId] };
      }
      if (cur.includes(valId)) {
        return { ...prev, [optId]: cur.filter((id) => id !== valId) };
      }
      if (cur.length >= maxSelect) {
        return { ...prev, [optId]: [...cur.slice(1), valId] };
      }
      return { ...prev, [optId]: [...cur, valId] };
    });
  }

  function updateCartQty(key: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.key === key ? { ...c, quantity: c.quantity + delta } : c
        )
        .filter((c) => c.quantity > 0)
    );
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!cart.length) return;
    if (isFallbackPreview) {
      setOrderError(
        isAr
          ? "وضع المعاينة الأولية: يرجى تسجيل الدخول إلى لوحة الإدارة (/admin) لتهيئة قاعدة بيانات Firestore أولاً."
          : "Preview mode: Sign in to Super Admin (/admin) once to initialize your Firestore catalog before submitting live orders."
      );
      return;
    }
    setOrderError("");
    setSubmitting(true);
    try {
      const order = await placePublicOrderInFirestore({
        restaurant,
        products,
        branchId: branchId || null,
        customerName,
        customerPhone,
        tableLabel: orderType === "pickup" ? "Pickup" : tableLabel,
        orderType,
        notes,
        items: cart.map((c) => ({
          productId: c.product.id,
          quantity: c.quantity,
          selectedOptionValueIds: c.selectedOptionValueIds,
        })),
      });
      setConfirmedOrder(order);
      setCart([]);
    } catch (err) {
      setOrderError(
        err instanceof Error ? err.message : "Unable to place order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const activeBranch = branches.find((b) => b.id === branchId) || branches[0];

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0a0c0b] pb-24 text-[#f5f5f1]"
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#252d2b] bg-[#0a0c0b]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-5">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center gap-2.5 whitespace-nowrap shrink-0 text-xs font-medium tracking-[0.18em] text-[#9aa6a1] hover:text-[#f5f5f1]"
          >
            <BrandLogo
              logoUrl={restaurant.logoUrl}
              logoText={restaurant.logoText}
              alt={restaurant.name}
              accentColor={accent}
              size="sm"
            />
            <span className="truncate">
              {isAr ? restaurant.nameAr || restaurant.name : restaurant.name}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLocale(isAr ? "en" : "ar")}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#252d2b] px-3 py-1.5 text-xs text-[#aab4af] hover:border-[#c8a66a]"
            >
              <Globe size={13} />
              <span>{isAr ? "EN" : "العربية"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                setCartOpen(true);
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold text-[#10110e]"
              style={{ backgroundColor: accent }}
            >
              <ShoppingBag size={14} />
              <span className="tabular-nums">
                {isAr ? `السلة (${cartCount})` : `Order (${cartCount})`}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Storefront Hero */}
      <div className="mx-auto max-w-4xl px-5">
        <section
          className="relative mt-6 overflow-hidden rounded-3xl border border-[#252d2b] p-7 text-center md:p-10"
          style={{ backgroundColor: surface }}
        >
          <BrandLogo
            logoUrl={restaurant.logoUrl}
            logoText={restaurant.logoText}
            alt={restaurant.name}
            accentColor={accent}
            size="xl"
            className="mx-auto"
          />
          <p
            className="mt-4 text-[11px] font-medium tracking-[0.28em]"
            style={{ color: accent }}
          >
            {(isAr ? restaurant.nameAr || restaurant.name : restaurant.name).toUpperCase()}
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold md:text-5xl">
            {isAr ? "مائدة تستحق المشاركة." : "A table worth sharing."}
          </h1>
          <p className="muted mx-auto mt-3 max-w-md text-sm leading-6">
            {isAr
              ? restaurant.descriptionAr || restaurant.description
              : restaurant.description}
          </p>

          {(activeBranch || initialTable) && (
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 text-xs text-[#aab4af]">
              {activeBranch && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} style={{ color: accent }} />
                  {activeBranch.name}
                </span>
              )}
              {initialTable && (
                <span>
                  · {isAr ? `طاولة ${initialTable}` : `Table ${initialTable}`}
                </span>
              )}
            </div>
          )}

          {!restaurant.isPublished && (
            <p className="mt-4 text-xs text-[#e5c991]">
              {isAr
                ? "وضع المعاينة — لم يتم نشر القائمة للعامة بعد"
                : "Draft preview — publish this menu from the client dashboard when ready."}
            </p>
          )}
        </section>

        {/* Smart Saudi Arabic Voice Dish Agent Banner */}
        {voiceAgentEnabled && products.length > 0 && (
          <section className="mt-6 rounded-2xl border border-[#252d2b] bg-[#111615] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#252d2b] bg-[#0a0c0b]"
                  style={{ color: accent }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f5f5f1]">
                    {isAr
                      ? "المساعد الصوتي الذكي · يشرح لك كل طبق باللهجة السعودية"
                      : "Smart Saudi Voice Guide · Explains every dish in Arabic"}
                  </p>
                  <p className="muted mt-0.5 text-[11px] leading-5">
                    {isAr
                      ? "اضغط على «اسمع الشرح» عند أي طبق أو اسأل عن المكونات والحساسية بصوت سعودي طبيعي."
                      : "Tap Explain in Saudi Voice on any plate below to hear ingredients, flavors, and chef tips."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Saudi voice persona"
                  value={selectedVoice}
                  onChange={(e) => {
                    stopVoiceAudio();
                    setSelectedVoice(e.target.value as VoiceAgentVoice);
                  }}
                  className="h-9 rounded-full border border-[#252d2b] bg-[#0a0c0b] px-3 text-xs text-[#f5f5f1]"
                >
                  {VOICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {isAr ? opt.labelAr : opt.labelEn}
                    </option>
                  ))}
                </select>

                {playingVoiceKey ? (
                  <button
                    type="button"
                    onClick={stopVoiceAudio}
                    className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-red-400/40 bg-red-950/30 px-4 text-xs font-medium text-red-200"
                  >
                    <Square size={12} />
                    {isAr ? "إيقاف الصوت" : "Stop audio"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={Boolean(loadingVoiceDishId)}
                    onClick={() => {
                      const featured =
                        filteredProducts.find((p) => p.isFeatured) ||
                        filteredProducts[0] ||
                        products[0];
                      if (featured) void handleExplainDishVoice(featured);
                    }}
                    className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-xs font-semibold text-[#10110e] disabled:opacity-50"
                    style={{ backgroundColor: accent }}
                  >
                    {loadingVoiceDishId ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Volume2 size={13} />
                    )}
                    {isAr ? "جرّب الشرح الصوتي" : "Hear featured dish"}
                  </button>
                )}
              </div>
            </div>

            {activeVoiceEntry && (
              <div
                dir="rtl"
                className="mt-3 rounded-xl border border-[#252d2b] bg-[#0c100f] px-4 py-3 text-right"
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span style={{ color: accent }} className="font-semibold">
                    {activeVoiceEntry.dishTitle}
                    {activeVoiceEntry.question
                      ? ` · سؤالك: ${activeVoiceEntry.question}`
                      : ""}
                  </span>
                  <span className="muted">
                    {playingVoiceKey ? "يتحدث الآن باللهجة السعودية..." : "تم تشغيل الشرح"}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-6 text-[#e8ecea]">
                  {activeVoiceEntry.scriptAr}
                </p>
              </div>
            )}

            {voiceError && (
              <p className="mt-3 text-xs text-red-300" role="alert">
                {voiceError}
              </p>
            )}
          </section>
        )}

        {/* Search & Category Filter */}
        <section className="mt-8 space-y-4">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa6a1]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isAr ? "ابحث في الأطباق..." : "Search dishes or ingredients..."
              }
              className="h-11 w-full rounded-2xl border border-[#252d2b] bg-[#111515] pl-10 pr-4 text-sm text-[#f5f5f1]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategoryId("all")}
              className={`whitespace-nowrap shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                selectedCategoryId === "all"
                  ? "text-[#10110e]"
                  : "border border-[#252d2b] bg-[#141918] text-[#aab4af]"
              }`}
              style={
                selectedCategoryId === "all"
                  ? { backgroundColor: accent }
                  : undefined
              }
            >
              {isAr ? "كل القائمة" : "All menu"}
            </button>
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`whitespace-nowrap shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  selectedCategoryId === cat.id
                    ? "text-[#10110e]"
                    : "border border-[#252d2b] bg-[#141918] text-[#aab4af]"
                }`}
                style={
                  selectedCategoryId === cat.id
                    ? { backgroundColor: accent }
                    : undefined
                }
              >
                {isAr ? cat.nameAr || cat.name : cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Items Grid */}
        <section className="mt-6 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="panel p-10 text-center">
              <p className="text-sm font-medium">
                {isAr ? "لا توجد أطباق مطابقة." : "No dishes match your filter."}
              </p>
            </div>
          ) : (
            filteredProducts.map((item) => {
              const cat = categories.find((c) => c.id === item.categoryId);
              return (
                <article
                  key={item.id}
                  onClick={() => openProductModal(item)}
                  className={`flex cursor-pointer gap-4 rounded-2xl border border-[#252d2b] bg-[#111615] p-3 transition-colors hover:border-[#394541] ${
                    !item.isAvailable ? "opacity-60" : ""
                  }`}
                >
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32">
                    <DishImage
                      src={item.imageUrl}
                      alt={item.name}
                      accentColor={accent}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                    <p
                      className="text-[10px] font-medium tracking-[0.2em]"
                      style={{ color: accent }}
                    >
                      {(isAr
                        ? cat?.nameAr || cat?.name || "قائمة"
                        : cat?.name || "MENU"
                      ).toUpperCase()}
                      {item.isFeatured
                        ? isAr
                          ? " · مميز"
                          : " · SIGNATURE"
                        : ""}
                    </p>
                    <h2 className="mt-1.5 text-base font-medium text-[#f5f5f1]">
                      {isAr ? item.nameAr || item.name : item.name}
                    </h2>
                    <p className="muted mt-1 line-clamp-2 text-xs leading-5">
                      {isAr
                        ? item.descriptionAr || item.description
                        : item.description}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <span className="tabular-nums text-sm font-semibold">
                        {item.price}{" "}
                        <span className="muted text-xs font-normal">
                          {restaurant.currency}
                        </span>
                      </span>
                      {item.compareAtPrice && (
                        <span className="tabular-nums muted text-xs line-through">
                          {item.compareAtPrice} {restaurant.currency}
                        </span>
                      )}
                      {!item.isAvailable && (
                        <span className="text-xs text-[#e5c991]">
                          {isAr ? "نفذت الكمية" : "Unavailable"}
                        </span>
                      )}

                      {voiceAgentEnabled && (
                        <button
                          type="button"
                          disabled={loadingVoiceDishId === item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleExplainDishVoice(item);
                          }}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#2d3633] bg-[#0c100f] px-3 py-1 text-[11px] font-medium text-[#e5c991] transition-colors hover:border-[#c8a66a] disabled:opacity-50"
                        >
                          {loadingVoiceDishId === item.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              {isAr ? "جاري التحضير..." : "Preparing voice..."}
                            </>
                          ) : playingVoiceKey ===
                            `${item.id}:${selectedVoice}:_intro` ? (
                            <>
                              <Square size={11} />
                              {isAr ? "إيقاف" : "Stop"}
                            </>
                          ) : (
                            <>
                              <Volume2 size={12} />
                              {isAr ? "اسمع الشرح" : "Explain (Saudi Voice)"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!item.isAvailable}
                    aria-label={`Add ${item.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      quickAddProduct(item);
                    }}
                    className="my-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-40"
                    style={{ borderColor: accent, color: accent }}
                  >
                    <Plus size={16} />
                  </button>
                </article>
              );
            })
          )}
        </section>

        <p className="muted mt-12 text-center text-[11px] tracking-[0.18em]">
          POWERED BY VIRAL PLATFORM
        </p>
      </div>

      {/* Floating Cart Bar (when items > 0) */}
      {cartCount > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-4 z-30 mx-auto max-w-md px-5">
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              setCartOpen(true);
            }}
            className="flex h-12 w-full items-center justify-between rounded-full px-6 text-sm font-semibold text-[#10110e] shadow-xl"
            style={{ backgroundColor: accent }}
          >
            <span className="tabular-nums">
              {cartCount} {isAr ? "أصناف في السلة" : "item(s) in order"}
            </span>
            <span className="tabular-nums">
              {cartSubtotal} {restaurant.currency} ·{" "}
              {isAr ? "عرض السلة" : "Review"}
            </span>
          </button>
        </div>
      )}

      {/* Product Detail & Modifiers Modal */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 sm:items-center sm:p-4"
            onClick={() => setActiveProduct(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-2xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <DishImage
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  accentColor={accent}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setActiveProduct(null)}
                  aria-label="Close dish details"
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                <h2 className="font-display text-3xl font-semibold">
                  {isAr
                    ? activeProduct.nameAr || activeProduct.name
                    : activeProduct.name}
                </h2>
                <p className="muted mt-2 text-sm leading-6">
                  {isAr
                    ? activeProduct.descriptionAr || activeProduct.description
                    : activeProduct.description}
                </p>

                {activeProduct.allergens.length > 0 && (
                  <p className="muted mt-3 text-xs">
                    {isAr ? "مسببات الحساسية: " : "Allergens: "}
                    {activeProduct.allergens.join(" · ")}
                  </p>
                )}

                {voiceAgentEnabled && (
                  <div className="mt-5 space-y-3 rounded-2xl border border-[#252d2b] bg-[#0c100f] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f5f5f1]">
                        <Sparkles size={13} style={{ color: accent }} />
                        {isAr
                          ? "شرح الطبق بالصوت السعودي"
                          : "Saudi Voice Dish Host"}
                      </span>
                      <button
                        type="button"
                        disabled={loadingVoiceDishId === activeProduct.id}
                        onClick={() => void handleExplainDishVoice(activeProduct)}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#10110e] disabled:opacity-50"
                        style={{ backgroundColor: accent }}
                      >
                        {loadingVoiceDishId === activeProduct.id ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            {isAr ? "جاري التوليد..." : "Loading..."}
                          </>
                        ) : playingVoiceKey ===
                          `${activeProduct.id}:${selectedVoice}:_intro` ? (
                          <>
                            <Square size={11} />
                            {isAr ? "إيقاف الشرح" : "Stop audio"}
                          </>
                        ) : (
                          <>
                            <Volume2 size={13} />
                            {isAr ? "اسمع الشرح الآن" : "Play Saudi Explanation"}
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        dir="rtl"
                        value={dishQuestion}
                        onChange={(e) => setDishQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && dishQuestion.trim()) {
                            e.preventDefault();
                            void handleExplainDishVoice(activeProduct, dishQuestion);
                          }
                        }}
                        placeholder={
                          isAr
                            ? "اسأل المضيف (مثلاً: هل الطبق حار؟ وش أفضل إضافة؟)"
                            : "Ask in Arabic/English (e.g. Is it spicy or nut-free?)"
                        }
                        className="h-9 flex-1 rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs text-[#f5f5f1]"
                      />
                      <button
                        type="button"
                        disabled={
                          !dishQuestion.trim() ||
                          loadingVoiceDishId === activeProduct.id
                        }
                        onClick={() =>
                          void handleExplainDishVoice(activeProduct, dishQuestion)
                        }
                        aria-label="Ask Saudi voice agent"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#252d2b] bg-[#141918] text-[#e5c991] disabled:opacity-40"
                      >
                        <Send size={13} />
                      </button>
                    </div>

                    {activeVoiceEntry?.dishId === activeProduct.id && (
                      <p
                        dir="rtl"
                        className="rounded-xl border border-[#252d2b] bg-[#111515] p-3 text-right text-xs leading-6 text-[#e8ecea]"
                      >
                        {activeVoiceEntry.scriptAr}
                      </p>
                    )}

                    {voiceError && (
                      <p className="text-xs text-red-300" role="alert">
                        {voiceError}
                      </p>
                    )}
                  </div>
                )}

                {activeProduct.options.length > 0 && (
                  <div className="mt-5 space-y-4 border-t border-[#252d2b] pt-4">
                    {activeProduct.options.map((opt) => {
                      const picked = pickedValues[opt.id] || [];
                      return (
                        <div key={opt.id}>
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span>{opt.name}</span>
                            <span className="muted">
                              {opt.isRequired
                                ? isAr
                                  ? "إلزامي"
                                  : "Required"
                                : isAr
                                  ? "اختياري"
                                  : "Optional"}
                            </span>
                          </div>
                          <div className="mt-2 space-y-2">
                            {opt.values.map((val) => {
                              const checked = picked.includes(val.id);
                              return (
                                <button
                                  key={val.id}
                                  type="button"
                                  onClick={() =>
                                    toggleOptionValue(
                                      opt.id,
                                      val.id,
                                      opt.maxSelect
                                    )
                                  }
                                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs transition-colors ${
                                    checked
                                      ? "border-[#c8a66a] bg-[#1a1812] text-[#f5f5f1]"
                                      : "border-[#252d2b] bg-[#0d1010] text-[#aab4af]"
                                  }`}
                                >
                                  <span>{val.name}</span>
                                  <span className="tabular-nums">
                                    {val.priceDelta > 0
                                      ? `+${val.priceDelta} ${restaurant.currency}`
                                      : isAr
                                        ? "مشمول"
                                        : "Included"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#252d2b] pt-5">
                  <div className="flex items-center gap-3 rounded-full border border-[#252d2b] px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="tabular-nums w-6 text-center text-sm font-medium">
                      {modalQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalQty((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={confirmModalAdd}
                    className="flex-1 rounded-full py-3 text-sm font-semibold text-[#10110e]"
                    style={{ backgroundColor: accent }}
                  >
                    {isAr ? "أضف إلى الطلب" : "Add to order"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Over Cart & Checkout Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/75"
            onClick={() => setCartOpen(false)}
          >
            <motion.aside
              initial={{ x: isAr ? -420 : 420 }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? -420 : 420 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col justify-between border-l border-[#252d2b] bg-[#0e1211] p-6 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#252d2b] pb-4">
                  <h2 className="font-display text-2xl font-semibold">
                    {confirmedOrder
                      ? isAr
                        ? "تم تأكيد الطلب"
                        : "Order confirmed"
                      : isAr
                        ? "سلة الطلب"
                        : "Your order"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    aria-label="Close drawer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {confirmedOrder ? (
                  <div className="mt-6 space-y-5">
                    <div className="flex items-start gap-3 rounded-2xl border border-[#2e4c3d] bg-[#13221b] p-4">
                      <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0 text-[#86efac]"
                      />
                      <div>
                        <p className="font-mono-num text-sm font-semibold text-[#86efac]">
                          Order #{confirmedOrder.orderNumber} ·{" "}
                          {confirmedOrder.status}
                        </p>
                        <p className="mt-1 text-xs text-[#cde6d7]">
                          {isAr
                            ? "تم إرسال طلبك مباشرة إلى مطبخ المطعم."
                            : "Sent directly to the kitchen queue."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-[#252d2b] bg-[#111515] p-4 text-xs">
                      {confirmedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <span>
                            {item.quantity}× {item.productNameSnapshot}
                          </span>
                          <span className="tabular-nums">
                            {item.unitPrice * item.quantity}{" "}
                            {confirmedOrder.currency}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t border-[#252d2b] pt-2 text-sm font-semibold">
                        <span>{isAr ? "الإجمالي" : "Total"}</span>
                        <span className="tabular-nums">
                          {confirmedOrder.total} {confirmedOrder.currency}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCartOpen(false)}
                      className="w-full rounded-full py-3 text-xs font-semibold text-[#10110e]"
                      style={{ backgroundColor: accent }}
                    >
                      {isAr ? "العودة للقائمة" : "Back to menu"}
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShoppingBag
                      size={28}
                      className="mx-auto text-[#4e5854]"
                    />
                    <p className="mt-3 text-sm font-medium">
                      {isAr ? "سلتك فارغة حالياً." : "Your order bag is empty."}
                    </p>
                    <p className="muted mt-1 text-xs">
                      {isAr
                        ? "أضف أطباقاً من القائمة للبدء."
                        : "Select dishes from the menu to start ordering."}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-5">
                    <div className="space-y-3">
                      {cart.map((entry) => (
                        <div
                          key={entry.key}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#252d2b] bg-[#131817] p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {isAr
                                ? entry.product.nameAr || entry.product.name
                                : entry.product.name}
                            </p>
                            {entry.selectedOptionLabels.length > 0 && (
                              <p className="muted truncate text-[11px]">
                                {entry.selectedOptionLabels.join(", ")}
                              </p>
                            )}
                            <p
                              className="tabular-nums mt-1 text-xs font-medium"
                              style={{ color: accent }}
                            >
                              {entry.unitPrice * entry.quantity}{" "}
                              {restaurant.currency}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 rounded-full border border-[#252d2b] px-2.5 py-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, -1)}
                              aria-label="Decrease item"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="tabular-nums w-5 text-center text-xs">
                              {entry.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, 1)}
                              aria-label="Increase item"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form
                      onSubmit={handleCheckout}
                      className="space-y-3 border-t border-[#252d2b] pt-5"
                    >
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#141918] p-1">
                        <button
                          type="button"
                          onClick={() => setOrderType("dine_in")}
                          className={`rounded-lg py-2 text-xs font-medium ${
                            orderType === "dine_in"
                              ? "bg-[#252d2b] text-white"
                              : "text-[#9aa6a1]"
                          }`}
                        >
                          {isAr ? "داخل المطعم" : "Dine-in table"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType("pickup")}
                          className={`rounded-lg py-2 text-xs font-medium ${
                            orderType === "pickup"
                              ? "bg-[#252d2b] text-white"
                              : "text-[#9aa6a1]"
                          }`}
                        >
                          {isAr ? "استلام من الفرع" : "Branch pickup"}
                        </button>
                      </div>

                      {branches.length > 0 && (
                        <select
                          value={branchId}
                          onChange={(e) => setBranchId(e.target.value)}
                          className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs"
                        >
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      )}

                      {orderType === "dine_in" && (
                        <input
                          type="text"
                          value={tableLabel}
                          onChange={(e) => setTableLabel(e.target.value)}
                          placeholder={isAr ? "رقم الطاولة" : "Table number"}
                          className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs"
                        />
                      )}

                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={isAr ? "الاسم *" : "Your name *"}
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs"
                      />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder={isAr ? "رقم الجوال *" : "Phone number *"}
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs"
                      />
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={isAr ? "ملاحظات للمطبخ" : "Kitchen notes (optional)"}
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs"
                      />

                      {orderError && (
                        <p className="text-xs text-red-300" role="alert">
                          {orderError}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 text-sm font-semibold">
                        <span>{isAr ? "الإجمالي" : "Subtotal"}</span>
                        <span className="tabular-nums">
                          {cartSubtotal} {restaurant.currency}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="h-11 w-full rounded-full text-sm font-semibold text-[#10110e]"
                        style={{ backgroundColor: accent }}
                      >
                        {submitting
                          ? isAr
                            ? "جاري الإرسال..."
                            : "Sending order..."
                          : isAr
                            ? "تأكيد وإرسال الطلب"
                            : "Place order"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
