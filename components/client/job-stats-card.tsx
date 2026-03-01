// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Bell, Heart, FileText } from "lucide-react"
import { getJobStats } from "@/lib/actions/job-tracking-actions"

interface JobStatsCardProps {
  jobId: string
}

export function JobStatsCard({ jobId }: JobStatsCardProps) {
  const [stats, setStats] = useState({
    notifiedCount: 0,
    viewedCount: 0,
    interestedCount: 0,
    offerCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getJobStats(jobId)
        setStats(data)
      } catch (error) {
        console.error("Error loading job stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000)

    return () => clearInterval(interval)
  }, [jobId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auftrag Statistiken</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Lade Statistiken...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auftrag Statistiken</CardTitle>
        <CardDescription>Sehen Sie, wie viele Handwerker Ihren Auftrag gesehen haben</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.notifiedCount}</p>
              <p className="text-sm text-muted-foreground">Benachrichtigt</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.viewedCount}</p>
              <p className="text-sm text-muted-foreground">Angesehen</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Heart className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.interestedCount}</p>
              <p className="text-sm text-muted-foreground">Interessiert</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.offerCount}</p>
              <p className="text-sm text-muted-foreground">Angebote</p>
            </div>
          </div>
        </div>

        {stats.notifiedCount > 0 && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-900">
              Ihr Auftrag wurde an <strong>{stats.notifiedCount}</strong> passende Handwerker gesendet.
              {stats.viewedCount > 0 && (
                <span>
                  {" "}
                  <strong>{stats.viewedCount}</strong> haben ihn bereits angesehen.
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
