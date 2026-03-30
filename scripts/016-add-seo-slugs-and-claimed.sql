-- Migration 016: Add SEO slug columns and claimed flag to CraftsmanProfile
-- Part of DB consolidation: merging Prisma CraftsmanProfile with raw handwerker table
-- Makes userId nullable to support unclaimed/scraped profiles

-- Make userId nullable (more permissive — no data loss)
ALTER TABLE "CraftsmanProfile"
  ALTER COLUMN "userId" DROP NOT NULL;

-- Add SEO slug columns
ALTER TABLE "CraftsmanProfile"
  ADD COLUMN IF NOT EXISTS "stadtSlug"   TEXT,
  ADD COLUMN IF NOT EXISTS "gewerkSlugs" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "claimed"     BOOLEAN NOT NULL DEFAULT FALSE;

-- Add indexes for SEO query performance
CREATE INDEX IF NOT EXISTS "CraftsmanProfile_stadtSlug_idx" ON "CraftsmanProfile"("stadtSlug");
CREATE INDEX IF NOT EXISTS "CraftsmanProfile_claimed_idx"   ON "CraftsmanProfile"("claimed");
