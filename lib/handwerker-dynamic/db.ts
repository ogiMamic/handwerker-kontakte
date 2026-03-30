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
  const seite = Math.max(1, Math.floor(Number(filters.seite) || 1));
  const offset = (seite - 1) * perPage;

  // Subquery for review aggregation — only matches claimed profiles (userId IS NOT NULL).
  // Unclaimed/scraped profiles correctly show 0 reviews since they have no User row.
  const reviewSub = `
    LEFT JOIN (
      SELECT r."targetId",
             AVG(r.rating) as avg_rating,
             COUNT(r.id) as review_count
      FROM "Review" r
      GROUP BY r."targetId"
    ) sub ON cp."userId" IS NOT NULL AND sub."targetId" = cp."userId"
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
             COALESCE((cp."gewerkSlugs")[1], '') as gewerk,
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
    ) sub ON cp."userId" IS NOT NULL AND sub."targetId" = cp."userId"
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
  const safeLimit = Math.max(1, Math.floor(Number(limit) || 5));
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
     LIMIT ${safeLimit}`,
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
