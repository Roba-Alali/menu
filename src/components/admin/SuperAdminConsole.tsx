"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  addPlatformOperator,
  deleteRestaurantCascade,
  provisionRestaurantInFirestore,
  savePlatformSettingsInFirestore,
  updateRestaurantAdmin,
} from "@/lib/firestore-service";
import { firebaseConfig } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import type {
  PlanTier,
  PlatformSettings,
  PublicUser,
  Restaurant,
  TenantStatus,
} from "@/lib/types";

type AdminTab = "overview" | "restaurants" | "team" | "plans" | "settings";

export interface AdminRestaurantRow extends Restaurant {
  productCount: number;
  branchCount: number;
  orderCount: number;
  revenue: number;
  primaryDomain: string;
  domainVerified: boolean;
  ownerEmail: string;
}

export interface AdminMemberRow {
  restaurantId: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  restaurantName: string;
  restaurantSlug: string;
}

export interface SuperAdminInitialData {
  currentUser: PublicUser;
  restaurants: AdminRestaurantRow[];
  platformUsers: PublicUser[];
  allMembers: AdminMemberRow[];
  settings: PlatformSettings;
  stats: {
    totalRestaurants: number;
    publishedMenus: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
  };
}

interface ProvisionedResult {
  restaurant: Restaurant;
  ownerEmail: string;
  dashboardPath: string;
  publicMenuPath: string;
}

const PLAN_DETAILS: Array<{
  name: PlanTier;
  audience: string;
  price: string;
  limits: string;
}> = [
  {
    name: "Starter",
    audience: "For single-location cafes & kitchens",
    price: "199 SAR / mo",
    limits: "1 branch · 15 QR codes · Standard domain slug · 3 team seats",
  },
  {
    name: "Growth",
    audience: "For multi-branch hospitality brands",
    price: "499 SAR / mo",
    limits: "Up to 5 branches · Unlimited QR codes · Custom domain · 15 team seats",
  },
  {
    name: "Enterprise",
    audience: "For restaurant groups & franchises",
    price: "1,199 SAR / mo",
    limits: "Unlimited branches · Dedicated domain routing · Priority support · Unlimited seats",
  },
];

