import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dodajemo ostale utility funkcije ako postoje
export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("de-DE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

// Osiguravamo da je cn funkcija ispravno exportovana
export { cn as classNames }
