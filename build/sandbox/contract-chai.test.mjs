// Chai's method for every game, with no opt-ins (s08 wave 4B; Sprint 17, s17-chk1; s19-checks-2, the check sort's G5): contracts 70
// (the turn-off call at the green), 71 (once each), 77 (the first-time hold), 90 (the next item lit) and 96 (the rows open after a
// boil-over) judge every game from the kitchen kit's heat ring as drawn (s19ring), Cook's tick path (s19tick) and the sound log, and
// data/games.json holds no check field. Each red on the shape of a real fault, green on chai's.
// node --test build/sandbox/contract-chai.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyse, CHECKS, helpStage } from "./lib/contract.mjs";
import { GAMES, fieldsLeft, CHAI_ROW, flowParts } from "./lib/contract-chai.mjs";

const T = 1000;
const ST = { type: "c", k: "stage", key: "cook:station1:marble", t: T };
const run = (flow, tl, lines = []) => analyse({ flow, size: "1366x768", t0: T, states: [], timeline: [ST, ...lines, ...tl].sort((a, b) => a.t - b.t) }, { lexicon: new Set(), numbers: new Set(), clip: () => 0.6 });
const of = (out, c) => out.filter((b) => b.check === c);
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
// the kit's heat ring as drawn: level from 0 at t0, rising `rate` a second, held at `cap` if given, cleared at `clear`
const ring = (t0, { id = 1, lo = 0.6, hi = 0.9, rate = 0.25, cap = null, until = t0 + 6000, clear = null } = {}) => {
  const out = [];
  for (let t = t0; t <= until; t += 100) { let lv = Math.min(1.05, ((t - t0) / 1000) * rate); if (cap != null) lv = Math.min(lv, cap); out.push(c(t, "s19ring", { id, lv: Math.round(lv * 1000) / 1000, lo, hi })); }
  if (clear) out.push(c(clear, "s19ring", { id, clear: 1 }));
  return out;
};
// a call line, as the sound hook logs it (Cook's Lang.speak: a line of the cook's voice; its clips follow)
const call = (t, text, n) => [{ type: "line", t, id: n, who: "cook", text, role: "call", page: "cook.html" }, { type: "play", via: "audio", url: "assets/audio/x.mp3", pid: n, dur: 0.6, t: t + 5, page: "cook.html" }];
const tap = (t) => c(t, "input", { x: 400, y: 300, on: "canvas", play: true });

test("the checks are registered, and data/games.json holds no check field (no opt-ins)", () => {
  for (const k of ["contract-70", "contract-71", "contract-77", "contract-90", "contract-96"]) assert.ok(CHECKS[k] && CHECKS[k].how.length > 40, k);
  assert.deepEqual(fieldsLeft(), [], "a games.json entry with a check field");
  for (const g of ["chai", "chop", "daar", "chaat", "samosa", "maani", "sekelo", "eggs", "baking", "corn", "pantry"]) assert.ok((GAMES.games[g] || {}).stations.length, g);
  // contract-35's design exception (chai's card written at L3-L4) and contract-91's stages stay
  assert.ok(CHAI_ROW.test("chai-tray") && !CHAI_ROW.test("eggs"));
  assert.ok(helpStage("cook:station1:marble") && helpStage("host:cook/chai-tray|cook:station1:marble") && helpStage("host:clinic/heal-knee"));
  assert.ok(!helpStage("cook:between1:marble") && !helpStage("host:day/window"));
  assert.deepEqual(flowParts("lab:cook/recipe-chai@L2"), { route: "lab-recipe", station: "chai" });
});

test("contract-70: every timed window: no call as the ring enters its green is a break (eggs, corn); the call at the green passes", () => {
  // the ring enters its green (0.6) at T+2400
  const r = ring(T, {});
  assert.match(of(run("cook:eggs", r), "contract-70")[0].measured, /no call was said/);
  assert.equal(of(run("cook:eggs", r, call(T + 2450, "Tarelo indo hane kadh.", 1)), "contract-70").length, 0, "green: the call at the green");
  assert.match(of(run("cook:corn", r, call(T + 800, "Makai pher!", 1)), "contract-70")[0].measured, /no call|called early/);
  // a game with no heat ring is not judged (a page with no ring: no s19ring)
  assert.equal(of(run("cook:chop", []), "contract-70").length, 0);
});

