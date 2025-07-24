import type { Address } from "@/types/user";

export interface Driver {
    id: string;
    name: string;
    phone: string;
    is_active: boolean;
}

export interface Delivery {
    id: string;
    transaction_id: string;
    driver_id: string;
    status: "pending_pickup" | "in_transit" | "completed" | "cancelled";
    type: "to_warehouse" | "from_warehouse" | "seller_to_buyer";
    pickup_location: Address;
    delivery_location: Address;
}
