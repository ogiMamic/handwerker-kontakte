// ============================================================
// components/handwerker/HandwerkerListe.tsx
// ============================================================
import { GEWERK_LABELS, type Handwerker, type GewerkType } from '@/lib/handwerker-dynamic/types';

interface Props {
  lang: string;
  handwerker: Handwerker[];
  total: number;
  currentPage: number;
  stadtSlug: string;
  gewerkSlug?: string;
}

export function HandwerkerListe({ lang, handwerker, total, currentPage, stadtSlug, gewerkSlug }: Props) {
  const perPage = 12;
  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {total} {total === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {handwerker.map((hw) => (
          <a key={hw.id} href={`/${lang}/handwerker/${hw.id}`}
            className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group cursor-pointer">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold text-sm shrink-0">
                {hw.firma.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                  {hw.firma}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {GEWERK_LABELS[hw.gewerk as GewerkType] || hw.gewerk}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-sm ${s <= Math.round(hw.bewertung_avg) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {hw.bewertung_avg.toFixed(1)} ({hw.bewertung_count})
              </span>
              {hw.verified && (
                <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  Verifiziert
                </span>
              )}
            </div>

            {hw.beschreibung && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{hw.beschreibung}</p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              {hw.stundensatz_min && hw.stundensatz_max ? (
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {hw.stundensatz_min}–{hw.stundensatz_max} €/Std.
                </span>
              ) : (
                <span className="text-sm text-gray-400">Preis auf Anfrage</span>
              )}
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-800 transition-colors">
                Profil ansehen →
              </span>
            </div>
          </a>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <a href={`?seite=${currentPage - 1}`}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              ← Zurück
            </a>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400 px-3">Seite {currentPage} von {totalPages}</span>
          {currentPage < totalPages && (
            <a href={`?seite=${currentPage + 1}`}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Weiter →
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
