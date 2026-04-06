# DB Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the dual database architecture (Prisma `CraftsmanProfile` + raw SQL `handwerker` table) into a single `CraftsmanProfile`-based source of truth that powers registration, search, SEO pages, and sitemap.

**Architecture:** Add `stadtSlug`, `gewerkSlugs[]`, and `claimed` columns to `CraftsmanProfile`. Migrate 54 scraped records from `handwerker` table into `CraftsmanProfile` as unclaimed profiles. Rewrite `lib/handwerker-dynamic/db.ts` SQL to query `CraftsmanProfile` while keeping the same `Handwerker` return type via SELECT aliases. Auto-populate slug columns on registration.

**Tech Stack:** Next.js 14, Prisma (PostgreSQL/Neon), `@neondatabase/serverless` for raw SQL, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-30-db-consolidation-design.md`

**Spec corrections applied in this plan:**
- Review table JOIN uses `r."targetId"` (not `r."craftsmanId"` — that column doesn't exist)
- `lib/db.ts` is NOT deleted — `executeQuery()` is imported by 13+ files. Instead, we remove the 6 duplicate handwerker query functions from it.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `prisma/schema.prisma` | Modify | Add `stadtSlug`, `gewerkSlugs`, `claimed`; make `userId` nullable |
| `lib/handwerker-dynamic/types.ts` | Modify | Add `SKILL_TO_GEWERK`, `CITY_TO_SLUG` mapping tables |
| `scripts/migrate-to-prisma.ts` | Create | One-time migration: handwerker → CraftsmanProfile |
| `lib/handwerker-dynamic/db.ts` | Rewrite | All 6 functions query CraftsmanProfile instead of handwerker |
| `lib/actions/craftsman-actions.ts` | Modify | Auto-populate `stadtSlug`, `gewerkSlugs`, `claimed` on registration |
| `lib/db.ts` | Modify | Remove 6 duplicate handwerker functions; keep `executeQuery` |
| `db/migrate.ts` | Modify | Remove handwerker/bewertungen table creation + seed |

---

### Task 1: Prisma Schema Migration

**Files:**
- Modify: `prisma/schema.prisma` (CraftsmanProfile model, lines 30-60)

- [ ] **Step 1: Add new columns and make userId nullable**

Open `prisma/schema.prisma` and replace the `CraftsmanProfile` model with:

```prisma
model CraftsmanProfile {
  id            String    @id @default(cuid())
  userId        String?   @unique
  user          User?     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Profile information
  companyName   String
  contactPerson String
  phone         String
  website       String?
  description   String
  serviceRadius Int       @default(50)
  hourlyRate    Float
  skills        String[]

  // Business details
  businessLicense String?
  taxId         String?
  businessAddress String
  businessCity  String
  businessPostalCode String
  foundingYear  Int?
  insuranceProvider String?
  insurancePolicyNumber String?

  // Availability
  availableDays String[]  @default(["monday", "tuesday", "wednesday", "thursday", "friday"])
  workHoursStart String   @default("08:00")
  workHoursEnd  String    @default("17:00")
  vacationDates DateTime[]

  // SEO slug columns — derived at write time
  stadtSlug     String?
  gewerkSlugs   String[]  @default([])
  claimed       Boolean   @default(false)

  // Verification
  isVerified    Boolean   @default(false)
  verifiedAt    DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId])
  @@index([businessPostalCode])
  @@index([isVerified])
  @@index([stadtSlug])
  @@index([claimed])
}
```

Key changes from original:
- `userId String?` (was `String`) — nullable for unclaimed/scraped profiles
- `user User?` (was `User`) — optional relation
- Added `stadtSlug String?` with index
- Added `gewerkSlugs String[] @default([])`
- Added `claimed Boolean @default(false)` with index

- [ ] **Step 2: Generate and apply Prisma migration**

Run:
```bash
npx prisma migrate dev --name add-seo-slugs-and-claimed
```

Expected: Migration created successfully, database schema updated. If there are existing CraftsmanProfile rows with non-null userId, the migration should succeed since we're making the column MORE permissive (required → optional).

- [ ] **Step 3: Verify migration applied**

Run:
```bash
npx prisma migrate status
```

Expected: All migrations applied, no pending migrations.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add stadtSlug, gewerkSlugs, claimed columns to CraftsmanProfile

Make userId nullable to support unclaimed/scraped profiles.
Add indexes on stadtSlug and claimed for SEO query performance."
```

