import { notFound } from "next/navigation"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import { CraftsmanProfile } from "@/components/craftsman/profile"
import { getCraftsmanById } from "@/lib/actions/craftsman-actions"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

interface CraftsmanDetailPageProps {
  params: {
    lang: Locale
    id: string
  }
}

export default async function CraftsmanDetailPage({ params }: CraftsmanDetailPageProps) {
  const dictionary = await getDictionary(params.lang)

  const craftsman = await getCraftsmanById(params.id)

  if (!craftsman) {
    notFound()
  }

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-8">
        <CraftsmanProfile craftsman={craftsman} dictionary={dictionary.craftsman} />
      </main>

      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
