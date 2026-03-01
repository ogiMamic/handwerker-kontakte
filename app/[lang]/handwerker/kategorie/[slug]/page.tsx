import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { SEOListingPage } from "@/components/seo/seo-listing-page"
import { getCategoryBySlug, SEO_CATEGORIES } from "@/lib/seo-data"

interface Props {
  params: { lang: Locale; slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  if (!category) return {}

  return {
    title: `${category.labelPlural} — Handwerker finden | Handwerker-Kontakte`,
    description: `${category.labelPlural} in Ihrer Nähe finden. ${category.description}. Profile vergleichen, Bewertungen lesen und direkt kontaktieren.`,
    openGraph: {
      title: `${category.labelPlural} finden`,
      description: category.description,
    },
  }
}

export async function generateStaticParams() {
  return SEO_CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

export default function CategoryPage({ params, searchParams }: Props) {
  const category = getCategoryBySlug(params.slug)
  if (!category) notFound()

  return (
    <SEOListingPage
      lang={params.lang}
      category={category}
      searchParams={searchParams}
    />
  )
}
