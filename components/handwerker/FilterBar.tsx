'use client';
// ============================================================
// components/handwerker/FilterBar.tsx
// Client component - filteri koji mijenjaju URL bez reloada
// ============================================================
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { GEWERK_LABELS, STAEDTE, type GewerkType } from '@/lib/handwerker-dynamic/types';

interface FilterBarProps {
  lang: string;
  currentStadt: string;
  currentGewerk?: string;
  verfuegbareGewerke: { gewerk: string; anzahl: number }[];
  initialFilters: {
    bewertung_min?: number;
    preis_max?: number;
    sortierung?: string;
  };
}

export function FilterBar({
  lang,
  currentStadt,
  currentGewerk,
  verfuegbareGewerke,
  initialFilters,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [bewertung, setBewertung] = useState(initialFilters.bewertung_min || 0);
  const [sortierung, setSortierung] = useState(initialFilters.sortierung || 'bewertung');

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== '0' && value !== '200') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete('seite');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Stadt wechseln → neue Route (koristi postojeću strukturu)
  const handleStadtChange = (newCity: string) => {
    if (currentGewerk) {
      router.push(`/${lang}/handwerker/kategorie/${currentGewerk}/${newCity}`);
    } else {
      router.push(`/${lang}/handwerker/stadt/${newCity}`);
    }
  };

  // Gewerk wechseln → neue Route
  const handleGewerkChange = (newGewerk: string) => {
    if (newGewerk === 'alle') {
      router.push(`/${lang}/handwerker/stadt/${currentStadt}`);
    } else {
      router.push(`/${lang}/handwerker/kategorie/${newGewerk}/${currentStadt}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stadt */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Stadt
          </label>
          <select
            value={currentStadt}
            onChange={(e) => handleStadtChange(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          >
            {STAEDTE.map((stadt) => (
              <option key={stadt.slug} value={stadt.slug}>{stadt.name}</option>
            ))}
          </select>
        </div>

        {/* Gewerk */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Gewerk
          </label>
          <select
            value={currentGewerk || 'alle'}
            onChange={(e) => handleGewerkChange(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          >
            <option value="alle">Alle Gewerke</option>
            {verfuegbareGewerke.map(({ gewerk, anzahl }) => (
              <option key={gewerk} value={gewerk}>
                {GEWERK_LABELS[gewerk as GewerkType] || gewerk} ({anzahl})
              </option>
            ))}
          </select>
        </div>

        {/* Min Bewertung */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Min. Bewertung
          </label>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="5" step="0.5" value={bewertung}
              onChange={(e) => { const v = Number(e.target.value); setBewertung(v); updateFilters({ bewertung: v.toString() }); }}
              className="flex-1 h-10" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[2.5rem] text-right">
              {bewertung > 0 ? `${bewertung}★` : 'Alle'}
            </span>
          </div>
        </div>

        {/* Sortierung */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Sortierung
          </label>
          <select
            value={sortierung}
            onChange={(e) => { setSortierung(e.target.value); updateFilters({ sort: e.target.value }); }}
            className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          >
            <option value="bewertung">Beste Bewertung</option>
            <option value="preis_aufsteigend">Preis aufsteigend</option>
            <option value="preis_absteigend">Preis absteigend</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {isPending && (
        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Wird geladen...
        </div>
      )}
    </div>
  );
}
