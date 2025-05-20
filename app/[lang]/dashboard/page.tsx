import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Dashboard } from "@/components/dashboard/dashboard"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { executeQuery } from "@/lib/db"

async function getUserData(userId: string) {
  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return { user: null, jobs: [], offers: [], craftsmanProfile: null }
    }

    const dbUser = userResult[0]
    const dbUserId = dbUser.id

    // Get jobs for this user if they are a client
    const jobs =
      dbUser.type === "CLIENT"
        ? await executeQuery(
            `
      SELECT j.*, 
        (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount"
      FROM "Job" j
      WHERE j."clientId" = $1
      ORDER BY j."createdAt" DESC
      LIMIT 5
    `,
            [dbUserId],
          )
        : []

    // Get offers for all client jobs if they are a client
    const offers =
      dbUser.type === "CLIENT"
        ? await executeQuery(
            `
      SELECT o.*, j.title as "jobTitle", u.name as "craftsmanName", u.imageUrl as "craftsmanImageUrl",
        cp.companyName, cp.hourlyRate
      FROM "Offer" o
      JOIN "Job" j ON o."jobId" = j.id
      JOIN "User" u ON o."craftsmanId" = u.id
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      WHERE j."clientId" = $1
      ORDER BY o."createdAt" DESC
      LIMIT 5
    `,
            [dbUserId],
          )
        : []

    // Get craftsman profile if they are a craftsman
    const craftsmanProfile =
      dbUser.type === "CRAFTSMAN"
        ? await executeQuery(`SELECT * FROM "CraftsmanProfile" WHERE "userId" = $1`, [dbUserId])
        : []

    // Get craftsman jobs if they are a craftsman
    const craftsmanJobs =
      dbUser.type === "CRAFTSMAN"
        ? await executeQuery(
            `
      SELECT j.* 
      FROM "Job" j
      WHERE j."craftsmanId" = $1
      ORDER BY j."createdAt" DESC
      LIMIT 5
    `,
            [dbUserId],
          )
        : []

    // Get craftsman offers if they are a craftsman
    const craftsmanOffers =
      dbUser.type === "CRAFTSMAN"
        ? await executeQuery(
            `
      SELECT o.*, j.title as "jobTitle", j.category, j.postalCode, j.city
      FROM "Offer" o
      JOIN "Job" j ON o."jobId" = j.id
      WHERE o."craftsmanId" = $1
      ORDER BY o."createdAt" DESC
      LIMIT 5
    `,
            [dbUserId],
          )
        : []

    // Get metrics
    const metrics = {
      totalJobs:
        dbUser.type === "CLIENT"
          ? await executeQuery(`SELECT COUNT(*) as count FROM "Job" WHERE "clientId" = $1`, [dbUserId])
          : await executeQuery(`SELECT COUNT(*) as count FROM "Job" WHERE "craftsmanId" = $1`, [dbUserId]),
      openJobs:
        dbUser.type === "CLIENT"
          ? await executeQuery(`SELECT COUNT(*) as count FROM "Job" WHERE "clientId" = $1 AND "status" = 'OPEN'`, [
              dbUserId,
            ])
          : await executeQuery(
              `SELECT COUNT(*) as count FROM "Job" WHERE "craftsmanId" = $1 AND "status" = 'IN_PROGRESS'`,
              [dbUserId],
            ),
      totalOffers:
        dbUser.type === "CLIENT"
          ? await executeQuery(
              `
          SELECT COUNT(*) as count 
          FROM "Offer" o 
          JOIN "Job" j ON o."jobId" = j.id 
          WHERE j."clientId" = $1
        `,
              [dbUserId],
            )
          : await executeQuery(`SELECT COUNT(*) as count FROM "Offer" WHERE "craftsmanId" = $1`, [dbUserId]),
      pendingOffers:
        dbUser.type === "CLIENT"
          ? await executeQuery(
              `
          SELECT COUNT(*) as count 
          FROM "Offer" o 
          JOIN "Job" j ON o."jobId" = j.id 
          WHERE j."clientId" = $1 AND o."status" = 'PENDING'
        `,
              [dbUserId],
            )
          : await executeQuery(
              `SELECT COUNT(*) as count FROM "Offer" WHERE "craftsmanId" = $1 AND "status" = 'PENDING'`,
              [dbUserId],
            ),
    }

    return {
      user: dbUser,
      jobs: jobs.map((job) => ({
        ...job,
        budget: Number.parseFloat(job.budget),
        deadline: new Date(job.deadline),
        createdAt: new Date(job.createdAt),
        offerCount: Number.parseInt(job.offerCount || "0"),
      })),
      offers: offers.map((offer) => ({
        ...offer,
        amount: Number.parseFloat(offer.amount),
        hourlyRate: Number.parseFloat(offer.hourlyRate || "0"),
        createdAt: new Date(offer.createdAt),
      })),
      craftsmanProfile:
        craftsmanProfile.length > 0
          ? {
              ...craftsmanProfile[0],
              hourlyRate: Number.parseFloat(craftsmanProfile[0].hourlyRate),
            }
          : null,
      craftsmanJobs: craftsmanJobs.map((job) => ({
        ...job,
        budget: Number.parseFloat(job.budget),
        deadline: new Date(job.deadline),
        createdAt: new Date(job.createdAt),
      })),
      craftsmanOffers: craftsmanOffers.map((offer) => ({
        ...offer,
        amount: Number.parseFloat(offer.amount),
        createdAt: new Date(offer.createdAt),
      })),
      metrics: {
        totalJobs: Number.parseInt(metrics.totalJobs[0]?.count || "0"),
        openJobs: Number.parseInt(metrics.openJobs[0]?.count || "0"),
        totalOffers: Number.parseInt(metrics.totalOffers[0]?.count || "0"),
        pendingOffers: Number.parseInt(metrics.pendingOffers[0]?.count || "0"),
      },
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return {
      user: null,
      jobs: [],
      offers: [],
      craftsmanProfile: null,
      craftsmanJobs: [],
      craftsmanOffers: [],
      metrics: {},
    }
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
  const userData = await getUserData(userId)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <Dashboard
          user={userData.user}
          jobs={userData.jobs}
          offers={userData.offers}
          craftsmanProfile={userData.craftsmanProfile}
          craftsmanJobs={userData.craftsmanJobs}
          craftsmanOffers={userData.craftsmanOffers}
          metrics={userData.metrics}
          lang={lang}
        />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
