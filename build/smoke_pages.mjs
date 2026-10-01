// Smoke test: opens every top-level *.html page and every page under lab/ at 1366x768,
// waits ~3 s and records console errors, page errors and failed requests (incl. 404s).
// Run (one browser test at a time):
//   flock -w 1800 /tmp/njg-browser.lock timeout 900 node build/smoke_pages.mjs
// Env: COOK_TEST_PORT (default 8811), SMOKE_OUT (JSON path, default stdout only),
//      SMOKE_SHOTS (dir for screenshots of index, cook, clinic, first, labs), SMOKE_WAIT_MS (default 3000).
import { createRequire } from "node:module";
import { execSync, spawn } from "node:child_process";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); }
catch (e) { pw = require(join(execSync("npm root -g").toString().trim(), "playwright")); }

const PORT = process.env.COOK_TEST_PORT || "8811";
const WAIT = +(process.env.SMOKE_WAIT_MS || 3000);
const OUT = process.env.SMOKE_OUT;
const SHOTS = process.env.SMOKE_SHOTS;
const SHOT_PAGES = new Set(["index.html", "cook.html", "clinic.html", "first.html", "labs.html"]);

const pages = [
  ...readdirSync(ROOT).filter(f => f.endsWith(".html")).sort(),
  ...readdirSync(join(ROOT, "lab")).filter(f => f.endsWith(".html")).sort().map(f => "lab/" + f),
];

const server = spawn("python3", ["-m", "http.server", PORT, "--bind", "127.0.0.1"], { cwd: ROOT, stdio: "ignore" });
await new Promise(r => setTimeout(r, 1200));

const browser = await pw.chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
});
const results = {};
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
try {
  for (const p of pages) {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    const r = { consoleErrors: [], pageErrors: [], failedRequests: [] };
    page.on("console", m => { if (m.type() === "error") r.consoleErrors.push(m.text()); });
    page.on("pageerror", e => r.pageErrors.push(String(e.message || e)));
    page.on("requestfailed", q => r.failedRequests.push(q.url().replace(`http://127.0.0.1:${PORT}`, "") + " " + (q.failure() || {}).errorText));
    page.on("response", s => { if (s.status() >= 400) r.failedRequests.push(s.url().replace(`http://127.0.0.1:${PORT}`, "") + " HTTP " + s.status()); });
    try {
      await page.goto(`http://127.0.0.1:${PORT}/${p}`, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(WAIT);
      if (SHOTS && SHOT_PAGES.has(p)) await page.screenshot({ path: join(SHOTS, p.replace(".html", ".png")) });
    } catch (e) { r.pageErrors.push("NAV: " + e.message); }
    for (const k of Object.keys(r)) r[k] = [...new Set(r[k])].sort();
    results[p] = r;
    await ctx.close();
  }
} finally {
  await browser.close();
  server.kill();
}
const bad = Object.entries(results).filter(([, r]) => r.consoleErrors.length || r.pageErrors.length || r.failedRequests.length);
console.log(`${pages.length} pages, ${bad.length} with problems`);
for (const [p, r] of bad) console.log(`  ${p}: ${r.consoleErrors.length} console, ${r.pageErrors.length} page, ${r.failedRequests.length} failed`);
if (OUT) writeFileSync(OUT, JSON.stringify(results, null, 1));
