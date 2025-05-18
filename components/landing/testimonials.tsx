import { Star } from 'lucide-react'

interface TestimonialsDictionary {
  title: string
  subtitle: string
}

export function LandingTestimonials({ dictionary }: { dictionary: TestimonialsDictionary }) {
  const testimonials = [
    {
      name: "Julia Müller",
      role: "Hausbesitzerin",
      content: "Ich habe über Handwerker-Kontakte einen fantastischen Elektriker gefunden. Die Plattform war einfach zu bedienen und ich hatte innerhalb eines Tages mehrere Angebote.",
      avatar: "/placeholder.svg?key=sxmrp",
      rating: 5,
    },
    {
      name: "Thomas Schmidt",
      role: "Selbstständiger Klempner",
      content: "Als Handwerker hat mir die Plattform geholfen, neue Kunden zu finden und mein Geschäft auszubauen. Die Gebühren sind fair und die Zahlungen immer pünktlich.",
      avatar: "/placeholder.svg?key=26xni",
      rating: 5,
    },
    {
      name: "Markus Weber",
      role: "Wohnungseigentümer",
      content: "Nach einem Wasserschaden brauchte ich schnell einen zuverlässigen Handwerker. Über Handwerker-Kontakte hatte ich innerhalb von Stunden einen Termin.",
      avatar: "/placeholder.svg?key=7688j",
      rating: 4,
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
            <div key={index} className="flex flex-col p-6 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="rounded-full w-12 h-12 object-cover"
                />
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 flex-1">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
