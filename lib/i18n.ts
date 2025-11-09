import "server-only"

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  de: () => import("@/dictionaries/de.json").then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  const dictionaryLoader = dictionaries[locale as keyof typeof dictionaries] || dictionaries.de
  return dictionaryLoader()
}

export const i18n = {
  defaultLocale: "de",
  locales: ["en", "de"],
} as const

export type Locale = (typeof i18n)["locales"][number]
