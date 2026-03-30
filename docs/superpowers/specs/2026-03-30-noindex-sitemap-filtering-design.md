# Noindex Empty Handwerker Pages + Sitemap Filtering

**Date:** 2026-03-30
**Status:** Approved

## Problem

The app generates ~303 handwerker listing pages (15 cities x 18 trades + city/category hubs), but most combinations have 0 registered craftsmen. Google indexes these empty pages, diluting crawl budget and potentially harming SEO quality signals.

## Scope

**In scope (noindex + sitemap filtering):**
- `/handwerker/stadt/{city}` — 15 pages
- `/handwerker/kategorie/{slug}` — 18 pages
- `/handwerker/kategorie/{slug}/{city}` — 270 pages

**Out of scope (always indexed):**
- `/kosten/{slug}` and `/kosten/{slug}/{city}` — hardcoded cost guide content, no dependency on registered craftsmen
- `/ratgeber/{slug}` — blog articles with standalone content
- Hub pages (`/handwerker`, Startseite)

## Noindex Criteria

Each route type checks independently:

| Route | Noindex when |
|---|---|
| `/handwerker/stadt/{city}` | 0 total craftsmen in that city (any trade) |
| `/handwerker/kategorie/{slug}` | 0 total craftsmen in that category (any city) |
| `/handwerker/kategorie/{slug}/{city}` | 0 craftsmen for that specific trade+city combo |

Pages with `noindex` keep `follow: true` so Google still crawls internal links to active pages.

## Design

### 1. New DB function: `getAktiveKombinacije()`

**File:** `lib/handwerker-dynamic/db.ts`

Single SQL query returning all city+trade pairs with at least 1 craftsman:

```sql
SELECT stadt, gewerk, COUNT(*) as anzahl
FROM handwerker
GROUP BY stadt, gewerk
```

Returns `{ stadt: string, gewerk: string, anzahl: number }[]`.

Used by `app/sitemap.ts` to build the filtered URL list. The metadata functions on individual pages already have access to `total` from `getHandwerker()` and don't need this function.

### 2. Metadata changes: conditional `robots`

Each handwerker listing page's `generateMetadata()` already fetches handwerker data. Add a conditional `robots` field based on the total count:

```typescript
// In generateMetadata() return object:
robots: {
  index: handwerkerTotal > 0,
  follow: true,
}
```

Applied to all three route files:
- `app/[lang]/handwerker/stadt/[city]/page.tsx`
- `app/[lang]/handwerker/kategorie/[slug]/page.tsx`
- `app/[lang]/handwerker/kategorie/[slug]/[city]/page.tsx`

### 3. Sitemap filtering

**File:** `app/sitemap.ts`

Replace the current "all combinations" approach with data-driven filtering using `getAktiveKombinacije()`:

- **Stadt entries:** include city only if it has >= 1 craftsman of any trade
- **Kategorie entries:** include category only if it has >= 1 craftsman in any city
- **Stadt+Gewerk combo entries:** include only pairs present in query result
- **Kosten entries:** no change, always included
- **Ratgeber entries:** no change, always included

### 4. No changes to

- `generateStaticParams()` — all pages still pre-render (avoids 404 for previously indexed URLs)
- Kosten/Ratgeber metadata — always `index: true`
- `app/robots.ts` — global rules unchanged
- Page rendering/UI — empty pages still show SEO content (intro, FAQ, prices) with "Keine Handwerker gefunden" message

### 5. Reactivity

- **Noindex:** automatic. SSR checks DB on every request. When a craftsman is added, the next page visit removes `noindex`.
- **Sitemap:** `app/sitemap.ts` is a dynamic route handler, re-evaluated on each request. New craftsman data appears on next sitemap fetch.
- **No rebuild required** for either change.

## Files Changed

| File | Change |
|---|---|
| `lib/handwerker-dynamic/db.ts` | Add `getAktiveKombinacije()` function |
| `app/[lang]/handwerker/stadt/[city]/page.tsx` | Add `robots` to metadata based on total |
| `app/[lang]/handwerker/kategorie/[slug]/page.tsx` | Add `robots` to metadata based on total |
| `app/[lang]/handwerker/kategorie/[slug]/[city]/page.tsx` | Add `robots` to metadata based on total |
| `app/sitemap.ts` | Filter URLs using `getAktiveKombinacije()` |

## Edge Cases

- **City with craftsmen in only 1 trade:** Stadt page is indexed (has results), but 17 of 18 kategorie/city combos get noindex.
- **All craftsmen removed from a city:** Next page visit adds noindex, next sitemap fetch removes the URL. Previously indexed pages will be de-indexed by Google over time.
- **New city added to `STAEDTE`:** Static params generate the page, but it gets noindex until craftsmen are added. Sitemap excludes it until then.
