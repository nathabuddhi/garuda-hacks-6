import { db } from "@/lib/firebase";
import type { Item } from "@/types/item";
import { collection, getDocs } from "firebase/firestore";

export const getBaseItems = async (): Promise<Item[]> => {
  try {
    const baseItems = await getDocs(collection(db, "base_items"));
    return baseItems.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Item, "id">),
    }));
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items");
  }
};
