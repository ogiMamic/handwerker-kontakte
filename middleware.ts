import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { i18n } from "@/lib/i18n-config"

const staticFiles = [
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon",
  "/apple-icon",
  "/favicon.ico",
  "/house-renovation-craftsmen.png",
  "/bathroom-renovation.png",
  "/modern-kitchen-cabinets.png",
  "/diverse-group.png",
  "/craftsman.png",
]

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/api/health",
    ...staticFiles,
    // Javne stranice za sve jezike
    "/:lang",
    "/:lang/preise",
    "/:lang/so-funktionierts",
    "/:lang/handwerker",
    "/:lang/impressum",
    // API rute koje ne zahtijevaju auth
    "/api/craftsmen",
  ],
  afterAuth(auth, req) {
    try {
      const pathname = req.nextUrl.pathname

      // Statički fajlovi i health check
      if (staticFiles.some((file) => pathname === file) || pathname === "/api/health") {
        return NextResponse.next()
      }

      // i18n routing
      const pathnameHasLocale = i18n.locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
      )

      if (!pathnameHasLocale && !pathname.startsWith("/api/")) {
        const locale = req.nextUrl.locale || i18n.defaultLocale
        const url = new URL(`/${locale}${pathname}`, req.url)
        url.search = req.nextUrl.search
        return NextResponse.redirect(url)
      }

      // Zaštićene rute koje zahtijevaju login
      const protectedRoutes = [
        "/dashboard",
        "/profil",
        "/auftraege",
        "/benachrichtigungen",
        "/notifications",
        "/chat",
        "/client/dashboard",
        "/client/auftrag-erstellen",
        "/client/job-wizard",
        "/craftsman/jobs",
        "/craftsman/profile",
        "/handwerker/auftraege",
        "/handwerker/profil",
        "/handwerker/registrieren",
      ]

      const isProtectedRoute = protectedRoutes.some((route) => pathname.includes(route))

      if (!auth.userId && isProtectedRoute) {
        const locale = pathname.split("/")[1] || i18n.defaultLocale
        return redirectToSignIn({
          returnBackUrl: req.url,
          redirectUrl: `/${locale}/sign-in`,
        })
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Middleware error:", error)
      return NextResponse.next()
    }
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
