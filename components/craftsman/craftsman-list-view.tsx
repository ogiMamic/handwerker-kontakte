"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, LayoutGrid, LayoutList, Crown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Locale } from "@/lib/i18n-config"

interface CraftsmanListViewProps {
  craftsmen: any[]
  sponsored: any[]
  dictionary: any
  lang: Locale
}

export function CraftsmanListView({ craftsmen, sponsored, dictionary, lang }: CraftsmanListViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const renderRatingStars = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-400 text-sm">{dictionary.noRatings}</span>

    const fullStars = Math.floor(rating)
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const renderCardView = (craftsman: any, isSponsored = false) => {
    const isPremium = isSponsored || craftsman.subscriptionPlan === "premium" || craftsman.isPremium
    return (
    <Link
      key={craftsman.id}
      href={`/${lang}/handwerker/${craftsman.id}`}
      className="block group"
    >
      <Card className={`overflow-hidden h-full transition-shadow group-hover:shadow-md ${isPremium ? "border-yellow-400 border-2" : ""}`}>
        {isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1">
            <div className="flex items-center gap-1 text-white text-sm font-medium">
              <Crown className="h-4 w-4" />
              <span>Premium</span>
            </div>
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={craftsman.imageUrl || craftsman.profileImage || "/placeholder.svg"} />
              <AvatarFallback>{craftsman.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{craftsman.companyName}</h3>
              <p className="text-sm text-gray-500">{craftsman.name}</p>
            </div>
            {craftsman.isVerified && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Verifiziert
              </Badge>
            )}
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {craftsman.businessPostalCode} {craftsman.businessCity}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-gray-600" />
              <span className="font-medium">
                {new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-US", {
                  style: "currency",
                  currency: "EUR",
                }).format(craftsman.hourlyRate)}
                /Std
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
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

          <div className="flex items-center justify-between mb-3">
            {renderRatingStars(craftsman.averageRating)}
            <span className="text-sm text-gray-500">{craftsman.completedJobs} Aufträge</span>
          </div>

          {isPremium ? (
            <div className="space-y-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs w-full justify-center py-1 mb-2">
                ✓ Direktkontakt verfügbar
              </Badge>
              <div className="w-full text-center text-sm font-medium text-primary py-1.5 rounded-md border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Profil ansehen &amp; kontaktieren
              </div>
            </div>
          ) : (
            <div className="w-full text-center text-sm font-medium py-1.5 rounded-md border border-input group-hover:bg-accent transition-colors">
              Profil ansehen
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )}

  const renderTableView = (allCraftsmen: any[]) => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Handwerker</TableHead>
            <TableHead>Standort</TableHead>
            <TableHead>Fähigkeiten</TableHead>
            <TableHead>Stundensatz</TableHead>
            <TableHead>Bewertung</TableHead>
            <TableHead>Aufträge</TableHead>
            <TableHead className="text-right">Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCraftsmen.map((craftsman) => (
            <TableRow
              key={craftsman.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => window.location.href = `/${lang}/handwerker/${craftsman.id}`}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={craftsman.imageUrl || craftsman.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>{craftsman.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {craftsman.companyName}
                      {craftsman.isSponsored && <Crown className="h-4 w-4 text-yellow-500" />}
                      {craftsman.isVerified && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{craftsman.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {craftsman.businessPostalCode} {craftsman.businessCity}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {craftsman.skills.slice(0, 2).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {craftsman.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{craftsman.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm">
                  {new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-US", {
                    style: "currency",
                    currency: "EUR",
                  }).format(craftsman.hourlyRate)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {craftsman.averageRating ? (
                    <>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm">{craftsman.averageRating.toFixed(1)}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{craftsman.completedJobs}</div>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" asChild>
                  <a href={`/${lang}/handwerker/${craftsman.id}`}>Ansehen</a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ergebnisse ({craftsmen.length + sponsored.length})</h2>
        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="h-4 w-4 mr-2" />
            Karten
          </Button>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <LayoutList className="h-4 w-4 mr-2" />
            Tabelle
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <>
          {sponsored.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Empfohlene Handwerker
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {sponsored.map((craftsman) => renderCardView(craftsman, true))}
              </div>
            </div>
          )}

          {craftsmen.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Alle Handwerker</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {craftsmen.map((craftsman) => renderCardView(craftsman))}
              </div>
            </div>
          )}
        </>
      ) : (
        renderTableView([...sponsored.map((c) => ({ ...c, isSponsored: true })), ...craftsmen])
      )}
    </div>
  )
}
