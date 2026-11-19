import { redirect } from "next/navigation";
import SuperAdminConsole, {
  type SuperAdminInitialData,
} from "@/components/admin/SuperAdminConsole";
import { getSessionUser } from "@/lib/auth";
import { getStore, toPublicUser } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || (user.platformRole !== "owner" && user.platformRole !== "support")) {
    redirect("/login?next=/admin");
  }

  const store = getStore();
  const restaurants = store.restaurants.map((r) => {
    const restOrders = store.orders.filter((o) => o.restaurantId === r.id);
    const restProducts = store.products.filter((p) => p.restaurantId === r.id);
    const restBranches = store.branches.filter((b) => b.restaurantId === r.id);
    const restDomains = store.domains.filter((d) => d.restaurantId === r.id);
    const restMembers = store.members.filter((m) => m.restaurantId === r.id);
    const revenue = restOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ...r,
      productCount: restProducts.length,
      branchCount: restBranches.length,
      orderCount: restOrders.length,
      revenue: Number(revenue.toFixed(2)),
      primaryDomain: restDomains[0]?.hostname || `${r.slug}.qlub.app`,
      domainVerified: restDomains[0]?.isVerified ?? false,
      ownerEmail: restMembers.find((m) => m.role === "admin")?.email || "—",
    };
  });

  const initialData: SuperAdminInitialData = {
    currentUser: user,
    restaurants,
    platformUsers: store.users
      .filter((u) => Boolean(u.platformRole))
      .map(toPublicUser),
    allMembers: store.members.map((m) => {
      const rest = store.restaurants.find((r) => r.id === m.restaurantId);
      return {
        ...m,
        restaurantName: rest?.name || "Unknown",
        restaurantSlug: rest?.slug || "",
      };
    }),
    settings: store.settings,
    stats: {
      totalRestaurants: store.restaurants.length,
      publishedMenus: store.restaurants.filter((r) => r.isPublished).length,
      totalOrders: store.orders.length,
      totalProducts: store.products.length,
      totalRevenue: Number(
        store.orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0)
          .toFixed(2)
      ),
    },
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  };

  return <SuperAdminConsole initialData={initialData} />;
}
