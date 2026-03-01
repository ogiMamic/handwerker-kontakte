// @ts-nocheck
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, TrendingUp, Zap, Check, ArrowRight, Users, BarChart3 } from "lucide-react"
import { useState } from "react"
import { upgradeSubscription } from "@/lib/actions/subscription-actions"
import { toast } from "sonner"
import { CLIENT_PLANS, CRAFTSMAN_PLANS, type SubscriptionPlan, type UserRole } from "@/lib/subscription/plans"

interface SubscriptionManagerProps {
  subscription: {
    userId: string
    plan: SubscriptionPlan
    status: string
    role: UserRole
    currentPeriodEnd?: Date
    cancelAtPeriodEnd?: boolean
  } | null
  usage: {
    jobsPosted: number
    offersSubmitted: number
    messagesCount: number
  }
  lang: string
}

export function SubscriptionManager({ subscription, usage, lang }: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(subscription?.role || "client")

  const currentPlan = subscription?.plan || "free"
  const plans = selectedRole === "client" ? CLIENT_PLANS : CRAFTSMAN_PLANS

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    setIsLoading(true)
    try {
      await upgradeSubscription(plan, selectedRole)
      toast.success(`Erfolgreich auf ${plans[plan].name} Plan aktualisiert!`)
      // Reload to show updated subscription
      window.location.reload()
    } catch (error) {
      toast.error("Fehler beim Aktualisieren des Plans")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentPlan !== "free" && <Crown className="h-5 w-5 text-amber-500" />}
                Aktuelles Abonnement: {plans[currentPlan].name}
              </CardTitle>
              <CardDescription>
                {currentPlan === "free" ? "Kostenloser Plan" : `${plans[currentPlan].price}€ pro Monat`}
              </CardDescription>
            </div>
            <Badge variant={currentPlan === "free" ? "secondary" : "default"} className="text-sm">
              {subscription?.status || "active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedRole === "craftsman" && "commission" in plans[currentPlan] && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Ihre Provision</span>
              </div>
              <span className="text-2xl font-bold">{plans[currentPlan].commission}%</span>
            </div>
          )}

          {/* Usage Statistics */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Nutzungsstatistik (diesen Monat)</h3>

            {selectedRole === "craftsman" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Angebote eingereicht</span>
                  <span className="font-medium">
                    {usage.offersSubmitted} /{" "}
                    {typeof plans[currentPlan].features.monthlyOfferLimit === "number"
                      ? plans[currentPlan].features.monthlyOfferLimit
                      : "∞"}
                  </span>
                </div>
                {typeof plans[currentPlan].features.monthlyOfferLimit === "number" && (
                  <Progress
                    value={(usage.offersSubmitted / plans[currentPlan].features.monthlyOfferLimit) * 100}
                    className="h-2"
                  />
                )}
              </div>
            )}

            {selectedRole === "client" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Aufträge erstellt</span>
                  <span className="font-medium">{usage.jobsPosted}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Selector */}
      <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Als Kunde</TabsTrigger>
          <TabsTrigger value="craftsman">Als Handwerker</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedRole} className="space-y-6 mt-6">
          {/* Plans Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {(Object.keys(plans) as SubscriptionPlan[]).map((planKey) => {
              const plan = plans[planKey]
              const isCurrent = planKey === currentPlan && selectedRole === subscription?.role
              const features = plan.features

              return (
                <Card key={planKey} className={isCurrent ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {planKey !== "free" && <Crown className="h-5 w-5 text-amber-500" />}
                        {plan.name}
                      </CardTitle>
                      {isCurrent && <Badge>Aktuell</Badge>}
                    </div>
                    <CardDescription className="text-2xl font-bold mt-2">
                      {planKey === "free" ? "Kostenlos" : `${plan.price}€/Monat`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedRole === "craftsman" && "commission" in plan && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Provision</span>
                        <span className="text-lg font-bold">{plan.commission}%</span>
                      </div>
                    )}

                    <ul className="space-y-2 text-sm">
                      {selectedRole === "craftsman" ? (
                        <>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>
                              {typeof features.monthlyOfferLimit === "number"
                                ? `${features.monthlyOfferLimit} Angebote/Monat`
                                : "Unbegrenzte Angebote"}
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>
                              {typeof features.portfolioSize === "number"
                                ? `${features.portfolioSize} Portfolio-Einträge`
                                : "Unbegrenztes Portfolio"}
                            </span>
                          </li>
                          {features.priorityPlacement && (
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Priorisierte Platzierung</span>
                            </li>
                          )}
                          {features.earlyAccess && (
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Frühzeitiger Zugang</span>
                            </li>
                          )}
                          {features.teamMembers && features.teamMembers > 1 && (
                            <li className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-600" />
                              <span>{features.teamMembers} Team-Mitglieder</span>
                            </li>
                          )}
                        </>
                      ) : (
                        <>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>Unbegrenzte Aufträge</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>
                              {typeof features.offersPerJob === "number"
                                ? `${features.offersPerJob} Angebote pro Auftrag`
                                : "Unbegrenzte Angebote"}
                            </span>
                          </li>
                          {features.priorityPlacement && (
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Priorisierte Platzierung</span>
                            </li>
                          )}
                          {features.multipleUsers && (
                            <li className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-600" />
                              <span>Mehrere Benutzer</span>
                            </li>
                          )}
                          {features.analytics && (
                            <li className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-green-600" />
                              <span>Detaillierte Analysen</span>
                            </li>
                          )}
                        </>
                      )}
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="capitalize">{features.support} Support</span>
                      </li>
                    </ul>

                    <Button
                      className="w-full"
                      variant={isCurrent ? "secondary" : "default"}
                      disabled={isCurrent || isLoading}
                      onClick={() => handleUpgrade(planKey)}
                    >
                      {isCurrent ? (
                        "Aktueller Plan"
                      ) : (
                        <>
                          {planKey === "free" ? "Zu Basis wechseln" : "Upgraden"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Test Mode Notice */}
          <Card className="border-amber-500 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Zap className="h-5 w-5" />
                Testmodus aktiv
              </CardTitle>
              <CardDescription className="text-amber-800">
                Während der Testphase können Sie Plans ohne Zahlung wechseln. Klicken Sie einfach auf "Upgraden" um
                einen Plan zu testen.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
