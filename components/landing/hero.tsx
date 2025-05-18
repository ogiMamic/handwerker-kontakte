import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroDictionary {
  title: string
  subtitle: string
  clientCta: string
  craftsCta: string
}

export function LandingHero({ dictionary }: { dictionary: HeroDictionary }) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{dictionary.title}</h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">{dictionary.subtitle}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/de/client/auftrag-erstellen">
                  {dictionary.clientCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/de/handwerker/registrieren">{dictionary.craftsCta}</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:ml-auto flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/house-renovation-craftsmen.png"
                alt="Craftsmen working on a project"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
