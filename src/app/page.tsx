import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  ChartNoAxesCombined,
  ClipboardList,
  Palette,
  QrCode,
  ShieldCheck,
  Store,
} from "lucide-react";
import LandingPreview from "@/components/LandingPreview";
import { getStarterSeedDataset } from "@/lib/demo-fallback";

const modules = [
  {
    icon: Store,
    title: "Branded digital menus",
    text: "Dedicated storefronts per restaurant with bilingual English & Arabic RTL support and live ordering.",
  },
  {
    icon: Palette,
    title: "Visual brand editor",
    text: "Restaurant owners customize palette, typography accents, currency, and cover imagery with live preview.",
  },
  {
    icon: ClipboardList,
    title: "Catalog & modifiers",
    text: "Manage categories, dishes, allergens, availability, and custom add-on option groups in real time.",
  },
  {
    icon: QrCode,
    title: "Dynamic table QR codes",
    text: "Generate scannable branch and table QR codes that route guests directly into their table ordering flow.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Server-validated orders",
    text: "Order totals are computed from catalog pricing with instant kitchen status tracking in Firestore.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-tenant isolation",
    text: "Platform super-admin provisioning, Google Auth role-based staff access, and custom domain verification.",
  },
];

const steps = [
  {
    num: "01",
    title: "Provision a restaurant tenant",
    text: "Create the restaurant from Super Admin. Starter categories, main branch, QR code, and owner invite generate automatically.",
  },
  {
    num: "02",
    title: "Send the client workspace link",
    text: "Share the dedicated dashboard URL with the restaurant owner for one-click Google sign-in and self-service onboarding.",
  },
  {
    num: "03",
    title: "Customize brand, menu & QR",
    text: "Owners edit colors, dishes, modifiers, and branches with an instant live menu preview—zero engineering needed.",
  },
  {
    num: "04",
    title: "Publish & accept live orders",
    text: "Flip the menu live on its slug or custom domain and track incoming dine-in and pickup orders immediately.",
  },
];

