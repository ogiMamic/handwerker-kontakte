import { executeQuery } from "@/lib/db"

// Calculate distance between two postal codes (simplified German PLZ distance)
// This is a simplified version - in production, you would use a more accurate geocoding service
function calculatePostalCodeDistance(plz1: string, plz2: string): number {
  // For German postal codes, the first two digits roughly indicate the region
  const region1 = Number.parseInt(plz1.substring(0, 2))
  const region2 = Number.parseInt(plz2.substring(0, 2))

  // Calculate a rough distance (this is very simplified)
  const regionDistance = Math.abs(region1 - region2) * 50 // ~50km per region difference

  // If the first digit is the same, they're closer
  if (plz1[0] === plz2[0]) {
    return regionDistance * 0.7
  }

  return regionDistance
}

// Calculate skill match score (0-100)
function calculateSkillMatchScore(jobCategory: string, craftsmanSkills: string[]): number {
  if (craftsmanSkills.includes(jobCategory)) {
    return 100
  }

  // Check for related skills (simplified)
  const relatedCategories: Record<string, string[]> = {
    plumbing: ["bathroom", "kitchen", "heating"],
    electrical: ["lighting", "smart-home"],
    carpentry: ["furniture", "flooring", "kitchen"],
    painting: ["wallpaper", "plastering"],
    flooring: ["tiling", "carpentry"],
    roofing: ["insulation", "gutters"],
    landscaping: ["gardening", "fencing"],
  }

  // If craftsman has related skills
  const related = relatedCategories[jobCategory] || []
  for (const skill of craftsmanSkills) {
    if (related.includes(skill)) {
      return 70
    }
  }

  return 0
}

// Calculate availability score (0-100)
function calculateAvailabilityScore(jobDeadline: Date, craftsmanVacationDates: Date[]): number {
  // Check if the job deadline falls on a vacation date
  const isOnVacation = craftsmanVacationDates.some((date) => {
    return date.toDateString() === jobDeadline.toDateString()
  })

  if (isOnVacation) {
    return 0
  }

  // Calculate days until deadline
  const today = new Date()
  const daysUntilDeadline = Math.ceil((jobDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // If deadline is very soon, lower availability score
  if (daysUntilDeadline < 3) {
    return 50
  }

  // If deadline is far away, high availability score
  if (daysUntilDeadline > 14) {
    return 100
  }

  // Linear scale between 3 and 14 days
  return 50 + (daysUntilDeadline - 3) * (50 / 11)
}

// Main matching function
export async function findMatchingCraftsmen(jobId: string, limit = 10) {
  try {
    // Get job details
    const jobResult = await executeQuery(`SELECT * FROM "Job" WHERE "id" = $1`, [jobId])

    if (jobResult.length === 0) {
      throw new Error("Job not found")
    }

    const job = jobResult[0]

    // Get all craftsmen profiles
    const craftsmenResult = await executeQuery(`
      SELECT cp.*, u.id as "userId", u.name, u.email, u.imageUrl
      FROM "CraftsmanProfile" cp
      JOIN "User" u ON cp."userId" = u.id
      WHERE u.type = 'CRAFTSMAN'
    `)

    // Calculate match scores for each craftsman
    const matchScores = craftsmenResult.map((craftsman) => {
      // Distance score (0-100, lower is better)
      const distance = calculatePostalCodeDistance(job.postalCode, craftsman.businessPostalCode)
      const distanceScore = Math.max(0, 100 - (distance / craftsman.serviceRadius) * 100)

      // Skill match score (0-100)
      const skillScore = calculateSkillMatchScore(job.category, craftsman.skills)

      // Availability score (0-100)
      const availabilityScore = calculateAvailabilityScore(new Date(job.deadline), craftsman.vacationDates || [])

      // Calculate total score (weighted average)
      const totalScore = distanceScore * 0.4 + skillScore * 0.4 + availabilityScore * 0.2

      return {
        craftsman: {
          id: craftsman.userId,
          name: craftsman.name,
          email: craftsman.email,
          imageUrl: craftsman.imageUrl,
          companyName: craftsman.companyName,
          hourlyRate: Number.parseFloat(craftsman.hourlyRate),
          skills: craftsman.skills,
          serviceRadius: craftsman.serviceRadius,
        },
        scores: {
          distance: distanceScore,
          skill: skillScore,
          availability: availabilityScore,
          total: totalScore,
        },
      }
    })

    // Sort by total score (descending) and return top matches
    return matchScores
      .filter((match) => match.scores.total > 0) // Filter out zero scores
      .sort((a, b) => b.scores.total - a.scores.total)
      .slice(0, limit)
  } catch (error) {
    console.error("Error finding matching craftsmen:", error)
    throw error
  }
}
