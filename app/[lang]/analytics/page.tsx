// @ts-nocheck
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserSubscription } from "@/lib/actions/subscription-actions"
import { AnalyticsDashboard } from "@/components/subscription/analytics-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lock, BarChart3 } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage({
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

  // Check if user has access to analytics (Business plan)
  const hasAccess = subscription?.plan === "business"

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">Detaillierte Einblicke in Ihre Performance</p>
            </div>
          </div>

          {hasAccess ? (
            <AnalyticsDashboard role={subscription?.role || "client"} />
          ) : (
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>Analytics nicht verfügbar</CardTitle>
                <CardDescription>Erweiterte Analytics sind nur im Business Plan verfügbar.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button asChild>
                  <Link href={`/${lang}/subscription`}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Auf Business upgraden
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  )
}
