#!/usr/bin/env node
// Every file a page asks for carries the version stamp (rule B7; R6). On a scratch copy of the pages, code, styles
// and data (never the repo), build/bump_version.py stamps everything with a test stamp; then each live page is
// opened in Chromium (the sandbox's server, fonts and blocked network) and every request it makes for js/, css/,
// data/ or assets/ must carry ?v=<that stamp>: tags, the import map's modules and their relative imports, a
// stylesheet's @import and url(), data fetches through njgV(), a Phaser scene's loads. Art and sound are served
// from the repo itself, so nothing large is copied. The parked modes' pages (Snap, Find it, Dress up, Tidy up, Who
// did it?, Monsoon rush) still fetch some data and faces without the stamp in their own code: listed as known, not
// failed, until each mode moves onto the framework (decision: parked modes move when their turn comes; H45).
// One browser at a time:
//   COOK_TEST_PORT=8819 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/check_stamps.mjs [page ...]
import { mkdtempSync, cpSync, rmSync, existsSync, statSync, createReadStream, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, normalize, extname } from "node:path";
import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { ROOT, BASE, PORT, FONTS_DIR, launch, newPage, sleep } from "./sandbox/lib/env.mjs";

const STAMP = "STAMPCHECK" + Date.now();
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["index.html", "first.html", "cook.html", "cook.html#station", "clinic.html?seed=7&quiet=1&fast=1", "lab.html", "labs.html", "snap.html", "find.html", "dress.html", "tidy.html", "who.html", "monsoon.html"];
const PARKED = new Set(["snap.html", "find.html", "dress.html", "tidy.html", "who.html", "monsoon.html"]);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".ttf": "font/ttf", ".woff2": "font/woff2" };

const dir = mkdtempSync(join(tmpdir(), "njg-stamps-"));
for (const d of ["js", "css", "data", "lab", "build"]) cpSync(join(ROOT, d === "build" ? "build/bump_version.py" : d), join(dir, d === "build" ? "build/bump_version.py" : d), { recursive: true });
for (const f of readdirSync(ROOT)) if (f.endsWith(".html")) cpSync(join(ROOT, f), join(dir, f));
execFileSync("python3", [join(dir, "build/bump_version.py"), "--stamp", STAMP]);

// the scratch copy first, then the repo (art, sound, fonts)
const srv = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, BASE).pathname);
  let base = p.startsWith("/__fonts/") ? FONTS_DIR : null;
  if (base) p = "/" + p.slice("/__fonts/".length);
  const pick = base ? [base] : [dir, ROOT];
  for (const b of pick) {
    let f = normalize(join(b, p));
    if (!f.startsWith(b)) break;
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) continue;
    res.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
    return createReadStream(f).pipe(res);
  }
  res.writeHead(404);
  res.end();
});
await new Promise((r) => srv.listen(PORT, "127.0.0.1", r));
let browser = await launch();
const bad = [];
const known = [];
let total = 0;
try {
  for (const entry of PAGES) {
    const [url, how] = entry.split("#");
    if (!browser.isConnected()) browser = await launch(); // a page that took the browser down: a fresh one for the next
    const { ctx, page } = await newPage(browser, "1366x768");
    const reqs = [];
    page.on("request", (r) => {
      const u = new URL(r.url());
      if (u.origin === BASE && /^\/(js|css|data|assets)\//.test(u.pathname)) reqs.push(u.pathname + u.search);
    });
    await page.goto(`${BASE}/${url}`, { waitUntil: "load" }).catch(() => {});
    await sleep(2500);
    if (how === "station") {
      // a Cook station: its Phaser scene loads its art through the stamp
      await page.evaluate(() => window.__cook && __cook.lab && __cook.lab("chai-tray", true, { level: 1 })).catch(() => {});
      await sleep(4000);
    }
    const miss = [...new Set(reqs.filter((u) => !u.includes(`v=${STAMP}`)))];
    total += reqs.length;
    console.log(`${entry}: ${reqs.length} requests, ${miss.length} unstamped`);
    const parked = PARKED.has(url.split("?")[0]);
    for (const m of miss) {
      if (parked) known.push(`${entry}: ${m}`);
      else bad.push(`${entry}: ${m}`);
      console.log(`  ${parked ? "known (parked mode)" : "UNSTAMPED"} ${m}`);
    }
    await ctx.close().catch(() => {});
  }
} finally {
  await browser.close();
  srv.close();
  rmSync(dir, { recursive: true, force: true });
}
console.log(bad.length ? `STAMP CHECK FAILED: ${bad.length} unstamped of ${total} requests` : `STAMP CHECK PASSED: every request of the live pages stamped (${total} requests; ${known.length} known in the parked modes' own code)`);
process.exit(bad.length ? 1 : 0);
