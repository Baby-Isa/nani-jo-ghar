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

// finding 4 (non-negotiable 7): a tap on the pop-up hurries it past the lines; leaving the stage ends it, its veil gone
test("finding 4: a tap hurries the wrong-order pop-up's line in flight; the stage's end takes it away", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  try {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 400 } });
    const page = await ctx.newPage();
    await page.setContent("<!doctype html><meta charset=utf-8><body style='margin:0'><div id=stage style='position:absolute;inset:0'></div></body>");
    await page.evaluate(() => { const ends = []; window.Lifecycle = { onStageEnd: (f) => (ends.push(f), () => ends.splice(ends.indexOf(f), 1)), end: () => ends.slice().forEach((f) => f()) }; });
    await page.addScriptTag({ path: join(ROOT, "js", "shared", "wrong-order.js"), type: "module" });
    await page.waitForFunction(() => window.NjgWrongOrder);
    // (s19-clean-a4: robust to a loaded machine, not looser: each line's own start is logged (the say calls), so the measures are each
    // line's length against the pop-up's own cap and floor (load only makes a wait longer, never a hurried line look kept), and the
    // tap lands inside a line by the log, not by a wall-clock guess)
    const run = (tap, end) => page.evaluate(async ({ tap, end }) => {
      const calls = [];
      const never = () => { calls.push(performance.now()); return new Promise(() => {}); }; // a voice that never ends
      const big = () => { const el = document.createElement("div"); el.textContent = "card"; const rows = [1, 2, 3, 4, 5].map((i) => { const r = document.createElement("div"); r.className = "oc-row"; r.textContent = "row " + i; el.appendChild(r); return { el: r, ok: i !== 3, say: never }; }); return { el, rows, head: never }; };
      const t0 = performance.now();
      let tapAt = null;
      const p = window.NjgWrongOrder.play({ host: document.getElementById("stage"), cards: [{ who: "ma", ok: false, face: "", headline: "x", big }] });
      // (the tap: inside the second row's line (a line a tap may stop), 700 ms after it started by the log: past the floor, short of the cap)
      if (tap) {
        const want = 3; // head, row 1, row 2
        await new Promise((res) => { const q = setInterval(() => { if (calls.length >= want) { clearInterval(q); res(); } }, 20); });
        await new Promise((res) => setTimeout(res, Math.max(0, calls[want - 1] + 700 - performance.now())));
        tapAt = performance.now();
        document.querySelector(".njg-wo").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      }
      if (end) setTimeout(() => window.Lifecycle.end(), 1200);
      await p;
      return { ms: performance.now() - t0, left: document.querySelectorAll(".njg-wo").length, calls: calls.map((c) => c - t0), tapAt: tapAt == null ? null : tapAt - t0 };
    }, { tap, end });
    const CAP = 2400, FLOOR = 500; // (js/shared/wrong-order.js LOOK.sayCap and LOOK.minSay, speed 1)
    const slow = await run(false, false);
    const fast = await run(true, false);
    const gone = await run(false, true);
    const gaps = (c) => c.slice(1).map((x, i) => x - c[i]);
    // untouched: every line said (the head and the five rows), each held to its cap (load only lengthens a wait)
    assert.equal(slow.calls.length, 6, `untouched: the head and the five rows each said (${slow.calls.length} lines)`);
    assert.ok(gaps(slow.calls).every((g) => g >= CAP - 60), `untouched: every line waited for up to its cap (${gaps(slow.calls).map(Math.round).join(", ")} ms)`);
    // (s19-clean-a3, the a2 review's finding 3: a tap hurries the line being said only, never the whole pop-up: the rest are said)
    assert.equal(fast.calls.length, 6, `a tap hurries the line in flight only: every line still said (${fast.calls.length} lines)`);
    const g = gaps(fast.calls);
    const k = fast.calls.findIndex((c, i) => c <= fast.tapAt && (fast.calls[i + 1] == null || fast.calls[i + 1] > fast.tapAt));
    assert.equal(k, 2, `the tap landed in the second row's line (line ${k})`);
    assert.ok(g[k] < CAP - 600, `the line in flight ends at the tap, short of its cap: ${Math.round(g[k])} ms (cap ${CAP})`);
    assert.ok(g[k] >= FLOOR - 60, `... once heard its floor: ${Math.round(g[k])} ms`);
    assert.ok(g.every((x, i) => i === k || x >= CAP - 60), `the other lines each held to their cap: ${g.map(Math.round).join(", ")} ms`);
    assert.ok(gone.ms < 2500 && gone.left === 0, `the stage's end takes it away at once: ${Math.round(gone.ms)} ms, ${gone.left} left`);
    await ctx.close();
  } finally { await browser.close(); }
});

