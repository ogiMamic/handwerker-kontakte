import { getCraftsmen } from "@/lib/actions/craftsman-actions"
import { CompactFilters } from "@/components/craftsman/compact-filters"
import { CraftsmanListView } from "@/components/craftsman/craftsman-list-view"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const SPONSORED_CRAFTSMEN = [
  {
    id: "eni-elektro-1",
    name: "Enver Memic",
    companyName: "Eni Elektro",
    email: "info@eni-elektro.de",
    phone: "+49 176 12345678",
    businessAddress: "Musterstraße 123",
    businessCity: "Berlin",
    businessPostalCode: "10115",
    hourlyRate: 65,
    skills: ["Elektrik", "Installation", "Renovierung"],
    imageUrl: "/electrician-working.png",
    averageRating: 4.9,
    completedJobs: 127,
    isVerified: true,
    description: "Professionelle Elektroinstallationen und Reparaturen mit über 15 Jahren Erfahrung.",
  },
]

export default async function CraftsmenPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const dictionary = await getDictionary(lang)

  const page = searchParams.page ? Number.parseInt(searchParams.page as string) : 1
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit as string) : 20
  const postalCode = (searchParams.postalCode as string) || ""
  const skill = (searchParams.skill as string) || "all"

  const result = await getCraftsmen({ page, limit }, { postalCode, skill })

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Handwerker finden</h1>
          <p className="text-gray-500">Finden Sie qualifizierte Handwerker in Ihrer Nähe</p>
        </div>

        <div className="mb-6">
          <CompactFilters initialFilters={{ postalCode, skill }} dictionary={dictionary.craftsman} />
        </div>

        <CraftsmanListView
          craftsmen={result.data}
          sponsored={SPONSORED_CRAFTSMEN}
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

      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
