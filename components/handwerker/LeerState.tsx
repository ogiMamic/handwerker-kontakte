// ============================================================
// components/handwerker/LeerState.tsx
// Pametno prazno stanje - daje vrijednost i bez rezultata
// ============================================================
import { GEWERK_LABELS, getStadtBySlug, type GewerkType } from '@/lib/handwerker-dynamic/types';

interface Props {
  lang: string;
  stadtName: string;
  stadtSlug: string;
  gewerkLabel?: string;
  gewerk?: string;
  nachbarStaedte: { stadt: string; anzahl: number }[];
  verfuegbareGewerke: { gewerk: string; anzahl: number }[];
}

export function LeerState({ lang, stadtName, stadtSlug, gewerkLabel, gewerk, nachbarStaedte, verfuegbareGewerke }: Props) {
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-2xl">
          🔍
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {gewerkLabel
            ? `Noch keine ${gewerkLabel} in ${stadtName} registriert`
            : `Noch keine Handwerker in ${stadtName} registriert`}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Wir bauen unser Netzwerk in {stadtName} gerade auf. Schauen Sie sich die Alternativen unten an!
        </p>
      </div>

      {/* CTA za majstore */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8 text-center">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Sie sind {gewerkLabel || 'Handwerker'} in {stadtName}?
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-4">
          Registrieren Sie sich jetzt kostenlos und erhalten Sie direkte Anfragen von Kunden in Ihrer Region.
        </p>
        <a href={`/${lang}/handwerker/registrieren`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm">
          Kostenlos registrieren <span>→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nachbarStaedte.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {gewerkLabel || 'Handwerker'} in der Nähe
            </h3>
            <ul className="space-y-2">
              {nachbarStaedte.map(({ stadt, anzahl }) => (
                <li key={stadt}>
                  <a href={gewerk ? `/${lang}/handwerker/kategorie/${gewerk}/${stadt}` : `/${lang}/handwerker/stadt/${stadt}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                      {getStadtBySlug(stadt)?.name || stadt}
                    </span>
                    <span className="text-sm text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {anzahl} {anzahl === 1 ? 'Betrieb' : 'Betriebe'}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {verfuegbareGewerke.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Verfügbare Gewerke in {stadtName}
            </h3>
            <ul className="space-y-2">
              {verfuegbareGewerke.map(({ gewerk: g, anzahl }) => (
                <li key={g}>
                  <a href={`/${lang}/handwerker/kategorie/${g}/${stadtSlug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                      {GEWERK_LABELS[g as GewerkType] || g}
                    </span>
                    <span className="text-sm text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{anzahl}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
