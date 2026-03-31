import Link from "next/link"
import { MapPin } from "lucide-react"

interface CityData {
  slug: string
  name: string
  count: number
}

interface CityCardsProps {
  cities: CityData[]
}

export function LandingCityCards({ cities }: CityCardsProps) {
  if (cities.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-[#F8FAFC]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-[#1E293B]">
            Handwerker in Ihrer N&auml;he
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-lg">
            W&auml;hlen Sie Ihre Stadt und finden Sie lokale Fachbetriebe.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/de/handwerker/stadt/${city.slug}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2563EB] hover:shadow-md transition-all duration-200"
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-blue-50">
                <MapPin className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-[#1E293B] text-sm truncate">{city.name}</p>
                <p className="text-xs text-gray-400">{city.count} Handwerker</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
