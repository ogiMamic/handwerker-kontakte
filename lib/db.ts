// ============================================================
// NeonDB query layer — sve upite za majstore
// ============================================================
import { neon } from '@neondatabase/serverless';
import type { Handwerker, Bewertung, FilterParams } from './types';

// Singleton connection
const sql = neon(process.env.DATABASE_URL!);

// ─── Generic query executor (used by craftsman-actions, db-utils) ──
export async function executeQuery(query: string, params: any[] = []): Promise<any[]> {
  return sql(query, params) as Promise<any[]>;
}

// ─── Hlavní query: dohvati majstore sa filterima ───────────
export async function getHandwerker(filters: FilterParams): Promise<{
  handwerker: Handwerker[];
  total: number;
}> {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.stadt) {
    conditions.push(`h.stadt = $${paramIndex}`);
    params.push(filters.stadt);
    paramIndex++;
  }

  if (filters.gewerk) {
    conditions.push(`h.gewerk = $${paramIndex}`);
    params.push(filters.gewerk);
    paramIndex++;
  }

  if (filters.bewertung_min) {
    conditions.push(`h.bewertung_avg >= $${paramIndex}`);
    params.push(filters.bewertung_min);
    paramIndex++;
  }

  if (filters.preis_max) {
    conditions.push(`h.stundensatz_max <= $${paramIndex}`);
    params.push(filters.preis_max);
    paramIndex++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sortierung
  let orderBy = 'h.bewertung_avg DESC, h.bewertung_count DESC';
  switch (filters.sortierung) {
    case 'preis_aufsteigend':
      orderBy = 'h.stundensatz_min ASC NULLS LAST';
      break;
    case 'preis_absteigend':
      orderBy = 'h.stundensatz_max DESC NULLS LAST';
      break;
    case 'name':
      orderBy = 'h.firma ASC';
      break;
  }

  // Pagination
  const perPage = 12;
  const offset = ((filters.seite || 1) - 1) * perPage;

  const [handwerkerRows, countRows] = await Promise.all([
    sql(
      `SELECT h.* FROM handwerker h ${where} ORDER BY ${orderBy} LIMIT ${perPage} OFFSET ${offset}`,
      params
    ),
    sql(`SELECT COUNT(*) as total FROM handwerker h ${where}`, params),
  ]);

  return {
    handwerker: handwerkerRows as Handwerker[],
    total: Number(countRows[0]?.total || 0),
  };
}

// ─── Bewertungen für einen Handwerker ──────────────────────
export async function getBewertungen(handwerkerId: string): Promise<Bewertung[]> {
  const rows = await sql(
    `SELECT * FROM bewertungen WHERE handwerker_id = $1 ORDER BY created_at DESC LIMIT 10`,
    [handwerkerId]
  );
  return rows as Bewertung[];
}

// ─── Statistiken für eine Stadt/Gewerk Kombination ─────────
export async function getStadtStats(stadt: string, gewerk?: string) {
  const conditions = ['h.stadt = $1'];
  const params: any[] = [stadt];

  if (gewerk) {
    conditions.push('h.gewerk = $2');
    params.push(gewerk);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const rows = await sql(
    `SELECT 
      COUNT(*) as anzahl,
      ROUND(AVG(h.bewertung_avg)::numeric, 1) as avg_bewertung,
      ROUND(AVG(h.stundensatz_min)::numeric, 0) as avg_preis_min,
      ROUND(AVG(h.stundensatz_max)::numeric, 0) as avg_preis_max,
      COUNT(CASE WHEN h.verified THEN 1 END) as verified_count
    FROM handwerker h ${where}`,
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

// ─── Susjedni gradovi sa rezultatima (za prazne stranice) ──
export async function getNachbarStaedte(
  stadt: string,
  gewerk?: string,
  limit = 5
): Promise<{ stadt: string; anzahl: number }[]> {
  const condition = gewerk
    ? `WHERE h.stadt != $1 AND h.gewerk = $2`
    : `WHERE h.stadt != $1`;
  const params = gewerk ? [stadt, gewerk] : [stadt];

  const rows = await sql(
    `SELECT h.stadt, COUNT(*) as anzahl 
     FROM handwerker h ${condition}
     GROUP BY h.stadt 
     ORDER BY anzahl DESC 
     LIMIT ${limit}`,
    params
  );

  return rows as { stadt: string; anzahl: number }[];
}

// ─── Verfügbare Gewerke in einer Stadt ─────────────────────
export async function getVerfuegbareGewerke(stadt: string) {
  const rows = await sql(
    `SELECT h.gewerk, COUNT(*) as anzahl 
     FROM handwerker h 
     WHERE h.stadt = $1 
     GROUP BY h.gewerk 
     ORDER BY anzahl DESC`,
    [stadt]
  );
  return rows as { gewerk: string; anzahl: number }[];
}

// ─── Alle Städte die Handwerker haben (für sitemap) ────────
export async function getAktiveStaedte() {
  const rows = await sql(
    `SELECT DISTINCT h.stadt, COUNT(*) as anzahl 
     FROM handwerker h 
     GROUP BY h.stadt 
     ORDER BY anzahl DESC`
  );
  return rows as { stadt: string; anzahl: number }[];
}
