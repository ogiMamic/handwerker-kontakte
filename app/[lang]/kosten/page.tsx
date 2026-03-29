import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SEO_CATEGORIES, SEO_CITIES } from "@/lib/seo-data"
import Link from "next/link"
import { ArrowRight, Euro } from "lucide-react"

interface Props {
  params: { lang: Locale }
}

export const metadata: Metadata = {
  title: "Handwerker Kosten — Preisübersicht aller Gewerke | Handwerker-Kontakte",
  description:
    "Was kosten Handwerker? Aktuelle Preisübersicht für Elektriker, Klempner, Maler, Dachdecker und mehr. Stundensätze, Kostenbeispiele und Spartipps.",
  openGraph: {
    title: "Handwerker Kosten — Preisübersicht aller Gewerke",
    description: "Aktuelle Preise für alle Handwerker-Gewerke. Vergleichen und sparen.",
  },
}

export default async function KostenIndexPage({ params }: Props) {
  const dictionary = await getDictionary(params.lang)

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-3 md:py-8 px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-4">
          <ol className="flex items-center gap-1">
            <li>
              <Link href={`/${params.lang}`} className="hover:text-primary">
                Startseite
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-foreground">Kosten</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            Handwerker Kosten — Preisübersicht {new Date().getFullYear()}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            Was kosten Handwerker in Deutschland? Hier finden Sie aktuelle Stundensätze und
            Preisübersichten für alle Gewerke — von Elektriker bis Dachdecker.
          </p>
        </div>

        {/* Category cost cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {SEO_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${params.lang}/kosten/${cat.slug}`}
              className="group p-5 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h2 className="font-bold text-lg mb-1">{cat.label} Kosten</h2>
              <div className="flex items-center gap-1 text-primary font-semibold mb-2">
                <Euro className="h-4 w-4" />
                {cat.costRange}
              </div>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </Link>
          ))}
        </div>

        {/* Popular city combinations */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Handwerker Kosten nach Stadt</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SEO_CITIES.slice(0, 20).map((city) => (
              <div key={city.slug} className="p-3 rounded-lg border">
                <Link
                  href={`/${params.lang}/handwerker/stadt/${city.slug}`}
                  className="font-medium text-sm hover:text-primary"
                >
                  {city.name}
                </Link>
                <div className="mt-1 flex flex-wrap gap-1">
                  {SEO_CATEGORIES.slice(0, 3).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${params.lang}/kosten/${cat.slug}/${city.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
