import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { SEOListingPage } from "@/components/seo/seo-listing-page"
import { getCityBySlug, SEO_CITIES } from "@/lib/seo-data"

interface Props {
  params: { lang: Locale; city: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}

  return {
    title: `Handwerker in ${city.name} — Alle Fachgebiete | Handwerker-Kontakte`,
    description: `Verifizierte Handwerker in ${city.name} (${city.region}). Elektriker, Klempner, Maler und mehr. Kostenlos Profile vergleichen und direkt kontaktieren.`,
    openGraph: {
      title: `Handwerker in ${city.name}`,
      description: `Alle Handwerker in ${city.name} auf einen Blick.`,
    },
  }
}

export async function generateStaticParams() {
  return SEO_CITIES.map((city) => ({ city: city.slug }))
}

export default function CityPage({ params, searchParams }: Props) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  return (
    <SEOListingPage
      lang={params.lang}
      city={city}
      searchParams={searchParams}
    />
  )
}
