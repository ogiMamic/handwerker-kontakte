# Noindex Empty Pages + Sitemap Filtering — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `noindex` to handwerker listing pages with 0 craftsmen and filter sitemap to only include pages with actual data.

**Architecture:** Each handwerker page's `generateMetadata()` adds a conditional `robots` field based on DB count. Sitemap uses a new `getAktiveKombinacije()` function that returns all stadt+gewerk pairs with data. Kosten/Ratgeber pages are untouched.

**Tech Stack:** Next.js 14 App Router metadata API, Neon PostgreSQL (`@neondatabase/serverless`)

---

### Task 1: Add `getAktiveKombinacije()` to DB layer

**Files:**
- Modify: `lib/handwerker-dynamic/db.ts:100-104` (after `getAktiveStaedte`)

This function returns all stadt+gewerk pairs with >= 1 handwerker. Used by the sitemap to build a filtered URL list.

- [ ] **Step 1: Add the function to `lib/handwerker-dynamic/db.ts`**

Add after the existing `getAktiveStaedte` function (line 104):

```typescript
export async function getAktiveKombinacije() {
  return await sql(
    `SELECT h.stadt, h.gewerk, COUNT(*) as anzahl
     FROM handwerker h
     GROUP BY h.stadt, h.gewerk
     ORDER BY anzahl DESC`
  ) as { stadt: string; gewerk: string; anzahl: number }[];
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: No errors related to `db.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/handwerker-dynamic/db.ts
git commit -m "feat: add getAktiveKombinacije() for sitemap filtering"
```

---

### Task 2: Add `robots: noindex` to stadt page metadata

**Files:**
- Modify: `app/[lang]/handwerker/stadt/[city]/page.tsx:24-45` (generateMetadata function)

The stadt page already calls `getStadtStats(city)` which returns `anzahl`. Use that to set `robots.index`.

- [ ] **Step 1: Add `robots` field to `generateMetadata` return**

In `app/[lang]/handwerker/stadt/[city]/page.tsx`, replace the `generateMetadata` function:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city } = await params;
  if (!isValidStadt(city)) return {};

  const stats = await getStadtStats(city);
  const seo = generateSEOContent(city, undefined, stats);

  return {
    title: seo.title,
    description: seo.metaDescription,
    robots: {
      index: stats.anzahl > 0,
      follow: true,
    },
    alternates: {
      canonical: `https://handwerker-kontakte.de/${lang}/handwerker/stadt/${city}`,
    },
    openGraph: {
      title: seo.h1,
      description: seo.metaDescription,
      url: `https://handwerker-kontakte.de/${lang}/handwerker/stadt/${city}`,
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
    },
  };
}
```

The only addition is the `robots` field. `stats.anzahl` is already fetched — no new DB call needed.

- [ ] **Step 2: Verify the page renders**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/[lang]/handwerker/stadt/[city]/page.tsx
git commit -m "feat: noindex stadt pages with 0 handwerker"
```

---

### Task 3: Add `robots: noindex` to kategorie/slug page metadata

**Files:**
- Modify: `app/[lang]/handwerker/kategorie/[slug]/page.tsx:12-24` (generateMetadata function)

This page currently has no DB call in `generateMetadata` — it only uses static category data. We need to add a count query. Use `getHandwerker({ gewerk })` from the Neon layer to check if any craftsmen exist for this category.

- [ ] **Step 1: Add import and DB call to `generateMetadata`**

Replace the full file `app/[lang]/handwerker/kategorie/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { SEOListingPage } from "@/components/seo/seo-listing-page"
import { getCategoryBySlug, SEO_CATEGORIES } from "@/lib/seo-data"
import { getHandwerker } from "@/lib/handwerker-dynamic"

interface Props {
  params: { lang: Locale; slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  if (!category) return {}

  const { total } = await getHandwerker({ gewerk: category.slug as any, seite: 1 })

  return {
    title: `${category.labelPlural} — Handwerker finden | Handwerker-Kontakte`,
    description: `${category.labelPlural} in Ihrer Nähe finden. ${category.description}. Profile vergleichen, Bewertungen lesen und direkt kontaktieren.`,
    robots: {
      index: total > 0,
      follow: true,
    },
    openGraph: {
      title: `${category.labelPlural} finden`,
      description: category.description,
    },
  }
}

export async function generateStaticParams() {
  return SEO_CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

export default function CategoryPage({ params, searchParams }: Props) {
  const category = getCategoryBySlug(params.slug)
  if (!category) notFound()

  return (
    <SEOListingPage
      lang={params.lang}
      category={category}
      searchParams={searchParams}
    />
  )
}
```

Key changes:
- Added `import { getHandwerker } from '@/lib/handwerker-dynamic'`
- Added `const { total } = await getHandwerker({ gewerk: category.slug as any, seite: 1 })` in `generateMetadata`
- Added `robots: { index: total > 0, follow: true }`

