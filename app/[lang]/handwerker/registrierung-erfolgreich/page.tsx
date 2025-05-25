import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

export default async function RegistrationSuccessPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />
      <main className="container mx-auto py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">{dictionary.craftsman.registration.successTitle}</h1>
          <p className="text-gray-600 mb-8">{dictionary.craftsman.registration.successMessage}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href={`/${lang}/dashboard`}>{dictionary.craftsman.registration.goToDashboard}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${lang}/handwerker/profil`}>{dictionary.craftsman.registration.goToProfile}</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
