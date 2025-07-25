import type { Timestamp } from "firebase/firestore";

export interface Item {
  id: string;
  name: string;
  description: string;
  condition_accepted: string[];
  condition_rejected: string[];
  min: string;
  image_url: string;
  created_at: Timestamp;
}

export interface BuyerItem {
  item_id: string;
  price: number;
  active: boolean;
  updated_at: Timestamp;
}
