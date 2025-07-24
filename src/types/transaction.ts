import type { Delivery } from "@/types/delivery";
import type { Timestamp } from "firebase/firestore";

export interface Transaction {
    transaction_id: string;
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

    pick_up_location: string;
    delivery_details?: Delivery;

    submitted_at: Timestamp;
    assigned_at?: Timestamp;
    picked_up_at?: Timestamp;
    completed_at?: Timestamp;

    transaction_items: TransactionItem[];
}

export interface TransactionItem {
    item_id: string;
    status:
        | "pending"
        | "confirmed"
        | "rejected"
        | "completed"
        | "stored"
        | "donated";
    weight: number;
    price?: number;
    images?: string[];
}
