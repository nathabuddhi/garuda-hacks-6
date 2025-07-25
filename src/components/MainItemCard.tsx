import { Card, CardContent } from "@/components/ui/card";
import type { BuyerItem, Item } from "@/types/item";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthUser } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  fetchActiveBuyers,
  getBuyerItemDetails,
  updateBuyerItem,
} from "@/handlers/item";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useJsApiLoader } from "@react-google-maps/api";

export default function MainItemCard({ item }: { item: Item }) {
  const navigate = useNavigate();
  const [price, setPrice] = useState<number>(-1);
  const { userProfile } = useAuthUser({
    redirectIfNoUser: true,
  });
  const [buyerItem, setBuyerItem] = useState<BuyerItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [closestBuyerId, setClosestBuyerId] = useState<string>("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    setPrice(0);

    async function fetchBuyerItem() {
      if (!item || !userProfile?.uid || userProfile?.role !== "buyer") return;

      try {
        const buyerItem: BuyerItem | null = await getBuyerItemDetails(
          item.id,
          userProfile?.uid
        );
        setBuyerItem(buyerItem);
      } catch (error) {
        console.error("Error fetching buyer item:", error);
      }
    }

    async function fetchAndProcessActiveBuyers() {
      if (!item?.id || !userProfile) return;

      try {
        const buyers = await fetchActiveBuyers(item.id);

        const userLat = userProfile.addresses![0].geo_location.lat;
        const userLon = userProfile.addresses![0].geo_location.long;
        const origin = `${userLat},${userLon}`;

        const destinations = buyers
          .filter((buyer) => buyer.addresses[0].geo_location)
          .map(
            (buyer) =>
              `${buyer.addresses[0].geo_location.lat},${buyer.addresses[0].geo_location.long}`
          );

        if (destinations.length === 0) return;

        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true,
            avoidHighways: true,
          },
          async (response, status) => {
            if (status === "OK" && response!.rows.length) {
              const results = response!.rows[0].elements;
              let shortestDistance = Infinity;
              let closestBuyerIndex = -1;

              results.forEach((element, index) => {
                if (element.status === "OK") {
                  const distance = element.distance.value / 1000;
                  if (distance < shortestDistance) {
                    shortestDistance = distance;
                    closestBuyerIndex = index;
                  }
                }
              });

              if (closestBuyerIndex !== -1) {
                const closestBuyer = buyers[closestBuyerIndex];
                const buyerItem = await getBuyerItemDetails(
                  item.id,
                  closestBuyer.uid
                );
                setBuyerItem(buyerItem);
                if (buyerItem) {
                  setPrice(buyerItem.price * 0.8);
                  setClosestBuyerId(closestBuyer.uid);
                }
                console.log("Closest buyer distance:", shortestDistance, "km");
              }
            } else {
              console.error("Distance Matrix request failed:", status);
            }
          }
        );
      } catch (error) {
        console.error("Error processing active buyers:", error);
      }
    }

    fetchBuyerItem();
    fetchAndProcessActiveBuyers();
  }, [item, userProfile]);

  async function handleAcceptingToggle(checked: boolean) {
    if (!buyerItem || !userProfile?.uid || userProfile?.role !== "buyer")
      return;

    setBuyerItem((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        active: checked,
      };
    });

    setDialogOpen(true);
  }

  async function handleSaveChanges() {
    if (!buyerItem || !userProfile || userProfile.role !== "buyer") return;

    try {
      await updateBuyerItem(
        buyerItem.item_id,
        userProfile?.uid,
        buyerItem.price,
        buyerItem.active
      );
    } catch (error) {
      toast.error(
        "Failed to update item details: " +
          (error instanceof Error ? "" + error.message : "Unknown error")
      );
    } finally {
      setDialogOpen(false);
    }
  }

  function handleRedirect() {
    if (price <= 0) {
      toast.error("Price is loading or there are no active buyers near you.");
      return;
    }
    if (userProfile && userProfile.role === "seller") {
      navigate("/item", { state: { item, price, closestBuyerId } });
    }
  }

  return (
    <>
      <Card
        className={`w-full max-w-sm rounded-2xl shadow-md overflow-hidden p-0 transition-transform hover:cursor-pointer ${
          userProfile?.role === "seller" && "hover:scale-105"
        }`}
        onClick={handleRedirect}>
        <div className="w-full h-48 relative">
          <img src={item.image_url} alt={item.name} className="rounded-t-2xl" />
        </div>
        <CardContent className="p-4 space-y-2 mt-5">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">
            Minimum: <span className="font-medium">{item.min}</span>
          </p>
          <p className="text-lg font-bold text-green-700">
            Rp.{" "}
            {userProfile?.role === "seller"
              ? price.toLocaleString("idr")
              : buyerItem?.price.toLocaleString("idr")}{" "}
            /{" "}
            {item.min.toLowerCase().includes("kg")
              ? "kg"
              : item.min.toLowerCase().includes("liter")
              ? "liter"
              : ""}
          </p>
          {userProfile?.role === "buyer" && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 mt-4">
                <Switch
                  checked={buyerItem?.active}
                  onCheckedChange={handleAcceptingToggle}
                  className="hover:cursor-pointer"
                />
                <span
                  className={`text-xs text-muted-foreground px-1.5 py-0.5  ${
                    buyerItem?.active
                      ? "bg-green-600 rounded-full text-white"
                      : "bg-gray-600 rounded-full text-white"
                  }`}>
                  {buyerItem?.active ? "Accepting" : "Not Accepting"}
                </span>
              </div>

              {buyerItem?.active && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger>
                    <Button size={"icon"} variant={"ghost"}>
                      <Edit />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Label>Set {item.name} Price</Label>
                    <Input
                      type="number"
                      value={buyerItem.price}
                      onChange={(e) =>
                        setBuyerItem((prev) =>
                          prev
                            ? { ...prev, price: Number(e.target.value) }
                            : null
                        )
                      }
                    />
                    <Button onClick={handleSaveChanges} className="bg-main">
                      Set Price
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
