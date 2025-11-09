"use server"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import type { PaginationOptions, PaginatedResult } from "@/lib/db-utils"

// Formularschema für die Handwerkerregistrierung
const craftsmanSchema = z.object({
  companyName: z.string().min(2),
  contactPerson: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(5),
  postalCode: z.string().min(5),
  city: z.string().min(2),
  description: z.string().min(10),
  skills: z.array(z.string()).min(1),
  hourlyRate: z.number().min(10),
  termsAccepted: z.literal(true),
})

export type CraftsmanFormValues = z.infer<typeof craftsmanSchema>

export async function registerCraftsman(data: CraftsmanFormValues) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    // Validiere die Formulardaten
    const validatedData = craftsmanSchema.parse(data)

    // Prüfe ob User bereits existiert, wenn nicht erstelle ihn
    const userResult = await executeQuery(`SELECT * FROM "User" WHERE "clerkId" = $1`, [userId])

    let dbUserId
    if (userResult.length === 0) {
      // Erstelle neuen User
      dbUserId = uuidv4()
      await executeQuery(
        `INSERT INTO "User" ("id", "clerkId", "email", "name", "type", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [dbUserId, userId, validatedData.email, validatedData.contactPerson, "CRAFTSMAN", new Date(), new Date()],
      )
    } else {
      dbUserId = userResult[0].id
      // Update user type to CRAFTSMAN
      await executeQuery(`UPDATE "User" SET "type" = $1, "name" = $2, "email" = $3, "updatedAt" = $4 WHERE "id" = $5`, [
        "CRAFTSMAN",
        validatedData.contactPerson,
        validatedData.email,
        new Date(),
        dbUserId,
      ])
    }

    // Prüfe ob CraftsmanProfile bereits existiert
    const profileResult = await executeQuery(`SELECT * FROM "CraftsmanProfile" WHERE "userId" = $1`, [dbUserId])

    const profileId = uuidv4()
    if (profileResult.length === 0) {
      // Erstelle neues CraftsmanProfile
      await executeQuery(
        `INSERT INTO "CraftsmanProfile" (
          "id", "userId", "companyName", "contactPerson", "phone", "description", 
          "hourlyRate", "skills", "businessAddress", "businessCity", "businessPostalCode",
          "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          profileId,
          dbUserId,
          validatedData.companyName,
          validatedData.contactPerson,
          validatedData.phone,
          validatedData.description,
          validatedData.hourlyRate,
          validatedData.skills,
          validatedData.address,
          validatedData.city,
          validatedData.postalCode,
          new Date(),
          new Date(),
        ],
      )
    } else {
      // Update existierendes CraftsmanProfile
      await executeQuery(
        `UPDATE "CraftsmanProfile" SET 
          "companyName" = $1, "contactPerson" = $2, "phone" = $3, "description" = $4,
          "hourlyRate" = $5, "skills" = $6, "businessAddress" = $7, "businessCity" = $8,
          "businessPostalCode" = $9, "updatedAt" = $10
         WHERE "userId" = $11`,
        [
          validatedData.companyName,
          validatedData.contactPerson,
          validatedData.phone,
          validatedData.description,
          validatedData.hourlyRate,
          validatedData.skills,
          validatedData.address,
          validatedData.city,
          validatedData.postalCode,
          new Date(),
          dbUserId,
        ],
      )
    }

    // Revalidiere die Pfade
    revalidatePath("/[lang]/dashboard")
    revalidatePath("/[lang]/handwerker")
    revalidatePath("/[lang]/profil")

    return { success: true, data: { id: profileId, userId: dbUserId } }
  } catch (error) {
    console.error("Error registering craftsman:", error)
    throw new Error("Failed to register craftsman")
  }
}

