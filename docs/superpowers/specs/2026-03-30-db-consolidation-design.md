# DB Consolidation — Merge Dual Database Into Single Source

**Date:** 2026-03-30
**Status:** Approved
**Priority:** 1 of 4 (blocks Job Creation Fix, Dashboard Fix, Stripe Production)

## Problem

The app has two disconnected database layers:

1. **Prisma layer** (`User` + `CraftsmanProfile` + `Review` + `Job`) — used by registration, search at `/de/handwerker`, profile details, Clerk auth, Stripe subscriptions.
2. **Raw SQL layer** (`handwerker` table) — used by SEO pages (`/stadt/`, `/kategorie/`), sitemap, noindex logic. Contains 54 scraped craftsmen from Google Maps.

These never see each other. Registered craftsmen don't appear on SEO pages. Scraped craftsmen don't appear in the main search.

## Goal

Single source of truth: `CraftsmanProfile` (Prisma) powers everything — registration, search, SEO pages, sitemap, noindex.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Primary system | Prisma (`CraftsmanProfile`) | Has auth, subscriptions, reviews, relations |
| SEO slug strategy | New columns `stadtSlug` + `gewerkSlugs[]` | Clean queries, no runtime mapping |
| SEO query migration | Same function interface, new SQL internals | Zero changes to page components |
| Scraped data | Migrate as unclaimed profiles (`claimed: false`, `userId: null`) | Preserves SEO value, enables future "claim your profile" |

## Schema Changes

### CraftsmanProfile — new columns

```prisma
model CraftsmanProfile {
  // ... existing fields ...

  stadtSlug    String?     // "muenchen" — derived from businessCity at write time
  gewerkSlugs  String[]    // ["elektriker", "maler"] — derived from skills[] at write time
  claimed      Boolean     @default(false)  // true = registered via form, false = scraped/migrated

  // Make userId nullable for unclaimed profiles
  userId       String?     @unique
  user         User?       @relation(fields: [userId], references: [id])
}
```

Key changes:
- `userId` becomes nullable (`String?`) — scraped profiles have no Clerk user
- `stadtSlug` stores the URL-friendly city slug (e.g., "muenchen")
- `gewerkSlugs` stores trade category slugs matching `GEWERKE` (e.g., ["elektriker"])
- `claimed` distinguishes registered (true) from scraped (false) profiles

### Mapping tables (in code, not DB)

Added to `lib/handwerker-dynamic/types.ts`:

```typescript
// Maps registration skill names → SEO gewerk slugs
SKILL_TO_GEWERK: Record<string, GewerkType> = {
  'Elektrik': 'elektriker',
  'Sanitär': 'klempner',
  'Malerarbeiten': 'maler',
  'Tischlerei': 'schreiner',
  'Dachdeckerarbeiten': 'dachdecker',
  'Fliesenlegen': 'fliesenleger',
  'Installation': 'installateur',
  'Gartenarbeit': 'gartenbauer',
  // ...
}

// Maps city display names → URL slugs
CITY_TO_SLUG: Record<string, StadtSlug> = {
  'München': 'muenchen',
  'Berlin': 'berlin',
  'Hamburg': 'hamburg',
  // ... derived from STAEDTE array
}
```

## Data Migration

One-time script (`scripts/migrate-to-prisma.ts`) that:

1. Reads all 54 records from `handwerker` table
2. For each, creates a `CraftsmanProfile` record:
   - `companyName` = `firma`
   - `contactPerson` = `name`
   - `phone` = `telefon`
   - `description` = `beschreibung`
   - `hourlyRate` = `stundensatz_min`
   - `businessCity` = city name (via `getStadtBySlug(stadt).name`)
   - `businessPostalCode` = `plz`
   - `skills` = mapped from `gewerk` → skill name (reverse of SKILL_TO_GEWERK)
   - `stadtSlug` = `stadt` (already a slug)
   - `gewerkSlugs` = `[gewerk]`
   - `claimed` = `false`
   - `userId` = `null`
3. Updates existing `CraftsmanProfile` records (from registration) with:
   - `stadtSlug` derived from `businessCity` via CITY_TO_SLUG
   - `gewerkSlugs` derived from `skills` via SKILL_TO_GEWERK
   - `claimed` = `true`

## SEO Query Layer — Internal SQL Rewrite

`lib/handwerker-dynamic/db.ts` functions keep the same interface but query `CraftsmanProfile` instead of `handwerker`:

### getHandwerker(filters)

Before: `SELECT * FROM handwerker WHERE stadt = $1 AND gewerk = $2`

After:
```sql
SELECT cp.id, cp."companyName" as firma, cp."contactPerson" as name,
       cp."stadtSlug" as stadt, cp."businessPostalCode" as plz,
       cp.description as beschreibung, cp.phone as telefon,
       cp."hourlyRate" as stundensatz_min, cp."hourlyRate" * 1.5 as stundensatz_max,
       COALESCE(AVG(r.rating), 0) as bewertung_avg,
       COUNT(r.id) as bewertung_count,
       cp.claimed as verified
FROM "CraftsmanProfile" cp
LEFT JOIN "Review" r ON r."craftsmanId" = cp."userId"
WHERE cp."stadtSlug" = $1 AND $2 = ANY(cp."gewerkSlugs")
GROUP BY cp.id
```

