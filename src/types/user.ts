import { Timestamp } from "firebase/firestore";

export interface User {
    uid: string;
    username: string;
    email: string;
    phone?: string;
    addresses?: Address[];
    profile_image?: string;
    first_name: string,
    last_name: string,
    birthdate?: Timestamp;
    role: "seller" | "buyer" | "admin";
    created_at: Timestamp;
}

export interface Address {
    address_id: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    geo_location: LatLong;
    notes?: string;
}

export interface Orphanage {
    id: string;
    name: string;
    address: Address;
    contact_person: string;
    phone: string;
    email?: string;
    description?: string;
    created_at: Timestamp;
}

interface LatLong {
    lat: number;
    long: number;
}
