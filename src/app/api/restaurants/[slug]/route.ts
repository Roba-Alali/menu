import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  canUserAccessRestaurant,
  getRestaurantBundle,
  getStore,
  persistStore,
} from "@/lib/store";
import type { LocaleCode, PlanTier, TenantStatus } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const bundle = getRestaurantBundle(slug);
  if (!bundle) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }
  const user = await getSessionUser();
  const hasAdminAccess = canUserAccessRestaurant(user, bundle.restaurant.id);

  if (!hasAdminAccess) {
    // Public view omits private staff/orders lists
    return NextResponse.json({
      restaurant: bundle.restaurant,
      branches: bundle.branches.filter((b) => b.isActive),
      categories: bundle.categories.filter((c) => c.isActive),
      products: bundle.products,
    });
  }

  return NextResponse.json(bundle);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const store = getStore();
  const restaurant = store.restaurants.find((r) => r.slug === slug);
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const user = await getSessionUser();
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin", "manager", "editor"])) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const body = (await req.json()) as {
    name?: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    logoText?: string;
    coverUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    currency?: string;
    defaultLocale?: LocaleCode;
    isPublished?: boolean;
    plan?: PlanTier;
    status?: TenantStatus;
  };

  if (body.name !== undefined) restaurant.name = body.name.trim() || restaurant.name;
  if (body.nameAr !== undefined) restaurant.nameAr = body.nameAr;
  if (body.description !== undefined) restaurant.description = body.description;
  if (body.descriptionAr !== undefined) restaurant.descriptionAr = body.descriptionAr;
  if (body.logoText !== undefined) restaurant.logoText = body.logoText.slice(0, 3) || "Q";
  if (body.coverUrl !== undefined) restaurant.coverUrl = body.coverUrl;
  if (body.primaryColor !== undefined) restaurant.primaryColor = body.primaryColor;
  if (body.secondaryColor !== undefined) restaurant.secondaryColor = body.secondaryColor;
  if (body.currency !== undefined) restaurant.currency = body.currency;
  if (body.defaultLocale !== undefined) restaurant.defaultLocale = body.defaultLocale;
  if (body.isPublished !== undefined) {
    restaurant.isPublished = Boolean(body.isPublished);
    if (restaurant.isPublished && restaurant.status === "Setup") {
      restaurant.status = "Active";
    }
  }
  if (
    body.plan !== undefined &&
    (user?.platformRole === "owner" || user?.platformRole === "support")
  ) {
    restaurant.plan = body.plan;
  }
  if (
    body.status !== undefined &&
    (user?.platformRole === "owner" || user?.platformRole === "support")
  ) {
    restaurant.status = body.status;
    if (body.status === "Suspended") restaurant.isPublished = false;
  }

  restaurant.updatedAt = new Date().toISOString();
  persistStore(store);

  return NextResponse.json({ restaurant });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const user = await getSessionUser();
  if (!user || user.platformRole !== "owner") {
    return NextResponse.json({ error: "Platform owner access required." }, { status: 403 });
  }

  const store = getStore();
  const target = store.restaurants.find((r) => r.slug === slug);
  if (!target) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  store.restaurants = store.restaurants.filter((r) => r.id !== target.id);
  store.branches = store.branches.filter((b) => b.restaurantId !== target.id);
  store.categories = store.categories.filter((c) => c.restaurantId !== target.id);
  store.products = store.products.filter((p) => p.restaurantId !== target.id);
  store.domains = store.domains.filter((d) => d.restaurantId !== target.id);
  store.qrCodes = store.qrCodes.filter((q) => q.restaurantId !== target.id);
  store.members = store.members.filter((m) => m.restaurantId !== target.id);
  store.orders = store.orders.filter((o) => o.restaurantId !== target.id);
  persistStore(store);

  return NextResponse.json({ ok: true });
}
