"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, FileText, MessageSquare } from "lucide-react"

interface UsageStatsCardProps {
  jobsPosted: number
  offersSubmitted: number
  messagesCount: number
  maxJobs?: number | "unlimited"
  maxOffers?: number | "unlimited"
  resetDate: Date
}

export function UsageStatsCard({
  jobsPosted,
  offersSubmitted,
  messagesCount,
  maxJobs = "unlimited",
  maxOffers = "unlimited",
  resetDate,
}: UsageStatsCardProps) {
  const formatResetDate = (date: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "long",
    }).format(date)
  }

  const getPercentage = (used: number, max: number | "unlimited") => {
    if (max === "unlimited") return 0
    return (used / max) * 100
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Monatliche Nutzung
        </CardTitle>
        <CardDescription>Wird zurückgesetzt am {formatResetDate(resetDate)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {maxOffers !== "unlimited" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Angebote abgegeben</span>
              </div>
              <span className="text-sm font-medium">
                {offersSubmitted} / {maxOffers}
              </span>
            </div>
            <Progress value={getPercentage(offersSubmitted, maxOffers)} className="h-2" />
          </div>
        )}

        {maxJobs !== "unlimited" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Aufträge erstellt</span>
              </div>
              <span className="text-sm font-medium">
                {jobsPosted} / {maxJobs}
              </span>
            </div>
            <Progress value={getPercentage(jobsPosted, maxJobs)} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Nachrichten gesendet</span>
            </div>
            <span className="text-sm font-medium">{messagesCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
