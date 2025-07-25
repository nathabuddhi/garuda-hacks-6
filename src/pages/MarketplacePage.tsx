import MainItemCard from "@/components/MainItemCard";
import { getBaseItems } from "@/handlers/item";
import { useAuthUser } from "@/lib/utils";
import type { Item } from "@/types/item";
import { useEffect, useState } from "react";

export default function MarketplacePage() {
  const { user, loading, userProfile } = useAuthUser({
    redirectIfNoUser: true,
  });

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const result = await getBaseItems();
      setItems(result);
    }

    if (!loading) {
      fetchItems();
    }
  }, [loading]);

  if (!loading)
    return (
      <>
        <div className="w-screen min-h-screen bg-main-white flex flex-col justify-center">
          <div className="mt-30 mb-20">
            <h1 className="text-6xl text-gray-800 font-semibold text-center">
              {userProfile?.role === "seller"
                ? "Sell your waste for money!"
                : "Request waste to buy!"}
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-20">
            {items.map((i) => (
              <MainItemCard key={i.id} item={i} />
            ))}
          </div>
        </div>
      </>
    );
}
