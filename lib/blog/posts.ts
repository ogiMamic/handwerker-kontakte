import type { BlogPost, BlogCategory } from "./types"

export const BLOG_POSTS: BlogPost[] = [
  // ─── Post 1: Bad renovieren Kosten ───
  {
    slug: "badezimmer-renovieren-kosten",
    title: "Badezimmer renovieren: Kosten, Dauer & Tipps für 2026",
    description: "Was kostet eine Badsanierung? Aktuelle Preise für Fliesen, Sanitär und Komplettrenovierung. Mit Kostenbeispielen und Spartipps.",
    category: "kosten",
    publishedAt: "2026-03-01",
    readingTime: 8,
    relatedCategory: "klempner",
    tags: ["badsanierung", "kosten", "renovierung", "sanitär", "fliesen"],
    sections: [
      {
        heading: "Was kostet eine Badsanierung?",
        content: `<p>Eine Badezimmer-Renovierung gehört zu den häufigsten Sanierungsprojekten in deutschen Haushalten. Die Kosten variieren stark - von einer einfachen Modernisierung für 3.000 € bis zur Luxus-Komplettsanierung für über 25.000 €.</p>
<p>Der wichtigste Kostenfaktor ist der Umfang: Reicht ein neuer Anstrich, oder soll das komplette Bad inklusive Rohrleitungen erneuert werden? Hier eine Übersicht der typischen Kosten.</p>`,
      },
      {
        heading: "Kostenübersicht nach Leistung",
        content: `<p>Für ein durchschnittliches Bad (ca. 8 qm) können Sie mit folgenden Kosten rechnen:</p>
<ul>
<li><strong>Fliesen entfernen und neu verlegen:</strong> 2.000–4.500 € (Material + Arbeit)</li>
<li><strong>Sanitärobjekte tauschen</strong> (WC, Waschbecken, Dusche): 1.500–4.000 €</li>
<li><strong>Neue Badewanne einbauen:</strong> 800–3.000 € inkl. Einbau</li>
<li><strong>Rohrleitungen erneuern:</strong> 1.500–3.500 €</li>
<li><strong>Elektrik (Steckdosen, Beleuchtung):</strong> 500–1.500 €</li>
<li><strong>Komplettsanierung:</strong> 8.000–20.000 €</li>
</ul>
<p>Hinweis: Barrierefreie Umbauten können durch die KfW gefördert werden (Programm 455-B).</p>`,
      },
      {
        heading: "Dauer einer Badsanierung",
        content: `<p>Eine einfache Modernisierung dauert ca. 1 Woche. Bei einer Komplettsanierung sollten Sie 2–4 Wochen einplanen. Beachten Sie Trocknungszeiten für Estrich (4–6 Wochen) und Fliesenkleber (24–48 Stunden).</p>
<p>Tipp: Planen Sie das Projekt außerhalb der Hauptsaison (Herbst/Winter), um schneller einen Handwerker zu finden und ggf. bessere Preise zu bekommen.</p>`,
      },
      {
        heading: "5 Spartipps für die Badsanierung",
        content: `<ol>
<li><strong>Mehrere Angebote einholen:</strong> Vergleichen Sie mindestens 3 Handwerker auf Handwerker-Kontakte.</li>
<li><strong>Fliesen auf Fliesen:</strong> Neue Fliesen über alte kleben spart Abrisskosten (ca. 500–1.000 €).</li>
<li><strong>Standardmaße wählen:</strong> Sonderanfertigungen kosten 30–50% mehr als Standardgrößen.</li>
<li><strong>Eigenleistung:</strong> Abrissarbeiten und Malerarbeiten können Sie selbst übernehmen.</li>
<li><strong>Förderungen nutzen:</strong> KfW-Zuschüsse für barrierefreien Umbau oder energetische Sanierung prüfen.</li>
</ol>`,
      },
    ],
  },

  // ─── Post 2: Wärmepumpe vs Gasheizung ───
  {
    slug: "waermepumpe-vs-gasheizung",
    title: "Wärmepumpe vs. Gasheizung: Kosten, Vor- und Nachteile im Vergleich",
    description: "Wärmepumpe oder Gasheizung? Anschaffungskosten, Betriebskosten, Förderungen und Umweltbilanz im direkten Vergleich 2026.",
    category: "vergleich",
    publishedAt: "2026-02-15",
    readingTime: 10,
    relatedCategory: "heizung",
    tags: ["wärmepumpe", "gasheizung", "heizung", "vergleich", "förderung", "energiewende"],
    sections: [
      {
        heading: "Heizungstausch 2026: Welche Heizung lohnt sich?",
        content: `<p>Seit dem Gebäudeenergiegesetz (GEG) 2024 müssen neue Heizungen mindestens 65% erneuerbare Energie nutzen. Für viele Hausbesitzer stellt sich die Frage: Wärmepumpe oder Gas-Hybridheizung?</p>
<p>Wir vergleichen beide Systeme in den wichtigsten Kategorien: Anschaffungskosten, laufende Kosten, Förderungen und Umweltbilanz.</p>`,
      },
      {
        heading: "Anschaffungskosten im Vergleich",
        content: `<p>Die Anschaffung einer Wärmepumpe ist deutlich teurer, wird aber stark gefördert:</p>
<ul>
<li><strong>Luft-Wasser-Wärmepumpe:</strong> 15.000–30.000 € (vor Förderung)</li>
<li><strong>Erdwärmepumpe:</strong> 20.000–40.000 € (vor Förderung)</li>
<li><strong>Gasbrennwertkessel:</strong> 6.000–12.000 €</li>
<li><strong>Gas-Hybridheizung:</strong> 12.000–20.000 €</li>
</ul>
<p>Nach Abzug der BAFA/KfW-Förderung (bis zu 70% Zuschuss) kann eine Wärmepumpe auf 8.000–15.000 € Eigenanteil sinken.</p>`,
      },
      {
        heading: "Laufende Kosten pro Jahr",
        content: `<p>Bei einem Einfamilienhaus mit 150 qm Wohnfläche und 20.000 kWh Heizbedarf:</p>
<ul>
<li><strong>Wärmepumpe (COP 3,5):</strong> ca. 1.700 € Stromkosten/Jahr</li>
<li><strong>Gasheizung:</strong> ca. 2.400 € Gaskosten/Jahr (inkl. CO₂-Abgabe)</li>
</ul>
<p>Die CO₂-Abgabe auf Gas steigt jährlich - bis 2027 wird der Preisunterschied noch größer. Wärmepumpen werden durch sinkende Strompreise und eigene PV-Anlagen zunehmend günstiger.</p>`,
      },
      {
        heading: "Förderungen 2026",
        content: `<p>Die Bundesförderung für effiziente Gebäude (BEG) fördert den Heizungstausch mit:</p>
<ul>
<li><strong>Grundförderung:</strong> 30% für Wärmepumpen</li>
<li><strong>Einkommensbonus:</strong> +30% bei Haushaltseinkommen unter 40.000 €</li>
<li><strong>Geschwindigkeitsbonus:</strong> +20% bei Tausch einer alten Öl-/Gasheizung</li>
<li><strong>Maximaler Zuschuss:</strong> bis zu 70% (gedeckelt auf 30.000 € Investitionskosten)</li>
</ul>
<p>Gasheizungen werden seit 2024 nicht mehr gefördert. Prüfen Sie Ihren Förderanspruch beim BAFA.</p>`,
      },
      {
        heading: "Fazit: Welche Heizung ist die richtige?",
        content: `<p>Für die meisten Eigenheimbesitzer ist eine Wärmepumpe langfristig die bessere Wahl - besonders mit der hohen Förderung und steigenden Gaspreisen. Eine Gas-Hybridheizung kann ein Kompromiss für schlecht gedämmte Altbauten sein.</p>
<p>Lassen Sie sich von einem erfahrenen Heizungsinstallateur beraten. Auf Handwerker-Kontakte finden Sie Fachbetriebe in Ihrer Nähe, die beide Systeme installieren und Sie unabhängig beraten können.</p>`,
      },
    ],
  },

  // ─── Post 3: Handwerker finden Checkliste ───
  {
    slug: "guten-handwerker-finden-checkliste",
    title: "Guten Handwerker finden: Die ultimative Checkliste 2026",
    description: "Wie finde ich einen zuverlässigen Handwerker? 10-Punkte-Checkliste mit Tipps zu Angeboten, Bewertungen, Verträgen und Warnsignalen.",
    category: "checkliste",
    publishedAt: "2026-02-01",
    readingTime: 6,
    tags: ["handwerker finden", "checkliste", "tipps", "angebot", "bewertungen"],
    sections: [
      {
        heading: "Warum die richtige Handwerkerwahl so wichtig ist",
        content: `<p>Einen guten Handwerker zu finden ist nicht leicht. Laut einer Umfrage des Zentralverbands des Deutschen Handwerks warten Kunden im Schnitt 4–8 Wochen auf einen Termin. Umso wichtiger ist es, gleich den richtigen zu wählen - denn Pfusch am Bau wird schnell teuer.</p>
<p>Mit dieser 10-Punkte-Checkliste finden Sie einen zuverlässigen Handwerker und vermeiden die häufigsten Fehler.</p>`,
      },
      {
        heading: "Checkliste: 10 Punkte für die Handwerkersuche",
        content: `<ol>
<li><strong>Mindestens 3 Angebote einholen</strong> - Vergleichen Sie Preise, aber auch den Leistungsumfang. Das günstigste Angebot ist nicht immer das beste.</li>
<li><strong>Schriftlichen Kostenvoranschlag verlangen</strong> - Mündliche Absprachen sind im Streitfall wertlos. Ein KV sollte alle Leistungen, Material und Stundensätze aufschlüsseln.</li>
<li><strong>Bewertungen lesen</strong> - Prüfen Sie Online-Bewertungen auf Handwerker-Kontakte, Google und anderen Portalen. Achten Sie auf wiederkehrende Muster, nicht einzelne Ausreißer.</li>
<li><strong>Qualifikationen prüfen</strong> - Meisterbrief, Handwerkskammer-Eintragung, Innungsmitgliedschaft sind Qualitätsmerkmale.</li>
<li><strong>Referenzen anfragen</strong> - Seriöse Betriebe zeigen gerne Fotos früherer Projekte oder nennen Referenzkunden.</li>
<li><strong>Gewährleistung klären</strong> - Gesetzlich stehen Ihnen 5 Jahre Gewährleistung zu (bei VOB-Verträgen 4 Jahre). Lassen Sie sich das schriftlich bestätigen.</li>
<li><strong>Versicherung prüfen</strong> - Fragen Sie nach Betriebshaftpflicht. Bei Schäden am Eigentum muss der Handwerker haften können.</li>
<li><strong>Zahlungsplan vereinbaren</strong> - Nie den vollen Betrag im Voraus zahlen. Üblich sind Abschlagszahlungen nach Baufortschritt.</li>
<li><strong>Termin schriftlich festhalten</strong> - Vereinbaren Sie Start- und Endtermin schriftlich, idealerweise mit Vertragsstrafe bei Verzug.</li>
<li><strong>Abnahme dokumentieren</strong> - Prüfen Sie die Arbeit bei Fertigstellung gründlich und dokumentieren Sie eventuelle Mängel schriftlich.</li>
</ol>`,
      },
      {
        heading: "Warnsignale: Wann Sie stutzig werden sollten",
        content: `<ul>
<li>Der Handwerker verlangt Vorkasse oder Barzahlung ohne Rechnung</li>
<li>Kein schriftliches Angebot oder extrem vages Angebot</li>
<li>Keine Angabe zur Gewährleistung</li>
<li>Auffällig günstiger Preis ohne Erklärung</li>
<li>Keine Erreichbarkeit oder ständig wechselnde Ansprechpartner</li>
<li>Druck, sofort zuzusagen („Nur heute zu diesem Preis")</li>
</ul>`,
      },
    ],
  },

  // ─── Post 4: Wohnung streichen Kosten ───
  {
    slug: "wohnung-streichen-kosten",
    title: "Wohnung streichen lassen: Kosten pro qm und Spartipps",
    description: "Was kostet es, eine Wohnung streichen zu lassen? Preise pro Quadratmeter für Wände, Decken und Fassade. Plus: Wann Sie selbst streichen können.",
    category: "kosten",
    publishedAt: "2026-01-20",
    readingTime: 7,
    relatedCategory: "maler",
    tags: ["wohnung streichen", "maler kosten", "streichen kosten pro qm", "renovierung"],
    sections: [
      {
        heading: "Was kostet ein Maler pro Quadratmeter?",
        content: `<p>Die Kosten für einen professionellen Maler liegen in Deutschland zwischen 8 und 15 € pro Quadratmeter Wandfläche (inklusive Material). Für eine 3-Zimmer-Wohnung (ca. 75 qm Wohnfläche, ca. 180 qm Wandfläche) ergeben sich Gesamtkosten von ca. 1.500–3.000 €.</p>
<p>Der Quadratmeterpreis hängt von mehreren Faktoren ab: Zustand der Wände, Farbe (weiß ist günstiger als bunte Farben), Raumhöhe und ob Decken mitgestrichen werden.</p>`,
      },
      {
        heading: "Kostenbeispiele nach Wohnungsgröße",
        content: `<ul>
<li><strong>1-Zimmer-Wohnung (30 qm):</strong> 600–1.200 €</li>
<li><strong>2-Zimmer-Wohnung (55 qm):</strong> 1.000–2.000 €</li>
<li><strong>3-Zimmer-Wohnung (75 qm):</strong> 1.500–3.000 €</li>
<li><strong>4-Zimmer-Wohnung (100 qm):</strong> 2.000–4.000 €</li>
<li><strong>Einfamilienhaus (150 qm):</strong> 3.000–6.000 €</li>
</ul>
<p>Zusatzkosten: Tapete entfernen (+5–10 €/qm), Spachteln und Glätten (+10–20 €/qm), Farbige Akzentwände (+3–5 €/qm Aufpreis).</p>`,
      },
      {
        heading: "Selbst streichen oder Profi beauftragen?",
        content: `<p>Einfache Malerarbeiten (weiße Wände in gutem Zustand) können Sie selbst erledigen. Ein Profi lohnt sich besonders bei:</p>
<ul>
<li>Hohen Räumen oder Treppenhäusern (Sicherheit!)</li>
<li>Alten Tapeten, die entfernt werden müssen</li>
<li>Rissen oder Unebenheiten in den Wänden</li>
<li>Spezialtechniken (Wischtechnik, Betonoptik)</li>
<li>Schimmelbefall (hier bitte immer einen Fachmann)</li>
</ul>
<p>Materialkosten beim Selbermachen: ca. 1–3 €/qm für Farbe + Abdeckmaterial. Sie sparen ca. 60–70% gegenüber einem Profi.</p>`,
      },
      {
        heading: "Streichen bei Auszug: Muss ich als Mieter zahlen?",
        content: `<p>Eine der häufigsten Fragen: Muss ich beim Auszug die Wohnung streichen? Die Antwort: Es kommt auf den Mietvertrag an.</p>
<p>Der Bundesgerichtshof hat entschieden: Starre Renovierungsklauseln (z.B. „alle 3 Jahre streichen") sind unwirksam. Flexible Klauseln („bei Bedarf in neutralen Farben") sind zulässig. Wenn keine wirksame Klausel besteht, müssen Sie nicht streichen - der Vermieter kann die Kosten aber ggf. von der Kaution abziehen, wenn die Wohnung übermäßig abgenutzt wurde.</p>
<p>Im Zweifel: Lassen Sie Ihren Mietvertrag von einem Mieterverein prüfen.</p>`,
      },
    ],
  },

  // ─── Post 5: Photovoltaik Kosten & Förderung ───
  {
    slug: "photovoltaik-kosten-foerderung",
    title: "Photovoltaik 2026: Kosten, Förderung & Wirtschaftlichkeit",
    description: "Was kostet eine Solaranlage 2026? Aktuelle Preise für PV-Anlage und Speicher, Förderungen, Einspeisevergütung und ab wann sich die Investition rechnet.",
    category: "foerderung",
    publishedAt: "2026-03-10",
    readingTime: 9,
    relatedCategory: "photovoltaik",
    tags: ["photovoltaik", "solaranlage", "kosten", "förderung", "einspeisevergütung", "stromspeicher"],
    sections: [
      {
        heading: "Lohnt sich Photovoltaik 2026 noch?",
        content: `<p>Kurze Antwort: Ja, mehr denn je. Die Modulpreise sind seit 2022 um über 40% gefallen, während die Strompreise hoch bleiben. Eine typische Solaranlage auf einem Einfamilienhaus amortisiert sich in 8–12 Jahren - und produziert dann noch 15–20 Jahre lang quasi kostenlosen Strom.</p>
<p>Dazu kommen Steuervorteile: Seit 2023 ist der Kauf und Betrieb von PV-Anlagen bis 30 kWp komplett von der Umsatzsteuer befreit (0% MwSt.).</p>`,
      },
      {
        heading: "Aktuelle Kosten einer PV-Anlage",
        content: `<ul>
<li><strong>5 kWp Anlage</strong> (ca. 30 qm Dachfläche): 8.000–12.000 € netto</li>
<li><strong>10 kWp Anlage</strong> (ca. 60 qm Dachfläche): 14.000–20.000 € netto</li>
<li><strong>15 kWp Anlage</strong> (ca. 90 qm Dachfläche): 18.000–26.000 € netto</li>
<li><strong>Stromspeicher 5 kWh:</strong> 4.000–7.000 € zusätzlich</li>
<li><strong>Stromspeicher 10 kWh:</strong> 7.000–12.000 € zusätzlich</li>
</ul>
<p>Die Preise sind inklusive Montage und Anmeldung. Durch die 0% MwSt. sparen Sie zusätzlich ca. 19% auf den Nettopreis.</p>`,
      },
      {
        heading: "Förderungen und Einspeisevergütung",
        content: `<p>Die Bundesförderung für PV-Anlagen läuft hauptsächlich über die Einspeisevergütung:</p>
<ul>
<li><strong>Volleinspeisung:</strong> ca. 12,9 Cent/kWh (bis 10 kWp)</li>
<li><strong>Überschusseinspeisung:</strong> ca. 8,1 Cent/kWh (der gängige Fall)</li>
</ul>
<p>Zusätzlich gibt es in vielen Bundesländern und Kommunen eigene Förderprogramme für Stromspeicher und Wallboxen. Prüfen Sie die Förderdatenbank des BMWi für Ihr Bundesland.</p>
<p>Tipp: Die Kombination PV + Speicher + Wallbox + Wärmepumpe maximiert Ihren Eigenverbrauch und damit Ihre Rendite.</p>`,
      },
      {
        heading: "So finden Sie den richtigen Solartechniker",
        content: `<p>Die Installation einer PV-Anlage erfordert einen qualifizierten Fachbetrieb. Achten Sie auf:</p>
<ul>
<li>Eintragung in die Handwerksrolle als Elektroinstallateur</li>
<li>Erfahrung mit PV-Anlagen (mindestens 20+ installierte Anlagen)</li>
<li>Unabhängige Beratung (nicht an einen Modulhersteller gebunden)</li>
<li>Transparente Angebote mit allen Kosten (Gerüst, Anmeldung, etc.)</li>
</ul>
<p>Auf Handwerker-Kontakte finden Sie zertifizierte Solartechniker in Ihrer Nähe. Vergleichen Sie kostenlos Angebote und Bewertungen.</p>`,
      },
    ],
  },
]

// ─── Helper functions ─────────────────────────────────────────

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .filter((p) =>
      p.category === post.category ||
      p.tags.some((t) => post.tags.includes(t)) ||
      p.relatedCategory === post.relatedCategory
    )
    .slice(0, limit)
}
