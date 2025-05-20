import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function RegistrationSuccessPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Registrierung erfolgreich!</h1>
          <p className="text-gray-600 mb-8">
            Vielen Dank für Ihre Registrierung als Handwerker. Wir haben Ihre Daten erhalten und werden diese prüfen.
            Sie erhalten in Kürze eine Bestätigungs-E-Mail mit weiteren Informationen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href={`/${lang}/dashboard`}>Zum Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${lang}`}>Zur Startseite</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
