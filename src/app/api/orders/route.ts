import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canUserAccessRestaurant, createValidatedOrder, getStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const store = getStore();
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (slug) {
    const rest = store.restaurants.find((r) => r.slug === slug);
    if (!rest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!canUserAccessRestaurant(user, rest.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const orders = store.orders
      .filter((o) => o.restaurantId === rest.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ orders });
  }

  if (user.platformRole !== "owner" && user.platformRole !== "support") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({ orders: store.orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      restaurantId?: string;
      branchId?: string | null;
      customerName?: string;
      customerPhone?: string;
      tableLabel?: string;
      orderType?: "dine_in" | "pickup";
      notes?: string;
      items?: Array<{
        productId: string;
        quantity: number;
        selectedOptionValueIds?: string[];
      }>;
    };

    if (!body.restaurantId || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Restaurant and at least one item are required." },
        { status: 400 }
      );
    }

    const order = createValidatedOrder({
      restaurantId: body.restaurantId,
      branchId: body.branchId,
      customerName: body.customerName || "Table Guest",
      customerPhone: body.customerPhone || "",
      tableLabel: body.tableLabel,
      orderType: body.orderType === "pickup" ? "pickup" : "dine_in",
      notes: body.notes,
      items: body.items,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to place order." },
      { status: 400 }
    );
  }
}
