// ============================================================
// scripts/seed-handwerker.ts
// Ubaci verificirane majstore u Neon DB
// Pokreni: npm run seed:handwerker
// ============================================================
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const sql = neon(process.env.DATABASE_URL!);

interface VerifiedHandwerker {
  firma: string;
  name?: string;
  gewerk: string;
  stadt?: string;
  adresse?: string;
  plz: string;
  beschreibung?: string;
  telefon: string;
  email?: string;
  webseite?: string;
  stundensatz_min?: number;
  stundensatz_max?: number;
  bewertung_avg: number;
  bewertung_count: number;
  verified?: boolean;
}

const VERIFIED_PATH = path.join(__dirname, 'handwerker-verified.json');

// Default hourly rates by trade (München prices)
const DEFAULT_RATES: Record<string, { min: number; max: number }> = {
  elektriker: { min: 55, max: 90 },
  klempner: { min: 50, max: 80 },
  maler: { min: 40, max: 65 },
  schreiner: { min: 55, max: 85 },
  dachdecker: { min: 55, max: 90 },
  fliesenleger: { min: 45, max: 70 },
  heizungsbauer: { min: 55, max: 95 },
  installateur: { min: 50, max: 85 },
  maurer: { min: 50, max: 80 },
  zimmermann: { min: 55, max: 90 },
  gartenbauer: { min: 45, max: 75 },
  schluesseldienst: { min: 60, max: 95 },
  umzugsunternehmen: { min: 40, max: 65 },
  reinigungsdienst: { min: 30, max: 50 },
  bodenleger: { min: 40, max: 70 },
};

function extractNameFromFirma(firma: string): string {
  // Try to extract a person name from company name
  // e.g. "Müller Elektrotechnik GmbH" → "Müller"
  // Falls back to firma itself
  const cleaned = firma
    .replace(/\b(GmbH|UG|AG|OHG|KG|e\.K\.|GbR|mbH|Co\.|&)\b/gi, '')
    .replace(/\b(Elektro|Sanitär|Maler|Bau|Dach|Fliesen|Heizung|Garten|Schlüssel|Umzug|Reinigung|Boden)\w*/gi, '')
    .trim();
  return cleaned || firma;
}

function extractStadtSlug(adresse: string): string {
  if (/münchen/i.test(adresse)) return 'muenchen';
  if (/berlin/i.test(adresse)) return 'berlin';
  if (/hamburg/i.test(adresse)) return 'hamburg';
  return 'muenchen'; // Default for this seed
}

async function seed() {
  if (!fs.existsSync(VERIFIED_PATH)) {
    console.error(`❌ Datei nicht gefunden: ${VERIFIED_PATH}`);
    console.error('');
    console.error('Schritte:');
    console.error('  1. Führe zuerst aus: npm run scrape:handwerker');
    console.error('  2. Prüfe scripts/handwerker-raw.json');
    console.error('  3. Kopiere geprüfte Einträge nach scripts/handwerker-verified.json');
    console.error('  4. Führe dann erneut aus: npm run seed:handwerker');
    process.exit(1);
  }

  const raw = fs.readFileSync(VERIFIED_PATH, 'utf-8');
  const handwerker: VerifiedHandwerker[] = JSON.parse(raw);

  console.log(`🌱 Seeding ${handwerker.length} verifizierte Handwerker...\n`);

  let inserted = 0;
  let skipped = 0;

  for (const h of handwerker) {
    const name = h.name || extractNameFromFirma(h.firma);
    const stadt = h.stadt || (h.adresse ? extractStadtSlug(h.adresse) : 'muenchen');
    const rates = DEFAULT_RATES[h.gewerk] || { min: 45, max: 75 };

    try {
      // Check for duplicate by firma + stadt
      const existing = await sql(
        `SELECT id FROM handwerker WHERE LOWER(firma) = LOWER($1) AND stadt = $2`,
        [h.firma, stadt]
      );

      if (existing.length > 0) {
        console.log(`  ⏭ ${h.firma} — bereits vorhanden`);
        skipped++;
        continue;
      }

      await sql(
        `INSERT INTO handwerker
          (name, firma, gewerk, stadt, plz, beschreibung, telefon, email, webseite,
           stundensatz_min, stundensatz_max, bewertung_avg, bewertung_count, verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          name,
          h.firma,
          h.gewerk,
          stadt,
          h.plz || '80000',
          h.beschreibung || '',
          h.telefon || '',
          h.email || '',
          h.webseite || null,
          h.stundensatz_min ?? rates.min,
          h.stundensatz_max ?? rates.max,
          h.bewertung_avg || 0,
          h.bewertung_count || 0,
          h.verified ?? false,
        ]
      );

      inserted++;
      console.log(`  ✓ ${h.firma} (${h.gewerk}, ${stadt})`);
    } catch (err) {
      console.error(`  ✗ ${h.firma}: ${(err as Error).message}`);
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ Eingefügt: ${inserted}`);
  console.log(`⏭  Übersprungen: ${skipped}`);
  console.log(`❌ Fehler: ${handwerker.length - inserted - skipped}`);

  // Summary
  const stats = await sql(
    `SELECT stadt, gewerk, COUNT(*) as anzahl
     FROM handwerker
     GROUP BY stadt, gewerk
     ORDER BY stadt, anzahl DESC`
  );

  console.log(`\n📊 Datenbank-Übersicht:`);
  let currentStadt = '';
  for (const row of stats) {
    if (row.stadt !== currentStadt) {
      currentStadt = row.stadt as string;
      console.log(`\n  ${currentStadt}:`);
    }
    console.log(`    ${row.gewerk}: ${row.anzahl}`);
  }
  console.log('═══════════════════════════════════════');
}

seed().catch(console.error);
