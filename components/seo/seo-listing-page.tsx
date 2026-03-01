import { getCraftsmen } from "@/lib/actions/craftsman-actions"
import { CompactFilters } from "@/components/craftsman/compact-filters"
import { CraftsmanListView } from "@/components/craftsman/craftsman-list-view"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SEO_CATEGORIES, SEO_CITIES, type SEOCategory, type SEOCity } from "@/lib/seo-data"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SEOListingPageProps {
  lang: Locale
  category?: SEOCategory
  city?: SEOCity
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function SEOListingPage({ lang, category, city, searchParams }: SEOListingPageProps) {
  const dictionary = await getDictionary(lang)

  const page = searchParams.page ? Number.parseInt(searchParams.page as string) : 1
  const limit = 20

  // Build filters from SEO context
  const skill = category?.skill || (searchParams.skill as string) || "all"
  const postalCode = city?.plzRange || (searchParams.postalCode as string) || ""

  const result = await getCraftsmen(
    { page, limit },
    { postalCode, skill, minRating: 0, maxHourlyRate: 200 }
  )

  // Build page title and description
  const title = buildTitle(category, city)
  const description = buildDescription(category, city, result.pagination?.total || 0)

  // Structured data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: description,
    numberOfItems: result.pagination?.total || 0,
    itemListElement: result.data.slice(0, 10).map((craftsman: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: craftsman.companyName,
        description: craftsman.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: craftsman.businessCity,
          postalCode: craftsman.businessPostalCode,
          addressCountry: "DE",
        },
        ...(craftsman.averageRating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: craftsman.averageRating,
            bestRating: 5,
          },
        }),
        priceRange: `€${craftsman.hourlyRate}/Std`,
      },
    })),
  }

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-3 md:py-8 px-4">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-4">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href={`/${lang}`} className="hover:text-primary">Startseite</Link></li>
            <li>/</li>
            <li><Link href={`/${lang}/handwerker`} className="hover:text-primary">Handwerker</Link></li>
            {category && (
              <>
                <li>/</li>
                <li className={city ? "" : "font-medium text-foreground"}>
                  {city ? (
                    <Link href={`/${lang}/handwerker/kategorie/${category.slug}`} className="hover:text-primary">
                      {category.label}
                    </Link>
                  ) : (
                    category.label
                  )}
                </li>
              </>
            )}
            {city && (
              <>
                <li>/</li>
                <li className="font-medium text-foreground">{city.name}</li>
              </>
            )}
          </ol>
        </nav>

        {/* SEO Heading */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">{description}</p>
        </div>

        {/* Filters */}
        <div className="mb-3 md:mb-4">
          <CompactFilters
            initialFilters={{
              postalCode: city?.plzRange || "",
              skill: category?.skill || "all",
              minRating: 0,
              maxHourlyRate: 200,
            }}
            dictionary={dictionary.craftsman}
          />
        </div>

        {/* Results */}
        <CraftsmanListView
          craftsmen={result.data}
          sponsored={result.sponsored || []}
          dictionary={dictionary.craftsman}
          lang={lang}
        />

        {/* No results CTA */}
        {result.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              Noch keine {category?.labelPlural || "Handwerker"} {city ? `in ${city.name}` : ""} registriert.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Sie sind {category?.label || "Handwerker"} {city ? `in ${city.name}` : ""}?
            </p>
            <Button asChild>
              <Link href={`/${lang}/handwerker/registrieren`}>
                Jetzt kostenlos registrieren
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Internal linking — other categories in this city */}
        {city && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold mb-4">Weitere Handwerker in {city.name}</h2>
            <div className="flex flex-wrap gap-2">
              {SEO_CATEGORIES.filter((c) => c.slug !== category?.slug).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${lang}/handwerker/kategorie/${cat.slug}/${city.slug}`}
                >
                  <Badge variant="outline" className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer">
                    {cat.icon} {cat.label} in {city.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal linking — this category in other cities */}
        {category && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-bold mb-4">
              {category.labelPlural} in anderen Städten
            </h2>
            <div className="flex flex-wrap gap-2">
              {SEO_CITIES.filter((c) => c.slug !== city?.slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/${lang}/handwerker/kategorie/${category.slug}/${c.slug}`}
                >
                  <Badge variant="outline" className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer">
                    <MapPin className="h-3 w-3 mr-1" />
                    {category.label} in {c.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* If no category selected, show all categories */}
        {!category && !city && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold mb-4">Handwerker nach Fachgebiet</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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

            <h2 className="text-xl font-bold mb-4 mt-8">Handwerker nach Stadt</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {SEO_CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${lang}/handwerker/stadt/${c.slug}`}
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-primary/5 hover:border-primary/30 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}

function buildTitle(category?: SEOCategory, city?: SEOCity): string {
  if (category && city) return `${category.labelPlural} in ${city.name}`
  if (category) return `${category.labelPlural} — Handwerker finden`
  if (city) return `Handwerker in ${city.name}`
  return "Handwerker finden"
}

function buildDescription(category?: SEOCategory, city?: SEOCity, count?: number): string {
  const countText = count ? `${count} verifizierte` : "Verifizierte"
  if (category && city) {
    return `${countText} ${category.labelPlural} in ${city.name} und Umgebung. ${category.description}. Jetzt kostenlos Profile vergleichen und direkt kontaktieren.`
  }
  if (category) {
    return `${countText} ${category.labelPlural} in Ihrer Nähe. ${category.description}. Profile vergleichen, Bewertungen lesen und direkt kontaktieren.`
  }
  if (city) {
    return `${countText} Handwerker in ${city.name} (${city.region}). Alle Fachgebiete — Elektriker, Klempner, Maler und mehr. Kostenlos vergleichen und kontaktieren.`
  }
  return "Finden Sie qualifizierte Handwerker in Ihrer Nähe. Profile vergleichen und direkt kontaktieren."
}
