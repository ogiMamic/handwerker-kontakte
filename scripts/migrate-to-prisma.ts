// ============================================================
// scripts/migrate-to-prisma.ts
// One-time migration: handwerker table → CraftsmanProfile
// Run: npx tsx scripts/migrate-to-prisma.ts
// ============================================================
import { neon } from '@neondatabase/serverless';
import { CITY_TO_SLUG, SKILL_TO_GEWERK, GEWERK_TO_SKILL, getStadtBySlug } from '../lib/handwerker-dynamic/types';
import type { GewerkType } from '../lib/handwerker-dynamic/types';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.DATABASE_URL!);

interface HandwerkerRow {
  id: string;
  name: string;
  firma: string;
  gewerk: string;
  stadt: string;
  plz: string;
  beschreibung: string;
  telefon: string;
  email: string;
  webseite: string | null;
  stundensatz_min: number | null;
  stundensatz_max: number | null;
  bewertung_avg: number;
  bewertung_count: number;
  verified: boolean;
}

async function migrateHandwerker() {
  console.log('📦 Reading handwerker table...');
  const rows = await sql('SELECT * FROM handwerker') as HandwerkerRow[];
  console.log(`   Found ${rows.length} records.`);

  let migrated = 0;
  let skipped = 0;

  for (const hw of rows) {
    // Duplicate check: same companyName + postalCode
    const existing = await sql(
      `SELECT id FROM "CraftsmanProfile" WHERE "companyName" = $1 AND "businessPostalCode" = $2`,
      [hw.firma, hw.plz]
    );

    if (existing.length > 0) {
      console.log(`   ⏭️  Skip duplicate: ${hw.firma} (${hw.plz})`);
      skipped++;
      continue;
    }

    const stadtInfo = getStadtBySlug(hw.stadt);
    const businessCity = stadtInfo?.name ?? hw.stadt;
    const stadtSlug = hw.stadt; // Already a slug
    const gewerkSlugs = [hw.gewerk]; // Single gewerk from old table
    const skills = [GEWERK_TO_SKILL[hw.gewerk as GewerkType] ?? hw.gewerk];
    const hourlyRate = hw.stundensatz_min ?? 50;

    const profileId = uuidv4();

    await sql(
      `INSERT INTO "CraftsmanProfile" (
        "id", "userId", "companyName", "contactPerson", "phone", "website",
        "description", "serviceRadius", "hourlyRate", "skills",
        "businessAddress", "businessCity", "businessPostalCode",
        "availableDays", "workHoursStart", "workHoursEnd", "vacationDates",
        "stadtSlug", "gewerkSlugs", "claimed",
        "isVerified", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20,
        $21, $22, $23
      )`,
      [
        profileId,
        null, // userId — unclaimed
        hw.firma,
        hw.name,
        hw.telefon || '',
        hw.webseite,
        hw.beschreibung || '',
        50, // serviceRadius default
        hourlyRate,
        skills,
        '', // businessAddress — not in old table
        businessCity,
        hw.plz,
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // availableDays default
        '08:00', // workHoursStart default
        '17:00', // workHoursEnd default
        [], // vacationDates default
        stadtSlug,
        gewerkSlugs,
        false, // claimed = false (scraped)
        hw.verified,
        new Date(),
        new Date(),
      ]
    );

    migrated++;
    console.log(`   ✅ Migrated: ${hw.firma} → CraftsmanProfile (${stadtSlug}/${gewerkSlugs[0]})`);
  }

  console.log(`\n📊 Migration: ${migrated} migrated, ${skipped} skipped.`);
}

async function updateExistingProfiles() {
  console.log('\n🔄 Updating existing registered CraftsmanProfiles with slug columns...');

  const profiles = await sql(
    `SELECT "id", "businessCity", "skills" FROM "CraftsmanProfile" WHERE "userId" IS NOT NULL`
  );

  let updated = 0;
  for (const p of profiles) {
    const stadtSlug = CITY_TO_SLUG[p.businessCity] ?? null;
    const skills: string[] = p.skills ?? [];
    const gewerkSlugs = skills
      .map((s: string) => SKILL_TO_GEWERK[s])
      .filter(Boolean);

    await sql(
      `UPDATE "CraftsmanProfile"
       SET "stadtSlug" = $1, "gewerkSlugs" = $2, "claimed" = true, "updatedAt" = $3
       WHERE "id" = $4`,
      [stadtSlug, gewerkSlugs, new Date(), p.id]
    );

    updated++;
    console.log(`   ✅ Updated: ${p.id} → stadtSlug=${stadtSlug}, gewerkSlugs=[${gewerkSlugs}]`);
  }

  console.log(`📊 Updated ${updated} existing profiles.`);
}

async function main() {
  try {
    await migrateHandwerker();
    await updateExistingProfiles();

    // Verify
    const total = await sql('SELECT COUNT(*) as count FROM "CraftsmanProfile"');
    const claimed = await sql('SELECT COUNT(*) as count FROM "CraftsmanProfile" WHERE claimed = true');
    const unclaimed = await sql('SELECT COUNT(*) as count FROM "CraftsmanProfile" WHERE claimed = false');

    console.log('\n🎉 Migration complete!');
    console.log(`   Total CraftsmanProfiles: ${total[0].count}`);
    console.log(`   Claimed (registered):    ${claimed[0].count}`);
    console.log(`   Unclaimed (scraped):     ${unclaimed[0].count}`);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

main();
