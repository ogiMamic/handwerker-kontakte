import { Search, UserCheck, Phone } from "lucide-react"

const steps = [
  {
    title: "Handwerker suchen",
    description: "Postleitzahl und Fachgebiet eingeben.",
    icon: Search,
  },
  {
    title: "Profile vergleichen",
    description: "Bewertungen, Qualifikationen und Preise auf einen Blick.",
    icon: UserCheck,
  },
  {
    title: "Direkt kontaktieren",
    description: "Per Telefon, E-Mail oder WhatsApp Kontakt aufnehmen.",
    icon: Phone,
  },
]

export function LandingHowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-[#1E293B]">
            So funktioniert&apos;s
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-lg">
            In drei Schritten zum passenden Handwerker.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2563EB] text-white text-xl font-bold">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10" />
                )}
              </div>
              <div className="space-y-2">
                <step.icon className="h-6 w-6 mx-auto text-[#2563EB]" />
                <h3 className="text-xl font-bold text-[#1E293B]">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
