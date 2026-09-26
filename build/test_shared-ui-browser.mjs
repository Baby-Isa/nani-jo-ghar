// Browser pass for the shared UI (lab/shared-ui.html): the end-of-round
// screen at phone (landscape and portrait), iPad and laptop sizes (the
// badges fit with no scrolling, a new best rings, all-right goes gold, Next
// -> the word review -> Done resolves), and the onboarding kit driven by
// real pointer input through its 3-step script (a tap outside the light is
// blocked; done once per profile; the sidebar fades in after). Screenshots
// go to build/screenshots/shared-ui/. One browser, port 8811
// (SHARED_UI_TEST_PORT overrides).
// Run: node build/test_shared-ui-browser.mjs   (needs the global playwright)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PORT = Number(process.env.SHARED_UI_TEST_PORT || 8811);
const SHOTS = path.join(ROOT, "build/screenshots/shared-ui");
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
fs.mkdirSync(SHOTS, { recursive: true });
const SIZES = [
  { name: "phone", width: 915, height: 375, touch: true },
  { name: "phone-portrait", width: 390, height: 844, touch: true },
  { name: "ipad", width: 1024, height: 768, touch: true },
  { name: "laptop", width: 1440, height: 900 },
];
const URL0 = `http://localhost:${PORT}/lab/shared-ui.html`;

