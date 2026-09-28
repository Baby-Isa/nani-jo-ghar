// Smoke check for the family-voice wiring (Task 2): no page errors on index.html, first.html,
// cook.html, clinic.html and lab/conversations.html at a phone size (390x844), and the Mishkaki
// grill's order card actually requests family clips (network log), not just the placeholder voice.
// Run: node build/test_voice_wiring.mjs   (needs the global playwright; Chromium in /opt/pw-browsers)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PORT = Number(process.env.VOICE_TEST_PORT || 8820);
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch (e) {
  pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".mp3": "audio/mpeg", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
const fails = [];
const check = (ok, what) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) fails.push(what);
};
const opts = { headless: true };
if (fs.existsSync("/opt/pw-browsers/chromium")) opts.executablePath = "/opt/pw-browsers/chromium";
let browser;
try {
  browser = await pw.chromium.launch(opts);
} catch (e) {
  browser = await pw.chromium.launch({ headless: true });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function checkPage(url) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/404|Failed to load resource/.test(m.text()) && errors.push(m.text()));
  await page.goto(`http://localhost:${PORT}/${url}`);
  await sleep(1200);
  check(errors.length === 0, `${url}: no page errors${errors.length ? `: ${errors.join(" | ")}` : ""}`);
  await ctx.close();
}

for (const url of ["index.html", "first.html", "cook.html", "clinic.html", "lab/conversations.html"]) {
  await checkPage(url);
}

// the grill: open the lab entry, tap the order card's speaker, and watch for a family clip request
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  const famRequests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/404|Failed to load resource/.test(m.text()) && errors.push(m.text()));
  page.on("request", (r) => {
    if (/assets\/audio\/family\//.test(r.url())) famRequests.push(r.url());
  });
  await page.goto(`http://localhost:${PORT}/cook.html?speed=4`);
  await page.waitForFunction(() => !!(window.__cook && window.Cook && window.Cook.data), null, { timeout: 20000 });
  await page.evaluate(() => window.__cook.lab("grill", true, { level: 1 }));
  await page.waitForSelector("#intro:not(.hidden) .ic-say", { timeout: 15000 });
  await sleep(400);
  await page.click("#intro .ic-say", { force: true });
  await sleep(3000);
  check(famRequests.length > 0, `grill: the order card requests family mp3s (${famRequests.length}: ${famRequests.slice(0, 3).join(", ")})`);
  check(errors.length === 0, `cook.html grill: no page errors${errors.length ? `: ${errors.join(" | ")}` : ""}`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(fails.length ? `\n${fails.length} FAILED` : "\nall passed");
process.exit(fails.length ? 1 : 0);
