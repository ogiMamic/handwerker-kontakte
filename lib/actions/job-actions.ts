"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import { type PaginationOptions, paginatedQuery } from "@/lib/db-utils"
import { v4 as uuidv4 } from "uuid"

// Job schema for validation
const jobSchema = z.object({
  title: z.string().min(5),
  category: z.string().min(1),
  description: z.string().min(20),
  postalCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(2),
  address: z.string().min(5),
  budget: z.string().regex(/^\d+(\.\d{1,2})?$/),
  deadline: z.string().min(1),
  images: z.array(z.string()).optional(),
})

export type JobFormValues = z.infer<typeof jobSchema>

export async function createJob(formData: JobFormValues) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to create a job")
  }

  // Validate the form data
  const validatedData = jobSchema.parse(formData)

  try {
    // Get user from database or create if not exists
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    let dbUserId

    if (userResult.length === 0) {
      // User doesn't exist in our database yet, create them
      const newUserId = uuidv4()
      await executeQuery(
        `INSERT INTO "User" ("id", "clerkId", "email", "name", "type") 
         VALUES ($1, $2, $3, $4, $5)`,
        [newUserId, userId, "placeholder@example.com", "New User", "CLIENT"],
      )
      dbUserId = newUserId
    } else {
      dbUserId = userResult[0].id
    }

    // Create the job
    const jobId = uuidv4()
    await executeQuery(
      `INSERT INTO "Job" (
        "id", "title", "category", "description", "postalCode", 
        "city", "address", "budget", "deadline", "images", 
        "clientId", "status", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )`,
      [
        jobId,
        validatedData.title,
        validatedData.category,
        validatedData.description,
        validatedData.postalCode,
        validatedData.city,
        validatedData.address,
        Number.parseFloat(validatedData.budget),
        new Date(validatedData.deadline),
        validatedData.images || [],
        dbUserId,
        "OPEN",
        new Date(),
        new Date(),
      ],
    )

    // Create notifications for craftsmen with matching skills
    await createJobNotifications(jobId, validatedData.category, validatedData.postalCode)

    // Revalidate the jobs page to show the new job
    revalidatePath("/client/jobs")

    return { success: true, jobId }
  } catch (error) {
    console.error("Error creating job:", error)
    throw new Error("Failed to create job. Please try again.")
  }
}

async function createJobNotifications(jobId: string, category: string, postalCode: string) {
  try {
    // Get job details
    const jobResult = await executeQuery(`SELECT * FROM "Job" WHERE "id" = $1`, [jobId])

    if (jobResult.length === 0) {
      throw new Error("Job not found")
    }

    const job = jobResult[0]

    // Find craftsmen with matching skills within reasonable distance
    const craftsmenResult = await executeQuery(
      `
      SELECT cp."userId"
      FROM "CraftsmanProfile" cp
      WHERE $1 = ANY(cp.skills)
      OR EXISTS (
        SELECT 1 FROM unnest(cp.skills) skill
        WHERE skill IN (
          SELECT related_skill
          FROM (
            VALUES 
              ('plumbing', 'bathroom'), ('plumbing', 'kitchen'), ('plumbing', 'heating'),
              ('electrical', 'lighting'), ('electrical', 'smart-home'),
              ('carpentry', 'furniture'), ('carpentry', 'flooring'), ('carpentry', 'kitchen'),
              ('painting', 'wallpaper'), ('painting', 'plastering'),
              ('flooring', 'tiling'), ('flooring', 'carpentry'),
              ('roofing', 'insulation'), ('roofing', 'gutters'),
              ('landscaping', 'gardening'), ('landscaping', 'fencing')
          ) AS related_skills(category, related_skill)
          WHERE category = $1
        )
      )
    `,
      [category],
    )

    // Create notifications for each matching craftsman
    for (const craftsman of craftsmenResult) {
      const notificationId = uuidv4()
      await executeQuery(
        `INSERT INTO "Notification" (
          "id", "type", "title", "message", "isRead", "userId", "data", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )`,
        [
          notificationId,
          "JOB_CREATED",
          "Neuer Auftrag in Ihrer Nähe",
          `Ein neuer Auftrag "${job.title}" wurde in Ihrer Nähe erstellt.`,
          false,
          craftsman.userId,
          JSON.stringify({ jobId }),
          new Date(),
          new Date(),
        ],
      )
    }
  } catch (error) {
    console.error("Error creating job notifications:", error)
    // Don't throw here, as this is a secondary operation
  }
}

