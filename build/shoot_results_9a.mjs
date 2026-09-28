// UX 9a verification screenshots: the redrawn end-of-round screen
// (stopwatch/tick/bulb as inline SVG) at phone-portrait and laptop sizes,
// covering every state Zafar's redraw defines. Uses lab/shared-ui.html.
// Output: build/reports/results-9a/*.png
// Run: node build/shoot_results_9a.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PORT = 8812;
const OUT = path.join(ROOT, "build/reports/results-9a");
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch (e) {
  pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".mp3": "audio/mpeg" };
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
fs.mkdirSync(OUT, { recursive: true });

const opts = { headless: true };
if (fs.existsSync("/opt/pw-browsers/chromium")) opts.executablePath = "/opt/pw-browsers/chromium";
const browser = await pw.chromium.launch(opts);
const SIZES = [
  { name: "phone", width: 390, height: 844 },
  { name: "laptop", width: 1366, height: 768 },
];
const URL0 = `http://localhost:${PORT}/lab/shared-ui.html`;
const fails = [];
const check = (ok, what) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) fails.push(what);
};

try {
  for (const s of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    // time: PB (gold), good (dim gold), average (grey); accuracy: all-right vs 7/10; hints: 0/1/2/3+
    for (const round of ["best", "good", "average", "hints2"]) {
      await page.goto(`${URL0}?round=${round}`);
      await page.waitForSelector(".njg-results");
      await page.waitForTimeout(3300);
      const tiers = await page.$$eval(".rs-badge", (b) => b.map((x) => x.className.match(/tier-(\w+)/)[1]));
      const hn = await page.$eval('.rs-badge[data-badge="hints"]', (x) => x.dataset.hn);
      check(true, `${s.name} ${round}: tiers ${tiers.join(",")} hints=${hn}`);
      await page.screenshot({ path: path.join(OUT, `${round}-${s.name}.png`) });
    }
    // the word review, grouped: right words glow green on the right, wrong words glow red on the left
    await page.goto(`${URL0}?round=mixed`);
    await page.waitForSelector(".njg-results");
    await page.waitForTimeout(3300);
    await page.click(".rs-next");
    await page.waitForSelector(".rs-p2:not([hidden])");
    await page.waitForTimeout(500);
    const groups = await page.evaluate(() => ({
      bad: [...document.querySelectorAll(".rs-words-bad .rs-word")].map((w) => w.textContent.trim()),
      ok: [...document.querySelectorAll(".rs-words-ok .rs-word")].map((w) => w.textContent.trim()),
    }));
    check(groups.bad.length === 1 && groups.ok.length === 3, `${s.name} mixed words: ${groups.bad.length} wrong (left), ${groups.ok.length} right (right)`);
    await page.screenshot({ path: path.join(OUT, `mixed-words-${s.name}.png`) });
    check(errors.length === 0, `${s.name}: no page errors ${errors.join(" | ")}`);
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(fails.length ? `\n${fails.length} failed` : "\nall passed");
process.exit(fails.length ? 1 : 0);
