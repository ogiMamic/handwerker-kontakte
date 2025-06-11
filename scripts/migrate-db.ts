import { executeQuery } from "@/lib/db"

async function createTables() {
  console.log("Creating database tables...")

  try {
    // Create User table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "clerkId" TEXT UNIQUE NOT NULL,
        "email" TEXT UNIQUE NOT NULL,
        "name" TEXT,
        "imageUrl" TEXT,
        "type" TEXT DEFAULT 'CLIENT',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create indexes for User table
    await executeQuery(`CREATE INDEX IF NOT EXISTS "User_clerkId_idx" ON "User"("clerkId");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");`)

    // Create CraftsmanProfile table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "CraftsmanProfile" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT UNIQUE NOT NULL,
        "companyName" TEXT NOT NULL,
        "contactPerson" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "website" TEXT,
        "description" TEXT NOT NULL,
        "serviceRadius" INTEGER DEFAULT 50,
        "hourlyRate" DECIMAL NOT NULL,
        "skills" TEXT[] DEFAULT '{}',
        "businessLicense" TEXT,
        "taxId" TEXT,
        "businessAddress" TEXT NOT NULL,
        "businessCity" TEXT NOT NULL,
        "businessPostalCode" TEXT NOT NULL,
        "foundingYear" INTEGER,
        "insuranceProvider" TEXT,
        "insurancePolicyNumber" TEXT,
        "availableDays" TEXT[] DEFAULT '{"monday","tuesday","wednesday","thursday","friday"}',
        "workHoursStart" TEXT DEFAULT '08:00',
        "workHoursEnd" TEXT DEFAULT '17:00',
        "vacationDates" TIMESTAMP[],
        "isVerified" BOOLEAN DEFAULT FALSE,
        "verifiedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
    `)

    // Create indexes for CraftsmanProfile table
    await executeQuery(`CREATE INDEX IF NOT EXISTS "CraftsmanProfile_userId_idx" ON "CraftsmanProfile"("userId");`)
    await executeQuery(
      `CREATE INDEX IF NOT EXISTS "CraftsmanProfile_businessPostalCode_idx" ON "CraftsmanProfile"("businessPostalCode");`,
    )
    await executeQuery(
      `CREATE INDEX IF NOT EXISTS "CraftsmanProfile_isVerified_idx" ON "CraftsmanProfile"("isVerified");`,
    )

    // Create Job table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Job" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "postalCode" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "budget" DECIMAL NOT NULL,
        "deadline" TIMESTAMP NOT NULL,
        "images" TEXT[] DEFAULT '{}',
        "status" TEXT DEFAULT 'OPEN',
        "clientId" TEXT NOT NULL,
        "craftsmanId" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("clientId") REFERENCES "User"("id"),
        FOREIGN KEY ("craftsmanId") REFERENCES "User"("id")
      );
    `)

    // Create indexes for Job table
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Job_clientId_idx" ON "Job"("clientId");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Job_craftsmanId_idx" ON "Job"("craftsmanId");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Job_status_idx" ON "Job"("status");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Job_category_idx" ON "Job"("category");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Job_postalCode_idx" ON "Job"("postalCode");`)

    // Create Offer table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Offer" (
        "id" TEXT PRIMARY KEY,
        "amount" DECIMAL NOT NULL,
        "description" TEXT NOT NULL,
        "estimatedDuration" INTEGER NOT NULL,
        "status" TEXT DEFAULT 'PENDING',
        "jobId" TEXT NOT NULL,
        "craftsmanId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE,
        FOREIGN KEY ("craftsmanId") REFERENCES "User"("id")
      );
    `)

    // Create indexes for Offer table
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Offer_jobId_idx" ON "Offer"("jobId");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Offer_craftsmanId_idx" ON "Offer"("craftsmanId");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Offer_status_idx" ON "Offer"("status");`)

    // Create Message table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT PRIMARY KEY,
        "content" TEXT NOT NULL,
        "attachments" TEXT[] DEFAULT '{}',
        "jobId" TEXT NOT NULL,
        "senderId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE,
        FOREIGN KEY ("senderId") REFERENCES "User"("id")
      );
    `)

    // Create indexes for Message table
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Message_jobId_idx" ON "Message"("jobId");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");`)

    // Create Notification table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Notification" (
        "id" TEXT PRIMARY KEY,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN DEFAULT FALSE,
        "data" JSONB,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
    `)

    // Create indexes for Notification table
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");`)
    await executeQuery(`CREATE INDEX IF NOT EXISTS "Notification_isRead_idx" ON "Notification"("isRead");`)

    console.log("✅ All database tables created successfully!")
    return { success: true }
  } catch (error) {
    console.error("❌ Error creating database tables:", error)
    throw error
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log("Migration completed successfully!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Migration failed:", error)
      process.exit(1)
    })
}

export { createTables }
