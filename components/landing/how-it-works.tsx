import { ClipboardList, Search, MessageSquare, CheckCircle } from 'lucide-react'

interface HowItWorksDictionary {
  title: string
  subtitle: string
}

export function LandingHowItWorks({ dictionary }: { dictionary: HowItWorksDictionary }) {
  const steps = [
    {
      title: "Projekt erstellen",
      description: "Beschreiben Sie Ihr Projekt und geben Sie Details wie Budget und Zeitrahmen an.",
      icon: ClipboardList,
    },
    {
      title: "Angebote erhalten",
      description: "Qualifizierte Handwerker senden Ihnen Angebote für Ihr Projekt.",
      icon: Search,
    },
    {
      title: "Handwerker auswählen",
      description: "Vergleichen Sie Angebote, Profile und Bewertungen, um den besten Handwerker auszuwählen.",
      icon: MessageSquare,
    },
    {
      title: "Projekt abschließen",
      description: "Arbeiten Sie mit dem Handwerker zusammen und bezahlen Sie erst, wenn Sie zufrieden sind.",
      icon: CheckCircle,
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{dictionary.title}</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{dictionary.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white">
                  <step.icon className="h-8 w-8" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Schritt {index + 1}: {step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
