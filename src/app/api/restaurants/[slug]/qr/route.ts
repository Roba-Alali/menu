import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canUserAccessRestaurant, getStore, persistStore } from "@/lib/store";
import type { QrCodeRecord } from "@/lib/types";

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
    label?: string;
    branchId?: string | null;
    tableNumber?: string;
  };
  if (!body.label?.trim()) {
    return NextResponse.json({ error: "QR label is required." }, { status: 400 });
  }

  const params = new URLSearchParams();
  if (body.branchId) params.set("branch", body.branchId);
  if (body.tableNumber?.trim()) params.set("table", body.tableNumber.trim());
  const qs = params.toString();

  const qr: QrCodeRecord = {
    id: `qr-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId: restaurant.id,
    branchId: body.branchId || null,
    label: body.label.trim(),
    targetPath: `/r/${restaurant.slug}${qs ? `?${qs}` : ""}`,
    token: crypto.randomBytes(6).toString("hex"),
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  store.qrCodes.push(qr);
  persistStore(store);

  return NextResponse.json({ qrCode: qr }, { status: 201 });
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
  if (!id) return NextResponse.json({ error: "Missing QR id" }, { status: 400 });

  store.qrCodes = store.qrCodes.filter(
    (q) => !(q.id === id && q.restaurantId === restaurant.id)
  );
  persistStore(store);

  return NextResponse.json({ ok: true });
}
