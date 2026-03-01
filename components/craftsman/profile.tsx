"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CraftsmanGallery } from "./craftsman-gallery"
import { Badge } from "@/components/ui/badge"
import {
  MapPin, Phone, Mail, Star, Crown, Clock, CalendarIcon,
  Shield, Building2, Euro, MessageCircle, Lock, ExternalLink
} from "lucide-react"

interface CraftsmanProfileProps {
  craftsman: any
  dictionary: any
}

export function CraftsmanProfile({ craftsman, dictionary }: CraftsmanProfileProps) {
  // Determine if craftsman has premium (check subscription or sponsored status)
  const isPremium = craftsman.isSponsored || craftsman.subscriptionPlan === "premium" || craftsman.subscriptionPlan === "business" || craftsman.isPremium

  const workHours =
    craftsman.workHoursStart && craftsman.workHoursEnd
      ? `${craftsman.workHoursStart} - ${craftsman.workHoursEnd}`
      : "Nach Vereinbarung"

  const availableDaysMap: Record<string, string> = {
    monday: "Mo", tuesday: "Di", wednesday: "Mi", thursday: "Do",
    friday: "Fr", saturday: "Sa", sunday: "So",
  }

  const formattedDays = (craftsman.availableDays || [])
    .map((day: string) => availableDaysMap[day.toLowerCase()] || day)
    .join(", ")

  // Format phone for WhatsApp link (remove spaces, +, etc)
  const whatsappNumber = craftsman.phone?.replace(/[\s\-\+\(\)]/g, "") || ""
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hallo! Ich habe Ihr Profil auf Handwerker-Kontakte gesehen und hätte eine Anfrage.")}`

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-muted mx-auto md:mx-0">
              <img
                src={craftsman.profileImage || craftsman.imageUrl || "/placeholder.svg?height=128&width=128"}
                alt={craftsman.name || craftsman.companyName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{craftsman.name || craftsman.companyName}</h1>
                  {isPremium && (
                    <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {craftsman.isVerified && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Verifiziert
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm md:text-base text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{craftsman.businessPostalCode} {craftsman.city || craftsman.businessCity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    <span className="font-medium text-green-600">€{craftsman.hourlyRate}/Std</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{craftsman.rating || craftsman.averageRating || "5.0"}</span>
                  </div>
                  {craftsman.completedJobs > 0 && (
                    <>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-sm text-muted-foreground">{craftsman.completedJobs} abgeschlossene Aufträge</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4 text-sm md:text-base">{craftsman.bio || craftsman.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(craftsman.skills || []).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            {/* CONTACT SECTION — Premium only */}
            {isPremium ? (
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href={`tel:${craftsman.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {craftsman.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                {craftsman.email && (
                  <Button size="lg" variant="outline" asChild>
                    <a href={`mailto:${craftsman.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      E-Mail
                    </a>
                  </Button>
                )}
                {craftsman.website && (
                  <Button size="lg" variant="outline" asChild>
                    <a href={craftsman.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Kontaktdaten nur mit Premium sichtbar</p>
                    <p className="text-sm text-gray-500 mb-3">
                      Dieser Handwerker nutzt den kostenlosen Tarif. Telefon, E-Mail und WhatsApp sind nur für Premium-Handwerker verfügbar.
                    </p>
                    <p className="text-xs text-gray-400">
                      Sie sind Handwerker? <a href="/de/preise" className="text-primary underline">Jetzt Premium werden</a> und von Kunden direkt kontaktiert werden.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Gallery */}
      {isPremium && craftsman.portfolio && craftsman.portfolio.length > 0 && (
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Galerie meiner Arbeiten</h2>
          <CraftsmanGallery portfolio={craftsman.portfolio} />
        </div>
      )}

      {/* Business Info Card */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="p-3 md:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unternehmensinformationen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Firma:</span>
                <p className="font-medium">{craftsman.companyName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ansprechpartner:</span>
                <p className="font-medium">{craftsman.contactPerson}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Standort:</span>
                <p className="font-medium">
                  {craftsman.businessPostalCode} {craftsman.businessCity}
                </p>
              </div>
              {craftsman.foundingYear && (
                <div>
                  <span className="text-muted-foreground">Gründungsjahr:</span>
                  <p className="font-medium">{craftsman.foundingYear}</p>
                </div>
              )}
            </div>
          </div>

          {/* Availability Section */}
          <div className="mb-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Verfügbarkeit
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Verfügbare Tage:</span>
                <p className="font-medium">{formattedDays || "Nach Vereinbarung"}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Arbeitszeiten:
                </span>
                <p className="font-medium">{workHours}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Euro className="h-4 w-4" />
                  Stundensatz:
                </span>
                <p className="font-medium text-green-600 text-base">€{craftsman.hourlyRate}/Stunde</p>
              </div>
              <div>
                <span className="text-muted-foreground">Einsatzradius:</span>
                <p className="font-medium">{craftsman.serviceRadius || 20} km</p>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          {craftsman.isVerified && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Versicherung & Zertifizierung
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {craftsman.insuranceProvider && (
                  <div>
                    <span className="text-muted-foreground">Versicherungsanbieter:</span>
                    <p className="font-medium">{craftsman.insuranceProvider}</p>
                  </div>
                )}
                {craftsman.businessLicense && (
                  <div>
                    <span className="text-muted-foreground">Gewerbeschein:</span>
                    <p className="font-medium">✓ Vorhanden</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA for non-premium — nudge craftsman to upgrade */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4 md:p-6 text-center">
            <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold mb-2">Mehr Kunden erreichen?</h3>
            <p className="text-muted-foreground mb-4">
              Mit einem Premium-Profil werden Ihre Kontaktdaten sichtbar und Sie erscheinen weiter oben in den Suchergebnissen.
            </p>
            <Button size="lg" asChild>
              <a href="/de/preise">
                Ab €14,99/Monat — Jetzt upgraden
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CTA for premium */}
      {isPremium && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 md:p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Interesse an diesem Handwerker?</h3>
            <p className="text-muted-foreground mb-4">
              Kontaktieren Sie {craftsman.companyName || craftsman.name} direkt — kostenlos und unverbindlich.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <a href={`tel:${craftsman.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Anrufen
                </a>
              </Button>
              <Button size="lg" variant="outline" className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
