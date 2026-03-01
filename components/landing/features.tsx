import { Shield, Star, Phone, MapPin, Clock, Euro } from "lucide-react"

interface FeaturesDictionary {
  title: string
  subtitle: string
}

export function LandingFeatures({ dictionary }: { dictionary: FeaturesDictionary }) {
  const features = [
    {
      title: "Verifizierte Profile",
      description: "Jeder Handwerker wird überprüft — Gewerbeschein, Versicherung und Qualifikationen.",
      icon: Shield,
    },
    {
      title: "Echte Bewertungen",
      description: "Lesen Sie ehrliche Erfahrungsberichte von anderen Kunden aus Ihrer Region.",
      icon: Star,
    },
    {
      title: "Direkter Kontakt",
      description: "Kein Umweg über die Plattform — kontaktieren Sie Handwerker per Telefon, E-Mail oder WhatsApp.",
      icon: Phone,
    },
    {
      title: "In Ihrer Nähe",
      description: "Finden Sie Handwerker in Ihrem Umkreis — einfach Postleitzahl eingeben und los.",
      icon: MapPin,
    },
    {
      title: "Schnell & einfach",
      description: "Keine Registrierung nötig. Suchen, vergleichen und kontaktieren — in unter 2 Minuten.",
      icon: Clock,
    },
    {
      title: "100% kostenlos",
      description: "Für Kunden ist die Nutzung komplett kostenlos. Keine versteckten Gebühren.",
      icon: Euro,
    },
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{dictionary.title}</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{dictionary.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2 p-6 rounded-xl bg-white border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
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
