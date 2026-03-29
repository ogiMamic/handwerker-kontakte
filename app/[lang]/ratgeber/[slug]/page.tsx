import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts"

interface Props {
  params: { lang: Locale; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: `${post.title} | Handwerker-Kontakte Ratgeber`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      tags: post.tags,
    },
  }
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function RatgeberPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const dictionary = await getDictionary(params.lang)

  return (
    <>
      <SiteHeader dictionary={dictionary.navigation} />
      <main className="container py-3 md:py-8 px-4 max-w-3xl mx-auto">
        <BlogPostContent post={post} lang={params.lang} />
      </main>
      <SiteFooter dictionary={dictionary.footer} />
    </>
  )
}
