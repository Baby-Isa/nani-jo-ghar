// R4 (decision 24): how wide each Cook view's play really is. Plays each Station-lab station (fair, level 1 and 4)
// and, at every new view, collects the world bounds of everything tappable (Phaser objects with input) and of every
// shelf chip, so a view's safe area (data/layout.json stage.scenes["cook:<view>"].safe) can be narrowed to what the
// child must reach. Prints JSON: {view: {x0, x1, y0, y1, n, from: [stations]}}.
//   COOK_TEST_PORT=8817 flock -w 1800 /tmp/njg-browser.lock timeout 1100 node build/measure_cook_views.mjs [stations] [levels]
import { startServer, launch, newPage, BASE, sleep } from "./sandbox/lib/env.mjs";
import { CookPlayer } from "./sandbox/lib/cook-player.mjs";
import { writeFileSync } from "node:fs";

const keys = (process.argv[2] || "fetch,chai-tray,maani-line,mishkaki-grill,daar,chop,tadka,stir,assemble,samosa").split(",");
const levels = (process.argv[3] || "1,4").split(",").map(Number);
const out = process.argv[4] || null;
const server = await startServer();
const browser = await launch();
const views = {};
const MEASURE = `(() => {
  const S = Cook.scene; if (!S) return null;
  const boxes = [];
  const walk = (list, depth) => list.forEach((o) => {
    if (!o || !o.visible || o.alpha === 0) return;
    if (o.input && o.input.enabled && o.getBounds) { const b = o.getBounds(); if (b.width > 0 && b.width < 1500) boxes.push([b.x, b.y, b.x + b.width, b.y + b.height]); }
    if (o.list && depth < 4) walk(o.list, depth + 1);
  });
  walk(S.children.list, 0);
  return { view: S.viewName, boxes };
})()`;
for (const key of keys) for (const level of levels) {
  const { page, errors } = await newPage(browser, "1366x768");
  try {
    await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
    await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
    const rec = { state: async () => { const m = await page.evaluate(MEASURE).catch(() => null); if (!m || !m.view) return; const v = (views[m.view] = views[m.view] || { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9, n: 0, from: [] }); m.boxes.forEach(([a, b, c, d]) => { v.x0 = Math.min(v.x0, a); v.x1 = Math.max(v.x1, c); v.y0 = Math.min(v.y0, b); v.y1 = Math.max(v.y1, d); v.n++; }); if (!v.from.includes(key)) v.from.push(key); }, note() {}, pend() {}, stop(m) { throw new Error(m); } };
    const P = new CookPlayer(page, rec, { mode: "fair" });
    P.helped = true;
    // measure on every expectation, not only once per name
    P.once = async () => rec.state();
    await page.evaluate(([k, l]) => { __cook.lab(k, true, { level: l }); }, [key, level]);
    await P.play(() => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: 300000 });
    console.error(`${key}@L${level}: ok${errors.length ? " errors " + errors.join(";") : ""}`);
  } catch (e) {
    console.error(`${key}@L${level}: ${e.message.split("\n")[0]}`);
  }
  await page.close();
}
await browser.close();
server.close();
const round = (v) => Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeof x === "number" ? Math.round(x) : x]));
const res = Object.fromEntries(Object.entries(views).map(([k, v]) => [k, round(v)]));
console.log(JSON.stringify(res, null, 1));
if (out) writeFileSync(out, JSON.stringify(res, null, 1));
