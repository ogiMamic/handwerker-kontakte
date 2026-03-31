import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserSubscription, getUserUsageLimits } from "@/lib/actions/subscription-actions"
import { SubscriptionManager } from "@/components/subscription/subscription-manager"

export default async function SubscriptionPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)
  const subscription = await getUserSubscription()
  const usage = await getUserUsageLimits()

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Abonnement verwalten</h1>
          <SubscriptionManager subscription={subscription} usage={usage} lang={lang} />
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  )
}
