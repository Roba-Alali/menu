import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canUserAccessRestaurant, getStore, persistStore } from "@/lib/store";
import type { Branch } from "@/lib/types";

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

  const body = (await req.json()) as {
    name?: string;
    address?: string;
    phone?: string;
  };
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Branch name is required." }, { status: 400 });
  }

  const branch: Branch = {
    id: `br-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId: restaurant.id,
    name: body.name.trim(),
    address: body.address?.trim() || "",
    phone: body.phone?.trim() || "",
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  store.branches.push(branch);
  persistStore(store);

  return NextResponse.json({ branch }, { status: 201 });
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

  const body = (await req.json()) as Partial<Branch> & { id?: string };
  const branch = store.branches.find(
    (b) => b.id === body.id && b.restaurantId === restaurant.id
  );
  if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

  if (body.name !== undefined) branch.name = body.name.trim() || branch.name;
  if (body.address !== undefined) branch.address = body.address;
  if (body.phone !== undefined) branch.phone = body.phone;
  if (body.isActive !== undefined) branch.isActive = Boolean(body.isActive);
  persistStore(store);

  return NextResponse.json({ branch });
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
  if (!id) return NextResponse.json({ error: "Missing branch id" }, { status: 400 });

  store.branches = store.branches.filter(
    (b) => !(b.id === id && b.restaurantId === restaurant.id)
  );
  persistStore(store);

  return NextResponse.json({ ok: true });
}
