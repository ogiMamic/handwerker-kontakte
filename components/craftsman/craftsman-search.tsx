"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MapPin, Star, User, Briefcase, Phone } from "lucide-react"

interface Craftsman {
  id: string
  userId: string
  name: string
  email: string
  imageUrl: string | null
  companyName: string
  contactPerson: string
  phone: string
  description: string
  serviceRadius: number
  hourlyRate: number
  skills: string[]
  businessCity: string
  businessPostalCode: string
  completedJobs: number
  averageRating: number | null
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

interface CraftsmanSearchProps {
  craftsmen: Craftsman[]
  pagination: PaginationInfo
  initialFilters: {
    postalCode: string
    skill: string
  }
}

const SKILLS = [
  { value: "all", label: "Alle Fähigkeiten" },
  { value: "plumbing", label: "Sanitär" },
  { value: "electrical", label: "Elektrik" },
  { value: "carpentry", label: "Tischlerei" },
  { value: "painting", label: "Malerarbeiten" },
  { value: "flooring", label: "Bodenbeläge" },
  { value: "roofing", label: "Dacharbeiten" },
  { value: "landscaping", label: "Gartenarbeit" },
  { value: "masonry", label: "Mauerwerk" },
  { value: "hvac", label: "Heizung & Klima" },
]

export function CraftsmanSearch({ craftsmen, pagination, initialFilters }: CraftsmanSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [postalCode, setPostalCode] = useState(initialFilters.postalCode)
  const [skill, setSkill] = useState(initialFilters.skill)

  // Standardmäßig deutsche Routen verwenden
  const locale = pathname.split("/")[1] || "de"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL with search parameters
    const params = new URLSearchParams(searchParams)
    if (postalCode) {
      params.set("postalCode", postalCode)
    } else {
      params.delete("postalCode")
    }

    if (skill !== "all") {
      params.set("skill", skill)
    } else {
      params.delete("skill")
    }

    params.set("page", "1") // Reset to first page
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="PLZ eingeben..."
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <Select value={skill} onValueChange={setSkill}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Fähigkeit" />
          </SelectTrigger>
          <SelectContent>
            {SKILLS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Suchen</Button>
      </form>

      {craftsmen.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Keine Handwerker gefunden.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {craftsmen.map((craftsman) => (
            <Link href={`/${locale}/handwerker/${craftsman.userId}`} key={craftsman.id}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    {craftsman.imageUrl ? (
                      <Image
                        src={craftsman.imageUrl || "/placeholder.svg"}
                        alt={craftsman.companyName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{craftsman.companyName}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {craftsman.businessPostalCode} {craftsman.businessCity}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-3 text-sm text-gray-600">{craftsman.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {craftsman.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {craftsman.skills.length > 3 && <Badge variant="outline">+{craftsman.skills.length - 3}</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{craftsman.completedJobs} abgeschlossene Aufträge</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{craftsman.averageRating ? craftsman.averageRating.toFixed(1) : "Neu"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{craftsman.phone}</span>
                  </div>
                  <div className="font-medium">{formatCurrency(craftsman.hourlyRate)}/h</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {pagination.page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(pagination.page - 1)
                  }}
                />
              </PaginationItem>
            )}

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === pagination.page}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pagination.page < pagination.totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(pagination.page + 1)
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
