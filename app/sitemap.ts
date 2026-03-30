// ============================================================
// app/sitemap.ts — Dinamički sitemap
// KLJUČNO: Google samo indeksira stranice iz sitemapa
// Prazne stranice NE idu u sitemap!
// ============================================================
import { getAktiveStaedte } from '@/lib/db';
import { STAEDTE, GEWERKE, GEWERK_LABELS } from '@/lib/types';

const BASE_URL = 'https://handwerker-kontakte.de';

export default async function sitemap() {
  const entries: {
    url: string;
    lastModified: Date;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }[] = [];

  // Startseite
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // Hauptseite /handwerker
  entries.push({
    url: `${BASE_URL}/handwerker`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // Alle definierten Städte (auch ohne Daten — SEO-Text ist da)
  for (const stadt of STAEDTE) {
    entries.push({
      url: `${BASE_URL}/handwerker/${stadt.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Stadt + Gewerk Kombinationen
    for (const gewerk of GEWERKE) {
      entries.push({
        url: `${BASE_URL}/handwerker/${stadt.slug}/${gewerk}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
