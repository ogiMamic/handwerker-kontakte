export type SubscriptionPlan = "free" | "premium"
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "trial"
export type UserRole = "client" | "craftsman"

export interface PlanFeatures {
  contactVisible: boolean
  portfolioSize: number | "unlimited"
  priorityPlacement: boolean
  verifiedBadge: boolean
  whatsappButton: boolean
  support: "basic" | "priority"
}

export const CRAFTSMAN_PLANS: Record<
  SubscriptionPlan,
  {
    name: string
    price: number
    features: PlanFeatures
    description: string
  }
> = {
  free: {
    name: "Basis",
    price: 0,
    description: "Grundprofil — ideal zum Ausprobieren",
    features: {
      contactVisible: false,
      portfolioSize: 3,
      priorityPlacement: false,
      verifiedBadge: false,
      whatsappButton: false,
      support: "basic",
    },
  },
  premium: {
    name: "Premium",
    price: 14.99,
    description: "Volle Sichtbarkeit — Kunden kontaktieren Sie direkt",
    features: {
      contactVisible: true,
      portfolioSize: "unlimited",
      priorityPlacement: true,
      verifiedBadge: true,
      whatsappButton: true,
      support: "priority",
    },
  },
}

export function getPlanFeatures(plan: SubscriptionPlan): PlanFeatures {
  return CRAFTSMAN_PLANS[plan].features
}

export function isPremium(plan: SubscriptionPlan | string | undefined | null): boolean {
  return plan === "premium"
}
