import Link from "next/link"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default async function RegistrationSuccessPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-24 w-24 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Registrierung erfolgreich!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Vielen Dank für Ihre Registrierung als Handwerker auf unserer Plattform. Wir haben Ihre Daten erhalten und
            werden diese nun überprüfen.
          </p>
          <p className="text-gray-600 mb-8">
            Sie erhalten in Kürze eine E-Mail mit weiteren Informationen. Nach erfolgreicher Überprüfung Ihrer Angaben
            wird Ihr Profil freigeschaltet und Sie können Aufträge annehmen.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={`/${lang}/dashboard`}>Zum Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${lang}`}>Zur Startseite</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
