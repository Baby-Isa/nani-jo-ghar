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
const tag = station.replace(":", "-");
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
  if (process.env.DBG) {
    page.on("console", (m) => m.text().startsWith("DBG") && console.log(m.text()));
    await page.evaluate(() => {
      const OB = window.Onboard;
      for (const fn of ["stuck", "spot", "run", "demo"]) if (OB && typeof OB[fn] === "function") { const f = OB[fn]; OB[fn] = function (...a) { console.log("DBG " + fn + " " + String(a[0]).slice(0, 60) + " pour=" + !!(window.Cook && Cook.chaiPour) + " " + (new Error().stack.split("\n").slice(2, 5).join(" | ").replace(/http[^ ]*\/js\//g, ""))); return f.apply(this, a); }; }
    });
  }
  const rec = new Recorder({ flow: "pour-frames", size, dir: out, page });
  const P = new CookPlayer(page, rec, { mode: "fair", speed: 3 });
  // "order:<dish>": a customer's order (the served moment); else the station's lab
  if (station.startsWith("order:")) await page.evaluate(([d, lv]) => { window.__orderDone = false; __cook.order({ dish: d, level: lv }).then(() => (window.__orderDone = true)); }, [station.slice(6), level]);
  else await page.evaluate(([st, lv]) => { __cook.lab(st, true, { level: lv }); }, [station, level]);
  await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 }).catch(() => {});
  await sleep(500);
  let done = false;
  let servedShots = 0;
  let after = 0; // (frames after the moment's hook clears: the customer leaving)
  const watcher = (async () => {
    while (!done) {
      try {
        const fz = await page.evaluate(() => window.__frozen || null);
        if (fz) {
          await sleep(80);
          await page.screenshot({ path: join(out, `${tag}-${fz}-${size}.png`) });
          if (process.env.DBG) console.log(fz, await page.evaluate(() => { const e = document.elementFromPoint(innerWidth * 0.6, innerHeight * 0.4); const c = window.Cook; return [e && (e.id + '.' + e.className), c && c.Coach && c.Coach.active ? 'coach' : '', document.querySelector('.ob-dim, .onboard, #coach, .coach') ? 'ob' : '', JSON.stringify([...document.querySelectorAll('body *')].filter((x) => { const st = getComputedStyle(x); return st.position === 'fixed' && x.offsetWidth > innerWidth * 0.8 && st.display !== 'none' && st.visibility !== 'hidden' && +st.opacity > 0.05; }).map((x) => x.id + '.' + x.className).slice(0, 6))]; }));
          await page.evaluate(() => { window.Cook.scene.tweens.timeScale = 1; window.__frozen = null; });
        }
        // the served moment (SH-121): from its start, a frame every 300 ms
        const sv = await page.evaluate(() => !!(window.Cook && Cook.servedMoment));
        // (from the serve on, real time: the served moment as a child sees it)
        await page.evaluate(() => { if (window.Cook && Cook.servedN) Cook.speed = 1; });
        if (sv) await page.evaluate(() => (window.__sawServed = true));
        const seen = await page.evaluate(() => !!window.__sawServed);
        if ((sv || (seen && after++ < 8)) && servedShots < 40) {
          await page.screenshot({ path: join(out, `${tag}-served-${String(servedShots).padStart(2, "0")}-${size}.png`) });
          servedShots++;
          await sleep(60);
          continue;
        }
      } catch (e) { /* the page moved on */ }
      await sleep(40);
    }
  })();
  try {
    await P.play(() => page.evaluate("(() => { if (window.__orderDone) return true; const b = document.querySelector('.njg-results #lab-list, .njg-results'); return !!b && b.offsetParent !== null && (!!document.querySelector('.njg-results #lab-list') || !window.Cook.servedMoment && document.querySelectorAll('.njg-served-card').length === 0 && window.__sawServed); })()"), { timeout: 240000 });
  } finally {
    done = true;
    await watcher;
  }
  console.log("done", { pours: await page.evaluate(() => window.__pourNo), servedShots });
} finally { await browser.close(); srv.close(); }
