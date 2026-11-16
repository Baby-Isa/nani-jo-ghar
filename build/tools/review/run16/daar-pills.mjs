#!/usr/bin/env node
// run16 fix-daar: daar's shelf pills, one word size for the row (DAAR-59; SH-219's pill rule: one scale for the row).
//   COOK_TEST_PORT=8851 flock -w 3600 /tmp/njg-browser-all.lock node build/tools/review/run16/daar-pills.mjs [--levels 1,2,3,4] [--sizes 1280x665,740x320]
// A seen player plays daar fair; every 200 ms the canvas's word pills (the shelf kit's chips: containers with faceW) are read: each
// showing pill's word size on screen (25 px x the word's own shrink x the pill's scale x the canvas's CSS px). Within one row (pills
// at one height), the smallest word must be at least 90% of the largest, at every sample, the well done included. Exit 1 if not.
import { startServer, launch, newPage, BASE } from "../../../sandbox/lib/env.mjs";
import { CookPlayer } from "../../../sandbox/lib/cook-player.mjs";

const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const levels = val("--levels", "1,2,3,4").split(",").map(Number);
const sizes = val("--sizes", "1280x665,740x320").split(",");
const station = val("--station", "daar");

const SAMPLER = () => {
  const W = window;
  W.__pills = { worst: null, n: 0 };
  const read = () => {
    try {
      const g = W.Cook && W.Cook.game;
      if (!g || !g.scene) return;
      const cv = g.canvas.getBoundingClientRect();
      const css = cv.width / g.scale.width;
      const chips = [];
      for (const sc of g.scene.getScenes(true)) {
        const walk = (list) => { for (const o of list) { if (!o || !o.active) continue; if (typeof o.faceW === "function" && o.parts) chips.push(o); else if (o.list) walk(o.list); } };
        walk(sc.children.list);
      }
      const shown = chips.filter((c) => c.visible !== false && c.alpha > 0.5 && c.showsWord).map((c) => {
        const t = c.parts.find((p) => p.type === "Text");
        const m = c.getWorldTransformMatrix();
        const sc = Math.hypot(m.a, m.b);
        return { word: t ? t.text : "", y: Math.round(m.ty * css), px: t ? 25 * Math.abs(t.scaleX) * sc * css : null };
      }).filter((p) => p.px);
      // rows: pills within 12 css px of each other's height
      const rows = [];
      shown.sort((a, b) => a.y - b.y).forEach((p) => { const r = rows.find((r) => Math.abs(r[0].y - p.y) <= 12); r ? r.push(p) : rows.push([p]); });
      for (const r of rows) {
        if (r.length < 2) continue;
        const lo = r.reduce((a, b) => (b.px < a.px ? b : a)), hi = r.reduce((a, b) => (b.px > a.px ? b : a));
        const ratio = lo.px / hi.px;
        W.__pills.n++;
        if (!W.__pills.worst || ratio < W.__pills.worst.ratio) W.__pills.worst = { ratio: Math.round(ratio * 100) / 100, small: `${lo.word} ${lo.px.toFixed(1)}px`, big: `${hi.word} ${hi.px.toFixed(1)}px`, row: r.map((p) => `${p.word}:${p.px.toFixed(1)}`).join(" "), phase: W.Cook.daarPhase || "" };
      }
    } catch (e) { W.__pills.err = String(e); }
  };
  setInterval(read, 200);
};

const srv = await startServer();
const browser = await launch();
const res = [];
try {
  for (const level of levels) for (const size of sizes) {
    const page = await newPage(browser, size);
    const rec = { note() {}, pend() {}, async state() {}, stop(m) { throw new Error(m); } };
    await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.addInitScript(`(${SAMPLER.toString()})()`);
    await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
    await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
    await page.evaluate(() => window.njgTest?.cook.coachesSeen && window.njgTest.cook.coachesSeen());
    await page.evaluate(([k, l]) => { njgTest.cook.lab(k, true, { level: l }); }, [station, level]);
    await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
    const P = new CookPlayer(page, rec, { mode: "fair", speed: 3 });
    await P.play(() => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: 200000 }).catch((e) => console.log("  player:", String(e.message || e).slice(0, 160)));
    await new Promise((r) => setTimeout(r, 600));
    const S = await page.evaluate("window.__pills");
    await page.context().close();
    const ok = !!S.worst && S.worst.ratio >= 0.9;
    const r = { level, size, ok, samples: S.n, worst: S.worst, err: S.err };
    res.push(r);
    console.log(JSON.stringify(r));
  }
} finally { await browser.close(); srv.close(); }
const bad = res.filter((r) => !r.ok);
console.log(bad.length ? `RED: ${bad.length} of ${res.length} pages have a pill word under 90% of its row's largest` : `GREEN: ${res.length} pages`);
process.exit(bad.length ? 1 : 0);
