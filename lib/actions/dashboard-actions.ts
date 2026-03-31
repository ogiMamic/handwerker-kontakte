"use server"

import { executeQuery } from "@/lib/db"

interface DashboardUser {
  id: string
  clerkId: string
  email: string
  name: string | null
  type: string
  imageUrl: string | null
}

interface DashboardCraftsmanProfile {
  id: string
  userId: string
  companyName: string
  contactPerson: string
  phone: string
  skills: string[]
  hourlyRate: number
  businessCity: string
  businessPostalCode: string
  isVerified: boolean
  description: string
  businessAddress: string
  completionPercentage: number
  viewCount: number
  contactClickCount: number
}

interface DashboardJob {
  id: string
  title: string
  category: string
  description: string
  budget: number
  deadline: Date
  status: string
  offerCount: number
  createdAt: Date
}

interface DashboardOffer {
  id: string
  jobId: string
  jobTitle: string
  craftsmanId: string
  craftsmanName: string
  companyName: string
  amount: number
  hourlyRate: number | null
  description: string
  estimatedDuration: number
  status: string
  createdAt: Date
  category: string
  postalCode: string
  city: string
}

interface DashboardMetrics {
  totalJobs: number
  openJobs: number
  totalOffers: number
  pendingOffers: number
  completedJobs: number
  acceptedOffers: number
}

interface DashboardData {
  user: DashboardUser | null
  craftsmanProfile: DashboardCraftsmanProfile | null
  clientJobs: DashboardJob[]
  craftsmanJobs: DashboardJob[]
  clientOffers: DashboardOffer[]
  craftsmanOffers: DashboardOffer[]
  metrics: DashboardMetrics
}

function calculateProfileCompletion(profile: Record<string, unknown>): number {
  const fields = [
    "companyName",
    "contactPerson",
    "phone",
    "description",
    "businessAddress",
    "businessCity",
    "businessPostalCode",
    "hourlyRate",
  ]
  const skillsPresent = Array.isArray(profile.skills) && (profile.skills as unknown[]).length > 0
  const filledCount = fields.filter((f) => {
    const val = profile[f]
    return val !== null && val !== undefined && val !== "" && val !== 0
  }).length
  const total = fields.length + 1 // +1 for skills
  return Math.round(((filledCount + (skillsPresent ? 1 : 0)) / total) * 100)
}

