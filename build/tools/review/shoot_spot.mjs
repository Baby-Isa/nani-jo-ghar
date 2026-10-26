// S11 finish: the 5 s spotlight (a rounded box hugging each live control + a soft round glow from the item) on chai and the eye test.
//   COOK_TEST_PORT=8861 flock -w 900 /tmp/njg-browser.lock timeout 400 node build/tools/review/shoot_spot.mjs <outdir> [sizes,comma] [chai|eye]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";
const out = process.argv[2] || "build/screenshots/s11-finish";
const sizes = (process.argv[3] || "1366x768,915x412").split(",");
const which = process.argv[4] || "chai,eye";
mkdirSync(out, { recursive: true });
const srv = await startServer();
const browser = await launch();
try {
  for (const size of sizes) {
    if (which.includes("chai")) {
      const { page } = await newPage(browser, size);
      await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
      await page.evaluate(() => localStorage.clear());
      await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
      await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
      await page.evaluate(() => { njgTest.cook.lab("chai-tray", true, { level: 1 }); });
      await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
      await page.waitForSelector(".njg-spot.on", { timeout: 40000 });
      await page.waitForFunction(() => (() => { const b = document.querySelector("[data-judge=yes]"); return !document.querySelector(".njg-onboard:not(.njg-spot)") && !(b && b.style.translate); })(), null, { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(800);
      await page.screenshot({ path: join(out, `spot-chai-${size}.png`) });
      await page.close();
      console.log("chai", size);
    }
    if (which.includes("eye")) {
      const { page } = await newPage(browser, size);
      page.on("pageerror", (e) => console.log("pageerror", e.message));
      await page.addInitScript(() => { try { localStorage.setItem("njg-test", "1"); } catch (e) {} });
      await page.goto(`${BASE}/clinic.html?stage=heal&game=eye&level=1&speed=1`, { waitUntil: "load" });
      // play the drops with the game's own driver until the first card is up, then leave it alone
      await page.waitForFunction(() => window.njgTest?.clinic && window.njgTest?.clinic.Stages && window.njgTest?.clinic.Stages.heal.current && window.njgTest?.clinic.Stages.heal.current.controller, null, { timeout: 30000 });
      const t0 = Date.now();
      while (Date.now() - t0 < 80000) {
        const a = await page.evaluate(() => { const c = window.njgTest?.clinic.Stages.heal.current.controller; return c.debug.card ? "card" : c.debug.next(); });
        if (a === "card") break;
        if (a && a.do === "tap") { await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.up(); }
        await page.waitForTimeout(400);
      }
      await page.waitForSelector(".njg-spot.on", { timeout: 40000 });
      await page.waitForFunction(() => (() => { const b = document.querySelector("[data-judge=yes]"); return !document.querySelector(".njg-onboard:not(.njg-spot)") && !(b && b.style.translate); })(), null, { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(800);
      const info = await page.evaluate(() => { const l = window.njgTest?.clinic.Stages.heal.current.controller.debug.layout(); return { mic: !!l.mic, spot: document.querySelectorAll(".njg-spot .ob-holes rect").length }; });
      console.log("eye layout", size, JSON.stringify(info));
      await page.screenshot({ path: join(out, `spot-eye-${size}.png`) });
      await page.close();
      console.log("eye", size);
    }
  }
} finally { await browser.close(); srv.close(); }
