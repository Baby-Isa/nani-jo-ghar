#!/usr/bin/env node
// A1 (5 Oct): quick looks at the heal games' wide shot, the push-in and the close-up with the real art, at one size.
//   COOK_TEST_PORT=8822 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/test_clinic_a1_shots.mjs OUTDIR [games] [WxH]
// Not committed output: the shots go to OUTDIR (outside the repo or build/screenshots/).
import { mkdirSync } from "node:fs";
import { startServer, launch, BASE } from "./sandbox/lib/env.mjs";
const out = process.argv[2] || "build/screenshots/a1";
const games = (process.argv[3] || "knee,cut,ear,tooth,taste,fever,boing,eye,foot").split(",");
const [W, H] = (process.argv[4] || "1366x768").split("x").map(Number);
mkdirSync(out, { recursive: true });
const srv = await startServer();
const browser = await launch();
for (const gp of games) {
  const [g, part] = gp.split(":"); // "cut:knee": the scrape on the knee (the diagnosed part)
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  // hold the push-in: every animation on the zoom layer starts paused, so the wide shot can be shot
  await page.addInitScript(() => {
    window.__a1 = [];
    const orig = Element.prototype.animate;
    Element.prototype.animate = function (...a) {
      const an = orig.apply(this, a);
      if (this.closest && this.closest(".cl-zoom") && !window.__a1go) { an.pause(); window.__a1.push(an); }
      return an;
    };
  });
  // the lab has no zoom of its own (the pipeline stages it): load the stages' common module and the scenes, then mount
  await page.goto(`${BASE}/lab/clinic-heal-host.html?level=1&kind=girl&seed=7&quiet=1&onboard=0&src=js/clinic/stages/common.js`);
  await page.waitForFunction((g) => window.Clinic && Clinic.Stages && Clinic.Stages.fitScene && window.__heal && Clinic.Heal && Clinic.Heal.get(g), g, { timeout: 15000 });
  await page.evaluate(async ([g, part]) => {
    if (part) {
      const m = Clinic.HealHost.mount;
      Clinic.HealHost.mount = (sc, id, o) => m(sc, id, Object.assign(o || {}, { part }));
    }
    Clinic.Scenes = await Clinic.Kit.loadJSON("data/clinic/scenes-v2.json");
    document.getElementById("lab-game").value = g;
    document.getElementById("lab-kind").value = "girl";
    window.__heal.mount();
  }, [g, part]);
  // the wide shot: freeze the push-in at its start
  await page.waitForFunction(() => window.__a1.length >= 2, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${g}${part ? "-" + part : ""}-${W}-0wide.png` });
  await page.evaluate(() => window.__a1.forEach((a) => (a.currentTime = 420)));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}/${g}${part ? "-" + part : ""}-${W}-1zoom.png` });
  await page.evaluate(() => { window.__a1go = true; window.__a1.forEach((a) => a.play()); });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/${g}${part ? "-" + part : ""}-${W}-2close.png` });
  if (errs.length) console.log(g, "errors:", errs.join(" | "));
  else console.log(g, "ok");
  await page.close();
}
await browser.close();
srv.close();
