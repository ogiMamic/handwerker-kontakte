import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ClientDashboard } from "@/components/client/dashboard"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { executeQuery } from "@/lib/db"

async function getClientJobs(userId: string) {
  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return { jobs: [], offers: [] }
    }

    const dbUserId = userResult[0].id

    // Get jobs for this client
    const jobs = await executeQuery(
      `
      SELECT j.*, 
        (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount"
      FROM "Job" j
      WHERE j."clientId" = $1
      ORDER BY j."createdAt" DESC
    `,
      [dbUserId],
    )

    // Get offers for all client jobs
    const offers = await executeQuery(
      `
      SELECT o.*, j.title as "jobTitle", u.name as "craftsmanName", u.imageUrl as "craftsmanImageUrl",
        cp.companyName, cp.hourlyRate
      FROM "Offer" o
      JOIN "Job" j ON o."jobId" = j.id
      JOIN "User" u ON o."craftsmanId" = u.id
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      WHERE j."clientId" = $1
      ORDER BY o."createdAt" DESC
    `,
      [dbUserId],
    )

    return {
      jobs: jobs.map((job) => ({
        ...job,
        budget: Number.parseFloat(job.budget),
        deadline: new Date(job.deadline),
        createdAt: new Date(job.createdAt),
        offerCount: Number.parseInt(job.offerCount),
      })),
      offers: offers.map((offer) => ({
        ...offer,
        amount: Number.parseFloat(offer.amount),
        hourlyRate: Number.parseFloat(offer.hourlyRate),
        createdAt: new Date(offer.createdAt),
      })),
    }
  } catch (error) {
    console.error("Error fetching client jobs:", error)
    throw new Error("Failed to fetch jobs. Please try again.")
  }
}

export default async function ClientDashboardPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)
  const { jobs, offers } = await getClientJobs(userId)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <ClientDashboard jobs={jobs} offers={offers} />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
