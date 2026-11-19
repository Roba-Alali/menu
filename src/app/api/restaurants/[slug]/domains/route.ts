import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canUserAccessRestaurant, getStore, persistStore } from "@/lib/store";
import type { RestaurantDomain } from "@/lib/types";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const store = getStore();
  const restaurant = store.restaurants.find((r) => r.slug === slug);
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await getSessionUser();
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin", "manager"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await req.json()) as { hostname?: string };
  const hostname = (body.hostname || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!hostname || !hostname.includes(".")) {
    return NextResponse.json({ error: "Enter a valid hostname (e.g. menu.yourbrand.com)." }, { status: 400 });
  }
  if (store.domains.some((d) => d.hostname.toLowerCase() === hostname)) {
    return NextResponse.json({ error: "Hostname is already registered." }, { status: 409 });
  }

  const domain: RestaurantDomain = {
    id: `dom-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId: restaurant.id,
    hostname,
    isVerified: false,
    createdAt: new Date().toISOString(),
  };
  store.domains.push(domain);
  persistStore(store);

  return NextResponse.json({ domain }, { status: 201 });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const store = getStore();
  const restaurant = store.restaurants.find((r) => r.slug === slug);
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await getSessionUser();
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin", "manager"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await req.json()) as { id?: string; isVerified?: boolean };
  const domain = store.domains.find(
    (d) => d.id === body.id && d.restaurantId === restaurant.id
  );
  if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

  domain.isVerified = body.isVerified ?? true;
  persistStore(store);

  return NextResponse.json({ domain });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const store = getStore();
  const restaurant = store.restaurants.find((r) => r.slug === slug);
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await getSessionUser();
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin", "manager"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing domain id" }, { status: 400 });

  store.domains = store.domains.filter(
    (d) => !(d.id === id && d.restaurantId === restaurant.id)
  );
  persistStore(store);

  return NextResponse.json({ ok: true });
}