---

### Task 2: Add Mapping Tables to Types

**Files:**
- Modify: `lib/handwerker-dynamic/types.ts`

- [ ] **Step 1: Add SKILL_TO_GEWERK mapping**

Add after the `GEWERK_LABELS` constant (after line 43) in `lib/handwerker-dynamic/types.ts`:

```typescript
// Maps registration skill names → SEO gewerk slugs
export const SKILL_TO_GEWERK: Record<string, GewerkType> = {
  'Elektrik': 'elektriker',
  'Elektriker': 'elektriker',
  'Elektroinstallation': 'elektriker',
  'Sanitär': 'installateur',
  'Sanitärinstallation': 'installateur',
  'Installation': 'installateur',
  'Installateur': 'installateur',
  'Malerarbeiten': 'maler',
  'Maler': 'maler',
  'Maler & Lackierer': 'maler',
  'Tischlerei': 'schreiner',
  'Schreiner': 'schreiner',
  'Schreiner & Tischler': 'schreiner',
  'Dachdeckerarbeiten': 'dachdecker',
  'Dachdecker': 'dachdecker',
  'Fliesenlegen': 'fliesenleger',
  'Fliesenleger': 'fliesenleger',
  'Klempner': 'klempner',
  'Klempnerarbeiten': 'klempner',
  'Maurer': 'maurer',
  'Maurerarbeiten': 'maurer',
  'Zimmermann': 'zimmermann',
  'Zimmerei': 'zimmermann',
  'Heizungsbau': 'heizungsbauer',
  'Heizungsbauer': 'heizungsbauer',
  'Heizung': 'heizungsbauer',
  'Gartenbau': 'gartenbauer',
  'Garten- & Landschaftsbau': 'gartenbauer',
  'Gartenbauer': 'gartenbauer',
  'Schlüsseldienst': 'schluesseldienst',
  'Umzug': 'umzugsunternehmen',
  'Umzugsunternehmen': 'umzugsunternehmen',
  'Reinigung': 'reinigungsdienst',
  'Reinigungsdienst': 'reinigungsdienst',
  'Bodenleger': 'bodenleger',
  'Bodenbelag': 'bodenleger',
};
```

- [ ] **Step 2: Add CITY_TO_SLUG mapping**

Add after `SKILL_TO_GEWERK` in the same file:

```typescript
// Maps city display names → URL slugs (derived from STAEDTE)
export const CITY_TO_SLUG: Record<string, StadtSlug> = Object.fromEntries(
  STAEDTE.map((s) => [s.name, s.slug])
) as Record<string, StadtSlug>;
```

- [ ] **Step 3: Add reverse lookup GEWERK_TO_SKILL**

Add after `CITY_TO_SLUG`. This is needed by the migration script to derive `skills[]` from `gewerk` slug:

```typescript
// Reverse: gewerk slug → human-readable skill name (first match from SKILL_TO_GEWERK)
export const GEWERK_TO_SKILL: Record<GewerkType, string> = Object.fromEntries(
  GEWERKE.map((g) => {
    const entry = Object.entries(SKILL_TO_GEWERK).find(([, v]) => v === g);
    return [g, entry ? entry[0] : GEWERK_LABELS[g]];
  })
) as Record<GewerkType, string>;
```

- [ ] **Step 4: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit --pretty 2>&1 | head -20
```

Expected: No new errors from types.ts changes.

- [ ] **Step 5: Commit**

```bash
git add lib/handwerker-dynamic/types.ts
git commit -m "feat: add SKILL_TO_GEWERK, CITY_TO_SLUG, GEWERK_TO_SKILL mapping tables

