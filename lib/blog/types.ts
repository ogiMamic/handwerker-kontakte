// Blog system - MVP with TypeScript data files
// No external deps needed. Migrate to CMS later if needed.

export interface BlogPost {
  slug: string
  title: string
  description: string       // meta description + preview
  category: BlogCategory
  publishedAt: string        // ISO date
  updatedAt?: string
  readingTime: number        // minutes
  image?: string             // optional hero image path
  relatedCategory?: string   // links to SEO category slug
  relatedCity?: string       // links to SEO city slug
  sections: BlogSection[]
  tags: string[]
}

export interface BlogSection {
  heading: string
  content: string  // HTML content (paragraphs, lists)
}

export type BlogCategory =
  | "kosten"        // Was kostet...?
  | "ratgeber"      // How-to guides
  | "vergleich"     // Comparisons
  | "checkliste"    // Checklists
  | "foerderung"    // Subsidies & grants

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  kosten: "Kosten & Preise",
  ratgeber: "Ratgeber & Tipps",
  vergleich: "Vergleich",
  checkliste: "Checkliste",
  foerderung: "Förderung & Zuschüsse",
}

export const BLOG_CATEGORY_ICONS: Record<BlogCategory, string> = {
  kosten: "💰",
  ratgeber: "📖",
  vergleich: "⚖️",
  checkliste: "✅",
  foerderung: "🏦",
}
