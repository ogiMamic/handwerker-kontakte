import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, UserPlus } from "lucide-react"

interface CTADictionary {
  title: string
  subtitle: string
  buttonText: string
}

export function LandingCTA({ dictionary }: { dictionary: CTADictionary }) {
  return (
    <section className="py-10 md:py-20 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Clients */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border">
            <Search className="h-10 w-10 text-primary" />
            <h3 className="text-2xl font-bold">Sie suchen einen Handwerker?</h3>
            <p className="text-gray-500">
              Finden Sie den passenden Handwerker in Ihrer Nähe — kostenlos und ohne Registrierung.
            </p>
            <Button asChild size="lg">
              <Link href="/de/handwerker">
                Handwerker suchen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* For Craftsmen */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border">
            <UserPlus className="h-10 w-10 text-primary" />
            <h3 className="text-2xl font-bold">Sie sind Handwerker?</h3>
            <p className="text-gray-500">
              Erstellen Sie Ihr Profil und werden Sie von neuen Kunden in Ihrer Region gefunden.
            </p>
            <Button asChild size="lg" variant="outline">
              <Link href="/de/handwerker/registrieren">
                Kostenlos registrieren
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
