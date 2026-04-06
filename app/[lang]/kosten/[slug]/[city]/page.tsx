import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { CostGuidePage } from "@/components/seo/cost-guide-page"
import { getCategoryBySlug, getCityBySlug, SEO_CATEGORIES, SEO_CITIES } from "@/lib/seo-data"

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ lang: Locale; slug: string; city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, city: citySlug } = await params
  const category = getCategoryBySlug(slug)
  const city = getCityBySlug(citySlug)
  if (!category || !city) return {}

  const year = new Date().getFullYear()
  return {
    title: `${category.label} Kosten in ${city.name} ${year} - Preisübersicht | Handwerker-Kontakte`,
    description: `Was kostet ein ${category.label} in ${city.name}? Stundensatz ${category.costRange}. Aktuelle Preise ${year} für ${category.description} in ${city.name} (${city.region}).`,
    openGraph: {
      title: `${category.label} Kosten in ${city.name} - ${year}`,
      description: `Stundensatz: ${category.costRange}. ${category.description} in ${city.name}. Preise vergleichen.`,
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

export default async function KostenCityCategoryPage({ params }: Props) {
  const { lang, slug, city: citySlug } = await params
  const category = getCategoryBySlug(slug)
  const city = getCityBySlug(citySlug)
  if (!category || !city) notFound()

  return <CostGuidePage lang={lang} category={category} city={city} />
}
