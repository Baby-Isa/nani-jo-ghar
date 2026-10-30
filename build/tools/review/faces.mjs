#!/usr/bin/env node
// S14 tools, B2 (SH-167): read every face box of a Cook game from the game's own test hook (njgTest.cook.faces()) at a size.
//   node build/tools/review/faces.mjs [--game chai-tray] [--level 4] [--size 740x320] [--heads 3] [--secs 40] [--json]
// Starts the sandbox's server and browser (own port: COOK_TEST_PORT; under the browser lock like every browser run), taps the greeting,
// waits until the kitchen shows --heads people (or --secs), prints each face's box in page px. Exit 1 when fewer heads came.
import { args, help } from "./lib/common.mjs";
import { startServer, launch, newPage, BASE, sleep, ROOT } from "../../sandbox/lib/env.mjs";
import { readFaces } from "../../sandbox/lib/faces.mjs";

const a = args();
help("node build/tools/review/faces.mjs [--game chai-tray] [--level 4] [--size 740x320] [--heads 3] [--secs 40] [--json]\n  every face box of a Cook game at a size, from njgTest.cook.faces() (B2)", a);
const GAME = a.val("game") || "chai-tray", LEVEL = +(a.val("level") || 4), SIZE = a.val("size") || "740x320", WANT = +(a.val("heads") || 3), SECS = +(a.val("secs") || 40);

const srv = await startServer();
const browser = await launch();
let heads = [], all = [];
try {
  const { page } = await newPage(browser, SIZE, { seed: 1 });
  await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  await page.evaluate(() => window.njgTest?.cook.coachesSeen && window.njgTest.cook.coachesSeen());
  await page.evaluate(([g, l]) => { window.njgTest.cook.lab(g, true, { level: l }); }, [GAME, LEVEL]);
  const t0 = Date.now();
  while (Date.now() - t0 < SECS * 1000) {
    // the greeting's answer pill, tapped as a child would
    const g = await page.evaluate(() => { const e = window.njgTest.cook.expectation(); if (!e || e.kind !== "click" || !/^#choices/.test(e.selector || "")) return null; const el = document.querySelector(e.selector); const r = el && el.getBoundingClientRect(); return r && r.width > 2 ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }).catch(() => null);
    if (g) await page.mouse.click(g.x, g.y);
    const f = await readFaces(page);
    if (f) { all = f; heads = f.filter((x) => x.kind === "head"); if (heads.length >= WANT) break; }
    await sleep(200);
  }
} finally { await browser.close(); srv.close(); }

const r = (x) => Math.round(x * 10) / 10;
if (a.has("json")) console.log(JSON.stringify(all));
else {
  console.log(`${GAME} L${LEVEL} at ${SIZE}: ${heads.length} head${heads.length === 1 ? "" : "s"} in the kitchen, ${all.length - heads.length} face circle(s) in the page (page px)`);
  for (const f of all) console.log(`  ${String(f.kind).padEnd(6)} ${String(f.who || "?").padEnd(8)} [${r(f.left)}, ${r(f.top)}, ${r(f.right)}, ${r(f.bottom)}]  ${r(f.width)} x ${r(f.height)}${f.sel ? "  " + f.sel : ""}`);
}
process.exit(heads.length >= WANT ? 0 : 1);
