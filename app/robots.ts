import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://handwerker-kontakte.de"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sign-in", "/sign-up", "/profil", "/subscription", "/dashboard"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
