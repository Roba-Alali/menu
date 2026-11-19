import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canUserAccessRestaurant, getStore, updateOrderStatus } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

const ALLOWED_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const store = getStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const user = await getSessionUser();
  if (!canUserAccessRestaurant(user, order.restaurantId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await req.json()) as { status?: OrderStatus };
  if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  const updated = updateOrderStatus(id, body.status);
  return NextResponse.json({ order: updated });
}
