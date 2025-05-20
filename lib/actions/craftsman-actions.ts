"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { executeQuery } from "@/lib/db"

export async function registerCraftsman(data: any) {
  try {
    const { userId } = auth()

    // Generate a unique ID for the craftsman
    const craftsmanId = uuidv4()

    // If user is logged in, associate the craftsman with the user
    if (userId) {
      // Check if user already exists in our database
      const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

      let dbUserId

      if (userResult.length === 0) {
        // Create a new user
        dbUserId = uuidv4()
        await executeQuery(
          `INSERT INTO "User" ("id", "clerkId", "email", "name", "type") 
           VALUES ($1, $2, $3, $4, $5)`,
          [dbUserId, userId, data.email, data.contactPerson, "CRAFTSMAN"],
        )
      } else {
        dbUserId = userResult[0].id
        // Update user type if needed
        if (userResult[0].type !== "CRAFTSMAN") {
          await executeQuery(`UPDATE "User" SET "type" = $1 WHERE "id" = $2`, ["CRAFTSMAN", dbUserId])
        }
      }

      // Create craftsman profile
      await executeQuery(
        `INSERT INTO "CraftsmanProfile" (
          "id", "userId", "companyName", "contactPerson", "phone", 
          "address", "postalCode", "city", "description", "skills", 
          "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          craftsmanId,
          dbUserId,
          data.companyName,
          data.contactPerson,
          data.phone,
          data.address,
          data.postalCode,
          data.city,
          data.description,
          data.services,
          new Date(),
          new Date(),
        ],
      )
    } else {
      // Handle registration without authentication
      // Store data temporarily and send verification email
      // This is a simplified version - in a real app, you'd want to implement email verification
      await executeQuery(
        `INSERT INTO "PendingCraftsman" (
          "id", "email", "companyName", "contactPerson", "phone", 
          "address", "postalCode", "city", "description", "services", 
          "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          craftsmanId,
          data.email,
          data.companyName,
          data.contactPerson,
          data.phone,
          data.address,
          data.postalCode,
          data.city,
          data.description,
          data.services,
          new Date(),
        ],
      )
    }

    // Revalidate relevant paths
    revalidatePath("/handwerker")

    return { success: true, id: craftsmanId }
  } catch (error) {
    console.error("Error registering craftsman:", error)
    throw new Error("Failed to register craftsman. Please try again.")
  }
}

export async function updateCraftsmanProfile({ type, data }: { type: string; data: any }) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to update your profile")
  }

  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    // Get craftsman profile
    const profileResult = await executeQuery(`SELECT * FROM "CraftsmanProfile" WHERE "userId" = $1`, [dbUserId])

    if (profileResult.length === 0) {
      throw new Error("Craftsman profile not found")
    }

    const profileId = profileResult[0].id

    // Update profile based on type
    switch (type) {
      case "profile":
        await executeQuery(
          `UPDATE "CraftsmanProfile" SET 
           "companyName" = $1, "contactPerson" = $2, "phone" = $3, 
           "description" = $4, "serviceRadius" = $5, "hourlyRate" = $6, 
           "skills" = $7, "updatedAt" = $8
           WHERE "id" = $9`,
          [
            data.companyName,
            data.contactPerson,
            data.phone,
            data.description,
            data.serviceRadius,
            data.hourlyRate,
            data.skills,
            new Date(),
            profileId,
          ],
        )
        break

      case "business":
        await executeQuery(
          `UPDATE "CraftsmanProfile" SET 
           "businessLicense" = $1, "taxId" = $2, "businessAddress" = $3, 
           "businessCity" = $4, "businessPostalCode" = $5, "foundingYear" = $6, 
           "insuranceProvider" = $7, "insurancePolicyNumber" = $8, "updatedAt" = $9
           WHERE "id" = $10`,
          [
            data.businessLicense,
            data.taxId,
            data.businessAddress,
            data.businessCity,
            data.businessPostalCode,
            data.foundingYear,
            data.insuranceProvider,
            data.insurancePolicyNumber,
            new Date(),
            profileId,
          ],
        )
        break

      case "availability":
        await executeQuery(
          `UPDATE "CraftsmanProfile" SET 
           "availableDays" = $1, "workHoursStart" = $2, "workHoursEnd" = $3, 
           "vacationDates" = $4, "updatedAt" = $5
           WHERE "id" = $6`,
          [data.availableDays, data.workHoursStart, data.workHoursEnd, data.vacationDates, new Date(), profileId],
        )
        break

      default:
        throw new Error("Invalid update type")
    }

    // Revalidate paths
    revalidatePath("/handwerker/profil")

    return { success: true }
  } catch (error) {
    console.error("Error updating craftsman profile:", error)
    throw new Error("Failed to update profile. Please try again.")
  }
}
