// Contact sheets of the heal games' staging (R5, D1/D2, CLN-43): the zoom from the patient on the bed into the
// close-up, frame by frame (the Web Animations paused at set times), and the zoom back out, at laptop, phone and
// tablet sizes. Output (not committed, rule B19): build/screenshots/r5/zoom/<game>-<size>.png and a sheet per game.
// Run (one browser at a time): COOK_TEST_PORT=8818 flock -w 1800 /tmp/njg-browser.lock timeout 900 node build/shoot_clinic_zoom.mjs [games] [sizes]
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { ROOT, BASE, startServer, launch, newPage, sleep } from "./sandbox/lib/env.mjs";

const GAMES = (process.argv[2] || "knee,ear,tooth").split(",");
const SIZES = (process.argv[3] || "1366x768,844x390,1024x768").split(",");
const OUT = join(ROOT, "build/screenshots/r5/zoom");
mkdirSync(OUT, { recursive: true });
const T = [0, 0.3, 0.6, 0.75, 1]; // shares of the zoom's time

const srv = await startServer();
const browser = await launch();
for (const g of GAMES) {
  const shots = [];
  for (const size of SIZES) {
    const p = await newPage(browser, size, { seed: 1 });
    const page = p.page || p;
    // the zoom starts the moment the game mounts: pause every animation as soon as it exists
    await page.addInitScript(() => {
      const orig = Element.prototype.animate;
      window.__zoomAnims = [];
      Element.prototype.animate = function (...a) {
        const an = orig.apply(this, a);
        if (!window.__noPause && this.classList && (this.classList.contains("cl-zoom") || this.classList.contains("cl-zoom-box"))) {
          an.pause();
          window.__zoomAnims.push(an);
        }
        return an;
      };
    });
    await page.goto(`${BASE}/clinic.html?stage=heal&game=${g}&level=1&seed=7&quiet=1&onboard=0&nonav=1`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__zoomAnims && window.__zoomAnims.length >= 2, null, { timeout: 30000 });
    await sleep(600);
    for (const t of T) {
      await page.evaluate((t) => window.__zoomAnims.forEach((a) => (a.currentTime = t * (a.effect.getTiming().duration || 900))), t);
      await sleep(150);
      const f = join(OUT, `${g}-${size}-in-${String(Math.round(t * 100)).padStart(3, "0")}.png`);
      await page.screenshot({ path: f });
      shots.push({ f, label: `${size} in ${Math.round(t * 100)}%` });
    }
    // the zoom out: end the game as a fair player would (the test hook), then shoot it as it plays (about 0.9 s)
    await page.evaluate(() => {
      window.__zoomAnims.forEach((a) => a.finish());
      window.__noPause = true;
      window.__clinic.finishHeal();
    });
    for (const ms of [150, 450, 1400]) {
      await sleep(ms === 150 ? 150 : ms === 450 ? 300 : 950);
      const f = join(OUT, `${g}-${size}-out-${String(ms).padStart(4, "0")}.png`);
      await page.screenshot({ path: f });
      shots.push({ f, label: `${size} out ${ms} ms` });
    }
    await (p.ctx || page.context()).close();
  }
  // one contact sheet per game: a row per size
  const sheet = join(OUT, `sheet-${g}.png`);
  const args = [];
  shots.forEach((s) => args.push("-label", s.label, s.f));
  execFileSync("montage", [...args, "-tile", `${T.length + 3}x`, "-geometry", "420x260>+6+6", "-pointsize", "14", "-background", "#f3e7d3", sheet]);
  writeFileSync(join(OUT, `sheet-${g}.txt`), shots.map((s) => s.label).join("\n"));
  console.log(`${g}: ${shots.length} frames -> ${sheet}`);
}
await browser.close();
srv.close();
