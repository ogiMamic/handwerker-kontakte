"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { JobStatsCard } from "@/components/client/job-stats-card"
import { Calendar, MapPin, Euro, FileText } from "lucide-react"

interface Job {
  id: string
  title: string
  category: string
  customCategory?: string
  description: string
  postalCode: string
  city: string
  address: string
  budget: number
  deadline: Date
  status: string
  images?: string[]
  notifiedCount?: number
  viewedCount?: number
  interestedCount?: number
  offerCount?: number
}

interface JobDetailWithStatsProps {
  job: Job
}

export function JobDetailWithStats({ job }: JobDetailWithStatsProps) {
  const categoryDisplay = job.category === "other" && job.customCategory ? job.customCategory : job.category

  return (
    <div className="space-y-6">
      {/* Main Job Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="capitalize">
                  {categoryDisplay}
                </Badge>
                <Badge
                  variant={job.status === "OPEN" ? "default" : job.status === "IN_PROGRESS" ? "secondary" : "outline"}
                >
                  {job.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Beschreibung
            </h3>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>

          <Separator />

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Standort:</span>
                <span className="text-muted-foreground">
                  {job.city}, {job.postalCode}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Frist:</span>
                <span className="text-muted-foreground">{new Date(job.deadline).toLocaleDateString("de-DE")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Budget:</span>
                <span className="text-muted-foreground">€{job.budget.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Images */}
          {job.images && job.images.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-3">Bilder</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {job.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Job image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <JobStatsCard jobId={job.id} />

      {/* Activity Timeline */}
      {job.notifiedCount && job.notifiedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktivität</CardTitle>
            <CardDescription>Verfolgen Sie den Fortschritt Ihres Auftrags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Auftrag erstellt</p>
                  <p className="text-sm text-muted-foreground">
                    Ihr Auftrag wurde erfolgreich an {job.notifiedCount} Handwerker gesendet
                  </p>
                </div>
              </div>

              {job.viewedCount && job.viewedCount > 0 && (
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-blue-600 text-sm font-bold">👁</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Handwerker interessiert</p>
                    <p className="text-sm text-muted-foreground">
                      {job.viewedCount} Handwerker haben Ihren Auftrag angesehen
                    </p>
                  </div>
                </div>
              )}

              {job.offerCount && job.offerCount > 0 && (
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <span className="text-purple-600 text-sm font-bold">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Angebote erhalten</p>
                    <p className="text-sm text-muted-foreground">
                      Sie haben {job.offerCount} Angebot{job.offerCount !== 1 ? "e" : ""} erhalten
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
