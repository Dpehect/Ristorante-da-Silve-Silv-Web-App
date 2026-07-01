import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Elegant className merger — used throughout the site for clean, conditional styling.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date nicely for humans
export function formatDateHuman(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Format time nicely
export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Generate a simple unique id for reservations
export function generateId(): string {
  return `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Valid time slots for the experience (evening service)
export const TIME_SLOTS = [
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

// Simple validation helpers
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