export async function getCraftsmanProfile(userId: string) {
  try {
    // Hole User und CraftsmanProfile aus der Datenbank
    const result = await executeQuery(
      `SELECT 
        u.*, 
        cp.*
       FROM "User" u
       LEFT JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
       WHERE u."clerkId" = $1`,
      [userId],
    )

    if (result.length === 0) {
      return null
    }

    const user = result[0]

    if (!user.companyName) {
      // User existiert aber hat kein CraftsmanProfile
      return null
    }

    return {
      id: user.id,
      userId: user.userId,
      companyName: user.companyName,
      contactPerson: user.contactPerson,
      email: user.email,
      phone: user.phone,
      address: user.businessAddress,
      postalCode: user.businessPostalCode,
      city: user.businessCity,
      description: user.description,
      skills: user.skills || [],
      hourlyRate: Number.parseFloat(user.hourlyRate),
      isVerified: user.isVerified,
      businessLicense: user.businessLicense,
      taxId: user.taxId,
      businessAddress: user.businessAddress,
      businessCity: user.businessCity,
      businessPostalCode: user.businessPostalCode,
      foundingYear: user.foundingYear,
      insuranceProvider: user.insuranceProvider,
      insurancePolicyNumber: user.insurancePolicyNumber,
      availableDays: user.availableDays || ["monday", "tuesday", "wednesday", "thursday", "friday"],
      workHoursStart: user.workHoursStart || "08:00",
      workHoursEnd: user.workHoursEnd || "17:00",
      vacationDates: user.vacationDates || [],
      completionPercentage: calculateCompletionPercentage(user),
    }
  } catch (error) {
    console.error("Error getting craftsman profile:", error)
    return null
  }
}

function calculateCompletionPercentage(profile: any): number {
  const requiredFields = [
    "companyName",
    "contactPerson",
    "phone",
    "description",
    "businessAddress",
    "businessCity",
    "businessPostalCode",
  ]

  const optionalFields = [
    "website",
    "businessLicense",
    "taxId",
    "foundingYear",
    "insuranceProvider",
    "insurancePolicyNumber",
  ]

  const requiredCompleted = requiredFields.filter((field) => profile[field]).length
  const optionalCompleted = optionalFields.filter((field) => profile[field]).length

  const requiredWeight = 0.7
  const optionalWeight = 0.3

  const requiredPercentage = (requiredCompleted / requiredFields.length) * requiredWeight
  const optionalPercentage = (optionalCompleted / optionalFields.length) * optionalWeight

  return Math.round((requiredPercentage + optionalPercentage) * 100)
}

