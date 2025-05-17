"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Profile schema for validation
const profileSchema = z.object({
  companyName: z.string().min(2),
  contactPerson: z.string().min(2),
  phone: z.string().min(5),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().min(20),
  serviceRadius: z.number().min(1),
  hourlyRate: z.number().min(1),
  skills: z.array(z.string()).min(1),
})

// Business schema for validation
const businessSchema = z.object({
  businessLicense: z.string().min(1),
  taxId: z.string().min(1),
  businessAddress: z.string().min(5),
  businessCity: z.string().min(2),
  businessPostalCode: z.string().regex(/^\d{5}$/),
  foundingYear: z.number().min(1900).max(new Date().getFullYear()),
  insuranceProvider: z.string().min(1),
  insurancePolicyNumber: z.string().min(1),
})

// Availability schema for validation
const availabilitySchema = z.object({
  availableDays: z.array(z.string()),
  workHoursStart: z.string(),
  workHoursEnd: z.string(),
  vacationDates: z.array(z.date()).optional(),
})

type ProfileUpdateParams =
  | { type: "profile"; data: z.infer<typeof profileSchema> }
  | { type: "business"; data: z.infer<typeof businessSchema> }
  | { type: "availability"; data: z.infer<typeof availabilitySchema> }

export async function updateCraftsmanProfile(params: ProfileUpdateParams) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to update your profile")
  }

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
        [newUserId, userId, "placeholder@example.com", "New Craftsman", "CRAFTSMAN"],
      )
      dbUserId = newUserId
    } else {
      dbUserId = userResult[0].id

      // Update user type to CRAFTSMAN if it's not already
      if (userResult[0].type !== "CRAFTSMAN") {
        await executeQuery(`UPDATE "User" SET "type" = 'CRAFTSMAN', "updatedAt" = $1 WHERE "id" = $2`, [
          new Date(),
          dbUserId,
        ])
      }
    }

    // Check if craftsman profile exists
    const profileResult = await executeQuery(`SELECT * FROM "CraftsmanProfile" WHERE "userId" = $1`, [dbUserId])

    const profileExists = profileResult.length > 0
    let validatedData

    switch (params.type) {
      case "profile":
        validatedData = profileSchema.parse(params.data)
        if (profileExists) {
          await executeQuery(
            `UPDATE "CraftsmanProfile" SET 
             "companyName" = $1, "contactPerson" = $2, "phone" = $3, 
             "website" = $4, "description" = $5, "serviceRadius" = $6, 
             "hourlyRate" = $7, "skills" = $8, "updatedAt" = $9
             WHERE "userId" = $10`,
            [
              validatedData.companyName,
              validatedData.contactPerson,
              validatedData.phone,
              validatedData.website || null,
              validatedData.description,
              validatedData.serviceRadius,
              validatedData.hourlyRate,
              validatedData.skills,
              new Date(),
              dbUserId,
            ],
          )
        } else {
          const profileId = uuidv4()
          await executeQuery(
            `INSERT INTO "CraftsmanProfile" (
              "id", "userId", "companyName", "contactPerson", "phone", 
              "website", "description", "serviceRadius", "hourlyRate", 
              "skills", "businessLicense", "taxId", "businessAddress", 
              "businessCity", "businessPostalCode", "foundingYear", 
              "insuranceProvider", "insurancePolicyNumber", "availableDays", 
              "workHoursStart", "workHoursEnd", "createdAt", "updatedAt"
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
              $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
            )`,
            [
              profileId,
              dbUserId,
              validatedData.companyName,
              validatedData.contactPerson,
              validatedData.phone,
              validatedData.website || null,
              validatedData.description,
              validatedData.serviceRadius,
              validatedData.hourlyRate,
              validatedData.skills,
              "", // placeholder for businessLicense
              "", // placeholder for taxId
              "", // placeholder for businessAddress
              "", // placeholder for businessCity
              "", // placeholder for businessPostalCode
              2020, // placeholder for foundingYear
              "", // placeholder for insuranceProvider
              "", // placeholder for insurancePolicyNumber
              ["monday", "tuesday", "wednesday", "thursday", "friday"], // default availableDays
              "09:00", // default workHoursStart
              "17:00", // default workHoursEnd
              new Date(),
              new Date(),
            ],
          )
        }
        break

      case "business":
        validatedData = businessSchema.parse(params.data)
        if (profileExists) {
          await executeQuery(
            `UPDATE "CraftsmanProfile" SET 
             "businessLicense" = $1, "taxId" = $2, "businessAddress" = $3, 
             "businessCity" = $4, "businessPostalCode" = $5, "foundingYear" = $6, 
             "insuranceProvider" = $7, "insurancePolicyNumber" = $8, "updatedAt" = $9
             WHERE "userId" = $10`,
            [
              validatedData.businessLicense,
              validatedData.taxId,
              validatedData.businessAddress,
              validatedData.businessCity,
              validatedData.businessPostalCode,
              validatedData.foundingYear,
              validatedData.insuranceProvider,
              validatedData.insurancePolicyNumber,
              new Date(),
              dbUserId,
            ],
          )
        } else {
          throw new Error("Profile must be created before adding business details")
        }
        break

      case "availability":
        validatedData = availabilitySchema.parse(params.data)
        if (profileExists) {
          await executeQuery(
            `UPDATE "CraftsmanProfile" SET 
             "availableDays" = $1, "workHoursStart" = $2, "workHoursEnd" = $3, 
             "vacationDates" = $4, "updatedAt" = $5
             WHERE "userId" = $6`,
            [
              validatedData.availableDays,
              validatedData.workHoursStart,
              validatedData.workHoursEnd,
              validatedData.vacationDates || [],
              new Date(),
              dbUserId,
            ],
          )
        } else {
          throw new Error("Profile must be created before adding availability")
        }
        break
    }

    // Revalidate the profile page to show the updated data
    revalidatePath("/craftsman/profile")

    return { success: true }
  } catch (error) {
    console.error(`Error updating ${params.type}:`, error)
    throw new Error(`Failed to update ${params.type}. Please try again.`)
  }
}
