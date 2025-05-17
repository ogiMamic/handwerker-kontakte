"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Offer schema for validation
const offerSchema = z.object({
  amount: z.number().min(1),
  description: z.string().min(20),
  estimatedDuration: z.number().min(1),
})

export type OfferFormValues = z.infer<typeof offerSchema>

export async function createOffer(jobId: string, formData: OfferFormValues) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to create an offer")
  }

  // Validate the form data
  const validatedData = offerSchema.parse(formData)

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    // Check if user is a craftsman
    if (userResult[0].type !== "CRAFTSMAN") {
      throw new Error("Only craftsmen can create offers")
    }

    // Check if job exists and is open
    const jobResult = await executeQuery(`SELECT * FROM "Job" WHERE "id" = $1`, [jobId])

    if (jobResult.length === 0) {
      throw new Error("Job not found")
    }

    const job = jobResult[0]

    if (job.status !== "OPEN") {
      throw new Error("This job is not open for offers")
    }

    // Check if user has already made an offer for this job
    const existingOfferResult = await executeQuery(`SELECT * FROM "Offer" WHERE "jobId" = $1 AND "craftsmanId" = $2`, [
      jobId,
      dbUserId,
    ])

    if (existingOfferResult.length > 0) {
      throw new Error("You have already made an offer for this job")
    }

    // Create the offer
    const offerId = uuidv4()
    await executeQuery(
      `INSERT INTO "Offer" (
        "id", "amount", "description", "estimatedDuration", "status", 
        "jobId", "craftsmanId", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )`,
      [
        offerId,
        validatedData.amount,
        validatedData.description,
        validatedData.estimatedDuration,
        "PENDING",
        jobId,
        dbUserId,
        new Date(),
        new Date(),
      ],
    )

    // Create notification for the client
    const notificationId = uuidv4()
    await executeQuery(
      `INSERT INTO "Notification" (
        "id", "type", "title", "message", "isRead", "userId", "data", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )`,
      [
        notificationId,
        "OFFER_RECEIVED",
        "Neues Angebot erhalten",
        `Sie haben ein neues Angebot für Ihr Projekt "${job.title}" erhalten.`,
        false,
        job.clientId,
        JSON.stringify({ jobId, offerId }),
        new Date(),
        new Date(),
      ],
    )

    // Revalidate the job page
    revalidatePath(`/job/${jobId}`)

    return { success: true, offerId }
  } catch (error) {
    console.error("Error creating offer:", error)
    throw new Error("Failed to create offer. Please try again.")
  }
}

export async function updateOfferStatus(offerId: string, status: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to update an offer")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    // Get offer details
    const offerResult = await executeQuery(
      `
      SELECT o.*, j."clientId", j.id as "jobId", j.title as "jobTitle"
      FROM "Offer" o
      JOIN "Job" j ON o."jobId" = j.id
      WHERE o.id = $1
    `,
      [offerId],
    )

    if (offerResult.length === 0) {
      throw new Error("Offer not found")
    }

    const offer = offerResult[0]

    // Check permissions based on the action
    if (status === "WITHDRAWN") {
      // Only the craftsman who made the offer can withdraw it
      if (offer.craftsmanId !== dbUserId) {
        throw new Error("You don't have permission to withdraw this offer")
      }
    } else if (status === "ACCEPTED" || status === "REJECTED") {
      // Only the client who owns the job can accept or reject offers
      if (offer.clientId !== dbUserId) {
        throw new Error("You don't have permission to accept or reject this offer")
      }
    } else {
      throw new Error("Invalid status")
    }

    // Update offer status
    await executeQuery(`UPDATE "Offer" SET "status" = $1, "updatedAt" = $2 WHERE "id" = $3`, [
      status,
      new Date(),
      offerId,
    ])

    // If offer is accepted, update job status and assign craftsman
    if (status === "ACCEPTED") {
      await executeQuery(`UPDATE "Job" SET "status" = $1, "craftsmanId" = $2, "updatedAt" = $3 WHERE "id" = $4`, [
        "IN_PROGRESS",
        offer.craftsmanId,
        new Date(),
        offer.jobId,
      ])

      // Create notification for the craftsman
      const notificationId = uuidv4()
      await executeQuery(
        `INSERT INTO "Notification" (
          "id", "type", "title", "message", "isRead", "userId", "data", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )`,
        [
          notificationId,
          "OFFER_ACCEPTED",
          "Angebot angenommen",
          `Ihr Angebot für das Projekt "${offer.jobTitle}" wurde angenommen.`,
          false,
          offer.craftsmanId,
          JSON.stringify({ jobId: offer.jobId, offerId }),
          new Date(),
          new Date(),
        ],
      )
    }

    // Revalidate relevant pages
    revalidatePath(`/job/${offer.jobId}`)
    revalidatePath(`/client/dashboard`)
    revalidatePath(`/craftsman/dashboard`)

    return { success: true }
  } catch (error) {
    console.error("Error updating offer status:", error)
    throw new Error("Failed to update offer status. Please try again.")
  }
}
