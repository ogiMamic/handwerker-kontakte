import { executeQuery } from "@/lib/db"

export interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: string
  orderDirection?: "ASC" | "DESC"
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

export async function paginatedQuery<T>(
  query: string,
  countQuery: string,
  params: any[] = [],
  options: PaginationOptions = {},
): Promise<PaginatedResult<T>> {
  const page = options.page || 1
  const limit = options.limit || 10
  const offset = (page - 1) * limit
  const orderBy = options.orderBy || "createdAt"
  const orderDirection = options.orderDirection || "DESC"

  // Add pagination and ordering to the query
  const paginatedQuery = `${query} ORDER BY "${orderBy}" ${orderDirection} LIMIT ${limit} OFFSET ${offset}`

  // Execute both queries in parallel
  const [results, countResult] = await Promise.all([
    executeQuery(paginatedQuery, params),
    executeQuery(countQuery, params),
  ])

  const total = Number.parseInt(countResult[0].count)
  const totalPages = Math.ceil(total / limit)

  return {
    data: results as T[],
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    },
  }
}

// Helper function to format PostgreSQL array for query
export function formatArrayForQuery(arr: string[]): string {
  return `{${arr.map((item) => `"${item}"`).join(",")}}`
}

// Helper function to calculate distance between two German postal codes
export function calculatePostalCodeDistance(plz1: string, plz2: string): number {
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
