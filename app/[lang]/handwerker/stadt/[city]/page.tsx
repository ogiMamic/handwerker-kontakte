// ============================================================
// app/[lang]/handwerker/stadt/[city]/page.tsx
// ZAMJENA za postojeću mrtvu gradsku stranicu
// Sada: SSR + dinamički filteri + SEO sadržaj
// ============================================================
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getHandwerker, getStadtStats, getVerfuegbareGewerke, getNachbarStaedte,
  generateSEOContent, generateJsonLd, generateFaqJsonLd,
  getStadtBySlug, isValidStadt, GEWERK_LABELS, STAEDTE, type GewerkType,
} from '@/lib/handwerker-dynamic';
import { FilterBar } from '@/components/handwerker/FilterBar';
import { HandwerkerListe } from '@/components/handwerker/HandwerkerListe';
import { SEOTextBlock } from '@/components/handwerker/SEOTextBlock';
import { LeerState } from '@/components/handwerker/LeerState';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

// ─── SEO Metadata ──────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city } = await params;
  if (!isValidStadt(city)) return {};

  let stats: Awaited<ReturnType<typeof getStadtStats>>;
  try {
    stats = await getStadtStats(city);
  } catch {
    stats = { anzahl: 0, avgBewertung: 0, avgPreisMin: 0, avgPreisMax: 0, verifiedCount: 0 };
  }
  const seo = generateSEOContent(city, undefined, stats);

  return {
    title: seo.title,
    description: seo.metaDescription,
    robots: {
      index: stats.anzahl > 0,
      follow: true,
    },
    alternates: {
      canonical: `https://handwerker-kontakte.de/${lang}/handwerker/stadt/${city}`,
    },
    openGraph: {
      title: seo.h1,
      description: seo.metaDescription,
      url: `https://handwerker-kontakte.de/${lang}/handwerker/stadt/${city}`,
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
    },
  };
}

// ─── Pre-render sve definirane gradove ─────────────────────
export async function generateStaticParams() {
  return STAEDTE.map((stadt) => ({ city: stadt.slug }));
}

// ─── Page ──────────────────────────────────────────────────
export default async function StadtPage({ params, searchParams }: PageProps) {
  const { lang, city } = await params;
  const query = await searchParams;

  if (!isValidStadt(city)) {
    notFound();
  }

  const stadtInfo = getStadtBySlug(city)!;

  let handwerkerData: Awaited<ReturnType<typeof getHandwerker>>;
  let stats: Awaited<ReturnType<typeof getStadtStats>>;
  let gewerke: Awaited<ReturnType<typeof getVerfuegbareGewerke>>;
  let nachbarStaedte: Awaited<ReturnType<typeof getNachbarStaedte>>;

  try {
    [handwerkerData, stats, gewerke, nachbarStaedte] = await Promise.all([
      getHandwerker({
        stadt: city,
        bewertung_min: query.bewertung ? Number(query.bewertung) : undefined,
        preis_max: query.preis_max ? Number(query.preis_max) : undefined,
        sortierung: query.sort as any,
        seite: query.seite ? Number(query.seite) : 1,
      }),
      getStadtStats(city),
      getVerfuegbareGewerke(city),
      getNachbarStaedte(city),
    ]);
  } catch (error) {
    console.error(`[stadt/${city}] DB query failed:`, error);
    handwerkerData = { handwerker: [], total: 0 };
    stats = { anzahl: 0, avgBewertung: 0, avgPreisMin: 0, avgPreisMax: 0, verifiedCount: 0 };
    gewerke = [];
    nachbarStaedte = [];
  }

  const seo = generateSEOContent(city, undefined, stats);
  const jsonLd = generateJsonLd(stadtInfo.name, undefined, handwerkerData.handwerker);
  const faqJsonLd = generateFaqJsonLd(seo.faq);
  const hatErgebnisse = handwerkerData.handwerker.length > 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* H1 + Intro — ovo Google čita */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {seo.h1}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {seo.introText}
          </p>
        </header>

        {/* Stats kartica */}
        {stats.anzahl > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Betriebe" value={String(stats.anzahl)} />
            <StatCard label="Ø Bewertung" value={`${stats.avgBewertung}/5`} />
            <StatCard label="Ø Stundensatz" value={`${stats.avgPreisMin}–${stats.avgPreisMax} €`} />
            <StatCard label="Verifiziert" value={String(stats.verifiedCount)} />
          </div>
        )}

        {/* Filteri — client component */}
        <FilterBar
          lang={lang}
          currentStadt={city}
          verfuegbareGewerke={gewerke}
          initialFilters={{
            bewertung_min: query.bewertung ? Number(query.bewertung) : undefined,
            preis_max: query.preis_max ? Number(query.preis_max) : undefined,
            sortierung: query.sort as any,
          }}
        />

        {/* Rezultati ili pametno prazno stanje */}
        {hatErgebnisse ? (
          <HandwerkerListe
            lang={lang}
            handwerker={handwerkerData.handwerker}
            total={handwerkerData.total}
            currentPage={query.seite ? Number(query.seite) : 1}
            stadtSlug={city}
          />
        ) : (
          <LeerState
            lang={lang}
            stadtName={stadtInfo.name}
            stadtSlug={city}
            nachbarStaedte={nachbarStaedte}
            verfuegbareGewerke={gewerke}
          />
        )}

        {/* SEO tekst — uvijek vidljiv */}
        <SEOTextBlock preisInfo={seo.preisInfo} tipps={seo.tipps} faq={seo.faq} stadtName={stadtInfo.name} />

        {/* Interni linkovi: Gewerke u ovom gradu */}
        {gewerke.length > 0 && (
          <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Handwerker nach Gewerk in {stadtInfo.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {gewerke.map(({ gewerk: g, anzahl }) => (
                <a key={g} href={`/${lang}/handwerker/kategorie/${g}/${city}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors text-sm">
                  {GEWERK_LABELS[g as GewerkType] || g}
                  <span className="text-xs text-gray-500">({anzahl})</span>
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Interni linkovi: Drugi gradovi */}
        {nachbarStaedte.length > 0 && (
          <nav className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Handwerker in anderen Städten
            </h2>
            <div className="flex flex-wrap gap-2">
              {nachbarStaedte.map(({ stadt: s, anzahl }) => (
                <a key={s} href={`/${lang}/handwerker/stadt/${s}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-colors text-sm">
                  {getStadtBySlug(s)?.name || s}
                  <span className="text-xs text-gray-500">({anzahl})</span>
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3">
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
      <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">{value}</div>
    </div>
  );
}
