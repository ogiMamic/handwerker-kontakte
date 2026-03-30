// ============================================================
// app/[lang]/handwerker/kategorie/[slug]/[city]/page.tsx
// ZAMJENA: Gewerk + Grad kombinacija (npr. /de/handwerker/kategorie/elektriker/muenchen)
// ============================================================
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getHandwerker, getStadtStats, getNachbarStaedte, getVerfuegbareGewerke,
  generateSEOContent, generateJsonLd, generateFaqJsonLd,
  getStadtBySlug, isValidStadt, isValidGewerk, GEWERK_LABELS, STAEDTE, GEWERKE,
  type GewerkType,
} from '@/lib/handwerker-dynamic';
import { FilterBar } from '@/components/handwerker/FilterBar';
import { HandwerkerListe } from '@/components/handwerker/HandwerkerListe';
import { SEOTextBlock } from '@/components/handwerker/SEOTextBlock';
import { LeerState } from '@/components/handwerker/LeerState';

interface PageProps {
  params: Promise<{ lang: string; slug: string; city: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug, city } = await params;
  if (!isValidStadt(city) || !isValidGewerk(slug)) return {};

  const stats = await getStadtStats(city, slug);
  const seo = generateSEOContent(city, slug as GewerkType, stats);

  return {
    title: seo.title,
    description: seo.metaDescription,
    robots: {
      index: stats.anzahl > 0,
      follow: true,
    },
    alternates: {
      canonical: `https://handwerker-kontakte.de/${lang}/handwerker/kategorie/${slug}/${city}`,
    },
    openGraph: {
      title: seo.h1,
      description: seo.metaDescription,
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
    },
  };
}

export async function generateStaticParams() {
  const params: { slug: string; city: string }[] = [];
  for (const stadt of STAEDTE) {
    for (const gewerk of GEWERKE) {
      params.push({ slug: gewerk, city: stadt.slug });
    }
  }
  return params;
}

export default async function KategorieStadtPage({ params, searchParams }: PageProps) {
  const { lang, slug, city } = await params;
  const query = await searchParams;

  if (!isValidStadt(city) || !isValidGewerk(slug)) {
    notFound();
  }

  const stadtInfo = getStadtBySlug(city)!;
  const gewerkLabel = GEWERK_LABELS[slug as GewerkType];

  const [handwerkerData, stats, nachbarStaedte, gewerke] = await Promise.all([
    getHandwerker({
      stadt: city,
      gewerk: slug as GewerkType,
      bewertung_min: query.bewertung ? Number(query.bewertung) : undefined,
      preis_max: query.preis_max ? Number(query.preis_max) : undefined,
      sortierung: query.sort as any,
      seite: query.seite ? Number(query.seite) : 1,
    }),
    getStadtStats(city, slug),
    getNachbarStaedte(city, slug),
    getVerfuegbareGewerke(city),
  ]);

  const seo = generateSEOContent(city, slug as GewerkType, stats);
  const jsonLd = generateJsonLd(stadtInfo.name, gewerkLabel, handwerkerData.handwerker);
  const faqJsonLd = generateFaqJsonLd(seo.faq);
  const hatErgebnisse = handwerkerData.handwerker.length > 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <a href={`/${lang}/handwerker`} className="hover:text-blue-600 transition-colors">Handwerker</a>
          <span className="mx-2">›</span>
          <a href={`/${lang}/handwerker/kategorie/${slug}`} className="hover:text-blue-600 transition-colors">{gewerkLabel}</a>
          <span className="mx-2">›</span>
          <span className="text-gray-900 dark:text-gray-100">{stadtInfo.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{seo.h1}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{seo.introText}</p>
        </header>

        {/* Preis highlight */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-4 mb-8">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            Durchschnittliche Stundensätze für {gewerkLabel} in {stadtInfo.name}
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {stats.avgPreisMin > 0 ? `${stats.avgPreisMin}–${stats.avgPreisMax} € / Stunde` : seo.preisInfo}
          </div>
        </div>

        <FilterBar
          lang={lang}
          currentStadt={city}
          currentGewerk={slug}
          verfuegbareGewerke={gewerke}
          initialFilters={{
            bewertung_min: query.bewertung ? Number(query.bewertung) : undefined,
            preis_max: query.preis_max ? Number(query.preis_max) : undefined,
            sortierung: query.sort as any,
          }}
        />

        {hatErgebnisse ? (
          <HandwerkerListe
            lang={lang}
            handwerker={handwerkerData.handwerker}
            total={handwerkerData.total}
            currentPage={query.seite ? Number(query.seite) : 1}
            stadtSlug={city}
            gewerkSlug={slug}
          />
        ) : (
          <LeerState
            lang={lang}
            stadtName={stadtInfo.name}
            stadtSlug={city}
            gewerkLabel={gewerkLabel}
            gewerk={slug}
            nachbarStaedte={nachbarStaedte}
            verfuegbareGewerke={gewerke}
          />
        )}

        <SEOTextBlock preisInfo={seo.preisInfo} tipps={seo.tipps} faq={seo.faq} stadtName={stadtInfo.name} gewerkLabel={gewerkLabel} />

        {/* Drugi gewerke u ovom gradu */}
        <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Weitere Handwerker in {stadtInfo.name}</h2>
          <div className="flex flex-wrap gap-2">
            {gewerke.filter(({ gewerk: g }) => g !== slug).map(({ gewerk: g, anzahl }) => (
              <a key={g} href={`/${lang}/handwerker/kategorie/${g}/${city}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
                {GEWERK_LABELS[g as GewerkType] || g} <span className="text-xs text-gray-500">({anzahl})</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Isti gewerk u drugim gradovima */}
        {nachbarStaedte.length > 0 && (
          <nav className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{gewerkLabel} in anderen Städten</h2>
            <div className="flex flex-wrap gap-2">
              {nachbarStaedte.map(({ stadt: s, anzahl }) => (
                <a key={s} href={`/${lang}/handwerker/kategorie/${slug}/${s}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 hover:text-green-700 transition-colors text-sm">
                  {getStadtBySlug(s)?.name || s} <span className="text-xs text-gray-500">({anzahl})</span>
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
