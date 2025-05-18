import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ClientDashboard } from "@/components/client/dashboard"
import { CraftsmanDashboard } from "@/components/craftsman/dashboard"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { executeQuery } from "@/lib/db"

async function getUserType(userId: string) {
  try {
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return null
    }

    return userResult[0].type
  } catch (error) {
    console.error("Error fetching user type:", error)
    return null
  }
}

async function getClientData(userId: string) {
  try {
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return { jobs: [], offers: [] }
    }

    const dbUserId = userResult[0].id

    // Get jobs for this client
    const jobs = await executeQuery(
      `SELECT j.*, 
        (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount"
      FROM "Job" j
      WHERE j."clientId" = $1
      ORDER BY j."createdAt" DESC`,
      [dbUserId],
    )

    // Get offers for all client jobs
    const offers = await executeQuery(
      `SELECT o.*, j.title as "jobTitle", u.name as "craftsmanName", u.imageurl as "craftsmanImageUrl",
        cp.companyName, cp.hourlyRate
      FROM "Offer" o
      JOIN "Job" j ON o."jobId" = j.id
      JOIN "User" u ON o."craftsmanId" = u.id
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      WHERE j."clientId" = $1
      ORDER BY o."createdAt" DESC`,
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
    console.error("Error fetching client data:", error)
    return { jobs: [], offers: [] }
  }
}

async function getCraftsmanData(userId: string) {
  try {
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return { jobs: [], offers: [] }
    }

    const dbUserId = userResult[0].id

    // Get jobs for this craftsman
    const jobs = await executeQuery(
      `SELECT j.*, u.name as "clientName", u.imageurl as "clientImageUrl"
      FROM "Job" j
      JOIN "User" u ON j."clientId" = u.id
      WHERE j."craftsmanId" = $1
      ORDER BY j."createdAt" DESC`,
      [dbUserId],
    )

    // Get offers made by this craftsman
    const offers = await executeQuery(
      `SELECT o.*, j.title as "jobTitle", j.status as "jobStatus", u.name as "clientName"
      FROM "Offer" o
      JOIN "Job" j ON o."jobId" = j.id
      JOIN "User" u ON j."clientId" = u.id
      WHERE o."craftsmanId" = $1
      ORDER BY o."createdAt" DESC`,
      [dbUserId],
    )

    return {
      jobs: jobs.map((job) => ({
        ...job,
        budget: Number.parseFloat(job.budget),
        deadline: new Date(job.deadline),
        createdAt: new Date(job.createdAt),
      })),
      offers: offers.map((offer) => ({
        ...offer,
        amount: Number.parseFloat(offer.amount),
        createdAt: new Date(offer.createdAt),
      })),
    }
  } catch (error) {
    console.error("Error fetching craftsman data:", error)
    return { jobs: [], offers: [] }
  }
}

export default async function DashboardPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)
  const userType = await getUserType(userId)

  if (!userType) {
    // User not found in database, redirect to profile setup
    redirect(`/${lang}/profile-setup`)
  }

  if (userType === "CLIENT") {
    const { jobs, offers } = await getClientData(userId)

    return (
      <>
        <SiteHeader dictionary={dict.navigation} />
        <main className="flex-1 container py-10">
          <ClientDashboard jobs={jobs} offers={offers} />
        </main>
        <SiteFooter dictionary={dict.footer} />
      </>
    )
  } else if (userType === "CRAFTSMAN") {
    const { jobs, offers } = await getCraftsmanData(userId)

    return (
      <>
        <SiteHeader dictionary={dict.navigation} />
        <main className="flex-1 container py-10">
          <CraftsmanDashboard jobs={jobs} offers={offers} />
        </main>
        <SiteFooter dictionary={dict.footer} />
      </>
    )
  }

  // Fallback for unknown user type
  redirect(`/${lang}`)
}
