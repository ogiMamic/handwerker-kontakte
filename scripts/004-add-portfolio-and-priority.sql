-- Portfolio table for craftsman work showcase
CREATE TABLE IF NOT EXISTS "Portfolio" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "craftsmanId" TEXT NOT NULL REFERENCES "CraftsmanProfile"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT NOT NULL,
  "images" TEXT[] DEFAULT '{}',
  "completionDate" TIMESTAMP,
  "budget" NUMERIC,
  "clientTestimonial" TEXT,
  "featured" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS "SupportTicket" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL, -- technical, billing, general
  "status" TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  "priority" TEXT DEFAULT 'normal', -- low, normal, high, urgent
  "assignedTo" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support ticket messages
CREATE TABLE IF NOT EXISTS "SupportTicketMessage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "ticketId" TEXT NOT NULL REFERENCES "SupportTicket"("id") ON DELETE CASCADE,
  "senderId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "attachments" TEXT[] DEFAULT '{}',
  "isStaff" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "eventType" TEXT NOT NULL, -- job_view, offer_sent, offer_accepted, profile_view
  "entityId" TEXT, -- jobId or profileId
  "metadata" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add priority fields to existing tables
ALTER TABLE "Job" 
ADD COLUMN IF NOT EXISTS "isPriority" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "priorityUntil" TIMESTAMP;

ALTER TABLE "Offer" 
ADD COLUMN IF NOT EXISTS "isPriority" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_portfolio_craftsman" ON "Portfolio"("craftsmanId");
CREATE INDEX IF NOT EXISTS "idx_portfolio_featured" ON "Portfolio"("featured");
CREATE INDEX IF NOT EXISTS "idx_support_ticket_user" ON "SupportTicket"("userId");
CREATE INDEX IF NOT EXISTS "idx_support_ticket_status" ON "SupportTicket"("status");
CREATE INDEX IF NOT EXISTS "idx_analytics_user" ON "AnalyticsEvent"("userId");
CREATE INDEX IF NOT EXISTS "idx_analytics_type" ON "AnalyticsEvent"("eventType");
CREATE INDEX IF NOT EXISTS "idx_job_priority" ON "Job"("isPriority", "priorityUntil");
CREATE INDEX IF NOT EXISTS "idx_offer_priority" ON "Offer"("isPriority", "submittedAt");

-- Function to automatically set priority based on subscription
CREATE OR REPLACE FUNCTION set_job_priority()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
BEGIN
  -- Get user's subscription plan
  SELECT plan INTO user_plan
  FROM "Subscription"
  WHERE "userId" = NEW."clientId"
  AND "status" = 'active'
  ORDER BY "currentPeriodEnd" DESC
  LIMIT 1;
  
  -- Set priority if user has premium or business plan
  IF user_plan IN ('client_premium', 'client_business') THEN
    NEW."isPriority" := true;
    NEW."priorityUntil" := CURRENT_TIMESTAMP + INTERVAL '30 days';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_job_priority
BEFORE INSERT ON "Job"
FOR EACH ROW
EXECUTE FUNCTION set_job_priority();

-- Function to set offer priority
CREATE OR REPLACE FUNCTION set_offer_priority()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
BEGIN
  -- Get craftsman's subscription plan
  SELECT s.plan INTO user_plan
  FROM "Subscription" s
  JOIN "CraftsmanProfile" cp ON cp."userId" = s."userId"
  WHERE cp."id" = NEW."craftsmanId"
  AND s."status" = 'active'
  ORDER BY s."currentPeriodEnd" DESC
  LIMIT 1;
  
  -- Set priority if craftsman has professional or business plan
  IF user_plan IN ('craftsman_professional', 'craftsman_business') THEN
    NEW."isPriority" := true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_offer_priority
BEFORE INSERT ON "Offer"
FOR EACH ROW
EXECUTE FUNCTION set_offer_priority();
