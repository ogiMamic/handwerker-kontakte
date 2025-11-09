import { SignUp } from "@clerk/nextjs"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import Link from "next/link"
import { Hammer, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function SignUpPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale }
  searchParams: { redirect_url?: string; plan?: string; role?: string }
}) {
  const dict = await getDictionary(lang)

  const selectedPlan = searchParams.plan
  const selectedRole = searchParams.role

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/${lang}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-primary" />
            <div className="flex items-center space-x-2">
              <Hammer className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Handwerker Kontakte</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  {lang === "de" ? "Registrieren Sie sich kostenlos" : "Sign up for free"}
                </h1>
                <p className="text-xl text-gray-600">
                  {lang === "de"
                    ? "Starten Sie noch heute und finden Sie die besten Handwerker"
                    : "Get started today and find the best craftsmen"}
                </p>
              </div>

              {selectedPlan && selectedRole && (
                <Badge variant="default" className="text-base py-2 px-4">
                  {lang === "de" ? "Ausgewählter Plan:" : "Selected Plan:"} {selectedPlan.toUpperCase()} (
                  {selectedRole === "client" ? "Klient" : "Handwerker"})
                </Badge>
              )}

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{lang === "de" ? "100% kostenlos" : "100% Free"}</h3>
                    <p className="text-gray-600">
                      {lang === "de" ? "Keine versteckten Kosten oder Gebühren" : "No hidden costs or fees"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {lang === "de" ? "Geprüfte Handwerker" : "Verified Craftsmen"}
                    </h3>
                    <p className="text-gray-600">
                      {lang === "de"
                        ? "Alle Handwerker werden sorgfältig geprüft"
                        : "All craftsmen are carefully verified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {lang === "de" ? "Schnelle Antworten" : "Quick Responses"}
                    </h3>
                    <p className="text-gray-600">
                      {lang === "de" ? "Erhalten Sie Angebote innerhalb von 24 Stunden" : "Get quotes within 24 hours"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {lang === "de" ? "Sichere Zahlung" : "Secure Payment"}
                    </h3>
                    <p className="text-gray-600">
                      {lang === "de" ? "Ihre Daten sind bei uns sicher" : "Your data is safe with us"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedPlan && selectedPlan !== "basis" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    {lang === "de"
                      ? "Nach der Registrierung können Sie Ihren gewählten Plan aktivieren"
                      : "After registration, you can activate your selected plan"}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t">
                <p className="text-sm text-gray-500">
                  {lang === "de" ? "Bereits registriert?" : "Already registered?"}{" "}
                  <Link href={`/${lang}/sign-in`} className="text-primary font-semibold hover:underline">
                    {lang === "de" ? "Jetzt anmelden" : "Sign in now"}
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - Clerk Sign Up */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <SignUp
                path={`/${lang}/sign-up`}
                signInUrl={`/${lang}/sign-in`}
                redirectUrl={
                  selectedPlan && selectedPlan !== "basis"
                    ? `/${lang}/subscription?plan=${selectedPlan}&role=${selectedRole}`
                    : searchParams.redirect_url || `/${lang}/dashboard`
                }
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none",
                    headerTitle: "text-2xl font-bold text-gray-900",
                    headerSubtitle: "text-gray-600",
                    socialButtonsBlockButton: "border-2 hover:bg-gray-50 transition-colors",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 transition-colors",
                    footerActionLink: "text-primary hover:text-primary/80",
                    formFieldInput: "border-2 focus:border-primary",
                    identityPreviewEditButton: "text-primary",
                  },
                }}
              />

              {/* Powered by Clerk */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  {lang === "de" ? "Sicher angetrieben von" : "Securely powered by"}{" "}
                  <a
                    href="https://clerk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-600 hover:text-primary transition-colors"
                  >
                    Clerk
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 Handwerker Kontakte. {lang === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}
            </p>
            <div className="flex gap-6 text-sm">
              <Link href={`/${lang}/impressum`} className="text-gray-600 hover:text-primary transition-colors">
                {lang === "de" ? "Impressum" : "Imprint"}
              </Link>
              <Link href={`/${lang}/datenschutz`} className="text-gray-600 hover:text-primary transition-colors">
                {lang === "de" ? "Datenschutz" : "Privacy"}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