These mappings bridge registration skill names to SEO gewerk slugs
and city display names to URL slugs for the DB consolidation."
```

---

### Task 3: Create Migration Script

**Files:**
- Create: `scripts/migrate-to-prisma.ts`

- [ ] **Step 1: Write the migration script**

Create `scripts/migrate-to-prisma.ts`:

```typescript
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
        "description", "hourlyRate", "skills", "businessAddress", "businessCity",
        "businessPostalCode", "stadtSlug", "gewerkSlugs", "claimed",
        "isVerified", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17, $18
      )`,
      [
        profileId,
        null, // userId — unclaimed
        hw.firma,
        hw.name,
        hw.telefon || '',
        hw.webseite,
        hw.beschreibung || '',
        hourlyRate,
        skills,
        '', // businessAddress — not in old table
        businessCity,
        hw.plz,
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
```

- [ ] **Step 2: Add npm script**

In `package.json`, add to `"scripts"`:

```json
"db:migrate-consolidate": "tsx scripts/migrate-to-prisma.ts"
```

- [ ] **Step 3: Commit (do NOT run yet — run after Task 4)**

```bash
git add scripts/migrate-to-prisma.ts package.json
git commit -m "feat: add one-time migration script handwerker → CraftsmanProfile

Migrates scraped records as unclaimed profiles (claimed=false, userId=null).
Updates existing registered profiles with stadtSlug and gewerkSlugs.
Skips duplicates by companyName + postalCode."
```

---

### Task 4: Run Migration Script

**Files:** None (database operation)

- [ ] **Step 1: Run Prisma migration first (if not done in Task 1)**

```bash
npx prisma migrate deploy
```

Expected: Migration applied successfully.

- [ ] **Step 2: Run the consolidation migration**

```bash
npx tsx scripts/migrate-to-prisma.ts
```

Expected output:
```
📦 Reading handwerker table...
   Found 54 records.
   ✅ Migrated: Elektro Müller GmbH → CraftsmanProfile (muenchen/elektriker)
   ...
📊 Migration: ~54 migrated, 0 skipped.
🔄 Updating existing registered CraftsmanProfiles with slug columns...
📊 Updated N existing profiles.
🎉 Migration complete!
   Total CraftsmanProfiles: ~54+N
```

- [ ] **Step 3: Verify data in database**

```bash
npx tsx -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function check() {
  const total = await sql('SELECT COUNT(*) as c FROM \"CraftsmanProfile\"');
  const byClaimed = await sql('SELECT claimed, COUNT(*) as c FROM \"CraftsmanProfile\" GROUP BY claimed');
  const byStadt = await sql('SELECT \"stadtSlug\", COUNT(*) as c FROM \"CraftsmanProfile\" WHERE \"stadtSlug\" IS NOT NULL GROUP BY \"stadtSlug\" ORDER BY c DESC LIMIT 5');
  console.log('Total:', total[0].c);
  console.log('By claimed:', byClaimed);
  console.log('Top cities:', byStadt);
}
check();
"
```

Expected: Total > 54, unclaimed count matches handwerker table count, top cities include muenchen/berlin/hamburg.

---

### Task 5: Rewrite SEO Query Layer

**Files:**
- Rewrite: `lib/handwerker-dynamic/db.ts` (complete file replacement)

This is the core task. All 6 functions keep their exact signatures and return types, but query `CraftsmanProfile` + `Review` instead of `handwerker`.

- [ ] **Step 1: Rewrite the complete db.ts file**

Replace `lib/handwerker-dynamic/db.ts` entirely with:

