// ============================================================
// components/handwerker/SEOTextBlock.tsx
// FAQ, savjeti, informacije o cijenama
// ============================================================

interface Props {
  preisInfo: string;
  tipps: string[];
  faq: { frage: string; antwort: string }[];
  stadtName: string;
  gewerkLabel?: string;
}

export function SEOTextBlock({ preisInfo, tipps, faq, stadtName, gewerkLabel }: Props) {
  return (
    <div className="mt-12 space-y-10">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {gewerkLabel ? `Kosten für ${gewerkLabel} in ${stadtName}` : `Handwerker-Kosten in ${stadtName}`}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{preisInfo}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {gewerkLabel ? `Tipps: ${gewerkLabel} in ${stadtName} beauftragen` : `Tipps: Handwerker in ${stadtName} beauftragen`}
        </h2>
        <div className="space-y-3">
          {tipps.map((tipp, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-medium">{i + 1}</span>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{tipp}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <details key={i} className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {item.frage}
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-5 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">{item.antwort}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
