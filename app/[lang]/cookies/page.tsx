import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function CookiesPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cookie-Richtlinie</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Was sind Cookies?</h2>
              <p className="text-gray-700">
                Cookies sind kleine Textdateien, die auf Ihrem Computer oder Mobilgerät gespeichert werden, wenn Sie
                eine Website besuchen. Sie ermöglichen es der Website, Ihre Aktionen und Präferenzen über einen
                bestimmten Zeitraum zu speichern.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Wie verwenden wir Cookies?</h2>
              <p className="text-gray-700 mb-3">
                Wir verwenden Cookies für verschiedene Zwecke:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Notwendige Cookies:</strong> Diese sind für den Betrieb der Website erforderlich
                  (z.B. für die Anmeldung)
                </li>
                <li>
                  <strong>Funktionale Cookies:</strong> Diese speichern Ihre Präferenzen (z.B. Spracheinstellungen)
                </li>
                <li>
                  <strong>Analytische Cookies:</strong> Diese helfen uns zu verstehen, wie Besucher mit der Website
                  interagieren
                </li>
                <li>
                  <strong>Marketing-Cookies:</strong> Diese werden verwendet, um Werbung relevanter zu gestalten
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Welche Cookies verwenden wir?</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium mb-1">Session-Cookies</h3>
                  <p className="text-gray-700 text-sm">
                    Zweck: Authentifizierung und Sitzungsverwaltung
                    <br />
                    Dauer: Bis zum Ende der Browser-Sitzung
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium mb-1">Präferenz-Cookies</h3>
                  <p className="text-gray-700 text-sm">
                    Zweck: Speicherung Ihrer Einstellungen (Sprache, Theme)
                    <br />
                    Dauer: 1 Jahr
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium mb-1">Analyse-Cookies</h3>
                  <p className="text-gray-700 text-sm">
                    Zweck: Verständnis der Nutzung unserer Website
                    <br />
                    Dauer: 2 Jahre
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Wie können Sie Cookies verwalten?</h2>
              <p className="text-gray-700 mb-3">
                Sie können Cookies über Ihre Browser-Einstellungen verwalten:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Alle Cookies blockieren</li>
                <li>Nur Drittanbieter-Cookies blockieren</li>
                <li>Alle Cookies beim Schließen des Browsers löschen</li>
                <li>Eine Whitelist für vertrauenswürdige Websites erstellen</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Bitte beachten Sie, dass das Blockieren von Cookies die Funktionalität unserer Website beeinträchtigen kann.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Drittanbieter-Cookies</h2>
              <p className="text-gray-700">
                Wir verwenden auch Dienste von Drittanbietern, die möglicherweise Cookies setzen:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Google Analytics (für Website-Analyse)</li>
                <li>Stripe (für Zahlungsabwicklung)</li>
                <li>Vercel (für Hosting und Performance)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Ihre Zustimmung</h2>
              <p className="text-gray-700">
                Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies gemäß dieser Richtlinie zu.
                Sie können Ihre Zustimmung jederzeit widerrufen, indem Sie Cookies in Ihren Browser-Einstellungen
                löschen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
              <p className="text-gray-700">
                Bei Fragen zu unserer Cookie-Richtlinie kontaktieren Sie uns unter:
                <br />
                E-Mail:{" "}
                <a href="mailto:info@ogix-digital.de" className="text-blue-600 hover:underline">
                  info@ogix-digital.de
                </a>
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Stand: Januar 2025</p>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  )
}
