import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { i18n } from "@/lib/i18n-config"

// Lista statičkih fajlova koje treba isključiti iz lokalizacije
const staticFiles = [
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/favicon.ico",
  "/house-renovation-craftsmen.png",
  "/bathroom-renovation.png",
  "/modern-kitchen-cabinets.png",
  "/diverse-group.png",
  "/craftsman.png",
  // Dodaj ostale statičke fajlove po potrebi
]

// Kreiraj sigurnu verziju middleware-a
const safeAuthMiddleware = authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/api/health",
    // Dodaj statičke fajlove u public routes
    ...staticFiles,
    // i18n rute
    "/de",
    "/de/preise",
    "/de/so-funktionierts",
    "/en",
    "/en/pricing",
    "/en/how-it-works",
  ],
  afterAuth(auth, req) {
    try {
      // Provjeri da li je putanja statički fajl
      const pathname = req.nextUrl.pathname
      if (staticFiles.some((file) => pathname === file)) {
        return NextResponse.next()
      }

      // Health check endpoint
      if (pathname === "/api/health") {
        return NextResponse.next()
      }

      // Upravljanje lokalizovanim rutama
      // Provjeri da li putanja počinje sa lokalom
      const pathnameHasLocale = i18n.locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
      )

      // Ako nema lokala, preusmjeri na default locale
      if (!pathnameHasLocale && !pathname.startsWith("/api/")) {
        const locale = req.nextUrl.locale || i18n.defaultLocale
        const url = new URL(`/${locale}${pathname}`, req.url)
        url.search = req.nextUrl.search
        return NextResponse.redirect(url)
      }

      // Ako korisnik nije prijavljen i ruta je zaštićena, preusmjeri na prijavu
      if (!auth.userId && !auth.isPublicRoute) {
        const locale = req.nextUrl.pathname.split("/")[1] || i18n.defaultLocale
        return redirectToSignIn({
          returnBackUrl: req.url,
        })
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Middleware error:", error)
      // U slučaju greške, nastavi sa zahtjevom
      return NextResponse.next()
    }
  },
})

// Izvozi middleware sa try-catch blokom
export default function middleware(req: any, evt: any) {
  try {
    return safeAuthMiddleware(req, evt)
  } catch (error) {
    console.error("Global middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