export async function getCraftsmen(
  options: PaginationOptions = {},
  filters: any = {},
): Promise<PaginatedResult<any> & { sponsored: any[] }> {
  try {
    const page = options.page || 1
    const limit = options.limit || 20
    const offset = (page - 1) * limit

    let whereClause = 'WHERE cp."id" IS NOT NULL'
    const params: any[] = []
    let paramIndex = 1

    const sponsoredQuery = `
      SELECT 
        u.id, u.name, u.email, u."imageUrl",
        cp."companyName", cp."businessPostalCode", cp."businessCity", 
        cp.phone, cp."hourlyRate", cp."isVerified", cp.skills,
        cp."createdAt",
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'COMPLETED') as "completedJobs",
        sc.priority
      FROM "User" u
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      LEFT JOIN "Review" r ON r."targetId" = u.id
      LEFT JOIN "Job" j ON j."craftsmanId" = u.id
      JOIN "SponsoredCraftsman" sc ON sc."craftsmanId" = u.id
      WHERE (sc."endDate" IS NULL OR sc."endDate" > NOW())
      GROUP BY u.id, cp."id", cp."companyName", cp."businessPostalCode", 
               cp."businessCity", cp.phone, cp."hourlyRate", cp."isVerified", 
               cp.skills, cp."createdAt", sc.priority
      ORDER BY sc.priority ASC, cp."createdAt" DESC
      LIMIT 3
    `
    const sponsoredCraftsmen = await executeQuery(sponsoredQuery, [])
    const sponsoredIds = sponsoredCraftsmen.map((c: any) => c.id)

    if (sponsoredIds.length > 0) {
      whereClause += ` AND u.id NOT IN (${sponsoredIds.map((_, i) => `$${paramIndex + i}`).join(", ")})`
      params.push(...sponsoredIds)
      paramIndex += sponsoredIds.length
    }

    // Filter nach PLZ
    if (filters.postalCode) {
      whereClause += ` AND cp."businessPostalCode" LIKE $${paramIndex}`
      params.push(`${filters.postalCode.substring(0, 2)}%`)
      paramIndex++
    }

    // Filter nach Fähigkeit
    if (filters.skill && filters.skill !== "all") {
      whereClause += ` AND $${paramIndex} = ANY(cp.skills)`
      params.push(filters.skill)
      paramIndex++
    }

    if (filters.maxHourlyRate && filters.maxHourlyRate < 200) {
      whereClause += ` AND cp."hourlyRate" <= $${paramIndex}`
      params.push(filters.maxHourlyRate)
      paramIndex++
    }

    // Hole Gesamtanzahl
    const countQuery = `
      SELECT COUNT(*) as total
      FROM "User" u
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      ${whereClause}
    `
    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Hole paginierte Daten
    const dataQuery = `
      SELECT 
        u.id, u.name, u.email, u."imageUrl",
        cp."companyName", cp."businessPostalCode", cp."businessCity", 
        cp.phone, cp."hourlyRate", cp."isVerified", cp.skills,
        cp."createdAt",
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'COMPLETED') as "completedJobs"
      FROM "User" u
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      LEFT JOIN "Review" r ON r."targetId" = u.id
      LEFT JOIN "Job" j ON j."craftsmanId" = u.id
      ${whereClause}
      GROUP BY u.id, cp."id", cp."companyName", cp."businessPostalCode", 
               cp."businessCity", cp.phone, cp."hourlyRate", cp."isVerified", 
               cp.skills, cp."createdAt"
      ORDER BY cp."createdAt" DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    const craftsmen = await executeQuery(dataQuery, params)

    const totalPages = Math.ceil(total / limit)

    return {
      data: craftsmen.map((c: any) => ({
        id: c.id,
        userId: c.id,
        name: c.name,
        email: c.email,
        imageUrl: c.imageUrl,
        companyName: c.companyName,
        businessPostalCode: c.businessPostalCode,
        businessCity: c.businessCity,
        phone: c.phone,
        hourlyRate: Number.parseFloat(c.hourlyRate),
        isVerified: c.isVerified,
        skills: c.skills || [],
        completedJobs: Number.parseInt(c.completedJobs) || 0,
        averageRating: c.averageRating ? Number.parseFloat(c.averageRating) : null,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(),
      })),
      sponsored: sponsoredCraftsmen.map((c: any) => ({
        id: c.id,
        userId: c.id,
        name: c.name,
        email: c.email,
        imageUrl: c.imageUrl,
        companyName: c.companyName,
        businessPostalCode: c.businessPostalCode,
        businessCity: c.businessCity,
        phone: c.phone,
        hourlyRate: Number.parseFloat(c.hourlyRate),
        isVerified: c.isVerified,
        skills: c.skills || [],
        completedJobs: Number.parseInt(c.completedJobs) || 0,
        averageRating: c.averageRating ? Number.parseFloat(c.averageRating) : null,
        isSponsored: true,
        priority: c.priority,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching craftsmen:", error)
    throw new Error("Failed to fetch craftsmen")
  }
}

export async function updateCraftsmanProfile(updateData: {
  type: "profile" | "business" | "availability"
  data: any
}) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Sie müssen angemeldet sein, um Ihr Profil zu aktualisieren")
  }

  try {
    // Hole User ID aus der Datenbank
    const userResult = await executeQuery(`SELECT id FROM "User" WHERE "clerkId" = $1`, [userId])

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const dbUserId = userResult[0].id

    if (updateData.type === "profile") {
      await executeQuery(
        `UPDATE "CraftsmanProfile" SET 
          "companyName" = $1, "contactPerson" = $2, "phone" = $3, "website" = $4,
          "description" = $5, "hourlyRate" = $6, "skills" = $7, "updatedAt" = $8
         WHERE "userId" = $9`,
        [
          updateData.data.companyName,
          updateData.data.contactPerson,
          updateData.data.phone,
          updateData.data.website,
          updateData.data.description,
          updateData.data.hourlyRate,
          updateData.data.skills,
          new Date(),
          dbUserId,
        ],
      )
    } else if (updateData.type === "business") {
      await executeQuery(
        `UPDATE "CraftsmanProfile" SET 
          "businessLicense" = $1, "taxId" = $2, "businessAddress" = $3, 
          "businessCity" = $4, "businessPostalCode" = $5, "foundingYear" = $6,
          "insuranceProvider" = $7, "insurancePolicyNumber" = $8, "updatedAt" = $9
         WHERE "userId" = $10`,
        [
          updateData.data.businessLicense,
          updateData.data.taxId,
          updateData.data.businessAddress,
          updateData.data.businessCity,
          updateData.data.businessPostalCode,
          updateData.data.foundingYear,
          updateData.data.insuranceProvider,
          updateData.data.insurancePolicyNumber,
          new Date(),
          dbUserId,
        ],
      )
    } else if (updateData.type === "availability") {
      await executeQuery(
        `UPDATE "CraftsmanProfile" SET 
          "availableDays" = $1, "workHoursStart" = $2, "workHoursEnd" = $3, 
          "vacationDates" = $4, "updatedAt" = $5
         WHERE "userId" = $6`,
        [
          updateData.data.availableDays,
          updateData.data.workHoursStart,
          updateData.data.workHoursEnd,
          updateData.data.vacationDates,
          new Date(),
          dbUserId,
        ],
      )
    }

    // Revalidiere alle relevanten Pfade
    revalidatePath("/[lang]/dashboard")
    revalidatePath("/[lang]/handwerker")
    revalidatePath("/[lang]/profil")

    return { success: true }
  } catch (error) {
    console.error("Fehler bei der Aktualisierung des Handwerkerprofils:", error)
    throw new Error("Das Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.")
  }
}

export async function getCraftsmanById(id: string) {
  try {
    const result = await executeQuery(
      `SELECT 
        u.id, u.name, u.email, u."imageUrl",
        cp."companyName", cp."businessPostalCode", cp."businessCity", 
        cp.phone, cp."hourlyRate", cp."isVerified", cp.skills,
        cp.description, cp."businessAddress",
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'COMPLETED') as "completedJobs",
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'title', p.title,
              'description', p.description,
              'imageUrl', p."imageUrl",
              'category', p.category
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) as portfolio
      FROM "User" u
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      LEFT JOIN "Review" r ON r."targetId" = u.id
      LEFT JOIN "Job" j ON j."craftsmanId" = u.id
      LEFT JOIN "Portfolio" p ON p."craftsmanId" = u.id
      WHERE u.id = $1
      GROUP BY u.id, cp."id", cp."companyName", cp."businessPostalCode", 
               cp."businessCity", cp.phone, cp."hourlyRate", cp."isVerified", 
               cp.skills, cp.description, cp."businessAddress"`,
      [id],
    )

    if (!result || result.length === 0) {
      return null
    }

    const craftsman = result[0]

    return {
      id: craftsman.id,
      name: craftsman.name,
      email: craftsman.email,
      imageUrl: craftsman.imageUrl,
      companyName: craftsman.companyName,
      businessPostalCode: craftsman.businessPostalCode,
      businessCity: craftsman.businessCity,
      businessAddress: craftsman.businessAddress,
      phone: craftsman.phone,
      hourlyRate: Number.parseFloat(craftsman.hourlyRate),
      isVerified: craftsman.isVerified,
      skills: craftsman.skills || [],
      averageRating: craftsman.averageRating ? Number.parseFloat(craftsman.averageRating) : null,
      completedJobs: Number.parseInt(craftsman.completedJobs) || 0,
      description: craftsman.description,
      portfolio: craftsman.portfolio || [],
    }
  } catch (error) {
    console.error("[v0] Error fetching craftsman:", error)
    return null
  }
}
