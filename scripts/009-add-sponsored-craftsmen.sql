CREATE TABLE IF NOT EXISTS "SponsoredCraftsman" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "craftsmanId" TEXT NOT NULL REFERENCES "Craftsman"("id") ON DELETE CASCADE,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "SponsoredCraftsman_craftsmanId_idx" ON "SponsoredCraftsman"("craftsmanId");
CREATE INDEX IF NOT EXISTS "SponsoredCraftsman_priority_idx" ON "SponsoredCraftsman"("priority" DESC);
