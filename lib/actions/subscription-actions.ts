"use server"

import { neon } from "@neondatabase/serverless"
import { currentUser } from "@clerk/nextjs/server"
import type { SubscriptionPlan, SubscriptionStatus, UserRole } from "@/lib/subscription/plans"

const sql = neon(process.env.DATABASE_URL!)

export async function getUserSubscription() {
  try {
    console.log("[v0] Fetching user subscription...")
    const user = await currentUser()
    if (!user) {
      console.log("[v0] No authenticated user")
      throw new Error("Unauthorized")
    }

    console.log("[v0] User ID:", user.id)

    const dbUser = await sql`
      SELECT * FROM "User" WHERE "clerkId" = ${user.id}
    `

    console.log("[v0] DB User found:", dbUser.length > 0)

    if (!dbUser || dbUser.length === 0) {
      console.log("[v0] User not found in database, returning default free plan")
      return {
        userId: null,
        plan: "free" as SubscriptionPlan,
        status: "active" as SubscriptionStatus,
        role: (user.publicMetadata?.role || "client") as UserRole,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      }
    }

    try {
      const subscription = await sql`
        SELECT * FROM "Subscription" WHERE "userId" = ${dbUser[0].id}
      `

      console.log("[v0] Subscription found:", subscription.length > 0)

      if (subscription && subscription.length > 0) {
        return {
          userId: dbUser[0].id,
          plan: subscription[0].plan as SubscriptionPlan,
          status: subscription[0].status as SubscriptionStatus,
          role: subscription[0].role as UserRole,
          currentPeriodEnd: subscription[0].currentPeriodEnd,
          cancelAtPeriodEnd: subscription[0].cancelAtPeriodEnd,
        }
      }
    } catch (subError) {
      console.log("[v0] Subscription table may not exist yet:", subError)
    }

    return {
      userId: dbUser[0].id,
      plan: (dbUser[0].subscriptionPlan || "free") as SubscriptionPlan,
      status: "active" as SubscriptionStatus,
      role: dbUser[0].type as UserRole,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }
  } catch (error) {
    console.error("[v0] Error fetching user subscription:", error)
    return null
  }
}

export async function getUserUsageLimits() {
  try {
    console.log("[v0] Fetching user usage limits...")
    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    try {
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
    } catch (usageError) {
      console.log("[v0] UsageLimit table may not exist yet:", usageError)
      return {
        jobsPosted: 0,
        offersSubmitted: 0,
        messagesCount: 0,
      }
    }
  } catch (error) {
    console.error("[v0] Error fetching usage limits:", error)
    return {
      jobsPosted: 0,
      offersSubmitted: 0,
      messagesCount: 0,
    }
  }
}

export async function upgradeSubscription(plan: SubscriptionPlan, role: UserRole) {
  try {
    console.log("[v0] Upgrading subscription to:", plan, "for role:", role)
    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    console.log("[v0] Clerk User ID:", user.id)

    const dbUser = await sql`
      SELECT "id" FROM "User" WHERE "clerkId" = ${user.id}
    `

    console.log("[v0] DB User query result:", dbUser)

    if (!dbUser || dbUser.length === 0) {
      console.log("[v0] User not found, creating user first...")
      const newUser = await sql`
        INSERT INTO "User" (
          "clerkId", "email", "firstName", "lastName", "type", "subscriptionPlan"
        )
        VALUES (
          ${user.id},
          ${user.emailAddresses[0]?.emailAddress || ""},
          ${user.firstName || ""},
          ${user.lastName || ""},
          ${role},
          ${plan}
        )
        RETURNING "id"
      `
      console.log("[v0] Created new user:", newUser[0].id)

      const userId = newUser[0].id

      const currentPeriodEnd = new Date()
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

      try {
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
        console.log("[v0] Subscription created successfully")
      } catch (subError) {
        console.log("[v0] Could not create subscription (table may not exist):", subError)
        // Continue anyway - at least user is created with plan
      }

      return { success: true }
    }

    const userId = dbUser[0].id
    console.log("[v0] Found user ID:", userId)

    const currentPeriodEnd = new Date()
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

    try {
      const existingSubscription = await sql`
        SELECT "id" FROM "Subscription" WHERE "userId" = ${userId}
      `

      if (existingSubscription && existingSubscription.length > 0) {
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
        console.log("[v0] Subscription updated")
      } else {
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
        console.log("[v0] New subscription created")
      }
    } catch (subError) {
      console.log("[v0] Could not update/create subscription (table may not exist):", subError)
      // Continue to update user plan anyway
    }

    await sql`
      UPDATE "User"
      SET "subscriptionPlan" = ${plan}, "updatedAt" = NOW()
      WHERE "id" = ${userId}
    `
    console.log("[v0] User plan updated successfully")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error upgrading subscription:", error)
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
