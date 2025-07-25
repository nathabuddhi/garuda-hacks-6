import { LoadingSpinner } from "@/components/SmallComponents";
import { Button } from "@/components/ui/button";
import { getItemDetails } from "@/handlers/item";
import { createNewTransaction } from "@/handlers/transaction";
import { useAuthUser } from "@/lib/utils";
import type { Item } from "@/types/item";
import {
  CheckCircle,
  ChevronLeftIcon,
  Minus,
  Plus,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function ItemDetailPage() {
  const { user, loading } = useAuthUser({
    redirectIfNoUser: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = ("/");
    }
  }, [user, loading]);


  const [item, setItem] = useState<Item | null>(null);
  const navigate = useNavigate();
  const params = useParams();
  const [price, setPrice] = useState(1);
  const [buyerId, setBuyerId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(1);
  const [unit, setUnit] = useState("units");

  useEffect(() => {
    const parseMin = (minString: string) => {
      const parts = minString.split(" ");
      return {
        number: Number.parseInt(parts[0]) || 0,
        unit: parts.slice(1).join(" ") || "units",
      };
    };

    if (item) {
      const { number, unit } = parseMin(item.min);
      setMinQuantity(number);
      setUnit(unit);
      setQuantity(number);
    }
  }, [item]);

  useEffect(() => {
    async function fetchItemDetails() {
      const id = params.id;
      if (!id) {
        navigate("/marketplace");
        return;
      }

      const fetchedItem = await getItemDetails(id);

      setItem(fetchedItem);
    }

    // TODO: CHECK CLOSEST BUYER AND THE PRICE

    if (!loading) {
      fetchItemDetails();
    }
  }, [loading]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(minQuantity, quantity + delta);
    setQuantity(newQuantity);
  };

  const totalPrice = quantity * 5000;

  async function handleItemSale() {
    if (quantity < minQuantity) {
      toast.error(`Minimum quantity is ${minQuantity} ${unit}`);
      return;
    }

    if (!user?.uid) {
      toast.error("User ID is missing.");
      return;
    }
    const response = await createNewTransaction(
      user.uid,
      buyerId,
      quantity,
      item?.id ?? ""
    );

    if (response.success) {
      toast.success("Transaction created successfully!");
    } else {
      toast.error(response.message || "Failed to create transaction.");
    }
  }

  if (loading || !item) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-main-white pt-13">
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" className="mr-2">
          <Link to={"/marketplace"}>
            <ChevronLeftIcon className="h-12 w-12" />
          </Link>
        </Button>
      </div>

      <div className="p-10 flex not-md:flex-col">
        <div className="md:w-2/5 p-5">
          <img
            src={
              item.image_url ||
              "/placeholder.svg?height=300&width=400&query=used cooking oil in pan"
            }
            alt={item.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <div className="md:w-3/5 p-5">
          <p className="text-xl text-main-light font-semibold mb-2">
            WASTE TO SELL
          </p>
          <h1 className="text-2xl font-bold text-gray-600 mb-4">{item.name}</h1>

          <p className="text-lg text-gray-600 mb-2">
            Rp. {price.toLocaleString("idr")} / {unit}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {"Minimum: "}
            {item.min}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= minQuantity}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 text-lg font-medium w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => handleQuantityChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-gray-600">{unit}</span>
            <div className="flex-1 text-right">
              <span className="bg-gray-100 px-4 py-2 rounded-full text-lg font-medium">
                {"Rp "}
                {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <Button
            className="w-full bg-main-light hover:bg-main-light/90 text-white py-3 text-lg font-medium rounded-full"
            size="lg"
            onClick={handleItemSale}>
            SELL
          </Button>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">DETAIL</h2>
            <p className="text-gray-600 mb-4">{item.description}</p>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-main" />
                <span className="font-medium text-gray-700">Accepted</span>
              </div>
              <ul className="space-y-2 ml-7">
                {item.condition_accepted.map((condition, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {"• "}
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-main" />
                <span className="font-medium text-gray-700">Rejected</span>
              </div>
              <ul className="space-y-2 ml-7">
                {item.condition_rejected.map((condition, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {"• "}
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
