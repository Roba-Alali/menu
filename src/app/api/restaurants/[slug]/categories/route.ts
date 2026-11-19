import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canUserAccessRestaurant, getStore, persistStore } from "@/lib/store";
import type { MenuCategory } from "@/lib/types";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const store = getStore();
  const restaurant = store.restaurants.find((r) => r.slug === slug);
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await getSessionUser();
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin", "manager", "editor"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await req.json()) as {
    name?: string;
    nameAr?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  };
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }

  const existing = store.categories.filter((c) => c.restaurantId === restaurant.id);
  const category: MenuCategory = {
    id: `cat-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId: restaurant.id,
    name: body.name.trim(),
    nameAr: body.nameAr?.trim() || body.name.trim(),
    description: body.description?.trim() || "",
    sortOrder: body.sortOrder ?? existing.length + 1,
    isActive: body.isActive ?? true,
    createdAt: new Date().toISOString(),
  };
  store.categories.push(category);
  persistStore(store);

  return NextResponse.json({ category }, { status: 201 });
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
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin", "manager", "editor"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await req.json()) as Partial<MenuCategory> & { id?: string };
  const category = store.categories.find(
    (c) => c.id === body.id && c.restaurantId === restaurant.id
  );
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  if (body.name !== undefined) category.name = body.name.trim() || category.name;
  if (body.nameAr !== undefined) category.nameAr = body.nameAr;
  if (body.description !== undefined) category.description = body.description;
  if (body.sortOrder !== undefined) category.sortOrder = Number(body.sortOrder);
  if (body.isActive !== undefined) category.isActive = Boolean(body.isActive);
  persistStore(store);

  return NextResponse.json({ category });
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
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin", "manager", "editor"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing category id" }, { status: 400 });

  store.categories = store.categories.filter(
    (c) => !(c.id === id && c.restaurantId === restaurant.id)
  );
  store.products.forEach((p) => {
    if (p.restaurantId === restaurant.id && p.categoryId === id) {
      p.categoryId = null;
    }
  });
  persistStore(store);

  return NextResponse.json({ ok: true });
}
