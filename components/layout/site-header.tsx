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
import { Menu, User, Bell, LayoutDashboard, UserPlus, CreditCard } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationIndicator } from "@/components/layout/notification-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/brand/logo"

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

  const locale = pathname.split("/")[1] || "de"

  const routes = [
    { href: `/${locale}/auftraege`, label: dictionary.jobs },
    { href: `/${locale}/handwerker`, label: dictionary.craftsmen },
    { href: `/${locale}/so-funktionierts`, label: dictionary.howItWorks },
    { href: `/${locale}/preise`, label: dictionary.pricing },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex md:hidden items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <SignedIn>
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <UserButton afterSignOutUrl={`/${locale}`} />
                    <span className="text-sm font-medium">Moj Profil</span>
                  </div>
                  <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link href={`/${locale}/dashboard`}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {dictionary.dashboard}
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link href={`/${locale}/profil`}>
                      <User className="h-4 w-4 mr-2" />
                      Mein Profil
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link href={`/${locale}/subscription`}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Abonnement verwalten
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link href={`/${locale}/benachrichtigungen`}>
                      <Bell className="h-4 w-4 mr-2" />
                      Benachrichtigungen
                    </Link>
                  </Button>
                  <div className="border-t pt-4" />
                </SignedIn>

                <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                  <Link href={`/${locale}`}>{dictionary.home}</Link>
                </Button>
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

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2 px-2">{locale === "de" ? "Sprache" : "Language"}</p>
                  <LanguageSwitcher />
                </div>

                <SignedOut>
                  <div className="border-t pt-4 flex flex-col gap-2">
                    <Button asChild variant="ghost" className="justify-start">
                      <Link href={`/${locale}/sign-in`} onClick={() => setIsOpen(false)}>
                        {dictionary.login}
                      </Link>
                    </Button>
                  </div>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link
          href={`/${locale}`}
          className="flex items-center space-x-2 transition-opacity hover:opacity-80 md:mr-auto"
        >
          <Logo />
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

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <SignedIn>
            <NotificationIndicator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard`}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {dictionary.dashboard}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/profil`}>
                    <User className="h-4 w-4 mr-2" />
                    Mein Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/subscription`}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Abonnement verwalten
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/benachrichtigungen`}>
                    <Bell className="h-4 w-4 mr-2" />
                    Benachrichtigungen
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton afterSignOutUrl={`/${locale}`} />
          </SignedIn>
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${locale}/sign-in`}>{dictionary.login}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/${locale}/handwerker/registrieren`}>
                <UserPlus className="h-4 w-4 mr-2" />
                Konto erstellen
              </Link>
            </Button>
          </SignedOut>
        </div>

        <div className="flex md:hidden">
          <SignedOut>
            <Button asChild size="sm" variant="default">
              <Link href={`/${locale}/handwerker/registrieren`}>
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="text-xs">Registrieren</span>
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl={`/${locale}`} />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
