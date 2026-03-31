// ============================================================
// lib/handwerker-dynamic/seo.ts
// SEO sadržaj — dinamički tekst za svaku grad/gewerk kombinaciju
// ============================================================
import { getStadtBySlug, GEWERK_LABELS, type GewerkType } from './types';

interface SEOContent {
  title: string;
  metaDescription: string;
  h1: string;
  introText: string;
  preisInfo: string;
  tipps: string[];
  faq: { frage: string; antwort: string }[];
}

const DURCHSCHNITT_PREISE: Partial<Record<GewerkType, { min: number; max: number }>> = {
  elektriker: { min: 45, max: 85 },
  installateur: { min: 40, max: 75 },
  maler: { min: 35, max: 65 },
  schreiner: { min: 45, max: 90 },
  dachdecker: { min: 50, max: 95 },
  fliesenleger: { min: 40, max: 70 },
  klempner: { min: 40, max: 80 },
  maurer: { min: 40, max: 75 },
  heizungsbauer: { min: 50, max: 90 },
  gartenbauer: { min: 35, max: 65 },
  schluesseldienst: { min: 60, max: 150 },
  reinigungsdienst: { min: 25, max: 45 },
  bodenleger: { min: 35, max: 70 },
};

const PREIS_FAKTOR: Record<string, number> = {
  muenchen: 1.25, frankfurt: 1.2, hamburg: 1.15,
  stuttgart: 1.15, duesseldorf: 1.1, koeln: 1.05,
  berlin: 1.0, nuernberg: 1.05, augsburg: 1.0,
};

