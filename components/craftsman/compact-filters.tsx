"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MapPin, Filter, X, Search, Star, Euro, ChevronDown, Check } from "lucide-react"

interface CompactFiltersProps {
  initialFilters: {
    postalCode: string
    skill: string
    minRating?: number
    maxHourlyRate?: number
  }
  dictionary: any
}

const availableSkills = [
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

function parseInitialSkills(skill: string): string[] {
  if (!skill || skill === "all") return []
  return skill.split(",").filter(Boolean)
}

export function CompactFilters({ initialFilters, dictionary }: CompactFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [postalCode, setPostalCode] = useState(initialFilters.postalCode || "")
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    parseInitialSkills(initialFilters.skill)
  )
  const [minRating, setMinRating] = useState(initialFilters.minRating || 0)
  const [maxHourlyRate, setMaxHourlyRate] = useState(initialFilters.maxHourlyRate || 200)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isSkillOpen, setIsSkillOpen] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const buildParams = useCallback(
    (overrides?: {
      postalCode?: string
      skills?: string[]
      minRating?: number
      maxHourlyRate?: number
    }) => {
      const pc = overrides?.postalCode !== undefined ? overrides.postalCode : postalCode
      const skills = overrides?.skills !== undefined ? overrides.skills : selectedSkills
      const rating = overrides?.minRating !== undefined ? overrides.minRating : minRating
      const rate = overrides?.maxHourlyRate !== undefined ? overrides.maxHourlyRate : maxHourlyRate

      const params = new URLSearchParams()
      if (pc) params.set("postalCode", pc)
      if (skills.length > 0) params.set("skill", skills.join(","))
      if (rating > 0) params.set("minRating", rating.toString())
      if (rate < 200) params.set("maxHourlyRate", rate.toString())
      params.set("page", "1")
      return params
    },
    [postalCode, selectedSkills, minRating, maxHourlyRate]
  )

  const handlePostalCodeChange = (value: string) => {
    setPostalCode(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = buildParams({ postalCode: value })
      router.push(`${pathname}?${params.toString()}`)
    }, 500)
  }

  const clearPostalCode = () => {
    setPostalCode("")
    const params = buildParams({ postalCode: "" })
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleSkill = (skill: string) => {
    const next = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill]
    setSelectedSkills(next)
    const params = buildParams({ skills: next })
    router.push(`${pathname}?${params.toString()}`)
  }

  const removeSkill = (skill: string) => {
    const next = selectedSkills.filter((s) => s !== skill)
    setSelectedSkills(next)
    const params = buildParams({ skills: next })
    router.push(`${pathname}?${params.toString()}`)
  }

  const applyAdvancedFilters = () => {
    const params = buildParams()
    router.push(`${pathname}?${params.toString()}`)
    setIsAdvancedOpen(false)
  }

  const resetAllFilters = () => {
    setPostalCode("")
    setSelectedSkills([])
    setMinRating(0)
    setMaxHourlyRate(200)
    router.push(pathname)
    setIsAdvancedOpen(false)
  }

  const hasActiveFilters =
    postalCode ||
    selectedSkills.length > 0 ||
    minRating > 0 ||
    maxHourlyRate < 200

  const advancedActiveCount = [minRating > 0, maxHourlyRate < 200].filter(Boolean).length

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center flex-wrap">
        {/* PLZ input */}
        <div className="relative w-full sm:w-48">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="PLZ..."
            className="pl-9 pr-8 h-9 text-sm"
            value={postalCode}
            onChange={(e) => handlePostalCodeChange(e.target.value)}
          />
          {postalCode && (
            <button
              type="button"
              onClick={clearPostalCode}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Multi-select skill dropdown */}
        <Popover open={isSkillOpen} onOpenChange={setIsSkillOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isSkillOpen}
              className="w-full sm:w-48 h-9 text-sm justify-between bg-transparent font-normal"
            >
              {selectedSkills.length === 0
                ? "Fähigkeiten wählen..."
                : selectedSkills.length === 1
                ? selectedSkills[0]
                : `${selectedSkills.length} Fähigkeiten`}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput placeholder="Fähigkeit suchen..." className="h-9" />
              <CommandList>
                <CommandEmpty>Keine Ergebnisse.</CommandEmpty>
                <CommandGroup>
                  {availableSkills.map((skill) => (
                    <CommandItem
                      key={skill.value}
                      value={skill.value}
                      onSelect={() => toggleSkill(skill.value)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedSkills.includes(skill.value) ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {skill.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Advanced filters + search buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative h-9 bg-transparent flex-1 sm:flex-none">
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Mehr Filter</span>
                {advancedActiveCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {advancedActiveCount}
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
                      value={[minRating]}
                      onValueChange={([value]) => setMinRating(value)}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0 Sterne</span>
                      <span className="font-medium text-foreground">{minRating.toFixed(1)}+ Sterne</span>
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
                      value={[maxHourlyRate]}
                      onValueChange={([value]) => setMaxHourlyRate(value)}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>€0/h</span>
                      <span className="font-medium text-foreground">bis €{maxHourlyRate}/h</span>
                      <span>€200/h</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={resetAllFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Zurücksetzen
                  </Button>
                  <Button size="sm" className="flex-1" onClick={applyAdvancedFilters}>
                    <Search className="h-4 w-4 mr-2" />
                    Anwenden
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button size="sm" onClick={() => router.push(`${pathname}?${buildParams().toString()}`)} className="h-9 flex-1 sm:flex-none">
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Suchen</span>
          </Button>
        </div>

        {/* Clear all filters button - only shown when filters are active */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="h-9 text-muted-foreground hover:text-foreground gap-1.5"
          >
            <X className="h-4 w-4" />
            Filter zurücksetzen
          </Button>
        )}
      </div>

      {/* Selected skill badges */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedSkills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                aria-label={`${skill} entfernen`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
