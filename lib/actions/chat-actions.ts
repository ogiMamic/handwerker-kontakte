"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

interface SendMessageParams {
  jobId: string
  content: string
  attachments?: string[]
}

export async function sendMessage({ jobId, content, attachments }: SendMessageParams) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to send a message")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    // Check if job exists
    const jobResult = await executeQuery(`SELECT * FROM "Job" WHERE "id" = $1`, [jobId])

    if (jobResult.length === 0) {
      throw new Error("Job not found")
    }

    // Create the message
    const messageId = uuidv4()
    await executeQuery(
      `INSERT INTO "Message" (
        "id", "content", "attachments", "jobId", "senderId", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )`,
      [messageId, content, attachments || [], jobId, dbUserId, new Date(), new Date()],
    )

    // Create notification for the other party
    const job = jobResult[0]
    const recipientId = dbUserId === job.clientId ? job.craftsmanId : job.clientId

    if (recipientId) {
      const notificationId = uuidv4()
      await executeQuery(
        `INSERT INTO "Notification" (
          "id", "type", "title", "message", "isRead", "userId", "createdAt", "updatedAt", "data"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )`,
        [
          notificationId,
          "MESSAGE_RECEIVED",
          "New Message",
          `You have a new message for job: ${job.title}`,
          false,
          recipientId,
          new Date(),
          new Date(),
          JSON.stringify({ jobId, messageId }),
        ],
      )
    }

    // Revalidate the chat page to show the new message
    revalidatePath(`/chat/${jobId}`)

    return { success: true, messageId }
  } catch (error) {
    console.error("Error sending message:", error)
    throw new Error("Failed to send message. Please try again.")
  }
}

export async function getMessages(jobId: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to view messages")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    // Check if job exists and user has access to it
    const jobResult = await executeQuery(`SELECT * FROM "Job" WHERE "id" = $1`, [jobId])

    if (jobResult.length === 0) {
      throw new Error("Job not found")
    }

    const job = jobResult[0]
    const dbUserId = userResult[0].id

    // Verify user has access to this job
    if (job.clientId !== dbUserId && job.craftsmanId !== dbUserId) {
      throw new Error("You don't have access to this job")
    }

    // Get messages for this job
    const messages = await executeQuery(
      `SELECT m.*, u.name as "senderName", u.imageUrl as "senderAvatar" 
       FROM "Message" m
       JOIN "User" u ON m."senderId" = u.id
       WHERE m."jobId" = $1
       ORDER BY m."createdAt" ASC`,
      [jobId],
    )

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      attachments: message.attachments,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      createdAt: new Date(message.createdAt),
    }))
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw new Error("Failed to fetch messages. Please try again.")
  }
}
