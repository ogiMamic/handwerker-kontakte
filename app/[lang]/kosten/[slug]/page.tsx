import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { CostGuidePage } from "@/components/seo/cost-guide-page"
import { getCategoryBySlug, SEO_CATEGORIES } from "@/lib/seo-data"

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ lang: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  const year = new Date().getFullYear()
  return {
    title: `${category.label} Kosten ${year} - Preise & Preisvergleich | Handwerker-Kontakte`,
    description: `Was kostet ein ${category.label}? Stundensatz ${category.costRange}. Aktuelle Preisübersicht ${year} für ${category.description}. Jetzt kostenlos vergleichen.`,
    openGraph: {
      title: `${category.label} Kosten - Preisübersicht ${year}`,
      description: `Stundensatz: ${category.costRange}. ${category.description}. Preise vergleichen und sparen.`,
    },
  }
}

export async function generateStaticParams() {
  return SEO_CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

export default async function KostenCategoryPage({ params }: Props) {
  const { lang, slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  return <CostGuidePage lang={lang} category={category} />
}
