"use server"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import type { PaginationOptions, PaginatedResult } from "@/lib/db-utils"
import { CITY_TO_SLUG, SKILL_TO_GEWERK } from "@/lib/handwerker-dynamic/types"

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
      // Derive SEO slugs from form input
      const stadtSlug = CITY_TO_SLUG[validatedData.city] ?? null;
      const gewerkSlugs = validatedData.skills
        .map((s: string) => SKILL_TO_GEWERK[s])
        .filter(Boolean);

      // Erstelle neues CraftsmanProfile
      await executeQuery(
        `INSERT INTO "CraftsmanProfile" (
          "id", "userId", "companyName", "contactPerson", "phone", "description",
          "hourlyRate", "skills", "businessAddress", "businessCity", "businessPostalCode",
          "stadtSlug", "gewerkSlugs", "claimed",
          "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
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
          stadtSlug,
          gewerkSlugs,
          true, // claimed = true (registered via form)
          new Date(),
          new Date(),
        ],
      )
    } else {
      // Derive SEO slugs from form input
      const stadtSlug = CITY_TO_SLUG[validatedData.city] ?? null;
      const gewerkSlugs = validatedData.skills
        .map((s: string) => SKILL_TO_GEWERK[s])
        .filter(Boolean);

      // Update existierendes CraftsmanProfile
      await executeQuery(
        `UPDATE "CraftsmanProfile" SET
          "companyName" = $1, "contactPerson" = $2, "phone" = $3, "description" = $4,
          "hourlyRate" = $5, "skills" = $6, "businessAddress" = $7, "businessCity" = $8,
          "businessPostalCode" = $9, "stadtSlug" = $10, "gewerkSlugs" = $11, "claimed" = $12,
          "updatedAt" = $13
         WHERE "userId" = $14`,
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
          stadtSlug,
          gewerkSlugs,
          true, // claimed = true
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

    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    // Sponsored query — only claimed profiles with User row
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
    let sponsoredCraftsmen: any[] = []
    try {
      sponsoredCraftsmen = await executeQuery(sponsoredQuery, [])
    } catch {
      // SponsoredCraftsman table may not exist — graceful fallback
      sponsoredCraftsmen = []
    }
    const sponsoredProfileIds = sponsoredCraftsmen.map((c: any) => c.id)

    // Exclude sponsored from main list (by CraftsmanProfile userId match)
    if (sponsoredProfileIds.length > 0) {
      whereClause += ` AND (cp."userId" IS NULL OR cp."userId" NOT IN (${sponsoredProfileIds.map((_: any, i: number) => `$${paramIndex + i}`).join(", ")}))`
      params.push(...sponsoredProfileIds)
      paramIndex += sponsoredProfileIds.length
    }

    // Filter: postal code
    if (filters.postalCode) {
      whereClause += ` AND cp."businessPostalCode" LIKE $${paramIndex}`
      params.push(`${filters.postalCode.substring(0, 2)}%`)
      paramIndex++
    }

    // Filter: skill (supports comma-separated multi-skill)
    if (filters.skill && filters.skill !== "all") {
      const skills = filters.skill.split(",").filter(Boolean)
      if (skills.length === 1) {
        whereClause += ` AND $${paramIndex} = ANY(cp.skills)`
        params.push(skills[0])
        paramIndex++
      } else if (skills.length > 1) {
        whereClause += ` AND cp.skills && $${paramIndex}::text[]`
        params.push(skills)
        paramIndex++
      }
    }

    // Filter: max hourly rate
    if (filters.maxHourlyRate && filters.maxHourlyRate < 200) {
      whereClause += ` AND cp."hourlyRate" <= $${paramIndex}`
      params.push(filters.maxHourlyRate)
      paramIndex++
    }

    // Count — from CraftsmanProfile (includes unclaimed)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM "CraftsmanProfile" cp
      ${whereClause}
    `
    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Data — CraftsmanProfile LEFT JOIN User
    const dataQuery = `
      SELECT
        COALESCE(u.id, cp.id) as id,
        COALESCE(u.name, cp."contactPerson") as name,
        COALESCE(u.email, '') as email,
        u."imageUrl",
        cp."companyName", cp."businessPostalCode", cp."businessCity",
        cp.phone, cp."hourlyRate", cp."isVerified", cp.skills,
        cp."createdAt", cp.claimed,
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'COMPLETED') as "completedJobs"
      FROM "CraftsmanProfile" cp
      LEFT JOIN "User" u ON u.id = cp."userId"
      LEFT JOIN "Review" r ON r."targetId" = u.id
      LEFT JOIN "Job" j ON j."craftsmanId" = u.id
      ${whereClause}
      GROUP BY cp.id, u.id, u.name, u.email, u."imageUrl",
               cp."companyName", cp."businessPostalCode",
               cp."businessCity", cp.phone, cp."hourlyRate", cp."isVerified",
               cp.skills, cp."createdAt", cp.claimed, cp."contactPerson"
      ORDER BY cp.claimed DESC, cp."createdAt" DESC
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
        imageUrl: c.imageUrl || null,
        companyName: c.companyName,
        businessPostalCode: c.businessPostalCode,
        businessCity: c.businessCity,
        phone: c.phone,
        hourlyRate: Number.parseFloat(c.hourlyRate),
        isVerified: c.isVerified,
        skills: c.skills || [],
        completedJobs: Number.parseInt(c.completedJobs) || 0,
        averageRating: c.averageRating ? Number.parseFloat(c.averageRating) : null,
        claimed: c.claimed,
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
      const stadtSlug = CITY_TO_SLUG[updateData.data.businessCity] ?? null;
      const gewerkSlugs = (updateData.data.skills ?? [])
        .map((s: string) => SKILL_TO_GEWERK[s])
        .filter(Boolean);

      await executeQuery(
        `UPDATE "CraftsmanProfile" SET
          "companyName" = $1, "contactPerson" = $2, "phone" = $3, "website" = $4,
          "description" = $5, "hourlyRate" = $6, "skills" = $7,
          "stadtSlug" = $8, "gewerkSlugs" = $9, "updatedAt" = $10
         WHERE "userId" = $11`,
        [
          updateData.data.companyName,
          updateData.data.contactPerson,
          updateData.data.phone,
          updateData.data.website,
          updateData.data.description,
          updateData.data.hourlyRate,
          updateData.data.skills,
          stadtSlug,
          gewerkSlugs,
          new Date(),
          dbUserId,
        ],
      )
    } else if (updateData.type === "business") {
      const stadtSlug = CITY_TO_SLUG[updateData.data.businessCity] ?? null;

      await executeQuery(
        `UPDATE "CraftsmanProfile" SET
          "businessLicense" = $1, "taxId" = $2, "businessAddress" = $3,
          "businessCity" = $4, "businessPostalCode" = $5, "foundingYear" = $6,
          "insuranceProvider" = $7, "insurancePolicyNumber" = $8,
          "stadtSlug" = $9, "updatedAt" = $10
         WHERE "userId" = $11`,
        [
          updateData.data.businessLicense,
          updateData.data.taxId,
          updateData.data.businessAddress,
          updateData.data.businessCity,
          updateData.data.businessPostalCode,
          updateData.data.foundingYear,
          updateData.data.insuranceProvider,
          updateData.data.insurancePolicyNumber,
          stadtSlug,
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
        COALESCE(u.id, cp.id) as id,
        COALESCE(u.name, cp."contactPerson") as name,
        COALESCE(u.email, '') as email,
        u."imageUrl",
        cp."companyName", cp."businessPostalCode", cp."businessCity",
        cp.phone, cp."hourlyRate", cp."isVerified", cp.skills,
        cp.description, cp."businessAddress", cp.claimed,
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
      FROM "CraftsmanProfile" cp
      LEFT JOIN "User" u ON u.id = cp."userId"
      LEFT JOIN "Review" r ON r."targetId" = u.id
      LEFT JOIN "Job" j ON j."craftsmanId" = u.id
      LEFT JOIN "Portfolio" p ON p."craftsmanId" = u.id
      WHERE cp.id = $1 OR u.id = $1
      GROUP BY cp.id, u.id, u.name, u.email, u."imageUrl",
               cp."companyName", cp."businessPostalCode",
               cp."businessCity", cp.phone, cp."hourlyRate", cp."isVerified",
               cp.skills, cp.description, cp."businessAddress", cp.claimed,
               cp."contactPerson"
      LIMIT 1`,
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
      imageUrl: craftsman.imageUrl || null,
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
      claimed: craftsman.claimed,
    }
  } catch (error) {
    console.error("[v0] Error fetching craftsman:", error)
    return null
  }
}
