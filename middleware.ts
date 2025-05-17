import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { i18n } from "@/lib/i18n-config"

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/jobs",
    "/craftsmen",
    "/how-it-works",
    "/pricing",
    "/blog(.*)",
    "/faq",
    "/terms",
    "/privacy",
    "/cookies",
    "/imprint",
    // Add i18n routes
    "/de",
    "/de/(.*)",
    "/en",
    "/en/(.*)",
  ],
  afterAuth(auth, req) {
    // Handle localized routes
    const pathname = req.nextUrl.pathname

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
