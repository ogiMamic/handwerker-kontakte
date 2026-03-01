// @ts-nocheck
import { authMiddleware } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { i18n } from "@/lib/i18n-config"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/api/health",
    "/api/craftsmen",
    "/sitemap.xml",
    "/robots.txt",
    "/:lang",
    "/:lang/preise",
    "/:lang/so-funktionierts",
    "/:lang/handwerker",
    "/:lang/handwerker/(.*)",
    "/:lang/impressum",
    "/:lang/agb",
    "/:lang/datenschutz",
    "/:lang/cookies",
  ],
  ignoredRoutes: [
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.webmanifest",
    "/icon",
    "/icon-192.png",
    "/icon-512.png",
    "/apple-icon",
    "/favicon.ico",
    "/opengraph-image",
    "/api/health",
  ],
  afterAuth(auth, req) {
    try {
      const pathname = req.nextUrl.pathname

      const pathnameHasLocale = i18n.locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
      )

      if (!pathnameHasLocale && !pathname.startsWith("/api/") && !pathname.includes(".")) {
        const locale = i18n.defaultLocale
        const url = new URL(`/${locale}${pathname}`, req.url)
        url.search = req.nextUrl.search
        return NextResponse.redirect(url)
      }

      const protectedRoutes = [
        "/dashboard",
        "/profil",
        "/subscription",
        "/handwerker/profil",
        "/handwerker/registrieren",
      ]

      const isProtectedRoute = protectedRoutes.some((route) => pathname.includes(route))

      if (!auth.userId && isProtectedRoute) {
        const locale = pathname.split("/")[1] || i18n.defaultLocale
        return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url))
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Middleware error:", error)
      return NextResponse.next()
    }
  },
})

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}