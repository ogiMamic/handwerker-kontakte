-- 018: Add PageView table for visitor tracking
CREATE TABLE IF NOT EXISTS "PageView" (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pageview_created_at ON "PageView" (created_at);
CREATE INDEX IF NOT EXISTS idx_pageview_path ON "PageView" (path);
