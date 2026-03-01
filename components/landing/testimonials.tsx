import { Star } from "lucide-react"

interface TestimonialsDictionary {
  title: string
  subtitle: string
}

export function LandingTestimonials({ dictionary }: { dictionary: TestimonialsDictionary }) {
  const testimonials = [
    {
      name: "Julia Müller",
      role: "Hausbesitzerin, München",
      content:
        "Ich brauchte dringend einen Elektriker und habe über Handwerker-Kontakte sofort drei Profile in meiner Nähe gefunden. Ein Anruf — und am nächsten Tag war alles erledigt.",
      rating: 5,
    },
    {
      name: "Thomas Schmidt",
      role: "Klempnermeister, München",
      content:
        "Seit ich mein Premium-Profil habe, bekomme ich regelmäßig Anfragen über die Plattform. Die €15 im Monat habe ich nach dem ersten Auftrag locker wieder rein.",
      rating: 5,
    },
    {
      name: "Sabine Weber",
      role: "Wohnungseigentümerin, München",
      content:
        "Endlich eine Plattform, wo man Handwerker direkt kontaktieren kann, ohne erst ein Konto erstellen zu müssen. Einfach Postleitzahl eingeben und anrufen.",
      rating: 5,
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
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col p-6 bg-white rounded-xl shadow-sm border">
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 flex-1 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
