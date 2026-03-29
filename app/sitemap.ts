import type { MetadataRoute } from "next"
import { SEO_CATEGORIES, SEO_CITIES } from "@/lib/seo-data"
import { getAllPosts } from "@/lib/blog/posts"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://handwerker-kontakte.de"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    "",
    "/de",
    "/de/handwerker",
    "/de/preise",
    "/de/so-funktionierts",
    "/de/impressum",
    "/de/agb",
    "/de/datenschutz",
    "/de/handwerker/registrieren",
    "/de/kosten",
    "/de/ratgeber",
  ]

  staticPages.forEach((page) => {
    routes.push({
      url: `${BASE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: page === "/de" || page === "" ? 1.0 : 0.8,
    })
  })

  // Category pages
  SEO_CATEGORIES.forEach((cat) => {
    routes.push({
      url: `${BASE_URL}/de/handwerker/kategorie/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    })
  })

  // City pages
  SEO_CITIES.forEach((city) => {
    routes.push({
      url: `${BASE_URL}/de/handwerker/stadt/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    })
  })

  // Combined category + city pages
  SEO_CATEGORIES.forEach((cat) => {
    SEO_CITIES.forEach((city) => {
      routes.push({
        url: `${BASE_URL}/de/handwerker/kategorie/${cat.slug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.85,
      })
    })
  })

  // Kosten (cost guide) pages per category
  SEO_CATEGORIES.forEach((cat) => {
    routes.push({
      url: `${BASE_URL}/de/kosten/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  })

  // Kosten pages per category + city
  SEO_CATEGORIES.forEach((cat) => {
    SEO_CITIES.forEach((city) => {
      routes.push({
        url: `${BASE_URL}/de/kosten/${cat.slug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      })
    })
  })

  // Ratgeber (blog) posts
  getAllPosts().forEach((post) => {
    routes.push({
      url: `${BASE_URL}/de/ratgeber/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.85,
    })
  })

  return routes
}
