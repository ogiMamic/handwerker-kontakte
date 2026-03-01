// Categories and cities for SEO pages
// Each gets its own URL like /de/handwerker/elektriker-muenchen

export interface SEOCategory {
  slug: string
  skill: string           // matches DB skill value
  label: string           // display name
  labelPlural: string     // for page titles
  description: string     // meta description text
  icon: string
}

export interface SEOCity {
  slug: string
  name: string
  region: string
  plzRange: string        // for filtering
}

export const SEO_CATEGORIES: SEOCategory[] = [
  {
    slug: "elektriker",
    skill: "Elektrik",
    label: "Elektriker",
    labelPlural: "Elektriker",
    description: "Elektroinstallation, Reparaturen, Smart Home, Beleuchtung",
    icon: "⚡",
  },
  {
    slug: "klempner",
    skill: "Sanitär",
    label: "Klempner",
    labelPlural: "Klempner & Sanitär",
    description: "Sanitärinstallation, Rohrreinigung, Badsanierung, Heizung",
    icon: "🔧",
  },
  {
    slug: "maler",
    skill: "Malerarbeiten",
    label: "Maler",
    labelPlural: "Maler & Lackierer",
    description: "Innenausbau, Fassadenanstrich, Tapezieren, Lackierung",
    icon: "🎨",
  },
  {
    slug: "fliesenleger",
    skill: "Fliesenlegen",
    label: "Fliesenleger",
    labelPlural: "Fliesenleger",
    description: "Bodenfliesen, Wandfliesen, Naturstein, Mosaik",
    icon: "🔲",
  },
  {
    slug: "tischler",
    skill: "Tischlerei",
    label: "Tischler",
    labelPlural: "Tischler & Schreiner",
    description: "Möbelbau, Einbauschränke, Türen, Fenster, Holzarbeiten",
    icon: "🪚",
  },
  {
    slug: "dachdecker",
    skill: "Dachdeckerarbeiten",
    label: "Dachdecker",
    labelPlural: "Dachdecker",
    description: "Dachsanierung, Dacheindeckung, Abdichtung, Dachfenster",
    icon: "🏠",
  },
  {
    slug: "renovierung",
    skill: "Renovierung",
    label: "Renovierung",
    labelPlural: "Renovierung & Sanierung",
    description: "Komplettsanierung, Altbausanierung, Umbau, Modernisierung",
    icon: "🏗️",
  },
  {
    slug: "gaertner",
    skill: "Gartenarbeit",
    label: "Gärtner",
    labelPlural: "Gärtner & Landschaftsbau",
    description: "Gartenpflege, Landschaftsbau, Baumschnitt, Rasenpflege",
    icon: "🌿",
  },
  {
    slug: "umzug",
    skill: "Umzug",
    label: "Umzugshelfer",
    labelPlural: "Umzugsunternehmen",
    description: "Umzüge, Möbeltransport, Ein- und Auspacken, Montage",
    icon: "📦",
  },
  {
    slug: "installateur",
    skill: "Installation",
    label: "Installateur",
    labelPlural: "Installateure",
    description: "Heizungsinstallation, Klimaanlage, Wasserinstallation",
    icon: "🔩",
  },
]

export const SEO_CITIES: SEOCity[] = [
  { slug: "muenchen", name: "München", region: "Bayern", plzRange: "80" },
  { slug: "berlin", name: "Berlin", region: "Berlin", plzRange: "10" },
  { slug: "hamburg", name: "Hamburg", region: "Hamburg", plzRange: "20" },
  { slug: "koeln", name: "Köln", region: "Nordrhein-Westfalen", plzRange: "50" },
  { slug: "frankfurt", name: "Frankfurt am Main", region: "Hessen", plzRange: "60" },
  { slug: "stuttgart", name: "Stuttgart", region: "Baden-Württemberg", plzRange: "70" },
  { slug: "duesseldorf", name: "Düsseldorf", region: "Nordrhein-Westfalen", plzRange: "40" },
  { slug: "leipzig", name: "Leipzig", region: "Sachsen", plzRange: "04" },
  { slug: "dortmund", name: "Dortmund", region: "Nordrhein-Westfalen", plzRange: "44" },
  { slug: "nuernberg", name: "Nürnberg", region: "Bayern", plzRange: "90" },
  { slug: "hannover", name: "Hannover", region: "Niedersachsen", plzRange: "30" },
  { slug: "bremen", name: "Bremen", region: "Bremen", plzRange: "28" },
  { slug: "dresden", name: "Dresden", region: "Sachsen", plzRange: "01" },
  { slug: "essen", name: "Essen", region: "Nordrhein-Westfalen", plzRange: "45" },
  { slug: "augsburg", name: "Augsburg", region: "Bayern", plzRange: "86" },
]

export function getCategoryBySlug(slug: string): SEOCategory | undefined {
  return SEO_CATEGORIES.find((c) => c.slug === slug)
}

export function getCityBySlug(slug: string): SEOCity | undefined {
  return SEO_CITIES.find((c) => c.slug === slug)
}

// Generate all possible category+city combinations for sitemap
export function getAllSEORoutes(): string[] {
  const routes: string[] = []

  // Category pages: /de/handwerker/elektriker
  SEO_CATEGORIES.forEach((cat) => {
    routes.push(`/de/handwerker/${cat.slug}`)
  })

  // City pages: /de/handwerker/stadt/muenchen
  SEO_CITIES.forEach((city) => {
    routes.push(`/de/handwerker/stadt/${city.slug}`)
  })

  // Combined: /de/handwerker/elektriker-muenchen
  SEO_CATEGORIES.forEach((cat) => {
    SEO_CITIES.forEach((city) => {
      routes.push(`/de/handwerker/${cat.slug}-${city.slug}`)
    })
  })

  return routes
}
