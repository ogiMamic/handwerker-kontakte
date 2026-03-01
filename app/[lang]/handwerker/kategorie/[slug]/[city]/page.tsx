import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { SEOListingPage } from "@/components/seo/seo-listing-page"
import { getCategoryBySlug, getCityBySlug, SEO_CATEGORIES, SEO_CITIES } from "@/lib/seo-data"

interface Props {
  params: { lang: Locale; slug: string; city: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  const city = getCityBySlug(params.city)
  if (!category || !city) return {}

  return {
    title: `${category.labelPlural} in ${city.name} — Jetzt finden | Handwerker-Kontakte`,
    description: `${category.labelPlural} in ${city.name} und Umgebung. ${category.description}. Kostenlos Profile vergleichen, Bewertungen lesen und direkt kontaktieren.`,
    openGraph: {
      title: `${category.labelPlural} in ${city.name}`,
      description: `${category.description} — Jetzt den passenden ${category.label} in ${city.name} finden.`,
    },
  }
}

export async function generateStaticParams() {
  const params: { slug: string; city: string }[] = []
  SEO_CATEGORIES.forEach((cat) => {
    SEO_CITIES.forEach((city) => {
      params.push({ slug: cat.slug, city: city.slug })
    })
  })
  return params
}

export default function CategoryCityPage({ params, searchParams }: Props) {
  const category = getCategoryBySlug(params.slug)
  const city = getCityBySlug(params.city)
  if (!category || !city) notFound()

  return (
    <SEOListingPage
      lang={params.lang}
      category={category}
      city={city}
      searchParams={searchParams}
    />
  )
}
