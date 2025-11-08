export type SubscriptionPlan = "free" | "premium" | "business"
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "trial"
export type UserRole = "client" | "craftsman"

export interface PlanFeatures {
  // Common features
  jobPostingLimit: number | "unlimited"
  offersPerJob: number | "unlimited"
  monthlyOfferLimit: number | "unlimited"
  priorityPlacement: boolean
  advancedFilters: boolean
  support: "basic" | "priority" | "dedicated"

  // Client-specific
  platformFees: boolean
  multipleUsers: boolean
  projectManagement: boolean
  analytics: boolean
  apiAccess: boolean

  // Craftsman-specific
  commission: number
  portfolioSize: number | "unlimited"
  earlyAccess: boolean
  teamMembers: number
}

export const CLIENT_PLANS: Record<
  SubscriptionPlan,
  {
    name: string
    price: number
    features: Partial<PlanFeatures>
  }
> = {
  free: {
    name: "Basis",
    price: 0,
    features: {
      jobPostingLimit: "unlimited",
      offersPerJob: 5,
      priorityPlacement: false,
      advancedFilters: false,
      support: "basic",
      platformFees: true,
      multipleUsers: false,
      projectManagement: false,
      analytics: false,
      apiAccess: false,
    },
  },
  premium: {
    name: "Premium",
    price: 9.99,
    features: {
      jobPostingLimit: "unlimited",
      offersPerJob: "unlimited",
      priorityPlacement: true,
      advancedFilters: true,
      support: "priority",
      platformFees: false,
      multipleUsers: false,
      projectManagement: false,
      analytics: false,
      apiAccess: false,
    },
  },
  business: {
    name: "Business",
    price: 29.99,
    features: {
      jobPostingLimit: "unlimited",
      offersPerJob: "unlimited",
      priorityPlacement: true,
      advancedFilters: true,
      support: "dedicated",
      platformFees: false,
      multipleUsers: true,
      projectManagement: true,
      analytics: true,
      apiAccess: true,
    },
  },
}

export const CRAFTSMAN_PLANS: Record<
  SubscriptionPlan,
  {
    name: string
    price: number
    commission: number
    features: Partial<PlanFeatures>
  }
> = {
  free: {
    name: "Basis",
    price: 0,
    commission: 8,
    features: {
      monthlyOfferLimit: 10,
      portfolioSize: 5,
      priorityPlacement: false,
      advancedFilters: false,
      support: "basic",
      earlyAccess: false,
      teamMembers: 1,
    },
  },
  premium: {
    name: "Professional",
    price: 19.99,
    commission: 5,
    features: {
      monthlyOfferLimit: "unlimited",
      portfolioSize: "unlimited",
      priorityPlacement: true,
      advancedFilters: true,
      support: "priority",
      earlyAccess: true,
      teamMembers: 1,
    },
  },
  business: {
    name: "Business",
    price: 49.99,
    commission: 3,
    features: {
      monthlyOfferLimit: "unlimited",
      portfolioSize: "unlimited",
      priorityPlacement: true,
      advancedFilters: true,
      support: "dedicated",
      earlyAccess: true,
      teamMembers: 10,
    },
  },
}

export function getPlanFeatures(plan: SubscriptionPlan, role: UserRole): Partial<PlanFeatures> {
  return role === "client" ? CLIENT_PLANS[plan].features : CRAFTSMAN_PLANS[plan].features
}

export function canUserPerformAction(userPlan: SubscriptionPlan, action: string, currentUsage?: number): boolean {
  const plans = CLIENT_PLANS
  const features = plans[userPlan].features

  switch (action) {
    case "post_job":
      return (
        features.jobPostingLimit === "unlimited" ||
        (typeof features.jobPostingLimit === "number" && (currentUsage || 0) < features.jobPostingLimit)
      )
    case "receive_unlimited_offers":
      return features.offersPerJob === "unlimited"
    case "priority_placement":
      return features.priorityPlacement || false
    case "advanced_filters":
      return features.advancedFilters || false
    default:
      return false
  }
}

export function canCraftsmanPerformAction(
  craftsmanPlan: SubscriptionPlan,
  action: string,
  currentUsage?: number,
): boolean {
  const plans = CRAFTSMAN_PLANS
  const features = plans[craftsmanPlan].features

  switch (action) {
    case "submit_offer":
      return (
        features.monthlyOfferLimit === "unlimited" ||
        (typeof features.monthlyOfferLimit === "number" && (currentUsage || 0) < features.monthlyOfferLimit)
      )
    case "early_access":
      return features.earlyAccess || false
    case "priority_placement":
      return features.priorityPlacement || false
    default:
      return false
  }
}
