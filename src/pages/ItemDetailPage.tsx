import { getItemDetails } from "@/handlers/item";
import { useAuthUser } from "@/lib/utils";
import type { Item } from "@/types/item";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ItemDetailPage() {
  const { loading } = useAuthUser({
    redirectIfNoUser: true,
  });
  const [item, setItem] = useState<Item | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItemDetails() {
      const itemId = window.location.pathname.split("/").pop();
      if (!itemId) {
        navigate("/marketplace");
        return;
      }

      const fetchedItem = await getItemDetails(itemId);

      setItem(fetchedItem);
    }

    if (!loading) {
      fetchItemDetails();
    }
  }, [loading]);

  if (loading || !item) return <div>Loading...</div>;

  return (
    <div className="w-screen min-h-screen bg-main-white flex flex-col justify-center">
      <h1 className="text-4xl text-gray-800 font-semibold text-center mb-6">
        {item.name}
      </h1>
      <img src={item.image_url} alt={item.name} className="mx-auto mb-4" />
      <p className="text-gray-600 text-center">{item.description}</p>
      <p className="text-gray-500 text-center mt-2">
        Accepted Conditions: {item.condition_accepted.join(", ")}
      </p>
      <p className="text-gray-500 text-center mt-2">
        Rejected Conditions: {item.condition_rejected.join(", ")}
      </p>
    </div>
  );
}
