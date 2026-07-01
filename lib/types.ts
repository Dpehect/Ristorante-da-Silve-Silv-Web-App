// Core types for da Silve — clean, explicit, and used everywhere.

export interface Dish {
  id: string;
  nameIt: string;
  nameEn: string;
  description: string;
  diet: ("vegetarian" | "seafood" | "vegan")[];
  note?: string;
}

export interface MenuCategory {
  id: string;
  name: string;       // Italian name e.g. "Antipasti"
  english: string;    // e.g. "Starters"
  dishes: Dish[];
}

export interface MenuData {
  season: string;
  lastUpdated: string;
  categories: MenuCategory[];
}

export interface Reservation {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm
  guests: number;
  message: string;
  dietary: string;
  submittedAt: string; // ISO string
}

export type ReservationInput = Omit<Reservation, "id" | "submittedAt">;

// For the admin view
export interface AdminReservationView extends Reservation {}
