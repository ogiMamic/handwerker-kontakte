// ============================================================
// app/robots.ts - Robots.txt za SEO
// ============================================================
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/registrieren/'],
      },
    ],
    sitemap: 'https://handwerker-kontakte.de/sitemap.xml',
  };
}
