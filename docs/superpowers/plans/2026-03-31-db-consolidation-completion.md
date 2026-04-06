# DB Consolidation Completion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the DB consolidation so all 54 scraped craftsmen appear on `/de/handwerker` search alongside registered ones, and verify sitemap/noindex correctness.

**Architecture:** The previous session (2026-03-30) completed ~90% of the spec: Prisma schema extended, SEO query layer rewritten, types/mappings added, migration script created and run, legacy tables dropped. The critical remaining gap is that `getCraftsmen()` in `craftsman-actions.ts` uses `INNER JOIN` through `User`, excluding the 54 unclaimed profiles (userId=null). Fix: rewrite the query to start from `CraftsmanProfile` with `LEFT JOIN User`.

**Tech Stack:** Next.js 14, Prisma (PostgreSQL/Neon), `@neondatabase/serverless`, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-30-db-consolidation-design.md`

---

## Status of Previous Implementation

| Spec Requirement | Status | Notes |
|---|---|---|
| Prisma schema: stadtSlug, gewerkSlugs, claimed, nullable userId | ✅ Done | `prisma/schema.prisma` lines 77-79 |
| Types: SKILL_TO_GEWERK, CITY_TO_SLUG | ✅ Done | `lib/handwerker-dynamic/types.ts` |
| SEO query layer: all 6 functions query CraftsmanProfile | ✅ Done | `lib/handwerker-dynamic/db.ts` |
| Registration auto-populates slugs | ✅ Done | `lib/actions/craftsman-actions.ts` |
| Migration script | ✅ Done | `scripts/migrate-to-prisma.ts` |
| Legacy tables dropped | ✅ Done | Session S37-S38 |
| db/migrate.ts deprecated | ✅ Done | No-op script |
| **getCraftsmen() shows all profiles** | ❌ BUG | INNER JOIN excludes unclaimed |
| **Verify 54 scraped in CraftsmanProfile** | ❓ Unverified | Need DB check |
| **Sitemap only pages with data** | ✅ Done | Uses getAktiveKombinacije() |
| **Noindex on empty pages** | ✅ Done | `stats.anzahl > 0` check |

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/actions/craftsman-actions.ts` | Modify | Rewrite `getCraftsmen()` to include unclaimed profiles |

---

### Task 1: Verify 54 Scraped Records Exist in CraftsmanProfile

**Files:**
- Read: Database via query

- [ ] **Step 1: Count CraftsmanProfile records**

Run a quick database check to verify the migration was successful:

```bash
npx tsx -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const total = await sql('SELECT COUNT(*) as count FROM \"CraftsmanProfile\"');
const claimed = await sql('SELECT COUNT(*) as count FROM \"CraftsmanProfile\" WHERE claimed = true');
const unclaimed = await sql('SELECT COUNT(*) as count FROM \"CraftsmanProfile\" WHERE claimed = false');
const withSlug = await sql('SELECT COUNT(*) as count FROM \"CraftsmanProfile\" WHERE \"stadtSlug\" IS NOT NULL');
console.log('Total:', total[0].count);
console.log('Claimed:', claimed[0].count);
console.log('Unclaimed:', unclaimed[0].count);
console.log('With stadtSlug:', withSlug[0].count);
"
```

Expected: Total >= 54, Unclaimed = 54, With stadtSlug >= 54.

- [ ] **Step 2: If migration not run, execute it**

If unclaimed count is 0, run the migration:

```bash
npx tsx scripts/migrate-to-prisma.ts
```

Expected output: "Migration complete! ... Unclaimed (scraped): 54"

- [ ] **Step 3: Commit if migration was needed**

```bash
git add -A && git commit -m "chore: verify/run data migration for 54 scraped craftsmen"
```

---

### Task 2: Fix getCraftsmen() to Include Unclaimed Profiles

**Files:**
- Modify: `lib/actions/craftsman-actions.ts:236-391`

The current `getCraftsmen()` function uses:
```sql
FROM "User" u
JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
```

This INNER JOIN excludes all 54 unclaimed profiles (userId=null, no User row). The fix: restructure the query to start from `CraftsmanProfile` with `LEFT JOIN User`.

- [ ] **Step 1: Rewrite getCraftsmen() query base**

In `lib/actions/craftsman-actions.ts`, replace the `getCraftsmen` function (lines 236-391) with the following. Key changes:
- Base table is now `CraftsmanProfile` with LEFT JOIN to User
- Sponsored craftsmen query stays unchanged (requires User)
- Exclusion of sponsored IDs uses `cp."userId"` instead of `u.id`
- Output mapping handles null User fields for unclaimed profiles

