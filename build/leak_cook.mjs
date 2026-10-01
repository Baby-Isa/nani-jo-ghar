#!/usr/bin/env node
/*
 * Cook's leak bot (C10, LNG-02), in Node + Chromium: build/test_cook.py's Wave 6b leak checks, ported (R4), run in
 * the real cook.html (modules, the core) on the page's own recipes and order card:
 *   "count the cards": a player who knows no Kutchi makes as many of each kind as the order card shows cards
 *                      (one card per unit would give the count away); reported per level, count > 1 only;
 *   "tap till it ticks": keep adding one until the count row ticks (a live tick would stop the player at the number):
 *                      must never win (E11: rows tick when the step closes).
 * Exit 1 if a count row ticks at its number, or the cards give a count away more than 10% at any level.
 *   COOK_TEST_PORT=8817 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/leak_cook.mjs
 */
import { startServer, launch, newPage, BASE } from "./sandbox/lib/env.mjs";

const server = await startServer();
const browser = await launch();
const { page, errors } = await newPage(browser, "1366x768");
let code = 1;
try {
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  const leak = await page.evaluate(() => {
    const R = Cook.Recipes;
    const leak = { tick: { n: 0, win: 0 } };
    [1, 2, 3, 4].forEach((lv) => (leak[`cards L${lv}`] = { n: 0, win: 0 }));
    ["mishkaki", "maani", "samosa", "chai", "chaat", "daal"].forEach((rid) => {
      if (!R[rid]) return;
      [1, 2, 3, 4].forEach((level) => {
        for (let n = 0; n < 40; n++) {
          const d = R[rid].make("nana", { level });
          const L = Cook.Order.ladder(d, 0);
          Cook.UI.mission.open({ who: "nana", name: "Nana", ladders: [L], busy: false });
          Cook.Order.rows(L)
            .filter((r) => !r.head && !r.no && r.cards)
            .forEach((r) => {
              const want = r.qty || 1;
              const cards = [...document.querySelectorAll("#mission .oc-irow")].filter((c) => c.textContent.trim() === Cook.Lang.plain(r.line).trim()).length || 1;
              if (want > 1) {
                leak[`cards L${level}`].n++;
                if (cards === want) leak[`cards L${level}`].win++;
              }
            });
          Cook.Order.rows(L)
            .filter((r) => Cook.UI.mission.isCount(r))
            .forEach((r) => {
              const want = (r.parts || []).find((p) => typeof p === "number") || 1;
              let taps = 0;
              while (!r.done && taps < 8) {
                taps++;
                Cook.UI.mission.tickItem(r.ids[r.ids.length - 1], 0);
              }
              leak.tick.n++;
              if (r.done && taps === want) leak.tick.win++;
            });
          Cook.UI.mission.close();
        }
      });
    });
    return leak;
  });
  const bad = [];
  for (const [k, v] of Object.entries(leak)) {
    const pc = (100 * v.win) / Math.max(1, v.n);
    console.log(`  leak '${k}': ${v.win}/${v.n} = ${pc.toFixed(1)}%`);
    if (k === "tick" ? v.win > 0 : pc > 10) bad.push(k);
  }
  if (errors.length) console.log("  page errors:", errors);
  code = bad.length || errors.length ? 1 : 0;
  console.log(code ? `leak_cook: FAIL (${bad.join(", ")})` : "leak_cook: ok");
} catch (e) {
  console.log("leak_cook: FAILED", e.message);
} finally {
  await browser.close();
  server.close();
}
process.exit(code);
