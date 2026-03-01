"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Wrench, Users, Star, Shield } from "lucide-react"

interface HeroDictionary {
  title: string
  subtitle: string
  clientCta: string
  craftsCta: string
}

export function LandingHero({ dictionary }: { dictionary: HeroDictionary }) {
  const router = useRouter()
  const [postalCode, setPostalCode] = useState("")
  const [skill, setSkill] = useState("")

  const categories = [
    { value: "Elektrik", label: "Elektriker" },
    { value: "Sanitär", label: "Klempner / Sanitär" },
    { value: "Malerarbeiten", label: "Maler" },
    { value: "Fliesenlegen", label: "Fliesenleger" },
    { value: "Tischlerei", label: "Tischler / Schreiner" },
    { value: "Dachdeckerarbeiten", label: "Dachdecker" },
    { value: "Renovierung", label: "Renovierung" },
    { value: "Installation", label: "Installation" },
    { value: "Gartenarbeit", label: "Gärtner" },
    { value: "Umzug", label: "Umzugshilfe" },
  ]

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
    <section className="relative py-10 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Finden Sie den besten{" "}
            <span className="text-primary">Handwerker</span>{" "}
            in Ihrer Nähe
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            Durchsuchen Sie verifizierte Handwerkerprofile, vergleichen Sie Bewertungen und kontaktieren Sie direkt — kostenlos und unverbindlich.
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
                    {categories.map((cat) => (
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

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">100+ Handwerker</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Geprüfte Bewertungen</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="font-medium">100% kostenlos für Kunden</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
