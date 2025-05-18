import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { JobListing } from "@/components/craftsman/job-listing"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { executeQuery } from "@/lib/db"

async function getAvailableJobs(userId: string) {
  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return []
    }

    const dbUserId = userResult[0].id

    // Get craftsman profile to check skills
    const profileResult = await executeQuery(`SELECT * FROM "CraftsmanProfile" WHERE "userId" = $1`, [dbUserId])

    if (profileResult.length === 0) {
      return []
    }

    const profile = profileResult[0]
    const skills = profile.skills || []

    // Get jobs that match the craftsman's skills and are within service radius
    // In a real app, you would use a more sophisticated query with postal code distance calculation
    const jobs = await executeQuery(
      `
      SELECT j.*, u.name as "clientName", u.imageUrl as "clientImageUrl",
        (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount"
      FROM "Job" j
      JOIN "User" u ON j."clientId" = u.id
      WHERE j.status = 'OPEN'
      AND (j.category = ANY($1) OR $2 = ANY($1))
      ORDER BY j."createdAt" DESC
    `,
      [skills, "any"],
    )

    return jobs.map((job) => ({
      ...job,
      budget: Number.parseFloat(job.budget),
      deadline: new Date(job.deadline),
      createdAt: new Date(job.createdAt),
      offerCount: Number.parseInt(job.offerCount),
    }))
  } catch (error) {
    console.error("Error fetching available jobs:", error)
    throw new Error("Failed to fetch available jobs. Please try again.")
  }
}

export default async function CraftsmanJobsPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)
  const jobs = await getAvailableJobs(userId)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <h1 className="text-2xl font-bold mb-6">Verfügbare Aufträge</h1>
        <JobListing jobs={jobs} />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
