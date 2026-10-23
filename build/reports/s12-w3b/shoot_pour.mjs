// s12-w3b (CHAI-26, SH-121): plays cook chai-tray at a level with the sandbox's fair player and shoots, from a watcher:
//   each pour as an 8-frame filmstrip (the carry, the four tips, the pour, its end, the tip back), and the served moment
//   as a strip of frames 300 ms apart after the last pour.
//   COOK_TEST_PORT=8856 node build/reports/s12-w3b/shoot_pour.mjs <outdir> <size> [level] [station]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, startServer, launch, newPage, sleep } from "../../sandbox/lib/env.mjs";
import { CookPlayer } from "../../sandbox/lib/cook-player.mjs";
import { Recorder } from "../../sandbox/lib/recorder.mjs";
const out = process.argv[2] || "build/reports/s12-w3b";
const size = process.argv[3] || "1366x768";
const level = +(process.argv[4] || 2);
const station = process.argv[5] || "chai-tray";
mkdirSync(out, { recursive: true });
const srv = await startServer();
const browser = await launch();
try {
  const { page } = await newPage(browser, size);
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  // an in-page watcher: it freezes Phaser's tweens at eight points of each pour
  await page.evaluate(() => {
    window.__pourNo = 0;
    const WANT = [["1-carry", "lift", 0.55], ["2-over", "lift", 1], ["3-tip20", "tip", 0.36], ["4-tip40", "tip", 0.6], ["5-tip60", "tip", 0.95], ["6-pour", "pour", 0.4], ["7-pour-end", "pour", 0.92], ["8-tip-back", "untip", 0.5]];
    let want = null;
    let last = null;
    const tick = () => {
      const C = window.Cook;
      const pour = C && C.chaiPour;
      if (pour !== last) {
        last = pour;
        if (pour) (window.__pourNo++, (want = WANT.slice()));
      }
      if (pour && C.scene && !window.__frozen && want && want.length) {
        const tw = C.scene.tweens.getTweens().find((t) => t && t.duration === pour.total);
        const m = pour.marks;
        if (tw) {
          const t = tw.getValue() * pour.total;
          const [, ph, u] = want[0];
          const span = { lift: [0, m.lift], tip: [m.lift, m.tip], pour: [m.tip, m.pour], untip: [m.pour, m.untip] }[ph];
          if (t >= span[0] + (span[1] - span[0]) * u - 1) {
            C.scene.tweens.timeScale = 0;
            window.__frozen = `pour${window.__pourNo}-${want.shift()[0]}`;
          }
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const rec = new Recorder({ flow: "pour-frames", size, dir: out, page });
  const P = new CookPlayer(page, rec, { mode: "fair", speed: 3 });
  await page.evaluate(([st, lv]) => { __cook.lab(st, true, { level: lv }); }, [station, level]);
  await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
  await sleep(500);
  let done = false;
  let servedShots = 0;
  const watcher = (async () => {
    while (!done) {
      try {
        const fz = await page.evaluate(() => window.__frozen || null);
        if (fz) {
          await sleep(80);
          await page.screenshot({ path: join(out, `${station}-${fz}-${size}.png`) });
          await page.evaluate(() => { window.Cook.scene.tweens.timeScale = 1; window.__frozen = null; });
        }
        // the served moment (SH-121): from its start, a frame every 300 ms
        const sv = await page.evaluate(() => !!(window.Cook && Cook.servedMoment));
        if (sv && servedShots < 16) {
          await page.screenshot({ path: join(out, `${station}-served-${String(servedShots).padStart(2, "0")}-${size}.png`) });
          servedShots++;
          await sleep(240);
          continue;
        }
      } catch (e) { /* the page moved on */ }
      await sleep(40);
    }
  })();
  try {
    await P.play(() => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: 240000 });
  } finally {
    done = true;
    await watcher;
  }
  console.log("done", { pours: await page.evaluate(() => window.__pourNo), servedShots });
} finally { await browser.close(); srv.close(); }
