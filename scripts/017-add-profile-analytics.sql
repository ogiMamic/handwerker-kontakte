-- Add analytics columns to CraftsmanProfile for tracking profile views and contact clicks
ALTER TABLE "CraftsmanProfile" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER DEFAULT 0;
ALTER TABLE "CraftsmanProfile" ADD COLUMN IF NOT EXISTS "contactClickCount" INTEGER DEFAULT 0;
