// ============================================================
// scripts/scrape-handwerker.ts
// Scrape Handwerker aus Google Maps für München
// Pokreni: npm run scrape:handwerker
// ============================================================
import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface RawHandwerker {
  firma: string;
  gewerk: string;
  adresse: string;
  plz: string;
  telefon: string;
  webseite: string;
  bewertung_avg: number;
  bewertung_count: number;
  kategorie_google: string;
  scraped_at: string;
}

const SEARCH_QUERIES: { query: string; gewerk: string }[] = [
  { query: 'Elektriker München', gewerk: 'elektriker' },
  { query: 'Klempner München', gewerk: 'klempner' },
  { query: 'Maler München', gewerk: 'maler' },
  { query: 'Schreiner München', gewerk: 'schreiner' },
  { query: 'Dachdecker München', gewerk: 'dachdecker' },
  { query: 'Fliesenleger München', gewerk: 'fliesenleger' },
  { query: 'Heizungsbauer München', gewerk: 'heizungsbauer' },
  { query: 'Zimmermann München', gewerk: 'zimmermann' },
];

const OUTPUT_PATH = path.join(__dirname, 'handwerker-raw.json');
const MAX_RESULTS_PER_QUERY = 8;
const SCROLL_PAUSE_MS = 2000;

async function acceptCookies(page: Page) {
  try {
    // Google consent dialog
    const acceptBtn = page.locator('button:has-text("Alle akzeptieren"), button:has-text("Accept all")');
    if (await acceptBtn.isVisible({ timeout: 3000 })) {
      await acceptBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch {
    // No consent dialog
  }
}

async function scrollResultsList(page: Page, scrollCount: number) {
  const feed = page.locator('div[role="feed"]');
  if (await feed.isVisible({ timeout: 3000 })) {
    for (let i = 0; i < scrollCount; i++) {
      await feed.evaluate((el) => el.scrollBy(0, 800));
      await page.waitForTimeout(SCROLL_PAUSE_MS);
    }
  }
}

async function extractResultsFromList(page: Page, gewerk: string): Promise<RawHandwerker[]> {
  const results: RawHandwerker[] = [];

  // Google Maps results - each result has an aria-label with the business name
  const items = page.locator('div[role="feed"] a[aria-label][href*="maps/place"]');
  const totalFound = await items.count();
  const count = Math.min(totalFound, MAX_RESULTS_PER_QUERY);

  console.log(`    Gefunden: ${totalFound} Ergebnisse, verarbeite ${count}`);

  for (let i = 0; i < count; i++) {
    try {
      const item = items.nth(i);

      // Extract the business name from aria-label BEFORE clicking
      const ariaLabel = await item.getAttribute('aria-label');
      if (!ariaLabel || ariaLabel === 'Ergebnisse' || ariaLabel === 'Gesponsert') {
        continue;
      }

      await item.click();
      await page.waitForTimeout(2500);

      const data = await extractBusinessDetails(page, gewerk, ariaLabel);
      if (data && data.firma !== 'Ergebnisse' && data.firma !== 'Gesponsert') {
        results.push(data);
        console.log(`    ✓ ${data.firma}`);
      }

      // Close detail panel by clicking back arrow
      try {
        const backBtn = page.locator('button[aria-label="Zurück"], button[aria-label="Back"]');
        if (await backBtn.isVisible({ timeout: 1000 })) {
          await backBtn.click();
          await page.waitForTimeout(1500);
        }
      } catch {
        // If back button not found, try pressing Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      }
    } catch (err) {
      console.log(`    ✗ Ergebnis ${i + 1} übersprungen: ${(err as Error).message}`);
    }
  }

  return results;
}

async function extractBusinessDetails(page: Page, gewerk: string, nameFromList?: string): Promise<RawHandwerker | null> {
  try {
    // Wait for detail panel
    await page.waitForSelector('h1', { timeout: 5000 });

    // Business name - prefer h1 from detail panel, fallback to aria-label from list
    let firma = (await page.locator('h1').first().textContent()) || '';
    firma = firma.trim();
    if (!firma || firma === 'Ergebnisse' || firma === 'Gesponsert') {
      firma = nameFromList || '';
    }
    if (!firma) return null;

    // Rating
    let bewertung_avg = 0;
    let bewertung_count = 0;
    try {
      const ratingText = await page.locator('div.F7nice span[aria-hidden="true"]').first().textContent();
      if (ratingText) {
        bewertung_avg = parseFloat(ratingText.replace(',', '.')) || 0;
      }
      const countText = await page.locator('div.F7nice span[aria-label*="Rezension"], div.F7nice span[aria-label*="review"]').first().textContent();
      if (countText) {
        const match = countText.match(/[\d.]+/);
        bewertung_count = match ? parseInt(match[0].replace('.', ''), 10) : 0;
      }
    } catch {
      // Rating not available
    }

    // Address
    let adresse = '';
    let plz = '';
    try {
      const addrBtn = page.locator('button[data-item-id="address"]');
      if (await addrBtn.isVisible({ timeout: 2000 })) {
        adresse = (await addrBtn.getAttribute('aria-label'))?.replace('Adresse: ', '') || '';
        const plzMatch = adresse.match(/\b(\d{5})\b/);
        plz = plzMatch ? plzMatch[1] : '';
      }
    } catch {
      // Address not available
    }

    // Phone
    let telefon = '';
    try {
      const phoneBtn = page.locator('button[data-item-id*="phone"]');
      if (await phoneBtn.isVisible({ timeout: 2000 })) {
        telefon = (await phoneBtn.getAttribute('aria-label'))?.replace('Telefonnummer: ', '') || '';
      }
    } catch {
      // Phone not available
    }

    // Website
    let webseite = '';
    try {
      const webBtn = page.locator('a[data-item-id="authority"]');
      if (await webBtn.isVisible({ timeout: 2000 })) {
        webseite = (await webBtn.getAttribute('href')) || '';
      }
    } catch {
      // Website not available
    }

    // Google category
    let kategorie_google = '';
    try {
      const catBtn = page.locator('button[jsaction*="category"]');
      if (await catBtn.isVisible({ timeout: 1000 })) {
        kategorie_google = (await catBtn.textContent()) || '';
      }
    } catch {
      // Category not available
    }

    return {
      firma: firma.trim(),
      gewerk,
      adresse: adresse.trim(),
      plz,
      telefon: telefon.trim(),
      webseite: webseite.trim(),
      bewertung_avg: Math.min(bewertung_avg, 5),
      bewertung_count,
      kategorie_google: kategorie_google.trim(),
      scraped_at: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔍 Starte Google Maps Scraping für München...\n');

  const browser = await chromium.launch({
    headless: false, // Sichtbar fuer Debugging - auf true setzen fuer Produktion
    slowMo: 500,
  });

  const context = await browser.newContext({
    locale: 'de-DE',
    geolocation: { latitude: 48.1351, longitude: 11.582 }, // München
    permissions: ['geolocation'],
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();
  const allResults: RawHandwerker[] = [];

  // Load existing results if any (resume support)
  if (fs.existsSync(OUTPUT_PATH)) {
    const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    allResults.push(...existing);
    console.log(`  Bestehende Ergebnisse geladen: ${existing.length}\n`);
  }

  for (const { query, gewerk } of SEARCH_QUERIES) {
    // Skip if we already have results for this gewerk
    const existingCount = allResults.filter((r) => r.gewerk === gewerk).length;
    if (existingCount >= MAX_RESULTS_PER_QUERY) {
      console.log(`⏭  ${query} - bereits ${existingCount} Ergebnisse, ueberspringe`);
      continue;
    }

    console.log(`🔎 Suche: "${query}"`);

    try {
      await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });

      await acceptCookies(page);
      await page.waitForTimeout(3000);

      // Scroll to load more results
      await scrollResultsList(page, 3);

      const results = await extractResultsFromList(page, gewerk);
      allResults.push(...results);

      console.log(`  → ${results.length} neue Ergebnisse\n`);

      // Save after each query (crash safety)
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allResults, null, 2), 'utf-8');
    } catch (err) {
      console.error(`  ✗ Fehler bei "${query}": ${(err as Error).message}\n`);
    }

    // Pause between queries
    await page.waitForTimeout(3000);
  }

  await browser.close();

  // Deduplicate by firma name
  const unique = new Map<string, RawHandwerker>();
  for (const r of allResults) {
    const key = r.firma.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, r);
    }
  }
  const deduplicated = Array.from(unique.values());

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(deduplicated, null, 2), 'utf-8');

  console.log('═══════════════════════════════════════');
  console.log(`✅ Fertig! ${deduplicated.length} Handwerker gespeichert`);
  console.log(`📄 Datei: ${OUTPUT_PATH}`);
  console.log('');
  console.log('Nächste Schritte:');
  console.log('  1. Prüfe scripts/handwerker-raw.json');
  console.log('  2. Kopiere geprüfte Einträge nach scripts/handwerker-verified.json');
  console.log('  3. Führe aus: npm run seed:handwerker');
  console.log('═══════════════════════════════════════');
}

main().catch(console.error);
