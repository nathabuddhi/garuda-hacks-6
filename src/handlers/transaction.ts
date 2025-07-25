import { db } from "@/lib/firebase";
import type { BuyerItem } from "@/types/item";
import type { Transaction } from "@/types/transaction";
import type { User } from "@/types/user";
import type { Response } from "@/types/util";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

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
      status: "pending_confirmation",
      pick_up_location: curr_seller_profile.addresses[0],
      submitted_at: Timestamp.now(),
      item_id: item_id,
      weight: quantity,
    };

    await setDoc(doc(db, "transactions"), newTransaction);

    return {
      success: true,
      message: "Transaction created successfully",
      data: newTransaction as Transaction,
    };
  } catch {
    return {
      success: false,
      message: "Failed to create new transaction",
    };
  }
};
