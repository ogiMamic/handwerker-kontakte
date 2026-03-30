// ============================================================
// lib/handwerker-dynamic/db.ts
// NeonDB upiti za dinamičke handwerker stranice
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
    conditions.push(`h.stadt = $${idx++}`);
    params.push(filters.stadt);
  }
  if (filters.gewerk) {
    conditions.push(`h.gewerk = $${idx++}`);
    params.push(filters.gewerk);
  }
  if (filters.bewertung_min) {
    conditions.push(`h.bewertung_avg >= $${idx++}`);
    params.push(filters.bewertung_min);
  }
  if (filters.preis_max) {
    conditions.push(`h.stundensatz_max <= $${idx++}`);
    params.push(filters.preis_max);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'h.bewertung_avg DESC, h.bewertung_count DESC';
  if (filters.sortierung === 'preis_aufsteigend') orderBy = 'h.stundensatz_min ASC NULLS LAST';
  if (filters.sortierung === 'preis_absteigend') orderBy = 'h.stundensatz_max DESC NULLS LAST';
  if (filters.sortierung === 'name') orderBy = 'h.firma ASC';

  const perPage = 12;
  const offset = ((filters.seite || 1) - 1) * perPage;

  const [rows, countRows] = await Promise.all([
    sql(`SELECT h.* FROM handwerker h ${where} ORDER BY ${orderBy} LIMIT ${perPage} OFFSET ${offset}`, params),
    sql(`SELECT COUNT(*) as total FROM handwerker h ${where}`, params),
  ]);

  return {
    handwerker: rows as Handwerker[],
    total: Number(countRows[0]?.total || 0),
  };
}

export async function getStadtStats(stadt: string, gewerk?: string) {
  const conditions = ['h.stadt = $1'];
  const params: any[] = [stadt];
  if (gewerk) { conditions.push('h.gewerk = $2'); params.push(gewerk); }

  const rows = await sql(
    `SELECT 
      COUNT(*) as anzahl,
      ROUND(AVG(h.bewertung_avg)::numeric, 1) as avg_bewertung,
      ROUND(AVG(h.stundensatz_min)::numeric, 0) as avg_preis_min,
      ROUND(AVG(h.stundensatz_max)::numeric, 0) as avg_preis_max,
      COUNT(CASE WHEN h.verified THEN 1 END) as verified_count
    FROM handwerker h WHERE ${conditions.join(' AND ')}`,
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
  const condition = gewerk
    ? `WHERE h.stadt != $1 AND h.gewerk = $2`
    : `WHERE h.stadt != $1`;
  const params = gewerk ? [stadt, gewerk] : [stadt];

  return await sql(
    `SELECT h.stadt, COUNT(*) as anzahl FROM handwerker h ${condition} GROUP BY h.stadt ORDER BY anzahl DESC LIMIT ${limit}`,
    params
  ) as { stadt: string; anzahl: number }[];
}

export async function getVerfuegbareGewerke(stadt: string) {
  return await sql(
    `SELECT h.gewerk, COUNT(*) as anzahl FROM handwerker h WHERE h.stadt = $1 GROUP BY h.gewerk ORDER BY anzahl DESC`,
    [stadt]
  ) as { gewerk: string; anzahl: number }[];
}

export async function getAktiveStaedte() {
  return await sql(
    `SELECT DISTINCT h.stadt, COUNT(*) as anzahl FROM handwerker h GROUP BY h.stadt ORDER BY anzahl DESC`
  ) as { stadt: string; anzahl: number }[];
}
