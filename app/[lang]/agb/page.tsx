import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function AGBPage({
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
          <h1 className="text-3xl font-bold mb-6">Allgemeine Geschäftsbedingungen (AGB)</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Geltungsbereich</h2>
              <p className="text-gray-700">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen ogiX-digital UG
                (haftungsbeschränkt) und den Nutzern der Plattform Handwerker-Kontakte. Mit der Registrierung und
                Nutzung der Plattform erkennen Sie diese AGB an.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Leistungsbeschreibung</h2>
              <p className="text-gray-700 mb-3">
                Handwerker-Kontakte ist eine Vermittlungsplattform, die Kunden mit qualifizierten Handwerkern verbindet.
                Die Plattform bietet:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Vermittlung von Handwerkerdienstleistungen</li>
                <li>Auftragsverwaltung und Kommunikationstools</li>
                <li>Profile für Handwerker und Kunden</li>
                <li>Bewertungs- und Rezensionssystem</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Registrierung und Nutzerkonto</h2>
              <p className="text-gray-700 mb-3">
                Zur Nutzung der Plattform ist eine Registrierung erforderlich. Bei der Registrierung verpflichten Sie
                sich, wahrheitsgemäße und vollständige Angaben zu machen. Sie sind verantwortlich für die Geheimhaltung
                Ihrer Zugangsdaten.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Pflichten der Nutzer</h2>
              <p className="text-gray-700 mb-3">Nutzer verpflichten sich:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Die Plattform nur für rechtmäßige Zwecke zu nutzen</li>
                <li>Keine rechtswidrigen oder schädlichen Inhalte zu veröffentlichen</li>
                <li>Die Rechte Dritter zu respektieren</li>
                <li>Korrekte Kontakt- und Geschäftsinformationen bereitzustellen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Preise und Zahlung</h2>
              <p className="text-gray-700">
                Die Nutzung der Plattform kann kostenpflichtig sein. Die aktuellen Preise sind auf der Preisseite
                einsehbar. Zahlungen erfolgen über die auf der Plattform angebotenen Zahlungsmethoden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Haftung</h2>
              <p className="text-gray-700">
                ogiX-digital UG haftet nur für vorsätzliche oder grob fahrlässige Pflichtverletzungen. Für die
                Qualität der vermittelten Handwerkerleistungen übernimmt die Plattform keine Haftung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Datenschutz</h2>
              <p className="text-gray-700">
                Der Schutz Ihrer persönlichen Daten ist uns wichtig. Details zur Datenverarbeitung finden Sie in
                unserer <a href="/de/datenschutz" className="text-blue-600 hover:underline">Datenschutzerklärung</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Änderungen der AGB</h2>
              <p className="text-gray-700">
                Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Über wesentliche Änderungen werden Sie
                per E-Mail informiert.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Schlussbestimmungen</h2>
              <p className="text-gray-700">
                Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Frankfurt am Main.
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
