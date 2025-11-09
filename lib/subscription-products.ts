export interface SubscriptionProduct {
  id: string
  planId: "free" | "premium" | "professional" | "business"
  role: "client" | "handwerker"
  name: string
  description: string
  priceInCents: number
  interval: "month"
}

export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  // Client Plans
  {
    id: "client-free",
    planId: "free",
    role: "client",
    name: "Basis (Klient)",
    description: "Kostenloser Plan für Kunden",
    priceInCents: 0,
    interval: "month",
  },
  {
    id: "client-premium",
    planId: "premium",
    role: "client",
    name: "Premium (Klient)",
    description: "Erweiterte Funktionen für Kunden",
    priceInCents: 999, // €9.99
    interval: "month",
  },
  {
    id: "client-business",
    planId: "business",
    role: "client",
    name: "Business (Klient)",
    description: "Vollständige Lösung für Unternehmen",
    priceInCents: 2999, // €29.99
    interval: "month",
  },
  // Handwerker Plans
  {
    id: "handwerker-free",
    planId: "free",
    role: "handwerker",
    name: "Basis (Handwerker)",
    description: "Kostenloser Plan für Handwerker (8% Provision)",
    priceInCents: 0,
    interval: "month",
  },
  {
    id: "handwerker-professional",
    planId: "professional",
    role: "handwerker",
    name: "Professional (Handwerker)",
    description: "Erweiterte Funktionen für Handwerker (5% Provision)",
    priceInCents: 1999, // €19.99
    interval: "month",
  },
  {
    id: "handwerker-business",
    planId: "business",
    role: "handwerker",
    name: "Business (Handwerker)",
    description: "Vollständige Lösung für Handwerker-Teams (3% Provision)",
    priceInCents: 4999, // €49.99
    interval: "month",
  },
]

export function getSubscriptionProduct(productId: string) {
  return SUBSCRIPTION_PRODUCTS.find((p) => p.id === productId)
}
