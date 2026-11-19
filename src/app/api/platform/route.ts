import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getStore, hashPassword, persistStore, toPublicUser } from "@/lib/store";
import type { PlatformRole, PlatformSettings } from "@/lib/types";

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.platformRole !== "owner" && user.platformRole !== "support")) {
    return NextResponse.json({ error: "Platform admin access required." }, { status: 403 });
  }

  const store = getStore();
  const restaurants = store.restaurants.map((r) => {
    const restOrders = store.orders.filter((o) => o.restaurantId === r.id);
    const restProducts = store.products.filter((p) => p.restaurantId === r.id);
    const restBranches = store.branches.filter((b) => b.restaurantId === r.id);
    const restDomains = store.domains.filter((d) => d.restaurantId === r.id);
    const restMembers = store.members.filter((m) => m.restaurantId === r.id);
    const revenue = restOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ...r,
      productCount: restProducts.length,
      branchCount: restBranches.length,
      orderCount: restOrders.length,
      revenue: Number(revenue.toFixed(2)),
      primaryDomain: restDomains[0]?.hostname || `${r.slug}.qlub.app`,
      domainVerified: restDomains[0]?.isVerified ?? false,
      ownerEmail: restMembers.find((m) => m.role === "admin")?.email || "—",
    };
  });

  const platformUsers = store.users
    .filter((u) => Boolean(u.platformRole))
    .map(toPublicUser);

  const allMembers = store.members.map((m) => {
    const rest = store.restaurants.find((r) => r.id === m.restaurantId);
    return {
      ...m,
      restaurantName: rest?.name || "Unknown",
      restaurantSlug: rest?.slug || "",
    };
  });

  return NextResponse.json({
    restaurants,
    platformUsers,
    allMembers,
    settings: store.settings,
    stats: {
      totalRestaurants: store.restaurants.length,
      publishedMenus: store.restaurants.filter((r) => r.isPublished).length,
      totalOrders: store.orders.length,
      totalProducts: store.products.length,
      totalRevenue: Number(
        store.orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0)
          .toFixed(2)
      ),
    },
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.platformRole !== "owner") {
    return NextResponse.json({ error: "Platform owner access required." }, { status: 403 });
  }
  const body = (await req.json()) as Partial<PlatformSettings>;
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...body,
  };
  persistStore(store);
  return NextResponse.json({ settings: store.settings });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.platformRole !== "owner") {
    return NextResponse.json({ error: "Platform owner access required." }, { status: 403 });
  }
  const body = (await req.json()) as {
    email?: string;
    fullName?: string;
    platformRole?: PlatformRole;
    password?: string;
  };
  const email = (body.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const store = getStore();
  let target = store.users.find((u) => u.email.toLowerCase() === email);
  const role: PlatformRole = body.platformRole === "owner" ? "owner" : "support";
  if (target) {
    target.platformRole = role;
    if (body.fullName?.trim()) target.fullName = body.fullName.trim();
  } else {
    target = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      email,
      fullName: body.fullName?.trim() || "Platform Team",
      passwordHash: hashPassword(body.password || "QlubTeam2026!"),
      platformRole: role,
      createdAt: new Date().toISOString(),
    };
    store.users.push(target);
  }
  persistStore(store);
  return NextResponse.json({ user: toPublicUser(target) }, { status: 201 });
}
