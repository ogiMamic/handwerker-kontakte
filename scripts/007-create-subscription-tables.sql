-- Create Subscription and UsageLimit tables with proper schema

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
  "cancelAtPeriodEnd" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
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

-- Create Portfolio table
CREATE TABLE IF NOT EXISTS "Portfolio" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "images" TEXT[],
  "category" TEXT,
  "completedDate" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create SupportTicket table
CREATE TABLE IF NOT EXISTS "SupportTicket" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create SupportTicketMessage table
CREATE TABLE IF NOT EXISTS "SupportTicketMessage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "ticketId" TEXT NOT NULL REFERENCES "SupportTicket"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "isStaff" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create AnalyticsEvent table
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "eventType" TEXT NOT NULL,
  "eventData" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create JobTracking table
CREATE TABLE IF NOT EXISTS "JobTracking" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "jobId" TEXT NOT NULL REFERENCES "Job"("id") ON DELETE CASCADE,
  "notifiedCount" INTEGER DEFAULT 0,
  "viewedCount" INTEGER DEFAULT 0,
  "interestedCount" INTEGER DEFAULT 0,
  "offersCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("jobId")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_subscription_user" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "idx_usage_user_period" ON "UsageLimit"("userId", "month", "year");
CREATE INDEX IF NOT EXISTS "idx_portfolio_user" ON "Portfolio"("userId");
CREATE INDEX IF NOT EXISTS "idx_support_ticket_user" ON "SupportTicket"("userId");
CREATE INDEX IF NOT EXISTS "idx_analytics_user" ON "AnalyticsEvent"("userId");
CREATE INDEX IF NOT EXISTS "idx_job_tracking_job" ON "JobTracking"("jobId");

-- Function to set priority based on subscription plan
CREATE OR REPLACE FUNCTION set_support_priority()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "Subscription" 
    WHERE "userId" = NEW."userId" 
    AND "plan" IN ('business')
  ) THEN
    NEW."priority" = 'high';
  ELSIF EXISTS (
    SELECT 1 FROM "Subscription" 
    WHERE "userId" = NEW."userId" 
    AND "plan" IN ('premium', 'professional')
  ) THEN
    NEW."priority" = 'medium';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic priority assignment
DROP TRIGGER IF EXISTS trigger_set_support_priority ON "SupportTicket";
CREATE TRIGGER trigger_set_support_priority
  BEFORE INSERT ON "SupportTicket"
  FOR EACH ROW
  EXECUTE FUNCTION set_support_priority();

-- Add subscriptionPlan column to User table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'subscriptionPlan'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "subscriptionPlan" TEXT DEFAULT 'free';
  END IF;
END $$;

COMMENT ON TABLE "Subscription" IS 'Stores user subscription information';
COMMENT ON TABLE "UsageLimit" IS 'Tracks monthly usage limits per user';
COMMENT ON TABLE "Portfolio" IS 'Stores craftsman portfolio items';
COMMENT ON TABLE "SupportTicket" IS 'Customer support tickets';
