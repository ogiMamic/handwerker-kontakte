"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-apply filters with debounce
  const autoApply = useCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams()
      if (newFilters.postalCode) params.set("postalCode", newFilters.postalCode)
      if (newFilters.skill && newFilters.skill !== "all") params.set("skill", newFilters.skill)
      if (newFilters.minRating > 0) params.set("minRating", newFilters.minRating.toString())
      if (newFilters.maxHourlyRate < 200) params.set("maxHourlyRate", newFilters.maxHourlyRate.toString())
      params.set("page", "1")
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router]
  )

  // Debounced PLZ change
  const handlePostalCodeChange = (value: string) => {
    const updated = { ...filters, postalCode: value }
    setFilters(updated)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => autoApply(updated), 500)
  }

  // Immediate skill change
  const handleSkillChange = (value: string) => {
    const updated = { ...filters, skill: value }
    setFilters(updated)
    autoApply(updated)
  }

  // Clear PLZ
  const clearPostalCode = () => {
    const updated = { ...filters, postalCode: "" }
    setFilters(updated)
    autoApply(updated)
  }

  const availableSkills = [
    { label: "Alle Fähigkeiten", value: "all" },
    { label: "Elektrik", value: "Elektrik" },
    { label: "Sanitär", value: "Sanitär" },
    { label: "Malerarbeiten", value: "Malerarbeiten" },
    { label: "Fliesenlegen", value: "Fliesenlegen" },
    { label: "Tischlerei", value: "Tischlerei" },
    { label: "Dachdeckerarbeiten", value: "Dachdeckerarbeiten" },
    { label: "Renovierung", value: "Renovierung" },
    { label: "Gartenarbeit", value: "Gartenarbeit" },
    { label: "Umzug", value: "Umzug" },
    { label: "Installation", value: "Installation" },
    { label: "Schlüsseldienst", value: "Schlüsseldienst" },
    { label: "Trockenbau", value: "Trockenbau" },
    { label: "Bodenbelag", value: "Bodenbelag" },
    { label: "Maurerarbeiten", value: "Maurerarbeiten" },
    { label: "Reinigung", value: "Reinigung" },
    { label: "Heizungsbau", value: "Heizungsbau" },
    { label: "Zimmerei", value: "Zimmerei" },
    { label: "Photovoltaik", value: "Photovoltaik" },
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
      <div className="relative w-full sm:w-48">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="PLZ..."
          className="pl-9 pr-8 h-9 text-sm"
          value={filters.postalCode}
          onChange={(e) => handlePostalCodeChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
        {filters.postalCode && (
          <button
            type="button"
            onClick={clearPostalCode}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Select value={filters.skill} onValueChange={handleSkillChange}>
        <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
          <SelectValue placeholder="Fähigkeit" />
        </SelectTrigger>
        <SelectContent>
          {availableSkills.map((skill) => (
            <SelectItem key={skill.value} value={skill.value}>
              {skill.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 w-full sm:w-auto">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative h-9 bg-transparent flex-1 sm:flex-none">
              <Filter className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Mehr Filter</span>
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

        <Button size="sm" onClick={applyFilters} className="h-9 flex-1 sm:flex-none">
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Suchen</span>
        </Button>
      </div>
    </div>
  )
}
