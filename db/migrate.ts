// ============================================================
// NeonDB migracija + seed podaci
// Pokreni: npx tsx db/migrate.ts
// ============================================================
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('🔧 Kreiranje tabela...');

  // Handwerker tabela
  await sql(`
    CREATE TABLE IF NOT EXISTS handwerker (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(200) NOT NULL,
      firma VARCHAR(300) NOT NULL,
      gewerk VARCHAR(50) NOT NULL,
      stadt VARCHAR(50) NOT NULL,
      plz VARCHAR(10) NOT NULL,
      beschreibung TEXT DEFAULT '',
      telefon VARCHAR(50) DEFAULT '',
      email VARCHAR(200) DEFAULT '',
      webseite VARCHAR(300),
      profilbild VARCHAR(500),
      stundensatz_min NUMERIC(6,2),
      stundensatz_max NUMERIC(6,2),
      bewertung_avg NUMERIC(2,1) DEFAULT 0,
      bewertung_count INTEGER DEFAULT 0,
      verified BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Indeksi za brze upite
  await sql(`CREATE INDEX IF NOT EXISTS idx_handwerker_stadt ON handwerker(stadt)`);
  await sql(`CREATE INDEX IF NOT EXISTS idx_handwerker_gewerk ON handwerker(gewerk)`);
  await sql(`CREATE INDEX IF NOT EXISTS idx_handwerker_stadt_gewerk ON handwerker(stadt, gewerk)`);
  await sql(`CREATE INDEX IF NOT EXISTS idx_handwerker_bewertung ON handwerker(bewertung_avg DESC)`);

  // Bewertungen tabela
  await sql(`
    CREATE TABLE IF NOT EXISTS bewertungen (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      handwerker_id UUID REFERENCES handwerker(id) ON DELETE CASCADE,
      autor_name VARCHAR(200) NOT NULL,
      sterne INTEGER CHECK (sterne >= 1 AND sterne <= 5),
      kommentar TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await sql(`CREATE INDEX IF NOT EXISTS idx_bewertungen_handwerker ON bewertungen(handwerker_id)`);

  console.log('✅ Tabele kreirane.');
}

async function seed() {
  console.log('🌱 Seeding test podataka...');

  // Provjeri da li već ima podataka
  const existing = await sql(`SELECT COUNT(*) as count FROM handwerker`);
  if (Number(existing[0]?.count) > 0) {
    console.log('ℹ️  Podaci već postoje, preskačem seed.');
    return;
  }

  const handwerkerData = [
    {
      name: 'Thomas Müller',
      firma: 'Elektro Müller GmbH',
      gewerk: 'elektriker',
      stadt: 'muenchen',
      plz: '80331',
      beschreibung: 'Seit über 20 Jahren Ihr zuverlässiger Partner für Elektroinstallationen in München. Smart-Home, Neuinstallation, Reparaturen.',
      telefon: '+49 89 12345678',
      email: 'info@elektro-mueller.de',
      stundensatz_min: 55,
      stundensatz_max: 85,
      bewertung_avg: 4.8,
      bewertung_count: 47,
      verified: true,
    },
    {
      name: 'Andreas Schmidt',
      firma: 'Malermeister Schmidt',
      gewerk: 'maler',
      stadt: 'muenchen',
      plz: '80469',
      beschreibung: 'Innen- und Außenanstriche, Tapezierarbeiten, Fassadensanierung. Meisterbetrieb seit 2010.',
      telefon: '+49 89 23456789',
      email: 'kontakt@maler-schmidt.de',
      stundensatz_min: 40,
      stundensatz_max: 65,
      bewertung_avg: 4.5,
      bewertung_count: 32,
      verified: true,
    },
    {
      name: 'Julia Becker',
      firma: 'Becker Sanitär & Heizung',
      gewerk: 'installateur',
      stadt: 'muenchen',
      plz: '80802',
      beschreibung: 'Komplette Badsanierung, Heizungsinstallation und Wartung. Notdienst 24/7.',
      telefon: '+49 89 34567890',
      email: 'service@becker-sanitaer.de',
      stundensatz_min: 50,
      stundensatz_max: 80,
      bewertung_avg: 4.9,
      bewertung_count: 63,
      verified: true,
    },
    {
      name: 'Michael Weber',
      firma: 'Weber Dachbau',
      gewerk: 'dachdecker',
      stadt: 'muenchen',
      plz: '81369',
      beschreibung: 'Dachsanierung, Flachdach, Steildach, Dachisolierung. Innungsbetrieb.',
      telefon: '+49 89 45678901',
      email: 'info@weber-dachbau.de',
      stundensatz_min: 55,
      stundensatz_max: 95,
      bewertung_avg: 4.3,
      bewertung_count: 18,
      verified: true,
    },
    {
      name: 'Stefan Fischer',
      firma: 'Fischer Holzbau & Schreinerei',
      gewerk: 'schreiner',
      stadt: 'muenchen',
      plz: '81541',
      beschreibung: 'Maßmöbel, Einbauschränke, Küchen, Türen. Individuelle Holzarbeiten nach Ihren Wünschen.',
      telefon: '+49 89 56789012',
      email: 'anfrage@fischer-holzbau.de',
      stundensatz_min: 50,
      stundensatz_max: 90,
      bewertung_avg: 4.7,
      bewertung_count: 28,
      verified: false,
    },
    {
      name: 'Peter König',
      firma: 'König Elektrotechnik',
      gewerk: 'elektriker',
      stadt: 'berlin',
      plz: '10115',
      beschreibung: 'Elektroinstallationen für Gewerbe und Privat. Smart-Home Spezialist in Berlin.',
      telefon: '+49 30 12345678',
      email: 'info@koenig-elektro.de',
      stundensatz_min: 45,
      stundensatz_max: 75,
      bewertung_avg: 4.6,
      bewertung_count: 41,
      verified: true,
    },
    {
      name: 'Lisa Hoffmann',
      firma: 'Hoffmann Malerbetrieb',
      gewerk: 'maler',
      stadt: 'berlin',
      plz: '10243',
      beschreibung: 'Kreative Wandgestaltung, Altbausanierung, Fassadenreinigung. Berlins buntester Malerbetrieb.',
      telefon: '+49 30 23456789',
      email: 'hallo@hoffmann-maler.de',
      stundensatz_min: 35,
      stundensatz_max: 60,
      bewertung_avg: 4.4,
      bewertung_count: 55,
      verified: true,
    },
    {
      name: 'Hans Braun',
      firma: 'Braun Fliesenleger',
      gewerk: 'fliesenleger',
      stadt: 'hamburg',
      plz: '20095',
      beschreibung: 'Fliesen für Bad, Küche und Terrasse. Mosaikarbeiten und Naturstein. Seit 2005 in Hamburg.',
      telefon: '+49 40 12345678',
      email: 'info@braun-fliesen.de',
      stundensatz_min: 45,
      stundensatz_max: 70,
      bewertung_avg: 4.2,
      bewertung_count: 22,
      verified: false,
    },
    {
      name: 'Karsten Schröder',
      firma: 'Schröder Heizungsbau',
      gewerk: 'heizungsbauer',
      stadt: 'hamburg',
      plz: '20149',
      beschreibung: 'Heizungsmodernisierung, Wärmepumpen, Gasheizung, Solarthermie. Energieberatung inklusive.',
      telefon: '+49 40 23456789',
      email: 'service@schroeder-heizung.de',
      stundensatz_min: 55,
      stundensatz_max: 90,
      bewertung_avg: 4.8,
      bewertung_count: 37,
      verified: true,
    },
  ];

  for (const hw of handwerkerData) {
    await sql(
      `INSERT INTO handwerker (name, firma, gewerk, stadt, plz, beschreibung, telefon, email, stundensatz_min, stundensatz_max, bewertung_avg, bewertung_count, verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        hw.name, hw.firma, hw.gewerk, hw.stadt, hw.plz,
        hw.beschreibung, hw.telefon, hw.email,
        hw.stundensatz_min, hw.stundensatz_max,
        hw.bewertung_avg, hw.bewertung_count, hw.verified,
      ]
    );
  }

  console.log(`✅ ${handwerkerData.length} Handwerker eingefügt.`);

  // Seed Bewertungen
  const handwerkerRows = await sql(`SELECT id, firma FROM handwerker LIMIT 5`);
  const kommentare = [
    'Sehr professionelle Arbeit, pünktlich und sauber. Kann ich nur empfehlen!',
    'Preis-Leistung stimmt. Würde ich wieder beauftragen.',
    'Schnell, kompetent und freundlich. Top Service!',
    'Gute Arbeit, allerdings etwas teurer als erwartet.',
    'Absolut zuverlässig. Hat alles wie besprochen gemacht.',
  ];

  for (let i = 0; i < Math.min(handwerkerRows.length, 5); i++) {
    await sql(
      `INSERT INTO bewertungen (handwerker_id, autor_name, sterne, kommentar)
       VALUES ($1, $2, $3, $4)`,
      [handwerkerRows[i].id, `Kunde ${i + 1}`, 4 + (i % 2), kommentare[i]]
    );
  }

  console.log('✅ Bewertungen eingefügt.');
}

async function main() {
  try {
    await migrate();
    await seed();
    console.log('\n🎉 Migration abgeschlossen!');
  } catch (err) {
    console.error('❌ Fehler:', err);
    process.exit(1);
  }
}

main();
