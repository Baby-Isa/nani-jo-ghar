// S08 wave 6E (the builders' requests): contract-35 and contract-36 read the stage's real level (the order-level note, #side's
// data-level), contract-21 skips a tap the first-time help blocked, contract-1 counts a pop-up the first tap closed and a request
// logged just before its pop-up's sample, the SH-60 strip marks the moment the help is logged.
// node --test build/sandbox/contract-w6e.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, realLevel } from "./lib/contract.mjs";
import { markStrip, isHelpMoment } from "./lib/strip-mark.mjs";
import { encodePng, decodePng } from "../tools/review/lib/png.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const clip = () => 0.6;
const run = (r) => analyse(r, { root: ROOT, retired: [], clip, lexicon: new Set(["muke", "bhar", "chai", "khape"]), numbers: new Set(["ek", "ba", "trae"]) });
const of = (out, c) => out.filter((b) => b.check === c);
const page = (flow, timeline, size = "1366x768") => ({ flow, size, t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const stage = (t, key) => C(t, "stage", { key });
const life = (t, what, step = "", o = {}) => C(t, "life", { what, reason: step, at: t, ...o });
const line = (id, t, text, o = {}) => ({ type: "line", id, who: "cook", text, t, ...o });
const lineEnd = (id, t) => ({ type: "line-end", id, t });
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);
const T = 1e6;
const ST = "cook:station1:chai";

// ---- contract-35, contract-36: the stage's real level ----
const dayCard = (level, closed) => sorted([stage(T, ST), life(T + 10, "stage-start", "cook:station"),
  ...(level ? [life(T + 5, "order-level", String(level), { step: String(level), by: "nani" })] : []),
  C(T + 500, "side", { n: 1, rows: 1, done: 0, closed, peek: 0, dots: 0, words: [] }),
  C(T + 600, "rows", { list: [{ id: "r1", key: "k", text: "Muke bhar", done: false, en: false, no: false }] }),
  C(T + 1000, "input", { x: 400, y: 300, on: "canvas", next: false, btn: null, popup: false, side: false, play: true })]);

test("contract-35: a day flow's L4 order under an L1 label: the closed card is right (the order's own level), not a break", () => {
  assert.equal(of(run(page("cook:day3", dayCard(0, 1))), "contract-35").length, 1, "red: the label's L1 wants the card open");
  assert.equal(of(run(page("cook:day3", dayCard(4, 1))), "contract-35").length, 0, "green: the order-level note says L4");
});

test("contract-35: an open card at the order's own L4 is the break, and it names L4", () => {
  const b = of(run(page("cook:day6", dayCard(4, 0))), "contract-35");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /at L4/);
  assert.equal(b[0].level, 4);
});

test("contract-35: #side's data-level (the side sample's lv) is read when no note was logged", () => {
  const tl = dayCard(0, 1);
  tl.find((e) => e.k === "side").lv = "4";
  assert.equal(of(run(page("cook:day3", tl)), "contract-35").length, 0);
  assert.equal(realLevel(tl, T + 900, 1), 4);
  assert.equal(realLevel(tl, T + 100, 2), 2, "before any sample: the flow's label");
});

test("contract-36: a step opened and never called reports the stage's real level, not the flow's label", () => {
  const tl = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), life(T + 5, "order-level", "3", { step: "3", by: "nani" }),
    life(T + 2000, "step-open", "1", { by: "L3" }), C(T + 12000, "input", { x: 1, y: 1, on: "canvas", next: false, popup: false, side: false, play: true })]);
  const b = of(run(page("cook:day3", tl)), "contract-36");
  assert.equal(b.length, 1);
  assert.equal(b[0].level, 3);
});

