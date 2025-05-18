import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { i18n } from "@/lib/i18n-config"

// Liste der statischen Dateien, die von der Lokalisierung ausgeschlossen werden sollen
const staticFiles = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico',
  '/house-renovation-craftsmen.png',
  '/bathroom-renovation.png',
  '/modern-kitchen-cabinets.png',
  '/diverse-group.png',
  '/craftsman.png',
  // Fügen Sie bei Bedarf weitere statische Dateien hinzu
]

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    // Statische Dateien zu public routes hinzufügen
    ...staticFiles,
    // i18n Routen
    "/de",
    "/de/(.*)",
    "/en",
    "/en/(.*)",
  ],
  afterAuth(auth, req) {
    // Prüfen, ob der Pfad eine statische Datei ist
    const pathname = req.nextUrl.pathname
    if (staticFiles.some(file => pathname === file)) {
      return NextResponse.next()
    }

    // Handle localized routes
    // Check if the pathname starts with a locale
    const pathnameHasLocale = i18n.locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    )

    // If it doesn't have a locale, redirect to the default locale
    if (!pathnameHasLocale) {
      const locale = req.nextUrl.locale || i18n.defaultLocale
      const url = new URL(`/${locale}${pathname}`, req.url)
      url.search = req.nextUrl.search
      return NextResponse.redirect(url)
    }

    // If the user is not signed in and the route is protected, redirect to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      const locale = req.nextUrl.locale || i18n.defaultLocale
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
