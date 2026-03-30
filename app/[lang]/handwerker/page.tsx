import { getCraftsmen } from "@/lib/actions/craftsman-actions"
import { CompactFilters } from "@/components/craftsman/compact-filters"
import { CraftsmanListView } from "@/components/craftsman/craftsman-list-view"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SEO_CATEGORIES, SEO_CITIES } from "@/lib/seo-data"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PageProps {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CraftsmenPage({ params, searchParams }: PageProps) {
  const { lang } = await params
  const resolvedSearchParams = await searchParams
  const dictionary = await getDictionary(lang)

  const page = resolvedSearchParams.page ? Number.parseInt(resolvedSearchParams.page as string) : 1
  const limit = resolvedSearchParams.limit ? Number.parseInt(resolvedSearchParams.limit as string) : 20
  const postalCode = (resolvedSearchParams.postalCode as string) || ""
  const skill = (resolvedSearchParams.skill as string) || "all"
  const minRating = resolvedSearchParams.minRating ? Number.parseFloat(resolvedSearchParams.minRating as string) : 0
  const maxHourlyRate = resolvedSearchParams.maxHourlyRate ? Number.parseInt(resolvedSearchParams.maxHourlyRate as string) : 200

  const result = await getCraftsmen({ page, limit }, { postalCode, skill, minRating, maxHourlyRate })

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-3 md:py-8 px-4">
        <div className="mb-3 md:mb-4">
          <h1 className="text-xl md:text-3xl font-bold mb-1">Handwerker finden</h1>
          <p className="text-xs md:text-base text-gray-500">Finden Sie qualifizierte Handwerker in Ihrer Nähe</p>
        </div>

        <div className="mb-3 md:mb-4">
          <CompactFilters
            initialFilters={{ postalCode, skill, minRating, maxHourlyRate }}
            dictionary={dictionary.craftsman}
          />
        </div>

        <CraftsmanListView
          craftsmen={result.data}
          sponsored={result.sponsored || []}
          dictionary={dictionary.craftsman}
          lang={lang}
        />

        {result.pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                {result.pagination.page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?${new URLSearchParams({
                        ...(postalCode && { postalCode }),
                        ...(skill !== "all" && { skill }),
                        ...(minRating > 0 && { minRating: minRating.toString() }),
                        ...(maxHourlyRate < 200 && { maxHourlyRate: maxHourlyRate.toString() }),
                        page: (result.pagination.page - 1).toString(),
                      })}`}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: Math.min(5, result.pagination.totalPages) }).map((_, i) => {
                  const pageNumber = i + 1
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={`?${new URLSearchParams({
                          ...(postalCode && { postalCode }),
                          ...(skill !== "all" && { skill }),
                          ...(minRating > 0 && { minRating: minRating.toString() }),
                          ...(maxHourlyRate < 200 && { maxHourlyRate: maxHourlyRate.toString() }),
                          page: pageNumber.toString(),
                        })}`}
                        isActive={result.pagination.page === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {result.pagination.page < result.pagination.totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={`?${new URLSearchParams({
                        ...(postalCode && { postalCode }),
                        ...(skill !== "all" && { skill }),
                        ...(minRating > 0 && { minRating: minRating.toString() }),
                        ...(maxHourlyRate < 200 && { maxHourlyRate: maxHourlyRate.toString() }),
                        page: (result.pagination.page + 1).toString(),
                      })}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <section className="container px-4 py-8 border-t">
        <h2 className="text-xl font-bold mb-4">Handwerker nach Fachgebiet</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {SEO_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${lang}/handwerker/kategorie/${cat.slug}`}
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-primary/5 hover:border-primary/30 transition-colors"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="font-medium text-sm">{cat.label}</span>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">Handwerker nach Stadt</h2>
        <div className="flex flex-wrap gap-2">
          {SEO_CITIES.map((city) => (
            <Link key={city.slug} href={`/${lang}/handwerker/stadt/${city.slug}`}>
              <Badge variant="outline" className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer">
                <MapPin className="h-3 w-3 mr-1" />
                {city.name}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
