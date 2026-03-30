// ============================================================
// lib/handwerker-dynamic/types.ts
// Tipovi i konstante za dinamičke handwerker stranice
// ============================================================

// Sve podržane kategorije (Gewerke)
export const GEWERKE = [
  'elektriker',
  'installateur',
  'maler',
  'schreiner',
  'dachdecker',
  'fliesenleger',
  'klempner',
  'maurer',
  'zimmermann',
  'heizungsbauer',
  'gartenbauer',
  'schluesseldienst',
  'umzugsunternehmen',
  'reinigungsdienst',
  'bodenleger',
] as const;

export type GewerkType = (typeof GEWERKE)[number];

export const GEWERK_LABELS: Record<GewerkType, string> = {
  elektriker: 'Elektriker',
  installateur: 'Installateur',
  maler: 'Maler & Lackierer',
  schreiner: 'Schreiner & Tischler',
  dachdecker: 'Dachdecker',
  fliesenleger: 'Fliesenleger',
  klempner: 'Klempner',
  maurer: 'Maurer',
  zimmermann: 'Zimmermann',
  heizungsbauer: 'Heizungsbauer',
  gartenbauer: 'Garten- & Landschaftsbauer',
  schluesseldienst: 'Schlüsseldienst',
  umzugsunternehmen: 'Umzugsunternehmen',
  reinigungsdienst: 'Reinigungsdienst',
  bodenleger: 'Bodenleger',
};

// Top-Städte — slug odgovara [city] parametru u URL-u
export const STAEDTE = [
  { slug: 'muenchen', name: 'München', bundesland: 'Bayern' },
  { slug: 'berlin', name: 'Berlin', bundesland: 'Berlin' },
  { slug: 'hamburg', name: 'Hamburg', bundesland: 'Hamburg' },
  { slug: 'koeln', name: 'Köln', bundesland: 'Nordrhein-Westfalen' },
  { slug: 'frankfurt', name: 'Frankfurt am Main', bundesland: 'Hessen' },
  { slug: 'stuttgart', name: 'Stuttgart', bundesland: 'Baden-Württemberg' },
  { slug: 'duesseldorf', name: 'Düsseldorf', bundesland: 'Nordrhein-Westfalen' },
  { slug: 'dortmund', name: 'Dortmund', bundesland: 'Nordrhein-Westfalen' },
  { slug: 'essen', name: 'Essen', bundesland: 'Nordrhein-Westfalen' },
  { slug: 'leipzig', name: 'Leipzig', bundesland: 'Sachsen' },
  { slug: 'bremen', name: 'Bremen', bundesland: 'Bremen' },
  { slug: 'dresden', name: 'Dresden', bundesland: 'Sachsen' },
  { slug: 'hannover', name: 'Hannover', bundesland: 'Niedersachsen' },
  { slug: 'nuernberg', name: 'Nürnberg', bundesland: 'Bayern' },
  { slug: 'augsburg', name: 'Augsburg', bundesland: 'Bayern' },
] as const;

export type StadtSlug = (typeof STAEDTE)[number]['slug'];

export function getStadtBySlug(slug: string) {
  return STAEDTE.find((s) => s.slug === slug);
}

export function isValidGewerk(gewerk: string): gewerk is GewerkType {
  return GEWERKE.includes(gewerk as GewerkType);
}

export function isValidStadt(stadt: string): stadt is StadtSlug {
  return STAEDTE.some((s) => s.slug === stadt);
}

export interface FilterParams {
  stadt?: string;
  gewerk?: GewerkType;
  bewertung_min?: number;
  preis_max?: number;
  sortierung?: 'bewertung' | 'preis_aufsteigend' | 'preis_absteigend' | 'name';
  seite?: number;
}

export interface Handwerker {
  id: string;
  name: string;
  firma: string;
  gewerk: GewerkType;
  stadt: string;
  plz: string;
  beschreibung: string;
  telefon: string;
  email: string;
  webseite?: string;
  profilbild?: string;
  stundensatz_min?: number;
  stundensatz_max?: number;
  bewertung_avg: number;
  bewertung_count: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
