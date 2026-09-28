// Pantry v2 verification screenshots (docs/VISUAL-QA.md §1): the new pantry in the fetch lab
// at levels 1 and 4, empty tray / half full / full, at phone landscape and laptop
// (Cook is landscape only: a phone held upright shows "turn your phone sideways").
// Output: build/reports/pantry-v2/*.png   Run: node build/shoot_pantry_v2.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PORT = 8813;
const OUT = path.join(ROOT, "build/reports/pantry-v2");
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch (e) {
  pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp3": "audio/mpeg", ".woff2": "font/woff2" };
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
const SIZES0 = [
  { name: "laptop", width: 1366, height: 768 },
  { name: "phone-land", width: 844, height: 390 },
];
const SIZES = process.env.ONLY ? SIZES0.filter((s) => s.name === process.env.ONLY) : SIZES0;
const errors = [];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function tapExpected(page, settle = 1400) {
  for (let i = 0; i < 60; i++) {
    const e = await page.evaluate(() => window.__cook.expectation());
    if (process.env.DBG) console.log(JSON.stringify(e));
    if (e && e.selector) {
      // Nani's "pass me" pop-up: answer it, then go on with the list
      await page.click(e.selector).catch(() => {});
      await wait(1400);
      continue;
    }
    if (e && e.kind === "tap" && e.sx != null) {
      await page.mouse.click(e.sx, e.sy);
      await wait(settle);
      return true;
    }
    await wait(250);
  }
  return false;
}
try {
  for (const s of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height } });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(`${s.name}: ${e}`));
    page.on("console", (m) => m.type() === "error" && errors.push(`${s.name} console: ${m.text()}`));
    for (const level of [1, 4]) {
      await page.goto(`http://localhost:${PORT}/cook.html?speed=2`);
      await page.waitForFunction(() => window.__cook && window.Cook && Cook.scene, null, { timeout: 20000 });
      await wait(800);
      page.evaluate((lv) => window.__cook.lab("fetch", false, { level: lv }), level).catch(() => {});
      await page.waitForFunction(() => window.Cook.scene.viewName === "pantry", null, { timeout: 20000 });
      await wait(2600);
      await page.screenshot({ path: `${OUT}/${s.name}-L${level}-0-empty.png` });
      const need = level + 2;
      let n = 0;
      for (; n < need; n++) {
        // the last one: hold the scene after it lands, to catch the full tray
        if (n === need - 1)
          await page.evaluate(() => {
            const S = window.Cook.scene;
            const fly = S.fly.bind(S);
            S.fly = (...a) => fly(...a).then(() => new Promise((r) => setTimeout(r, 2500)));
          });
        if (!(await tapExpected(page, n === need - 1 ? 0 : 1400))) break;
        if (n === Math.floor(need / 2) - 1) await page.screenshot({ path: `${OUT}/${s.name}-L${level}-1-half.png` });
      }
      // the full tray: the last flight is held on landing for a moment (test only), before the
      // end-of-round screen comes up
      await wait(900);
      const last = await page.screenshot();
      if (last) fs.writeFileSync(`${OUT}/${s.name}-L${level}-2-full.png`, last);
      console.log(s.name, "level", level, "tapped", n, "of", need);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(errors.length ? errors.join("\n") : "no page errors");
