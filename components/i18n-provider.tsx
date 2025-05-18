"use client"

import type React from "react"
import { createContext, useContext } from "react"
import type { Locale } from "@/lib/i18n-config"

type I18nContextType = {
  locale: Locale
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  return <I18nContext.Provider value={{ locale }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === null) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
