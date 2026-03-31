// Categories and cities for SEO pages
// 18 categories × 40 cities = 720+ programmatic pages
// Plus Kosten pages = 720+ more pages
// Total: 1500+ indexed pages

export interface SEOCategory {
  slug: string
  skill: string
  label: string
  labelPlural: string
  description: string
  icon: string
  avgCostPerHour: string
  costRange: string
  typicalJobs: string[]
}

export interface SEOCity {
  slug: string
  name: string
  region: string
  plzRange: string
  population?: number
}

export interface FAQItem {
  question: string
  answer: string
}

export interface CostGuideContent {
  title: string
  intro: string
  costTable: { service: string; priceRange: string; unit: string }[]
  tips: string[]
  factors: string[]
}

// ─── CATEGORIES ───────────────────────────────────────────────

export const SEO_CATEGORIES: SEOCategory[] = [
  {
    slug: "elektriker",
    skill: "Elektrik",
    label: "Elektriker",
    labelPlural: "Elektriker",
    description: "Elektroinstallation, Reparaturen, Smart Home, Beleuchtung",
    icon: "⚡",
    avgCostPerHour: "50–85",
    costRange: "50–85 € pro Stunde",
    typicalJobs: ["Steckdosen installieren", "Sicherungskasten erneuern", "Smart Home Einrichtung", "Beleuchtung planen", "E-Auto Wallbox Installation"],
  },
  {
    slug: "klempner",
    skill: "Sanitär",
    label: "Klempner",
    labelPlural: "Klempner & Sanitär",
    description: "Sanitärinstallation, Rohrreinigung, Badsanierung, Heizung",
    icon: "🔧",
    avgCostPerHour: "45–80",
    costRange: "45–80 € pro Stunde",
    typicalJobs: ["Rohrverstopfung beseitigen", "Badsanierung", "Wasseranschluss verlegen", "Toilette montieren", "Heizungsinstallation"],
  },
  {
    slug: "maler",
    skill: "Malerarbeiten",
    label: "Maler",
    labelPlural: "Maler & Lackierer",
    description: "Innenausbau, Fassadenanstrich, Tapezieren, Lackierung",
    icon: "🎨",
    avgCostPerHour: "35–60",
    costRange: "35–60 € pro Stunde",
    typicalJobs: ["Wohnung streichen", "Fassadenanstrich", "Tapezieren", "Lackierung", "Schimmelbeseitigung"],
  },
  {
    slug: "fliesenleger",
    skill: "Fliesenlegen",
    label: "Fliesenleger",
    labelPlural: "Fliesenleger",
    description: "Bodenfliesen, Wandfliesen, Naturstein, Mosaik",
    icon: "🔲",
    avgCostPerHour: "40–70",
    costRange: "40–70 € pro Stunde",
    typicalJobs: ["Badfliesen verlegen", "Küchenspiegel fliesen", "Terrassenplatten", "Naturstein verlegen", "Alte Fliesen entfernen"],
  },
  {
    slug: "tischler",
    skill: "Tischlerei",
    label: "Tischler",
    labelPlural: "Tischler & Schreiner",
    description: "Möbelbau, Einbauschränke, Türen, Fenster, Holzarbeiten",
    icon: "🪚",
    avgCostPerHour: "45–75",
    costRange: "45–75 € pro Stunde",
    typicalJobs: ["Einbauschrank nach Maß", "Türen einbauen", "Fenster austauschen", "Treppenbau", "Parkett verlegen"],
  },
  {
    slug: "dachdecker",
    skill: "Dachdeckerarbeiten",
    label: "Dachdecker",
    labelPlural: "Dachdecker",
    description: "Dachsanierung, Dacheindeckung, Abdichtung, Dachfenster",
    icon: "🏠",
    avgCostPerHour: "50–90",
    costRange: "50–90 € pro Stunde",
    typicalJobs: ["Dachsanierung", "Dachfenster einbauen", "Dachrinne erneuern", "Flachdachabdichtung", "Dachbegrünung"],
  },
  {
    slug: "renovierung",
    skill: "Renovierung",
    label: "Renovierung",
    labelPlural: "Renovierung & Sanierung",
    description: "Komplettsanierung, Altbausanierung, Umbau, Modernisierung",
    icon: "🏗️",
    avgCostPerHour: "40–80",
    costRange: "40–80 € pro Stunde",
    typicalJobs: ["Komplettsanierung", "Altbausanierung", "Badezimmer renovieren", "Küche umbauen", "Keller ausbauen"],
  },
  {
    slug: "gaertner",
    skill: "Gartenarbeit",
    label: "Gärtner",
    labelPlural: "Gärtner & Landschaftsbau",
    description: "Gartenpflege, Landschaftsbau, Baumschnitt, Rasenpflege",
    icon: "🌿",
    avgCostPerHour: "30–55",
    costRange: "30–55 € pro Stunde",
    typicalJobs: ["Gartenpflege", "Hecke schneiden", "Rasen anlegen", "Baumfällung", "Terrassenbau"],
  },
  {
    slug: "umzug",
    skill: "Umzug",
    label: "Umzugshelfer",
    labelPlural: "Umzugsunternehmen",
    description: "Umzüge, Möbeltransport, Ein- und Auspacken, Montage",
    icon: "📦",
    avgCostPerHour: "30–50",
    costRange: "30–50 € pro Stunde",
    typicalJobs: ["Wohnungsumzug", "Büroumzug", "Möbelmontage", "Klaviertransport", "Entrümpelung"],
  },
  {
    slug: "installateur",
    skill: "Installation",
    label: "Installateur",
    labelPlural: "Installateure",
    description: "Heizungsinstallation, Klimaanlage, Wasserinstallation",
    icon: "🔩",
    avgCostPerHour: "50–85",
    costRange: "50–85 € pro Stunde",
    typicalJobs: ["Heizung installieren", "Klimaanlage einbauen", "Wärmepumpe Installation", "Fußbodenheizung", "Solar-Warmwasser"],
  },
  {
    slug: "schluesseldienst",
    skill: "Schlüsseldienst",
    label: "Schlüsseldienst",
    labelPlural: "Schlüsseldienste",
    description: "Türöffnung, Schloss wechseln, Sicherheitstechnik, Schließanlagen",
    icon: "🔑",
    avgCostPerHour: "60–150",
    costRange: "60–150 € pro Einsatz",
    typicalJobs: ["Tür öffnen", "Schloss austauschen", "Schließanlage einbauen", "Sicherheitsschloss", "Briefkastenschloss"],
  },
  {
    slug: "trockenbau",
    skill: "Trockenbau",
    label: "Trockenbauer",
    labelPlural: "Trockenbauer",
    description: "Trockenbauwände, Deckenverkleidung, Dachausbau, Schallschutz",
    icon: "🧱",
    avgCostPerHour: "35–60",
    costRange: "35–60 € pro Stunde",
    typicalJobs: ["Trennwand einziehen", "Decke abhängen", "Dachgeschoss ausbauen", "Schallschutzwand", "Brandschutzverkleidung"],
  },
  {
    slug: "bodenleger",
    skill: "Bodenbelag",
    label: "Bodenleger",
    labelPlural: "Bodenleger",
    description: "Parkett, Laminat, Vinyl, Teppich, Estrich",
    icon: "🪵",
    avgCostPerHour: "35–65",
    costRange: "35–65 € pro Stunde",
    typicalJobs: ["Parkett verlegen", "Laminat verlegen", "Vinylboden", "Teppichboden", "Estrich gießen"],
  },
  {
    slug: "maurer",
    skill: "Maurerarbeiten",
    label: "Maurer",
    labelPlural: "Maurer",
    description: "Mauerwerksbau, Betonarbeiten, Fundamente, Abbrucharbeiten",
    icon: "🧱",
    avgCostPerHour: "40–70",
    costRange: "40–70 € pro Stunde",
    typicalJobs: ["Mauer errichten", "Fundament gießen", "Wand durchbrechen", "Garage bauen", "Pflasterarbeiten"],
  },
  {
    slug: "reinigung",
    skill: "Reinigung",
    label: "Reinigungskraft",
    labelPlural: "Reinigungsdienste",
    description: "Gebäudereinigung, Unterhaltsreinigung, Fensterreinigung, Endreinigung",
    icon: "🧹",
    avgCostPerHour: "25–45",
    costRange: "25–45 € pro Stunde",
    typicalJobs: ["Fensterreinigung", "Treppenhausreinigung", "Grundreinigung", "Büroreinigung", "Endreinigung bei Umzug"],
  },
  {
    slug: "heizung",
    skill: "Heizungsbau",
    label: "Heizungsinstallateur",
    labelPlural: "Heizungsinstallateure",
    description: "Heizungsanlage, Wärmepumpe, Gasheizung, Fußbodenheizung, Wartung",
    icon: "🔥",
    avgCostPerHour: "55–90",
    costRange: "55–90 € pro Stunde",
    typicalJobs: ["Heizung austauschen", "Wärmepumpe einbauen", "Heizkörper montieren", "Heizungswartung", "Thermostat installieren"],
  },
  {
    slug: "zimmermann",
    skill: "Zimmerei",
    label: "Zimmermann",
    labelPlural: "Zimmerleute",
    description: "Dachstuhl, Holzbau, Carport, Balkon, Holzrahmenbau",
    icon: "🏡",
    avgCostPerHour: "50–85",
    costRange: "50–85 € pro Stunde",
    typicalJobs: ["Dachstuhl errichten", "Carport bauen", "Holzbalkon", "Pergola", "Holzrahmenbau"],
  },
  {
    slug: "photovoltaik",
    skill: "Photovoltaik",
    label: "Solartechniker",
    labelPlural: "Solartechniker & Photovoltaik",
    description: "Solaranlage, Photovoltaik-Installation, Speicher, Wallbox",
    icon: "☀️",
    avgCostPerHour: "60–100",
    costRange: "60–100 € pro Stunde",
    typicalJobs: ["PV-Anlage installieren", "Stromspeicher einbauen", "Wallbox + Solar", "Anlage warten", "Einspeisevergütung beraten"],
  },
]