Return type stays `Handwerker[]` — the SELECT aliases ensure compatibility.

### getStadtStats(stadt, gewerk?)

Before: `SELECT COUNT(*), AVG(bewertung_avg) FROM handwerker WHERE stadt = $1`

After:
```sql
SELECT COUNT(*) as anzahl,
       COALESCE(ROUND(AVG(sub.avg_rating)::numeric, 1), 0) as avg_bewertung,
       ROUND(AVG(cp."hourlyRate")::numeric, 0) as avg_preis_min,
       ROUND(AVG(cp."hourlyRate" * 1.5)::numeric, 0) as avg_preis_max,
       COUNT(CASE WHEN cp.claimed THEN 1 END) as verified_count
FROM "CraftsmanProfile" cp
LEFT JOIN (
  SELECT "craftsmanId", AVG(rating) as avg_rating FROM "Review" GROUP BY "craftsmanId"
) sub ON sub."craftsmanId" = cp."userId"
WHERE cp."stadtSlug" = $1
  AND ($2::text IS NULL OR $2 = ANY(cp."gewerkSlugs"))
```

### getAktiveKombinacije()

Before: `SELECT stadt, gewerk, COUNT(*) FROM handwerker GROUP BY stadt, gewerk`

After:
```sql
SELECT cp."stadtSlug" as stadt, unnest(cp."gewerkSlugs") as gewerk, COUNT(*) as anzahl
FROM "CraftsmanProfile" cp
WHERE cp."stadtSlug" IS NOT NULL
GROUP BY cp."stadtSlug", gewerk
```

### getNachbarStaedte(stadt, gewerk?)

Same pattern — replace `handwerker.stadt` with `cp."stadtSlug"`, filter by `gewerkSlugs`.

### getVerfuegbareGewerke(stadt)

Same pattern — `unnest(cp."gewerkSlugs")` instead of `handwerker.gewerk`.

### getAktiveStaedte()

Same pattern — `DISTINCT cp."stadtSlug"` instead of `handwerker.stadt`.

## Registration Changes

`registerCraftsman()` in `lib/actions/craftsman-actions.ts` auto-populates slug columns on INSERT/UPDATE:

```typescript
// Derive slugs from form input
const stadtSlug = CITY_TO_SLUG[data.businessCity] || null;
const gewerkSlugs = data.skills
  .map(s => SKILL_TO_GEWERK[s])
  .filter(Boolean);

// Add to INSERT/UPDATE statement
..., "stadtSlug" = $X, "gewerkSlugs" = $Y, "claimed" = true
```

## Cleanup (after migration verified)

1. Drop `handwerker` table from Neon DB
2. Drop `bewertungen` table from Neon DB
3. Remove `lib/db.ts` (old raw SQL module with duplicate functions)
4. Remove handwerker/bewertungen seed data from `db/migrate.ts`
5. Remove `scripts/scrape-handwerker.ts` and `scripts/seed-handwerker.ts` (or update to write to CraftsmanProfile)

## Files Changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `stadtSlug`, `gewerkSlugs`, `claimed`; make `userId` nullable |
| `lib/handwerker-dynamic/db.ts` | Rewrite all SQL to query CraftsmanProfile |
| `lib/handwerker-dynamic/types.ts` | Add SKILL_TO_GEWERK, CITY_TO_SLUG mappings |
| `lib/actions/craftsman-actions.ts` | Auto-populate slugs on registration |
| `scripts/migrate-to-prisma.ts` | New: migrate 54 handwerker records |
| `lib/db.ts` | Delete (after migration) |
| `db/migrate.ts` | Remove handwerker/bewertungen table creation |

## Files NOT Changed

- `app/[lang]/handwerker/stadt/[city]/page.tsx` — uses db.ts functions, no change needed
- `app/[lang]/handwerker/kategorie/[slug]/page.tsx` — same
- `app/[lang]/handwerker/kategorie/[slug]/[city]/page.tsx` — same
- `app/sitemap.ts` — uses `getAktiveKombinacije()`, no change needed
- `lib/handwerker-dynamic/seo.ts` — generates content from slugs, no change
- `lib/handwerker-dynamic/types.ts` — GEWERKE/STAEDTE constants stay
- `components/handwerker/*` — all UI components stay
- Clerk, Stripe, middleware — untouched

## Edge Cases

- **Craftsman registers with city not in STAEDTE** — `stadtSlug` = null, profile visible in main search but not on SEO city pages. Acceptable.
- **Craftsman registers with skill not in SKILL_TO_GEWERK** — `gewerkSlugs` may be empty, profile visible in main search but not on SEO category pages. Acceptable.
- **Duplicate firma during migration** — check by `companyName` + `businessPostalCode` before INSERT, skip duplicates.
- **Future scraping** — update `scripts/seed-handwerker.ts` to write to `CraftsmanProfile` instead of `handwerker` table.

## Verification

After migration:
1. `/de/handwerker/stadt/muenchen` shows scraped + registered craftsmen
2. `/de/handwerker` search shows same craftsmen
3. Sitemap includes only pages with data (from CraftsmanProfile)
4. Noindex works on empty pages
5. New registration immediately appears on both search and SEO pages
6. `handwerker` table can be safely dropped
