import type React from "react"
import { Inter } from "next/font/google"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { I18nProvider } from "@/components/i18n-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <Suspense>
      <I18nProvider locale={lang} dictionary={dictionary}>
        <div className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>{children}</div>
      </I18nProvider>
    </Suspense>
  )
}
