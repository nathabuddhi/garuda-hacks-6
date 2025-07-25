import type { BuyerItem, Item } from "@/types/item";
import type { User } from "@/types/user";
import type { Response } from "@/types/util";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "@/types/transaction";

export const createNewTransaction = async (
  seller_id: string,
  buyer_id: string,
  quantity: number,
  item_id: string
): Promise<Response<Transaction>> => {
  try {
    const curr_buyer_item: BuyerItem | null = await getDoc(
      doc(db, "users", buyer_id, "items", item_id)
    ).then((doc) => {
      if (doc.exists()) {
        return doc.data() as BuyerItem;
      } else {
        return null;
      }
    });

    const curr_seller_profile = await getDoc(doc(db, "users", seller_id)).then(
      (doc) => {
        if (doc.exists()) {
          return doc.data() as User;
        } else {
          return null;
        }
      }
    );

    const base_item = await getDoc(doc(db, "base_items", item_id)).then(
      (doc) => {
        if (doc.exists()) {
          return doc.data() as Item;
        } else {
          return null;
        }
      }
    );

    if (
      !curr_buyer_item ||
      curr_buyer_item.price <= 0 ||
      !curr_buyer_item.active ||
      !curr_seller_profile
    ) {
      return {
        success: false,
        message: "This item cannot be sold at this moment. Please try again.",
      };
    } else if (
      !curr_seller_profile.addresses ||
      curr_seller_profile.addresses.length === 0 ||
      curr_seller_profile.addresses[0] === undefined
    ) {
      return {
        success: false,
        message: "Seller does not have a valid address.",
      };
    }
    const newTransaction: Transaction = {
      seller_id: seller_id,
      is_donation: false,
      receiver_id: buyer_id,
      item_name: base_item?.name || "",
      status: "pending_confirmation",
      pick_up_location: curr_seller_profile.addresses[0],
      submitted_at: Timestamp.now(),
      item_id: item_id,
      weight: quantity,
      curr_buyer_price: curr_buyer_item.price * 0.8,
    };

    const docRef = doc(collection(db, "transactions"));
    const transactionWithId = { ...newTransaction, id: docRef.id };
    await setDoc(docRef, transactionWithId);

    return {
      success: true,
      message: "Transaction created successfully.",
      data: newTransaction as Transaction,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const listenToTransactionsByUserId = (
  user_id: string,
  role: string,
  onData: (transactions: Transaction[]) => void,
  onError?: (error: any) => void
) => {
  const q = query(
    collection(db, "transactions"),
    where(role === "buyer" ? "receiver_id" : "seller_id", "==", user_id)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const transactions: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
      }));
      onData(transactions);
    },
    (error) => {
      console.error("Error listening to transactions:", error);
      onError?.(error);
    }
  );
};
