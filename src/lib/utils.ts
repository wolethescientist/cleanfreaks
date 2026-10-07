import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-US")}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
