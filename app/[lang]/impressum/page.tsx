import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export const dynamic = 'force-dynamic';

export default async function ImpressumPage({
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
          <h1 className="text-3xl font-bold mb-6">Impressum</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
              <p className="text-gray-700">
                ogiX-digital UG (haftungsbeschränkt)
                <br />
                Alt-Griesheim 88a
                <br />
                65933 Frankfurt am Main
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
              <p className="text-gray-700">
                E-Mail:{" "}
                <a href="mailto:info@ogix-digital.de" className="text-blue-600 hover:underline">
                  info@ogix-digital.de
                </a>
                <br />
                Kontaktformular:{" "}
                <a href="https://ogix-digital.de/contact-2/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://ogix-digital.de/contact-2/
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Geschäftsführer</h2>
              <p className="text-gray-700">Roman Schanz</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Handelsregistereintrag</h2>
              <p className="text-gray-700">
                Eingetragen beim Amtsgericht Frankfurt am Main
                <br />
                HRB 132217
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Verantwortlich für den Inhalt</h2>
              <p className="text-gray-700">
                Roman Schanz
                <br />
                Anschrift siehe oben
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Umsatzsteuer-ID</h2>
              <p className="text-gray-700">DE363412768</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Haftungsausschluss</h2>
              <h3 className="text-lg font-medium mb-2">Haftung für Inhalte</h3>
              <p className="text-gray-700 mb-3">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
                gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
              </p>

              <h3 className="text-lg font-medium mb-2">Haftung für Links</h3>
              <p className="text-gray-700">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  )
}