// ─── CITIES ───────────────────────────────────────────────────

export const SEO_CITIES: SEOCity[] = [
  { slug: "berlin", name: "Berlin", region: "Berlin", plzRange: "10", population: 3748000 },
  { slug: "hamburg", name: "Hamburg", region: "Hamburg", plzRange: "20", population: 1899000 },
  { slug: "muenchen", name: "München", region: "Bayern", plzRange: "80", population: 1488000 },
  { slug: "koeln", name: "Köln", region: "Nordrhein-Westfalen", plzRange: "50", population: 1084000 },
  { slug: "frankfurt", name: "Frankfurt am Main", region: "Hessen", plzRange: "60", population: 764000 },
  { slug: "stuttgart", name: "Stuttgart", region: "Baden-Württemberg", plzRange: "70", population: 635000 },
  { slug: "duesseldorf", name: "Düsseldorf", region: "Nordrhein-Westfalen", plzRange: "40", population: 621000 },
  { slug: "leipzig", name: "Leipzig", region: "Sachsen", plzRange: "04", population: 601000 },
  { slug: "dortmund", name: "Dortmund", region: "Nordrhein-Westfalen", plzRange: "44", population: 588000 },
  { slug: "essen", name: "Essen", region: "Nordrhein-Westfalen", plzRange: "45", population: 582000 },
  { slug: "bremen", name: "Bremen", region: "Bremen", plzRange: "28", population: 567000 },
  { slug: "dresden", name: "Dresden", region: "Sachsen", plzRange: "01", population: 556000 },
  { slug: "hannover", name: "Hannover", region: "Niedersachsen", plzRange: "30", population: 536000 },
  { slug: "nuernberg", name: "Nürnberg", region: "Bayern", plzRange: "90", population: 518000 },
  { slug: "duisburg", name: "Duisburg", region: "Nordrhein-Westfalen", plzRange: "47", population: 498000 },
  { slug: "bochum", name: "Bochum", region: "Nordrhein-Westfalen", plzRange: "44", population: 365000 },
  { slug: "wuppertal", name: "Wuppertal", region: "Nordrhein-Westfalen", plzRange: "42", population: 355000 },
  { slug: "bielefeld", name: "Bielefeld", region: "Nordrhein-Westfalen", plzRange: "33", population: 334000 },
  { slug: "bonn", name: "Bonn", region: "Nordrhein-Westfalen", plzRange: "53", population: 330000 },
  { slug: "muenster", name: "Münster", region: "Nordrhein-Westfalen", plzRange: "48", population: 317000 },
  { slug: "mannheim", name: "Mannheim", region: "Baden-Württemberg", plzRange: "68", population: 310000 },
  { slug: "karlsruhe", name: "Karlsruhe", region: "Baden-Württemberg", plzRange: "76", population: 308000 },
  { slug: "augsburg", name: "Augsburg", region: "Bayern", plzRange: "86", population: 296000 },
  { slug: "wiesbaden", name: "Wiesbaden", region: "Hessen", plzRange: "65", population: 278000 },
  { slug: "aachen", name: "Aachen", region: "Nordrhein-Westfalen", plzRange: "52", population: 249000 },
  { slug: "braunschweig", name: "Braunschweig", region: "Niedersachsen", plzRange: "38", population: 249000 },
  { slug: "kiel", name: "Kiel", region: "Schleswig-Holstein", plzRange: "24", population: 247000 },
  { slug: "chemnitz", name: "Chemnitz", region: "Sachsen", plzRange: "09", population: 245000 },
  { slug: "halle", name: "Halle (Saale)", region: "Sachsen-Anhalt", plzRange: "06", population: 239000 },
  { slug: "magdeburg", name: "Magdeburg", region: "Sachsen-Anhalt", plzRange: "39", population: 237000 },
  { slug: "freiburg", name: "Freiburg im Breisgau", region: "Baden-Württemberg", plzRange: "79", population: 230000 },
  { slug: "mainz", name: "Mainz", region: "Rheinland-Pfalz", plzRange: "55", population: 218000 },
  { slug: "erfurt", name: "Erfurt", region: "Thüringen", plzRange: "99", population: 214000 },
  { slug: "rostock", name: "Rostock", region: "Mecklenburg-Vorpommern", plzRange: "18", population: 209000 },
  { slug: "kassel", name: "Kassel", region: "Hessen", plzRange: "34", population: 202000 },
  { slug: "potsdam", name: "Potsdam", region: "Brandenburg", plzRange: "14", population: 183000 },
  { slug: "saarbruecken", name: "Saarbrücken", region: "Saarland", plzRange: "66", population: 180000 },
  { slug: "oldenburg", name: "Oldenburg", region: "Niedersachsen", plzRange: "26", population: 170000 },
  { slug: "heidelberg", name: "Heidelberg", region: "Baden-Württemberg", plzRange: "69", population: 159000 },
  { slug: "darmstadt", name: "Darmstadt", region: "Hessen", plzRange: "64", population: 159000 },
  { slug: "regensburg", name: "Regensburg", region: "Bayern", plzRange: "93", population: 153000 },
  { slug: "wuerzburg", name: "Würzburg", region: "Bayern", plzRange: "97", population: 128000 },
  { slug: "heilbronn", name: "Heilbronn", region: "Baden-Württemberg", plzRange: "74", population: 126000 },
  { slug: "ulm", name: "Ulm", region: "Baden-Württemberg", plzRange: "89", population: 126000 },
]

