import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function DatenschutzPage({
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
          <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-lg font-medium mb-2">Allgemeine Hinweise</h3>
              <p className="text-gray-700">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Verantwortliche Stelle</h2>
              <p className="text-gray-700">
                ogiX-digital UG (haftungsbeschränkt)
                <br />
                Alt-Griesheim 88a
                <br />
                65933 Frankfurt am Main
                <br />
                E-Mail:{" "}
                <a href="mailto:info@ogix-digital.de" className="text-blue-600 hover:underline">
                  info@ogix-digital.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Datenerfassung auf dieser Website</h2>
              <h3 className="text-lg font-medium mb-2">Welche Daten werden erfasst?</h3>
              <p className="text-gray-700 mb-3">
                Wir erfassen folgende Daten:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Registrierungsdaten (Name, E-Mail-Adresse, Kontaktinformationen)</li>
                <li>Profilinformationen (bei Handwerkern: Qualifikationen, Dienstleistungen, etc.)</li>
                <li>Nutzungsdaten (besuchte Seiten, Klickverhalten)</li>
                <li>Kommunikationsdaten (Nachrichten zwischen Nutzern)</li>
                <li>Transaktionsdaten (bei kostenpflichtigen Diensten)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
              <p className="text-gray-700">
                Unsere Website verwendet Cookies. Das sind kleine Textdateien, die auf Ihrem Endgerät gespeichert
                werden. Cookies richten keinen Schaden an. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis
                Sie diese löschen. Sie ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Analyse-Tools und Tools von Drittanbietern</h2>
              <p className="text-gray-700">
                Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor
                allem mit sogenannten Analyseprogrammen. Detaillierte Informationen zu diesen Analyseprogrammen finden
                Sie in dieser Datenschutzerklärung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Ihre Rechte</h2>
              <p className="text-gray-700 mb-3">Sie haben folgende Rechte:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Recht auf Auskunft über Ihre gespeicherten Daten</li>
                <li>Recht auf Berichtigung unrichtiger Daten</li>
                <li>Recht auf Löschung Ihrer Daten</li>
                <li>Recht auf Einschränkung der Datenverarbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
                <li>Widerspruchsrecht gegen die Datenverarbeitung</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Datensicherheit</h2>
              <p className="text-gray-700">
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in
                Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Drittanbieter und Partner</h2>
              <p className="text-gray-700">
                Wir arbeiten mit verschiedenen Drittanbietern zusammen (z.B. Zahlungsdienstleister, Cloud-Anbieter).
                Diese verarbeiten Ihre Daten nur in unserem Auftrag und sind vertraglich zur Einhaltung der
                Datenschutzbestimmungen verpflichtet.
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Stand: Januar 2025</p>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
