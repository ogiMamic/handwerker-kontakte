"use server"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
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

// Mock-Daten für Handwerker
const mockCraftsmen = Array.from({ length: 100 }).map((_, index) => ({
  id: `c${index + 1}`,
  userId: `u${index + 1}`,
  name: `Handwerker ${index + 1}`,
  email: `handwerker${index + 1}@example.com`,
  companyName: `Firma ${index + 1} GmbH`,
  businessPostalCode: `1${index % 10}${(index + 1) % 10}${(index + 2) % 10}${(index + 3) % 10}`,
  businessCity: index % 3 === 0 ? "Berlin" : index % 3 === 1 ? "München" : "Hamburg",
  phone: `+49 123 ${index + 1000}`,
  hourlyRate: 35 + (index % 30),
  isVerified: index % 5 === 0,
  skills: [
    ...(index % 4 === 0 ? ["Renovierung"] : []),
    ...(index % 3 === 0 ? ["Installation"] : []),
    ...(index % 5 === 0 ? ["Sanitär"] : []),
    ...(index % 2 === 0 ? ["Elektrik"] : []),
    ...(index % 6 === 0 ? ["Malerarbeiten"] : []),
    ...(index % 7 === 0 ? ["Fliesenlegen"] : []),
    ...(index % 8 === 0 ? ["Tischlerei"] : []),
    ...(index % 9 === 0 ? ["Dachdeckerarbeiten"] : []),
    ...(index % 10 === 0 ? ["Gartenarbeit"] : []),
    ...(index % 11 === 0 ? ["Umzug"] : []),
  ],
  completedJobs: index % 20,
  averageRating: (3 + (index % 20) / 10) % 5,
  createdAt: new Date(Date.now() - index * 86400000),
  updatedAt: new Date(),
}))

export async function registerCraftsman(data: CraftsmanFormValues) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    // Simuliere eine Verzögerung für die Demo
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Hier würden wir normalerweise die Daten in die Datenbank schreiben
    // Für die Demo setzen wir den Benutzer als Handwerker
    console.log("Registering craftsman with data:", data)

    // Setze den Benutzer als Handwerker in der Session
    // In einer echten Anwendung würde dies in der Datenbank gespeichert
    // und beim Laden des Benutzers abgerufen werden

    // Füge den neuen Handwerker zu den Mock-Daten hinzu
    const newCraftsman = {
      id: uuidv4(),
      userId,
      name: data.contactPerson,
      email: data.email,
      companyName: data.companyName,
      businessPostalCode: data.postalCode,
      businessCity: data.city,
      phone: data.phone,
      hourlyRate: data.hourlyRate,
      isVerified: false,
      skills: data.skills,
      completedJobs: 0,
      averageRating: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // In einer echten Anwendung würden wir hier die Datenbank aktualisieren
    // mockCraftsmen.unshift(newCraftsman)

    // Revalidiere die Pfade, die von dieser Änderung betroffen sein könnten
    revalidatePath("/[lang]/dashboard")
    revalidatePath("/[lang]/handwerker")
    revalidatePath("/[lang]/handwerker/profil")

    return { success: true, data: newCraftsman }
  } catch (error) {
    console.error("Error registering craftsman:", error)
    throw new Error("Failed to register craftsman")
  }
}

export async function getCraftsmanProfile(userId: string) {
  try {
    const craftsman = mockCraftsmen.find((c) => c.userId === userId)

    if (craftsman) {
      return {
        id: craftsman.id,
        userId: craftsman.userId,
        companyName: craftsman.companyName,
        contactPerson: craftsman.name,
        email: craftsman.email || "",
        phone: craftsman.phone,
        address: "Musterstraße 123",
        postalCode: craftsman.businessPostalCode,
        city: craftsman.businessCity,
        description: "Professioneller Handwerker mit langjähriger Erfahrung.",
        skills: craftsman.skills,
        hourlyRate: craftsman.hourlyRate,
        isVerified: craftsman.isVerified,
        completionPercentage: 100,
        // Zusätzliche Business-Felder
        businessLicense: "Business License URL",
        taxId: "DE123456789",
        businessAddress: "Musterstraße 123",
        businessCity: craftsman.businessCity,
        businessPostalCode: craftsman.businessPostalCode,
        foundingYear: 2020,
        insuranceProvider: "Versicherung AG",
        insurancePolicyNumber: "POL123456",
        // Availability-Felder
        availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workHoursStart: "08:00",
        workHoursEnd: "17:00",
        vacationDates: [],
      }
    }

    return null
  } catch (error) {
    console.error("Error getting craftsman profile:", error)
    return null
  }
}