// ─── HELPERS ──────────────────────────────────────────────────

export function getCategoryBySlug(slug: string): SEOCategory | undefined {
  return SEO_CATEGORIES.find((c) => c.slug === slug)
}

export function getCityBySlug(slug: string): SEOCity | undefined {
  return SEO_CITIES.find((c) => c.slug === slug)
}

// ─── FAQ DATA ─────────────────────────────────────────────────

export function getCategoryFAQs(category: SEOCategory, city?: SEOCity): FAQItem[] {
  const loc = city ? ` in ${city.name}` : ""

  const specificFAQs: Record<string, FAQItem[]> = {
    elektriker: [
      { question: `Was kostet ein Elektriker${loc} pro Stunde?`, answer: `Ein Elektriker${loc} kostet durchschnittlich ${category.costRange}. Notdienste am Wochenende können bis zu 50% teurer sein. Holen Sie vorab einen Kostenvoranschlag ein.` },
      { question: `Brauche ich für jede Elektroarbeit einen Fachmann?`, answer: `Ja, nach VDE-Vorschriften dürfen nur zugelassene Elektrofachbetriebe an der Elektroinstallation arbeiten. Eigenständige Arbeiten an der Elektrik sind nicht erlaubt und können lebensgefährlich sein.` },
      { question: `Wie finde ich einen guten Elektriker${loc}?`, answer: `Auf Handwerker-Kontakte können Sie verifizierte Elektriker${loc} vergleichen. Achten Sie auf Bewertungen, Qualifikationen und ob der Betrieb im Installateurverzeichnis eingetragen ist.` },
      { question: `Was kostet eine E-Auto Wallbox Installation?`, answer: `Eine Wallbox inklusive Installation kostet ca. 1.200–2.500 €. Die KfW förderte Wallboxen mit bis zu 900 € Zuschuss. Prüfen Sie aktuelle Förderprogramme in Ihrem Bundesland.` },
    ],
    klempner: [
      { question: `Was kostet ein Klempner${loc} pro Stunde?`, answer: `Klempner${loc} berechnen durchschnittlich ${category.costRange}. Notdienste außerhalb der Geschäftszeiten sind deutlich teurer.` },
      { question: `Was tun bei Wasserrohrbruch?`, answer: `Sofort den Hauptwasserhahn zudrehen und einen Notdienst-Klempner rufen. Auf Handwerker-Kontakte finden Sie Klempner mit schneller Reaktionszeit.` },
      { question: `Was kostet eine Badsanierung${loc}?`, answer: `Eine komplette Badsanierung kostet durchschnittlich 8.000–15.000 € je nach Größe und Ausstattung. Einzelne Arbeiten wie Toilette tauschen kosten ab ca. 300–500 €.` },
      { question: `Wie oft sollte die Heizung gewartet werden?`, answer: `Eine jährliche Heizungswartung wird empfohlen, idealerweise vor der Heizperiode. Die Wartung kostet ca. 100–200 € und kann Energiekosten um bis zu 15% senken.` },
    ],
    maler: [
      { question: `Was kostet ein Maler${loc} pro Stunde?`, answer: `Maler${loc} berechnen durchschnittlich ${category.costRange}. Pro Quadratmeter Wandfläche liegen die Kosten bei ca. 8–15 € inklusive Material.` },
      { question: `Was kostet es, eine Wohnung streichen zu lassen?`, answer: `Eine 3-Zimmer-Wohnung (ca. 75 qm) streichen kostet ca. 1.500–3.000 € inkl. Material. Tapezieren ist etwas teurer mit ca. 15–25 € pro qm.` },
      { question: `Muss ich als Mieter bei Auszug streichen?`, answer: `Nur wenn es im Mietvertrag wirksam vereinbart ist. Starre Fristenklauseln sind unwirksam. Im Zweifel Mietvertrag prüfen lassen.` },
      { question: `Wie lange dauert es, eine Wohnung zu streichen?`, answer: `Ein professioneller Maler schafft eine 3-Zimmer-Wohnung in 2–3 Tagen. Bei Tapezierarbeiten oder Spezialanstrichen kann es 4–5 Tage dauern.` },
    ],
    dachdecker: [
      { question: `Was kostet eine Dachsanierung${loc}?`, answer: `Eine Dachsanierung kostet ca. 100–250 € pro Quadratmeter inkl. Dämmung. Bei einem Einfamilienhaus (100 qm Dachfläche) sind das 10.000–25.000 €.` },
      { question: `Gibt es Förderungen für Dachsanierung?`, answer: `Ja, die KfW und BAFA fördern energetische Dachsanierungen mit Zuschüssen von 15–20%. Voraussetzung ist die Einhaltung bestimmter Dämmwerte.` },
      { question: `Wie oft muss ein Dach saniert werden?`, answer: `Ziegeldächer halten 50–80 Jahre, Bitumendächer 20–30 Jahre. Regelmäßige Inspektion alle 5 Jahre wird empfohlen.` },
      { question: `Was kostet ein Dachfenster einbauen?`, answer: `Ein Dachfenster inkl. Einbau kostet ca. 1.500–3.500 €. Der Preis hängt von Größe, Typ (Schwing- oder Klappfenster) und Zubehör ab.` },
    ],
  }

  // Generic FAQ for categories without specific ones
  return specificFAQs[category.slug] || [
    { question: `Was kostet ein ${category.label}${loc} pro Stunde?`, answer: `Ein ${category.label}${loc} kostet durchschnittlich ${category.costRange}. Holen Sie auf Handwerker-Kontakte kostenlos Angebote ein.` },
    { question: `Wie finde ich einen guten ${category.label}${loc}?`, answer: `Auf Handwerker-Kontakte finden Sie verifizierte ${category.labelPlural}${loc}. Vergleichen Sie Bewertungen, Qualifikationen und Preise.` },
    { question: `Wie schnell ist ein ${category.label}${loc} verfügbar?`, answer: `Die Verfügbarkeit variiert. Über Handwerker-Kontakte sehen Sie sofort, welche ${category.labelPlural}${loc} zeitnah verfügbar sind.` },
    { question: `Brauche ich einen Kostenvoranschlag?`, answer: `Ja, wir empfehlen immer einen schriftlichen Kostenvoranschlag. Seriöse ${category.labelPlural} erstellen diesen kostenlos oder für eine geringe Pauschale.` },
  ]
}

