"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationIndicator } from "@/components/layout/notification-indicator"

interface NavigationDictionary {
  home: string
  jobs: string
  craftsmen: string
  howItWorks: string
  pricing: string
  login: string
  signup: string
  dashboard: string
}

export function SiteHeader({ dictionary }: { dictionary: NavigationDictionary }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Standardmäßig deutsche Routen verwenden
  const locale = pathname.split("/")[1] || "de"

  const routes = [
    { href: `/${locale}`, label: dictionary.home },
    { href: `/${locale}/auftraege`, label: dictionary.jobs },
    { href: `/${locale}/handwerker`, label: dictionary.craftsmen },
    { href: `/${locale}/so-funktionierts`, label: dictionary.howItWorks },
    { href: `/${locale}/preise`, label: dictionary.pricing },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="font-bold text-xl">Handwerker-Kontakte</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={pathname === route.href}>
                      {route.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <SignedIn>
            <NotificationIndicator />
            <Button asChild variant="ghost" size="sm" className="mr-2">
              <Link href={`/${locale}/dashboard`}>{dictionary.dashboard}</Link>
            </Button>
            <UserButton afterSignOutUrl={`/${locale}`} />
          </SignedIn>
          <SignedOut>
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${locale}/sign-in`}>{dictionary.login}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/${locale}/sign-up`}>{dictionary.signup}</Link>
              </Button>
            </div>
          </SignedOut>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Button
                    key={route.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={route.href}>{route.label}</Link>
                  </Button>
                ))}
                <SignedOut>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href={`/${locale}/sign-in`} onClick={() => setIsOpen(false)}>
                      {dictionary.login}
                    </Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link href={`/${locale}/sign-up`} onClick={() => setIsOpen(false)}>
                      {dictionary.signup}
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href={`/${locale}/dashboard`} onClick={() => setIsOpen(false)}>
                      {dictionary.dashboard}
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href={`/${locale}/benachrichtigungen`} onClick={() => setIsOpen(false)}>
                      Benachrichtigungen
                    </Link>
                  </Button>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
