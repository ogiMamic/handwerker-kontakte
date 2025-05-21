"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

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
    // Simuliere eine Verzögerung für die Demo
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Hier würden wir normalerweise die Daten in die Datenbank schreiben
    // Für die Demo geben wir einfach die Daten zurück
    console.log("Registering craftsman with data:", data)

    // Revalidiere die Pfade, die von dieser Änderung betroffen sein könnten
    revalidatePath("/[lang]/dashboard")
    revalidatePath("/[lang]/handwerker/profil")

    return { success: true, data }
  } catch (error) {
    console.error("Error registering craftsman:", error)
    throw new Error("Failed to register craftsman")
  }
}

export async function getCraftsmanProfile(userId: string) {
  try {
    // Hier würden wir normalerweise die Daten aus der Datenbank abrufen
    // Für die Demo geben wir null zurück (kein Profil gefunden)
    return null
  } catch (error) {
    console.error("Error getting craftsman profile:", error)
    return null
  }
}

export async function updateCraftsmanProfile(formData: CraftsmanFormValues) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Sie müssen angemeldet sein, um Ihr Profil zu aktualisieren")
  }

  // Validiere die Formulardaten
  const validatedData = craftsmanSchema.parse(formData)

  try {
    // Hole den Datenbankbenutzer anhand der Clerk-ID
    const userResult = await sql`SELECT * FROM "User" WHERE "clerkId" = ${userId}`

    if (userResult.length === 0) {
      throw new Error("Benutzer nicht gefunden")
    }

    const dbUserId = userResult[0].id

    // Prüfe, ob bereits ein Handwerkerprofil existiert
    const profileResult = await sql`SELECT * FROM "CraftsmanProfile" WHERE "userId" = ${dbUserId}`

    if (profileResult.length > 0) {
      // Aktualisiere das vorhandene Profil
      await sql`
        UPDATE "CraftsmanProfile" SET 
          "companyName" = ${validatedData.companyName}, "contactPerson" = ${validatedData.contactPerson}, "email" = ${validatedData.email}, "phone" = ${validatedData.phone},
          "address" = ${validatedData.address}, "postalCode" = ${validatedData.postalCode}, "city" = ${validatedData.city}, "description" = ${validatedData.description},
          "skills" = ${JSON.stringify(validatedData.skills)}, "hourlyRate" = ${validatedData.hourlyRate}, "updatedAt" = ${new Date()}
        WHERE "userId" = ${dbUserId}
      `
    } else {
      // Erstelle ein neues Handwerkerprofil
      const profileId = uuidv4()
      await sql`
        INSERT INTO "CraftsmanProfile" (
          "id", "userId", "companyName", "contactPerson", "email", "phone",
          "address", "postalCode", "city", "description", "skills", "hourlyRate",
          "isVerified", "completionPercentage", "createdAt", "updatedAt"
        ) VALUES (
          ${profileId}, ${dbUserId}, ${validatedData.companyName}, ${validatedData.contactPerson}, ${validatedData.email}, ${validatedData.phone},
          ${validatedData.address}, ${validatedData.postalCode}, ${validatedData.city}, ${validatedData.description}, ${JSON.stringify(validatedData.skills)}, ${validatedData.hourlyRate},
          false, 100, ${new Date()}, ${new Date()}
        )
      `
    }

    // Aktualisiere die relevanten Pfade
    revalidatePath("/[lang]/dashboard")
    revalidatePath("/[lang]/handwerker/profil")

    return { success: true }
  } catch (error) {
    console.error("Fehler bei der Aktualisierung des Handwerkerprofils:", error)
    throw new Error("Das Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.")
  }
}