// ---- contract-21: a tap the first-time help blocked ----
test("contract-21: a tap the first-time help's layer blocked reaches no game and logs no act: not a break; a lost tap still is", () => {
  const exp = { cook: { kind: "tap", intro: false } };
  const base = [stage(T, ST), life(T, "stage-start", "cook:station"), line(1, T + 100, "Muke chai khape."), lineEnd(1, T + 2500),
    C(T + 600, "input", { x: 400, y: 300, on: "canvas", next: false, btn: null, popup: false, side: false, play: true, exp })];
  assert.equal(of(run(page("cook:chai-tray", sorted(base.slice()))), "contract-21").length, 1, "red: a tap while she speaks, no act");
  const blocked = sorted([...base, C(T + 605, "input-blocked", { x: 400, y: 300, by: "onboard" })]);
  assert.equal(of(run(page("cook:chai-tray", blocked)), "contract-21").length, 0, "green: it was blocked on purpose");
  const elsewhere = sorted([...base, C(T + 605, "input-blocked", { x: 900, y: 100, by: "onboard" })]);
  assert.equal(of(run(page("cook:chai-tray", elsewhere)), "contract-21").length, 1, "red: a block somewhere else is no excuse");
});

// ---- contract-1: a pop-up the first tap closed, a request just before the sample ----
const popStage = (extra) => sorted([stage(T, "host:clinic/eye"), C(T + 10, "popup", { open: false }), C(T + 50, "side", { n: 1, rows: 3, done: 0, closed: 0, peek: 0, dots: 0, words: [] }), ...extra,
  C(T + 4000, "input", { x: 400, y: 300, on: "canvas", next: false, btn: null, popup: false, side: false, play: true })]);

test("contract-1: a request logged 505 ms before its pop-up's sample is that pop-up's (the read-out began in between)", () => {
  const tl = popStage([life(T + 100, "request", "clinic:heal/eye"), line(1, T + 140, "Drops first."), lineEnd(1, T + 480), C(T + 605, "popup", { open: true }), C(T + 700, "popup", { open: false })]);
  assert.equal(of(run(page("clinic:heal-eye", tl)), "contract-1").length, 0);
});

test("contract-1: the next pop-up opening as the last one closes: its request is logged just before that close sample", () => {
  const tl = popStage([life(T + 100, "request", "a"), line(1, T + 140, "Drops first."), lineEnd(1, T + 480), C(T + 200, "popup", { open: true }), C(T + 1000, "popup", { open: false }),
    life(T + 960, "request", "b"), line(2, T + 985, "Muke chai khape."), lineEnd(2, T + 1300), C(T + 1100, "popup", { open: true }), C(T + 1500, "popup", { open: false })]);
  assert.equal(of(run(page("clinic:heal-eye", tl)), "contract-1").length, 0);
});

test("contract-1: a pop-up the child's first tap closed before the voice began counts; one up for seconds in silence still does not", () => {
  const closed = popStage([C(T + 100, "popup", { open: true }), C(T + 900, "input", { x: 300, y: 200, on: "div", next: false, btn: null, popup: true, side: false, play: true }), C(T + 950, "popup", { open: false })]);
  assert.equal(of(run(page("clinic:heal-eye", closed)), "contract-1").length, 0, "green: tapped away at 0.8 s");
  const silent = popStage([C(T + 100, "popup", { open: true }), C(T + 3000, "input", { x: 300, y: 200, on: "div", next: false, btn: null, popup: true, side: false, play: true }), C(T + 3050, "popup", { open: false })]);
  assert.ok(of(run(page("clinic:heal-eye", silent)), "contract-1").some((b) => /not read out/.test(b.measured)), "red: 3 s of silence is not read out");
});