try {
  for (const s of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, hasTouch: !!s.touch });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const round of ["best", "mixed", "hints"]) {
      await page.goto(`${URL0}?round=${round}`);
      await page.waitForSelector(".njg-results");
      await page.waitForTimeout(3200); // the badges' show
      const fit = await page.evaluate(() => {
        const vw = innerWidth;
        const vh = innerHeight;
        const els = [...document.querySelectorAll(".njg-results .rs-badge, .njg-results .rs-next")];
        const bad = els.filter((e) => {
          const r = e.getBoundingClientRect();
          return r.left < -1 || r.top < -14 || r.right > vw + 1 || r.bottom > vh + 1;
        });
        const b = document.querySelector(".rs-next").getBoundingClientRect();
        return { bad: bad.map((e) => e.className), btn: [b.width, b.height], tiers: [...document.querySelectorAll(".rs-badge")].map((e) => e.className.match(/tier-(\w+)/)[1]), ribbon: !document.querySelector(".rs-ribbon").hidden };
      });
      check(!fit.bad.length, `${s.name} ${round}: badges and Next fit ${s.width}x${s.height} ${fit.bad.join(",")}`);
      check(fit.btn[0] >= 60 && fit.btn[1] >= 60, `${s.name} ${round}: Next is a big target (${fit.btn.map(Math.round).join("x")})`);
      if (round === "best") check(fit.tiers.join() === "gold,gold,gold" && fit.ribbon, `${s.name}: all right + new best -> gold, gold, gold, "New best!" (${fit.tiers})`);
      if (round === "mixed") check(fit.tiers.join() === "mid,mid,mid" && !fit.ribbon, `${s.name}: mixed -> mid tiers, no ribbon (${fit.tiers})`);
      if (round === "hints") check(fit.tiers[2] === "plain", `${s.name}: 4 hints -> plain (${fit.tiers})`);
      await page.screenshot({ path: path.join(SHOTS, `results-${round}-${s.name}.png`) });
    }
    // Next -> the word review -> Done
    await page.click(".rs-next");
    await page.waitForSelector(".rs-p2:not([hidden])");
    await page.waitForTimeout(500);
    const words = await page.$$eval(".rs-word", (b) => b.map((x) => x.textContent.trim()));
    check(words.length === 6 && words[0].includes("gos") && words[0].includes("meat"), `${s.name}: word review lists the round's words (${words.length})`);
    await page.screenshot({ path: path.join(SHOTS, `results-words-${s.name}.png`) });
    await page.click(".rs-done");
    await page.waitForFunction(() => window.__lab.last && !document.querySelector(".njg-results"));
    const last = await page.evaluate(() => window.__lab.last);
    check(last.action === "done", `${s.name}: Done resolves {action: "done"}`);
    check(errors.length === 0, `${s.name}: no page errors ${errors.join(" | ")}`);
    await ctx.close();
  }

  // the onboarding kit, with real pointer input (laptop and phone)
  for (const s of [SIZES[3], SIZES[0]]) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(URL0);
    await page.waitForFunction(() => window.__lab.ready);
    await page.locator("#station").scrollIntoViewIfNeeded();
    const hiddenBefore = await page.$eval("#card", (e) => getComputedStyle(e).visibility === "hidden");
    check(hiddenBefore, `${s.name}: the sidebar card waits until it's needed`);
    await page.click("#ob-go");
    await page.waitForSelector(".njg-onboard.on");
    await page.waitForTimeout(700); // mid-ghost
    await page.screenshot({ path: path.join(SHOTS, `onboard-step1-${s.name}.png`) });
    const centre = async (sel) => {
      const b = await page.locator(sel).boundingBox();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    };
    // a tap outside the light is blocked (the Done button is dimmed)
    let doneClicks = 0;
    await page.exposeFunction("__doneClick", () => doneClicks++);
    await page.evaluate(() => document.querySelector("#done").addEventListener("click", () => window.__doneClick()));
    const d = await centre("#done");
    await page.mouse.click(d.x, d.y);
    await page.waitForTimeout(100);
    check(doneClicks === 0, `${s.name}: a tap outside the light is blocked`);
    // step 1: tap the jug
    const j = await centre("#jug");
    await page.mouse.click(j.x, j.y);
    await page.waitForFunction(() => document.querySelector(".njg-onboard").dataset.step === "1", null, { timeout: 3000 });
    check(true, `${s.name}: step 1 (tap) done -> step 2`);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(SHOTS, `onboard-step2-${s.name}.png`) });
    // step 2: drag the jug to the pan
    const p = await centre("#pan");
    await page.mouse.move(j.x, j.y);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) await page.mouse.move(j.x + ((p.x - j.x) * i) / 12, j.y + ((p.y - 20 - j.y) * i) / 12);
    await page.mouse.up();
    await page.waitForFunction(() => document.querySelector(".njg-onboard").dataset.step === "2", null, { timeout: 3000 });
    check(true, `${s.name}: step 2 (drag, pour-done) done -> step 3`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SHOTS, `onboard-step3-${s.name}.png`) });
    // step 3: stir the pan round
    await page.mouse.move(p.x + 40, p.y);
    await page.mouse.down();
    for (let i = 0; i <= 40; i++) {
      const t = (i / 20) * Math.PI * 2;
      await page.mouse.move(p.x + 40 * Math.cos(t), p.y + 25 * Math.sin(t));
    }
    await page.mouse.up();
    await page.waitForFunction(() => window.__lab.onboard, null, { timeout: 4000 });
    check((await page.evaluate(() => window.__lab.onboard)) === "done", `${s.name}: step 3 (circle-stir) -> "done"`);
    await page.waitForTimeout(1500);
    const shown = await page.$eval("#card", (e) => getComputedStyle(e).visibility === "visible");
    check(shown, `${s.name}: the sidebar card fades in after`);
    await page.screenshot({ path: path.join(SHOTS, `onboard-after-${s.name}.png`) });
    // once per profile: a second run is "seen"
    await page.evaluate(() => (window.__lab.onboard = null));
    await page.click("#ob-go");
    await page.waitForFunction(() => window.__lab.onboard);
    check((await page.evaluate(() => window.__lab.onboard)) === "seen", `${s.name}: second run -> "seen" (once per profile)`);
    // a grown-up's skip: a quick tap does nothing, a hold skips
    await page.evaluate(() => (window.__lab.onboard = null));
    await page.click("#ob-force");
    await page.waitForSelector(".njg-onboard.on");
    await page.click(".ob-skip");
    await page.waitForTimeout(300);
    check(!!(await page.$(".njg-onboard")), `${s.name}: a quick tap on skip does nothing`);
    const sk = await centre(".ob-skip");
    await page.mouse.move(sk.x, sk.y);
    await page.mouse.down();
    await page.waitForTimeout(1200);
    await page.mouse.up();
    await page.waitForFunction(() => window.__lab.onboard);
    check((await page.evaluate(() => window.__lab.onboard)) === "skipped", `${s.name}: holding skip for a second -> "skipped"`);
    check(errors.length === 0, `${s.name}: no page errors ${errors.join(" | ")}`);
    await ctx.close();
  }

  // reduced motion: everything shows at once, still gold
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${URL0}?round=best`);
  await page.waitForSelector(".njg-results");
  await page.waitForTimeout(400);
  const tiers = await page.$$eval(".rs-badge", (b) => b.map((x) => x.className.match(/tier-(\w+)/)[1]));
  check(tiers.join() === "gold,gold,gold", `reduced motion: gold at once (${tiers})`);
  await page.screenshot({ path: path.join(SHOTS, "results-best-reduced-motion.png") });
  await ctx.close();
} finally {
  await browser.close();
  server.close();
}
console.log(fails.length ? `\n${fails.length} failed` : "\nall passed");
process.exit(fails.length ? 1 : 0);
