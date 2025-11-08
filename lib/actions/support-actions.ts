"use server"

import { neon } from "@neondatabase/serverless"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function createSupportTicket(data: {
  subject: string
  description: string
  category: "technical" | "billing" | "general"
}) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Get user's subscription to set priority
    const subscriptions = await sql`
      SELECT plan FROM "Subscription"
      WHERE "userId" = ${userId}
      AND "status" = 'active'
      ORDER BY "currentPeriodEnd" DESC
      LIMIT 1
    `

    const plan = subscriptions[0]?.plan || "basic"

    // Set priority based on plan
    let priority = "normal"
    if (plan.includes("business")) {
      priority = "high"
    } else if (plan.includes("premium") || plan.includes("professional")) {
      priority = "high"
    }

    const result = await sql`
      INSERT INTO "SupportTicket" (
        "userId",
        "subject",
        "description",
        "category",
        "priority"
      ) VALUES (
        ${userId},
        ${data.subject},
        ${data.description},
        ${data.category},
        ${priority}
      )
      RETURNING *
    `

    revalidatePath("/support")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return { success: false, error: "Failed to create support ticket" }
  }
}

export async function getUserSupportTickets() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const tickets = await sql`
      SELECT * FROM "SupportTicket"
      WHERE "userId" = ${userId}
      ORDER BY 
        CASE "status"
          WHEN 'open' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'resolved' THEN 3
          WHEN 'closed' THEN 4
        END,
        "createdAt" DESC
    `

    return { success: true, data: tickets }
  } catch (error) {
    console.error("Error fetching support tickets:", error)
    return { success: false, error: "Failed to fetch support tickets" }
  }
}

export async function getSupportTicketMessages(ticketId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify ticket ownership
    const tickets = await sql`
      SELECT * FROM "SupportTicket"
      WHERE "id" = ${ticketId} AND "userId" = ${userId}
    `

    if (tickets.length === 0) {
      return { success: false, error: "Ticket not found" }
    }

    const messages = await sql`
      SELECT m.*, u."name", u."imageUrl"
      FROM "SupportTicketMessage" m
      JOIN "User" u ON m."senderId" = u."id"
      WHERE m."ticketId" = ${ticketId}
      ORDER BY m."createdAt" ASC
    `

    return { success: true, data: messages }
  } catch (error) {
    console.error("Error fetching ticket messages:", error)
    return { success: false, error: "Failed to fetch messages" }
  }
}

export async function addSupportTicketMessage(ticketId: string, message: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify ticket ownership
    const tickets = await sql`
      SELECT * FROM "SupportTicket"
      WHERE "id" = ${ticketId} AND "userId" = ${userId}
    `

    if (tickets.length === 0) {
      return { success: false, error: "Ticket not found" }
    }

    const result = await sql`
      INSERT INTO "SupportTicketMessage" (
        "ticketId",
        "senderId",
        "message"
      ) VALUES (
        ${ticketId},
        ${userId},
        ${message}
      )
      RETURNING *
    `

    // Update ticket status if closed
    await sql`
      UPDATE "SupportTicket"
      SET 
        "status" = CASE WHEN "status" = 'closed' THEN 'open' ELSE "status" END,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${ticketId}
    `

    revalidatePath(`/support/${ticketId}`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error adding ticket message:", error)
    return { success: false, error: "Failed to add message" }
  }
}
