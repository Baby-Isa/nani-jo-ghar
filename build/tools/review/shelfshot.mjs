#!/usr/bin/env node
// Chai's shelf, shot and measured (the stove-400 shelf swap and the size classes, 6 Nov): for each size and level, the lab's chai
// (seed 7, test speed 3, so a BEFORE and an AFTER run put out the same jars) once its pills are up: the whole play area, the shelf
// band cropped, and each shelf item's measure where the page gives one (Cook.chaiShelfSizes: id, class, opaque height in CSS px,
// the L height it is a share of). Run it on the old code for BEFORE and on the new for AFTER; build/tools/review/shelfsheet.py pairs them.
//   node build/tools/review/shelfshot.mjs --out <dir> [--levels 1,2,3,4] [--sizes 740x320,930x430,1280x665,1920x1080] [--wait ms] [--root <repo>]
//   (--wait: after the pills are up, default 600 ms, before the first-time light dims the scene; --root: a copy of an older tree for BEFORE)
import { writeFileSync, mkdirSync } from "node:fs";
import { args } from "./lib/common.mjs";

const a = args();
const out = a.val("out");
if (!out || a.has("help")) {
  console.log("node build/tools/review/shelfshot.mjs --out <dir> [--levels 1,2,3,4] [--sizes a,b] [--root <repo>]");
  process.exit(out ? 0 : 1);
}
const envPath = a.val("root") ? `${a.val("root")}/build/sandbox/lib/env.mjs` : "../../sandbox/lib/env.mjs";
const { PORT, startServer, launch, newPage, SIZES } = await import(envPath);
const levels = String(a.val("levels", "1,2,3,4")).split(",");
const sizes = String(a.val("sizes", "740x320,930x430,1280x665,1920x1080")).split(",");
mkdirSync(out, { recursive: true });
const srv = await startServer();
const browser = await launch();
const rows = [];
for (const size of sizes) {
  for (const level of levels) {
    const np = SIZES[size] ? await newPage(browser, size) : null;
    const [w, h] = size.split("x").map(Number);
    const p = np ? np.page : await browser.newPage({ viewport: { width: w, height: h }, hasTouch: h < 500 });
    await p.goto(`http://127.0.0.1:${PORT}/lab.html?mode=cook&game=chai-tray&level=${level}&nonav=1&seed=7&speed=3`, { waitUntil: "load" });
    let pills = null;
    const t0 = Date.now();
    while (Date.now() - t0 < 30000) {
      pills = await p.evaluate(() => (window.Cook && window.Cook.chaiPills ? window.Cook.chaiPills() : null)).catch(() => null);
      if (pills && pills.length) break;
      await p.waitForTimeout(200);
    }
    await p.waitForTimeout(+a.val("wait", 600));
    pills = (await p.evaluate(() => (window.Cook && window.Cook.chaiPills ? window.Cook.chaiPills() : null)).catch(() => null)) || [];
    // (the old code has no measure: each shelf item found on the scene, its opaque height from the station lib's opaqueSpan)
    const items = (await p.evaluate(() => {
      const C = window.Cook;
      if (!C) return null;
      if (C.chaiShelfSizes) return C.chaiShelfSizes();
      const S = C.scene, St = C.Stations, UI = C.UI || window.UI;
      if (!S || !St || !St.opaqueSpan) return null;
      const ppw = (C.UI || window.UI).worldToScreen(1, 0).x - (C.UI || window.UI).worldToScreen(0, 0).x;
      return S.children.list.filter((o) => o.isJar && o.texture).map((o) => {
        const [t, b] = St.opaqueSpan(S, o.texture.key);
        return { id: o.wordId, x: o.x, cls: null, cssH: Math.round((b - t) * o.texture.getSourceImage().height * Math.abs(o.scaleY) * ppw * 10) / 10 };
      }).sort((q, r) => q.x - r.x);
    }).catch(() => null)) || null;
    const tag = `${size}-L${level}`;
    await p.screenshot({ path: `${out}/full-${tag}.png` });
    if (pills.length) {
      const top = Math.max(0, Math.min(...pills.map((q) => q.top)) - Math.round(h * 0.42));
      const bot = Math.min(h, Math.max(...pills.map((q) => q.bottom)) + 8);
      await p.screenshot({ path: `${out}/shelf-${tag}.png`, clip: { x: 0, y: top, width: w, height: bot - top } });
    }
    rows.push({ size, level: +level, pills: pills.map((q) => q.id), items });
    console.log(`${tag}: ${pills.length} pills${items ? "; " + items.map((i) => `${i.id} ${i.cls} ${i.cssH}px`).join(", ") : ""}`);
    await p.close();
  }
}
await browser.close();
if (srv && srv.close) srv.close();
writeFileSync(`${out}/shelf.json`, JSON.stringify(rows, null, 1));
