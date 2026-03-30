// @ts-nocheck
import { authMiddleware } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { i18n } from "@/lib/i18n-config"

// Routes that bypass Clerk completely
const isPublicPath = (pathname) => {
  const publicPaths = [
    /^\/$/, 
    /^\/(de|en)$/,
    /^\/(de|en)\/handwerker/,
    /^\/(de|en)\/preise/,
    /^\/(de|en)\/so-funktionierts/,
    /^\/(de|en)\/ratgeber/,
    /^\/(de|en)\/kosten/,
    /^\/(de|en)\/impressum/,
    /^\/(de|en)\/agb/,
    /^\/(de|en)\/datenschutz/,
    /^\/(de|en)\/cookies/,
    /^\/(de|en)\/faq/,
    /^\/(de|en)\/blog/,
    /^\/(de|en)\/sign-in/,
    /^\/(de|en)\/sign-up/,
    /^\/sitemap\.xml/,
    /^\/robots\.txt/,
    /^\/api\/health/,
    /^\/api\/craftsmen/,
  ]
  return publicPaths.some((pattern) => pattern.test(pathname))
}

export default async function middleware(req) {
  const pathname = req.nextUrl.pathname

  // Completely bypass Clerk for public routes
  if (isPublicPath(pathname)) {
    // Handle i18n redirect for root
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/de", req.url))
    }
    return NextResponse.next()
  }

  // For protected routes, use Clerk
  return authMiddleware({
    publicRoutes: ["/(.*)"],
    afterAuth(auth, req) {
      const protectedRoutes = [
        "/dashboard",
        "/profil",
        "/subscription",
        "/handwerker/profil",
        "/handwerker/registrieren",
      ]

      const isProtectedRoute = protectedRoutes.some((route) => 
        req.nextUrl.pathname.includes(route)
      )

      if (!auth.userId && isProtectedRoute) {
        const locale = req.nextUrl.pathname.split("/")[1] || "de"
        return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url))
      }

      return NextResponse.next()
    },
  })(req, req)
}

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|favicon\\.ico).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}