```typescript
// ============================================================
// lib/handwerker-dynamic/db.ts
// SEO query layer — queries CraftsmanProfile (unified source)
// ============================================================
import { neon } from '@neondatabase/serverless';
import type { Handwerker, FilterParams } from './types';

const sql = neon(process.env.DATABASE_URL!);

export async function getHandwerker(filters: FilterParams): Promise<{
  handwerker: Handwerker[];
  total: number;
}> {
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (filters.stadt) {
    conditions.push(`cp."stadtSlug" = $${idx++}`);
    params.push(filters.stadt);
  }
  if (filters.gewerk) {
    conditions.push(`$${idx++} = ANY(cp."gewerkSlugs")`);
    params.push(filters.gewerk);
  }
  if (filters.bewertung_min) {
    conditions.push(`COALESCE(sub.avg_rating, 0) >= $${idx++}`);
    params.push(filters.bewertung_min);
  }
  if (filters.preis_max) {
    conditions.push(`cp."hourlyRate" * 1.5 <= $${idx++}`);
    params.push(filters.preis_max);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'COALESCE(sub.avg_rating, 0) DESC, COALESCE(sub.review_count, 0) DESC';
  if (filters.sortierung === 'preis_aufsteigend') orderBy = 'cp."hourlyRate" ASC NULLS LAST';
  if (filters.sortierung === 'preis_absteigend') orderBy = 'cp."hourlyRate" DESC NULLS LAST';
  if (filters.sortierung === 'name') orderBy = 'cp."companyName" ASC';

  const perPage = 12;
  const offset = ((filters.seite || 1) - 1) * perPage;

  // Subquery for review aggregation to avoid GROUP BY complexity
  const reviewSub = `
    LEFT JOIN (
      SELECT r."targetId",
             AVG(r.rating) as avg_rating,
             COUNT(r.id) as review_count
      FROM "Review" r
      GROUP BY r."targetId"
    ) sub ON sub."targetId" = cp."userId"
  `;

  const baseQuery = `
    FROM "CraftsmanProfile" cp
    ${reviewSub}
    ${where}
  `;

  const [rows, countRows] = await Promise.all([
    sql(`
      SELECT cp.id,
             cp."companyName" as firma,
             cp."contactPerson" as name,
             (cp."gewerkSlugs")[1] as gewerk,
             cp."stadtSlug" as stadt,
             cp."businessPostalCode" as plz,
             cp.description as beschreibung,
             cp.phone as telefon,
             '' as email,
             cp.website as webseite,
             NULL as profilbild,
             cp."hourlyRate" as stundensatz_min,
             ROUND((cp."hourlyRate" * 1.5)::numeric, 2) as stundensatz_max,
             COALESCE(sub.avg_rating, 0) as bewertung_avg,
             COALESCE(sub.review_count, 0) as bewertung_count,
             cp.claimed as verified,
             cp."createdAt" as created_at,
             cp."updatedAt" as updated_at
      ${baseQuery}
      ORDER BY ${orderBy}
      LIMIT ${perPage} OFFSET ${offset}
    `, params),
    sql(`SELECT COUNT(*) as total ${baseQuery}`, params),
  ]);

  return {
    handwerker: rows as Handwerker[],
    total: Number(countRows[0]?.total || 0),
  };
}

export async function getStadtStats(stadt: string, gewerk?: string) {
  const conditions = ['cp."stadtSlug" = $1'];
  const params: any[] = [stadt];
  if (gewerk) {
    conditions.push('$2 = ANY(cp."gewerkSlugs")');
    params.push(gewerk);
  }

  const rows = await sql(
    `SELECT
      COUNT(*) as anzahl,
      COALESCE(ROUND(AVG(sub.avg_rating)::numeric, 1), 0) as avg_bewertung,
      ROUND(AVG(cp."hourlyRate")::numeric, 0) as avg_preis_min,
      ROUND(AVG(cp."hourlyRate" * 1.5)::numeric, 0) as avg_preis_max,
      COUNT(CASE WHEN cp.claimed THEN 1 END) as verified_count
    FROM "CraftsmanProfile" cp
    LEFT JOIN (
      SELECT r."targetId", AVG(r.rating) as avg_rating
      FROM "Review" r GROUP BY r."targetId"
    ) sub ON sub."targetId" = cp."userId"
    WHERE ${conditions.join(' AND ')}`,
    params
  );

  return {
    anzahl: Number(rows[0]?.anzahl || 0),
    avgBewertung: Number(rows[0]?.avg_bewertung || 0),
    avgPreisMin: Number(rows[0]?.avg_preis_min || 0),
    avgPreisMax: Number(rows[0]?.avg_preis_max || 0),
    verifiedCount: Number(rows[0]?.verified_count || 0),
  };
}

export async function getNachbarStaedte(stadt: string, gewerk?: string, limit = 5) {
  const conditions = ['cp."stadtSlug" != $1', 'cp."stadtSlug" IS NOT NULL'];
  const params: any[] = [stadt];
  if (gewerk) {
    conditions.push('$2 = ANY(cp."gewerkSlugs")');
    params.push(gewerk);
  }

  return await sql(
    `SELECT cp."stadtSlug" as stadt, COUNT(*) as anzahl
     FROM "CraftsmanProfile" cp
     WHERE ${conditions.join(' AND ')}
     GROUP BY cp."stadtSlug"
     ORDER BY anzahl DESC
     LIMIT ${limit}`,
    params
  ) as { stadt: string; anzahl: number }[];
}

export async function getVerfuegbareGewerke(stadt: string) {
  return await sql(
    `SELECT g as gewerk, COUNT(*) as anzahl
     FROM "CraftsmanProfile" cp, unnest(cp."gewerkSlugs") as g
     WHERE cp."stadtSlug" = $1
     GROUP BY g
     ORDER BY anzahl DESC`,
    [stadt]
  ) as { gewerk: string; anzahl: number }[];
}

export async function getAktiveStaedte() {
  return await sql(
    `SELECT cp."stadtSlug" as stadt, COUNT(*) as anzahl
     FROM "CraftsmanProfile" cp
     WHERE cp."stadtSlug" IS NOT NULL
     GROUP BY cp."stadtSlug"
     ORDER BY anzahl DESC`
  ) as { stadt: string; anzahl: number }[];
}

export async function getAktiveKombinacije() {
  return await sql(
    `SELECT cp."stadtSlug" as stadt, g as gewerk, COUNT(*) as anzahl
     FROM "CraftsmanProfile" cp, unnest(cp."gewerkSlugs") as g
     WHERE cp."stadtSlug" IS NOT NULL
     GROUP BY cp."stadtSlug", g
     ORDER BY anzahl DESC`
  ) as { stadt: string; gewerk: string; anzahl: number }[];
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

Expected: No type errors. The return types match the `Handwerker` interface via SELECT aliases.

- [ ] **Step 3: Verify locally that SEO pages load**

Run:
```bash
npm run dev
```

Visit `http://localhost:3000/de/handwerker/stadt/muenchen` and verify craftsmen appear.

