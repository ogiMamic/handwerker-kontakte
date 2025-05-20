"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  PlusCircle,
  BarChart3,
  Briefcase,
  FileText,
  Users,
  AlertCircle,
  PenToolIcon as Tool,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Locale } from "@/lib/i18n-config"

interface DashboardUser {
  id: string
  name: string
  email: string
  type: string
}

interface Job {
  id: string
  title: string
  category: string
  description: string
  budget: number
  deadline: Date
  status: string
  offerCount?: number
  createdAt: Date
}

interface Offer {
  id: string
  jobId: string
  jobTitle?: string
  craftsmanId?: string
  craftsmanName?: string
  craftsmanImageUrl?: string
  companyName?: string
  amount: number
  hourlyRate?: number
  description: string
  estimatedDuration?: number
  status: string
  createdAt: Date
}

interface CraftsmanProfile {
  id: string
  userId: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  description: string
  skills: string[]
  hourlyRate: number
  isVerified: boolean
}

interface Metrics {
  totalJobs: number
  openJobs: number
  totalOffers: number
  pendingOffers: number
}

interface DashboardProps {
  user: DashboardUser | null
  jobs: Job[]
  offers: Offer[]
  craftsmanProfile: CraftsmanProfile | null
  craftsmanJobs: Job[]
  craftsmanOffers: Offer[]
  metrics: Metrics
  lang: Locale
}