export async function getClientJobs(userId: string, options: PaginationOptions = {}) {
  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return { jobs: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0, hasMore: false } }
    }

    const dbUserId = userResult[0].id

    // Get jobs for this client with pagination
    const query = `
      SELECT j.*, 
        (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount",
        u.name as "clientName", u.imageUrl as "clientImageUrl"
      FROM "Job" j
      JOIN "User" u ON j."clientId" = u.id
      WHERE j."clientId" = $1
    `
    const countQuery = `SELECT COUNT(*) FROM "Job" WHERE "clientId" = $1`

    const result = await paginatedQuery(query, countQuery, [dbUserId], options)

    return {
      jobs: result.data.map((job) => ({
        ...job,
        budget: Number.parseFloat(job.budget),
        deadline: new Date(job.deadline),
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
        offerCount: Number.parseInt(job.offerCount),
      })),
      pagination: result.pagination,
    }
  } catch (error) {
    console.error("Error fetching client jobs:", error)
    throw new Error("Failed to fetch jobs. Please try again.")
  }
}

export async function getJobById(jobId: string) {
  try {
    // Get job details
    const jobResult = await executeQuery(
      `
      SELECT j.*, 
        c.name as "clientName", c.imageUrl as "clientImageUrl",
        h.name as "craftsmanName", h.imageUrl as "craftsmanImageUrl",
        (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount"
      FROM "Job" j
      JOIN "User" c ON j."clientId" = c.id
      LEFT JOIN "User" h ON j."craftsmanId" = h.id
      WHERE j.id = $1
    `,
      [jobId],
    )

    if (jobResult.length === 0) {
      throw new Error("Job not found")
    }

    const job = jobResult[0]

    return {
      ...job,
      budget: Number.parseFloat(job.budget),
      deadline: new Date(job.deadline),
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
      offerCount: Number.parseInt(job.offerCount),
    }
  } catch (error) {
    console.error("Error fetching job:", error)
    throw new Error("Failed to fetch job. Please try again.")
  }
}

export async function getJobOffers(jobId: string) {
  try {
    // Get offers for this job
    const offersResult = await executeQuery(
      `
      SELECT o.*, 
        u.name as "craftsmanName", u.imageUrl as "craftsmanImageUrl",
        cp.companyName, cp.hourlyRate, cp.skills
      FROM "Offer" o
      JOIN "User" u ON o."craftsmanId" = u.id
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      WHERE o."jobId" = $1
      ORDER BY o."createdAt" DESC
    `,
      [jobId],
    )

    return offersResult.map((offer) => ({
      ...offer,
      amount: Number.parseFloat(offer.amount),
      hourlyRate: Number.parseFloat(offer.hourlyRate),
      createdAt: new Date(offer.createdAt),
      updatedAt: new Date(offer.updatedAt),
    }))
  } catch (error) {
    console.error("Error fetching job offers:", error)
    throw new Error("Failed to fetch offers. Please try again.")
  }
}

export async function updateJobStatus(jobId: string, status: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to update a job")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    // Get job details
    const jobResult = await executeQuery(`SELECT * FROM "Job" WHERE "id" = $1`, [jobId])

    if (jobResult.length === 0) {
      throw new Error("Job not found")
    }

    const job = jobResult[0]

    // Check if user is the client or assigned craftsman
    if (job.clientId !== dbUserId && job.craftsmanId !== dbUserId) {
      throw new Error("You don't have permission to update this job")
    }

    // Update job status
    await executeQuery(`UPDATE "Job" SET "status" = $1, "updatedAt" = $2 WHERE "id" = $3`, [status, new Date(), jobId])

    // Revalidate the job page
    revalidatePath(`/job/${jobId}`)
    revalidatePath(`/client/jobs`)
    revalidatePath(`/craftsman/jobs`)

    return { success: true }
  } catch (error) {
    console.error("Error updating job status:", error)
    throw new Error("Failed to update job status. Please try again.")
  }
}