Note: `getHandwerker` with only `gewerk` filter returns count across all cities. The `seite: 1` limits the actual row fetch to 12, but `total` reflects the full count.

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/[lang]/handwerker/kategorie/[slug]/page.tsx
git commit -m "feat: noindex kategorie pages with 0 handwerker"
```

---

### Task 4: Add `robots: noindex` to kategorie/slug/city page metadata

**Files:**
- Modify: `app/[lang]/handwerker/kategorie/[slug]/[city]/page.tsx:23-43` (generateMetadata function)

This page already calls `getStadtStats(city, slug)` which returns `anzahl` for the specific trade+city combination. Use that.

- [ ] **Step 1: Add `robots` field to `generateMetadata` return**

In `app/[lang]/handwerker/kategorie/[slug]/[city]/page.tsx`, replace the `generateMetadata` function:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug, city } = await params;
  if (!isValidStadt(city) || !isValidGewerk(slug)) return {};

  const stats = await getStadtStats(city, slug);
  const seo = generateSEOContent(city, slug as GewerkType, stats);

  return {
    title: seo.title,
    description: seo.metaDescription,
    robots: {
      index: stats.anzahl > 0,
      follow: true,
    },
    alternates: {
      canonical: `https://handwerker-kontakte.de/${lang}/handwerker/kategorie/${slug}/${city}`,
    },
    openGraph: {
      title: seo.h1,
      description: seo.metaDescription,
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
    },
  };
}
```

The only addition is the `robots` field. `stats.anzahl` is already fetched — no new DB call needed.

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/[lang]/handwerker/kategorie/[slug]/[city]/page.tsx
git commit -m "feat: noindex kategorie+city pages with 0 handwerker"
```

---

### Task 5: Filter sitemap to exclude empty pages

**Files:**
- Modify: `app/sitemap.ts` (full rewrite of the default export)

Replace the static loop approach with data-driven filtering. Use `getAktiveKombinacije()` from `lib/handwerker-dynamic/db.ts` to build a set of active stadt+gewerk pairs, then only emit sitemap entries for those.

The sitemap currently imports `getAktiveStaedte` from `@/lib/db`. We switch to importing `getAktiveKombinacije` from `@/lib/handwerker-dynamic` which gives us both stadt and gewerk data in one query.

- [ ] **Step 1: Rewrite `app/sitemap.ts`**

Replace the entire file:

```typescript
// ============================================================
// app/sitemap.ts — Dinamički sitemap
// Samo stranice sa stvarnim sadržajem idu u sitemap
// ============================================================
import { getAktiveKombinacije } from '@/lib/handwerker-dynamic';
import { SEO_CATEGORIES, SEO_CITIES } from '@/lib/seo-data';

const BASE_URL = 'https://handwerker-kontakte.de';

export default async function sitemap() {
  const entries: {
    url: string;
    lastModified: Date;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }[] = [];

  const now = new Date();

  // ─── Statische Seiten ───────────────────────────────────────
  entries.push({
    url: BASE_URL,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  entries.push({
    url: `${BASE_URL}/handwerker`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // ─── Handwerker-Seiten: nur mit echten Daten ────────────────
  const aktiveKombinacije = await getAktiveKombinacije();

  // Städte mit mindestens 1 Handwerker (beliebiges Gewerk)
  const aktivStaedte = new Set(aktiveKombinacije.map((k) => k.stadt));
  for (const stadt of aktivStaedte) {
    entries.push({
      url: `${BASE_URL}/de/handwerker/stadt/${stadt}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Kategorien mit mindestens 1 Handwerker (beliebige Stadt)
  const aktivGewerke = new Set(aktiveKombinacije.map((k) => k.gewerk));
  for (const gewerk of aktivGewerke) {
    entries.push({
      url: `${BASE_URL}/de/handwerker/kategorie/${gewerk}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Stadt + Gewerk Kombinationen mit echten Daten
  for (const { stadt, gewerk } of aktiveKombinacije) {
    entries.push({
      url: `${BASE_URL}/de/handwerker/kategorie/${gewerk}/${stadt}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // ─── Kosten-Seiten: immer im Sitemap (eigener Content) ─────
  for (const category of SEO_CATEGORIES) {
    entries.push({
      url: `${BASE_URL}/de/kosten/${category.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });

    for (const city of SEO_CITIES) {
      entries.push({
        url: `${BASE_URL}/de/kosten/${category.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  // ─── Ratgeber: immer im Sitemap (eigener Content) ──────────
  // Blog posts are statically defined; add them if a blog index exists.
  // For now, the main /ratgeber routes are covered by static generation.

  return entries;
}
```

Key changes:
- Import `getAktiveKombinacije` from `@/lib/handwerker-dynamic` instead of `getAktiveStaedte` from `@/lib/db`
- Build `aktivStaedte` and `aktivGewerke` sets from the query result
- Only emit stadt entries for cities with data
- Only emit kategorie entries for trades with data
- Only emit stadt+gewerk combos that exist in DB
- Added Kosten pages (previously missing from sitemap)
- Removed `STAEDTE` and `GEWERKE` imports — no longer needed

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: filter sitemap to only include pages with handwerker data"
```

---

### Task 6: Export `getAktiveKombinacije` from barrel file

**Files:**
- Verify: `lib/handwerker-dynamic/index.ts`

The barrel file (`lib/handwerker-dynamic/index.ts`) already exports everything from `./db` via `export * from './db'`. Since `getAktiveKombinacije` is exported from `db.ts`, it will automatically be available via `@/lib/handwerker-dynamic`.

- [ ] **Step 1: Verify the export works**

Run: `grep 'export \* from' lib/handwerker-dynamic/index.ts`
Expected output: `export * from './db';` (among others)

No code change needed — the barrel re-export already covers it.

- [ ] **Step 2: Final build verification**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds with no errors related to the changed files.

- [ ] **Step 3: Final commit (if any remaining changes)**

Only if there were any fixes needed during verification:
```bash
git add -A
git commit -m "fix: resolve build issues from noindex/sitemap changes"
```