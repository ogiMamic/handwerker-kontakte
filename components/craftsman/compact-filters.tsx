"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { MapPin, Filter, X, Search, Star, Euro } from "lucide-react"

interface CompactFiltersProps {
  initialFilters: {
    postalCode: string
    skill: string
    minRating?: number
    maxHourlyRate?: number
  }
  dictionary: any
}

export function CompactFilters({ initialFilters, dictionary }: CompactFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    postalCode: initialFilters.postalCode || "",
    skill: initialFilters.skill || "all",
    minRating: initialFilters.minRating || 0,
    maxHourlyRate: initialFilters.maxHourlyRate || 200,
  })
  const [isOpen, setIsOpen] = useState(false)

  const availableSkills = [
    { label: "Alle Fähigkeiten", value: "all" },
    { label: "Elektrik", value: "Elektrik" },
    { label: "Renovierung", value: "Renovierung" },
    { label: "Installation", value: "Installation" },
    { label: "Sanitär", value: "Sanitär" },
    { label: "Malerarbeiten", value: "Malerarbeiten" },
    { label: "Fliesenlegen", value: "Fliesenlegen" },
    { label: "Tischlerei", value: "Tischlerei" },
    { label: "Dachdeckerarbeiten", value: "Dachdeckerarbeiten" },
    { label: "Gartenarbeit", value: "Gartenarbeit" },
  ]

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filters.postalCode) params.set("postalCode", filters.postalCode)
    if (filters.skill && filters.skill !== "all") params.set("skill", filters.skill)
    if (filters.minRating > 0) params.set("minRating", filters.minRating.toString())
    if (filters.maxHourlyRate < 200) params.set("maxHourlyRate", filters.maxHourlyRate.toString())
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const resetFilters = () => {
    setFilters({ postalCode: "", skill: "all", minRating: 0, maxHourlyRate: 200 })
    router.push(pathname)
    setIsOpen(false)
  }

  const activeFiltersCount = [
    filters.postalCode,
    filters.skill !== "all" && filters.skill,
    filters.minRating > 0,
    filters.maxHourlyRate < 200,
  ].filter(Boolean).length

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <div className="relative w-48">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="PLZ oder Stadt..."
          className="pl-9 h-9"
          value={filters.postalCode}
          onChange={(e) => setFilters((prev) => ({ ...prev, postalCode: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

      <Select value={filters.skill} onValueChange={(value) => setFilters((prev) => ({ ...prev, skill: value }))}>
        <SelectTrigger className="w-48 h-9">
          <SelectValue placeholder="Fähigkeit wählen" />
        </SelectTrigger>
        <SelectContent>
          {availableSkills.map((skill) => (
            <SelectItem key={skill.value} value={skill.value}>
              {skill.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative h-9 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Mehr Filter
            {activeFiltersCount > 2 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount - 2}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <h4 className="font-medium">Mindestbewertung</h4>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[filters.minRating]}
                  onValueChange={([value]) => setFilters((prev) => ({ ...prev, minRating: value }))}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0 Sterne</span>
                  <span className="font-medium text-foreground">{filters.minRating.toFixed(1)}+ Sterne</span>
                  <span>5 Sterne</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Euro className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Max. Stundensatz</h4>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[filters.maxHourlyRate]}
                  onValueChange={([value]) => setFilters((prev) => ({ ...prev, maxHourlyRate: value }))}
                  max={200}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>€0/h</span>
                  <span className="font-medium text-foreground">bis €{filters.maxHourlyRate}/h</span>
                  <span>€200/h</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Zurücksetzen
              </Button>
              <Button size="sm" className="flex-1" onClick={applyFilters}>
                <Search className="h-4 w-4 mr-2" />
                Anwenden
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button size="sm" onClick={applyFilters} className="h-9">
        <Search className="h-4 w-4 mr-2" />
        Suchen
      </Button>
    </div>
  )
}
