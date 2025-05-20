import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function ImpressumPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Impressum</h1>

          <div className="prose max-w-none">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              Handwerker-Kontakte GmbH
              <br />
              Musterstraße 123
              <br />
              12345 Musterstadt
              <br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon: +49 123 456789
              <br />
              E-Mail: info@handwerker-kontakte.de
            </p>

            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Handwerker-Kontakte GmbH
              <br />
              Musterstraße 123
              <br />
              12345 Musterstadt
              <br />
              Deutschland
            </p>

            <h2>Haftungsausschluss</h2>
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
              Aktualität der Inhalte können wir jedoch keine Gewährleistung übernehmen.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
