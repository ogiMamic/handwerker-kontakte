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
      // Add more as needed
    }
    howItWorks: {
      title: string
      subtitle: string
      // Add more as needed
    }
    testimonials: {
      title: string
      subtitle: string
      // Add more as needed
    }
    cta: {
      title: string
      subtitle: string
      buttonText: string
    }
  }
  footer: {
    // Footer translations
  }
  // Add more sections as needed
}

const dictionaries: Record<Locale, () => Promise<DictionaryTypeInterface>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<DictionaryTypeInterface> => {
  return dictionaries[locale]?.() ?? dictionaries.de()
}
