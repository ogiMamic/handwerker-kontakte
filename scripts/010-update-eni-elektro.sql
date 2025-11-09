-- Update Eni Elektro craftsman with correct information
INSERT INTO "Craftsman" (
  id,
  name,
  email,
  phone,
  city,
  postalCode,
  skills,
  hourlyRate,
  rating,
  isAvailable,
  bio,
  "createdAt",
  "updatedAt"
) VALUES (
  'eni-elektro-001',
  'Eni Zunic',
  'eni@eni-elektro.de',
  '+49 1512 4724635',
  'München Milbertshofen',
  '80809',
  ARRAY['Elektrik', 'Installation', 'Smart Home', 'Beleuchtungssysteme', 'Solartechnik'],
  75.00,
  4.9,
  true,
  'Professioneller Elektriker mit über 10 Jahren Erfahrung. Spezialisiert auf moderne Beleuchtungssysteme, Elektroinstallationen, Smart Home Lösungen und Solartechnik. Zertifiziert und versichert.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  city = EXCLUDED.city,
  postalCode = EXCLUDED.postalCode,
  bio = EXCLUDED.bio,
  "updatedAt" = NOW();

-- Add sponsored status for Eni Elektro
INSERT INTO "SponsoredCraftsman" (
  id,
  "craftsmanId",
  priority,
  "startDate",
  "endDate",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'eni-elektro-001',
  1,
  NOW(),
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Add gallery images for Eni Elektro
INSERT INTO "Portfolio" (
  id,
  "craftsmanId",
  title,
  description,
  "imageUrl",
  category,
  "createdAt",
  "updatedAt"
) VALUES 
  (gen_random_uuid(), 'eni-elektro-001', 'Moderne LED Beleuchtung', 'Installation von modernen X-förmigen LED-Strips in Wohnraum', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-i303RBm0bkYRB0hCiUF5MRYGqegL8F.png', 'Beleuchtung', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Spiral LED Leuchte', 'Installation einer modernen Spiral-LED-Leuchte', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hJArbDSeS6P4kp9duwyorNB1OPKdlb.png', 'Beleuchtung', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Runde LED Beleuchtung', 'Mehrere kreisförmige LED-Leuchten verschiedener Größen', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZmUx6dSZAPvAymGpUHZfna9Psy2VYw.png', 'Beleuchtung', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Wellenförmige LED Leuchte', 'Installation einer geschwungenen LED-Deckenleuchte', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1hdBPvx5cRnsxILmwrQNYqvoWZEWtz.png', 'Beleuchtung', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Elektroverteiler', 'Professionelle Installation eines Elektroverteilerschranks', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-btD1pGhkCHQedhUocW5zwOzVf4MoD5.png', 'Elektroinstallation', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Elektrische Prüfung', 'Elektrische Messungen und Prüfungen nach Norm', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UUwa8JXbLoXbGThkRmB7PpGG7oi4Tr.png', 'Elektroinstallation', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Solar Wechselrichter Installation', 'Installation von Solar-Wechselrichter mit Batteriespeicher', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FpkKSTGgKpbN4ZWjF5HwdiDVzzJtBh.png', 'Solartechnik', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Komplexer Schaltschrank', 'Fachgerechte Installation eines umfangreichen Schaltschranks', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dxaq8nO6r96sy38XViMtwQoWoB6QsP.png', 'Elektroinstallation', NOW(), NOW()),
  (gen_random_uuid(), 'eni-elektro-001', 'Wärmepumpe Installation', 'Installation einer Wolf Wärmepumpe mit Außeneinheit', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-WzDxSdnvNWSrPxb2nRSkiixI6FS12M.jpeg', 'HVAC', NOW(), NOW())
ON CONFLICT DO NOTHING;
