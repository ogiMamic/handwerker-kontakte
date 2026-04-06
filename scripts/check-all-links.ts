#!/usr/bin/env tsx
/**
 * Automated link checker — crawls the local dev site recursively,
 * finds every internal <a href="…"> link, and reports broken ones.
 *
 * Usage:  npx tsx scripts/check-all-links.ts
 *         npx tsx scripts/check-all-links.ts --port 3099
 */

import { spawn, ChildProcess } from "child_process";
import http from "http";
import https from "https";

// ── Config ──────────────────────────────────────────────────────
const PORT = (() => {
  const idx = process.argv.indexOf("--port");
  return idx !== -1 ? Number(process.argv[idx + 1]) : 3099;
})();
const BASE = `http://localhost:${PORT}`;
const SEED_PATH = "/de";
const REQUEST_TIMEOUT = 15_000;
const MAX_CONCURRENCY = 6;
const IGNORED_PREFIXES = ["mailto:", "tel:", "javascript:", "#", "https://", "http://"];
const IGNORED_PATH_PREFIXES = ["/_next/", "/placeholder", "/icon", "/apple-icon", "/manifest", "/opengraph"];

// ── State ───────────────────────────────────────────────────────
const visited = new Map<string, number>(); // path → status
const queue: string[] = [];
let active = 0;
let devServer: ChildProcess | null = null;

interface BrokenLink {
  url: string;
  status: number;
  linkedFrom: string[];
}

const linkSources = new Map<string, Set<string>>(); // target → set of source pages

// ── Helpers ─────────────────────────────────────────────────────

function normalise(href: string, currentPath: string): string | null {
  // Skip external and non-http links
  if (IGNORED_PREFIXES.some((p) => href.startsWith(p))) return null;

  let url: URL;
  try {
    url = new URL(href, BASE + currentPath);
  } catch {
    return null;
  }

  // Only follow links to the same host
  if (url.hostname !== "localhost" || url.port !== String(PORT)) return null;

  // Skip static assets and non-page paths
  if (IGNORED_PATH_PREFIXES.some((p) => url.pathname.startsWith(p))) return null;

  // Strip hash and query
  return url.pathname;
}

function extractLinks(html: string): string[] {
  const re = /href=["']([^"']+)["']/g;
  const links: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    links.push(m[1]);
  }
  return links;
}

function fetch(path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve) => {
    const req = http.get(`${BASE}${path}`, { timeout: REQUEST_TIMEOUT }, (res) => {
      // Follow redirects (307, 308, 301, 302)
      if (res.statusCode && [301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location;
        const redirectPath = loc.startsWith("/") ? loc : new URL(loc).pathname;
        resolve({ status: res.statusCode, body: "" });
        // Enqueue the redirect target too
        enqueue(redirectPath, path);
        return;
      }

      let body = "";
      res.on("data", (chunk: Buffer) => { body += chunk.toString(); });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body }));
      res.on("error", () => resolve({ status: 0, body: "" }));
    });
    req.on("error", () => resolve({ status: 0, body: "" }));
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, body: "" }); });
  });
}

function enqueue(path: string, source: string) {
  if (!path || visited.has(path) || queue.includes(path)) return;
  if (!linkSources.has(path)) linkSources.set(path, new Set());
  linkSources.get(path)!.add(source);
  queue.push(path);
}

async function crawl(path: string): Promise<void> {
  if (visited.has(path)) return;

  const { status, body } = await fetch(path);
  visited.set(path, status);

  // Only extract links from successful HTML pages
  if (status === 200 && body.includes("<")) {
    const rawLinks = extractLinks(body);
    for (const raw of rawLinks) {
      const norm = normalise(raw, path);
      if (norm && !visited.has(norm)) {
        if (!linkSources.has(norm)) linkSources.set(norm, new Set());
        linkSources.get(norm)!.add(path);
        if (!queue.includes(norm)) queue.push(norm);
      }
    }
  }
}

