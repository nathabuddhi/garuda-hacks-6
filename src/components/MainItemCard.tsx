import { Card, CardContent } from "@/components/ui/card";
import type { Item } from "@/types/item";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function MainItemCard({ item }: { item: Item }) {
  const navigate = useNavigate();
  const [price, setPrice] = useState<number>(-1);
  const [sold, setSold] = useState<number>(0);

  useEffect(() => {
    // TODO: setPrice and setAmountSold
  }, [item]);

  function handleRedirect() {
    navigate("/item/" + item.id);
  }

  return (
    <Card
      className="w-full max-w-sm rounded-2xl shadow-md overflow-hidden p-0 hover:scale-105 transition-transform hover:cursor-pointer"
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
          Rp. {price.toLocaleString("idr")} /{" "}
          {item.min.toLowerCase().includes("kg")
            ? "kg"
            : item.min.toLowerCase().includes("liter")
            ? "liter"
            : ""}
        </p>
        <Badge className="bg-muted text-main text-xs font-medium w-fit">
          {sold} sold
        </Badge>
      </CardContent>
    </Card>
  );
}