```typescript
export async function getCraftsmen(
  options: PaginationOptions = {},
  filters: any = {},
): Promise<PaginatedResult<any> & { sponsored: any[] }> {
  try {
    const page = options.page || 1
    const limit = options.limit || 20
    const offset = (page - 1) * limit

    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    // Sponsored query — only claimed profiles with User row
    const sponsoredQuery = `
      SELECT 
        u.id, u.name, u.email, u."imageUrl",
        cp."companyName", cp."businessPostalCode", cp."businessCity", 
        cp.phone, cp."hourlyRate", cp."isVerified", cp.skills,
        cp."createdAt",
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'COMPLETED') as "completedJobs",
        sc.priority
      FROM "User" u
      JOIN "CraftsmanProfile" cp ON u.id = cp."userId"
      LEFT JOIN "Review" r ON r."targetId" = u.id
      LEFT JOIN "Job" j ON j."craftsmanId" = u.id
      JOIN "SponsoredCraftsman" sc ON sc."craftsmanId" = u.id
      WHERE (sc."endDate" IS NULL OR sc."endDate" > NOW())
      GROUP BY u.id, cp."id", cp."companyName", cp."businessPostalCode", 
               cp."businessCity", cp.phone, cp."hourlyRate", cp."isVerified", 
               cp.skills, cp."createdAt", sc.priority
      ORDER BY sc.priority ASC, cp."createdAt" DESC
      LIMIT 3
    `
    let sponsoredCraftsmen: any[] = []
    try {
      sponsoredCraftsmen = await executeQuery(sponsoredQuery, [])
    } catch {
      // SponsoredCraftsman table may not exist — graceful fallback
      sponsoredCraftsmen = []
    }
    const sponsoredProfileIds = sponsoredCraftsmen.map((c: any) => c.id)

    // Exclude sponsored from main list (by CraftsmanProfile userId match)
    if (sponsoredProfileIds.length > 0) {
      whereClause += ` AND (cp."userId" IS NULL OR cp."userId" NOT IN (${sponsoredProfileIds.map((_: any, i: number) => `$${paramIndex + i}`).join(", ")}))`
      params.push(...sponsoredProfileIds)
      paramIndex += sponsoredProfileIds.length
    }

    // Filter: postal code
    if (filters.postalCode) {
      whereClause += ` AND cp."businessPostalCode" LIKE $${paramIndex}`
      params.push(`${filters.postalCode.substring(0, 2)}%`)
      paramIndex++
    }

    // Filter: skill (supports comma-separated multi-skill)
    if (filters.skill && filters.skill !== "all") {
      const skills = filters.skill.split(",").filter(Boolean)
      if (skills.length === 1) {
        whereClause += ` AND $${paramIndex} = ANY(cp.skills)`
        params.push(skills[0])
        paramIndex++
      } else if (skills.length > 1) {
        whereClause += ` AND cp.skills && $${paramIndex}::text[]`
        params.push(skills)
        paramIndex++
      }
    }

    // Filter: max hourly rate
    if (filters.maxHourlyRate && filters.maxHourlyRate < 200) {
      whereClause += ` AND cp."hourlyRate" <= $${paramIndex}`
      params.push(filters.maxHourlyRate)
      paramIndex++
    }

    // Count — from CraftsmanProfile (includes unclaimed)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM "CraftsmanProfile" cp
      ${whereClause}
    `
    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Data — CraftsmanProfile LEFT JOIN User
    const dataQuery = `
      SELECT 
        COALESCE(u.id, cp.id) as id,
        COALESCE(u.name, cp."contactPerson") as name,
        COALESCE(u.email, '') as email,
        u."imageUrl",
        cp."companyName", cp."businessPostalCode", cp."businessCity", 
        cp.phone, cp."hourlyRate", cp."isVerified", cp.skills,
        cp."createdAt", cp.claimed,
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'COMPLETED') as "completedJobs"
      FROM "CraftsmanProfile" cp
      LEFT JOIN "User" u ON u.id = cp."userId"
      LEFT JOIN "Review" r ON r."targetId" = u.id
      LEFT JOIN "Job" j ON j."craftsmanId" = u.id
      ${whereClause}
      GROUP BY cp.id, u.id, u.name, u.email, u."imageUrl",
               cp."companyName", cp."businessPostalCode", 
               cp."businessCity", cp.phone, cp."hourlyRate", cp."isVerified", 
               cp.skills, cp."createdAt", cp.claimed, cp."contactPerson"
      ORDER BY cp.claimed DESC, cp."createdAt" DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    const craftsmen = await executeQuery(dataQuery, params)

    const totalPages = Math.ceil(total / limit)

    return {
      data: craftsmen.map((c: any) => ({
        id: c.id,
        userId: c.id,
        name: c.name,
        email: c.email,
        imageUrl: c.imageUrl || null,
        companyName: c.companyName,
        businessPostalCode: c.businessPostalCode,
        businessCity: c.businessCity,
        phone: c.phone,
        hourlyRate: Number.parseFloat(c.hourlyRate),
        isVerified: c.isVerified,
        skills: c.skills || [],
        completedJobs: Number.parseInt(c.completedJobs) || 0,
        averageRating: c.averageRating ? Number.parseFloat(c.averageRating) : null,
        claimed: c.claimed,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(),
      })),
      sponsored: sponsoredCraftsmen.map((c: any) => ({
        id: c.id,
        userId: c.id,
        name: c.name,
        email: c.email,
        imageUrl: c.imageUrl,
        companyName: c.companyName,
        businessPostalCode: c.businessPostalCode,
        businessCity: c.businessCity,
        phone: c.phone,
        hourlyRate: Number.parseFloat(c.hourlyRate),
        isVerified: c.isVerified,
        skills: c.skills || [],
        completedJobs: Number.parseInt(c.completedJobs) || 0,
        averageRating: c.averageRating ? Number.parseFloat(c.averageRating) : null,
        isSponsored: true,
        priority: c.priority,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching craftsmen:", error)
    throw new Error("Failed to fetch craftsmen")
  }
}
```

