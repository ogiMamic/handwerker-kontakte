import { CraftsmanRegistrationForm } from "@/components/craftsman/registration-form"
import { getDictionary } from "@/lib/dictionaries"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

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
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{dictionary.craftsman.registration.title}</h1>
          <p className="text-gray-600 mb-8">{dictionary.craftsman.registration.description}</p>
          <CraftsmanRegistrationForm lang={lang} dictionary={dictionary} />
        </div>
      </div>
      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
