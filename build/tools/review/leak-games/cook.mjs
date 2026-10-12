#!/usr/bin/env node
/*
 * Cook's leak bot (C10, LNG-02), in Node + Chromium: build/test_cook.py's Wave 6b leak checks, ported (R4), run in
 * the real cook.html (modules, the core) on the page's own recipes and order card:
 *   "count the cards": a player who knows no Kutchi makes as many of each kind as the order card shows cards
 *                      (one card per unit would give the count away); reported per level, count > 1 only;
 *   "tap till it ticks": keep adding one until the count row ticks (a live tick would stop the player at the number):
 *                      must never win (E11: rows tick when the step closes).
 *   the pantry (PAN-15, non-negotiable 6; S05-B): the real pantry (Station lab "fetch") on a returning child's save (every
 *                      word the pantry orders known, the decoys never met), read off the screen: which jars wear a word
 *                      label. Strategies "unlabelled" (fetch the jars with no label), "labelled" (the ones with one) and
 *                      "letters" (the jars whose label text is written on the card) must each win under 10% at every level.
 * Exit 1 if a count row ticks at its number, the cards give a count away, or a pantry strategy wins, more than 10% at any level.
 *   COOK_TEST_PORT=8817 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/tools/review/leak-games/cook.mjs [--pantry 12]
 *   (--pantry N: pantry rounds per level, default 12; --pantry 0 skips it; --only pantry: the pantry alone, PAN-15's probe)
 */
import { startServer, launch, newPage, BASE } from "../../../sandbox/lib/env.mjs";

const server = await startServer();
const browser = await launch();
const { page, errors } = await newPage(browser, "1366x768");
let code = 1;
try {
  await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  const ONLY_PANTRY = process.argv.includes("--only") && process.argv[process.argv.indexOf("--only") + 1] === "pantry";
  const leak = ONLY_PANTRY ? {} : await page.evaluate(() => {
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
  // ---- the pantry (PAN-15): are the shelf labels the order? ----
  const PR = Number((process.argv.find((x, i) => process.argv[i - 1] === "--pantry")) ?? 12);
  if (PR > 0) {
    const pantry = await pantryLeak(page, PR);
    for (const [k, v] of Object.entries(pantry)) {
      const pc = (100 * v.win) / Math.max(1, v.n);
      console.log(`  leak '${k}': ${v.win.toFixed(2)}/${v.n} = ${pc.toFixed(1)}%${v.note ? `  (${v.note})` : ""}`);
      if (pc >= 10) bad.push(k);
    }
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

/**
 * The pantry, read off the screen (PAN-15). Each round: a fresh cook.html on a returning child's save, the Station lab's
 * pantry at that level; once the shelf is up, every jar (its wordId) and whether it wears a label (and the label's text),
 * against what Nani's list needs. A strategy's win is its exact chance of fetching just the needed jars, given what it
 * sees: it fetches as many jars as the tray has spaces, picked at random among the jars its rule prefers.
 */
async function pantryLeak(page, rounds) {
  const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return r; };
  // the chance of picking exactly `need` when the strategy prefers set P (then the rest at random)
  const chance = (all, pref, need) => {
    const n = need.length, P = all.filter((x) => pref.has(x)), R = all.filter((x) => !pref.has(x));
    if (P.length >= n) return need.every((x) => pref.has(x)) ? 1 / C(P.length, n) : 0;
    return P.every((x) => need.includes(x)) ? 1 / C(R.length, n - P.length) : 0;
  };
  const out = {};
  for (let level = 1; level <= 4; level++) {
    for (const k of ["unlabelled", "labelled", "letters"]) out[`pantry ${k} L${level}`] = { n: 0, win: 0 };
    for (let r = 0; r < rounds; r++) {
      await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
      await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
      const shelf = await page.evaluate(async (lv) => {
        // a returning child: every word a pantry list can ask for is known (heard and fetched right, word stage 3)
        const R = Cook.Recipes;
        const asked = new Set();
        for (let i = 0; i < 60; i++) R.pantry.need(R.pantry.make("nani", { level: lv })).forEach((id) => asked.add(id));
        Cook.save.words = Cook.save.words || {};
        asked.forEach((id) => (Cook.save.words[id] = { seen: 6, right: 5, miss: 0 }));
        Cook.writeSave();
        if (window.__cook.coachesSeen) window.__cook.coachesSeen();
        let need = null, S = null;
        const def = Cook.Mech.defs.fetch;
        const run = def.run;
        def.run = function (z, p) { need = p.need.slice(); S = z.S; return run.apply(this, arguments); };
        window.__cook.lab("fetch", false, { level: lv });
        const t0 = Date.now();
        while (Date.now() - t0 < 15000) {
          await new Promise((res) => setTimeout(res, 150));
          if (need && Cook.expect && Cook.expect.kind) break;
        }
        if (!need || !S) return { error: "the pantry never opened" };
        const jars = [];
        const walk = (list) => (list || []).forEach((o) => {
          if (o && o.list) walk(o.list);
          if (o && o.wordId && o.active !== false && o.visible !== false) jars.push({ id: o.wordId, label: !!(o.label && o.label.active !== false), text: o.label && o.label.list ? o.label.list.filter((x) => x.type === "Text").map((x) => x.text).join(" ") : "" });
        });
        walk(S.children.list);
        const card = (document.querySelector("#mission") || {}).textContent || "";
        return { need, jars, card, stages: need.map((id) => Cook.wordStage(id)) };
      }, level);
      if (shelf.error) { out[`pantry unlabelled L${level}`].note = shelf.error; continue; }
      const all = shelf.jars.map((j) => j.id);
      const lab = new Set(shelf.jars.filter((j) => j.label).map((j) => j.id));
      const unlab = new Set(all.filter((x) => !lab.has(x)));
      const letters = new Set(shelf.jars.filter((j) => j.label && j.text && shelf.card.toLowerCase().includes(j.text.toLowerCase())).map((j) => j.id));
      for (const [k, pref] of [["unlabelled", unlab], ["labelled", lab], ["letters", letters]]) {
        const o = out[`pantry ${k} L${level}`];
        o.n++;
        o.win += chance(all, pref, shelf.need);
        o.note = `last shelf ${all.length} jars, ${lab.size} labelled, needs ${shelf.need.length} (stages ${shelf.stages.join(",")})`;
      }
    }
  }
  return out;
}