export default function Home() {
  const seed = getStarterSeedDataset();
  const previewTenants = seed.restaurants.slice(0, 3).map((restaurant) => {
    const items = seed.products
      .filter((p) => p.restaurantId === restaurant.id)
      .slice(0, 2)
      .map((p) => {
        const cat = seed.categories.find((c) => c.id === p.categoryId);
        return {
          name: p.name,
          category: cat?.name || "Menu",
          price: p.price,
          imageUrl: p.imageUrl,
        };
      });
    return { restaurant, sampleItems: items };
  });

  return (
    <main className="min-h-screen">
      {/* Top Bar Contract: 3 zones */}
      <header className="border-b border-[#252d2b]">
        <div className="container flex h-20 items-center justify-between gap-8">
          <Link
            href="/"
            className="whitespace-nowrap shrink-0 text-xl font-semibold tracking-[0.22em]"
          >
            QLUB<span className="gold">.</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-[#aab4af] md:flex">
            <a
              href="#platform"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#f5f5f1]"
            >
              Platform
            </a>
            <a
              href="#workflow"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#f5f5f1]"
            >
              Workflow
            </a>
            <a
              href="#modules"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#f5f5f1]"
            >
              Modules
            </a>
            <Link
              href="/r/the-house"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#f5f5f1]"
            >
              Demo Menu
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-full border border-[#c8a66a] px-5 py-2.5 text-sm font-medium text-[#e5c991] transition-colors hover:bg-[#c8a66a] hover:text-[#10110e]"
            >
              Platform dashboard <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Split */}
      <section
        id="platform"
        className="container grid items-stretch gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20"
      >
        <div className="flex flex-col justify-center">
          <p className="text-xs font-medium tracking-[0.22em] text-[#d6b77d]">
            WHITE-LABEL RESTAURANT PLATFORM
          </p>
          <h1
            className="font-display mt-4 max-w-2xl text-5xl font-semibold leading-[1.06] tracking-tight md:text-6xl"
            style={{ textWrap: "balance" }}
          >
            One core platform.{" "}
            <span className="gold">Every restaurant brand.</span>
          </h1>
          <p className="muted mt-6 max-w-xl text-base leading-7 md:text-lg">
            Provision independent restaurant websites, self-service client
            dashboards, QR table ordering, and multi-branch catalogs from a
            single multi-tenant control plane.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="whitespace-nowrap shrink-0 rounded-full bg-[#c8a66a] px-7 py-3.5 text-sm font-semibold text-[#10110e] transition-opacity hover:opacity-90"
            >
              Open Super Admin
            </Link>
            <Link
              href="/login"
              className="whitespace-nowrap shrink-0 rounded-full border border-[#39413e] px-6 py-3.5 text-sm font-medium text-[#f5f5f1] transition-colors hover:border-[#c8a66a]"
            >
              Sign in to workspace
            </Link>
            <Link
              href="/r/the-house"
              className="whitespace-nowrap shrink-0 px-4 py-3.5 text-sm font-medium text-[#c8a66a] transition-opacity hover:opacity-80"
            >
              Explore live menu
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[#252d2b] pt-8">
            <div>
              <p className="tabular-nums text-2xl font-semibold">
                {seed.restaurants.length}
              </p>
              <p className="muted mt-1 text-xs">Active tenant spaces</p>
            </div>
            <div>
              <p className="tabular-nums text-2xl font-semibold">
                {seed.products.length}
              </p>
              <p className="muted mt-1 text-xs">Catalog dishes live</p>
            </div>
            <div>
              <p className="tabular-nums text-2xl font-semibold">EN / AR</p>
              <p className="muted mt-1 text-xs">Bilingual RTL menus</p>
            </div>
          </div>
        </div>

        <LandingPreview tenants={previewTenants} />
      </section>

      {/* Self-service onboarding workflow */}
      <section
        id="workflow"
        className="border-y border-[#252d2b] bg-[#0d1010] py-20"
      >
        <div className="container">
          <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="gold text-xs font-medium tracking-[0.22em]">
                SELF-SERVICE WORKFLOW
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">
                Launch a client restaurant in under two minutes.
              </h2>
            </div>
            <p className="muted text-sm leading-6">
              Platform owners create the tenant once. Each restaurant receives
              its own isolated dashboard URL, brand editor, menu manager, and
              scannable table QR codes.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="panel flex flex-col justify-between p-6"
              >
                <div>
                  <span className="font-mono-num gold text-xs font-medium">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="muted mt-2 text-sm leading-6">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section id="modules" className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="gold text-xs font-medium tracking-[0.22em]">
              PLATFORM MODULES
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">
              Everything your restaurant clients need.
            </h2>
          </div>
          <Link
            href="/dashboard/the-house"
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-sm font-medium text-[#c8a66a]"
          >
            Inspect client dashboard <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ icon: Icon, title, text }) => (
            <div className="panel p-6" key={title}>
              <Icon className="gold" size={22} />
              <h3 className="mt-5 text-lg font-medium">{title}</h3>
              <p className="muted mt-2 text-sm leading-6">{text}</p>
            </div>
          ))}
        </div>

        <div className="panel mt-12 grid items-center gap-8 overflow-hidden p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div>
            <p className="gold text-xs font-medium tracking-[0.22em]">
              HOSPITALITY GRADE
            </p>
            <h3 className="font-display mt-3 text-3xl font-semibold">
              Designed for dining rooms, cafes, and multi-branch groups.
            </h3>
            <p className="muted mt-3 max-w-xl text-sm leading-6">
              Try the live storefront for The House or jump straight into Super
              Admin to provision a brand-new restaurant workspace and test the
              full owner handoff flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/r/the-house"
                className="whitespace-nowrap shrink-0 rounded-full bg-[#c8a66a] px-6 py-2.5 text-sm font-medium text-[#10110e]"
              >
                Preview The House menu
              </Link>
              <Link
                href="/admin"
                className="whitespace-nowrap shrink-0 rounded-full border border-[#39413e] px-6 py-2.5 text-sm font-medium"
              >
                Create new restaurant
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#252d2b]">
            <img
              src="/images/restaurant_hero_interior.jpg"
              alt="Contemporary luxury restaurant dining room"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#252d2b] py-8">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-xs text-[#8e9994]">
          <div className="flex items-center gap-3">
            <Building2 size={14} className="gold" />
            <span>QLUB PLATFORM · MULTI-TENANT RESTAURANT SAAS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-[#f5f5f1]">
              Sign in
            </Link>
            <Link href="/admin" className="hover:text-[#f5f5f1]">
              Super Admin
            </Link>
            <Link href="/r/the-house" className="hover:text-[#f5f5f1]">
              Live Demo
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
