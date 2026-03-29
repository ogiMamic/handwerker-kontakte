import Link from "next/link"
import type { BlogPost } from "@/lib/blog/types"
import { BLOG_CATEGORY_LABELS, BLOG_CATEGORY_ICONS } from "@/lib/blog/types"
import { getRelatedPosts } from "@/lib/blog/posts"
import { getCategoryBySlug } from "@/lib/seo-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlogCard } from "./blog-card"
import { Clock, ArrowLeft, ArrowRight, Search } from "lucide-react"

interface BlogPostContentProps {
  post: BlogPost
  lang: string
}

export function BlogPostContent({ post, lang }: BlogPostContentProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const relatedPosts = getRelatedPosts(post, 3)
  const relatedCat = post.relatedCategory
    ? getCategoryBySlug(post.relatedCategory)
    : undefined

  // Article structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Handwerker-Kontakte",
      url: "https://handwerker-kontakte.de",
    },
    publisher: {
      "@type": "Organization",
      name: "Handwerker-Kontakte",
      url: "https://handwerker-kontakte.de",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://handwerker-kontakte.de/${lang}/ratgeber/${post.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumbs */}
      <nav className="text-sm text-muted-foreground mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href={`/${lang}`} className="hover:text-primary">
              Startseite
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/${lang}/ratgeber`} className="hover:text-primary">
              Ratgeber
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-foreground truncate max-w-[200px]">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Article header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">
            {BLOG_CATEGORY_ICONS[post.category]}{" "}
            {BLOG_CATEGORY_LABELS[post.category]}
          </Badge>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-base md:text-lg text-muted-foreground mb-4">
          {post.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{date}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime} Min. Lesezeit
          </span>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="mb-8 p-4 bg-muted/50 rounded-lg">
        <p className="font-semibold text-sm mb-2">Inhalt</p>
        <ol className="space-y-1">
          {post.sections.map((section, i) => (
            <li key={i}>
              <a
                href={`#section-${i}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {i + 1}. {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Article content */}
      <article className="prose prose-gray dark:prose-invert max-w-none mb-12">
        {post.sections.map((section, i) => (
          <section key={i} id={`section-${i}`} className="mb-8">
            <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: section.content }}
              className="text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:text-base [&_p]:mb-3"
            />
          </section>
        ))}
      </article>

      {/* CTA: Related category */}
      {relatedCat && (
        <div className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-bold text-lg mb-2">
            {relatedCat.icon} {relatedCat.labelPlural} in Ihrer Nähe finden
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Vergleichen Sie kostenlos verifizierte {relatedCat.labelPlural} —
            Bewertungen lesen, Preise vergleichen, direkt kontaktieren.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link
                href={`/${lang}/handwerker/kategorie/${relatedCat.slug}`}
              >
                <Search className="mr-2 h-4 w-4" />
                {relatedCat.labelPlural} vergleichen
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${lang}/kosten/${relatedCat.slug}`}>
                {relatedCat.label} Kosten ansehen
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* General CTA when no related category */}
      {!relatedCat && (
        <div className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-bold text-lg mb-2">
            Handwerker in Ihrer Nähe finden
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Vergleichen Sie kostenlos verifizierte Handwerker — Bewertungen
            lesen, Preise vergleichen, direkt kontaktieren.
          </p>
          <Button asChild>
            <Link href={`/${lang}/handwerker`}>
              <Search className="mr-2 h-4 w-4" />
              Handwerker suchen
            </Link>
          </Button>
        </div>
      )}

      {/* Tags */}
      <div className="mb-10">
        <p className="text-sm font-medium mb-2">Themen</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Weitere Artikel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((p) => (
              <BlogCard key={p.slug} post={p} lang={lang} />
            ))}
          </div>
        </div>
      )}

      {/* Back to overview */}
      <div className="mt-8 pt-6 border-t">
        <Link
          href={`/${lang}/ratgeber`}
          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Zurück zur Übersicht
        </Link>
      </div>
    </>
  )
}
