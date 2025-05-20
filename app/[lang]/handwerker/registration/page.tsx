import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CraftsmanRegistrationForm } from "@/components/craftsman/registration-form"

export default async function CraftsmanRegistrationPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <CraftsmanRegistrationForm />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
