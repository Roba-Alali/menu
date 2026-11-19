import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createRestaurantWithOwner, getStore } from "@/lib/store";
import type { PlanTier, TenantStatus } from "@/lib/types";

export async function GET() {
  const store = getStore();
  const user = await getSessionUser();
  const isPlatform = user?.platformRole === "owner" || user?.platformRole === "support";

  const visible = store.restaurants
    .filter((r) => {
      if (isPlatform) return true;
      if (r.isPublished) return true;
      if (!user) return false;
      return store.members.some((m) => m.restaurantId === r.id && m.userId === user.id);
    })
    .map((r) => ({
      ...r,
      productCount: store.products.filter((p) => p.restaurantId === r.id).length,
      orderCount: store.orders.filter((o) => o.restaurantId === r.id).length,
    }));

  return NextResponse.json({ restaurants: visible });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.platformRole !== "owner" && user.platformRole !== "support")) {
    return NextResponse.json(
      { error: "Only platform administrators can provision new restaurants." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      name?: string;
      nameAr?: string;
      slug?: string;
      description?: string;
      primaryColor?: string;
      secondaryColor?: string;
      currency?: string;
      defaultLocale?: "en" | "ar";
      plan?: PlanTier;
      status?: TenantStatus;
      ownerName?: string;
      ownerEmail?: string;
      ownerPassword?: string;
      branchName?: string;
      customDomain?: string;
    };

    if (!body.name?.trim() || !body.ownerEmail?.trim()) {
      return NextResponse.json(
        { error: "Restaurant name and owner email are required." },
        { status: 400 }
      );
    }

    const provisioned = createRestaurantWithOwner({
      name: body.name,
      nameAr: body.nameAr,
      slug: body.slug,
      description: body.description,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      currency: body.currency,
      defaultLocale: body.defaultLocale,
      plan: body.plan,
      status: body.status,
      ownerName: body.ownerName || `${body.name} Owner`,
      ownerEmail: body.ownerEmail,
      ownerPassword: body.ownerPassword,
      branchName: body.branchName,
      customDomain: body.customDomain,
    });

    return NextResponse.json(provisioned, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create restaurant." },
      { status: 400 }
    );
  }
}
