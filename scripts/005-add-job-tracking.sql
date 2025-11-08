CREATE TABLE IF NOT EXISTS "JobView" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "jobId" TEXT NOT NULL REFERENCES "Job"("id") ON DELETE CASCADE,
  "craftsmanId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "viewedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "interestShown" BOOLEAN DEFAULT FALSE,
  UNIQUE("jobId", "craftsmanId")
);

CREATE INDEX IF NOT EXISTS "idx_job_views_job_id" ON "JobView"("jobId");
CREATE INDEX IF NOT EXISTS "idx_job_views_craftsman_id" ON "JobView"("craftsmanId");

-- Add custom category field to Job table
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customCategory" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "notifiedCount" INTEGER DEFAULT 0;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "viewedCount" INTEGER DEFAULT 0;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "interestedCount" INTEGER DEFAULT 0;

-- Function to track job view
CREATE OR REPLACE FUNCTION track_job_view(
  p_job_id TEXT,
  p_craftsman_id TEXT
) RETURNS void AS $$
BEGIN
  -- Insert or update job view
  INSERT INTO "JobView" ("jobId", "craftsmanId", "viewedAt")
  VALUES (p_job_id, p_craftsman_id, NOW())
  ON CONFLICT ("jobId", "craftsmanId") 
  DO UPDATE SET "viewedAt" = NOW();
  
  -- Update viewed count on Job
  UPDATE "Job" 
  SET "viewedCount" = (
    SELECT COUNT(*) FROM "JobView" WHERE "jobId" = p_job_id
  )
  WHERE "id" = p_job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark interest in job
CREATE OR REPLACE FUNCTION mark_job_interest(
  p_job_id TEXT,
  p_craftsman_id TEXT
) RETURNS void AS $$
BEGIN
  -- Update job view to show interest
  UPDATE "JobView"
  SET "interestShown" = TRUE
  WHERE "jobId" = p_job_id AND "craftsmanId" = p_craftsman_id;
  
  -- Update interested count on Job
  UPDATE "Job"
  SET "interestedCount" = (
    SELECT COUNT(*) FROM "JobView" 
    WHERE "jobId" = p_job_id AND "interestShown" = TRUE
  )
  WHERE "id" = p_job_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically notify matching craftsmen when job is created
CREATE OR REPLACE FUNCTION notify_matching_craftsmen()
RETURNS TRIGGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- This will be called from the application layer
  -- Just set initial notified count to 0
  NEW."notifiedCount" = 0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_craftsmen
  BEFORE INSERT ON "Job"
  FOR EACH ROW
  EXECUTE FUNCTION notify_matching_craftsmen();
