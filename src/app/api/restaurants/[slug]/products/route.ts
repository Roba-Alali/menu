import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canUserAccessRestaurant, getStore, persistStore } from "@/lib/store";
import type { Product, ProductOption } from "@/lib/types";

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
    categoryId?: string | null;
    name?: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    imageUrl?: string;
    price?: number;
    compareAtPrice?: number | null;
    isAvailable?: boolean;
    isFeatured?: boolean;
    allergens?: string[];
    options?: ProductOption[];
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const existing = store.products.filter((p) => p.restaurantId === restaurant.id);
  const product: Product = {
    id: `prod-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId: restaurant.id,
    categoryId: body.categoryId || null,
    name: body.name.trim(),
    nameAr: body.nameAr?.trim() || body.name.trim(),
    description: body.description?.trim() || "",
    descriptionAr: body.descriptionAr?.trim() || body.description?.trim() || "",
    imageUrl: body.imageUrl?.trim() || "/images/dish_truffle_pasta.jpg",
    price: Math.max(0, Number(body.price) || 0),
    compareAtPrice:
      body.compareAtPrice !== undefined && body.compareAtPrice !== null
        ? Number(body.compareAtPrice)
        : null,
    isAvailable: body.isAvailable ?? true,
    isFeatured: body.isFeatured ?? false,
    sortOrder: existing.length + 1,
    allergens: Array.isArray(body.allergens) ? body.allergens : [],
    options: Array.isArray(body.options) ? body.options : [],
    createdAt: now,
    updatedAt: now,
  };
  store.products.push(product);
  persistStore(store);

  return NextResponse.json({ product }, { status: 201 });
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

  const body = (await req.json()) as Partial<Product> & { id?: string };
  const product = store.products.find(
    (p) => p.id === body.id && p.restaurantId === restaurant.id
  );
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  if (body.categoryId !== undefined) product.categoryId = body.categoryId;
  if (body.name !== undefined) product.name = body.name.trim() || product.name;
  if (body.nameAr !== undefined) product.nameAr = body.nameAr;
  if (body.description !== undefined) product.description = body.description;
  if (body.descriptionAr !== undefined) product.descriptionAr = body.descriptionAr;
  if (body.imageUrl !== undefined) product.imageUrl = body.imageUrl;
  if (body.price !== undefined) product.price = Math.max(0, Number(body.price) || 0);
  if (body.compareAtPrice !== undefined) product.compareAtPrice = body.compareAtPrice;
  if (body.isAvailable !== undefined) product.isAvailable = Boolean(body.isAvailable);
  if (body.isFeatured !== undefined) product.isFeatured = Boolean(body.isFeatured);
  if (body.sortOrder !== undefined) product.sortOrder = Number(body.sortOrder);
  if (body.allergens !== undefined) product.allergens = body.allergens;
  if (body.options !== undefined) product.options = body.options;
  product.updatedAt = new Date().toISOString();
  persistStore(store);

  return NextResponse.json({ product });
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
  if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

  store.products = store.products.filter(
    (p) => !(p.id === id && p.restaurantId === restaurant.id)
  );
  persistStore(store);

  return NextResponse.json({ ok: true });
}