export function generateSEOContent(
  stadtSlug: string,
  gewerk?: GewerkType,
  stats?: { anzahl: number; avgBewertung: number; avgPreisMin: number; avgPreisMax: number }
): SEOContent {
  const stadt = getStadtBySlug(stadtSlug);
  const stadtName = stadt?.name || stadtSlug;
  const bundesland = stadt?.bundesland || '';
  const gewerkLabel = gewerk ? GEWERK_LABELS[gewerk] : '';

  const faktor = PREIS_FAKTOR[stadtSlug] || 1.0;
  const preise = gewerk ? DURCHSCHNITT_PREISE[gewerk] : undefined;
  const preisMin = stats?.avgPreisMin || (preise ? Math.round(preise.min * faktor) : 40);
  const preisMax = stats?.avgPreisMax || (preise ? Math.round(preise.max * faktor) : 80);

  const anzahl = stats?.anzahl || 0;
  const bewertung = stats?.avgBewertung || 0;

  if (gewerk && gewerkLabel) {
    const gewerkBeschreibungen: Partial<Record<GewerkType, string>> = {
      elektriker: 'Ob Neuinstallation, Reparatur oder Smart-Home-Einrichtung: ein qualifizierter Elektriker sorgt für sichere Elektroinstallationen.',
      installateur: 'Von der Heizungsinstallation bis zur Badsanierung: Installateure kümmern sich um Ihre Wasser- und Heizungsanlagen.',
      maler: 'Innen- und Außenanstriche, Tapezierarbeiten oder Fassadensanierung: ein erfahrener Maler verwandelt Ihre Räume.',
      schreiner: 'Maßgefertigte Möbel, Einbauschränke oder Türen: ein Schreiner realisiert Ihre individuellen Wünsche aus Holz.',
      dachdecker: 'Dachsanierung, Neueindeckung oder Dachisolierung: ein Dachdecker schützt Ihr Zuhause von oben.',
      heizungsbauer: 'Heizungsanlage installieren, warten oder modernisieren: Heizungsbauer sorgen für Wärme und Energieeffizienz.',
    };

    return {
      title: `${gewerkLabel} in ${stadtName} | Preise ab ${preisMin} €/Std. | handwerker-kontakte.de`,
      metaDescription: `${gewerkLabel} in ${stadtName} finden: ${anzahl > 0 ? `${anzahl} Betriebe, ` : ''}Stundensätze ${preisMin}–${preisMax} €. Bewertungen lesen, Preise vergleichen, direkt beauftragen.`,
      h1: `${gewerkLabel} in ${stadtName}`,
      introText: `${gewerkBeschreibungen[gewerk] || `Sie suchen einen zuverlässigen ${gewerkLabel}?`} Finden Sie ${anzahl > 0 ? `${anzahl} geprüfte ${gewerkLabel}-Betriebe` : `qualifizierte ${gewerkLabel}-Betriebe`} in ${stadtName}${bundesland ? ` (${bundesland})` : ''}. ${bewertung > 0 ? `Durchschnittliche Bewertung: ${bewertung}/5 Sterne.` : ''}`,
      preisInfo: `${gewerkLabel} in ${stadtName} berechnen durchschnittlich ${preisMin}–${preisMax} € pro Stunde. Die genauen Kosten hängen von Umfang und Komplexität des Auftrags ab.`,
      tipps: [
        `Beschreiben Sie dem ${gewerkLabel} den Auftrag möglichst genau.`,
        `Fragen Sie nach einem schriftlichen Kostenvoranschlag.`,
        `Vereinbaren Sie einen Vor-Ort-Termin zur Besichtigung.`,
        `Prüfen Sie die Qualifikationen und Meisterbrief.`,
      ],
      faq: [
        { frage: `Was kostet ein ${gewerkLabel} in ${stadtName} pro Stunde?`, antwort: `${gewerkLabel} in ${stadtName} berechnen typischerweise zwischen ${preisMin} € und ${preisMax} € pro Stunde. Hinzu kommen ggf. Materialkosten und Anfahrt.` },
        { frage: `Woran erkenne ich einen guten ${gewerkLabel}?`, antwort: `Achten Sie auf: Eintrag in der Handwerksrolle, Meisterbrief, positive Bewertungen, transparente Preisgestaltung und eine ordentliche Gewerbeanmeldung.` },
        { frage: `Brauche ich für ${gewerkLabel}-Arbeiten eine Genehmigung?`, antwort: `Das hängt von der Art der Arbeit ab. Größere Umbauarbeiten erfordern oft eine Baugenehmigung. Ihr ${gewerkLabel} kann Sie hierzu beraten.` },
      ],
    };
  }

  // Stadt-only stranica
  return {
    title: `Handwerker in ${stadtName} finden | Geprüfte Betriebe | handwerker-kontakte.de`,
    metaDescription: `${anzahl > 0 ? `${anzahl} geprüfte` : 'Geprüfte'} Handwerker in ${stadtName} (${bundesland}) finden. Bewertungen, Preise vergleichen & direkt Kontakt aufnehmen. Kostenlos und unverbindlich.`,
    h1: `Handwerker in ${stadtName} finden`,
    introText: `Sie suchen einen zuverlässigen Handwerker in ${stadtName}? Auf handwerker-kontakte.de finden Sie ${anzahl > 0 ? `${anzahl} geprüfte Handwerksbetriebe` : 'qualifizierte Handwerksbetriebe'} in ${stadtName} und Umgebung. ${bewertung > 0 ? `Die durchschnittliche Bewertung liegt bei ${bewertung} von 5 Sternen.` : ''} Vergleichen Sie Preise, lesen Sie Bewertungen anderer Kunden und nehmen Sie direkt Kontakt auf.`,
    preisInfo: `Die Stundensätze für Handwerker in ${stadtName} variieren je nach Gewerk und Auftrag. Im Durchschnitt liegen sie zwischen 40 € und 90 € pro Stunde.`,
    tipps: [
      `Holen Sie mindestens 3 Angebote von verschiedenen Handwerkern in ${stadtName} ein.`,
      'Achten Sie auf Bewertungen und fragen Sie nach Referenzen.',
      'Klären Sie den Umfang der Arbeiten schriftlich vor Auftragsbeginn.',
      'Prüfen Sie, ob der Handwerker in der Handwerksrolle eingetragen ist.',
    ],
    faq: [
      { frage: `Was kostet ein Handwerker in ${stadtName}?`, antwort: `Die Kosten hängen vom Gewerk und Aufwand ab. Stundensätze in ${stadtName} liegen typischerweise zwischen 35 € und 95 €.` },
      { frage: `Wie finde ich einen guten Handwerker in ${stadtName}?`, antwort: `Auf handwerker-kontakte.de können Sie Handwerker nach Bewertung, Gewerk und Preis filtern. Achten Sie auf verifizierte Betriebe.` },
      { frage: `Wie schnell bekomme ich einen Termin?`, antwort: `In der Regel innerhalb von 1–2 Wochen. Bei Notfällen bieten einige Handwerker Sofortservice an.` },
    ],
  };
}

export function generateJsonLd(stadtName: string, gewerk?: string, handwerkerList?: { firma: string; bewertung_avg: number; bewertung_count: number }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: gewerk ? `${gewerk} in ${stadtName} finden` : `Handwerker in ${stadtName} finden`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: handwerkerList?.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'LocalBusiness',
          name: h.firma,
          ...(h.bewertung_count > 0 && {
            aggregateRating: { '@type': 'AggregateRating', ratingValue: h.bewertung_avg, reviewCount: h.bewertung_count, bestRating: 5 },
          }),
          areaServed: { '@type': 'City', name: stadtName },
        },
      })) || [],
    },
  };
}

export function generateFaqJsonLd(faq: { frage: string; antwort: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.frage,
      acceptedAnswer: { '@type': 'Answer', text: item.antwort },
    })),
  };
}
