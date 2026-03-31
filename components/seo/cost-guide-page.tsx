import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { FAQSection } from "@/components/seo/faq-section"
import { SEO_CATEGORIES, SEO_CITIES, getCategoryFAQs, getCostGuideContent, type SEOCategory, type SEOCity } from "@/lib/seo-data"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Euro, Clock, CheckCircle2, Info } from "lucide-react"

interface CostGuidePageProps {
  lang: Locale
  category: SEOCategory
  city?: SEOCity
}

export async function CostGuidePage({ lang, category, city }: CostGuidePageProps) {
  const dictionary = await getDictionary(lang)
  const content = getCostGuideContent(category, city)
  const faqs = getCategoryFAQs(category, city)
  const location = city ? ` in ${city.name}` : ""

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.intro,
    author: {
      "@type": "Organization",
      name: "Handwerker-Kontakte",
      url: "https://handwerker-kontakte.de",
    },
    publisher: {
      "@type": "Organization",
      name: "Handwerker-Kontakte",
    },
    dateModified: new Date().toISOString(),
  }

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-3 md:py-8 px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-4">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href={`/${lang}`} className="hover:text-primary">Startseite</Link></li>
            <li>/</li>
            <li><Link href={`/${lang}/kosten`} className="hover:text-primary">Kosten</Link></li>
            <li>/</li>
            <li className={city ? "" : "font-medium text-foreground"}>
              {city ? (
                <Link href={`/${lang}/kosten/${category.slug}`} className="hover:text-primary">
                  {category.label}
                </Link>
              ) : (
                category.label
              )}
            </li>
            {city && (
              <>
                <li>/</li>
                <li className="font-medium text-foreground">{city.name}</li>
              </>
            )}
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">{content.title}</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">{content.intro}</p>
        </div>

        {/* Quick info box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="h-5 w-5 text-primary" />
              <span className="font-semibold">Stundensatz</span>
            </div>
            <p className="text-2xl font-bold text-primary">{category.costRange}</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold">Preisstand</span>
            </div>
            <p className="text-lg">{new Date().getFullYear()}, aktuell</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-semibold">Region</span>
            </div>
            <p className="text-lg">{city ? `${city.name}, ${city.region}` : "Deutschland"}</p>
          </div>
        </div>

        {/* Cost table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            Preisübersicht: {category.label} Kosten{location}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Leistung</th>
                  <th className="text-left p-3 font-semibold">Preis</th>
                  <th className="text-left p-3 font-semibold hidden md:table-cell">Einheit</th>
                </tr>
              </thead>
              <tbody>
                {content.costTable.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-muted/30">
                    <td className="p-3">{row.service}</td>
                    <td className="p-3 font-medium text-primary">{row.priceRange}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Alle Preise sind Richtwerte inkl. MwSt. und können je nach Region und Anbieter variieren.
          </p>
        </section>

        {/* Cost factors */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Was beeinflusst die Kosten?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h2 className="text-xl font-bold mb-4">💡 Spartipps</h2>
          <ul className="space-y-2">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mb-10 text-center p-8 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-bold mb-2">
            {category.label}{location} gesucht?
          </h2>
          <p className="text-muted-foreground mb-4">
            Vergleichen Sie kostenlos {category.labelPlural}{location} und sparen Sie bis zu 30%.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href={`/${lang}/handwerker/kategorie/${category.slug}${city ? `/${city.slug}` : ""}`}>
                {category.labelPlural} vergleichen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${lang}/client/job-wizard`}>
                Kostenloses Angebot einholen
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          faqs={faqs}
          title={`Häufige Fragen zu ${category.label} Kosten${location}`}
        />

        {/* Internal linking: same category, other cities */}
        {category && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold mb-4">
              {category.label} Kosten in anderen Städten
            </h2>
            <div className="flex flex-wrap gap-2">
              {SEO_CITIES.filter((c) => c.slug !== city?.slug).slice(0, 20).map((c) => (
                <Link
                  key={c.slug}
                  href={`/${lang}/kosten/${category.slug}/${c.slug}`}
                >
                  <Badge variant="outline" className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer">
                    <MapPin className="h-3 w-3 mr-1" />
                    {category.label} Kosten {c.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal linking: other categories */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-bold mb-4">Weitere Kostenübersichten</h2>
          <div className="flex flex-wrap gap-2">
            {SEO_CATEGORIES.filter((c) => c.slug !== category.slug).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${lang}/kosten/${cat.slug}${city ? `/${city.slug}` : ""}`}
              >
                <Badge variant="outline" className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer">
                  {cat.icon} {cat.label} Kosten
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter dictionary={dictionary.footer} locale={lang} />
    </>
  )
}
