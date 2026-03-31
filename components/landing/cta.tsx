import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, GitPullRequestDraft, UserPlus, Users, Eye, Phone } from "lucide-react"

export function LandingCTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Client flow — blue theme */}
          <div className="flex flex-col p-8 rounded-2xl bg-blue-50 border border-blue-200">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-6">
              Ich suche einen Handwerker
            </h3>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-blue-100">
                  <Search className="h-4 w-4 text-[#2563EB]" />
                </div>
                <span className="text-[#1E293B]">Kostenlos suchen</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-blue-100">
                  <GitPullRequestDraft className="h-4 w-4 text-[#2563EB]" />
                </div>
                <span className="text-[#1E293B]">Profile vergleichen</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-blue-100">
                  <Phone className="h-4 w-4 text-[#2563EB]" />
                </div>
                <span className="text-[#1E293B]">Direkt kontaktieren</span>
              </li>
            </ul>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-base">
                <Link href="/de/handwerker">
                  Handwerker finden
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-center text-sm text-gray-500">
                <Link href="/de/handwerker" className="underline underline-offset-2 hover:text-[#2563EB] transition-colors">
                  Oder beschreiben Sie Ihr Problem
                </Link>
              </p>
            </div>
          </div>

          {/* Craftsman flow — orange theme */}
          <div className="flex flex-col p-8 rounded-2xl bg-orange-50 border border-orange-200">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-6">
              Ich bin Handwerker
            </h3>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-orange-100">
                  <UserPlus className="h-4 w-4 text-[#F97316]" />
                </div>
                <span className="text-[#1E293B]">Profil erstellen</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-orange-100">
                  <Users className="h-4 w-4 text-[#F97316]" />
                </div>
                <span className="text-[#1E293B]">Neue Kunden gewinnen</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-orange-100">
                  <Eye className="h-4 w-4 text-[#F97316]" />
                </div>
                <span className="text-[#1E293B]">Sichtbarkeit erh&ouml;hen</span>
              </li>
            </ul>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full h-12 bg-[#F97316] hover:bg-[#ea580c] text-white text-base">
                <Link href="/de/handwerker/registrieren">
                  Jetzt registrieren
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-center text-sm text-gray-500">
                <Link href="/de/dashboard" className="underline underline-offset-2 hover:text-[#F97316] transition-colors">
                  Bereits registriert? Zum Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
