import { getCraftsmen } from "@/lib/actions/craftsman-actions"
import { CraftsmanSearch } from "@/components/craftsman/craftsman-search"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function CraftsmenPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const dictionary = await getDictionary(lang)

  // Izvlačimo parametre pretrage
  const page = searchParams.page ? Number.parseInt(searchParams.page as string) : 1
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit as string) : 20
  const postalCode = (searchParams.postalCode as string) || ""
  const skill = (searchParams.skill as string) || "all"

  // Dohvaćamo podatke o zanatlijama
  const result = await getCraftsmen({ page, limit }, { postalCode, skill })

  return (
    <>
      {/* Dodajemo Header komponentu */}
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-2">{dictionary.craftsman.title}</h1>
        <p className="text-gray-500 mb-8">{dictionary.craftsman.subtitle}</p>

        <CraftsmanSearch
          craftsmen={result.data}
          pagination={result.pagination}
          initialFilters={{ postalCode, skill }}
          dictionary={dictionary.craftsman}
          lang={lang}
        />
      </main>

      {/* Dodajemo Footer komponentu */}
      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
