// Browser smoke test for the shared modules as plain <script>s (lab/shared.html):
// every module registers on window and on window.Shared, the overlay lab
// draws real sprites and greybox layers, and a say moment with no family
// recordings falls back to live pills and resolves on a tap. One browser,
// one page, port 8800 (FOUNDATION_TEST_PORT overrides).
// Run: node build/test_shared-browser.mjs   (needs the global playwright)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PORT = Number(process.env.FOUNDATION_TEST_PORT || 8800);
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch (e) {
  pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".mp3": "audio/mpeg" };
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
try {
  const page = await browser.newPage({ viewport: { width: 915, height: 375 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/lab/shared.html`);
  await page.waitForFunction(() => window.__lab && window.__lab.ready, null, { timeout: 15000 });
  const g = await page.evaluate(() => ["Speech", "Rel", "WhichOne", "Stars", "Say", "Overlay"].map((n) => !!window[n]).concat(["speech", "rel", "whichone", "stars", "say", "overlay"].map((n) => !!(window.Shared && window.Shared[n]))));
  check(g.every(Boolean), "every module on window and window.Shared");
  // overlay: the nana base image loads and draws; a cap layer greyboxes
  await page.selectOption("#ov-base", "nana-upper");
  await page.check('[data-layer="ov-cap"]');
  await page.waitForTimeout(300);
  const drawn = await page.evaluate(() => {
    const c = document.getElementById("ov-canvas");
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return { n, list: window.__lab.lastList.map((e) => e.id) };
  });
  check(drawn.n > 20000 && drawn.list.includes("ov-cap"), `overlay lab drew the figure (${drawn.n} px, ${drawn.list.join(",")})`);
  // say: no templates -> mic hidden, pills live; a tap resolves as a pill
  await page.click("#say-go");
  await page.waitForSelector(".njg-say");
  const st = await page.evaluate(() => ({ micHidden: document.querySelector(".njg-say .mic").hidden, live: document.querySelector(".njg-say").classList.contains("live") }));
  check(st.micHidden && st.live, "say: no recordings -> mic hidden, pills live");
  const box = await page.locator(".njg-say").boundingBox();
  check(box && box.x >= 0 && box.x + box.width <= 915 && box.y + box.height <= 375, "say panel fits a 915x375 phone");
  await page.click('.njg-say .pill[data-choice="cook-dudh"]');
  await page.waitForFunction(() => window.__lab.lastSay);
  const res = await page.evaluate(() => window.__lab.lastSay);
  check(res.choice === "cook-dudh" && res.via === "pill", `say resolved ${JSON.stringify(res)}`);
  check((await page.locator(".njg-say").count()) === 0, "say panel removed");
  check(errors.length === 0, `no page errors ${errors.join(" | ")}`);
  fs.mkdirSync(path.join(ROOT, "build/screenshots/shared"), { recursive: true });
  await page.screenshot({ path: path.join(ROOT, "build/screenshots/shared/lab-phone.png") });
  for (const l of ["ov-glasses-rect", "ov-scarf", "item:fru-01"]) await page.check(`[data-layer="${l}"]`);
  await page.waitForTimeout(200);
  await page.locator("#ov-canvas").screenshot({ path: path.join(ROOT, "build/screenshots/shared/overlay-nana.png") });
} finally {
  await browser.close();
  server.close();
}
console.log(fails.length ? `${fails.length} failed` : "all passed");
process.exit(fails.length ? 1 : 0);
