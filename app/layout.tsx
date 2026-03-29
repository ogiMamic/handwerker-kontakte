import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Handwerker Kontakte - Finden Sie den richtigen Handwerker",
    template: "%s | Handwerker Kontakte",
  },
  description: "Verbinden Sie sich mit qualifizierten Handwerkern in Ihrer Nähe. Schnell, einfach und zuverlässig.",
    metadataBase: new URL("https://www.handwerker-kontakte.de"),
  verification: {
    google: "BWX4OavdAJeUZ7KwPu6nWetYTV8qHu0C6wGF8ku-AM8",
  },
  icons: {
    icon: [
      {
        url: "/icon",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon",
        type: "image/png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
