"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Crown, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import type { SubscriptionPlan, UserRole } from "@/lib/subscription/plans"
import { CLIENT_PLANS, CRAFTSMAN_PLANS } from "@/lib/subscription/plans"

interface SubscriptionCardProps {
  plan: SubscriptionPlan
  role: UserRole
  offersUsed?: number
  jobsPosted?: number
  lang: string
}

export function SubscriptionCard({ plan, role, offersUsed = 0, jobsPosted = 0, lang }: SubscriptionCardProps) {
  const planInfo = role === "client" ? CLIENT_PLANS[plan] : CRAFTSMAN_PLANS[plan]
  const commission = role === "craftsman" ? CRAFTSMAN_PLANS[plan].commission : null

  const getMaxOffers = () => {
    if (role === "craftsman") {
      const limit = CRAFTSMAN_PLANS[plan].features.monthlyOfferLimit
      return limit === "unlimited" ? null : limit
    }
    return null
  }

  const maxOffers = getMaxOffers()
  const offersPercentage = maxOffers ? (offersUsed / maxOffers) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {plan !== "free" && <Crown className="h-5 w-5 text-amber-500" />}
              {planInfo.name} Plan
            </CardTitle>
            <CardDescription>{plan === "free" ? "Kostenlos" : `${planInfo.price}€ pro Monat`}</CardDescription>
          </div>
          <Badge variant={plan === "free" ? "secondary" : "default"}>
            {plan === "free" ? "Basis" : plan === "premium" ? "Premium" : "Business"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {role === "craftsman" && commission !== null && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Provision</span>
            </div>
            <span className="text-lg font-bold">{commission}%</span>
          </div>
        )}

        {maxOffers && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monatliche Angebote</span>
              <span className="font-medium">
                {offersUsed} / {maxOffers}
              </span>
            </div>
            <Progress value={offersPercentage} className="h-2" />
            {offersPercentage >= 80 && (
              <p className="text-xs text-amber-600">
                Sie nähern sich Ihrem monatlichen Limit. Erwägen Sie ein Upgrade.
              </p>
            )}
          </div>
        )}

        {plan === "free" && (
          <Button asChild className="w-full" variant="default">
            <Link href={`/${lang}/preise`}>
              <Zap className="mr-2 h-4 w-4" />
              Jetzt upgraden
            </Link>
          </Button>
        )}

        {plan !== "free" && (
          <div className="text-xs text-muted-foreground">
            <ul className="space-y-1">
              {role === "craftsman" ? (
                <>
                  <li>✓ Unbegrenzte Angebote</li>
                  <li>✓ Priorisierte Platzierung</li>
                  <li>✓ Erweiterte Filter</li>
                  {plan === "business" && <li>✓ Team-Management</li>}
                </>
              ) : (
                <>
                  <li>✓ Unbegrenzte Angebote pro Auftrag</li>
                  <li>✓ Priorisierte Platzierung</li>
                  <li>✓ Erweiterte Filter</li>
                  {plan === "business" && <li>✓ Mehrere Benutzer</li>}
                </>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
