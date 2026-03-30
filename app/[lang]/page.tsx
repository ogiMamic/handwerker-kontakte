import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingHowItWorks } from "@/components/landing/how-it-works"
import { LandingCTA } from "@/components/landing/cta"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { getAktiveKombinacije } from "@/lib/handwerker-dynamic"

export const dynamic = 'force-dynamic';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  let totalHandwerker = 0;
  let totalGewerke = 0;
  let totalStaedte = 0;
  try {
    const kombinacije = await getAktiveKombinacije();
    totalHandwerker = kombinacije.reduce((sum, k) => sum + Number(k.anzahl), 0);
    totalGewerke = new Set(kombinacije.map((k) => k.gewerk)).size;
    totalStaedte = new Set(kombinacije.map((k) => k.stadt)).size;
  } catch {
    // DB not available — show no stats
  }

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1">
        <LandingHero
          dictionary={dict.landing.hero}
          stats={{ totalHandwerker, totalGewerke, totalStaedte }}
        />
        <LandingFeatures dictionary={dict.landing.features} />
        <LandingHowItWorks dictionary={dict.landing.howItWorks} />
        <LandingCTA dictionary={dict.landing.cta} />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
