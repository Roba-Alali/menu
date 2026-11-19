import PublicRestaurantMenu from "@/components/menu/PublicRestaurantMenu";
import { getRestaurantBundle } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string; branch?: string; table?: string }>;
}) {
  const query = await searchParams;
  const slug = query.tenant || "the-house";
  const bundle = getRestaurantBundle(slug) || getRestaurantBundle("the-house");

  if (!bundle) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b0b] text-sm text-[#9aa6a1]">
        Demo restaurant unavailable.
      </main>
    );
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
