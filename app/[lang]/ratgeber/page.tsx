import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { BlogCard } from "@/components/blog/blog-card"
import { getAllPosts } from "@/lib/blog/posts"
import { BLOG_CATEGORY_LABELS, BLOG_CATEGORY_ICONS, type BlogCategory } from "@/lib/blog/types"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Props {
  params: { lang: Locale }
  searchParams: { kategorie?: string }
}

export const metadata: Metadata = {
  title: "Ratgeber — Tipps, Kosten & Checklisten für Ihr Projekt | Handwerker-Kontakte",
  description:
    "Expertenwissen rund ums Renovieren, Sanieren und Bauen. Kostenübersichten, Anleitungen, Vergleiche und Checklisten für Ihr nächstes Handwerker-Projekt.",
  openGraph: {
    title: "Ratgeber — Tipps & Kosten für Ihr Projekt",
    description: "Expertenwissen rund ums Renovieren, Sanieren und Bauen.",
  },
}

export default async function RatgeberPage({ params, searchParams }: Props) {
  const dictionary = await getDictionary(params.lang)
  const activeCategory = searchParams.kategorie as BlogCategory | undefined

  let posts = getAllPosts()
  if (activeCategory && activeCategory in BLOG_CATEGORY_LABELS) {
    posts = posts.filter((p) => p.category === activeCategory)
  }

  const categories = Object.entries(BLOG_CATEGORY_LABELS) as [BlogCategory, string][]

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />

      <main className="container py-3 md:py-8 px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-4">
          <ol className="flex items-center gap-1">
            <li>
              <Link href={`/${params.lang}`} className="hover:text-primary">
                Startseite
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-foreground">Ratgeber</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            Ratgeber & Tipps
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            Expertenwissen rund ums Renovieren, Sanieren und Bauen.
            Kostenübersichten, Anleitungen und Checklisten für Ihr nächstes
            Projekt.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/${params.lang}/ratgeber`}>
            <Badge
              variant={!activeCategory ? "default" : "outline"}
              className="px-3 py-1.5 cursor-pointer"
            >
              Alle
            </Badge>
          </Link>
          {categories.map(([key, label]) => (
            <Link key={key} href={`/${params.lang}/ratgeber?kategorie=${key}`}>
              <Badge
                variant={activeCategory === key ? "default" : "outline"}
                className="px-3 py-1.5 cursor-pointer"
              >
                {BLOG_CATEGORY_ICONS[key]} {label}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} lang={params.lang} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Noch keine Artikel in dieser Kategorie.
            </p>
          </div>
        )}
      </main>

      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
