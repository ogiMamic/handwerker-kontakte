"use server"

import { neon } from "@neondatabase/serverless"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function createPortfolioItem(data: {
  title: string
  description: string
  category: string
  images: string[]
  completionDate?: Date
  budget?: number
  clientTestimonial?: string
}) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Get craftsman profile
    const profiles = await sql`
      SELECT id FROM "CraftsmanProfile"
      WHERE "userId" = ${userId}
    `

    if (profiles.length === 0) {
      return { success: false, error: "Craftsman profile not found" }
    }

    const craftsmanId = profiles[0].id

    // Check portfolio limit based on subscription
    const { canAddPortfolio, limit } = await checkPortfolioLimit(userId)
    if (!canAddPortfolio) {
      return {
        success: false,
        error: `Portfolio limit reached (${limit} items). Upgrade to add more.`,
      }
    }

    // Create portfolio item
    const result = await sql`
      INSERT INTO "Portfolio" (
        "craftsmanId",
        "title",
        "description",
        "category",
        "images",
        "completionDate",
        "budget",
        "clientTestimonial"
      ) VALUES (
        ${craftsmanId},
        ${data.title},
        ${data.description},
        ${data.category},
        ${data.images},
        ${data.completionDate || null},
        ${data.budget || null},
        ${data.clientTestimonial || null}
      )
      RETURNING *
    `

    revalidatePath("/craftsman/profile")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return { success: false, error: "Failed to create portfolio item" }
  }
}

export async function getPortfolio(craftsmanId: string) {
  try {
    const portfolio = await sql`
      SELECT * FROM "Portfolio"
      WHERE "craftsmanId" = ${craftsmanId}
      ORDER BY "featured" DESC, "completionDate" DESC, "createdAt" DESC
    `

    return { success: true, data: portfolio }
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return { success: false, error: "Failed to fetch portfolio" }
  }
}

export async function updatePortfolioItem(id: string, data: any) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify ownership
    const items = await sql`
      SELECT p.* FROM "Portfolio" p
      JOIN "CraftsmanProfile" cp ON p."craftsmanId" = cp."id"
      WHERE p."id" = ${id} AND cp."userId" = ${userId}
    `

    if (items.length === 0) {
      return { success: false, error: "Portfolio item not found" }
    }

    const result = await sql`
      UPDATE "Portfolio"
      SET
        "title" = COALESCE(${data.title}, "title"),
        "description" = COALESCE(${data.description}, "description"),
        "category" = COALESCE(${data.category}, "category"),
        "images" = COALESCE(${data.images}, "images"),
        "completionDate" = COALESCE(${data.completionDate}, "completionDate"),
        "budget" = COALESCE(${data.budget}, "budget"),
        "clientTestimonial" = COALESCE(${data.clientTestimonial}, "clientTestimonial"),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${id}
      RETURNING *
    `

    revalidatePath("/craftsman/profile")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return { success: false, error: "Failed to update portfolio item" }
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify ownership
    const items = await sql`
      SELECT p.* FROM "Portfolio" p
      JOIN "CraftsmanProfile" cp ON p."craftsmanId" = cp."id"
      WHERE p."id" = ${id} AND cp."userId" = ${userId}
    `

    if (items.length === 0) {
      return { success: false, error: "Portfolio item not found" }
    }

    await sql`DELETE FROM "Portfolio" WHERE "id" = ${id}`

    revalidatePath("/craftsman/profile")
    return { success: true }
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    return { success: false, error: "Failed to delete portfolio item" }
  }
}

async function checkPortfolioLimit(userId: string) {
  const subscriptions = await sql`
    SELECT plan FROM "Subscription"
    WHERE "userId" = ${userId}
    AND "status" = 'active'
    ORDER BY "currentPeriodEnd" DESC
    LIMIT 1
  `

  const plan = subscriptions[0]?.plan || "craftsman_basic"

  // Get current count
  const counts = await sql`
    SELECT COUNT(*) as count FROM "Portfolio" p
    JOIN "CraftsmanProfile" cp ON p."craftsmanId" = cp."id"
    WHERE cp."userId" = ${userId}
  `

  const currentCount = Number.parseInt(counts[0].count)

  // Check limits
  const limits: Record<string, number | "unlimited"> = {
    craftsman_basic: 5,
    craftsman_professional: "unlimited",
    craftsman_business: "unlimited",
  }

  const limit = limits[plan] || 5

  return {
    canAddPortfolio: limit === "unlimited" || currentCount < limit,
    currentCount,
    limit,
  }
}
