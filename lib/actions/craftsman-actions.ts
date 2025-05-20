"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Craftsman registration schema
const craftsmanSchema = z.object({
  companyName: z.string().min(2),
  contactPerson: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(5),
  postalCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(2),
  description: z.string().min(20),
  services: z.array(z.string()).min(1),
  termsAccepted: z.literal(true),
})

export type CraftsmanFormValues = z.infer<typeof craftsmanSchema>

export async function registerCraftsman(formData: CraftsmanFormValues) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Sie müssen angemeldet sein, um sich als Handwerker zu registrieren")
  }

  // Validate the form data
  const validatedData = craftsmanSchema.parse(formData)

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
        [newUserId, userId, validatedData.email, validatedData.contactPerson, "CRAFTSMAN"],
      )
      dbUserId = newUserId
    } else {
      dbUserId = userResult[0].id
      // Update user type to CRAFTSMAN if they were a CLIENT before
      await executeQuery(`UPDATE "User" SET "type" = 'CRAFTSMAN' WHERE "id" = $1`, [dbUserId])
    }

    // Check if craftsman profile already exists
    const profileResult = await executeQuery(`SELECT * FROM "CraftsmanProfile" WHERE "userId" = $1`, [dbUserId])

    if (profileResult.length === 0) {
      // Create new craftsman profile
      await executeQuery(
        `INSERT INTO "CraftsmanProfile" (
          "id", "userId", "companyName", "contactPerson", "email", 
          "phone", "address", "postalCode", "city", "description", 
          "skills", "hourlyRate", "isVerified", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )`,
        [
          uuidv4(),
          dbUserId,
          validatedData.companyName,
          validatedData.contactPerson,
          validatedData.email,
          validatedData.phone,
          validatedData.address,
          validatedData.postalCode,
          validatedData.city,
          validatedData.description,
          validatedData.services,
          0, // Default hourly rate
          false, // Not verified by default
          new Date(),
          new Date(),
        ],
      )
    } else {
      // Update existing craftsman profile
      await executeQuery(
        `UPDATE "CraftsmanProfile" SET 
          "companyName" = $1, "contactPerson" = $2, "email" = $3, 
          "phone" = $4, "address" = $5, "postalCode" = $6, 
          "city" = $7, "description" = $8, "skills" = $9, 
          "updatedAt" = $10
        WHERE "userId" = $11`,
        [
          validatedData.companyName,
          validatedData.contactPerson,
          validatedData.email,
          validatedData.phone,
          validatedData.address,
          validatedData.postalCode,
          validatedData.city,
          validatedData.description,
          validatedData.services,
          new Date(),
          dbUserId,
        ],
      )
    }

    // Create notification for admin
    await executeQuery(
      `INSERT INTO "Notification" (
        "id", "type", "title", "message", "isRead", "userId", "data", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )`,
      [
        uuidv4(),
        "CRAFTSMAN_REGISTERED",
        "Neue Handwerker-Registrierung",
        `${validatedData.companyName} hat sich als Handwerker registriert.`,
        false,
        "admin", // Admin user ID
        JSON.stringify({ craftsmanId: dbUserId }),
        new Date(),
        new Date(),
      ],
    )

    // Revalidate paths
    revalidatePath("/handwerker")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error registering craftsman:", error)
    throw new Error("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.")
  }
}

export async function getCraftsmanProfile(userId: string) {
  try {
    // Get user from database
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      return null
    }

    const dbUserId = userResult[0].id

    // Get craftsman profile
    const profileResult = await executeQuery(`SELECT * FROM "CraftsmanProfile" WHERE "userId" = $1`, [dbUserId])

    if (profileResult.length === 0) {
      return null
    }

    return {
      ...profileResult[0],
      hourlyRate: Number.parseFloat(profileResult[0].hourlyRate),
      createdAt: new Date(profileResult[0].createdAt),
      updatedAt: new Date(profileResult[0].updatedAt),
    }
  } catch (error) {
    console.error("Error fetching craftsman profile:", error)
    throw new Error("Fehler beim Abrufen des Handwerkerprofils. Bitte versuchen Sie es erneut.")
  }
}