async function processQueue(): Promise<void> {
  while (queue.length > 0 || active > 0) {
    while (queue.length > 0 && active < MAX_CONCURRENCY) {
      const path = queue.shift()!;
      if (visited.has(path)) continue;
      active++;
      crawl(path).finally(() => { active--; });
    }
    // Small wait to let in-flight requests finish
    await new Promise((r) => setTimeout(r, 50));
  }
}

// ── Dev server lifecycle ────────────────────────────────────────

function startDevServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Starting dev server on port ${PORT}…`);
    devServer = spawn("npx", ["next", "dev", "--port", String(PORT)], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) { resolved = true; reject(new Error("Dev server start timeout (60s)")); }
    }, 60_000);

    const onData = (chunk: Buffer) => {
      const text = chunk.toString();
      if (!resolved && text.includes("Ready in")) {
        resolved = true;
        clearTimeout(timeout);
        // Give it an extra second to be fully ready
        setTimeout(resolve, 1_000);
      }
    };

    devServer.stdout?.on("data", onData);
    devServer.stderr?.on("data", onData);
    devServer.on("error", (err) => { if (!resolved) { resolved = true; clearTimeout(timeout); reject(err); } });
    devServer.on("exit", (code) => {
      if (!resolved) { resolved = true; clearTimeout(timeout); reject(new Error(`Dev server exited with code ${code}`)); }
    });
  });
}

function stopDevServer() {
  if (devServer) {
    devServer.kill("SIGTERM");
    devServer = null;
  }
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  try {
    await startDevServer();
    console.log("Dev server ready.\n");

    // Warm up the server with the seed page
    console.log(`Crawling from ${SEED_PATH}…`);
    queue.push(SEED_PATH);
    linkSources.set(SEED_PATH, new Set(["<seed>"]));

    await processQueue();

    // ── Report ────────────────────────────────────────────────
    const broken: BrokenLink[] = [];
    const ok: string[] = [];
    const redirects: string[] = [];

    for (const [path, status] of Array.from(visited)) {
      if (status === 200) {
        ok.push(path);
      } else if ([301, 302, 307, 308].includes(status)) {
        redirects.push(path);
      } else {
        broken.push({
          url: path,
          status,
          linkedFrom: Array.from(linkSources.get(path) ?? []),
        });
      }
    }

    console.log("\n════════════════════════════════════════════════");
    console.log("           LINK CHECK REPORT");
    console.log("════════════════════════════════════════════════\n");
    console.log(`  Total pages visited:  ${visited.size}`);
    console.log(`  OK (200):             ${ok.length}`);
    console.log(`  Redirects (3xx):      ${redirects.length}`);
    console.log(`  BROKEN:               ${broken.length}`);
    console.log("");

    if (broken.length > 0) {
      console.log("──── BROKEN LINKS ─────────────────────────────\n");
      for (const b of broken.sort((a, c) => a.url.localeCompare(c.url))) {
        console.log(`  ✗ ${b.status} ${b.url}`);
        for (const src of b.linkedFrom) {
          console.log(`       ← linked from ${src}`);
        }
      }
      console.log("");
    }

    if (redirects.length > 0) {
      console.log("──── REDIRECTS ────────────────────────────────\n");
      for (const r of redirects) {
        console.log(`  → ${r}`);
      }
      console.log("");
    }

    console.log("════════════════════════════════════════════════\n");

    // Write JSON report
    const report = {
      timestamp: new Date().toISOString(),
      summary: { total: visited.size, ok: ok.length, redirects: redirects.length, broken: broken.length },
      broken,
      redirects,
      ok: ok.sort(),
    };
    const fs = await import("fs");
    fs.writeFileSync("dead-links-report.json", JSON.stringify(report, null, 2));
    console.log("Report saved to dead-links-report.json\n");

    process.exit(broken.length > 0 ? 1 : 0);
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(2);
  } finally {
    stopDevServer();
  }
}

main();
