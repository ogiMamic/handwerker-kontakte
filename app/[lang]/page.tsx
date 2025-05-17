import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingHowItWorks } from "@/components/landing/how-it-works"
import { LandingTestimonials } from "@/components/landing/testimonials"
import { LandingCTA } from "@/components/landing/cta"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1">
        <LandingHero dictionary={dict.landing.hero} />
        <LandingFeatures dictionary={dict.landing.features} />
        <LandingHowItWorks dictionary={dict.landing.howItWorks} />
        <LandingTestimonials dictionary={dict.landing.testimonials} />
        <LandingCTA dictionary={dict.landing.cta} />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
