// s04-f2: the contract checks' false positives mended (contract-2 take-back and capped counts, contract-3 the lifecycle's own
// stage end, contract-4 the measured head anchor) and the measurable halves of the other "every game" regression rows
// (contract-7 to contract-14), each on a fixture: a recorded timeline (build/sandbox/fixtures/contract/) or a small one built
// here from the probe's own event shapes. node --test build/sandbox/contract-rows.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, decided, CHECKS } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const fx = (n) => JSON.parse(readFileSync(join(ROOT, "build", "sandbox", "fixtures", "contract", `${n}.json`), "utf8"));
const clip = () => 0.6;
const run = (r) => analyse(r, { root: ROOT, retired: [], clip });
const of = (out, c) => out.filter((b) => b.check === c);
const clone = (x) => JSON.parse(JSON.stringify(x));
const page = (flow, timeline, size = "1366x768") => ({ flow, size, t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const stage = (t, key) => C(t, "stage", { key });
const T = 1e6;

test("the checks: fourteen, each with an item, a title and how it measures", () => {
  assert.equal(Object.keys(CHECKS).length, 14);
  for (const [k, c] of Object.entries(CHECKS)) assert.ok(/^contract-\d+$/.test(k) && c.item && c.title && c.how.length > 40, k);
});

test("contract-2: chaat's bowl Done with its pictures still taking taps (take it back until Done) is not a break; a capped count is", () => {
  const r = fx("chaat-l4");
  assert.equal(of(run(r), "contract-2").length, 1, "the recorded bowl ✓, judged on 'click #done-btn' alone");
  // what the game reported then: its pictures still take taps (more taps still change the bowl)
  const m = clone(r);
  for (const e of m.timeline.filter((e) => e.type === "c" && e.exp && e.exp.cook && e.exp.cook.selector === "#done-btn")) e.exp.live = 6;
  assert.equal(of(run(m), "contract-2").length, 0);
  // a take-back on offer (Cook's expectation has undo) keeps the step open too; nothing left to change is decided
  assert.equal(decided({ cook: { kind: "click", selector: "#done-btn", undo: true } }, "button#done-btn"), false);
  assert.equal(decided({ cook: { kind: "click", selector: "#done-btn" } }, "button#done-btn"), true);
  // the heal games: an uncapped count (the ear's drops: the child decides when it's enough) is open; a capped one (the knee's wrap) is decided
  assert.equal(decided({ heal: { do: "button", count: { item: "drops", n: 3, of: null, capped: false } } }, "button.hs-done"), false);
  assert.equal(decided({ heal: { do: "button", count: { item: "bandage", n: 4, of: 4, capped: true } } }, "button.hs-done"), true);
  const knee = page("clinic:heal-knee@L2", [stage(T, "host:clinic/heal-knee"), C(T + 900, "buttons", { list: [{ sel: "button.hs-done", text: "✓" }], exp: { heal: { do: "button", count: { item: "bandage", n: 4, of: 4, capped: true } } } })]);
  assert.match(of(run(knee), "contract-2")[0].measured, /hs-done.*"capped":true/);
  const ear = clone(knee);
  ear.timeline[1].exp.heal.count = { item: "drops", n: 3, of: null, capped: false };
  assert.equal(of(run(ear), "contract-2").length, 0);
});

test("contract-3: a line queued just after the lifecycle's stop belongs to the next stage (Lifecycle.log), not the one that ended", () => {
  const r = fx("chaat-l4");
  assert.ok(of(run(r), "contract-3").some((x) => /"Chana\." .*past the end of cook:station2:marble/.test(x.measured)), "sampled: Chana. counted against the station");
  // the shared lifecycle logged the station's end 8 ms before Chana. was queued (the sampler saw the change 44 ms after it)
  const m = clone(r);
  const chana = m.timeline.find((e) => e.type === "line" && e.text === "Chana.");
  m.timeline.push(C(chana.t + 3000, "life", { what: "stage-end", reason: "station", at: chana.t - 8 }));
  const left = of(run(m), "contract-3");
  assert.ok(!left.some((x) => /"Chana\."/.test(x.measured)), JSON.stringify(left.map((x) => x.measured)));
  assert.ok(left.some((x) => /"Bas!"/.test(x.measured)), "a clip that really kept playing still breaks");
});

test("contract-4: the heal thank-you bubble judged against her measured head anchor, not the art box's top", () => {
  const bub = { who: "patient", text: "thank you", box: { l: 560, t: 120, r: 760, b: 190 }, tail: { x: 660, y: 196 } };
  const artTop = { who: "patient", src: "fig-art", box: { l: 600, t: 74, r: 720, b: 240 } }; // the art box's top fifth (S04-B flaw 1)
  const anchor = { who: "patient", src: "fig-head-anchor", box: { l: 610, t: 200, r: 710, b: 300 } }; // her drawn head
  const mk = (heads) => page("clinic:heal-knee", [stage(T, "host:clinic/heal-knee"), C(T + 100, "bubble", { list: [bub], heads, play: { l: 0, t: 0, r: 1366, b: 768 }, vw: 1366, vh: 768 })]);
  assert.equal(of(run(mk([artTop])), "contract-4").length, 1, "judged on the art box's top: not above it");
  assert.equal(of(run(mk([anchor])), "contract-4").length, 0, "above her drawn head");
});

test("contract-7 one-voice: two lines sounding together (PAN-04); one after the other passes", () => {
  const tl = [stage(T, "cook:station1:pantry"),
    { type: "line", id: 1, who: "cook", text: "Muke elchi de.", t: T + 100 }, { type: "play", pid: 1, url: "a.mp3", dur: 1.2, t: T + 110 },
    { type: "line", id: 2, who: "cook", text: "Ek.", t: T + 600 }, { type: "play", pid: 2, url: "b.mp3", dur: 0.4, t: T + 610 },
    { type: "play-end", pid: 2, why: "ended", t: T + 1010 }, { type: "play-end", pid: 1, why: "ended", t: T + 1310 }];
  const b = of(run(page("cook:fetch", tl)), "contract-7");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /"Ek\." .*while "Muke elchi de\." .*400 ms together/);
  const m = clone(tl);
  m.find((e) => e.type === "play-end" && e.pid === 1).t = T + 640; // the order line stopped for the count word
  assert.equal(of(run(page("cook:fetch", m.sort((a, z) => a.t - z.t))), "contract-7").length, 0);
});

test("contract-8 highlight: two highlights at once for a while (SH-53); a swap caught within a sample passes", () => {
  const tl = [stage(T, "cook:station1:pantry"), C(T + 100, "hl", { n: 1, list: ["cook:elchi"] }), C(T + 500, "hl", { n: 2, list: ["cook:elchi", "cook:tea"] }), C(T + 1500, "hl", { n: 0, list: [] })];
  assert.match(of(run(page("cook:fetch", tl)), "contract-8")[0].measured, /2 highlights at once for 1000 ms/);
  const quick = clone(tl);
  quick[3].t = T + 600;
  assert.equal(of(run(page("cook:fetch", quick)), "contract-8").length, 0);
});

test("contract-9 closed-card: an open card at the first play tap from L3 (CLN-114); closed, or below L3, passes", () => {
  const tl = [stage(T, "host:clinic/pharmacy"), C(T + 50, "side", { n: 1, rows: 3, done: 0, closed: 0 }), C(T + 800, "input", { x: 300, y: 300, exp: { clinic: { kind: "tap" } } })];
  assert.match(of(run(page("clinic:pharmacy@L3", tl)), "contract-9")[0].measured, /1 of 1 sidebar cards open/);
  assert.equal(of(run(page("clinic:pharmacy@L2", tl)), "contract-9").length, 0);
  const ok = clone(tl);
  ok[1].closed = 1;
  assert.equal(of(run(page("clinic:pharmacy@L3", ok)), "contract-9").length, 0);
  // the diagnosis is not one of them
  const dx = clone(tl);
  dx[0].key = "host:clinic/diagnosis";
  assert.equal(of(run(page("clinic:diagnosis@L3", dx)), "contract-9").length, 0);
});

test("contract-10 your-turn: a talker still turned to the other on the child's turn (SH-71); facing the player passes", () => {
  const tl = [stage(T, "host:clinic/diagnosis"), C(T + 900, "input", { x: 500, y: 300, exp: { clinic: { kind: "tap" } }, poses: [{ who: "div.cl-doc.cl-staged", pose: "talk", facing: "left" }, { who: "div.cl-fig.cl-staged", pose: "front" }] })];
  assert.match(of(run(page("clinic:diagnosis", tl)), "contract-10")[0].measured, /cl-doc.* still "talk" facing left/);
  const ok = clone(tl);
  ok[1].poses[0].pose = "front";
  assert.equal(of(run(page("clinic:diagnosis", ok)), "contract-10").length, 0);
  const talking = clone(tl);
  talking[1].exp.clinic.kind = "wait"; // a tap while they talk: not the child's turn
  assert.equal(of(run(page("clinic:diagnosis", talking)), "contract-10").length, 0);
});

test("contract-11 background: the pantry stretched (PAN-14) and a low-res background (ART-05); in proportion and sharp passes", () => {
  const tl = [stage(T, "cook:station1:pantry"), C(T + 100, "bg", { src: "assets/cook/bg/pantry.webp", via: "phaser", sx: 0.75, sy: 0.88, dpr: 1, stage: "cook:station1:pantry" }), C(T + 200, "bg", { src: "assets/bg/kitchen.webp", via: "css", sx: 1.8, sy: 1.8, dpr: 1, stage: "cook:station1:pantry" })];
  const b = of(run(page("cook:fetch", tl, "1440x900")), "contract-11");
  assert.equal(b.length, 2);
  assert.match(b[0].measured, /pantry\.webp .*stretched: 0\.75 across, 0\.88 down/);
  assert.match(b[1].measured, /kitchen\.webp .*low-res: 1\.80/);
  const ok = clone(tl);
  ok[1].sy = 0.75;
  ok[2].sx = ok[2].sy = 1.1;
  assert.equal(of(run(page("cook:fetch", ok)), "contract-11").length, 0);
});

test("contract-12 greyed: a Done shown greyed before it is usable (SH-23); a blink, or greyed just after a press, passes", () => {
  const tl = [stage(T, "cook:station1:chai"), C(T + 100, "greyed", { list: [{ sel: "button#done-btn", text: "✓", why: "disabled" }] }), C(T + 2100, "greyed", { list: [] })];
  assert.match(of(run(page("cook:chai-tray", tl)), "contract-12")[0].measured, /#done-btn "✓" shown disabled for 2000 ms/);
  const pressed = clone(tl);
  pressed.splice(1, 0, C(T + 90, "input", { x: 1, y: 1, next: true, btn: "button#done-btn" }));
  assert.equal(of(run(page("cook:chai-tray", pressed)), "contract-12").length, 0);
  const blink = clone(tl);
  blink[2].t = T + 300; // a fade-in caught half-way
  assert.equal(of(run(page("cook:chai-tray", blink)), "contract-12").length, 0);
});

test("contract-13 stale-ui: a reply pill from the waiting room still up in the diagnosis (CLN-06); under the end screen passes", () => {
  const tl = [stage(T, "host:clinic/waiting"), stage(T + 3000, "host:clinic/diagnosis"), C(T + 3700, "stale", { sel: "button.cl-pill", text: "Salaam", from: "host:clinic/waiting", stage: "host:clinic/diagnosis" })];
  assert.match(of(run(page("clinic:morning", tl)), "contract-13")[0].measured, /cl-pill "Salaam" from host:clinic\/waiting still on screen/);
  const results = clone(tl);
  results[2].stage = "host:results";
  assert.equal(of(run(page("clinic:morning", results)), "contract-13").length, 0);
});

test("contract-14 talk: the old 6 px bob and a stage's own CSS talk animation (ART-18); the shared one passes", () => {
  const spec = { lift: 2, tilt: 0.4, ms: 380 };
  const tl = [stage(T, "cook:between1:service"), C(T + 100, "talk", { spec, list: [{ via: "phaser", who: "nani", dy: 6, da: 1.2, ms: 220 }, { via: "css", who: "img.cl-wp-img", name: "cl-nod-talk", ms: 450 }] })];
  const b = of(run(page("cook:day1", tl)), "contract-14");
  assert.equal(b.length, 2);
  assert.match(b[0].measured, /nani talking \(phaser\) lifts 6 px .*tilts 1\.2° .*every 220 ms/);
  assert.match(b[1].measured, /own talk animation "cl-nod-talk"/);
  const ok = clone(tl);
  ok[1].list = [{ via: "phaser", who: "nani", dy: 2, da: 0.4, ms: 380 }, { via: "css", who: "img.cl-wp-img", name: "njg-talk", ms: 380 }];
  assert.equal(of(run(page("cook:day1", ok)), "contract-14").length, 0);
});
