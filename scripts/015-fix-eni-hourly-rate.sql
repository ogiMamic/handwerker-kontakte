-- Update Eni's hourly rate to 55€ to fix any cached/old data
UPDATE "CraftsmanProfile" 
SET "hourlyRate" = 55,
    "updatedAt" = NOW()
WHERE "userId" IN (
  SELECT id FROM "User" 
  WHERE email = 'kontakt@eni-elektro.de'
);
