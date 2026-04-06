import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hammer, User, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export const dynamic = 'force-dynamic';

export default async function AccountTypePage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {lang === "de" ? "Erstellen Sie Ihren Account" : "Create Your Account"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {lang === "de"
                  ? "Wählen Sie den Account-Typ, der am besten zu Ihnen passt"
                  : "Choose the account type that best fits your needs"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Client Card */}
              <Card className="relative hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">
                    {lang === "de" ? "Ich suche einen Handwerker" : "I'm looking for a craftsman"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {lang === "de"
                      ? "Finden Sie qualifizierte Handwerker für Ihr Projekt"
                      : "Find qualified craftsmen for your project"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        {lang === "de"
                          ? "Projekte erstellen und Angebote erhalten"
                          : "Create projects and receive quotes"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        {lang === "de" ? "Handwerker vergleichen und bewerten" : "Compare and rate craftsmen"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{lang === "de" ? "Sichere Zahlungsabwicklung" : "Secure payment processing"}</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full mt-4" size="lg">
                    <Link href={`/${lang}/sign-up?type=client`}>
                      {lang === "de" ? "Als Kunde registrieren" : "Register as Client"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Craftsman Card */}
              <Card className="relative hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <Hammer className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl">{lang === "de" ? "Ich bin Handwerker" : "I'm a craftsman"}</CardTitle>
                  <CardDescription className="text-base">
                    {lang === "de"
                      ? "Erweitern Sie Ihr Geschäft und gewinnen Sie neue Kunden"
                      : "Expand your business and win new clients"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        {lang === "de" ? "Zugang zu neuen Projekten und Kunden" : "Access to new projects and clients"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        {lang === "de" ? "Profil mit Portfolio präsentieren" : "Showcase your profile with portfolio"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{lang === "de" ? "Pünktliche und sichere Zahlungen" : "Timely and secure payments"}</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full mt-4" size="lg">
                    <Link href={`/${lang}/handwerker/registrieren`}>
                      {lang === "de" ? "Als Handwerker registrieren" : "Register as Craftsman"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                {lang === "de" ? "Bereits ein Konto?" : "Already have an account?"}{" "}
                <Link href={`/${lang}/sign-in`} className="text-primary font-medium hover:underline">
                  {lang === "de" ? "Anmelden" : "Sign in"}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  )
}
