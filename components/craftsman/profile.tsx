"use client"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CraftsmanGallery } from "./craftsman-gallery"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Star, Crown, Clock, CalendarIcon, Shield, Building2, Euro } from "lucide-react"
import { BookingDialog } from "./booking-dialog"

// Define the form schema
const profileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person name must be at least 2 characters"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z.string().min(20, "Description must be at least 20 characters"),
  serviceRadius: z.coerce.number().min(1, "Service radius must be at least 1 km"),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be at least 1"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
})

const businessSchema = z.object({
  businessLicense: z.string().min(1, "Business license is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  businessAddress: z.string().min(5, "Business address must be at least 5 characters"),
  businessCity: z.string().min(2, "City must be at least 2 characters"),
  businessPostalCode: z.string().regex(/^\d{5}$/, "Please enter a valid postal code (5 digits)"),
  foundingYear: z.coerce
    .number()
    .min(1900, "Please enter a valid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  insuranceProvider: z.string().min(1, "Insurance provider is required"),
  insurancePolicyNumber: z.string().min(1, "Insurance policy number is required"),
})

const availabilitySchema = z.object({
  availableDays: z.array(z.string()),
  workHoursStart: z.string(),
  workHoursEnd: z.string(),
  vacationDates: z.array(z.date()).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type BusinessFormValues = z.infer<typeof businessSchema>
type AvailabilityFormValues = z.infer<typeof availabilitySchema>

const skillOptions = [
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical" },
  { id: "carpentry", label: "Carpentry" },
  { id: "painting", label: "Painting" },
  { id: "flooring", label: "Flooring" },
  { id: "roofing", label: "Roofing" },
  { id: "landscaping", label: "Landscaping" },
  { id: "masonry", label: "Masonry" },
  { id: "hvac", label: "HVAC" },
  { id: "tiling", label: "Tiling" },
]

const dayOptions = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

interface CraftsmanProfileProps {
  craftsman: any
  dictionary: any
}

export function CraftsmanProfile({ craftsman, dictionary }: CraftsmanProfileProps) {
  const [showBooking, setShowBooking] = useState(false)

  const workHours =
    craftsman.workHoursStart && craftsman.workHoursEnd
      ? `${craftsman.workHoursStart} - ${craftsman.workHoursEnd}`
      : "Nach Vereinbarung"

  const availableDaysMap: Record<string, string> = {
    monday: "Mo",
    tuesday: "Di",
    wednesday: "Mi",
    thursday: "Do",
    friday: "Fr",
    saturday: "Sa",
    sunday: "So",
  }

  const formattedDays = (craftsman.availableDays || [])
    .map((day: string) => availableDaysMap[day.toLowerCase()] || day)
    .join(", ")

  return (
    <div className="container mx-auto px-2 md:px-6 py-4 md:py-8 max-w-6xl">
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
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{craftsman.name || craftsman.companyName}</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm md:text-base text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{craftsman.city || craftsman.businessCity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{craftsman.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{craftsman.rating || craftsman.averageRating || "5.0"}</span>
                  </div>
                  <span className="text-muted-foreground">|</span>
                  <span className="font-medium text-green-600">€{craftsman.hourlyRate}/Std</span>
                </div>
              </div>

              {craftsman.isSponsored && (
                <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Gesponsert
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-4 text-sm md:text-base">{craftsman.bio || craftsman.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(craftsman.skills || []).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            <Button size="lg" className="w-full md:w-auto" onClick={() => setShowBooking(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Jetzt kontaktieren
            </Button>
          </div>
        </div>
      </div>

      {craftsman.portfolio && craftsman.portfolio.length > 0 && (
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 px-0">Galerie meiner Arbeiten</h2>
          <CraftsmanGallery portfolio={craftsman.portfolio} />
        </div>
      )}

      <Card className="mb-4 md:mb-6">
        <CardContent className="p-3 md:p-6">
          {/* Business Information Section */}
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
                <span className="text-muted-foreground">Adresse:</span>
                <p className="font-medium">
                  {craftsman.businessAddress}
                  <br />
                  {craftsman.businessPostalCode} {craftsman.businessCity}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Gründungsjahr:</span>
                <p className="font-medium">{craftsman.foundingYear}</p>
              </div>
              {craftsman.website && (
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Website:</span>
                  <p className="font-medium">
                    <a
                      href={craftsman.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {craftsman.website}
                    </a>
                  </p>
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

          {/* Insurance Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Versicherung & Zertifizierung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Versicherungsanbieter:</span>
                <p className="font-medium">{craftsman.insuranceProvider}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Policennummer:</span>
                <p className="font-medium">{craftsman.insurancePolicyNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Steuernummer:</span>
                <p className="font-medium">{craftsman.taxId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gewerbeschein:</span>
                <p className="font-medium">{craftsman.businessLicense}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4 md:p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Termin vereinbaren</h3>
          <p className="text-muted-foreground mb-4">
            Buchen Sie jetzt einen Termin und erhalten Sie eine Bestätigung per SMS
          </p>
          <Button size="lg" className="w-full md:w-auto" onClick={() => setShowBooking(true)}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Jetzt Termin buchen
          </Button>
        </CardContent>
      </Card>

      <BookingDialog open={showBooking} onOpenChange={setShowBooking} craftsman={craftsman} />
    </div>
  )
}
