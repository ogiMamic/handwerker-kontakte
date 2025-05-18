import "server-only";
import type { Locale } from "./i18n-config";

interface Dictionary {
  navigation: {
    home: string;
    jobs: string;
    craftsmen: string;
    howItWorks: string;
    pricing: string;
    login: string;
    signup: string;
    dashboard: string;
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      clientCta: string;
      craftsCta: string;
    };
    features: {
      title: string;
      subtitle: string;
    };
    howItWorks: {
      title: string;
      subtitle: string;
    };
    testimonials: {
      title: string;
      subtitle: string;
    };
    cta: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
  };
  footer: {
    copyright: string;
  };
}

// Definišemo mapu sa async funkcijama za svaki jezik
const dictionaries = {
  de: async (): Promise<Dictionary> => (await import("./dictionaries/de.json")).default,
  en: async (): Promise<Dictionary> => (await import("./dictionaries/en.json")).default,
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Dodajemo fallback - ako locale nije podržan, koristimo "de"
  if (!dictionaries[locale]) {
    console.warn(`Locale "${locale}" not supported, falling back to "de"`);
    return dictionaries.de();
  }
  
  return dictionaries[locale]();
};