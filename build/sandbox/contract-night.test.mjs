// s19-night-shared: contract-124 (CHAI-113, the knob's sounds), 125 (SH-274, one dish card), 126 (SH-278, no drop-down on an
// exclamation) and 127 (SH-272, the end card covers the heads), each red then green on a synthetic timeline; and the shared voice gate's
// rule for a child's own action's sound (js/shared/sfx.js {under: true}: plays under a voice, ducked). No browser.
// Run: node --test build/sandbox/contract-night.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { NIGHT_CHECKS, NIGHT_HOOK, checkNight } from "./lib/contract-night.mjs";
import { CHECKS } from "./lib/contract.mjs";

const run = (r, tl) => { const out = []; checkNight(r, tl, null, (id, t, msg) => out.push({ id, t, msg })); return out; };
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const play = (t, url) => ({ type: "play", via: "sfx", url, t });
const R = { flow: "cook:chai-tray" };

test("contract-124 to 127 are registered and the probe samples them", () => {
  for (const n of [124, 125, 126, 127]) {
    assert.ok(CHECKS[`contract-${n}`], `contract-${n} in CHECKS`);
    assert.ok(NIGHT_CHECKS[`contract-${n}`].how.length > 80);
  }
  assert.match(NIGHT_HOOK, /s19night/);
  assert.doesNotThrow(() => new Function(NIGHT_HOOK));
});

test("contract-124: a knob turned on with no click or flame is a break; both heard (under a voice) passes", () => {
  const wants = [c(1000, "want", { key: "knob-on-nana" }), c(1100, "want", { key: "knob-on-nana" }), c(2000, "want", { key: "knob-nana" }), c(9000, "want", { key: "end" })];
  const red = run(R, wants);
  assert.equal(red.length, 1);
  assert.equal(red[0].id, "contract-124");
  assert.match(red[0].msg, /sfx\/knob and sfx\/flame/);
  const half = run(R, [...wants, play(1900, "sfx/knob")].sort((a, b) => a.t - b.t));
  assert.match(half[0].msg, /sfx\/flame never/);
  assert.equal(run(R, [...wants, play(1900, "sfx/knob"), play(2080, "sfx/flame")].sort((a, b) => a.t - b.t)).length, 0);
  // (a flame long after the turn is not its answer)
  assert.equal(run(R, [...wants, play(1900, "sfx/knob"), play(4000, "sfx/flame")].sort((a, b) => a.t - b.t)).length, 1);
  // (not a Cook flow: not judged)
  assert.equal(run({ flow: "clinic:heal-cut" }, wants).length, 0);
});

const sample = (t, o = {}) => c(t, "s19night", { flash: 0, arrow: false, line: "", card: null, heads: [], ...o });

test("contract-125: two dish cards at once, held, is a break; one passes; a blink of two passes", () => {
  assert.equal(run(R, [sample(0, { flash: 1 }), sample(500, { flash: 2 }), sample(1200, { flash: 0 })])[0].id, "contract-125");
  assert.equal(run(R, [sample(0, { flash: 1 }), sample(1200, { flash: 0 })]).length, 0);
  assert.equal(run(R, [sample(0, { flash: 1 }), sample(500, { flash: 2 }), sample(600, { flash: 1 }), sample(1500, {})]).length, 0);
});

test("contract-126: the drop-down on 'Shabash!' or 'Bas!' is a break; on a step's line it passes", () => {
  assert.equal(run(R, [sample(0, { arrow: true, line: "Shabash!" }), sample(800, {})])[0].id, "contract-126");
  assert.equal(run(R, [sample(0, { arrow: true, line: "Bas!" }), sample(800, {})])[0].id, "contract-126");
  assert.equal(run(R, [sample(0, { arrow: false, line: "Shabash!" }), sample(800, {})]).length, 0);
  assert.equal(run(R, [sample(0, { arrow: true, line: "Paani tapele me wij." }), sample(800, {})]).length, 0);
});

test("contract-127: a head across the end card's top edge is a break; one wholly under it, above it or beside it passes", () => {
  const card = [300, 200, 900, 500];
  assert.equal(run(R, [sample(0, { card, heads: [[500, 150, 560, 230]] }), sample(800, {})])[0].id, "contract-127");
  assert.equal(run(R, [sample(0, { card, heads: [[500, 210, 560, 290]] }), sample(800, {})]).length, 0);
  assert.equal(run(R, [sample(0, { card, heads: [[500, 60, 560, 140]] }), sample(800, {})]).length, 0);
  assert.equal(run(R, [sample(0, { card, heads: [[950, 150, 1010, 230]] }), sample(800, {})]).length, 0);
});

test("CHAI-113: the voice gate lets a child's own action's sound ({under: true}) play under a voice, ducked; other sounds keep the gate", () => {
  const src = readFileSync(new URL("../../js/shared/sfx.js", import.meta.url), "utf8");
  // (the two gates, the synthesised one and the recorded files', name the same rule)
  assert.match(src, /Sfx\.UNDER = 0\.5/);
  assert.match(src, /const gate = \(name, opts\) => \(!Sfx\.speaking\(\) \? 1 : opts\.under \? Sfx\.UNDER/);
  assert.match(src, /const gateMs = \(ms, opts\) => \(!Sfx\.speaking\(\) \? 1 : opts\.under \? Sfx\.UNDER/);
  const kit = readFileSync(new URL("../../js/cook/kitchen-kit.js", import.meta.url), "utf8");
  assert.match(kit, /Cook\.sfx\.knob\(on \? \{ under: true \}/);
  assert.match(kit, /Cook\.sfx\.flame\(\{ delay: 180, under: true \}\)/);
});
