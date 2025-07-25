import type { Delivery } from "@/types/delivery";
import type { Timestamp } from "firebase/firestore";
import type { Address } from "@/types/user";

export interface Transaction {
  seller_id: string;
  is_donation: boolean;
  receiver_id: string;
  status:
    | "pending_confirmation"
    | "pending_pickup"
    | "assigned_pickup"
    | "picked_up"
    | "completed"
    | "rejected";

  status_notes?: string;

  pick_up_location: Address;
  delivery_details?: Delivery;

  submitted_at: Timestamp;
  assigned_at?: Timestamp;
  picked_up_at?: Timestamp;
  completed_at?: Timestamp;

  item_id: string;
  item_name: string;
  weight: number;
  curr_buyer_price: number;
  customer_price?: number;
  images?: string[];
}
