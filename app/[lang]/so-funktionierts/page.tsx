import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { HowItWorks } from "@/components/how-it-works/how-it-works"

export default async function HowItWorksPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">So funktioniert's</h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Erfahren Sie, wie Sie mit Handwerker-Kontakte Ihr Projekt zum Erfolg führen
            </p>
          </div>

          <HowItWorks />
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
