import { Dashboard } from "@/components/dashboard/dashboard"
import { getDictionary } from "@/lib/dictionaries"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"
import { getDashboardData } from "@/lib/actions/dashboard-actions"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const { userId } = auth()

  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dictionary = await getDictionary(lang)
  const dashboardData = await getDashboardData(userId)

  if (!dashboardData.user) {
    // User exists in Clerk but not in our DB yet
    redirect(`/${lang}/account-type`)
  }

  const hasCraftsmanProfile = dashboardData.craftsmanProfile !== null

  return (
    <Dashboard
      user={{
        id: dashboardData.user.id,
        name: dashboardData.user.name || "Benutzer",
        email: dashboardData.user.email,
        type: dashboardData.user.type,
        role: hasCraftsmanProfile ? "both" : "client",
        currentRole: hasCraftsmanProfile ? "craftsman" : "client",
      }}
      jobs={dashboardData.clientJobs}
      offers={dashboardData.clientOffers}
      craftsmanProfile={
        dashboardData.craftsmanProfile
          ? {
              id: dashboardData.craftsmanProfile.id,
              userId: dashboardData.craftsmanProfile.userId,
              companyName: dashboardData.craftsmanProfile.companyName,
              contactPerson: dashboardData.craftsmanProfile.contactPerson,
              email: dashboardData.user.email,
              phone: dashboardData.craftsmanProfile.phone,
              address: dashboardData.craftsmanProfile.businessAddress,
              postalCode: dashboardData.craftsmanProfile.businessPostalCode,
              city: dashboardData.craftsmanProfile.businessCity,
              description: dashboardData.craftsmanProfile.description,
              skills: dashboardData.craftsmanProfile.skills,
              hourlyRate: dashboardData.craftsmanProfile.hourlyRate,
              isVerified: dashboardData.craftsmanProfile.isVerified,
              completionPercentage: dashboardData.craftsmanProfile.completionPercentage,
            }
          : null
      }
      craftsmanJobs={dashboardData.craftsmanJobs}
      craftsmanOffers={dashboardData.craftsmanOffers}
      metrics={dashboardData.metrics}
      lang={lang}
      dictionary={dictionary}
    />
  )
}
