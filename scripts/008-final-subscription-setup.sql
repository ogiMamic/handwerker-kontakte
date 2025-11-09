-- Create UserType enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "UserType" AS ENUM ('CLIENT', 'CRAFTSMAN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add subscriptionPlan column to User table if it doesn't exist
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "subscriptionPlan" TEXT DEFAULT 'free';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create Subscription table
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");

-- Create UsageLimit table
CREATE TABLE IF NOT EXISTS "UsageLimit" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "offersUsed" INTEGER NOT NULL DEFAULT 0,
    "offersLimit" INTEGER NOT NULL DEFAULT 10,
    "jobsPosted" INTEGER NOT NULL DEFAULT 0,
    "resetDate" TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 month'),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId")
);

CREATE INDEX IF NOT EXISTS "UsageLimit_userId_idx" ON "UsageLimit"("userId");

-- Create Portfolio table
CREATE TABLE IF NOT EXISTS "Portfolio" (
    "id" TEXT PRIMARY KEY,
    "craftsmanId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "category" TEXT,
    "completedDate" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Portfolio_craftsmanId_idx" ON "Portfolio"("craftsmanId");

-- Create SupportTicket table
CREATE TABLE IF NOT EXISTS "SupportTicket" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "SupportTicket_userId_idx" ON "SupportTicket"("userId");
CREATE INDEX IF NOT EXISTS "SupportTicket_status_idx" ON "SupportTicket"("status");

-- Create SupportTicketMessage table
CREATE TABLE IF NOT EXISTS "SupportTicketMessage" (
    "id" TEXT PRIMARY KEY,
    "ticketId" TEXT NOT NULL REFERENCES "SupportTicket"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "message" TEXT NOT NULL,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "SupportTicketMessage_ticketId_idx" ON "SupportTicketMessage"("ticketId");

-- Create JobTracking table
CREATE TABLE IF NOT EXISTS "JobTracking" (
    "id" TEXT PRIMARY KEY,
    "jobId" TEXT NOT NULL REFERENCES "Job"("id") ON DELETE CASCADE,
    "notifiedCount" INTEGER NOT NULL DEFAULT 0,
    "viewedCount" INTEGER NOT NULL DEFAULT 0,
    "interestedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("jobId")
);

CREATE INDEX IF NOT EXISTS "JobTracking_jobId_idx" ON "JobTracking"("jobId");

-- Create AnalyticsEvent table
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- Function to set priority based on subscription
CREATE OR REPLACE FUNCTION set_priority_from_subscription()
RETURNS TRIGGER AS $$
DECLARE
    user_plan TEXT;
BEGIN
    SELECT "subscriptionPlan" INTO user_plan
    FROM "User"
    WHERE "id" = NEW."userId";

    IF user_plan IN ('premium', 'professional', 'business') THEN
        NEW."priority" := 'high';
    ELSE
        NEW."priority" := 'normal';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for SupportTicket priority
DROP TRIGGER IF EXISTS set_support_ticket_priority ON "SupportTicket";
CREATE TRIGGER set_support_ticket_priority
    BEFORE INSERT ON "SupportTicket"
    FOR EACH ROW
    EXECUTE FUNCTION set_priority_from_subscription();

-- Function to check usage limits
CREATE OR REPLACE FUNCTION check_offer_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_usage INTEGER;
    usage_limit INTEGER;
BEGIN
    SELECT "offersUsed", "offersLimit" INTO current_usage, usage_limit
    FROM "UsageLimit"
    WHERE "userId" = NEW."craftsmanId";

    IF current_usage >= usage_limit THEN
        RAISE EXCEPTION 'Monthly offer limit reached';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Offer limit checking
DROP TRIGGER IF EXISTS check_offer_limit_trigger ON "Offer";
CREATE TRIGGER check_offer_limit_trigger
    BEFORE INSERT ON "Offer"
    FOR EACH ROW
    EXECUTE FUNCTION check_offer_limit();
