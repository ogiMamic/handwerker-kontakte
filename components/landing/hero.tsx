"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Wrench, Users, Briefcase, Zap, Droplets, Paintbrush, Hammer, Home, Layers } from "lucide-react"

interface HeroProps {
  totalProfiles: number
  totalGewerke: number
  totalStaedte: number
  categoryCounts: Record<string, number>
}

const GEWERK_CATEGORIES = [
  { slug: "elektriker", label: "Elektriker", icon: Zap, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { slug: "klempner", label: "Klempner", icon: Droplets, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { slug: "maler", label: "Maler", icon: Paintbrush, color: "text-pink-600 bg-pink-50 border-pink-200" },
  { slug: "schreiner", label: "Schreiner", icon: Hammer, color: "text-amber-700 bg-amber-50 border-amber-200" },
  { slug: "dachdecker", label: "Dachdecker", icon: Home, color: "text-red-600 bg-red-50 border-red-200" },
  { slug: "fliesenleger", label: "Fliesenleger", icon: Layers, color: "text-teal-600 bg-teal-50 border-teal-200" },
] as const

const SEARCH_CATEGORIES = [
  { value: "elektriker", label: "Elektriker" },
  { value: "klempner", label: "Klempner / Sanit\u00e4r" },
  { value: "maler", label: "Maler & Lackierer" },
  { value: "schreiner", label: "Schreiner & Tischler" },
  { value: "dachdecker", label: "Dachdecker" },
  { value: "fliesenleger", label: "Fliesenleger" },
  { value: "heizungsbauer", label: "Heizungsbauer" },
  { value: "installateur", label: "Installateur" },
  { value: "zimmermann", label: "Zimmermann" },
  { value: "bodenleger", label: "Bodenleger" },
]

export function LandingHero({ totalProfiles, totalGewerke, totalStaedte, categoryCounts }: HeroProps) {
  const router = useRouter()
  const [postalCode, setPostalCode] = useState("")
  const [skill, setSkill] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (postalCode) params.set("postalCode", postalCode)
    if (skill) params.set("skill", skill)
    router.push(`/de/handwerker?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-[#1E293B]">
            Finden Sie den besten{" "}
            <span className="text-[#2563EB]">Handwerker</span>{" "}
            in Ihrer N&auml;he
          </h1>
          <p className="max-w-[600px] text-gray-500 text-base md:text-lg">
            Verifizierte Profile vergleichen und direkt kontaktieren - kostenlos und unverbindlich.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Postleitzahl eingeben..."
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-12 text-base"
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <Select value={skill} onValueChange={setSkill}>
                  <SelectTrigger className="h-12 text-base">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Was wird gebraucht?" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {SEARCH_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="lg"
                className="h-12 px-8 text-base"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Suchen
              </Button>
            </div>
          </div>

          {/* Trust indicators with real data */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-2 text-sm text-gray-500">
            {totalProfiles > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#2563EB]" />
                <span className="font-medium">{totalProfiles} Handwerker</span>
              </div>
            )}
            {totalGewerke > 0 && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#2563EB]" />
                <span className="font-medium">{totalGewerke} Fachgebiete</span>
              </div>
            )}
            {totalStaedte > 0 && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#2563EB]" />
                <span className="font-medium">{totalStaedte} St&auml;dte</span>
              </div>
            )}
          </div>

          {/* Clickable category icons with counts */}
          <div className="w-full max-w-3xl pt-4">
            <p className="text-sm text-gray-400 mb-3">Beliebte Kategorien</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {GEWERK_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const count = categoryCounts[cat.slug] ?? 0
                return (
                  <Link
                    key={cat.slug}
                    href={`/de/handwerker/kategorie/${cat.slug}`}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${cat.color} hover:shadow-md transition-all duration-200`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{cat.label}</span>
                    {count > 0 && (
                      <span className="text-[10px] text-gray-400">{count} Profile</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
