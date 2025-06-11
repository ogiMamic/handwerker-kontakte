import { neon } from "@neondatabase/serverless"

// Proveravamo da li je DATABASE_URL postavljen
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please add it to your .env.local file or deployment environment.",
  )
}

// Kreiramo SQL klijent
const sql = neon(process.env.DATABASE_URL)

// Izvršavamo SQL upit sa boljom obradom grešaka
export async function executeQuery(query: string, params: any[] = []) {
  try {
    console.log("Executing query:", query.substring(0, 100) + "...")
    const result = await sql(query, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)
    throw new Error(`Database query failed: ${(error as Error).message}`)
  }
}

// Health check funkcija za bazu
export async function checkDatabaseConnection() {
  try {
    await sql`SELECT 1 as test`
    return { status: "connected", message: "Database connection successful" }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { status: "error", message: (error as Error).message }
  }
}