export async function getCraftsmen(options: PaginationOptions = {}, filters: any = {}): Promise<PaginatedResult<any>> {
  try {
    // In einer echten Anwendung würden wir hier die Datenbank abfragen
    // Für die Demo filtern wir die Mock-Daten

    const page = options.page || 1
    const limit = options.limit || 20

    // Filtern nach PLZ
    let filteredCraftsmen = [...mockCraftsmen]

    if (filters.postalCode) {
      filteredCraftsmen = filteredCraftsmen.filter((c) =>
        c.businessPostalCode.startsWith(filters.postalCode.substring(0, 2)),
      )
    }

    // Filtern nach Fähigkeit
    if (filters.skill && filters.skill !== "all") {
      filteredCraftsmen = filteredCraftsmen.filter((c) => c.skills.includes(filters.skill))
    }

    // Sortieren nach Erstellungsdatum (neueste zuerst)
    filteredCraftsmen.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Paginierung
    const total = filteredCraftsmen.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedCraftsmen = filteredCraftsmen.slice(offset, offset + limit)

    return {
      data: paginatedCraftsmen,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  } catch (error) {
    console.error("Error fetching craftsmen:", error)
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
    // Simuliere eine Verzögerung für die Demo
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In einer echten Anwendung würden wir hier die Datenbank aktualisieren
    console.log("Updating craftsman profile with data:", updateData)

    // Aktualisiere die Mock-Daten basierend auf dem userId
    const existingCraftsmanIndex = mockCraftsmen.findIndex((c) => c.userId === userId)

    if (existingCraftsmanIndex !== -1) {
      // Aktualisiere bestehenden Handwerker
      const existingCraftsman = mockCraftsmen[existingCraftsmanIndex]

      if (updateData.type === "profile") {
        Object.assign(existingCraftsman, {
          companyName: updateData.data.companyName,
          name: updateData.data.contactPerson,
          phone: updateData.data.phone,
          hourlyRate: updateData.data.hourlyRate,
          skills: updateData.data.skills,
          // Weitere Felder...
        })
      } else if (updateData.type === "business") {
        Object.assign(existingCraftsman, {
          businessPostalCode: updateData.data.businessPostalCode,
          businessCity: updateData.data.businessCity,
          // Weitere Business-Felder...
        })
      }

      mockCraftsmen[existingCraftsmanIndex] = existingCraftsman
    } else {
      // Erstelle neuen Handwerker wenn noch nicht vorhanden
      const newCraftsman = {
        id: uuidv4(),
        userId,
        name: updateData.data.contactPerson || "Neuer Handwerker",
        email: updateData.data.email || "",
        companyName: updateData.data.companyName || "",
        businessPostalCode: updateData.data.businessPostalCode || updateData.data.postalCode || "",
        businessCity: updateData.data.businessCity || updateData.data.city || "",
        phone: updateData.data.phone || "",
        hourlyRate: updateData.data.hourlyRate || 50,
        isVerified: false,
        skills: updateData.data.skills || [],
        completedJobs: 0,
        averageRating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockCraftsmen.unshift(newCraftsman)
    }

    // Revalidiere alle relevanten Pfade
    revalidatePath("/[lang]/dashboard")
    revalidatePath("/[lang]/handwerker")
    revalidatePath("/[lang]/profil")
    revalidatePath("/[lang]/handwerker/profil")

    return { success: true }
  } catch (error) {
    console.error("Fehler bei der Aktualisierung des Handwerkerprofils:", error)
    throw new Error("Das Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.")
  }
}
