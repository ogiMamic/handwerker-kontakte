"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Calendar, MapPin, Search, User } from "lucide-react"

interface Job {
  id: string
  title: string
  category: string
  description: string
  postalCode: string
  city: string
  budget: number
  deadline: Date
  clientName: string
  clientImageUrl: string | null
  offerCount: number
  createdAt: Date
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

interface JobListProps {
  jobs: Job[]
  pagination: PaginationInfo
}

const JOB_CATEGORIES = [
  { value: "all", label: "Alle Kategorien" },
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

export function JobList({ jobs, pagination }: JobListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState(searchParams.get("category") || "all")

  // Standardmäßig deutsche Routen verwenden
  const locale = pathname.split("/")[1] || "de"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementiere die Suche hier
    console.log("Searching for:", searchTerm)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)

    // Update URL with new category
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    params.set("page", "1") // Reset to first page
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Suche nach Aufträgen..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            {JOB_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Keine Aufträge gefunden.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link href={`/${locale}/auftraege/${job.id}`} key={job.id}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {job.postalCode} {job.city}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-3 text-sm text-gray-600">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant="outline">{job.offerCount} Angebote</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-200">
                      {job.clientImageUrl ? (
                        <Image
                          src={job.clientImageUrl || "/placeholder.svg"}
                          alt={job.clientName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm">{job.clientName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>bis {formatDate(job.deadline)}</span>
                  </div>
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
