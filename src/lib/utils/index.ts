import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Rounds a number to 2 decimal places.
// Prevents floating point noise in tax calculations.
export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

// Formats a number as GBP currency string.
// e.g. 1234.56 → "£1,234.56"
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}
