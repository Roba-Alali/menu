import { notFound } from "next/navigation";
import PublicRestaurantMenu from "@/components/menu/PublicRestaurantMenu";
import { getRestaurantBundle } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PublicMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ branch?: string; table?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const bundle = getRestaurantBundle(slug);

  if (!bundle) {
    notFound();
  }

  return (
    <PublicRestaurantMenu
      restaurant={bundle.restaurant}
      branches={bundle.branches.filter((b) => b.isActive)}
      categories={bundle.categories}
      products={bundle.products}
      initialBranchId={query.branch}
      initialTable={query.table}
    />
  );
}
