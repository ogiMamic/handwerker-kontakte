import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { SEOListingPage } from "@/components/seo/seo-listing-page"
import { getCategoryBySlug, SEO_CATEGORIES } from "@/lib/seo-data"
import { getHandwerker } from "@/lib/handwerker-dynamic"

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ lang: Locale; slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  const { total } = await getHandwerker({ gewerk: category.slug as any, seite: 1 })

  return {
    title: `${category.labelPlural} — Handwerker finden | Handwerker-Kontakte`,
    description: `${category.labelPlural} in Ihrer Nähe finden. ${category.description}. Profile vergleichen, Bewertungen lesen und direkt kontaktieren.`,
    robots: {
      index: total > 0,
      follow: true,
    },
    openGraph: {
      title: `${category.labelPlural} finden`,
      description: category.description,
    },
  }
}

export async function generateStaticParams() {
  return SEO_CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { lang, slug } = await params
  const query = await searchParams
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  return (
    <SEOListingPage
      lang={lang}
      category={category}
      searchParams={query}
    />
  )
}
