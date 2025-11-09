-- Create Portfolio table for craftsman work gallery
CREATE TABLE IF NOT EXISTS "Portfolio" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "craftsmanId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "imageUrl" TEXT NOT NULL,
  category TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_portfolio_craftsman FOREIGN KEY ("craftsmanId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_craftsman ON "Portfolio"("craftsmanId");

-- Create SponsoredCraftsman table if it doesn't exist
CREATE TABLE IF NOT EXISTS "SponsoredCraftsman" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "craftsmanId" TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 10,
  "startDate" TIMESTAMP NOT NULL DEFAULT NOW(),
  "endDate" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_sponsored_craftsman FOREIGN KEY ("craftsmanId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create index for faster sponsored queries
CREATE INDEX IF NOT EXISTS idx_sponsored_craftsman ON "SponsoredCraftsman"("craftsmanId", priority);
CREATE INDEX IF NOT EXISTS idx_sponsored_dates ON "SponsoredCraftsman"("startDate", "endDate");
