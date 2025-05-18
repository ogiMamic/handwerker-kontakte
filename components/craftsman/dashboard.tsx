"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageSquare, XCircle } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

interface Job {
  id: string
  title: string
  category: string
  description: string
  budget: number
  deadline: Date
  status: string
  clientName: string
  clientImageUrl?: string
  createdAt: Date
}

interface Offer {
  id: string
  jobId: string
  jobTitle: string
  jobStatus: string
  clientName: string
  amount: number
  description: string
  estimatedDuration: number
  status: string
  createdAt: Date
}

interface CraftsmanDashboardProps {
  jobs: Job[]
  offers: Offer[]
}

export function CraftsmanDashboard({ jobs, offers }: CraftsmanDashboardProps) {
  const [activeTab, setActiveTab] = useState("jobs")
  const router = useRouter()
  const { locale } = useI18n()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Offen
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            In Bearbeitung
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Abgeschlossen
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Storniert
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOfferStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Ausstehend
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Angenommen
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Abgelehnt
          </Badge>
        )
      case "WITHDRAWN":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Zurückgezogen
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Handwerker Dashboard</h1>
          <p className="text-gray-500">Verwalten Sie Ihre Aufträge und Angebote</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/handwerker/auftraege`}>Verfügbare Aufträge</Link>
        </Button>
      </div>

      <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Meine Aufträge ({jobs.length})</TabsTrigger>
          <TabsTrigger value="offers">Meine Angebote ({offers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">Noch keine Aufträge</h3>
              <p className="text-gray-500 mt-2">Suchen Sie nach verfügbaren Aufträgen und geben Sie Angebote ab</p>
              <Button className="mt-4" asChild>
                <Link href={`/${locale}/handwerker/auftraege`}>Aufträge durchsuchen</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription className="capitalize">{job.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={job.clientImageUrl || "/placeholder.svg"} />
                        <AvatarFallback>{job.clientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{job.clientName}</div>
                        <div className="text-gray-500">Kunde</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Erstellt am: {formatDate(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center font-medium">
                        <span>Budget: €{job.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/${locale}/chat/${job.id}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Chat
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/${locale}/handwerker/auftrag/${job.id}`}>Details</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          {offers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">Noch keine Angebote</h3>
              <p className="text-gray-500 mt-2">Suchen Sie nach verfügbaren Aufträgen und geben Sie Angebote ab</p>
              <Button className="mt-4" asChild>
                <Link href={`/${locale}/handwerker/auftraege`}>Aufträge durchsuchen</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{offer.jobTitle}</CardTitle>
                        <CardDescription>Angebot für {offer.clientName}</CardDescription>
                      </div>
                      {getOfferStatusBadge(offer.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <p className="text-sm">{offer.description}</p>

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
                        <div>
                          <span className="font-medium">Angebotsbetrag:</span> €{offer.amount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Geschätzte Dauer:</span> {offer.estimatedDuration} Tage
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Erstellt am: {formatDate(offer.createdAt)}
                      </div>

                      {offer.jobStatus !== "OPEN" && (
                        <div className="mt-2">
                          <Badge variant="outline" className="capitalize">
                            Auftragsstatus: {offer.jobStatus === "IN_PROGRESS" ? "In Bearbeitung" : offer.jobStatus}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {offer.status === "PENDING" && (
                    <CardFooter className="pt-0">
                      <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="h-4 w-4 mr-1" />
                          Zurückziehen
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/${locale}/auftrag/${offer.jobId}`}>Auftrag ansehen</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
