import type React from "react"
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import type { Locale } from "@/lib/i18n-config"
import type { Metadata } from "next"
import { Suspense } from "react"

import "@/styles/globals.css"

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: "Handwerker-Kontakte | Verbinden Sie sich mit qualifizierten Handwerkern",
  description: "Finden Sie zuverlässige Handwerker für Ihre Projekte oder bieten Sie Ihre Dienste als verifizierter Fachmann an.",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <ClerkProvider>
      <html lang={params.lang || "de"} suppressHydrationWarning className={inter.variable}>
        <body className="min-h-screen bg-background font-sans antialiased">
          <Suspense>
            <I18nProvider locale={params.lang || "de"}>
              <ThemeProvider attribute="class" defaultTheme="light">
                {children}
                <Toaster />
              </ThemeProvider>
            </I18nProvider>
          </Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}