- [ ] **Step 4: Commit**

```bash
git add lib/handwerker-dynamic/db.ts
git commit -m "feat: rewrite SEO query layer to use CraftsmanProfile

All 6 functions (getHandwerker, getStadtStats, getNachbarStaedte,
getVerfuegbareGewerke, getAktiveStaedte, getAktiveKombinacije) now
query CraftsmanProfile + Review instead of handwerker table.

Return types unchanged — SELECT aliases ensure Handwerker[] compatibility.
Page components require zero changes."
```

---

### Task 6: Update Registration to Auto-Populate Slugs

**Files:**
- Modify: `lib/actions/craftsman-actions.ts` (registerCraftsman function, lines 26-123)

- [ ] **Step 1: Add imports for slug mappings**

At the top of `lib/actions/craftsman-actions.ts`, add after existing imports:

```typescript
import { CITY_TO_SLUG, SKILL_TO_GEWERK } from "@/lib/handwerker-dynamic/types"
```

- [ ] **Step 2: Update the INSERT query**

In the `registerCraftsman` function, find the INSERT INTO "CraftsmanProfile" block (around line 67-86). Replace it with:

```typescript
      // Derive SEO slugs from form input
      const stadtSlug = CITY_TO_SLUG[validatedData.city] ?? null;
      const gewerkSlugs = validatedData.skills
        .map((s: string) => SKILL_TO_GEWERK[s])
        .filter(Boolean);

      // Erstelle neues CraftsmanProfile
      await executeQuery(
        `INSERT INTO "CraftsmanProfile" (
          "id", "userId", "companyName", "contactPerson", "phone", "description",
          "hourlyRate", "skills", "businessAddress", "businessCity", "businessPostalCode",
          "stadtSlug", "gewerkSlugs", "claimed",
          "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          profileId,
          dbUserId,
          validatedData.companyName,
          validatedData.contactPerson,
          validatedData.phone,
          validatedData.description,
          validatedData.hourlyRate,
          validatedData.skills,
          validatedData.address,
          validatedData.city,
          validatedData.postalCode,
          stadtSlug,
          gewerkSlugs,
          true, // claimed = true (registered via form)
          new Date(),
          new Date(),
        ],
      )
