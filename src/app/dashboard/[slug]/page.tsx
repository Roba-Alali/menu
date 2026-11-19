import { notFound, redirect } from "next/navigation";
import RestaurantDashboard from "@/components/dashboard/RestaurantDashboard";
import { getSessionUser } from "@/lib/auth";
import {
  canUserAccessRestaurant,
  getRestaurantBundle,
  getStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=/dashboard/${slug}`);
  }

  const bundle = getRestaurantBundle(slug);
  if (!bundle) {
    notFound();
  }

  if (!canUserAccessRestaurant(user, bundle.restaurant.id)) {
    redirect(`/login?next=/dashboard/${slug}`);
  }

  const store = getStore();
  return (
    <RestaurantDashboard
      initialBundle={bundle}
      currentUser={user}
      cnameTarget={store.settings.defaultCnameTarget}
    />
  );
}
