import Link from "next/link"
import type { BlogPost } from "@/lib/blog/types"
import { BLOG_CATEGORY_LABELS, BLOG_CATEGORY_ICONS } from "@/lib/blog/types"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"

interface BlogCardProps {
  post: BlogPost
  lang: string
}

export function BlogCard({ post, lang }: BlogCardProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Link
      href={`/${lang}/ratgeber/${post.slug}`}
      className="group flex flex-col p-5 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className="text-xs">
          {BLOG_CATEGORY_ICONS[post.category]} {BLOG_CATEGORY_LABELS[post.category]}
        </Badge>
      </div>

      <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
        {post.title}
      </h2>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
        {post.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{date}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} Min.
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}
