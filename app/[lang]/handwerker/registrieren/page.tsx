import { getDictionary } from "@/lib/dictionaries"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CraftsmanRegistrationForm } from "@/components/craftsman/registration-form"

export default async function CraftsmanRegistrationPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()

  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dictionary = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />
      <main className="container mx-auto py-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {dictionary.craftsman?.registration?.title || "Als Handwerker registrieren"}
            </h1>
            <p className="text-gray-600 text-lg">
              {dictionary.craftsman?.registration?.subtitle || "Werden Sie Teil unserer Handwerker-Community"}
            </p>
          </div>
          <CraftsmanRegistrationForm lang={lang} dictionary={dictionary} />
        </div>
      </main>
      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