// ---- the SH-60 strip: the frame where the help was logged is marked ----
const frame = (shade) => encodePng({ w: 60, h: 40, data: Buffer.alloc(60 * 40 * 4, shade).map((v, i) => (i % 4 === 3 ? 255 : v)) });
test("the strip marks the first frame at or after the logged help; no help, no mark", () => {
  assert.ok(isHelpMoment("life:help") && isHelpMoment("rec:hint-glow") && !isHelpMoment("life:act"));
  const bufs = [frame(120), frame(120), frame(120), frame(120)], times = [0, 1000, 2000, 3000];
  const none = markStrip(bufs, times, []);
  assert.deepEqual(none.marks, []);
  assert.deepEqual(none.bufs.map((b, i) => b.equals(bufs[i])), [true, true, true, true]);
  const m = markStrip(bufs, times, [{ name: "life:help", ms: 1500 }]);
  assert.deepEqual(m.marks, [{ name: "life:help", ms: 1500, frame: 2 }]);
  assert.ok(!m.bufs[0].equals(bufs[0]) === false && !m.bufs[1].equals(bufs[1]) === false, "the frames before it are untouched");
  assert.ok(!m.bufs[2].equals(bufs[2]), "frame 2 is marked");
  const img = decodePng(m.bufs[2]);
  assert.equal(img.w, 60, "same size");
  assert.deepEqual([img.data[0], img.data[1], img.data[2]], [220, 30, 30], "a red bar across its top row");
  const late = markStrip(bufs, times, [{ name: "life:help", ms: 9000 }]);
  assert.deepEqual(late.marks, [], "a help after the last frame is not in it");
});

// ---- CK-31: the serve-wrong driver's wrong is a real one ----
test("serve-wrong: the sugar step's salt is a real wrong; the tea leaves' second water (the game only wiggles) is not", async () => {
  const { realWrong } = await import("./lib/cook-player.mjs");
  const w = [{ x: 10, y: 10 }];
  assert.equal(realWrong({ kind: "tap", key: "cook-khun", swrongs: w }), true);
  assert.equal(realWrong({ kind: "tap", key: "cook-chai", swrongs: w }), false, "red: the first step with a wrong was this one");
  assert.equal(realWrong({ kind: "tap", key: "knob-on-ali", swrongs: w }), false);
  assert.equal(realWrong({ kind: "tap", key: "cook-khun", swrongs: [] }), false);
  assert.equal(realWrong(null), false);
});

// ---- SH-113 / contract-30: recipe-mishkaki L4, two different mixes ----
test("mishkaki L4: two different mixes are said, and written, each by its own count; the same mix twice keeps its 'ba'", async () => {
  const { loadCookEngine } = await import("../test_cook_harness.mjs");
  let distinct = 0, same = 0;
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const { Cook } = await loadCookEngine({ seed });
    const who = Object.keys(Cook.data.customers)[0];
    const L = Cook.Order.ladder(Cook.Recipes.mishkaki.make(who, { level: 4 }), 0);
    const rows = Cook.Order.rows(L, { all: true }).filter((r) => r.cards && r.ids.includes("ph-mixed"));
    const said = Cook.Lang.plain(Cook.Order.speech([L]));
    for (const r of rows) {
      const lists = L.sections.filter((y) => y.cardOf === "ph-mixed").length;
      if ((r.qty || 1) < 2) continue;
      if (lists === r.qty) {
        distinct++;
        assert.equal(Cook.Lang.plain(r.line), "hakri lakri mixed", `seed ${seed}: the card row`);
        assert.equal((said.match(/hakri lakri mixed/g) || []).length, 2, `seed ${seed}: each mix is said by its own count: ${said}`);
        assert.ok(!/\bba lakri mixed/.test(said), `seed ${seed}: no 'ba' the card does not write: ${said}`);
        assert.match(said, /Ne hakri lakri mixed\. Pela /, `seed ${seed}: the second list is led by its count`);
      } else {
        same++;
        assert.equal(Cook.Lang.plain(r.line), "ba lakri mixed");
        assert.match(said, /ba lakri mixed/);
      }
    }
  }
  assert.ok(distinct >= 2 && same >= 2, `both shapes seen (${distinct} different, ${same} the same)`);
});
