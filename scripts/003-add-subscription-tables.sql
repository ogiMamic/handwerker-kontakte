-- Add Subscription tables for pricing plans

-- Create subscription plans enum
CREATE TYPE subscription_plan AS ENUM ('free', 'premium', 'business');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');
CREATE TYPE user_role AS ENUM ('client', 'craftsman');

-- Create Subscription table
CREATE TABLE IF NOT EXISTS "Subscription" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "plan" subscription_plan NOT NULL DEFAULT 'free',
  "status" subscription_status NOT NULL DEFAULT 'active',
  "role" user_role NOT NULL,
  "stripeSubscriptionId" TEXT,
  "stripeCustomerId" TEXT,
  "currentPeriodStart" TIMESTAMP NOT NULL DEFAULT NOW(),
  "currentPeriodEnd" TIMESTAMP NOT NULL,
  "cancelAtPeriodEnd" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");

-- Create Usage Limits table to track monthly limits
CREATE TABLE IF NOT EXISTS "UsageLimit" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "jobsPosted" INTEGER DEFAULT 0,
  "offersSubmitted" INTEGER DEFAULT 0,
  "messagesCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "UsageLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  UNIQUE("userId", "month", "year")
);

CREATE INDEX IF NOT EXISTS "UsageLimit_userId_month_year_idx" ON "UsageLimit"("userId", "month", "year");

-- Add subscription plan column to User table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'subscriptionPlan'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "subscriptionPlan" subscription_plan DEFAULT 'free';
  END IF;
END $$;

-- Create function to check if user can post job based on plan
CREATE OR REPLACE FUNCTION can_user_post_job(user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan subscription_plan;
  current_month INTEGER;
  current_year INTEGER;
  jobs_this_month INTEGER;
BEGIN
  -- Get user's subscription plan
  SELECT "subscriptionPlan" INTO user_plan FROM "User" WHERE "id" = user_id;
  
  -- Premium and Business plans have unlimited posts
  IF user_plan IN ('premium', 'business') THEN
    RETURN TRUE;
  END IF;
  
  -- Free plan: check monthly limit (unlimited in our case, but we track)
  current_month := EXTRACT(MONTH FROM NOW());
  current_year := EXTRACT(YEAR FROM NOW());
  
  SELECT COALESCE("jobsPosted", 0) INTO jobs_this_month
  FROM "UsageLimit"
  WHERE "userId" = user_id AND "month" = current_month AND "year" = current_year;
  
  RETURN TRUE; -- Unlimited for free plan as per pricing table
END;
$$ LANGUAGE plpgsql;

-- Create function to check if craftsman can submit offer based on plan
CREATE OR REPLACE FUNCTION can_craftsman_submit_offer(craftsman_id TEXT, job_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan subscription_plan;
  current_month INTEGER;
  current_year INTEGER;
  offers_this_month INTEGER;
  offers_for_job INTEGER;
  max_offers_per_job INTEGER := 5; -- Free plan limit
BEGIN
  -- Get user's subscription plan
  SELECT "subscriptionPlan" INTO user_plan FROM "User" WHERE "id" = craftsman_id;
  
  -- Premium and Business plans have unlimited offers
  IF user_plan IN ('premium', 'business') THEN
    RETURN TRUE;
  END IF;
  
  -- Free plan: check monthly limit (10 offers per month)
  current_month := EXTRACT(MONTH FROM NOW());
  current_year := EXTRACT(YEAR FROM NOW());
  
  SELECT COALESCE("offersSubmitted", 0) INTO offers_this_month
  FROM "UsageLimit"
  WHERE "userId" = craftsman_id AND "month" = current_month AND "year" = current_year;
  
  IF offers_this_month >= 10 THEN
    RETURN FALSE;
  END IF;
  
  -- Check offers per job limit for clients
  SELECT COUNT(*) INTO offers_for_job
  FROM "Offer"
  WHERE "jobId" = job_id;
  
  -- Get job owner's plan
  SELECT u."subscriptionPlan" INTO user_plan
  FROM "Job" j
  JOIN "User" u ON j."clientId" = u."id"
  WHERE j."id" = job_id;
  
  -- Free client plan: max 5 offers per job
  IF user_plan = 'free' AND offers_for_job >= max_offers_per_job THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update usage limits
CREATE OR REPLACE FUNCTION update_usage_limits()
RETURNS TRIGGER AS $$
DECLARE
  current_month INTEGER;
  current_year INTEGER;
  user_id_val TEXT;
BEGIN
  current_month := EXTRACT(MONTH FROM NOW());
  current_year := EXTRACT(YEAR FROM NOW());
  
  IF TG_TABLE_NAME = 'Job' THEN
    user_id_val := NEW."clientId";
    
    INSERT INTO "UsageLimit" ("userId", "month", "year", "jobsPosted", "offersSubmitted")
    VALUES (user_id_val, current_month, current_year, 1, 0)
    ON CONFLICT ("userId", "month", "year")
    DO UPDATE SET 
      "jobsPosted" = "UsageLimit"."jobsPosted" + 1,
      "updatedAt" = NOW();
      
  ELSIF TG_TABLE_NAME = 'Offer' THEN
    user_id_val := NEW."craftsmanId";
    
    INSERT INTO "UsageLimit" ("userId", "month", "year", "jobsPosted", "offersSubmitted")
    VALUES (user_id_val, current_month, current_year, 0, 1)
    ON CONFLICT ("userId", "month", "year")
    DO UPDATE SET 
      "offersSubmitted" = "UsageLimit"."offersSubmitted" + 1,
      "updatedAt" = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS job_usage_trigger ON "Job";
CREATE TRIGGER job_usage_trigger
AFTER INSERT ON "Job"
FOR EACH ROW
EXECUTE FUNCTION update_usage_limits();

DROP TRIGGER IF EXISTS offer_usage_trigger ON "Offer";
CREATE TRIGGER offer_usage_trigger
AFTER INSERT ON "Offer"
FOR EACH ROW
EXECUTE FUNCTION update_usage_limits();