export default function SuperAdminConsole({
  initialData,
  onRefresh,
}: {
  initialData: SuperAdminInitialData;
  onRefresh: () => Promise<void>;
}) {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [restaurants, setRestaurants] = useState<AdminRestaurantRow[]>(
    initialData.restaurants
  );
  const [platformUsers, setPlatformUsers] = useState<PublicUser[]>(
    initialData.platformUsers
  );
  const [allMembers, setAllMembers] = useState<AdminMemberRow[]>(
    initialData.allMembers
  );
  const [settings, setSettings] = useState<PlatformSettings>(initialData.settings);
  const [stats, setStats] = useState(initialData.stats);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TenantStatus>("All");

  // Create restaurant modal
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [provisioned, setProvisioned] = useState<ProvisionedResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    slug: "",
    description: "",
    ownerName: "",
    ownerEmail: "",
    plan: "Growth" as PlanTier,
    currency: "SAR",
    primaryColor: "#c8a66a",
    branchName: "Main Branch",
    customDomain: "",
  });

  // Platform team form
  const [teamForm, setTeamForm] = useState({
    fullName: "",
    email: "",
    platformRole: "support" as "owner" | "support",
  });
  const [teamSaving, setTeamSaving] = useState(false);

  // Settings feedback
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState("");

  async function refreshPlatform() {
    await onRefresh();
  }

  useEffect(() => {
    setRestaurants(initialData.restaurants);
    setPlatformUsers(initialData.platformUsers);
    setAllMembers(initialData.allMembers);
    setSettings(initialData.settings);
    setStats(initialData.stats);
  }, [initialData]);

  const filteredRestaurants = useMemo(() => {
    const q = search.trim().toLowerCase();
    return restaurants.filter((r) => {
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.ownerEmail.toLowerCase().includes(q) ||
        r.primaryDomain.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [restaurants, search, statusFilter]);

  function copyText(key: string, text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  }

  async function handleCreateRestaurant(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const result = await provisionRestaurantInFirestore(
        {
          ...form,
          status: "Setup",
        },
        initialData.currentUser.id
      );
      setProvisioned(result);
      await refreshPlatform();
      setForm({
        name: "",
        nameAr: "",
        slug: "",
        description: "",
        ownerName: "",
        ownerEmail: "",
        plan: "Growth",
        currency: "SAR",
        primaryColor: "#c8a66a",
        branchName: "Main Branch",
        customDomain: "",
      });
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to provision restaurant."
      );
    } finally {
      setCreating(false);
    }
  }

  async function togglePublish(row: AdminRestaurantRow) {
    const nextPublished = !row.isPublished;
    await updateRestaurantAdmin(row.slug, {
      isPublished: nextPublished,
      status: nextPublished ? "Active" : "Setup",
    });
    await refreshPlatform();
  }

  async function updatePlan(slug: string, plan: PlanTier) {
    await updateRestaurantAdmin(slug, { plan });
    await refreshPlatform();
  }

  async function updateStatus(slug: string, status: TenantStatus) {
    await updateRestaurantAdmin(slug, {
      status,
      isPublished: status === "Active",
    });
    await refreshPlatform();
  }

  async function deleteRestaurant(slug: string) {
    await deleteRestaurantCascade(slug);
    await refreshPlatform();
  }

  async function handleAddPlatformMember(e: React.FormEvent) {
    e.preventDefault();
    setTeamSaving(true);
    try {
      await addPlatformOperator(teamForm);
      setTeamForm({ fullName: "", email: "", platformRole: "support" });
      await refreshPlatform();
    } finally {
      setTeamSaving(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSavedMsg("");
    try {
      await savePlatformSettingsInFirestore(settings);
      setSettingsSavedMsg("Platform settings saved to Firestore.");
      setTimeout(() => setSettingsSavedMsg(""), 2500);
    } finally {
      setSettingsSaving(false);
    }
  }

  async function handleLogout() {
    await signOutUser();
    router.push("/login");
  }

  const navItems: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "restaurants", label: "Restaurants", icon: Building2 },
    { id: "team", label: "Team & roles", icon: Users },
    { id: "plans", label: "Plans & billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  return (
    <main className="min-h-screen bg-[#090b0b]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-[#252d2b] bg-[#0d1010] p-6 md:flex">
        <div>
          <Link href="/" className="text-xl font-semibold tracking-[0.2em]">
            QLUB<span className="gold">.</span>
          </Link>
          <p className="muted mt-1.5 text-[11px] tracking-[0.18em]">
            SUPER ADMIN
          </p>

          <nav className="mt-10 space-y-1.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                    active
                      ? "bg-[#242b28] font-medium text-[#f5f5f1]"
                      : "text-[#aab4af] hover:bg-[#171d1b] hover:text-[#f5f5f1]"
                  }`}
                >
                  <Icon size={17} className={active ? "gold" : ""} />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#252d2b] pt-5">
          <p className="truncate text-xs font-medium text-[#f5f5f1]">
            {initialData.currentUser.fullName}
          </p>
          <p className="muted truncate text-[11px]">
            {initialData.currentUser.email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-2 rounded-lg border border-[#252d2b] px-3 py-2 text-xs text-[#aab4af] transition-colors hover:border-[#c8a66a] hover:text-[#f5f5f1]"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-64 flex-col justify-between border-r border-[#252d2b] bg-[#0d1010] p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Link href="/" className="text-xl font-semibold tracking-[0.2em]">
                    QLUB<span className="gold">.</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close navigation"
                  >
                    <X size={18} />
                  </button>
                </div>
                <nav className="mt-8 space-y-1.5">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setActiveTab(id);
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${
                        activeTab === id
                          ? "bg-[#242b28] font-medium text-white"
                          : "text-[#aab4af]"
                      }`}
                    >
                      <Icon size={17} />
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-[#aab4af]"
              >
                <LogOut size={14} /> Sign out
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="md:ml-64">
        <header className="flex h-20 items-center justify-between gap-4 border-b border-[#252d2b] px-6 md:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-lg border border-[#252d2b] p-2 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-sm font-medium capitalize">
                Platform {activeTab === "plans" ? "plans & billing" : activeTab}
              </p>
              <p className="muted text-xs">
                Multi-tenant hospitality control plane
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setProvisioned(null);
                setCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-full bg-[#c8a66a] px-5 py-2.5 text-sm font-semibold text-[#111] transition-opacity hover:opacity-90"
            >
              <Plus size={15} /> Create restaurant
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="gold text-xs font-medium tracking-[0.2em]">
                    PORTFOLIO OVERVIEW
                  </p>
                  <h1 className="font-display mt-2 text-4xl font-semibold">
                    Welcome back, {initialData.currentUser.fullName.split(" ")[0]}.
                  </h1>
                  <p className="muted mt-1.5 text-sm">
                    Provision new client workspaces, monitor menu adoption, and
                    dispatch self-service dashboard links.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="panel p-5">
                  <div className="flex items-center justify-between">
                    <span className="muted text-sm">Restaurants</span>
                    <Building2 className="gold" size={18} />
                  </div>
                  <p className="tabular-nums mt-4 text-3xl font-semibold">
                    {stats.totalRestaurants}
                  </p>
                  <p className="muted mt-1.5 text-xs">
                    Provisioned tenant spaces
                  </p>
                </div>

                <div className="panel p-5">
                  <div className="flex items-center justify-between">
                    <span className="muted text-sm">Published menus</span>
                    <ShoppingBag className="gold" size={18} />
                  </div>
                  <p className="tabular-nums mt-4 text-3xl font-semibold">
                    {stats.publishedMenus}
                  </p>
                  <p className="muted mt-1.5 text-xs">
                    {stats.totalProducts} total menu products
                  </p>
                </div>

                <div className="panel p-5">
                  <div className="flex items-center justify-between">
                    <span className="muted text-sm">Platform orders</span>
                    <Activity className="gold" size={18} />
                  </div>
                  <p className="tabular-nums mt-4 text-3xl font-semibold">
                    {stats.totalOrders}
                  </p>
                  <p className="muted mt-1.5 text-xs">
                    Across dine-in QR & pickup
                  </p>
                </div>

                <div className="panel p-5">
                  <div className="flex items-center justify-between">
                    <span className="muted text-sm">Order GMV</span>
                    <CreditCard className="gold" size={18} />
                  </div>
                  <p className="tabular-nums mt-4 text-3xl font-semibold">
                    {stats.totalRevenue.toLocaleString()} SAR
                  </p>
                  <p className="muted mt-1.5 text-xs">
                    Server-validated order volume
                  </p>
                </div>
              </div>

              <section className="panel mt-8 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#252d2b] p-5">
                  <div>
                    <h2 className="font-medium">Client restaurants</h2>
                    <p className="muted mt-1 text-xs">
                      Open any restaurant&apos;s client dashboard to edit branding
                      and menus, or preview its public menu.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("restaurants")}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#c8a66a]"
                  >
                    Manage all tenants <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="muted border-b border-[#252d2b] text-xs">
                      <tr>
                        <th className="px-5 py-3.5 font-medium">Restaurant</th>
                        <th className="px-5 py-3.5 font-medium">Owner</th>
                        <th className="px-5 py-3.5 font-medium">Plan</th>
                        <th className="px-5 py-3.5 font-medium">Menu Items</th>
                        <th className="px-5 py-3.5 font-medium">Status</th>
                        <th className="px-5 py-3.5 text-right font-medium">
                          Workspaces
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-[#252d2b]/70 transition-colors hover:bg-[#151a19]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold"
                                style={{
                                  borderColor: r.primaryColor,
                                  color: r.primaryColor,
                                }}
                              >
                                {r.logoText}
                              </span>
                              <div>
                                <p className="font-medium text-[#f5f5f1]">
                                  {r.name}
                                </p>
                                <p className="font-mono-num muted text-xs">
                                  /r/{r.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="muted px-5 py-4 text-xs">
                            {r.ownerEmail}
                          </td>
                          <td className="px-5 py-4 text-xs">{r.plan}</td>
                          <td className="tabular-nums px-5 py-4 text-xs">
                            {r.productCount} items · {r.orderCount} orders
                          </td>
                          <td className="px-5 py-4 text-xs">
                            <span
                              className={
                                r.isPublished
                                  ? "text-[#86efac]"
                                  : "text-[#e5c991]"
                              }
                            >
                              {r.isPublished ? "Published" : r.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-4 text-xs font-medium">
                              <Link
                                href={`/dashboard/${r.slug}`}
                                className="whitespace-nowrap text-[#c8a66a] hover:underline"
                              >
                                Client dashboard
                              </Link>
                              <Link
                                href={`/r/${r.slug}`}
                                className="inline-flex items-center gap-1 whitespace-nowrap text-[#aab4af] hover:text-[#f5f5f1]"
                              >
                                Public menu <ExternalLink size={12} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* RESTAURANTS DIRECTORY */}
          {activeTab === "restaurants" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="gold text-xs font-medium tracking-[0.2em]">
                    TENANT PORTFOLIO
                  </p>
                  <h1 className="font-display mt-2 text-3xl font-semibold">
                    Restaurants & provisioning
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa6a1]"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search restaurant, slug, email..."
                      className="h-10 w-64 rounded-xl border border-[#252d2b] bg-[#111515] pl-9 pr-3 text-xs text-[#f5f5f1]"
                    />
                  </div>

                  <div className="flex items-center gap-1 rounded-xl border border-[#252d2b] bg-[#111515] p-1">
                    {(["All", "Active", "Setup", "Suspended"] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            statusFilter === st
                              ? "bg-[#242b28] text-[#f5f5f1]"
                              : "text-[#9aa6a1] hover:text-[#f5f5f1]"
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="panel mt-6 overflow-hidden">
                {filteredRestaurants.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-sm font-medium">
                      No matching restaurants found.
                    </p>
                    <p className="muted mt-1 text-xs">
                      Clear your search filter or provision a new restaurant.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left text-sm">
                      <thead className="muted border-b border-[#252d2b] text-xs">
                        <tr>
                          <th className="px-5 py-3.5 font-medium">Restaurant</th>
                          <th className="px-5 py-3.5 font-medium">Domain</th>
                          <th className="px-5 py-3.5 font-medium">Plan</th>
                          <th className="px-5 py-3.5 font-medium">Lifecycle</th>
                          <th className="px-5 py-3.5 font-medium">Visibility</th>
                          <th className="px-5 py-3.5 text-right font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRestaurants.map((r) => (
                          <tr
                            key={r.id}
                            className="border-b border-[#252d2b]/70 transition-colors hover:bg-[#151a19]"
                          >
                            <td className="px-5 py-4">
                              <p className="font-medium text-[#f5f5f1]">
                                {r.name}
                              </p>
                              <p className="muted text-xs">{r.ownerEmail}</p>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 text-xs">
                                <Globe size={13} className="muted" />
                                <span className="font-mono-num">
                                  {r.primaryDomain}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <select
                                aria-label={`Plan for ${r.name}`}
                                value={r.plan}
                                onChange={(e) =>
                                  void updatePlan(r.slug, e.target.value as PlanTier)
                                }
                                className="rounded-lg border border-[#252d2b] bg-[#0d1010] px-2.5 py-1.5 text-xs"
                              >
                                <option value="Starter">Starter</option>
                                <option value="Growth">Growth</option>
                                <option value="Enterprise">Enterprise</option>
                              </select>
                            </td>
                            <td className="px-5 py-4">
                              <select
                                aria-label={`Status for ${r.name}`}
                                value={r.status}
                                onChange={(e) =>
                                  void updateStatus(
                                    r.slug,
                                    e.target.value as TenantStatus
                                  )
                                }
                                className="rounded-lg border border-[#252d2b] bg-[#0d1010] px-2.5 py-1.5 text-xs"
                              >
                                <option value="Active">Active</option>
                                <option value="Setup">Setup</option>
                                <option value="Suspended">Suspended</option>
                              </select>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                type="button"
                                onClick={() => void togglePublish(r)}
                                className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                                  r.isPublished
                                    ? "border-[#2e4c3d] bg-[#13221b] text-[#86efac]"
                                    : "border-[#3c3424] bg-[#1d1810] text-[#e5c991]"
                                }`}
                              >
                                {r.isPublished ? "Published" : "Unpublished"}
                              </button>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex items-center gap-3 text-xs">
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      r.slug,
                                      `${origin}/dashboard/${r.slug}`
                                    )
                                  }
                                  className="inline-flex items-center gap-1 text-[#aab4af] hover:text-[#f5f5f1]"
                                  title="Copy client dashboard link"
                                >
                                  {copiedKey === r.slug ? (
                                    <Check size={13} className="text-[#86efac]" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                  Link
                                </button>
                                <Link
                                  href={`/dashboard/${r.slug}`}
                                  className="font-medium text-[#c8a66a] hover:underline"
                                >
                                  Dashboard
                                </Link>
                                <Link
                                  href={`/r/${r.slug}`}
                                  className="text-[#aab4af] hover:text-[#f5f5f1]"
                                >
                                  Menu ↗
                                </Link>
                                {initialData.currentUser.platformRole === "owner" && (
                                  <button
                                    type="button"
                                    onClick={() => void deleteRestaurant(r.slug)}
                                    aria-label={`Delete ${r.name}`}
                                    className="text-[#9aa6a1] hover:text-red-400"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEAM & ROLES */}
          {activeTab === "team" && (
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <section className="panel p-6">
                <p className="gold text-xs font-medium tracking-[0.2em]">
                  PLATFORM OPERATORS
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Super Admin & Support Team
                </h2>
                <div className="mt-5 divide-y divide-[#252d2b]">
                  {platformUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between py-3.5"
                    >
                      <div>
                        <p className="text-sm font-medium">{u.fullName}</p>
                        <p className="muted text-xs">{u.email}</p>
                      </div>
                      <span className="text-xs font-medium capitalize text-[#c8a66a]">
                        {u.platformRole}
                      </span>
                    </div>
                  ))}
                </div>

                {initialData.currentUser.platformRole === "owner" && (
                  <form
                    onSubmit={handleAddPlatformMember}
                    className="mt-6 space-y-3 border-t border-[#252d2b] pt-5"
                  >
                    <p className="text-xs font-medium text-[#aab4af]">
                      Add platform operator
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={teamForm.fullName}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, fullName: e.target.value })
                        }
                        className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                      />
                      <input
                        type="email"
                        required
                        placeholder="operator@qlub.app"
                        value={teamForm.email}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, email: e.target.value })
                        }
                        className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={teamForm.platformRole}
                        onChange={(e) =>
                          setTeamForm({
                            ...teamForm,
                            platformRole: e.target.value as "owner" | "support",
                          })
                        }
                        className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                      >
                        <option value="support">Support</option>
                        <option value="owner">Owner</option>
                      </select>
                      <button
                        type="submit"
                        disabled={teamSaving}
                        className="h-10 rounded-full bg-[#c8a66a] px-5 text-xs font-semibold text-[#10110e]"
                      >
                        {teamSaving ? "Adding..." : "Add operator"}
                      </button>
                    </div>
                  </form>
                )}
              </section>

              <section className="panel p-6">
                <p className="gold text-xs font-medium tracking-[0.2em]">
                  TENANT WORKSPACES
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Restaurant Owners & Staff
                </h2>
                <div className="mt-5 divide-y divide-[#252d2b]">
                  {allMembers.map((m) => (
                    <div
                      key={`${m.restaurantId}-${m.userId}`}
                      className="flex items-center justify-between gap-4 py-3.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {m.fullName}
                        </p>
                        <p className="muted truncate text-xs">
                          {m.email} · {m.restaurantName}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/${m.restaurantSlug}`}
                        className="whitespace-nowrap shrink-0 text-xs font-medium text-[#c8a66a]"
                      >
                        {m.role} · Open
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* PLANS & BILLING */}
          {activeTab === "plans" && (
            <div>
              <p className="gold text-xs font-medium tracking-[0.2em]">
                SUBSCRIPTION ARCHITECTURE
              </p>
              <h1 className="font-display mt-2 text-3xl font-semibold">
                White-label plans & tenant allocation
              </h1>

              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {PLAN_DETAILS.map((tier) => {
                  const count = restaurants.filter(
                    (r) => r.plan === tier.name
                  ).length;
                  return (
                    <div key={tier.name} className="panel flex flex-col justify-between p-6">
                      <div>
                        <p className="gold text-xs font-medium tracking-[0.18em]">
                          {tier.name.toUpperCase()}
                        </p>
                        <p className="tabular-nums mt-3 text-3xl font-semibold">
                          {tier.price}
                        </p>
                        <p className="muted mt-2 text-xs">{tier.audience}</p>
                        <p className="mt-4 border-t border-[#252d2b] pt-4 text-xs leading-6 text-[#cfd6d3]">
                          {tier.limits}
                        </p>
                      </div>
                      <p className="tabular-nums mt-6 text-xs text-[#9aa6a1]">
                        {count} active {count === 1 ? "restaurant" : "restaurants"} on{" "}
                        {tier.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PLATFORM SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <p className="gold text-xs font-medium tracking-[0.2em]">
                PLATFORM CONFIGURATION
              </p>
              <h1 className="font-display mt-2 text-3xl font-semibold">
                Global defaults & routing
              </h1>

              <form onSubmit={handleSaveSettings} className="panel mt-6 space-y-5 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                    Platform name
                  </label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) =>
                      setSettings({ ...settings, platformName: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-4 text-sm"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Support email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, supportEmail: e.target.value })
                      }
                      className="h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-4 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Default currency
                    </label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultCurrency: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-4 text-sm"
                    >
                      <option value="SAR">SAR</option>
                      <option value="AED">AED</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                    Custom domain CNAME target
                  </label>
                  <input
                    type="text"
                    value={settings.defaultCnameTarget}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultCnameTarget: e.target.value,
                      })
                    }
                    className="font-mono-num h-11 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-4 text-sm"
                  />
                </div>

                <div className="rounded-xl border border-[#252d2b] bg-[#0d1010] p-4 text-xs">
                  <p className="font-medium text-[#f5f5f1]">
                    Firebase Firestore &amp; Auth status
                  </p>
                  <p className="muted mt-1 leading-5">
                    Connected to Firebase project{" "}
                    <span className="font-mono-num text-[#f5f5f1]">
                      {firebaseConfig.projectId}
                    </span>{" "}
                    (Database:{" "}
                    <span className="font-mono-num text-[#c8a66a]">
                      {firebaseConfig.firestoreDatabaseId}
                    </span>
                    ). Multi-tenant isolation enforced via Firestore security
                    rules.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-sm font-semibold text-[#10110e]"
                  >
                    {settingsSaving ? "Saving..." : "Save settings"}
                  </button>
                  {settingsSavedMsg && (
                    <span className="text-xs text-[#86efac]">
                      {settingsSavedMsg}
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* CREATE RESTAURANT MODAL */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#252d2b] pb-4">
                <div>
                  <p className="gold text-xs font-medium tracking-[0.2em]">
                    AUTO-PROVISION TENANT
                  </p>
                  <h2 className="font-display mt-1 text-2xl font-semibold">
                    {provisioned
                      ? "Restaurant workspace ready"
                      : "Create new restaurant"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  aria-label="Close modal"
                  className="rounded-lg p-1.5 text-[#9aa6a1] hover:text-[#f5f5f1]"
                >
                  <X size={18} />
                </button>
              </div>

              {provisioned ? (
                <div className="mt-6 space-y-5">
                  <p className="text-sm leading-6 text-[#cfd6d3]">
                    <strong>{provisioned.restaurant.name}</strong> has been
                    provisioned with starter categories, a main branch, a QR
                    code, and owner access. Send the handoff details below to the
                    restaurant owner:
                  </p>

                  <div className="space-y-3 rounded-xl border border-[#252d2b] bg-[#0d1010] p-4 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="muted">Client dashboard URL</span>
                        <p className="font-mono-num mt-0.5 text-[#f5f5f1]">
                          {origin}
                          {provisioned.dashboardPath}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            "dash",
                            `${origin}${provisioned.dashboardPath}`
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#252d2b] px-3 py-1.5 text-[#c8a66a]"
                      >
                        {copiedKey === "dash" ? <Check size={13} /> : <Copy size={13} />}
                        Copy
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#252d2b] pt-3">
                      <div>
                        <span className="muted">Public menu URL</span>
                        <p className="font-mono-num mt-0.5 text-[#f5f5f1]">
                          {origin}
                          {provisioned.publicMenuPath}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            "menu",
                            `${origin}${provisioned.publicMenuPath}`
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#252d2b] px-3 py-1.5 text-[#c8a66a]"
                      >
                        {copiedKey === "menu" ? <Check size={13} /> : <Copy size={13} />}
                        Copy
                      </button>
                    </div>

                    <div className="border-t border-[#252d2b] pt-3">
                      <span className="muted">Authorized Google account</span>
                      <p className="font-mono-num mt-1 text-[#f5f5f1]">
                        Owner Email: {provisioned.ownerEmail}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#86efac]">
                        Pre-invited: signing in with Google using this email
                        automatically claims dashboard admin access.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = `Welcome to QLUB!\nDashboard: ${origin}${provisioned.dashboardPath}\nPublic Menu: ${origin}${provisioned.publicMenuPath}\nAuthorized Google Email: ${provisioned.ownerEmail}`;
                        copyText("all", msg);
                      }}
                      className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium"
                    >
                      {copiedKey === "all" ? "Copied invite!" : "Copy full invite"}
                    </button>
                    <Link
                      href={provisioned.dashboardPath}
                      className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
                    >
                      Open client dashboard →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateRestaurant} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        Restaurant name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Cedar & Flame"
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        Arabic name (optional)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={form.nameAr}
                        onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                        placeholder="أرز ولهب"
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        URL slug (auto if blank)
                      </label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="cedar-flame"
                        className="font-mono-num h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        Custom domain (optional)
                      </label>
                      <input
                        type="text"
                        value={form.customDomain}
                        onChange={(e) =>
                          setForm({ ...form, customDomain: e.target.value })
                        }
                        placeholder="menu.cedarflame.com"
                        className="font-mono-num h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
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
                        value={form.ownerName}
                        onChange={(e) =>
                          setForm({ ...form, ownerName: e.target.value })
                        }
                        placeholder="Layla Al-Rashid"
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        Owner email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.ownerEmail}
                        onChange={(e) =>
                          setForm({ ...form, ownerEmail: e.target.value })
                        }
                        placeholder="layla@cedarflame.com"
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        Plan
                      </label>
                      <select
                        value={form.plan}
                        onChange={(e) =>
                          setForm({ ...form, plan: e.target.value as PlanTier })
                        }
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                      >
                        <option value="Starter">Starter</option>
                        <option value="Growth">Growth</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        Currency
                      </label>
                      <select
                        value={form.currency}
                        onChange={(e) =>
                          setForm({ ...form, currency: e.target.value })
                        }
                        className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                      >
                        <option value="SAR">SAR</option>
                        <option value="AED">AED</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                        Brand accent
                      </label>
                      <input
                        type="color"
                        value={form.primaryColor}
                        onChange={(e) =>
                          setForm({ ...form, primaryColor: e.target.value })
                        }
                        className="h-10 w-full cursor-pointer rounded-xl border border-[#252d2b] bg-[#0d1010] p-1"
                      />
                    </div>
                  </div>

                  {createError && (
                    <p className="text-xs text-red-300" role="alert">
                      {createError}
                    </p>
                  )}

                  <div className="flex justify-end gap-3 border-t border-[#252d2b] pt-4">
                    <button
                      type="button"
                      onClick={() => setCreateOpen(false)}
                      className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
                    >
                      {creating ? "Provisioning..." : "Provision restaurant"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
