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

// Maps registration skill names → SEO gewerk slugs
export const SKILL_TO_GEWERK: Record<string, GewerkType> = {
  'Elektrik': 'elektriker',
  'Elektriker': 'elektriker',
  'Elektroinstallation': 'elektriker',
  'Sanitär': 'installateur',
  'Sanitärinstallation': 'installateur',
  'Installation': 'installateur',
  'Installateur': 'installateur',
  'Malerarbeiten': 'maler',
  'Maler': 'maler',
  'Maler & Lackierer': 'maler',
  'Tischlerei': 'schreiner',
  'Schreiner': 'schreiner',
  'Schreiner & Tischler': 'schreiner',
  'Dachdeckerarbeiten': 'dachdecker',
  'Dachdecker': 'dachdecker',
  'Fliesenlegen': 'fliesenleger',
  'Fliesenleger': 'fliesenleger',
  'Klempner': 'klempner',
  'Klempnerarbeiten': 'klempner',
  'Maurer': 'maurer',
  'Maurerarbeiten': 'maurer',
  'Zimmermann': 'zimmermann',
  'Zimmerei': 'zimmermann',
  'Heizungsbau': 'heizungsbauer',
  'Heizungsbauer': 'heizungsbauer',
  'Heizung': 'heizungsbauer',
  'Gartenbau': 'gartenbauer',
  'Garten- & Landschaftsbau': 'gartenbauer',
  'Gartenbauer': 'gartenbauer',
  'Schlüsseldienst': 'schluesseldienst',
  'Umzug': 'umzugsunternehmen',
  'Umzugsunternehmen': 'umzugsunternehmen',
  'Reinigung': 'reinigungsdienst',
  'Reinigungsdienst': 'reinigungsdienst',
  'Bodenleger': 'bodenleger',
  'Bodenbelag': 'bodenleger',
  // English skill names (used by some registered profiles)
  'electrical': 'elektriker',
  'smart-home': 'elektriker',
  'lighting': 'elektriker',
  'plumbing': 'installateur',
  'bathroom': 'installateur',
  'painting': 'maler',
  'wallpaper': 'maler',
  'plastering': 'maler',
  'facade': 'maler',
  'carpentry': 'schreiner',
  'furniture': 'schreiner',
  'kitchen': 'schreiner',
  'roofing': 'dachdecker',
  'insulation': 'dachdecker',
  'gutters': 'dachdecker',
  'skylights': 'dachdecker',
  'tiling': 'fliesenleger',
  'hvac': 'heizungsbauer',
  'ventilation': 'heizungsbauer',
  'cooling': 'heizungsbauer',
  'heating': 'heizungsbauer',
  'landscaping': 'gartenbauer',
  'gardening': 'gartenbauer',
  'fencing': 'gartenbauer',
  'paving': 'gartenbauer',
  'flooring': 'bodenleger',
  'moving': 'umzugsunternehmen',
  'cleaning': 'reinigungsdienst',
  'locksmith': 'schluesseldienst',
  'masonry': 'maurer',
};

// Top-Staedte - slug odgovara [city] parametru u URL-u
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

// Maps city display names → URL slugs (derived from STAEDTE + common variants)
export const CITY_TO_SLUG: Record<string, StadtSlug> = {
  ...Object.fromEntries(STAEDTE.map((s) => [s.name, s.slug])),
  // Common short forms
  'Frankfurt': 'frankfurt',
  'Nuernberg': 'nuernberg',
  'Nurnberg': 'nuernberg',
  'Koeln': 'koeln',
  'Muenchen': 'muenchen',
  'Duesseldorf': 'duesseldorf',
} as Record<string, StadtSlug>;

// Reverse: gewerk slug → human-readable skill name (first match from SKILL_TO_GEWERK)
export const GEWERK_TO_SKILL: Record<GewerkType, string> = Object.fromEntries(
  GEWERKE.map((g) => {
    const entry = Object.entries(SKILL_TO_GEWERK).find(([, v]) => v === g);
    return [g, entry ? entry[0] : GEWERK_LABELS[g]];
  })
) as Record<GewerkType, string>;

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
