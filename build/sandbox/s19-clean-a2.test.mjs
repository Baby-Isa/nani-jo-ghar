// s19-clean-a2: the Fable review of s19-clean-a's merge, findings that need a page (skips where there is no browser).
// node --test build/sandbox/s19-clean-a2.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { launch, ROOT } from "./lib/env.mjs";

// finding 1 (farm's photo game: the arrow hint once per card, then never again): Onboard.stuck's glow rung fires again after an
// action and a new wait where the game puts its own light out (no glowStays); with glowStays (Cook's rungs, SH-261) it stays lit
async function glowsAfterAct(browser, stays) {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 400 } });
  const page = await ctx.newPage();
  await page.setContent("<!doctype html><meta charset=utf-8><body></body>");
  await page.evaluate(() => { window.__t = Date.now(); window.NaniGuide = { lastAction: () => window.__t }; });
  await page.addScriptTag({ path: join(ROOT, "js", "shared", "onboard.js") });
  const log = await page.evaluate(async (stays) => {
    const out = [];
    const h = window.Onboard.stuck("photo:cow", { at: [null, null, null], glowAt: 300, first: false, glowStays: stays, glow: (on) => out.push(on ? "on" : "off") });
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    await wait(700); // the glow rung
    window.__t = Date.now(); // the child taps the arrow (the game puts its own light out: the kit is not told)
    await wait(900); // the next wait
    h.stop();
    return out;
  }, stays);
  await ctx.close();
  return log;
}

test("finding 1: the light help fires again after an action where the game does not keep it (farm's arrows); stays lit with glowStays (Cook)", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  try {
    const farm = await glowsAfterAct(browser, false);
    assert.deepEqual(farm.slice(0, 3), ["on", "off", "on"], `the arrow lit, out at the tap, lit again after the wait: ${farm}`);
    const cook = await glowsAfterAct(browser, true);
    assert.deepEqual(cook.filter((x) => x === "on").length, 1, `Cook's light lit once and kept: ${cook}`);
    assert.ok(!cook.slice(0, -1).includes("off"), `Cook's light not put out by the tap: ${cook}`);
  } finally { await browser.close(); }
});

// findings 2 and 3: which cards the pop-up brings, and which rows it marks (NjgWrongOrder.pick, no DOM), and what the serve tells it
const { NjgWrongOrder } = await import("../../js/shared/wrong-order.js");
const { NjgServe } = await import("../../js/shared/serve.js");
const row = (ids, o = {}) => ({ ids, head: false, wrong: false, ...o });

test("finding 2: corn serves Nana alone and her plate is wrong: only her card comes, never Ma's or the cousin's (not made yet)", () => {
  const cards = [{ who: "nana", rows: [row(["corn"]), row(["chilli"], { wrong: true })] }, { who: "ma", rows: [row(["corn"])] }, { who: "cousin", rows: [row(["corn"])] }];
  assert.deepEqual(NjgWrongOrder.pick(cards, { served: ["nana"] }).people.map((c) => c.who), ["nana"]);
  // (before: every card in play, the unmade two ticked and gold-glowed)
  assert.deepEqual(NjgWrongOrder.pick(cards, {}).people.map((c) => c.who), ["nana", "ma", "cousin"]);
  // chai serves every pan at once: every person judged
  assert.equal(NjgWrongOrder.pick(cards, { served: ["nana", "ma", "cousin"] }).people.length, 3);
});

test("finding 3: maani's second wrong serve crosses the row wrong now (a second millet), never the wheat row's first-try miss", () => {
  const wheat = row(["ph-wheat", "cook-maani"], { miss: true });
  const millet = row(["ph-millet", "cook-maani"]);
  const cards = [{ who: "nana", rows: [{ ids: [], head: true }, wheat, millet] }];
  const p = NjgWrongOrder.pick(cards, { served: ["ph-wheat+cook-maani", "ph-millet+cook-maani"], wrong: ["ph-millet+cook-maani"] });
  assert.deepEqual(p.people.map((c) => c.who), ["nana"], "the dishes are not people: the one card");
  assert.deepEqual(p.mark, [millet]);
  // nothing matched: nothing crossed (the game's own recast plays), never the old miss
  assert.deepEqual(NjgWrongOrder.pick(cards, { wrong: ["bowl"] }).mark, []);
});

test("the serve tells the host's pop-up which people it judged and which dishes were wrong", async () => {
  const seen = [];
  NjgServe.use({ show: (o) => (seen.push(o), true), redo() {}, end() {} });
  try {
    let n = 0;
    await NjgServe.round({
      items: ["nana"], done: async () => {}, review: async () => [], recast: async () => {},
      check: () => ({ ok: n++ > 0, rows: [] }), redo: { wrong: () => ({ action: "again" }) }, key: (x) => x, reset() {}, again() {},
    });
    assert.deepEqual(seen[0].served, ["nana"]);
    assert.deepEqual(seen[0].wrong, ["nana"]);
    const pans = [{ who: "nana" }, { who: "ma" }];
    seen.length = 0;
    await NjgServe.round({ items: pans, done: async () => {}, review: async () => [], recast: async () => {}, check: (p) => ({ ok: p.who === "ma" }) });
    assert.deepEqual(seen[0].served, ["nana", "ma"]);
    assert.deepEqual(seen[0].wrongWho, ["nana"]);
  } finally { NjgServe.use(null); }
});
