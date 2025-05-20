import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Stellen Sie sicher, dass die Umgebungsvariable vorhanden ist
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL Umgebungsvariable ist nicht definiert")
}

// Erstellen Sie eine Verbindung zur Datenbank
const sql = neon(process.env.DATABASE_URL)

// Führen Sie eine SQL-Abfrage aus
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return result
  } catch (error) {
    console.error("Fehler bei der Datenbankabfrage:", error)
    throw error
  }
}

// Exportieren Sie die Drizzle-Instanz für komplexere Abfragen
export const db = drizzle(sql)
