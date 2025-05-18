import { CheckCircle } from 'lucide-react'

interface FeaturesDictionary {
  title: string
  subtitle: string
}

export function LandingFeatures({ dictionary }: { dictionary: FeaturesDictionary }) {
  const features = [
    {
      title: "Verifizierte Handwerker",
      description: "Alle Handwerker werden sorgfältig überprüft und verifiziert, um höchste Qualität zu gewährleisten.",
      icon: CheckCircle,
    },
    {
      title: "Sichere Zahlungen",
      description: "Zahlungen werden erst freigegeben, wenn Sie mit der Arbeit zufrieden sind.",
      icon: CheckCircle,
    },
    {
      title: "Bewertungssystem",
      description: "Transparente Bewertungen helfen Ihnen, den besten Handwerker für Ihr Projekt zu finden.",
      icon: CheckCircle,
    },
    {
      title: "Projektmanagement",
      description: "Verfolgen Sie den Fortschritt Ihres Projekts und kommunizieren Sie direkt mit dem Handwerker.",
      icon: CheckCircle,
    },
    {
      title: "Kostenvoranschläge",
      description: "Erhalten Sie mehrere Angebote für Ihr Projekt und wählen Sie das beste aus.",
      icon: CheckCircle,
    },
    {
      title: "Support-Team",
      description: "Unser Support-Team steht Ihnen bei Fragen oder Problemen zur Verfügung.",
      icon: CheckCircle,
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{dictionary.title}</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{dictionary.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
