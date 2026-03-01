import { Search, UserCheck, Phone } from "lucide-react"

interface HowItWorksDictionary {
  title: string
  subtitle: string
}

export function LandingHowItWorks({ dictionary }: { dictionary: HowItWorksDictionary }) {
  const steps = [
    {
      title: "Handwerker suchen",
      description: "Geben Sie Ihre Postleitzahl und das gewünschte Fachgebiet ein — und finden Sie passende Handwerker in Ihrer Nähe.",
      icon: Search,
    },
    {
      title: "Profile vergleichen",
      description: "Sehen Sie sich Bewertungen, Referenzprojekte, Qualifikationen und Stundensätze an — alles auf einen Blick.",
      icon: UserCheck,
    },
    {
      title: "Direkt kontaktieren",
      description: "Rufen Sie an, schreiben Sie eine E-Mail oder kontaktieren Sie den Handwerker per WhatsApp — ganz ohne Umwege.",
      icon: Phone,
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{dictionary.title}</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{dictionary.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-xl font-bold">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
                )}
              </div>
              <div className="space-y-2">
                <step.icon className="h-6 w-6 mx-auto text-primary" />
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
