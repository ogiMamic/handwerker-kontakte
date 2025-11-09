-- Add Eni Zunic (Eni Elektro) profile with all portfolio images

-- First, create the User if not exists
INSERT INTO "User" (
  id, 
  name, 
  email, 
  "clerkId",
  type,
  "imageUrl",
  "subscriptionPlan",
  "createdAt",
  "updatedAt"
) VALUES (
  'eni-elektro-1',
  'Eni Zunic',
  'eni@eni-elektro.de',
  'eni-elektro-clerk-id',
  'CRAFTSMAN',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dOlu6eb7kXF05OAlEikqeJtNKnEjtM.png',
  'premium',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  "imageUrl" = EXCLUDED."imageUrl",
  "subscriptionPlan" = EXCLUDED."subscriptionPlan",
  "updatedAt" = NOW();

-- Added availableDays field (Monday-Friday work schedule)
INSERT INTO "CraftsmanProfile" (
  id,
  "userId",
  "companyName",
  "contactPerson",
  "businessLicense",
  "taxId",
  "insuranceProvider",
  "insurancePolicyNumber",
  "foundingYear",
  "availableDays",
  description,
  phone,
  "businessAddress",
  "businessCity",
  "businessPostalCode",
  skills,
  "hourlyRate",
  "serviceRadius",
  website,
  "isVerified",
  "verifiedAt",
  "createdAt",
  "updatedAt"
) VALUES (
  'eni-elektro-profile-1',
  'eni-elektro-1',
  'Eni Elektro',
  'Eni Zunic',
  'EL-12345-MUC',
  'DE123456789',
  'Allianz Versicherung',
  'POL-987654321',
  2014,
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  'Professioneller Elektriker in München Milbertshofen. Spezialisiert auf Elektroinstallationen, Beleuchtungssysteme, Schaltschränke und erneuerbare Energien. Zertifiziert und versichert mit über 10 Jahren Erfahrung.',
  '+49 1512 4724635',
  'Milbertshofener Straße',
  'München',
  '80807',
  ARRAY['Elektroinstallation', 'Beleuchtungssysteme', 'Schaltschränke', 'Photovoltaik', 'Smart Home', 'E-Mobilität'],
  75.00,
  50,
  'https://www.ogix-digital.de/eni-elektrik',
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  "companyName" = EXCLUDED."companyName",
  "contactPerson" = EXCLUDED."contactPerson",
  "businessLicense" = EXCLUDED."businessLicense",
  "taxId" = EXCLUDED."taxId",
  "insuranceProvider" = EXCLUDED."insuranceProvider",
  "insurancePolicyNumber" = EXCLUDED."insurancePolicyNumber",
  "foundingYear" = EXCLUDED."foundingYear",
  "availableDays" = EXCLUDED."availableDays",
  description = EXCLUDED.description,
  phone = EXCLUDED.phone,
  "businessAddress" = EXCLUDED."businessAddress",
  "businessCity" = EXCLUDED."businessCity",
  "businessPostalCode" = EXCLUDED."businessPostalCode",
  skills = EXCLUDED.skills,
  "hourlyRate" = EXCLUDED."hourlyRate",
  "serviceRadius" = EXCLUDED."serviceRadius",
  website = EXCLUDED.website,
  "isVerified" = EXCLUDED."isVerified",
  "verifiedAt" = EXCLUDED."verifiedAt",
  "updatedAt" = NOW();

-- Add to SponsoredCraftsman (priority 1 = highest)
INSERT INTO "SponsoredCraftsman" (
  id,
  "craftsmanId",
  priority,
  "startDate",
  "endDate",
  "createdAt",
  "updatedAt"
) VALUES (
  'sponsored-eni-1',
  'eni-elektro-1',
  1,
  NOW(),
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  priority = EXCLUDED.priority,
  "startDate" = EXCLUDED."startDate",
  "endDate" = EXCLUDED."endDate",
  "updatedAt" = NOW();

-- Add Portfolio images
INSERT INTO "Portfolio" (id, "craftsmanId", title, description, "imageUrl", category, "createdAt", "updatedAt")
VALUES 
  ('portfolio-eni-1', 'eni-elektro-1', 'Moderne LED-Beleuchtung', 'Installation moderner LED-Beleuchtungssysteme in Wohnräumen', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-i303RBm0bkYRB0hCiUF5MRYGqegL8F.png', 'Beleuchtung', NOW(), NOW()),
  ('portfolio-eni-2', 'eni-elektro-1', 'Designer Pendelleuchten', 'Professionelle Installation von Designer-Beleuchtungssystemen', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hJArbDSeS6P4kp9duwyorNB1OPKdlb.png', 'Beleuchtung', NOW(), NOW()),
  ('portfolio-eni-3', 'eni-elektro-1', 'Kreisförmige LED-Installation', 'Moderne kreisförmige LED-Beleuchtungsinstallation', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZmUx6dSZAPvAymGpUHZfna9Psy2VYw.png', 'Beleuchtung', NOW(), NOW()),
  ('portfolio-eni-4', 'eni-elektro-1', 'Geschwungene LED-Beleuchtung', 'Künstlerische geschwungene LED-Pendelleuchte', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1hdBPvx5cRnsxILmwrQNYqvoWZEWtz.png', 'Beleuchtung', NOW(), NOW()),
  ('portfolio-eni-5', 'eni-elektro-1', 'Elektroschränke Installation', 'Professionelle Installation von Elektroverteilerschränken', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-btD1pGhkCHQedhUocW5zwOzVf4MoD5.png', 'Elektroinstallation', NOW(), NOW()),
  ('portfolio-eni-6', 'eni-elektro-1', 'Elektrische Messungen', 'Präzise elektrische Messungen und Prüfungen', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UUwa8JXbLoXbGThkRmB7PpGG7oi4Tr.png', 'Wartung', NOW(), NOW()),
  ('portfolio-eni-7', 'eni-elektro-1', 'Photovoltaik-Wechselrichter', 'Installation von Photovoltaik-Wechselrichtern und Batteriespeichern', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FpkKSTGgKpbN4ZWjF5HwdiDVzzJtBh.png', 'Erneuerbare Energien', NOW(), NOW()),
  ('portfolio-eni-8', 'eni-elektro-1', 'Schaltschrank-Verkabelung', 'Professionelle Schaltschrank-Verdrahtung nach DIN-Normen', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dxaq8nO6r96sy38XViMtwQoWoB6QsP.png', 'Elektroinstallation', NOW(), NOW()),
  ('portfolio-eni-9', 'eni-elektro-1', 'Wolf Wärmepumpe Installation', 'Installation und Inbetriebnahme von Wolf Wärmepumpensystemen', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-WzDxSdnvNWSrPxb2nRSkiixI6FS12M.jpeg', 'Erneuerbare Energien', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "imageUrl" = EXCLUDED."imageUrl",
  category = EXCLUDED.category,
  "updatedAt" = NOW();
