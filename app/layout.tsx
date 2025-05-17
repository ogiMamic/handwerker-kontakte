import type React from "react"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import type { Locale } from "@/lib/i18n-config"
import type { Metadata } from "next"
import { Suspense } from "react"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Handwerker-Kontakte | Connect with Skilled Craftsmen",
  description: "Find reliable craftsmen for your projects or offer your services as a verified professional.",
  manifest: "/manifest.json",
    generator: 'v0.dev'
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
      <html lang={params.lang || "de"} suppressHydrationWarning>
        <body className={inter.className}>
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