// ─── COST GUIDE DATA ──────────────────────────────────────────

export function getCostGuideContent(category: SEOCategory, city?: SEOCity): CostGuideContent {
  const loc = city ? ` in ${city.name}` : ""

  const costTables: Record<string, { service: string; priceRange: string; unit: string }[]> = {
    elektriker: [
      { service: "Steckdose installieren", priceRange: "80–150 €", unit: "pro Stück" },
      { service: "Lichtschalter austauschen", priceRange: "50–100 €", unit: "pro Stück" },
      { service: "Sicherungskasten erneuern", priceRange: "800–2.500 €", unit: "pauschal" },
      { service: "Smart Home Einrichtung", priceRange: "500–3.000 €", unit: "je nach Umfang" },
      { service: "E-Auto Wallbox", priceRange: "1.200–2.500 €", unit: "inkl. Installation" },
      { service: "Komplett-Neuinstallation", priceRange: "8.000–15.000 €", unit: "Wohnung" },
    ],
    klempner: [
      { service: "Rohrverstopfung beseitigen", priceRange: "80–250 €", unit: "pro Einsatz" },
      { service: "Toilette austauschen", priceRange: "300–600 €", unit: "inkl. Einbau" },
      { service: "Wasserhahn montieren", priceRange: "80–200 €", unit: "inkl. Material" },
      { service: "Badsanierung komplett", priceRange: "8.000–20.000 €", unit: "je nach Größe" },
      { service: "Heizungsanlage tauschen", priceRange: "6.000–15.000 €", unit: "pauschal" },
      { service: "Rohrbruch reparieren", priceRange: "200–800 €", unit: "pro Einsatz" },
    ],
    maler: [
      { service: "Wand streichen", priceRange: "8–15 €", unit: "pro qm" },
      { service: "Tapezieren", priceRange: "15–25 €", unit: "pro qm" },
      { service: "Fassadenanstrich", priceRange: "25–50 €", unit: "pro qm" },
      { service: "Lackierung (Türen/Fenster)", priceRange: "80–200 €", unit: "pro Stück" },
      { service: "Schimmelbeseitigung", priceRange: "500–2.000 €", unit: "je nach Umfang" },
      { service: "Spachteln & Glätten", priceRange: "10–20 €", unit: "pro qm" },
    ],
    dachdecker: [
      { service: "Dacheindeckung (Ziegel)", priceRange: "80–140 €", unit: "pro qm" },
      { service: "Dachdämmung", priceRange: "40–100 €", unit: "pro qm" },
      { service: "Dachfenster einbauen", priceRange: "1.500–3.500 €", unit: "pro Stück" },
      { service: "Dachrinne erneuern", priceRange: "30–50 €", unit: "pro lfm" },
      { service: "Flachdachabdichtung", priceRange: "50–120 €", unit: "pro qm" },
      { service: "Komplettsanierung", priceRange: "15.000–35.000 €", unit: "Einfamilienhaus" },
    ],
    heizung: [
      { service: "Gasheizung austauschen", priceRange: "6.000–12.000 €", unit: "pauschal" },
      { service: "Wärmepumpe einbauen", priceRange: "15.000–30.000 €", unit: "pauschal" },
      { service: "Fußbodenheizung nachrüsten", priceRange: "50–100 €", unit: "pro qm" },
      { service: "Heizkörper montieren", priceRange: "200–500 €", unit: "pro Stück" },
      { service: "Heizungswartung", priceRange: "100–200 €", unit: "pro Jahr" },
      { service: "Thermostat installieren", priceRange: "50–150 €", unit: "pro Stück" },
    ],
    photovoltaik: [
      { service: "PV-Anlage 5 kWp", priceRange: "8.000–12.000 €", unit: "pauschal" },
      { service: "PV-Anlage 10 kWp", priceRange: "14.000–20.000 €", unit: "pauschal" },
      { service: "Stromspeicher 5 kWh", priceRange: "4.000–7.000 €", unit: "pauschal" },
      { service: "Stromspeicher 10 kWh", priceRange: "7.000–12.000 €", unit: "pauschal" },
      { service: "Wallbox + Solar", priceRange: "1.500–3.000 €", unit: "pauschal" },
      { service: "Anlagenwartung", priceRange: "150–300 €", unit: "pro Jahr" },
    ],
  }

  const defaultCostTable = category.typicalJobs.map((job) => ({
    service: job,
    priceRange: "auf Anfrage",
    unit: "je nach Umfang",
  }))

  return {
    title: `${category.label} Kosten${loc} - Preisübersicht ${new Date().getFullYear()}`,
    intro: `Was kostet ein ${category.label}${loc}? Der durchschnittliche Stundensatz liegt bei ${category.costRange}. Hier finden Sie eine aktuelle Preisübersicht für typische Arbeiten.`,
    costTable: costTables[category.slug] || defaultCostTable,
    tips: [
      "Holen Sie mindestens 3 Angebote ein, bevor Sie sich entscheiden.",
      "Achten Sie auf einen schriftlichen Kostenvoranschlag mit allen Leistungen.",
      "Fragen Sie nach Referenzen und Qualifikationen.",
      `Vergleichen Sie ${category.labelPlural}${loc} kostenlos auf Handwerker-Kontakte.`,
      "Klären Sie vorab, ob Anfahrtskosten berechnet werden.",
    ],
    factors: [
      "Art und Umfang der Arbeit",
      "Region und Anfahrtsweg",
      "Materialkosten",
      "Dringlichkeit (Notdienst-Zuschlag)",
      "Qualifikation und Erfahrung des Betriebs",
    ],
  }
}

// ─── SITEMAP ROUTES ───────────────────────────────────────────

export function getAllSEORoutes(): string[] {
  const routes: string[] = []

  SEO_CATEGORIES.forEach((cat) => {
    routes.push(`/de/handwerker/kategorie/${cat.slug}`)
  })

  SEO_CITIES.forEach((city) => {
    routes.push(`/de/handwerker/stadt/${city.slug}`)
  })

  SEO_CATEGORIES.forEach((cat) => {
    SEO_CITIES.forEach((city) => {
      routes.push(`/de/handwerker/kategorie/${cat.slug}/${city.slug}`)
    })
  })

  // Kosten pages
  SEO_CATEGORIES.forEach((cat) => {
    routes.push(`/de/kosten/${cat.slug}`)
  })

  SEO_CATEGORIES.forEach((cat) => {
    SEO_CITIES.forEach((city) => {
      routes.push(`/de/kosten/${cat.slug}/${city.slug}`)
    })
  })

  return routes
}
