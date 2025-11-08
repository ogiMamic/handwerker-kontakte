"use server"

import { executeQuery } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function trackJobView(jobId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    await executeQuery(`SELECT track_job_view($1, $2)`, [jobId, userId])

    return { success: true }
  } catch (error) {
    console.error("Error tracking job view:", error)
    throw error
  }
}

export async function markJobInterest(jobId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    await executeQuery(`SELECT mark_job_interest($1, $2)`, [jobId, userId])

    return { success: true }
  } catch (error) {
    console.error("Error marking job interest:", error)
    throw error
  }
}

export async function getJobStats(jobId: string) {
  try {
    const result = await executeQuery(
      `SELECT 
        "notifiedCount",
        "viewedCount",
        "interestedCount",
        (SELECT COUNT(*) FROM "Offer" WHERE "jobId" = $1) as "offerCount"
      FROM "Job"
      WHERE "id" = $1`,
      [jobId],
    )

    if (result.length === 0) {
      throw new Error("Job not found")
    }

    return result[0]
  } catch (error) {
    console.error("Error getting job stats:", error)
    throw error
  }
}
