"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Star, MapPin, Phone, Mail, Clock, Search, Filter } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface CraftsmanSearchProps {
  craftsmen: any[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
  initialFilters: {
    postalCode: string
    skill: string
  }
  dictionary: any
  lang: Locale
}

export function CraftsmanSearch({ craftsmen, pagination, initialFilters, dictionary, lang }: CraftsmanSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState(initialFilters)
  const [isFiltering, setIsFiltering] = useState(false)
  const [limitPerPage, setLimitPerPage] = useState(pagination.limit.toString())

  // Verfügbare Fähigkeiten für die Filterung
  const availableSkills = [
    { label: dictionary.skills.all, value: "all" },
    { label: dictionary.skills.renovation, value: "Renovierung" },
    { label: dictionary.skills.installation, value: "Installation" },
    { label: dictionary.skills.plumbing, value: "Sanitär" },
    { label: dictionary.skills.electrical, value: "Elektrik" },
    { label: dictionary.skills.painting, value: "Malerarbeiten" },
    { label: dictionary.skills.tiling, value: "Fliesenlegen" },
    { label: dictionary.skills.carpentry, value: "Tischlerei" },
    { label: dictionary.skills.roofing, value: "Dachdeckerarbeiten" },
    { label: dictionary.skills.gardening, value: "Gartenarbeit" },
    { label: dictionary.skills.moving, value: "Umzug" },
  ]

  // Verfügbare Anzeigeoptionen
  const limitOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ]

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setIsFiltering(true)
    const params = new URLSearchParams()

    if (filters.postalCode) params.set("postalCode", filters.postalCode)
    if (filters.skill && filters.skill !== "all") params.set("skill", filters.skill)
    params.set("limit", limitPerPage)
    params.set("page", "1") // Zurück zur ersten Seite bei Filteränderungen

    router.push(`${pathname}?${params.toString()}`)
    setIsFiltering(false)
  }

  const handleLimitChange = (value: string) => {
    setLimitPerPage(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", value)
    params.set("page", "1") // Zurück zur ersten Seite bei Änderung der Anzeigeanzahl
    router.push(`${pathname}?${params.toString()}`)
  }

  const renderRatingStars = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-400 text-sm">{dictionary.noRatings}</span>

    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.filterTitle}</CardTitle>
          <CardDescription>{dictionary.filterDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="postalCode" className="text-sm font-medium">
                {dictionary.postalCode}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="postalCode"
                  placeholder={dictionary.postalCodePlaceholder}
                  className="pl-9"
                  value={filters.postalCode}
                  onChange={(e) => handleFilterChange("postalCode", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="skill" className="text-sm font-medium">
                {dictionary.skill}
              </label>
              <Select value={filters.skill} onValueChange={(value) => handleFilterChange("skill", value)}>
                <SelectTrigger id="skill">
                  <SelectValue placeholder={dictionary.skillPlaceholder} />
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

            <div className="space-y-2">
              <label htmlFor="limit" className="text-sm font-medium">
                {dictionary.resultsPerPage}
              </label>
              <Select value={limitPerPage} onValueChange={handleLimitChange}>
                <SelectTrigger id="limit">
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  {limitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setFilters({ postalCode: "", skill: "all" })}>
            {dictionary.resetFilters}
          </Button>
          <Button onClick={applyFilters} disabled={isFiltering}>
            <Filter className="mr-2 h-4 w-4" />
            {dictionary.applyFilters}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {dictionary.resultsTitle} ({pagination.total})
        </h2>
        <div className="text-sm text-gray-500">
          {dictionary.showing} {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} {dictionary.of} {pagination.total}
        </div>
      </div>

      {craftsmen.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">{dictionary.noResults}</h3>
          <p className="text-gray-500">{dictionary.tryDifferentFilters}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {craftsmen.map((craftsman) => (
            <Card key={craftsman.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={craftsman.imageUrl || "/placeholder.svg"} />
                      <AvatarFallback>{craftsman.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{craftsman.companyName}</CardTitle>
                      <CardDescription>{craftsman.name}</CardDescription>
                    </div>
                  </div>
                  {craftsman.isVerified && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {dictionary.verified}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {craftsman.businessPostalCode} {craftsman.businessCity}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-1" />
                    {craftsman.phone || dictionary.contactNotAvailable}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    {craftsman.email}
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="font-medium">
                      {dictionary.hourlyRate}:{" "}
                      {new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-US", {
                        style: "currency",
                        currency: "EUR",
                      }).format(craftsman.hourlyRate)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {craftsman.skills.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {craftsman.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{craftsman.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>{renderRatingStars(craftsman.averageRating)}</div>
                    <div className="text-sm text-gray-500">
                      {craftsman.completedJobs} {dictionary.completedJobs}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button className="w-full" asChild>
                  <a href={`/${lang}/handwerker/${craftsman.id}`}>{dictionary.viewProfile}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {pagination.page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`${pathname}?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (pagination.page - 1).toString(),
                  })}`}
                />
              </PaginationItem>
            )}

            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
              let pageNumber: number

              // Logik für die Anzeige der Seitenzahlen
              if (pagination.totalPages <= 5) {
                pageNumber = i + 1
              } else if (pagination.page <= 3) {
                pageNumber = i + 1
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNumber = pagination.totalPages - 4 + i
              } else {
                pageNumber = pagination.page - 2 + i
              }

              // Nur anzeigen, wenn die Seitenzahl gültig ist
              if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`${pathname}?${new URLSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        page: pageNumber.toString(),
                      })}`}
                      isActive={pagination.page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              return null
            })}

            {pagination.page < pagination.totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`${pathname}?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (pagination.page + 1).toString(),
                  })}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
