import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CTADictionary {
  title: string
  subtitle: string
  buttonText: string
}

export function LandingCTA({ dictionary }: { dictionary: CTADictionary }) {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{dictionary.title}</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{dictionary.subtitle}</p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/de/client/auftrag-erstellen">
              {dictionary.buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
