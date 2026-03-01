// @ts-nocheck
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, DollarSign, Activity, CheckCircle2 } from "lucide-react"

interface AnalyticsDashboardProps {
  role: "client" | "craftsman"
}

export function AnalyticsDashboard({ role }: AnalyticsDashboardProps) {
  // Mock data - would come from actual analytics
  const clientStats = {
    totalSpent: 12500,
    activeJobs: 3,
    completedJobs: 8,
    avgResponseTime: "2.3 Stunden",
    satisfactionRate: 94,
  }

  const craftsmanStats = {
    totalEarned: 25600,
    activeJobs: 5,
    completedJobs: 23,
    avgResponseTime: "1.8 Stunden",
    winRate: 68,
  }

  const stats = role === "client" ? clientStats : craftsmanStats

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{role === "client" ? "Ausgegeben" : "Verdient"}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{role === "client" ? stats.totalSpent : (stats as typeof craftsmanStats).totalEarned}
            </div>
            <p className="text-xs text-muted-foreground">+12% vom letzten Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Aufträge</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">In Bearbeitung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">Gesamt erfolgreich</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{role === "client" ? "Zufriedenheit" : "Erfolgsrate"}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === "client" ? `${stats.satisfactionRate}%` : `${(stats as typeof craftsmanStats).winRate}%`}
            </div>
            <p className="text-xs text-muted-foreground">Durchschnittlich</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leistungsübersicht</CardTitle>
          <CardDescription>Ihre Aktivität und Performance der letzten 30 Tage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-4" />
            <p className="text-sm">Detaillierte Charts kommen bald...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
