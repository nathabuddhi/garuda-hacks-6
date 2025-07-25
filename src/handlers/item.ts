import { db } from "@/lib/firebase";
import type { BuyerItem, Item } from "@/types/item";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";

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

export const getItemDetails = async (itemId: string): Promise<Item | null> => {
  try {
    const baseItem = await getDoc(doc(db, "base_items", itemId));
    return baseItem.data() as Item | null;
  } catch (error) {
    console.error("Error fetching item details:", error);
    throw new Error("Failed to fetch item details");
  }
};

export const getBuyerItemDetails = async (
  itemId: string,
  buyerId: string
): Promise<BuyerItem | null> => {
  try {
    const buyerItemDoc = await getDoc(
      doc(db, "users", buyerId, "items", itemId)
    );
    if (buyerItemDoc.exists()) {
      return buyerItemDoc.data() as BuyerItem;
    } else {
      const newBuyerItem: BuyerItem = {
        item_id: itemId,
        price: 0,
        active: false,
        updated_at: Timestamp.now(),
      };

      setDoc(doc(db, "users", buyerId, "items", itemId), newBuyerItem);
      return newBuyerItem;
    }
  } catch (error) {
    console.error("Error fetching buyer item details:", error);
    throw new Error("Failed to fetch buyer item details");
  }
};

export const updateBuyerItem = async (
  itemId: string,
  buyerId: string,
  price: number,
  active: boolean
) => {
  try {
    const buyerItemRef = doc(db, "users", buyerId, "items", itemId);
    const updatedBuyerItem: BuyerItem = {
      item_id: itemId,
      price,
      active,
      updated_at: Timestamp.now(),
    };
    await setDoc(buyerItemRef, updatedBuyerItem, { merge: true });
  } catch (error) {
    console.error("Error updating buyer item:", error);
    throw new Error("Failed to update buyer item");
  }
};
