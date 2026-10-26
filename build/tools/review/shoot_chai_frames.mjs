// S11 finish (CHAI-31): plays cook chai-tray at L1 with the sandbox's fair player and shoots, from a watcher beside it:
//   the first pour half-way and near its end, the kitchen conversation bubble, and the all-served frame.
//   COOK_TEST_PORT=8881 flock -w 900 /tmp/njg-browser.lock timeout 500 node build/tools/review/shoot_chai_frames.mjs <outdir> <size>
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, startServer, launch, newPage, sleep } from "../../sandbox/lib/env.mjs";
import { CookPlayer } from "../../sandbox/lib/cook-player.mjs";
import { Recorder } from "../../sandbox/lib/recorder.mjs";
const out = process.argv[2] || "build/screenshots/s11-finish";
const size = process.argv[3] || "1366x768";
mkdirSync(out, { recursive: true });
const srv = await startServer();
const browser = await launch();
try {
  const { page } = await newPage(browser, size);
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  // an in-page watcher: it freezes Phaser's tweens at two points of the first pour (the pour phase's middle and its last 6%)
  await page.evaluate(() => {
    window.__shots = [];
    const want = [["pour-mid", 0.5], ["pour-near-end", 0.94]];
    const tick = () => {
      const C = window.Cook;
      const pour = C && C.chaiPour;
      if (pour && C.scene && !window.__frozen && want.length) {
        const tw = C.scene.tweens.getTweens().find((t) => t && t.duration === pour.total) || C.scene.tweens.getTweens().find((t) => t && t.getValue && t.targets === undefined);
        const m = pour.marks;
        if (tw) {
          const t = (tw.getValue ? tw.getValue() : tw.progress) * pour.total;
          const goal = m.tip + (m.pour - m.tip) * want[0][1];
          if (t >= goal) {
            C.scene.tweens.timeScale = 0;
            window.__frozen = want.shift()[0];
          }
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const rec = new Recorder({ flow: "chai-frames", size, dir: out, page });
  const P = new CookPlayer(page, rec, { mode: "fair", speed: 3 });
  await page.evaluate(() => { njgTest.cook.lab("chai-tray", true, { level: 1 }); });
  await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
  await sleep(500);
  let done = false;
  let bubbleShot = false;
  let served = false;
  const watcher = (async () => {
    while (!done) {
      try {
        const fz = await page.evaluate(() => window.__frozen || null);
        if (fz) {
          await sleep(120);
          await page.screenshot({ path: join(out, `chai-${fz}-${size}.png`) });
          console.log("shot", fz, size);
          await page.evaluate(() => { window.Cook.scene.tweens.timeScale = 1; window.__frozen = null; });
        }
        if (!bubbleShot) {
          const b = await page.evaluate(() => {
            const e = [...document.querySelectorAll(".cv-bubble")].find((q) => { const r = q.getBoundingClientRect(); return r.width > 20 && r.height > 10 && getComputedStyle(q).visibility !== "hidden" && +getComputedStyle(q).opacity > 0.9; });
            const img = e && e.querySelector(".cv-face img");
            return !!e && (!img || img.complete);
          });
          if (b) {
            bubbleShot = true;
            await sleep(1000);
            await page.screenshot({ path: join(out, `chai-bubble-${size}.png`) });
            const br = await page.evaluate(() => { const e = [...document.querySelectorAll(".cv-bubble")].find((q) => q.getBoundingClientRect().width > 20); const r = e && e.getBoundingClientRect(); return r ? { top: +r.top.toFixed(1), left: +r.left.toFixed(1), right: +r.right.toFixed(1), bottom: +r.bottom.toFixed(1), vw: innerWidth, vh: innerHeight } : null; });
            console.log("shot bubble", size, JSON.stringify(br));
          }
        }
        if (!served) {
          const s = await page.evaluate(() => { const p = window.Cook && Cook.chaiPans ? Cook.chaiPans() : null; return !!p && p.length > 0 && p.every((q) => q.poured > 0) && !Cook.chaiPour; });
          if (s) {
            served = true;
            const guideText = () => page.evaluate(() => { const g = document.querySelector("#guide"); return g ? g.innerText.replace(/\s+/g, " ").trim() : null; }).catch(() => null);
            const t1 = Date.now();
            let last = null;
            let shot = false;
            while (Date.now() - t1 < 8000 && !shot) {
              const g = await guideText();
              if (g !== last) { console.log(`all served +${((Date.now() - t1) / 1000).toFixed(2)} s: guide box`, JSON.stringify(g)); last = g; }
              if (g === "") { await sleep(500); await page.screenshot({ path: join(out, `chai-all-served-${size}.png`) }); shot = true; console.log("shot all-served", size); }
              await sleep(100);
            }
            if (!shot) { await page.screenshot({ path: join(out, `chai-all-served-${size}.png`) }); console.log("shot all-served (guide box never emptied)", size); }
          }
        }
      } catch (e) { /* the page moved on */ }
      await sleep(60);
    }
  })();
  try {
    await P.play(() => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: 240000 });
  } finally {
    done = true;
    await watcher;
  }
  console.log("done", { bubbleShot, served });
} finally { await browser.close(); srv.close(); }
