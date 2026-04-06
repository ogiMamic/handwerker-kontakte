import type { Metadata } from 'next';
import Link from 'next/link';
import { SEO_CATEGORIES } from '@/lib/seo-data';
import { getDictionary } from '@/lib/dictionaries';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Häufige Fragen (FAQ) | Handwerker-Kontakte',
  description: 'Antworten auf die häufigsten Fragen rund um Handwerker-Kontakte: Kosten, Ablauf, Bewertungen und mehr.',
};

interface FAQItem {
  question: string;
  answer: string;
}

const GENERAL_FAQS: FAQItem[] = [
  {
    question: 'Was ist Handwerker-Kontakte?',
    answer: 'Handwerker-Kontakte ist eine Plattform, die Kunden mit qualifizierten Handwerkern in ihrer Nähe verbindet. Sie können Profile vergleichen, Bewertungen lesen und direkt Kontakt aufnehmen - kostenlos und unverbindlich.',
  },
  {
    question: 'Ist die Nutzung von Handwerker-Kontakte kostenlos?',
    answer: 'Ja, die Suche nach Handwerkern und die Kontaktaufnahme sind für Kunden vollständig kostenlos. Handwerker können ein kostenloses Basisprofil erstellen oder ein Premium-Profil für mehr Sichtbarkeit buchen.',
  },
  {
    question: 'Wie finde ich den richtigen Handwerker?',
    answer: 'Nutzen Sie unsere Filter nach Gewerk, Stadt und Bewertung. Vergleichen Sie Stundensätze, lesen Sie Kundenbewertungen und achten Sie auf das Verifiziert-Siegel. Wir empfehlen, mindestens 2-3 Angebote einzuholen.',
  },
  {
    question: 'Was bedeutet "verifiziert"?',
    answer: 'Verifizierte Handwerker haben ihre Gewerbeanmeldung und Qualifikationen nachgewiesen. Das Siegel gibt Ihnen zusätzliche Sicherheit bei der Auswahl.',
  },
  {
    question: 'Wie funktioniert die Bewertung?',
    answer: 'Nach Abschluss eines Auftrags können Kunden den Handwerker mit 1-5 Sternen bewerten und einen Erfahrungsbericht schreiben. Alle Bewertungen sind echt und werden nicht gefiltert.',
  },
  {
    question: 'Brauche ich immer einen Kostenvoranschlag?',
    answer: 'Wir empfehlen immer einen schriftlichen Kostenvoranschlag vor Auftragsbeginn. Seriöse Handwerker erstellen diesen kostenlos oder für eine geringe Pauschale, die bei Auftragserteilung verrechnet wird.',
  },
  {
    question: 'Was tun bei Problemen mit einem Handwerker?',
    answer: 'Kontaktieren Sie zunächst den Handwerker direkt. Falls keine Lösung gefunden wird, können Sie uns über das Kontaktformular erreichen. Dokumentieren Sie Mängel immer schriftlich und mit Fotos.',
  },
  {
    question: 'Wie kann ich mich als Handwerker registrieren?',
    answer: 'Klicken Sie auf "Als Handwerker registrieren" und erstellen Sie Ihr Profil. Nach der Verifizierung Ihrer Daten erscheinen Sie in den Suchergebnissen und können von Kunden kontaktiert werden.',
  },
  {
    question: 'In welchen Städten ist Handwerker-Kontakte verfügbar?',
    answer: 'Handwerker-Kontakte ist in allen großen deutschen Städten verfügbar, darunter Berlin, München, Hamburg, Köln, Frankfurt, Stuttgart, Düsseldorf und viele weitere. Wir erweitern unser Netzwerk ständig.',
  },
  {
    question: 'Welche Gewerke werden auf der Plattform abgedeckt?',
    answer: 'Wir decken alle gängigen Handwerksberufe ab: Elektriker, Klempner, Maler, Schreiner, Dachdecker, Fliesenleger, Heizungsinstallateure, Gartenbauer und viele mehr. Schauen Sie in unserer Suche nach Ihrem gewünschten Gewerk.',
  },
];

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function FAQPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GENERAL_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Häufige Fragen (FAQ)
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
          Alles, was Sie über Handwerker-Kontakte wissen müssen.
        </p>

        <div className="space-y-6">
          {GENERAL_FAQS.map((faq, i) => (
            <details key={i} className="group border border-gray-200 dark:border-gray-700 rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                {faq.question}
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Fragen zu bestimmten Gewerken?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Auf unseren Kostenseiten finden Sie detaillierte FAQs zu einzelnen Handwerkerberufen.
          </p>
          <div className="flex flex-wrap gap-2">
            {SEO_CATEGORIES.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${lang}/kosten/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  );
}
