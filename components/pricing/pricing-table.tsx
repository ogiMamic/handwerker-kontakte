import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export function PricingTable() {
  const clientPlans = [
    {
      name: "Basis",
      description: "Ideal für gelegentliche Projekte",
      price: "0",
      features: [
        "Unbegrenzte Projektveröffentlichungen",
        "Bis zu 5 Angebote pro Projekt",
        "Grundlegende Projektunterstützung",
        "Sicheres Zahlungssystem",
        "Bewertungssystem",
      ],
      limitations: [
        "Keine priorisierten Projekte",
        "Keine erweiterten Filterfunktionen",
        "Standard-Support",
      ],
      cta: "Kostenlos starten",
      popular: false,
    },
    {
      name: "Premium",
      description: "Für regelmäßige Projekte und bessere Ergebnisse",
      price: "9,99",
      features: [
        "Alle Basis-Funktionen",
        "Unbegrenzte Angebote pro Projekt",
        "Priorisierte Projektplatzierung",
        "Erweiterte Handwerkerfilter",
        "Detaillierte Handwerkerprofile",
        "Bevorzugter Support",
        "Keine Plattformgebühren",
      ],
      limitations: [],
      cta: "Premium wählen",
      popular: true,
    },
    {
      name: "Business",
      description: "Für Unternehmen und Immobilienverwalter",
      price: "29,99",
      features: [
        "Alle Premium-Funktionen",
        "Mehrere Benutzerkonten",
        "Projektmanagement-Tools",
        "Detaillierte Berichte und Analysen",
        "Dedizierter Account Manager",
        "API-Zugang",
        "Anpassbare Workflows",
      ],
      limitations: [],
      cta: "Kontakt aufnehmen",
      popular: false,
    },
  ]

  const craftsmanPlans = [
    {
      name: "Basis",
      description: "Ideal für Einsteiger und Teilzeit-Handwerker",
      price: "0",
      commission: "8%",
      features: [
        "Grundlegendes Profil",
        "Bis zu 10 Angebote pro Monat",
        "Grundlegende Projektsuche",
        "Sicheres Zahlungssystem",
        "Bewertungssystem",
      ],
      limitations: [
        "Höhere Provision (8%)",
        "Keine priorisierten Angebote",
        "Begrenzte Sichtbarkeit",
      ],
      cta: "Kostenlos starten",
      popular: false,
    },
    {
      name: "Professional",
      description: "Für aktive Handwerker mit regelmäßigen Aufträgen",
      price: "19,99",
      commission: "5%",
      features: [
        "Erweitertes Profil mit Portfolio",
        "Unbegrenzte Angebote",
        "Priorisierte Angebote",
        "Erweiterte Projektsuche und Filter",
        "Frühzeitiger Zugang zu neuen Projekten",
        "Niedrigere Provision (5%)",
        "Bevorzugter Support",
      ],
      limitations: [],
      cta: "Professional wählen",
      popular: true,
    },
    {
      name: "Business",
      description: "Für Handwerksbetriebe mit mehreren Mitarbeitern",
      price: "49,99",
      commission: "3%",
      features: [
        "Alle Professional-Funktionen",
        "Mehrere Mitarbeiterprofile",
        "Niedrigste Provision (3%)",
        "Team-Management-Tools",
        "Erweiterte Analysen und Berichte",
        "Dedizierter Account Manager",
        "Priorisierte Platzierung in Suchergebnissen",
        "Anpassbares Unternehmensprofil",
      ],
      limitations: [],
      cta: "Kontakt aufnehmen",
      popular: false,
    },
  ]

  return (
    <Tabs defaultValue="client" className="w-full max-w-5xl mx-auto">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="client">Für Kunden</TabsTrigger>
          <TabsTrigger value="craftsman">Für Handwerker</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="client">
        <div className="grid gap-8 md:grid-cols-3">
          {clientPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.popular ? "border-primary shadow-lg relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">Beliebt</span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-gray-500 ml-2">/Monat</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start text-gray-500">
                      <span className="h-5 w-5 text-gray-300 mr-2 mt-0.5">✕</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={`w-full ${plan.popular ? "bg-primary" : ""}`}>
                  <Link href="/de/sign-up">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="craftsman">
        <div className="grid gap-8 md:grid-cols-3">
          {craftsmanPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.popular ? "border-primary shadow-lg relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">Beliebt</span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 space-y-1">
                  <div>
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-gray-500 ml-2">/Monat</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{plan.commission}</span> Provision pro Auftrag
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start text-gray-500">
                      <span className="h-5 w-5 text-gray-300 mr-2 mt-0.5">✕</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={`w-full ${plan.popular ? "bg-primary" : ""}`}>
                  <Link href="/de/handwerker/registrieren">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
