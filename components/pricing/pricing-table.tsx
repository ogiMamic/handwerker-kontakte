"use client"

import { useState } from "react"
import { Check, X, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckoutDialog } from "@/components/subscription/checkout-dialog"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function PricingTable() {
  const [checkoutDialog, setCheckoutDialog] = useState<{
    open: boolean
    productId: string
    planName: string
    price: string
    features: string[]
  }>({
    open: false,
    productId: "",
    planName: "",
    price: "",
    features: [],
  })

  const { isSignedIn } = useAuth()
  const router = useRouter()

  const handleSelectPlan = (planId: string, planName: string, price: string, features: string[]) => {
    if (!isSignedIn) {
      router.push(`/de/sign-up?plan=${planId}&role=craftsman`)
      return
    }

    setCheckoutDialog({
      open: true,
      productId: `craftsman-${planId}`,
      planName,
      price: price === "0" ? "Kostenlos" : `€${price}/Monat`,
      features,
    })
  }

  const plans = [
    {
      id: "free",
      name: "Basis",
      description: "Grundprofil — ideal zum Ausprobieren",
      price: "0",
      features: [
        { text: "Profil mit Firmenname & Fachgebiet", included: true },
        { text: "Anzeige in Suchergebnissen", included: true },
        { text: "Bis zu 3 Portfolio-Bilder", included: true },
        { text: "Grundlegender Support", included: true },
        { text: "Telefon & E-Mail sichtbar", included: false },
        { text: "WhatsApp-Kontaktbutton", included: false },
        { text: "Prioritäts-Platzierung", included: false },
        { text: "Verifizierungs-Badge", included: false },
        { text: "Unbegrenzte Portfolio-Bilder", included: false },
      ],
      cta: "Kostenlos registrieren",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Volle Sichtbarkeit — Kunden kontaktieren Sie direkt",
      price: "14,99",
      features: [
        { text: "Alles aus Basis", included: true },
        { text: "Telefon & E-Mail sichtbar für Kunden", included: true },
        { text: "WhatsApp-Kontaktbutton", included: true },
        { text: "Prioritäts-Platzierung in der Suche", included: true },
        { text: "Verifizierungs-Badge", included: true },
        { text: "Unbegrenzte Portfolio-Bilder", included: true },
        { text: "Bevorzugter Support", included: true },
        { text: "Detaillierte Profilstatistiken", included: true },
      ],
      cta: "Jetzt Premium werden",
      popular: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Preise für Handwerker</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Für Kunden ist die Suche immer kostenlos. Als Handwerker wählen Sie den Tarif, der zu Ihnen passt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              plan.popular
                ? "border-primary border-2 shadow-lg scale-[1.02]"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-white px-4 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Empfohlen
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                {plan.price === "0" ? (
                  <div className="text-4xl font-bold">Kostenlos</div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold">€{plan.price}</span>
                    <span className="text-muted-foreground">/Monat</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "" : "text-gray-400"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-4">
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                onClick={() =>
                  handleSelectPlan(
                    plan.id,
                    plan.name,
                    plan.price,
                    plan.features.filter((f) => f.included).map((f) => f.text)
                  )
                }
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ-style section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1">Ist die Plattform für Kunden wirklich kostenlos?</h3>
            <p className="text-muted-foreground">Ja, Kunden können Handwerker suchen, Profile ansehen und direkt kontaktieren — komplett kostenlos und ohne Registrierung.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Was passiert nach der kostenlosen Registrierung?</h3>
            <p className="text-muted-foreground">Ihr Profil wird in den Suchergebnissen angezeigt, aber ohne sichtbare Kontaktdaten. Kunden sehen Ihren Namen, Fachgebiet und Standort.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Kann ich jederzeit kündigen?</h3>
            <p className="text-muted-foreground">Ja, Premium ist monatlich kündbar. Keine Mindestlaufzeit, keine versteckten Kosten.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Lohnt sich Premium?</h3>
            <p className="text-muted-foreground">Wenn Sie durch Premium auch nur einen zusätzlichen Auftrag pro Monat erhalten, hat sich die Investition von €14,99 bereits vielfach bezahlt.</p>
          </div>
        </div>
      </div>

      <CheckoutDialog
        open={checkoutDialog.open}
        onOpenChange={(open) => setCheckoutDialog((prev) => ({ ...prev, open }))}
        productId={checkoutDialog.productId}
        planName={checkoutDialog.planName}
        price={checkoutDialog.price}
        features={checkoutDialog.features}
      />
    </div>
  )
}
