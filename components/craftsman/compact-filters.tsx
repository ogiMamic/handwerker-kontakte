"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, Filter, X, Search } from "lucide-react"

interface CompactFiltersProps {
  initialFilters: {
    postalCode: string
    skill: string
  }
  dictionary: any
}

export function CompactFilters({ initialFilters, dictionary }: CompactFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState(initialFilters)
  const [isOpen, setIsOpen] = useState(false)

  const availableSkills = [
    { label: "Alle Fähigkeiten", value: "all" },
    { label: "Renovierung", value: "Renovierung" },
    { label: "Installation", value: "Installation" },
    { label: "Sanitär", value: "Sanitär" },
    { label: "Elektrik", value: "Elektrik" },
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
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const resetFilters = () => {
    setFilters({ postalCode: "", skill: "all" })
    router.push(pathname)
    setIsOpen(false)
  }

  const activeFiltersCount = [filters.postalCode, filters.skill !== "all" && filters.skill].filter(Boolean).length

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-xs">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="PLZ eingeben..."
          className="pl-9"
          value={filters.postalCode}
          onChange={(e) => setFilters((prev) => ({ ...prev, postalCode: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Fähigkeit</h4>
              <Select
                value={filters.skill}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, skill: value }))}
              >
                <SelectTrigger>
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
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Zurücksetzen
              </Button>
              <Button className="flex-1" onClick={applyFilters}>
                <Search className="h-4 w-4 mr-2" />
                Anwenden
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
