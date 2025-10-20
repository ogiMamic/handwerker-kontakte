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
import { Menu, User, Bell, LayoutDashboard } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationIndicator } from "@/components/layout/notification-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    { href: `/${locale}`, label: dictionary.home },
    { href: `/${locale}/auftraege`, label: dictionary.jobs },
    { href: `/${locale}/handwerker`, label: dictionary.craftsmen },
    { href: `/${locale}/so-funktionierts`, label: dictionary.howItWorks },
    { href: `/${locale}/preise`, label: dictionary.pricing },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="font-bold text-xl">Handwerker-Kontakte</span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Right Section */}
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
              <Link href={`/${locale}/sign-up`}>{dictionary.signup}</Link>
            </Button>
          </SignedOut>
        </div>

        {/* Mobile Right Section - samo 2 elementa */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {/* User Section u Sidebar-u */}
                <SignedIn>
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <UserButton afterSignOutUrl={`/${locale}`} />
                    <span className="text-sm font-medium">Moj Profil</span>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={`/${locale}/dashboard`}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {dictionary.dashboard}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={`/${locale}/profil`}>
                      <User className="h-4 w-4 mr-2" />
                      Mein Profil
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={`/${locale}/benachrichtigungen`}>
                      <Bell className="h-4 w-4 mr-2" />
                      Benachrichtigungen
                    </Link>
                  </Button>
                  <div className="border-t pt-4" />
                </SignedIn>

                {/* Navigation Links */}
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

                {/* Auth Buttons */}
                <SignedOut>
                  <div className="border-t pt-4 flex flex-col gap-2">
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
                  </div>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}