// finding 5: a child's own swipe along an order card's item row stays through a redraw (Nani's hint, a focus change) until the next tick
test("finding 5: the child's own scroll of the item row is not undone by the next redraw", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  const { startServer, BASE } = await import("./lib/env.mjs");
  let srv;
  try { srv = await startServer(); } catch (e) { await browser.close(); return t.skip("port busy"); }
  try {
    const ctx = await browser.newContext({ viewport: { width: 740, height: 320 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/lab/order-card.html`, { waitUntil: "load" });
    await page.addStyleTag({ url: `${BASE}/css/shared/word-card.css` });
    await page.addScriptTag({ url: `${BASE}/js/shared/word-card.js` });
    const out = await page.evaluate(async () => {
      const OC = window.OrderCard;
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const word = (k) => ({ kutchi: k, english: k, picture: "assets/cook/items-s17-stove/f-tea-jar.webp" });
      const parts = ["paani", "chai", "dudh", "khun", "elchi", "aadu", "jeeru"].map((k, i) => ({ label: k, key: { id: k }, word: word(k), done: i === 0 }));
      const data = { person: { id: "ma", face: "assets/cook/characters/ma-face.webp" }, headline: { html: "x" }, items: [{ label: null, parts }] };
      const fold = {};
      const host = document.createElement("div");
      host.style.cssText = "position:fixed;left:0;top:0;width:240px;z-index:999;background:#fff";
      document.body.appendChild(host);
      const draw = () => { host.innerHTML = ""; const c = OC.card(data, { fold, s14: true }); host.appendChild(c); OC.settle14(c, null, fold); return c; };
      let c = draw();
      await wait(1500);
      const row = c.querySelector(".oc-row14");
      if (!row || row.scrollWidth <= row.clientWidth + 4) return { skip: `no scrolling row (${c.className}; ${row ? row.scrollWidth + "/" + row.clientWidth : "none"})` };
      row.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      row.scrollLeft = row.scrollWidth; // the child swipes to the end
      await wait(400);
      const swiped = row.scrollLeft;
      c = draw(); // a redraw (a hint, a focus change)
      await wait(1600);
      return { swiped, after: c.querySelector(".oc-row14").scrollLeft };
    });
    if (out.skip) return t.skip(out.skip);
    assert.ok(out.swiped > 20, `the swipe moved the row (${out.swiped})`);
    assert.ok(Math.abs(out.after - out.swiped) <= 2, `the redraw kept the child's scroll: ${out.after} against ${out.swiped}`);
    await ctx.close();
  } finally { await browser.close(); srv.close(); }
});

test("finding 7: with the pop-up shown, the recast's words are skipped but the game's undo (chaat's wrong layers out) runs", async () => {
  const log = [];
  NjgServe.use({ show: () => true, redo() {}, end() {} });
  try {
    let n = 0;
    await NjgServe.round({
      items: ["bowl"], done: async () => {}, review: async () => [], check: () => ({ ok: n++ > 0, rows: [] }),
      recast: async () => log.push("recast"), undo: async (item) => log.push(`undo:${item}`),
      redo: { wrong: () => ({ action: "again" }) }, key: (x) => x, reset: (x) => log.push(`reset:${x}`), again() {},
    });
    assert.deepEqual(log, ["undo:bowl", "reset:bowl"]);
  } finally { NjgServe.use(null); }
});

// the round-two review's finding 6: a "tap" gesture is the finger tapping on the point (logged as a tap), after its light (o.ready)
test("finding 6 (round two): a tap's finger is a tap, and waits for its light", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  try {
    const ctx = await browser.newContext({ viewport: { width: 800, height: 400 } });
    const page = await ctx.newPage();
    await page.setContent("<!doctype html><meta charset=utf-8><body></body>");
    await page.evaluate(() => { window.__g = []; window.Lifecycle = { note: (w, i) => w === "ghost" && window.__g.push([Date.now(), i && i.step, i && i.by]), onStageEnd: () => () => {} }; });
    await page.addScriptTag({ path: join(ROOT, "js", "shared", "onboard.js") });
    const out = await page.evaluate(async () => {
      let lit = false;
      const t0 = Date.now();
      const g = window.Onboard.gesture(() => ({ from: { x: 200, y: 200 }, to: { x: 200, y: 200 } }), { gesture: "tap", ms: 900, step: "x:tap", ready: () => lit });
      await new Promise((r) => setTimeout(r, 600));
      const before = document.querySelectorAll(".ob-finger").length;
      lit = true;
      await new Promise((r) => setTimeout(r, 700));
      const after = document.querySelectorAll(".ob-finger").length;
      g.stop();
      return { before, after, ghosts: window.__g.map((x) => [x[0] - t0, x[2]]) };
    });
    assert.equal(out.before, 0, "no finger before its light");
    assert.ok(out.after >= 1, "the finger once the light is up");
    await ctx.close();
  } finally { await browser.close(); }
});
