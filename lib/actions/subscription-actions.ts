"use server"

import { neon } from "@neondatabase/serverless"
import { currentUser } from "@clerk/nextjs/server"
import type { SubscriptionPlan, SubscriptionStatus, UserRole } from "@/lib/subscription/plans"

const sql = neon(process.env.DATABASE_URL!)

export async function getUserSubscription() {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const dbUser = await sql`
      SELECT u.*, s.*
      FROM "User" u
      LEFT JOIN "Subscription" s ON u."id" = s."userId"
      WHERE u."clerkId" = ${user.id}
    `

    if (!dbUser || dbUser.length === 0) {
      return null
    }

    return {
      userId: dbUser[0].id,
      plan: (dbUser[0].plan || "free") as SubscriptionPlan,
      status: (dbUser[0].status || "active") as SubscriptionStatus,
      role: dbUser[0].type as UserRole,
      currentPeriodEnd: dbUser[0].currentPeriodEnd,
      cancelAtPeriodEnd: dbUser[0].cancelAtPeriodEnd,
    }
  } catch (error) {
    console.error("Error fetching user subscription:", error)
    return null
  }
}

export async function getUserUsageLimits() {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const usage = await sql`
      SELECT u.*
      FROM "User" usr
      LEFT JOIN "UsageLimit" u ON usr."id" = u."userId" 
        AND u."month" = ${currentMonth} 
        AND u."year" = ${currentYear}
      WHERE usr."clerkId" = ${user.id}
    `

    if (!usage || usage.length === 0) {
      return {
        jobsPosted: 0,
        offersSubmitted: 0,
        messagesCount: 0,
      }
    }

    return {
      jobsPosted: usage[0].jobsPosted || 0,
      offersSubmitted: usage[0].offersSubmitted || 0,
      messagesCount: usage[0].messagesCount || 0,
    }
  } catch (error) {
    console.error("Error fetching usage limits:", error)
    return {
      jobsPosted: 0,
      offersSubmitted: 0,
      messagesCount: 0,
    }
  }
}

export async function upgradeSubscription(plan: SubscriptionPlan, role: UserRole) {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const dbUser = await sql`
      SELECT "id" FROM "User" WHERE "clerkId" = ${user.id}
    `

    if (!dbUser || dbUser.length === 0) {
      throw new Error("User not found")
    }

    const userId = dbUser[0].id
    const currentPeriodEnd = new Date()
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

    // Check if subscription exists
    const existingSubscription = await sql`
      SELECT "id" FROM "Subscription" WHERE "userId" = ${userId}
    `

    if (existingSubscription && existingSubscription.length > 0) {
      // Update existing subscription
      await sql`
        UPDATE "Subscription"
        SET 
          "plan" = ${plan},
          "status" = 'active',
          "role" = ${role},
          "currentPeriodStart" = NOW(),
          "currentPeriodEnd" = ${currentPeriodEnd.toISOString()},
          "updatedAt" = NOW()
        WHERE "userId" = ${userId}
      `
    } else {
      // Create new subscription
      await sql`
        INSERT INTO "Subscription" (
          "userId", "plan", "status", "role", 
          "currentPeriodStart", "currentPeriodEnd"
        )
        VALUES (
          ${userId}, ${plan}, 'active', ${role},
          NOW(), ${currentPeriodEnd.toISOString()}
        )
      `
    }

    // Update user's subscription plan
    await sql`
      UPDATE "User"
      SET "subscriptionPlan" = ${plan}, "updatedAt" = NOW()
      WHERE "id" = ${userId}
    `

    return { success: true }
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    throw error
  }
}

export async function cancelSubscription() {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const dbUser = await sql`
      SELECT "id" FROM "User" WHERE "clerkId" = ${user.id}
    `

    if (!dbUser || dbUser.length === 0) {
      throw new Error("User not found")
    }

    await sql`
      UPDATE "Subscription"
      SET 
        "cancelAtPeriodEnd" = true,
        "updatedAt" = NOW()
      WHERE "userId" = ${dbUser[0].id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    throw error
  }
}
