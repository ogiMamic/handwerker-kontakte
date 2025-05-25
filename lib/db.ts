import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Definiramo mock funkciju za razvoj ako DATABASE_URL nije dostupan
const getMockSql = () => {
  console.warn("UPOZORENJE: Koristi se mock baza podataka jer DATABASE_URL nije definiran!")

  // Vraćamo mock funkciju koja simulira SQL upite
  return async (query: string, params: any[] = []) => {
    console.log("MOCK SQL QUERY:", query, params)
    // Vraćamo prazne rezultate za različite tipove upita
    if (query.toLowerCase().includes("select")) {
      return []
    }
    return { rowCount: 0 }
  }
}

// Provjeravamo DATABASE_URL i koristimo fallback ako nije definiran
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : getMockSql()

// Izvršavamo SQL upit s boljom obradom grešaka
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return result
  } catch (error) {
    console.error("Greška pri izvršavanju upita:", error)
    // Vraćamo informativniju poruku o grešci
    throw new Error(`Greška pri izvršavanju upita: ${(error as Error).message}`)
  }
}

// Exportiramo drizzle instancu za kompleksnije upite
export const db = process.env.DATABASE_URL ? drizzle(sql) : ({} as any) // Vraćamo prazan objekt kao fallback
