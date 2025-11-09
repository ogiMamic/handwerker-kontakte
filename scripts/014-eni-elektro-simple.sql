-- Jednostavna skripta za dodavanje Eni Elektro profila sa svim potrebnim poljima

-- Dodaj User entry
INSERT INTO "User" (
  id, 
  "clerkId",
  email, 
  name, 
  "imageUrl", 
  type, 
  "subscriptionPlan",
  "createdAt",
  "updatedAt"
) VALUES (
  'eni-elektro-1',
  'clerk_eni_elektro_demo',
  'kontakt@eni-elektro.de',
  'Eni Zunic',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dOlu6eb7kXF05OAlEikqeJtNKnEjtM.png',
  'CRAFTSMAN',
  'premium',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  "clerkId" = EXCLUDED."clerkId",
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  "imageUrl" = EXCLUDED."imageUrl",
  type = EXCLUDED.type,
  "subscriptionPlan" = EXCLUDED."subscriptionPlan",
  "updatedAt" = NOW();

-- Dodaj CraftsmanProfile sa SVIM poljima
INSERT INTO "CraftsmanProfile" (
  id,
  "userId",
  "companyName",
  description,
  phone,
  website,
  "businessAddress",
  "businessCity",
  "businessPostalCode",
  "serviceRadius",
  "hourlyRate",
  skills,
  "contactPerson",
  "businessLicense",
  "taxId",
  "insuranceProvider",
  "insurancePolicyNumber",
  "foundingYear",
  "availableDays",
  "workHoursStart",
  "workHoursEnd",
  "isVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  'eni-elektro-profile-1',
  'eni-elektro-1',
  'Eni Elektro',
  'Profesionalna elektro instalacija u Münchenu. Specijalizovani za modernu rasvetu, industrijske elektro instalacije i pametne kućne sisteme.',
  '+49 1512 4724635',
  'https://www.eni-elektro.de',
  'Milbertshofener Straße 45',
  'München',
  '80809',
  50,
  75.00,
  ARRAY['Elektroinstallation', 'Beleuchtung', 'Smart Home', 'Industrieelektrik'],
  'Eni Zunic',
  'EL-12345-MUC',
  'DE123456789',
  'Allianz Versicherung',
  'POL-987654321',
  2014,
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  '08:00',
  '18:00',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  "companyName" = EXCLUDED."companyName",
  description = EXCLUDED.description,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  "businessAddress" = EXCLUDED."businessAddress",
  "businessCity" = EXCLUDED."businessCity",
  "businessPostalCode" = EXCLUDED."businessPostalCode",
  "serviceRadius" = EXCLUDED."serviceRadius",
  "hourlyRate" = EXCLUDED."hourlyRate",
  skills = EXCLUDED.skills,
  "contactPerson" = EXCLUDED."contactPerson",
  "businessLicense" = EXCLUDED."businessLicense",
  "taxId" = EXCLUDED."taxId",
  "insuranceProvider" = EXCLUDED."insuranceProvider",
  "insurancePolicyNumber" = EXCLUDED."insurancePolicyNumber",
  "foundingYear" = EXCLUDED."foundingYear",
  "availableDays" = EXCLUDED."availableDays",
  "workHoursStart" = EXCLUDED."workHoursStart",
  "workHoursEnd" = EXCLUDED."workHoursEnd",
  "isVerified" = EXCLUDED."isVerified",
  "updatedAt" = NOW();

-- Dodaj Sponsored status
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
  NOW() + INTERVAL '365 days',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  priority = EXCLUDED.priority,
  "startDate" = EXCLUDED."startDate",
  "endDate" = EXCLUDED."endDate",
  "updatedAt" = NOW();

-- Dodaj Portfolio fotografije
INSERT INTO "Portfolio" (id, "craftsmanId", title, description, "imageUrl", category, "createdAt", "updatedAt") VALUES
('port-eni-1', 'eni-elektro-1', 'Moderna LED Rasveta', 'Instalacija moderne LED rasvete u poslovnom prostoru', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-i303RBm0bkYRB0hCiUF5MRYGqegL8F.png', 'Beleuchtung', NOW(), NOW()),
('port-eni-2', 'eni-elektro-1', 'Spiralna LED Instalacija', 'Dizajnerska spiralna LED rasveta u stambenom prostoru', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hJArbDSeS6P4kp9duwyorNB1OPKdlb.png', 'Beleuchtung', NOW(), NOW()),
('port-eni-3', 'eni-elektro-1', 'Kružna LED Rasveta', 'Elegantna kružna LED rasveta za moderne prostorije', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZmUx6dSZAPvAymGpUHZfna9Psy2VYw.png', 'Beleuchtung', NOW(), NOW()),
('port-eni-4', 'eni-elektro-1', '艺术LED设计', 'Umetničko oblikovanje LED rasvete u enterijeru', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1hdBPvx5cRnsxILmwrQNYqvoWZEWtz.png', 'Beleuchtung', NOW(), NOW()),
('port-eni-5', 'eni-elektro-1', 'Elektro Ormar Instalacija', 'Profesionalna instalacija elektro ormara za poslovne objekte', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-btD1pGhkCHQedhUocW5zwOzVf4MoD5.png', 'Elektroinstallation', NOW(), NOW()),
('port-eni-6', 'eni-elektro-1', 'Precizno Testiranje', 'Profesionalno testiranje elektro instalacija sa sertifikovanim uređajima', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UUwa8JXbLoXbGThkRmB7PpGG7oi4Tr.png', 'Elektroinstallation', NOW(), NOW()),
('port-eni-7', 'eni-elektro-1', 'Toplotne Pumpe Instalacija', 'Instalacija i povezivanje toplotnih pumpi', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FpkKSTGgKpbN4ZWjF5HwdiDVzzJtBh.png', 'Elektroinstallation', NOW(), NOW()),
('port-eni-8', 'eni-elektro-1', 'Industrijski Elektro Ormar', 'Kompleksna instalacija industrijskog elektro ormara', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dxaq8nO6r96sy38XViMtwQoWoB6QsP.png', 'Industrieelektrik', NOW(), NOW()),
('port-eni-9', 'eni-elektro-1', 'Wolf Toplotna Pumpa', 'Profesionalna instalacija Wolf toplotne pumpe za grejanje', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-WzDxSdnvNWSrPxb2nRSkiixI6FS12M.jpeg', 'Elektroinstallation', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "imageUrl" = EXCLUDED."imageUrl",
  category = EXCLUDED.category,
  "updatedAt" = NOW();
