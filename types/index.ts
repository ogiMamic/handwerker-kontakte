export interface Dictionary {
  navigation: {
    home: string
    jobs: string
    craftsmen: string
    howItWorks: string
    pricing: string
    login: string
    signup: string
    dashboard: string
    profile: string
    signIn: string
    signUp: string
    signOut: string
  }
  landing: {
    hero: {
      title: string
      subtitle: string
      clientCta: string
      craftsCta: string
    }
    features: {
      title: string
      subtitle: string
    }
    howItWorks: {
      title: string
      subtitle: string
    }
    testimonials: {
      title: string
      subtitle: string
    }
    cta: {
      title: string
      subtitle: string
      buttonText: string
    }
  }
  footer: {
    about: string
    contact: string
    terms: string
    privacy: string
    imprint: string
    copyright: string
  }
  craftsman: {
    registration: {
      title: string
      description: string
      formTitle: string
      companyName: string
      companyNamePlaceholder: string
      contactPerson: string
      contactPersonPlaceholder: string
      email: string
      phone: string
      address: string
      addressPlaceholder: string
      postalCode: string
      city: string
      cityPlaceholder: string
      description: string
      descriptionPlaceholder: string
      skills: string
      skillsPlaceholder: string
      skillsDescription: string
      hourlyRate: string
      hourlyRateDescription: string
      termsText: string
      terms: string
      andText: string
      privacy: string
      submit: string
      submitting: string
      successTitle: string
      successMessage: string
      errorTitle: string
      errorMessage: string
      progress: string
    }
    skills: {
      renovation: string
      installation: string
      plumbing: string
      electrical: string
      painting: string
      tiling: string
      carpentry: string
      roofing: string
      gardening: string
      moving: string
    }
  }
  dashboard: {
    welcome: string
    overview: string
    clientMode: string
    craftsmanMode: string
    incompleteProfile: string
    completeProfileText: string
    completeProfileButton: string
    switchingMode: string
    tabs: {
      overview: string
      myJobs: string
      myProjects: string
      offers: string
      myOffers: string
    }
    metrics: {
      totalJobs: string
      totalProjects: string
      openJobs: string
      activeProjects: string
      totalOffers: string
      pendingOffers: string
    }
    offerStatus: {
      pending: string
      accepted: string
      rejected: string
      withdrawn: string
    }
    toast: {
      profileMissingTitle: string
      profileMissingDescription: string
      tourStartedTitle: string
      tourStartedDescription: string
    }
    tooltip: {
      switchMode: string
      completeProfile: string
    }
  }
}

export interface Job {
  id: string
  title: string
  category: string
  description: string
  budget: number
  deadline: Date
  status: string
  offerCount?: number
  createdAt: Date
}

export interface Offer {
  id: string
  jobId: string
  jobTitle?: string
  craftsmanId?: string
  craftsmanName?: string
  craftsmanImageUrl?: string
  companyName?: string
  amount: number
  hourlyRate?: number
  description: string
  estimatedDuration?: number
  status: string
  createdAt: Date
  category: string
  postalCode: string
  city: string
}

export interface CraftsmanProfile {
  id: string
  userId: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  description: string
  skills: string[]
  hourlyRate: number
  isVerified: boolean
  completionPercentage?: number
}

export interface Metrics {
  totalJobs: number
  openJobs: number
  totalOffers: number
  pendingOffers: number
  completedJobs?: number
  acceptedOffers?: number
}
