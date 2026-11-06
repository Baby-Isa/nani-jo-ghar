// contract-91 help-comes (Zafar, 6 Nov: "remove the bulbs from everywhere and retire them ... they will be replaced by chai's method.
// build the help comes now so it's tested in chai and used in post chai rollout"): a child stuck on their turn past the level's hint
// wait (data/rules.json levels.hintS) and 4 s more, with nothing said, has had the guide's hint. Small timelines in the probe's own
// event shapes (build/sandbox/lib/contract-hook.mjs). node --test build/sandbox/contract-help.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, CHECKS, LADDER, HINT_SLACK, helpStage } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const run = (r) => analyse(r, { root: ROOT, retired: [], clip: () => 0.6, lexicon: new Set(["chai"]), numbers: new Set(["ek"]) });
const of = (out) => out.filter((b) => b.check === "contract-91");
const page = (flow, timeline) => ({ flow, size: "1280x665", t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const life = (t, what, step = "", o = {}) => C(t, "life", { what, reason: step, at: t, ...o });
const want = (t, kind, o = {}) => C(t, "want", { by: "cook", kind, intro: false, ...o });
const tap = (t) => C(t, "input", { x: 400, y: 300, on: "canvas", next: false, btn: null, popup: false, side: false, play: true, exp: { cook: { kind: "tap" } } });
const line = (id, t, text) => ({ type: "line", id, who: "cook", text, t });
const lineEnd = (id, t) => ({ type: "line-end", id, t });
const T = 1e6;
const ST = "cook:station1:marble";
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);
// a chai station at L1: a step opens at 1 s, the game waits for a tap, the child does nothing for `idle` ms, then taps
const stuck = (idle, extra = []) => sorted([C(T, "stage", { key: ST }), life(T, "stage-start", "cook:station"), want(T + 500, "tap"), life(T + 1000, "step-open", "1"), ...extra, tap(T + 1000 + idle), want(T + 1100 + idle, "wait"), C(T + 1500 + idle, "stage", { key: "end" })]);
const L1 = LADDER[0];

test("contract-91: the check is listed, reads the central rules' hint waits, and judges Cook stations and the clinic's stages", () => {
  assert.equal(CHECKS["contract-91"].item, "help-comes");
  assert.deepEqual(LADDER, [7000, 9000, 11000, 13000], "data/rules.json levels.hintS, in ms");
  assert.equal(HINT_SLACK, 4000);
  assert.ok(helpStage("cook:station1:marble") && helpStage("host:cook/chai-tray|cook:station1:marble") && helpStage("host:clinic/heal-knee"));
  assert.ok(!helpStage("cook:between1:marble") && !helpStage("end") && !helpStage("host:day/window"));
});

test("contract-91: stuck past the hint wait with no hint is a break; the same stretch with the guide's hint (help, helper card, rung) passes", () => {
  const b = of(run(page("cook:chai-tray", stuck(L1 + HINT_SLACK + 3000))));
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /s stuck on the child's turn \(tap\) since the last action with nothing said and no hint \(L1 waits 7000 ms/);
  for (const hint of [life(T + 1000 + L1, "help", "idle"), life(T + 1000 + L1, "helper-open", "cook-dudh", { by: "hint" }), life(T + 1000 + L1, "rung", "chai-tray:s14-control", { rung: 1 })])
    assert.equal(of(run(page("cook:chai-tray", stuck(L1 + HINT_SLACK + 3000, [hint])))).length, 0, `${hint.what} is the hint`);
  // a hint that came before the last action is not this stretch's
  const before = stuck(L1 + HINT_SLACK + 3000, [life(T + 800, "help", "idle"), tap(T + 900)]);
  assert.equal(of(run(page("cook:chai-tray", sorted(before)))).length, 1);
});

test("contract-91: a stretch shorter than the wait plus the slack, an action in it, or the level's longer wait passes", () => {
  assert.equal(of(run(page("cook:chai-tray", stuck(L1 + HINT_SLACK - 600)))).length, 0, "not stuck long enough");
  // a tap half-way (or the end of a pour: Lifecycle poke) starts the clock again
  assert.equal(of(run(page("cook:chai-tray", stuck(L1 + HINT_SLACK + 3000, [tap(T + 7000)])))).length, 0);
  assert.equal(of(run(page("cook:chai-tray", stuck(L1 + HINT_SLACK + 3000, [life(T + 7000, "poke")])))).length, 0);
  // L4 waits 13 s: 14 s stuck is no break there
  assert.equal(of(run(page("cook:chai-tray@L4", stuck(14000)))).length, 0);
  assert.equal(of(run(page("cook:chai-tray@L4", stuck(18500)))).length, 1);
});

test("contract-91: a talking stretch is skipped; so is the game's own time (wait, a timing window, the pop-up), #mistake and an older run", () => {
  // Nani talks for 6 s of the 14 s: 8 s stuck and quiet, under the 11 s
  const talking = stuck(14000, [line(1, T + 2000, "Muke chai khape"), lineEnd(1, T + 8000)]);
  assert.equal(of(run(page("cook:chai-tray", sorted(talking)))).length, 0);
  // the game busy (want wait) for most of it: not the child's turn
  const busy = stuck(14000, [want(T + 1500, "wait"), want(T + 11000, "tap")]);
  assert.equal(of(run(page("cook:chai-tray", sorted(busy)))).length, 0);
  // a timing window (the tea to take off at the right moment) is waiting on purpose, the pop-up is the game's
  assert.equal(of(run(page("cook:chai-tray", sorted(stuck(14000, [want(T + 900, "timing")]))))).length, 0);
  assert.equal(of(run(page("cook:chai-tray", sorted(stuck(14000, [want(T + 900, "click", { intro: true })]))))).length, 0);
  assert.equal(of(run(page("cook:chai-tray#mistake", stuck(14000)))).length, 0);
  // a run before the want sample: nothing to judge
  assert.equal(of(run(page("cook:chai-tray", stuck(14000).filter((e) => e.k !== "want")))).length, 0);
  // between stations and on the end screen: never judged
  const between = sorted([C(T, "stage", { key: "cook:between1:marble" }), want(T + 500, "tap"), C(T + 20000, "stage", { key: "end" })]);
  assert.equal(of(run(page("cook:chai-tray", between))).length, 0);
});

test("contract-91: the clinic's stage is judged the same (the doctor's hint)", () => {
  const tl = sorted([C(T, "stage", { key: "host:clinic/heal-knee" }), want(T + 500, "tap", { by: "clinic" }), tap(T + 600), tap(T + 600 + L1 + HINT_SLACK + 2000), C(T + 20000, "stage", { key: "end" })]);
  assert.equal(of(run(page("clinic:heal-knee", tl))).length, 1);
  const helped = sorted(tl.concat([life(T + 600 + L1, "help", "idle", { by: "L1 heal-knee glow" })]));
  assert.equal(of(run(page("clinic:heal-knee", helped))).length, 0);
});
