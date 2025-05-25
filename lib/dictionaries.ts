import "server-only"
import type { Locale } from "./i18n-config"

interface DictionaryTypeInterface {
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
    title: string
    subtitle: string
    filterTitle: string
    filterDescription: string
    postalCode: string
    postalCodePlaceholder: string
    skill: string
    skillPlaceholder: string
    resultsPerPage: string
    resetFilters: string
    applyFilters: string
    resultsTitle: string
    showing: string
    of: string
    noResults: string
    tryDifferentFilters: string
    verified: string
    contactNotAvailable: string
    hourlyRate: string
    completedJobs: string
    noRatings: string
    viewProfile: string
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
      saveProgress: string
      saving: string
      saveSuccessTitle: string
      saveSuccessMessage: string
      saveErrorTitle: string
      saveErrorMessage: string
      goToDashboard: string
      goToProfile: string
    }
    skills: {
      all: string
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

const dictionaries: Record<Locale, () => Promise<DictionaryTypeInterface>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<DictionaryTypeInterface> => {
  return dictionaries[locale]?.() ?? dictionaries.de()
}