export async function getDashboardData(clerkUserId: string): Promise<DashboardData> {
  const emptyMetrics: DashboardMetrics = {
    totalJobs: 0,
    openJobs: 0,
    totalOffers: 0,
    pendingOffers: 0,
    completedJobs: 0,
    acceptedOffers: 0,
  }

  // 1. Get user by Clerk ID
  const userRows = await executeQuery(
    `SELECT id, "clerkId", email, name, type, "imageUrl"
     FROM "User"
     WHERE "clerkId" = $1
     LIMIT 1`,
    [clerkUserId],
  )

  if (userRows.length === 0) {
    return {
      user: null,
      craftsmanProfile: null,
      clientJobs: [],
      craftsmanJobs: [],
      clientOffers: [],
      craftsmanOffers: [],
      metrics: emptyMetrics,
    }
  }

  const user: DashboardUser = {
    id: userRows[0].id,
    clerkId: userRows[0].clerkId,
    email: userRows[0].email,
    name: userRows[0].name,
    type: userRows[0].type,
    imageUrl: userRows[0].imageUrl,
  }

  // 2. Get CraftsmanProfile if exists
  const profileRows = await executeQuery(
    `SELECT id, "userId", "companyName", "contactPerson", phone, skills,
            "hourlyRate", "businessCity", "businessPostalCode", "isVerified",
            description, "businessAddress",
            COALESCE("viewCount", 0) as "viewCount",
            COALESCE("contactClickCount", 0) as "contactClickCount"
     FROM "CraftsmanProfile"
     WHERE "userId" = $1
     LIMIT 1`,
    [user.id],
  )

  const craftsmanProfile: DashboardCraftsmanProfile | null =
    profileRows.length > 0
      ? {
          id: profileRows[0].id,
          userId: profileRows[0].userId,
          companyName: profileRows[0].companyName,
          contactPerson: profileRows[0].contactPerson,
          phone: profileRows[0].phone,
          skills: profileRows[0].skills || [],
          hourlyRate: profileRows[0].hourlyRate,
          businessCity: profileRows[0].businessCity,
          businessPostalCode: profileRows[0].businessPostalCode,
          isVerified: profileRows[0].isVerified,
          description: profileRows[0].description,
          businessAddress: profileRows[0].businessAddress,
          completionPercentage: calculateProfileCompletion(profileRows[0]),
          viewCount: profileRows[0].viewCount,
          contactClickCount: profileRows[0].contactClickCount,
        }
      : null

  // 3. Get jobs where user is client
  const clientJobRows = await executeQuery(
    `SELECT j.id, j.title, j.category, j.description, j.budget, j.deadline,
            j.status, j."createdAt",
            (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount"
     FROM "Job" j
     WHERE j."clientId" = $1
     ORDER BY j."createdAt" DESC`,
    [user.id],
  )

  const clientJobs: DashboardJob[] = clientJobRows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    budget: row.budget,
    deadline: new Date(row.deadline),
    status: row.status,
    offerCount: Number(row.offerCount),
    createdAt: new Date(row.createdAt),
  }))

  // 4. Get jobs where user is craftsman (assigned)
  const craftsmanJobRows = await executeQuery(
    `SELECT j.id, j.title, j.category, j.description, j.budget, j.deadline,
            j.status, j."createdAt",
            (SELECT COUNT(*) FROM "Offer" o WHERE o."jobId" = j.id) as "offerCount"
     FROM "Job" j
     WHERE j."craftsmanId" = $1
     ORDER BY j."createdAt" DESC`,
    [user.id],
  )

  const craftsmanJobs: DashboardJob[] = craftsmanJobRows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    budget: row.budget,
    deadline: new Date(row.deadline),
    status: row.status,
    offerCount: Number(row.offerCount),
    createdAt: new Date(row.createdAt),
  }))

  // 5. Get offers on user's jobs (as client)
  const clientOfferRows = await executeQuery(
    `SELECT o.id, o."jobId", j.title as "jobTitle",
            o."craftsmanId", u.name as "craftsmanName",
            cp."companyName",
            o.amount, cp."hourlyRate",
            o.description, o."estimatedDuration", o.status,
            o."createdAt",
            j.category, j."postalCode", j.city
     FROM "Offer" o
     JOIN "Job" j ON j.id = o."jobId"
     JOIN "User" u ON u.id = o."craftsmanId"
     LEFT JOIN "CraftsmanProfile" cp ON cp."userId" = o."craftsmanId"
     WHERE j."clientId" = $1
     ORDER BY o."createdAt" DESC`,
    [user.id],
  )

  const clientOffers: DashboardOffer[] = clientOfferRows.map((row) => ({
    id: row.id,
    jobId: row.jobId,
    jobTitle: row.jobTitle || "",
    craftsmanId: row.craftsmanId,
    craftsmanName: row.craftsmanName || "",
    companyName: row.companyName || "",
    amount: row.amount,
    hourlyRate: row.hourlyRate ?? null,
    description: row.description,
    estimatedDuration: row.estimatedDuration,
    status: row.status,
    createdAt: new Date(row.createdAt),
    category: row.category || "",
    postalCode: row.postalCode || "",
    city: row.city || "",
  }))

  // 6. Get offers made by user (as craftsman)
  const craftsmanOfferRows = await executeQuery(
    `SELECT o.id, o."jobId", j.title as "jobTitle",
            o."craftsmanId", u.name as "craftsmanName",
            cp."companyName",
            o.amount, cp."hourlyRate",
            o.description, o."estimatedDuration", o.status,
            o."createdAt",
            j.category, j."postalCode", j.city
     FROM "Offer" o
     JOIN "Job" j ON j.id = o."jobId"
     JOIN "User" u ON u.id = o."craftsmanId"
     LEFT JOIN "CraftsmanProfile" cp ON cp."userId" = o."craftsmanId"
     WHERE o."craftsmanId" = $1
     ORDER BY o."createdAt" DESC`,
    [user.id],
  )

  const craftsmanOffers: DashboardOffer[] = craftsmanOfferRows.map((row) => ({
    id: row.id,
    jobId: row.jobId,
    jobTitle: row.jobTitle || "",
    craftsmanId: row.craftsmanId,
    craftsmanName: row.craftsmanName || "",
    companyName: row.companyName || "",
    amount: row.amount,
    hourlyRate: row.hourlyRate ?? null,
    description: row.description,
    estimatedDuration: row.estimatedDuration,
    status: row.status,
    createdAt: new Date(row.createdAt),
    category: row.category || "",
    postalCode: row.postalCode || "",
    city: row.city || "",
  }))

  // 7. Calculate metrics
  const allJobs = [...clientJobs, ...craftsmanJobs]
  const allOffers = [...clientOffers, ...craftsmanOffers]

  const metrics: DashboardMetrics = {
    totalJobs: allJobs.length,
    openJobs: allJobs.filter((j) => j.status === "OPEN").length,
    totalOffers: allOffers.length,
    pendingOffers: allOffers.filter((o) => o.status === "PENDING").length,
    completedJobs: allJobs.filter((j) => j.status === "COMPLETED").length,
    acceptedOffers: allOffers.filter((o) => o.status === "ACCEPTED").length,
  }

  return {
    user,
    craftsmanProfile,
    clientJobs,
    craftsmanJobs,
    clientOffers,
    craftsmanOffers,
    metrics,
  }
}

export async function getProfileStats(
  craftsmanProfileId: string,
): Promise<{ viewCount: number; contactClickCount: number }> {
  const rows = await executeQuery(
    `SELECT COALESCE("viewCount", 0) as "viewCount",
            COALESCE("contactClickCount", 0) as "contactClickCount"
     FROM "CraftsmanProfile"
     WHERE id = $1
     LIMIT 1`,
    [craftsmanProfileId],
  )

  if (rows.length === 0) {
    return { viewCount: 0, contactClickCount: 0 }
  }

  return {
    viewCount: rows[0].viewCount,
    contactClickCount: rows[0].contactClickCount,
  }
}

export async function incrementProfileView(profileId: string): Promise<void> {
  await executeQuery(
    `UPDATE "CraftsmanProfile"
     SET "viewCount" = COALESCE("viewCount", 0) + 1
     WHERE id = $1 OR "userId" = $1`,
    [profileId],
  )
}

export async function incrementContactClick(profileId: string): Promise<void> {
  await executeQuery(
    `UPDATE "CraftsmanProfile"
     SET "contactClickCount" = COALESCE("contactClickCount", 0) + 1
     WHERE id = $1 OR "userId" = $1`,
    [profileId],
  )
}
