import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  canUserAccessRestaurant,
  getStore,
  hashPassword,
  persistStore,
} from "@/lib/store";
import type { RestaurantMember, RestaurantRole } from "@/lib/types";

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
    email?: string;
    fullName?: string;
    role?: RestaurantRole;
  };
  const email = (body.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Staff email is required." }, { status: 400 });
  }

  let account = store.users.find((u) => u.email.toLowerCase() === email);
  let temporaryPassword: string | null = null;
  if (!account) {
    temporaryPassword = `Staff-${crypto.randomBytes(3).toString("hex")}!`;
    account = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      email,
      fullName: body.fullName?.trim() || "Team Member",
      passwordHash: hashPassword(temporaryPassword),
      createdAt: new Date().toISOString(),
    };
    store.users.push(account);
  }

  const existing = store.members.find(
    (m) => m.restaurantId === restaurant.id && m.userId === account!.id
  );
  const role: RestaurantRole = body.role || "staff";
  if (existing) {
    existing.role = role;
    persistStore(store);
    return NextResponse.json({ member: existing, temporaryPassword });
  }

  const member: RestaurantMember = {
    restaurantId: restaurant.id,
    userId: account.id,
    email: account.email,
    fullName: body.fullName?.trim() || account.fullName,
    role,
    createdAt: new Date().toISOString(),
  };
  store.members.push(member);
  persistStore(store);

  return NextResponse.json({ member, temporaryPassword }, { status: 201 });
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
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin"])) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await req.json()) as { userId?: string; role?: RestaurantRole };
  const member = store.members.find(
    (m) => m.restaurantId === restaurant.id && m.userId === body.userId
  );
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
  if (body.role) member.role = body.role;
  persistStore(store);

  return NextResponse.json({ member });
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
  if (!canUserAccessRestaurant(user, restaurant.id, ["admin"])) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  store.members = store.members.filter(
    (m) => !(m.restaurantId === restaurant.id && m.userId === userId)
  );
  persistStore(store);

  return NextResponse.json({ ok: true });
}