test("contract-77: a new player's first window holds in the green until the tap; a returning player's never holds", () => {
  const mid = 0.75;
  // eggs (no hold): the ring goes on past the middle before the tap
  assert.match(of(run("cook:eggs", ring(T, {})), "contract-77")[0].measured, /went on past the middle/);
  // chai's hold: the ring waits at the middle until the tap
  assert.equal(of(run("cook:chai-tray", [...ring(T, { cap: mid, clear: T + 5100 }), tap(T + 5000)]), "contract-77").length, 0, "green: held until the tap");
  assert.match(of(run("cook:chai-tray#returning", [...ring(T, { cap: mid, clear: T + 5100 }), tap(T + 5000)]), "contract-77")[0].measured, /returning player/);
});

test("contract-71: an add with no row wanting it, or a row counted past its need, is a second one; the station's batch at the serve is not", () => {
  const tick = (t, id, o) => c(t, "s19tick", { id, dish: 0, un: 0, ...o });
  assert.equal(of(run("cook:eggs", [tap(T + 1000), tick(T + 1100, "n.egg", { row: 1, got: 1, need: 1, done: 1 })]), "contract-71").length, 0);
  assert.match(of(run("cook:eggs", [tap(T + 1000), tick(T + 1100, "n.egg", { row: 1, got: 1, need: 1 }), tap(T + 3000), tick(T + 3100, "n.egg", { row: 0 })]), "contract-71")[0].measured, /no row on the card wanting it/);
  assert.match(of(run("cook:eggs", [tap(T + 1000), tick(T + 1100, "n.egg", { row: 1, got: 2, need: 1 })]), "contract-71")[0].measured, /counted 2 of 1/);
  // chai's serve re-ticks every item at once: the station's bookkeeping, not the child's add
  assert.equal(of(run("cook:chai-tray", [tap(T + 1000), ...["cook-paani", "cook-chai", "cook-dudh"].map((id) => tick(T + 1100, id, { row: 0 }))]), "contract-71").length, 0);
  // chai's own add note still reads: a second milk poured in
  const life = (t, what, step, by) => c(t, "life", { what, reason: step, step, by, at: t });
  assert.match(of(run("cook:chai-tray#mistake", [life(2000, "chai-add", "cook-dudh", "nana:1"), life(3000, "chai-add", "cook-dudh", "nana:2"), tick(T + 100, "x", { row: 1, got: 1, need: 1 })]), "contract-71")[0].measured, /second time/);
});

test("contract-90: chai's pointer: after the tea and a pause, the order card's next item lit; never lit is a break (no games.json field)", () => {
  const life = (t, what, step, by) => c(t, "life", { what, reason: step, step, by, at: t });
  const tl = [life(2000, "chai-add", "cook-chai", "nana:1"), tap(2000), tap(6000), life(6100, "chai-add", "cook-dudh", "nana:1")];
  assert.match(of(run("cook:chai-tray", tl), "contract-90")[0].measured, /never lit/);
  assert.equal(of(run("cook:chai-tray", [...tl, life(4000, "card-light", "cook-dudh", "")]), "contract-90").length, 0);
  assert.equal(of(run("cook:chai-tray#returning", tl), "contract-90").length, 0);
});

test("contract-96: after a boil-over (a ring past its green, emptied with no tap) the ticked cards open again and the row comes home", () => {
  const pad = (t, done) => c(t, "s19pad", { box: [0, 0, 300, 300], row: [10, 50, 290, 250], cards: [{ w: "paani", done, box: [10, 50, 120, 250], in: [17, 57, 113, 243] }, { w: "chai", done, box: [128, 50, 238, 250], in: [135, 57, 231, 243] }] });
  const boil = ring(T, { rate: 0.4, until: T + 2900, clear: T + 3000 });
  const red = run("cook:chai-tray#boil-over", [pad(T + 500, 1), ...boil]);
  assert.match(of(red, "contract-96")[0].measured, /stayed ticked/);
  assert.equal(of(run("cook:chai-tray#boil-over", [pad(T + 500, 1), ...boil, pad(T + 3400, 0), c(T + 3300, "s19row", { x: 0, w: 110, n: 2, vis: 1, px: 0, pt: T + 3280 })]), "contract-96").length, 0);
  // a ring cleared by the child's tap (a pan lifted off) is no boil-over
  assert.equal(of(run("cook:chai-tray", [pad(T + 500, 1), ...boil, tap(T + 2900)]), "contract-96").length, 0);
});
