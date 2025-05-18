import { ClipboardList, Search, MessageSquare, CheckCircle, Shield, CreditCard, Star, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HowItWorks() {
  const clientSteps = [
    {
      title: "Projekt erstellen",
      description: "Beschreiben Sie Ihr Projekt detailliert, einschließlich Budget, Zeitrahmen und spezifischer Anforderungen.",
      icon: ClipboardList,
      details: [
        "Wählen Sie die passende Kategorie für Ihr Projekt",
        "Laden Sie Fotos oder Pläne hoch, um Ihr Projekt zu veranschaulichen",
        "Geben Sie Ihren Standort an, um lokale Handwerker zu finden",
        "Legen Sie Ihr Budget und den gewünschten Zeitrahmen fest"
      ]
    },
    {
      title: "Angebote erhalten",
      description: "Qualifizierte Handwerker in Ihrer Nähe werden über Ihr Projekt informiert und können Ihnen Angebote senden.",
      icon: Search,
      details: [
        "Erhalten Sie mehrere Angebote von verifizierten Handwerkern",
        "Vergleichen Sie Preise, Zeitpläne und Leistungsumfang",
        "Sehen Sie sich Bewertungen und Portfolios der Handwerker an",
        "Stellen Sie Fragen direkt über unser Chat-System"
      ]
    },
    {
      title: "Handwerker auswählen",
      description: "Wählen Sie den besten Handwerker für Ihr Projekt basierend auf Angeboten, Bewertungen und Kommunikation.",
      icon: MessageSquare,
      details: [
        "Treffen Sie eine fundierte Entscheidung basierend auf allen verfügbaren Informationen",
        "Akzeptieren Sie das passende Angebot mit einem Klick",
        "Besprechen Sie Details und Zeitplan mit dem ausgewählten Handwerker",
        "Vereinbaren Sie einen Termin für den Projektstart"
      ]
    },
    {
      title: "Projekt abschließen",
      description: "Überwachen Sie den Fortschritt, kommunizieren Sie mit dem Handwerker und bezahlen Sie erst, wenn Sie zufrieden sind.",
      icon: CheckCircle,
      details: [
        "Verfolgen Sie den Projektfortschritt in Echtzeit",
        "Kommunizieren Sie direkt über die Plattform",
        "Bezahlen Sie sicher über unser Treuhandsystem",
        "Geben Sie eine Bewertung ab, um anderen Kunden zu helfen"
      ]
    },
  ]

  const craftsmanSteps = [
    {
      title: "Profil erstellen",
      description: "Erstellen Sie ein detailliertes Profil mit Ihren Fähigkeiten, Erfahrungen und Beispielprojekten.",
      icon: ClipboardList,
      details: [
        "Fügen Sie Ihre Qualifikationen und Zertifikate hinzu",
        "Laden Sie Fotos von abgeschlossenen Projekten hoch",
        "Geben Sie Ihren Servicebereich und Ihre Verfügbarkeit an",
        "Stellen Sie Ihre Spezialisierungen und besonderen Fähigkeiten heraus"
      ]
    },
    {
      title: "Projekte finden",
      description: "Durchsuchen Sie verfügbare Projekte in Ihrer Nähe oder erhalten Sie Benachrichtigungen über passende neue Aufträge.",
      icon: Search,
      details: [
        "Filtern Sie Projekte nach Kategorie, Standort und Budget",
        "Erhalten Sie automatische Benachrichtigungen über passende neue Projekte",
        "Sehen Sie sich detaillierte Projektbeschreibungen und Anforderungen an",
        "Bewerten Sie potenzielle Projekte basierend auf Ihren Fähigkeiten und Kapazitäten"
      ]
    },
    {
      title: "Angebote abgeben",
      description: "Senden Sie detaillierte und wettbewerbsfähige Angebote für Projekte, die zu Ihren Fähigkeiten passen.",
      icon: MessageSquare,
      details: [
        "Erstellen Sie maßgeschneiderte Angebote basierend auf den Projektanforderungen",
        "Geben Sie einen detaillierten Zeitplan und Kostenaufschlüsselung an",
        "Heben Sie Ihre relevanten Erfahrungen und Qualifikationen hervor",
        "Kommunizieren Sie direkt mit potenziellen Kunden, um Fragen zu klären"
      ]
    },
    {
      title: "Projekte durchführen",
      description: "Führen Sie Projekte professionell durch, kommunizieren Sie regelmäßig und erhalten Sie Zahlungen sicher über die Plattform.",
      icon: CheckCircle,
      details: [
        "Halten Sie den Kunden über den Fortschritt auf dem Laufenden",
        "Dokumentieren Sie Ihre Arbeit mit Fotos und Updates",
        "Erhalten Sie Zahlungen pünktlich und sicher",
        "Sammeln Sie positive Bewertungen, um Ihr Geschäft auszubauen"
      ]
    },
  ]

  const faqItems = [
    {
      question: "Wie viel kostet die Nutzung der Plattform?",
      answer: "Für Kunden ist die Nutzung der Plattform kostenlos. Handwerker zahlen eine kleine Provision von 5-8% nur für erfolgreich vermittelte und abgeschlossene Projekte. Es gibt keine monatlichen Gebühren oder Kosten für Angebote."
    },
    {
      question: "Wie werden Handwerker überprüft?",
      answer: "Alle Handwerker durchlaufen einen strengen Verifizierungsprozess. Wir überprüfen Gewerbeanmeldungen, Versicherungsnachweise, Qualifikationen und Identitätsnachweise. Zusätzlich sammeln wir Kundenbewertungen, um die Qualität kontinuierlich zu sichern."
    },
    {
      question: "Wie funktioniert das Zahlungssystem?",
      answer: "Wir verwenden ein sicheres Treuhandsystem. Der Kunde hinterlegt den Betrag auf unserem Treuhandkonto. Erst wenn der Kunde mit der abgeschlossenen Arbeit zufrieden ist, wird das Geld an den Handwerker freigegeben. Dies bietet beiden Seiten Sicherheit."
    },
    {
      question: "Was passiert bei Streitigkeiten?",
      answer: "Unser Kundenservice-Team steht bereit, um bei Unstimmigkeiten zu vermitteln. In schwierigen Fällen haben wir einen strukturierten Schlichtungsprozess, um faire Lösungen für beide Parteien zu finden."
    },
    {
      question: "Kann ich als Handwerker meine Verfügbarkeit angeben?",
      answer: "Ja, Handwerker können ihren Servicebereich, verfügbare Tage und Zeiten sowie Urlaubszeiten in ihrem Profil hinterlegen. So erhalten Sie nur Anfragen, wenn Sie tatsächlich verfügbar sind."
    },
    {
      question: "Wie schnell erhalte ich Angebote für mein Projekt?",
      answer: "Die meisten Kunden erhalten ihre ersten Angebote innerhalb von 24-48 Stunden. Bei dringenden Projekten können Sie dies in Ihrer Projektbeschreibung vermerken, um schnellere Reaktionen zu erhalten."
    },
  ]

  return (
    <div className="space-y-16">
      <Tabs defaultValue="client">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="client">Für Kunden</TabsTrigger>
            <TabsTrigger value="craftsman">Für Handwerker</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="client" className="space-y-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {clientSteps.map((step, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>Schritt {index + 1}: {step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-primary/5 rounded-lg p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <Shield className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Sicherheit für Kunden</h3>
                <p className="text-gray-600">
                  Unsere Plattform bietet mehrere Sicherheitsebenen, um Ihnen ein sorgenfreies Erlebnis zu garantieren.
                </p>
              </div>
              <div className="md:w-2/3 grid gap-4 md:grid-cols-2">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Verifizierte Handwerker</h4>
                  <p className="text-sm text-gray-600">Alle Handwerker werden gründlich überprüft, einschließlich Identität, Qualifikationen und Versicherungen.</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Treuhandzahlungen</h4>
                  <p className="text-sm text-gray-600">Ihr Geld wird sicher verwahrt und erst freigegeben, wenn Sie mit der Arbeit zufrieden sind.</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Bewertungssystem</h4>
                  <p className="text-sm text-gray-600">Transparente Bewertungen von verifizierten Kunden helfen Ihnen, die besten Handwerker zu finden.</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Kundenservice</h4>
                  <p className="text-sm text-gray-600">Unser Support-Team steht Ihnen bei Fragen oder Problemen jederzeit zur Verfügung.</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="craftsman" className="space-y-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {craftsmanSteps.map((step, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>Schritt {index + 1}: {step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-primary/5 rounded-lg p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <CreditCard className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Vorteile für Handwerker</h3>
                <p className="text-gray-600">
                  Unsere Plattform bietet Handwerkern zahlreiche Vorteile, um ihr Geschäft auszubauen und zu optimieren.
                </p>
              </div>
              <div className="md:w-2/3 grid gap-4 md:grid-cols-2">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Neue Kunden gewinnen</h4>
                  <p className="text-sm text-gray-600">Erreichen Sie neue Kunden in Ihrer Region ohne teure Werbung oder Akquise.</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Sichere Zahlungen</h4>
                  <p className="text-sm text-gray-600">Erhalten Sie pünktliche Zahlungen über unser sicheres Zahlungssystem.</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Flexibler Zeitplan</h4>
                  <p className="text-sm text-gray-600">Wählen Sie Projekte, die zu Ihrem Zeitplan und Ihren Fähigkeiten passen.</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold mb-2">Reputation aufbauen</h4>
                  <p className="text-sm text-gray-600">Sammeln Sie Bewertungen und bauen Sie Ihre Online-Reputation auf.</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Häufig gestellte Fragen</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-start">
                  <HelpCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>{item.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
