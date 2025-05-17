"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { executeQuery } from "@/lib/db"
import { type PaginationOptions, paginatedQuery } from "@/lib/db-utils"

export async function getNotifications(options: PaginationOptions = {}) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to view notifications")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return {
        notifications: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0, hasMore: false },
      }
    }

    const dbUserId = userResult[0].id

    // Get notifications for this user with pagination
    const query = `SELECT * FROM "Notification" WHERE "userId" = $1`
    const countQuery = `SELECT COUNT(*) FROM "Notification" WHERE "userId" = $1`

    const result = await paginatedQuery(query, countQuery, [dbUserId], options)

    return {
      notifications: result.data.map((notification) => ({
        ...notification,
        data: notification.data ? JSON.parse(notification.data) : {},
        createdAt: new Date(notification.createdAt),
        updatedAt: new Date(notification.updatedAt),
      })),
      pagination: result.pagination,
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw new Error("Failed to fetch notifications. Please try again.")
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to update notifications")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    // Get notification details
    const notificationResult = await executeQuery(`SELECT * FROM "Notification" WHERE "id" = $1`, [notificationId])

    if (notificationResult.length === 0) {
      throw new Error("Notification not found")
    }

    const notification = notificationResult[0]

    // Check if notification belongs to the user
    if (notification.userId !== dbUserId) {
      throw new Error("You don't have permission to update this notification")
    }

    // Update notification
    await executeQuery(`UPDATE "Notification" SET "isRead" = true, "updatedAt" = $1 WHERE "id" = $2`, [
      new Date(),
      notificationId,
    ])

    // Revalidate the notifications page
    revalidatePath("/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("Failed to update notification. Please try again.")
  }
}

export async function markAllNotificationsAsRead() {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to update notifications")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    // Update all notifications for this user
    await executeQuery(
      `UPDATE "Notification" SET "isRead" = true, "updatedAt" = $1 WHERE "userId" = $2 AND "isRead" = false`,
      [new Date(), dbUserId],
    )

    // Revalidate the notifications page
    revalidatePath("/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw new Error("Failed to update notifications. Please try again.")
  }
}

export async function getUnreadNotificationCount() {
  const { userId } = auth()

  if (!userId) {
    return 0
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return 0
    }

    const dbUserId = userResult[0].id

    // Count unread notifications
    const result = await executeQuery(`SELECT COUNT(*) FROM "Notification" WHERE "userId" = $1 AND "isRead" = false`, [
      dbUserId,
    ])

    return Number.parseInt(result[0].count)
  } catch (error) {
    console.error("Error counting unread notifications:", error)
    return 0
  }
}
