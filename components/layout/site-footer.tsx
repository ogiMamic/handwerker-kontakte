// @ts-nocheck
import Link from "next/link"

interface FooterDictionary {
  copyright: string
  about?: string
  contact?: string
  terms?: string
  privacy?: string
  imprint?: string
}

export function SiteFooter({ dictionary, locale = "de" }: { dictionary: FooterDictionary; locale?: string }) {
  // Osiguravam da copyright postoji, čak i ako nije proslijeđen
  const footerDictionary = {
    copyright: dictionary.copyright || "© 2024 Handwerker-Kontakte. Alle Rechte vorbehalten.",
    ...dictionary,
  }

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Handwerker-Kontakte</h3>
            <p className="text-sm text-gray-500">
              Verbindet Klienten mit qualifizierten Handwerkern für erfolgreiche Aufträge.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Für Kunden</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/so-funktionierts`} className="text-gray-500 hover:text-primary">
                  So funktioniert's
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ratgeber`} className="text-gray-500 hover:text-primary">
                  Ratgeber
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/kosten`} className="text-gray-500 hover:text-primary">
                  Kosten
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/preise`} className="text-gray-500 hover:text-primary">
                  Preise
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/client/auftrag-erstellen`} className="text-gray-500 hover:text-primary">
                  Auftrag erstellen
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-500 hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Für Handwerker</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/handwerker/registrieren`} className="text-gray-500 hover:text-primary">
                  Als Handwerker registrieren
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ratgeber`} className="text-gray-500 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/agb`} className="text-gray-500 hover:text-primary">
                  AGB
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/datenschutz`} className="text-gray-500 hover:text-primary">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-gray-500 hover:text-primary">
                  Cookie-Richtlinie
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/impressum`} className="text-gray-500 hover:text-primary">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">{footerDictionary.copyright}</div>
      </div>
    </footer>
  )
}