```

- [ ] **Step 3: Update the UPDATE query**

In the same function, find the UPDATE "CraftsmanProfile" block (around line 91-110). Replace with:

```typescript
      // Derive SEO slugs from form input
      const stadtSlug = CITY_TO_SLUG[validatedData.city] ?? null;
      const gewerkSlugs = validatedData.skills
        .map((s: string) => SKILL_TO_GEWERK[s])
        .filter(Boolean);

      // Update existierendes CraftsmanProfile
      await executeQuery(
        `UPDATE "CraftsmanProfile" SET
          "companyName" = $1, "contactPerson" = $2, "phone" = $3, "description" = $4,
          "hourlyRate" = $5, "skills" = $6, "businessAddress" = $7, "businessCity" = $8,
          "businessPostalCode" = $9, "stadtSlug" = $10, "gewerkSlugs" = $11, "claimed" = $12,
          "updatedAt" = $13
         WHERE "userId" = $14`,
        [
          validatedData.companyName,
          validatedData.contactPerson,
          validatedData.phone,
          validatedData.description,
          validatedData.hourlyRate,
          validatedData.skills,
          validatedData.address,
          validatedData.city,
          validatedData.postalCode,
          stadtSlug,
          gewerkSlugs,
          true, // claimed = true
          new Date(),
          dbUserId,
        ],
      )