- [ ] **Step 2: Run build to verify no type errors**

```bash
npm run build
```

Expected: Build succeeds. Key things to verify:
- `/de/handwerker` page builds without errors
- No TypeScript errors from the changed query structure

- [ ] **Step 3: Commit**

```bash
git add lib/actions/craftsman-actions.ts
git commit -m "fix: include unclaimed profiles in /de/handwerker search

getCraftsmen() used INNER JOIN through User table, excluding all 54
scraped craftsmen (userId=null). Restructured query to start from
CraftsmanProfile with LEFT JOIN User so both claimed and unclaimed
profiles appear in the main search listing.

Claimed profiles sort first, then by creation date."
```

---

### Task 3: Verify All Four Requirements

**Files:**
- Read: Various pages via build output / database

- [ ] **Step 1: Verify 54 scraped craftsmen on /de/handwerker**

```bash
npx tsx -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const total = await sql('SELECT COUNT(*) as count FROM \"CraftsmanProfile\"');
const unclaimed = await sql('SELECT COUNT(*) as count FROM \"CraftsmanProfile\" WHERE claimed = false');
const muenchen = await sql('SELECT COUNT(*) as count FROM \"CraftsmanProfile\" WHERE \"stadtSlug\" = \$1', ['muenchen']);
console.log('Total CraftsmanProfiles:', total[0].count, '(expected >= 54)');
console.log('Unclaimed (scraped):', unclaimed[0].count, '(expected = 54)');
console.log('München profiles:', muenchen[0].count);
"
```

- [ ] **Step 2: Verify registered handwerker appear on SEO pages**

```bash
npx tsx -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const claimed = await sql('SELECT \"companyName\", \"stadtSlug\", \"gewerkSlugs\" FROM \"CraftsmanProfile\" WHERE claimed = true');
console.log('Claimed profiles with SEO slugs:');
claimed.forEach(p => console.log(' ', p.companyName, '→', p.stadtSlug, p.gewerkSlugs));
"
```

Expected: Each claimed profile has stadtSlug and gewerkSlugs populated.

- [ ] **Step 3: Verify sitemap includes only pages with real data**

```bash
npx tsx -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const combos = await sql('SELECT cp.\"stadtSlug\" as stadt, g as gewerk, COUNT(*) as anzahl FROM \"CraftsmanProfile\" cp, unnest(cp.\"gewerkSlugs\") as g WHERE cp.\"stadtSlug\" IS NOT NULL GROUP BY cp.\"stadtSlug\", g ORDER BY anzahl DESC');
console.log('Active stadt+gewerk combinations (sitemap entries):');
combos.forEach(c => console.log(' ', c.stadt + '/' + c.gewerk, ':', c.anzahl, 'profiles'));
console.log('Total combinations:', combos.length);
"
```

Expected: Only combinations with actual profiles. No empty combinations.

- [ ] **Step 4: Verify noindex logic works**

The noindex logic is in:
- `app/[lang]/handwerker/stadt/[city]/page.tsx:37` — `index: stats.anzahl > 0`
- `app/[lang]/handwerker/kategorie/[slug]/page.tsx:26` — `index: total > 0`

Both query CraftsmanProfile via `getStadtStats()` / `getHandwerker()`. Pages with 0 profiles get `noindex`. ✅ Verified by code inspection.

- [ ] **Step 5: Deploy and verify production**

```bash
vercel --prod
```

After deploy, verify:
- `https://handwerker-kontakte.de/de/handwerker` — shows all craftsmen (claimed + unclaimed)
- `https://handwerker-kontakte.de/de/handwerker/stadt/muenchen` — shows München craftsmen
- `https://handwerker-kontakte.de/sitemap.xml` — only pages with data
