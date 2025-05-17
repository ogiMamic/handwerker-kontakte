"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { i18n } from "@/lib/i18n-config"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = pathname.split("/")[1] || "de"
  const isValidLocale = i18n.locales.includes(currentLang as any)

  const switchLanguage = (locale: string) => {
    if (isValidLocale) {
      // Replace the first segment of the path with the new locale
      const newPath = pathname.replace(`/${currentLang}`, `/${locale}`)
      router.push(newPath)
    } else {
      // If current path doesn't have a locale, add it
      router.push(`/${locale}${pathname}`)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("de")}>Deutsch</DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("en")}>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