```

- [ ] **Step 4: Also update profile and business update functions**

In `updateCraftsmanProfile`, for the `"profile"` type (around line 386-400), add slug derivation:

```typescript
    if (updateData.type === "profile") {
      const stadtSlug = CITY_TO_SLUG[updateData.data.businessCity] ?? null;
      const gewerkSlugs = (updateData.data.skills ?? [])
        .map((s: string) => SKILL_TO_GEWERK[s])
        .filter(Boolean);

      await executeQuery(
        `UPDATE "CraftsmanProfile" SET
          "companyName" = $1, "contactPerson" = $2, "phone" = $3, "website" = $4,
          "description" = $5, "hourlyRate" = $6, "skills" = $7,
          "stadtSlug" = $8, "gewerkSlugs" = $9, "updatedAt" = $10
         WHERE "userId" = $11`,
        [
          updateData.data.companyName,
          updateData.data.contactPerson,
          updateData.data.phone,
          updateData.data.website,
          updateData.data.description,
          updateData.data.hourlyRate,
          updateData.data.skills,
          stadtSlug,
          gewerkSlugs,
          new Date(),
          dbUserId,
        ],
      )
```

For the `"business"` type (around line 403-420), add stadtSlug derivation:

```typescript
    } else if (updateData.type === "business") {
      const stadtSlug = CITY_TO_SLUG[updateData.data.businessCity] ?? null;

      await executeQuery(
        `UPDATE "CraftsmanProfile" SET
          "businessLicense" = $1, "taxId" = $2, "businessAddress" = $3,
          "businessCity" = $4, "businessPostalCode" = $5, "foundingYear" = $6,
          "insuranceProvider" = $7, "insurancePolicyNumber" = $8,
          "stadtSlug" = $9, "updatedAt" = $10
         WHERE "userId" = $11`,
        [
          updateData.data.businessLicense,
          updateData.data.taxId,
          updateData.data.businessAddress,
          updateData.data.businessCity,
          updateData.data.businessPostalCode,
          updateData.data.foundingYear,
          updateData.data.insuranceProvider,
          updateData.data.insurancePolicyNumber,
          stadtSlug,
          new Date(),
          dbUserId,
        ],
      )
```

- [ ] **Step 5: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit --pretty 2>&1 | head -20
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add lib/actions/craftsman-actions.ts
git commit -m "feat: auto-populate stadtSlug and gewerkSlugs on registration

Registration and profile updates now derive SEO slug columns from
city name and skills, making craftsmen immediately visible on SEO pages."
```

---

### Task 7: Cleanup — Remove Duplicate Functions from lib/db.ts

**Files:**
- Modify: `lib/db.ts` (remove lines 15-168, keep executeQuery)

- [ ] **Step 1: Strip lib/db.ts down to executeQuery only**

Replace the entire `lib/db.ts` with:

```typescript
// ============================================================
// NeonDB query executor — shared by server actions
// SEO queries moved to lib/handwerker-dynamic/db.ts
// ============================================================
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function executeQuery(query: string, params: any[] = []): Promise<any[]> {
  return sql(query, params) as Promise<any[]>;
}
```

- [ ] **Step 2: Remove unused type imports**

Check `lib/types.ts` — the `Handwerker`, `Bewertung`, `FilterParams` types and `GEWERKE`, `STAEDTE` constants defined there are duplicates of `lib/handwerker-dynamic/types.ts`. Do NOT delete `lib/types.ts` yet — other files may still import from it. Check first:

Run:
```bash
grep -r "from.*lib/types" --include="*.ts" --include="*.tsx" -l
```

If no files import from `lib/types.ts`, delete it. If files do import from it, leave cleanup for a follow-up.

- [ ] **Step 3: Verify all imports still resolve**

Run:
```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

Expected: No errors about missing exports from `lib/db.ts`. The `executeQuery` function is the only export other files need.

- [ ] **Step 4: Commit**

```bash
git add lib/db.ts
git commit -m "refactor: strip lib/db.ts to executeQuery only

Removed 6 duplicate handwerker query functions now served by
lib/handwerker-dynamic/db.ts querying CraftsmanProfile."
```

---

### Task 8: Cleanup — Remove Old Migration/Seed for handwerker Table

**Files:**
- Modify: `db/migrate.ts`

- [ ] **Step 1: Gut db/migrate.ts**

This file creates the `handwerker` and `bewertungen` tables and seeds them. Since those tables are now legacy, replace the entire file with a deprecation notice:

```typescript
// ============================================================
// DEPRECATED: Old handwerker/bewertungen table migration
// Data has been migrated to CraftsmanProfile (Prisma).
// Use `npx prisma migrate deploy` for schema changes.
// Use `npx tsx scripts/migrate-to-prisma.ts` for data migration.
// ============================================================

async function main() {
  console.log('⚠️  This migration script is deprecated.');
  console.log('   handwerker/bewertungen tables have been replaced by CraftsmanProfile (Prisma).');
  console.log('   Use: npx prisma migrate deploy');
  process.exit(0);
}

main();
```

- [ ] **Step 2: Commit**

```bash
git add db/migrate.ts
git commit -m "refactor: deprecate old handwerker/bewertungen migration

Data now lives in CraftsmanProfile. Old tables retained in DB
until verification confirms they can be safely dropped."
```

---

### Task 9: Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds. All pages compile without errors.

- [ ] **Step 2: Start dev server and test SEO pages**

```bash
npm run dev
```

Visit each and verify craftsmen appear:
- `http://localhost:3000/de/handwerker/stadt/muenchen`
- `http://localhost:3000/de/handwerker/kategorie/elektriker`
- `http://localhost:3000/de/handwerker/kategorie/elektriker/muenchen`
- `http://localhost:3000/de/handwerker` (main search)

- [ ] **Step 3: Verify sitemap**

Visit `http://localhost:3000/sitemap.xml` — should list only city/gewerk combos with data from CraftsmanProfile.

- [ ] **Step 4: Verify homepage stats**

Visit `http://localhost:3000/de` — live stats in hero should reflect CraftsmanProfile data.

- [ ] **Step 5: Deploy to production**

```bash
vercel --prod
```

- [ ] **Step 6: Post-deploy verification**

Check production URLs:
- `https://handwerker-kontakte.de/de/handwerker/stadt/muenchen`
- `https://handwerker-kontakte.de/sitemap.xml`
- `https://handwerker-kontakte.de/de`

All should show data from the unified CraftsmanProfile table.

---

### Task 10: Drop Legacy Tables (AFTER production verification)

**Files:** None (database operation)

⚠️ **Only execute after Task 9 is fully verified in production.**

- [ ] **Step 1: Drop legacy tables**

```bash
npx tsx -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function drop() {
  await sql('DROP TABLE IF EXISTS bewertungen CASCADE');
  await sql('DROP TABLE IF EXISTS handwerker CASCADE');
  console.log('✅ Legacy tables dropped.');
}
drop();
"
```

- [ ] **Step 2: Verify app still works**

Re-check production URLs after dropping tables. Everything should work since no code queries these tables anymore.
