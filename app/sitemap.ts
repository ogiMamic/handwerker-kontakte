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
