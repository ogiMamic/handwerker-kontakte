import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Create test users
    const clientId = uuidv4()
    const craftsmanId = uuidv4()

    await executeQuery(
      `INSERT INTO "User" ("id", "clerkId", "email", "name", "imageUrl", "type", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        clientId,
        "client_test_id",
        "client@example.com",
        "John Doe",
        "/diverse-group.png",
        "CLIENT",
        new Date(),
        new Date(),
      ],
    )

    await executeQuery(
      `INSERT INTO "User" ("id", "clerkId", "email", "name", "imageUrl", "type", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        craftsmanId,
        "craftsman_test_id",
        "craftsman@example.com",
        "Mike Smith",
        "/craftsman.png",
        "CRAFTSMAN",
        new Date(),
        new Date(),
      ],
    )

    // Create craftsman profile
    const profileId = uuidv4()
    await executeQuery(
      `INSERT INTO "CraftsmanProfile" (
        "id", "userId", "companyName", "contactPerson", "phone", 
        "website", "description", "serviceRadius", "hourlyRate", 
        "skills", "businessLicense", "taxId", "businessAddress", 
        "businessCity", "businessPostalCode", "foundingYear", 
        "insuranceProvider", "insurancePolicyNumber", "availableDays", 
        "workHoursStart", "workHoursEnd", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
        $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )`,
      [
        profileId,
        craftsmanId,
        "Smith Plumbing & Heating",
        "Mike Smith",
        "+49 123 456789",
        "https://example.com",
        "Professional plumbing and heating services with over 10 years of experience.",
        30,
        65.0,
        ["plumbing", "heating", "bathroom"],
        "license123456",
        "DE123456789",
        "Hauptstraße 1",
        "Berlin",
        "10115",
        2010,
        "Allianz",
        "INS-123456",
        ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "08:00",
        "17:00",
        new Date(),
        new Date(),
      ],
    )

    // Create jobs
    const job1Id = uuidv4()
    const job2Id = uuidv4()

    await executeQuery(
      `INSERT INTO "Job" (
        "id", "title", "category", "description", "postalCode", 
        "city", "address", "budget", "deadline", "images", 
        "clientId", "status", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )`,
      [
        job1Id,
        "Bathroom Renovation",
        "plumbing",
        "Complete renovation of a bathroom including new fixtures and tiling.",
        "10115",
        "Berlin",
        "Friedrichstraße 123",
        5000.0,
        new Date("2024-08-15"),
        ["/bathroom-renovation.png"],
        clientId,
        "OPEN",
        new Date("2024-05-01"),
        new Date("2024-05-01"),
      ],
    )

    await executeQuery(
      `INSERT INTO "Job" (
        "id", "title", "category", "description", "postalCode", 
        "city", "address", "budget", "deadline", "images", 
        "clientId", "craftsmanId", "status", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )`,
      [
        job2Id,
        "Kitchen Cabinet Installation",
        "carpentry",
        "Installation of new kitchen cabinets and countertops.",
        "10115",
        "Berlin",
        "Alexanderplatz 45",
        3000.0,
        new Date("2024-07-20"),
        ["/modern-kitchen-cabinets.png"],
        clientId,
        craftsmanId,
        "IN_PROGRESS",
        new Date("2024-04-15"),
        new Date("2024-04-15"),
      ],
    )

    // Create messages for the in-progress job
    const message1Id = uuidv4()
    const message2Id = uuidv4()

    await executeQuery(
      `INSERT INTO "Message" (
        "id", "content", "attachments", "jobId", "senderId", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )`,
      [
        message1Id,
        "Hello, I'm interested in your kitchen cabinet installation project.",
        [],
        job2Id,
        craftsmanId,
        new Date("2024-04-16T10:00:00"),
        new Date("2024-04-16T10:00:00"),
      ],
    )

    await executeQuery(
      `INSERT INTO "Message" (
        "id", "content", "attachments", "jobId", "senderId", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )`,
      [
        message2Id,
        "Great! Can you provide an estimate for the work?",
        [],
        job2Id,
        clientId,
        new Date("2024-04-16T10:05:00"),
        new Date("2024-04-16T10:05:00"),
      ],
    )

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Execute the seed function
seedDatabase()
