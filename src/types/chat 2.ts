import type { Timestamp } from "firebase/firestore";

export interface ChatRoom {
    id: string;
    name: string;
    participants: string[];
    is_active: boolean;
}

export interface Message {
    id: string;
    chat_room_id: string;
    sender_id: string;
    content: string;
    timestamp: Timestamp;
}
