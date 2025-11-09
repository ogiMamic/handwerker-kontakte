-- Add Subscription and UsageLimit tables if they don't exist

-- Create Subscription table
CREATE TABLE IF NOT EXISTS "Subscription" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "plan" TEXT NOT NULL DEFAULT 'free',
  "status" TEXT NOT NULL DEFAULT 'active',
  "role" TEXT NOT NULL,
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "stripePriceId" TEXT,
  "currentPeriodStart" TIMESTAMP NOT NULL DEFAULT NOW(),
  "currentPeriodEnd" TIMESTAMP NOT NULL,
  "cancelAtPeriodEnd" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("userId")
);

-- Create UsageLimit table
CREATE TABLE IF NOT EXISTS "UsageLimit" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "jobsPosted" INTEGER DEFAULT 0,
  "offersSubmitted" INTEGER DEFAULT 0,
  "messagesCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "month", "year")
);

-- Create Portfolio table if not exists
CREATE TABLE IF NOT EXISTS "Portfolio" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "craftsmanId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "images" TEXT[] DEFAULT '{}',
  "category" TEXT,
  "completedDate" TIMESTAMP,
  "location" TEXT,
  "featured" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create SupportTicket table if not exists
CREATE TABLE IF NOT EXISTS "SupportTicket" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "status" TEXT NOT NULL DEFAULT 'open',
  "category" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create SupportTicketMessage table if not exists
CREATE TABLE IF NOT EXISTS "SupportTicketMessage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "ticketId" TEXT NOT NULL REFERENCES "SupportTicket"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "isStaff" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create AnalyticsEvent table if not exists
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "eventType" TEXT NOT NULL,
  "eventData" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_subscription_userId" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "idx_usagelimit_userId_date" ON "UsageLimit"("userId", "month", "year");
CREATE INDEX IF NOT EXISTS "idx_portfolio_craftsmanId" ON "Portfolio"("craftsmanId");
CREATE INDEX IF NOT EXISTS "idx_supportticket_userId" ON "SupportTicket"("userId");
CREATE INDEX IF NOT EXISTS "idx_analytics_userId" ON "AnalyticsEvent"("userId");

-- Create trigger to automatically update Job priority based on subscription
CREATE OR REPLACE FUNCTION update_job_priority()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
  user_role TEXT;
BEGIN
  SELECT s."plan", s."role" INTO user_plan, user_role
  FROM "Subscription" s
  JOIN "User" u ON s."userId" = u."id"
  WHERE u."id" = NEW."clientId";

  -- Set priority based on subscription plan
  IF user_plan = 'business' THEN
    NEW."priority" := 'high';
  ELSIF user_plan = 'premium' OR user_plan = 'professional' THEN
    NEW."priority" := 'medium';
  ELSE
    NEW."priority" := 'normal';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add priority column to Job table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Job' AND column_name = 'priority'
  ) THEN
    ALTER TABLE "Job" ADD COLUMN "priority" TEXT DEFAULT 'normal';
  END IF;
END $$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS job_priority_trigger ON "Job";
CREATE TRIGGER job_priority_trigger
  BEFORE INSERT OR UPDATE ON "Job"
  FOR EACH ROW
  EXECUTE FUNCTION update_job_priority();

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id TEXT,
  p_limit_type TEXT,
  p_max_limit INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  current_month INTEGER;
  current_year INTEGER;
BEGIN
  current_month := EXTRACT(MONTH FROM NOW());
  current_year := EXTRACT(YEAR FROM NOW());

  -- Get current usage for this month
  SELECT 
    CASE 
      WHEN p_limit_type = 'jobs' THEN "jobsPosted"
      WHEN p_limit_type = 'offers' THEN "offersSubmitted"
      WHEN p_limit_type = 'messages' THEN "messagesCount"
      ELSE 0
    END INTO current_usage
  FROM "UsageLimit"
  WHERE "userId" = p_user_id 
    AND "month" = current_month 
    AND "year" = current_year;

  -- If no record exists, usage is 0
  IF current_usage IS NULL THEN
    current_usage := 0;
  END IF;

  -- Check if limit is reached (unlimited = -1)
  IF p_max_limit = -1 THEN
    RETURN TRUE;
  END IF;

  RETURN current_usage < p_max_limit;
END;
$$ LANGUAGE plpgsql;
