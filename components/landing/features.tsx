import { Shield, Star, Phone, CircleDollarSign } from "lucide-react"

const features = [
  {
    title: "Verifizierte Handwerker",
    description: "Jeder Betrieb wird auf Qualifikationen und Gewerbeschein gepr\u00fcft.",
    icon: Shield,
  },
  {
    title: "Echte Bewertungen",
    description: "Ehrliche Erfahrungsberichte von Kunden aus Ihrer Region.",
    icon: Star,
  },
  {
    title: "Direkt kontaktieren",
    description: "Per Telefon, E-Mail oder WhatsApp \u2014 ohne Umwege.",
    icon: Phone,
  },
  {
    title: "100% kostenlos",
    description: "F\u00fcr Kunden komplett kostenlos, keine versteckten Geb\u00fchren.",
    icon: CircleDollarSign,
  },
]

export function LandingFeatures() {
  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-[#1E293B]">
            Warum Handwerker-Kontakte?
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-lg">
            Die einfachste Art, zuverl&auml;ssige Handwerker zu finden.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-3 rounded-full bg-[#2563EB]/10">
                <feature.icon className="h-6 w-6 text-[#2563EB]" />
              </div>
              <h3 className="text-lg font-bold text-[#1E293B]">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