export function Dashboard({
  user,
  jobs,
  offers,
  craftsmanProfile,
  craftsmanJobs,
  craftsmanOffers,
  metrics,
  lang,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [viewMode, setViewMode] = useState<"client" | "craftsman">(user?.type === "CRAFTSMAN" ? "craftsman" : "client")
  const router = useRouter()
  const { toast } = useToast()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {lang === "de" ? "Offen" : "Open"}
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {lang === "de" ? "In Bearbeitung" : "In Progress"}
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {lang === "de" ? "Abgeschlossen" : "Completed"}
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {lang === "de" ? "Storniert" : "Cancelled"}
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
            {lang === "de" ? "Ausstehend" : "Pending"}
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {lang === "de" ? "Angenommen" : "Accepted"}
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {lang === "de" ? "Abgelehnt" : "Rejected"}
          </Badge>
        )
      case "WITHDRAWN":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {lang === "de" ? "Zurückgezogen" : "Withdrawn"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleModeToggle = (checked: boolean) => {
    if (checked) {
      if (!craftsmanProfile) {
        toast({
          title: lang === "de" ? "Handwerkerprofil fehlt" : "Craftsman profile missing",
          description:
            lang === "de"
              ? "Sie müssen zuerst ein Handwerkerprofil erstellen, um in den Handwerker-Modus zu wechseln."
              : "You need to create a craftsman profile first to switch to craftsman mode.",
          variant: "destructive",
        })
        return
      }
      setViewMode("craftsman")
    } else {
      setViewMode("client")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{lang === "de" ? "Dashboard" : "Dashboard"}</h1>
          <p className="text-gray-500">
            {lang === "de" ? "Verwalten Sie Ihre Projekte und Angebote" : "Manage your projects and offers"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {user?.type === "CRAFTSMAN" && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="mode-toggle" className="text-sm">
                {lang === "de" ? "Handwerker-Modus" : "Craftsman Mode"}
              </Label>
              <Switch id="mode-toggle" checked={viewMode === "craftsman"} onCheckedChange={handleModeToggle} />
            </div>
          )}
          {viewMode === "client" ? (
            <Button asChild>
              <Link href={`/${lang}/client/auftrag-erstellen`}>
                {lang === "de" ? "Neuen Auftrag erstellen" : "Create New Job"}
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/${lang}/handwerker/auftraege`}>
                {lang === "de" ? "Aufträge durchsuchen" : "Browse Jobs"}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {user?.type === "CRAFTSMAN" && !craftsmanProfile && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{lang === "de" ? "Handwerkerprofil fehlt" : "Craftsman profile missing"}</AlertTitle>
          <AlertDescription>
            {lang === "de"
              ? "Sie haben noch kein Handwerkerprofil erstellt. Erstellen Sie jetzt ein Profil, um Aufträge zu erhalten."
              : "You haven't created a craftsman profile yet. Create a profile now to receive jobs."}
            <div className="mt-4">
              <Button asChild>
                <Link href={`/${lang}/handwerker/registrieren`}>
                  {lang === "de" ? "Profil erstellen" : "Create Profile"}
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{lang === "de" ? "Übersicht" : "Overview"}</TabsTrigger>
          <TabsTrigger value="jobs">
            {viewMode === "client"
              ? lang === "de"
                ? "Meine Aufträge"
                : "My Jobs"
              : lang === "de"
                ? "Meine Projekte"
                : "My Projects"}
          </TabsTrigger>
          <TabsTrigger value="offers">
            {viewMode === "client"
              ? lang === "de"
                ? "Angebote"
                : "Offers"
              : lang === "de"
                ? "Meine Angebote"
                : "My Offers"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {viewMode === "client"
                    ? lang === "de"
                      ? "Aufträge gesamt"
                      : "Total Jobs"
                    : lang === "de"
                      ? "Projekte gesamt"
                      : "Total Projects"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-2xl font-bold">{metrics.totalJobs || 0}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {viewMode === "client"
                    ? lang === "de"
                      ? "Offene Aufträge"
                      : "Open Jobs"
                    : lang === "de"
                      ? "Laufende Projekte"
                      : "Active Projects"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2" />
                  <div className="text-2xl font-bold">{metrics.openJobs || 0}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {viewMode === "client"
                    ? lang === "de"
                      ? "Angebote gesamt"
                      : "Total Offers"
                    : lang === "de"
                      ? "Angebote gesamt"
                      : "Total Offers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  <div className="text-2xl font-bold">{metrics.totalOffers || 0}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {viewMode === "client"
                    ? lang === "de"
                      ? "Ausstehende Angebote"
                      : "Pending Offers"
                    : lang === "de"
                      ? "Ausstehende Angebote"
                      : "Pending Offers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                  <div className="text-2xl font-bold">{metrics.pendingOffers || 0}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {viewMode === "client"
                    ? lang === "de"
                      ? "Neueste Aufträge"
                      : "Recent Jobs"
                    : lang === "de"
                      ? "Neueste Projekte"
                      : "Recent Projects"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === "client" ? (
                  jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        {lang === "de"
                          ? "Sie haben noch keine Aufträge erstellt."
                          : "You haven't created any jobs yet."}
                      </p>
                      <Button asChild>
                        <Link href={`/${lang}/client/auftrag-erstellen`}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          {lang === "de" ? "Auftrag erstellen" : "Create Job"}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                          <div>
                            <div className="font-medium">{job.title}</div>
                            <div className="text-sm text-gray-500">{formatDate(job.deadline)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(job.status)}
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/${lang}/client/auftrag/${job.id}`}>
                                {lang === "de" ? "Ansehen" : "View"}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : craftsmanJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      {lang === "de"
                        ? "Sie haben noch keine Projekte angenommen."
                        : "You haven't accepted any projects yet."}
                    </p>
                    <Button asChild>
                      <Link href={`/${lang}/handwerker/auftraege`}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        {lang === "de" ? "Aufträge durchsuchen" : "Browse Jobs"}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {craftsmanJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                        <div>
                          <div className="font-medium">{job.title}</div>
                          <div className="text-sm text-gray-500">{formatDate(job.deadline)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/${lang}/handwerker/projekt/${job.id}`}>
                              {lang === "de" ? "Ansehen" : "View"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={viewMode === "client" ? `/${lang}/client/auftraege` : `/${lang}/handwerker/projekte`}>
                    {lang === "de" ? "Alle anzeigen" : "View All"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {viewMode === "client"
                    ? lang === "de"
                      ? "Neueste Angebote"
                      : "Recent Offers"
                    : lang === "de"
                      ? "Meine Angebote"
                      : "My Offers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === "client" ? (
                  offers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {lang === "de"
                          ? "Sie haben noch keine Angebote erhalten."
                          : "You haven't received any offers yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {offers.slice(0, 3).map((offer) => (
                        <div key={offer.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                          <div>
                            <div className="font-medium">{offer.jobTitle}</div>
                            <div className="text-sm text-gray-500">{offer.companyName}</div>
                            <div className="text-sm font-medium">{formatCurrency(offer.amount)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getOfferStatusBadge(offer.status)}
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/${lang}/client/angebot/${offer.id}`}>
                                {lang === "de" ? "Ansehen" : "View"}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : craftsmanOffers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      {lang === "de"
                        ? "Sie haben noch keine Angebote abgegeben."
                        : "You haven't submitted any offers yet."}
                    </p>
                    <Button asChild>
                      <Link href={`/${lang}/handwerker/auftraege`}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        {lang === "de" ? "Aufträge durchsuchen" : "Browse Jobs"}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {craftsmanOffers.slice(0, 3).map((offer) => (
                      <div key={offer.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                        <div>
                          <div className="font-medium">{offer.jobTitle}</div>
                          <div className="text-sm font-medium">{formatCurrency(offer.amount)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getOfferStatusBadge(offer.status)}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/${lang}/handwerker/angebot/${offer.id}`}>
                              {lang === "de" ? "Ansehen" : "View"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={viewMode === "client" ? `/${lang}/client/angebote` : `/${lang}/handwerker/angebote`}>
                    {lang === "de" ? "Alle anzeigen" : "View All"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{lang === "de" ? "Schnellzugriff" : "Quick Access"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {viewMode === "client" ? (
                    <>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/client/auftrag-erstellen`}>
                          <PlusCircle className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Auftrag erstellen" : "Create Job"}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/client/auftraege`}>
                          <Briefcase className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Aufträge verwalten" : "Manage Jobs"}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/client/angebote`}>
                          <FileText className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Angebote ansehen" : "View Offers"}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/handwerker`}>
                          <Users className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Handwerker finden" : "Find Craftsmen"}</span>
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/handwerker/auftraege`}>
                          <Briefcase className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Aufträge durchsuchen" : "Browse Jobs"}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/handwerker/projekte`}>
                          <Tool className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Meine Projekte" : "My Projects"}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/handwerker/angebote`}>
                          <FileText className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Meine Angebote" : "My Offers"}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                        asChild
                      >
                        <Link href={`/${lang}/handwerker/profil`}>
                          <Tool className="h-8 w-8 mb-2" />
                          <span>{lang === "de" ? "Mein Profil" : "My Profile"}</span>
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          {viewMode === "client" ? (
            jobs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium">{lang === "de" ? "Noch keine Aufträge" : "No jobs yet"}</h3>
                <p className="text-gray-500 mt-2">
                  {lang === "de"
                    ? "Erstellen Sie Ihren ersten Auftrag, um loszulegen"
                    : "Create your first job to get started"}
                </p>
                <Button className="mt-4" asChild>
                  <Link href={`/${lang}/client/auftrag-erstellen`}>
                    {lang === "de" ? "Auftrag erstellen" : "Create Job"}
                  </Link>
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
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {lang === "de" ? "Frist" : "Deadline"}: {formatDate(job.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {lang === "de" ? "Erstellt" : "Posted"}: {formatDate(job.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center font-medium">
                          <span>
                            {lang === "de" ? "Budget" : "Budget"}: {formatCurrency(job.budget)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-500">
                          {job.offerCount}{" "}
                          {job.offerCount === 1
                            ? lang === "de"
                              ? "Angebot"
                              : "offer"
                            : lang === "de"
                              ? "Angebote"
                              : "offers"}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${lang}/chat/${job.id}`}>
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {lang === "de" ? "Chat" : "Chat"}
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/${lang}/client/auftrag/${job.id}`}>{lang === "de" ? "Ansehen" : "View"}</Link>
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )
          ) : craftsmanJobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">{lang === "de" ? "Noch keine Projekte" : "No projects yet"}</h3>
              <p className="text-gray-500 mt-2">
                {lang === "de"
                  ? "Durchsuchen Sie verfügbare Aufträge und geben Sie Angebote ab"
                  : "Browse available jobs and submit offers"}
              </p>
              <Button className="mt-4" asChild>
                <Link href={`/${lang}/handwerker/auftraege`}>
                  {lang === "de" ? "Aufträge durchsuchen" : "Browse Jobs"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {craftsmanJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription className="capitalize">{job.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {lang === "de" ? "Frist" : "Deadline"}: {formatDate(job.deadline)}
                        </span>
                      </div>
                      <div className="flex items-center font-medium">
                        <span>
                          {lang === "de" ? "Budget" : "Budget"}: {formatCurrency(job.budget)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-end items-center w-full gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/${lang}/chat/${job.id}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {lang === "de" ? "Chat" : "Chat"}
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/${lang}/handwerker/projekt/${job.id}`}>{lang === "de" ? "Ansehen" : "View"}</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          {viewMode === "client" ? (
            offers.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium">{lang === "de" ? "Noch keine Angebote" : "No offers yet"}</h3>
                <p className="text-gray-500 mt-2">
                  {lang === "de"
                    ? "Sie erhalten hier Angebote, wenn Handwerker auf Ihre Aufträge antworten"
                    : "You'll receive offers here when craftsmen respond to your jobs"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{offer.jobTitle}</CardTitle>
                          <CardDescription>
                            {lang === "de" ? "Angebot von" : "Offer from"} {offer.companyName}
                          </CardDescription>
                        </div>
                        {getOfferStatusBadge(offer.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={offer.craftsmanImageUrl || "/placeholder.svg"} />
                          <AvatarFallback>{offer.craftsmanName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{offer.craftsmanName}</div>
                          <div className="text-sm text-gray-500">
                            {lang === "de" ? "Stundensatz" : "Hourly rate"}: {formatCurrency(offer.hourlyRate || 0)}/h
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm">{offer.description}</p>

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
                          <div>
                            <span className="font-medium">{lang === "de" ? "Angebotsbetrag" : "Offer amount"}:</span>{" "}
                            {formatCurrency(offer.amount)}
                          </div>
                          <div>
                            <span className="font-medium">
                              {lang === "de" ? "Geschätzte Dauer" : "Estimated duration"}:
                            </span>{" "}
                            {offer.estimatedDuration} {lang === "de" ? "Tage" : "days"}
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {lang === "de" ? "Erhalten" : "Received"}: {formatDate(offer.createdAt)}
                        </div>
                      </div>
                    </CardContent>

                    {offer.status === "PENDING" && (
                      <CardFooter className="pt-0">
                        <div className="flex justify-end gap-2 w-full">
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <XCircle className="h-4 w-4 mr-1" />
                            {lang === "de" ? "Ablehnen" : "Decline"}
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {lang === "de" ? "Annehmen" : "Accept"}
                          </Button>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )
          ) : craftsmanOffers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">
                {lang === "de" ? "Noch keine Angebote abgegeben" : "No offers submitted yet"}
              </h3>
              <p className="text-gray-500 mt-2">
                {lang === "de"
                  ? "Durchsuchen Sie verfügbare Aufträge und geben Sie Angebote ab"
                  : "Browse available jobs and submit offers"}
              </p>
              <Button className="mt-4" asChild>
                <Link href={`/${lang}/handwerker/auftraege`}>
                  {lang === "de" ? "Aufträge durchsuchen" : "Browse Jobs"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {craftsmanOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{offer.jobTitle}</CardTitle>
                        <CardDescription>
                          {offer.category} - {offer.postalCode} {offer.city}
                        </CardDescription>
                      </div>
                      {getOfferStatusBadge(offer.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <p className="text-sm">{offer.description}</p>

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
                        <div>
                          <span className="font-medium">{lang === "de" ? "Angebotsbetrag" : "Offer amount"}:</span>{" "}
                          {formatCurrency(offer.amount)}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {lang === "de" ? "Abgegeben" : "Submitted"}: {formatDate(offer.createdAt)}
                      </div>
                    </div>
                  </CardContent>

                  {offer.status === "PENDING" && (
                    <CardFooter className="pt-0">
                      <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="h-4 w-4 mr-1" />
                          {lang === "de" ? "Zurückziehen" : "Withdraw"}
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/${lang}/chat/${offer.jobId}`}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {lang === "de" ? "Nachricht senden" : "Send Message"}
                          </Link>
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
