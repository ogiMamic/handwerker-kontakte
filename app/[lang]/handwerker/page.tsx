import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CraftsmanSearch } from "@/components/craftsman/craftsman-search"
import { type PaginationOptions, paginatedQuery } from "@/lib/db-utils"

async function getCraftsmen(options: PaginationOptions = {}, filters: any = {}) {
  try {
    // Build the query with filters - Entferne die problematische Spalte
    let query = `
      SELECT cp.*, u.id as "userId", u.name, u.email,
        (SELECT COUNT(*) FROM "Job" j WHERE j."craftsmanId" = u.id AND j.status = 'COMPLETED') as "completedJobs",
        (SELECT AVG(r.rating) FROM "Review" r WHERE r."targetId" = u.id) as "averageRating"
      FROM "CraftsmanProfile" cp
      JOIN "User" u ON cp."userId" = u.id
      WHERE u.type = 'CRAFTSMAN'
    `

    let countQuery = `
      SELECT COUNT(*)
      FROM "CraftsmanProfile" cp
      JOIN "User" u ON cp."userId" = u.id
      WHERE u.type = 'CRAFTSMAN'
    `

    const queryParams: any[] = []

    // Add filters if provided
    if (filters.postalCode) {
      query += ` AND cp."businessPostalCode" LIKE $${queryParams.length + 1}`
      countQuery += ` AND cp."businessPostalCode" LIKE $${queryParams.length + 1}`
      queryParams.push(`${filters.postalCode.substring(0, 2)}%`) // Match first 2 digits of postal code
    }

    if (filters.skill && filters.skill !== "all") {
      query += ` AND $${queryParams.length + 1} = ANY(cp.skills)`
      countQuery += ` AND $${queryParams.length + 1} = ANY(cp.skills)`
      queryParams.push(filters.skill)
    }

    const result = await paginatedQuery(query, countQuery, queryParams, options)

    return {
      craftsmen: result.data.map((craftsman) => ({
        ...craftsman,
        hourlyRate: Number.parseFloat(craftsman.hourlyRate),
        completedJobs: Number.parseInt(craftsman.completedJobs || "0"),
        averageRating: craftsman.averageRating ? Number.parseFloat(craftsman.averageRating) : null,
        createdAt: new Date(craftsman.createdAt),
        updatedAt: new Date(craftsman.updatedAt),
        // Füge einen Platzhalter für das Bild hinzu
        imageUrl: null
      })),
      pagination: result.pagination,
    }
  } catch (error) {
    console.error("Error fetching craftsmen:", error)
    throw new Error("Failed to fetch craftsmen. Please try again.")
  }
}

export default async function CraftsmenPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale }
  searchParams: { page?: string; postalCode?: string; skill?: string }
}) {
  const dict = await getDictionary(lang)

  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const filters = {
    postalCode: searchParams.postalCode || "",
    skill: searchParams.skill || "all",
  }

  const { craftsmen, pagination } = await getCraftsmen({ page, limit: 12 }, filters)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Handwerker</h1>
            <p className="text-gray-500 mt-2">Finden Sie qualifizierte Handwerker für Ihr Projekt</p>
          </div>

          <CraftsmanSearch craftsmen={craftsmen} pagination={pagination} initialFilters={filters} />
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
