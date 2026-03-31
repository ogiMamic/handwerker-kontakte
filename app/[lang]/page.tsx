import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingCityCards } from "@/components/landing/city-cards"
import { LandingHowItWorks } from "@/components/landing/how-it-works"
import { LandingCTA } from "@/components/landing/cta"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { getAktiveStaedte, getAktiveKombinacije, STAEDTE } from "@/lib/handwerker-dynamic"
import { neon } from "@neondatabase/serverless"

export const dynamic = 'force-dynamic';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  let totalProfiles = 0
  let totalGewerke = 0
  let totalStaedte = 0
  let cities: { slug: string; name: string; count: number }[] = []
  let categoryCounts: Record<string, number> = {}

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get real total profile count (no double-counting)
    const countRows = await sql(`SELECT COUNT(*) as total FROM "CraftsmanProfile"`)
    totalProfiles = Number(countRows[0]?.total || 0)

    // Get active cities with counts
    const aktivStaedte = await getAktiveStaedte()
    totalStaedte = aktivStaedte.length

    // Map city slugs to display names from STAEDTE, take top 8
    const stadtMap = new Map(STAEDTE.map((s) => [s.slug, s.name]))
    cities = aktivStaedte
      .filter((s) => stadtMap.has(s.stadt))
      .slice(0, 8)
      .map((s) => ({
        slug: s.stadt,
        name: stadtMap.get(s.stadt) ?? s.stadt,
        count: Number(s.anzahl),
      }))

    // Get combinations for gewerk counts and totalGewerke
    const kombinacije = await getAktiveKombinacije()
    const gewerkSet = new Set<string>()
    const gewerkCounts: Record<string, number> = {}
    for (const k of kombinacije) {
      gewerkSet.add(k.gewerk)
      gewerkCounts[k.gewerk] = (gewerkCounts[k.gewerk] || 0) + Number(k.anzahl)
    }
    totalGewerke = gewerkSet.size

    // Category counts: count distinct profiles per gewerk (from combinations)
    // Note: combinations may double-count profiles that serve multiple cities,
    // but for category display this is acceptable as an approximation.
    categoryCounts = gewerkCounts
  } catch {
    // DB not available — show no stats
  }

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1">
        <LandingHero
          totalProfiles={totalProfiles}
          totalGewerke={totalGewerke}
          totalStaedte={totalStaedte}
          categoryCounts={categoryCounts}
        />
        <LandingFeatures />
        <LandingCityCards cities={cities} />
        <LandingHowItWorks />
        <LandingCTA />
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  )
}
