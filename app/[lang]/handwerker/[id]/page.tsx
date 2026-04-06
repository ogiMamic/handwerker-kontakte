import { notFound } from "next/navigation"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import { CraftsmanProfile } from "@/components/craftsman/profile"
import { getCraftsmanById } from "@/lib/actions/craftsman-actions"
import { incrementProfileView } from "@/lib/actions/dashboard-actions"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export const dynamic = 'force-dynamic';

interface CraftsmanDetailPageProps {
  params: Promise<{
    lang: Locale
    id: string
  }>
}

export default async function CraftsmanDetailPage({ params }: CraftsmanDetailPageProps) {
  const { lang, id } = await params
  const dictionary = await getDictionary(lang)

  const craftsman = await getCraftsmanById(id)

  if (!craftsman) {
    notFound()
  }

  // Track profile view (fire-and-forget, don't block page render)
  incrementProfileView(id).catch(() => {
    // Silently ignore tracking errors
  })

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="">
        <CraftsmanProfile craftsman={craftsman} dictionary={dictionary.craftsman} />
      </main>

      <SiteFooter dictionary={dictionary.footer} locale={lang} />
    </>
  )
}
