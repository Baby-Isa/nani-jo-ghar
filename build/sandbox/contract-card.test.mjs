// S08 wave 1B (the card and what is said): contracts 27 to 31 (and 32, 33 below), each red on a timeline of what the build before
// this wave did and green on what it does now. The timelines are small ones built from the probe's own event shapes
// (build/sandbox/lib/contract-hook.mjs, lib/sound.mjs). node --test build/sandbox/contract-card.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, CHECKS } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const clip = () => 0.6;
const LEX = new Set(["muke", "bhar", "chai", "khape", "dudh", "khun", "trae", "ba", "ek"]);
const NUMS = new Set(["ek", "ba", "trae"]);
const run = (r) => analyse(r, { root: ROOT, retired: [], clip, lexicon: LEX, numbers: NUMS });
const of = (out, c) => out.filter((b) => b.check === c);
const clone = (x) => JSON.parse(JSON.stringify(x));
const page = (flow, timeline, size = "1366x768") => ({ flow, size, t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const stage = (t, key) => C(t, "stage", { key });
const line = (id, t, text, o = {}) => ({ type: "line", id, who: "cook", text, t, ...o });
const lineEnd = (id, t) => ({ type: "line-end", id, t });
const side = (t, o = {}) => C(t, "side", { n: 3, rows: 12, done: 0, closed: 3, peek: 0, dots: 0, words: [], ...o });
const card = (t, words) => C(t, "card", { words });
const T = 1e6;
const ST = "cook:station1:chai-tray";
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);

test("the checks: every check has an item, a title and how it measures", () => {
  for (const [k, c] of Object.entries(CHECKS)) assert.ok(/^contract-\d+$/.test(k) && c.item && c.title && c.how.length > 40, k);
  for (const k of ["contract-27", "contract-28", "contract-29", "contract-30", "contract-31"]) assert.ok(CHECKS[k], k);
});

test("contract-27: a peek with a dotted word is a break; a peek with every word, or a card not peeking, passes", () => {
  const dotted = sorted([stage(T, ST), side(T + 500), side(T + 1000, { peek: 1, dots: 2, words: ["•••", "dudh", "•••"] }), side(T + 8000)]);
  const b = of(run(page("cook:chai-tray@L3#hint", dotted)), "contract-27");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /shows 2 dotted words/);
  const whole = clone(dotted);
  whole[2].dots = 0;
  whole[2].words = ["aadu", "dudh", "trae khun"];
  assert.equal(of(run(page("cook:chai-tray@L3#hint", whole)), "contract-27").length, 0);
  // dots on a card that is not peeking (an open card, wave 2A's dotted L3) are not this check's
  const open = clone(dotted);
  open[2].peek = 0;
  assert.equal(of(run(page("cook:chai-tray@L3#hint", open)), "contract-27").length, 0);
});

test("contract-28: a bulb drawn as the flat inline drawing is a break; every bulb on the one photo passes", () => {
  const flat = sorted([stage(T, ST), C(T + 200, "bulbs", { list: [{ sel: "span.oc-look.bulb", kind: "svg", file: "" }, { sel: "button#btn-bulb.ng-bulb", kind: "img", file: "icon-bulb.webp" }] })]);
  const b = of(run(page("cook:chai-tray@L3", flat)), "contract-28");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /span\.oc-look\.bulb is drawn as the flat inline drawing/);
  const photo = clone(flat);
  photo[1].list[0] = { sel: "span.oc-look.bulb", kind: "img", file: "icon-bulb.webp" };
  assert.equal(of(run(page("cook:chai-tray@L3", photo)), "contract-28").length, 0);
  const other = clone(flat);
  other[1].list[0] = { sel: "span.oc-look.bulb", kind: "img", file: "bulb-2.webp" };
  assert.match(of(run(page("cook:chai-tray@L3", other)), "contract-28")[0].measured, /with bulb-2\.webp/);
});

test("contract-29: a peek shorter than the level's time (7 s, as a child's time) is a break; the whole time, or one ended by the card going, passes", () => {
  // Cook's test speed is 3: 7000 / 3 = 2333 ms
  const short = sorted([stage(T, ST), side(T + 500), side(T + 1000, { peek: 1 }), side(T + 2167)]); // 1167 ms: the old 3500 / 3
  const b = of(run(page("cook:chai-tray@L3#hint", short)), "contract-29");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /lasted 1167 ms; level 3 gives 2333 ms/);
  const full = clone(short);
  full[3].t = T + 3340;
  assert.equal(of(run(page("cook:chai-tray@L3#hint", full)), "contract-29").length, 0);
  // at a child's pace (speed 1) it is 7000
  assert.equal(of(run(page("cook:chai-tray@L3#hint#speed1", full)), "contract-29").length, 1);
  // the clinic's peek is real time whatever the test speed
  assert.equal(of(run(page("clinic:heal-ear@L3#hint", short)), "contract-29").length, 1);
  // the light bulb pressed during the peek ends it on purpose (the clinic's bulb opens the card in English)
  const bulb = clone(short);
  bulb.push(C(T + 2100, "input", { x: 160, y: 30, on: "img", btn: "button.ng-bulb", popup: false, side: true, play: false, exp: {} }));
  assert.equal(of(run(page("cook:chai-tray@L3#hint", sorted(bulb))), "contract-29").length, 0);
  // the card went away (the stage ended, a new order): not a short peek
  const gone = clone(short);
  gone[3].n = 2;
  assert.equal(of(run(page("cook:chai-tray@L3#hint", gone)), "contract-29").length, 0);
});

test("contract-30: a number or an English placeholder said that no card of the stage writes is a break; one written passes, at any level", () => {
  // the old build at level 3: "Muke aadu waari chai khape, with dudh, trae khun." said, the card dropped the number
  const dropped = sorted([stage(T, ST), card(T + 400, ["Muke chai khape", "dudh", "khun"]), line(1, T + 1000, "Muke chai khape, with dudh, trae khun."), lineEnd(1, T + 4000)]);
  const b = of(run(page("cook:chai-tray@L3", dropped)), "contract-30");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /says trae, which no card written in this stage holds/);
  const written = clone(dropped);
  written[1].words = ["Muke chai khape", "dudh", "trae khun"];
  assert.equal(of(run(page("cook:chai-tray@L3", written)), "contract-30").length, 0);
  // counting along (a line that is only a number) and an item word on a tap are not orders
  const along = clone(dropped);
  along.push(line(2, T + 6000, "Ba!"), line(3, T + 6500, "Chai", { role: "item" }), line(4, T + 6800, "Trae.", { role: "laps" }));
  assert.equal(of(run(page("cook:chai-tray@L3", sorted(along))), "contract-30").length, 1, "only the first break");
  // the clinic: a colour with no Kutchi yet is its English in brackets, written on the card at every level
  const boing = sorted([stage(T, "host:clinic/heal-boing"), card(T + 300, ["Drops", "ba"]), line(1, T + 900, "Cl-drops, ba [red].", { who: "doctor" })]);
  const c = of(run(page("clinic:heal-boing@L2", boing)), "contract-30");
  assert.equal(c.length, 1);
  assert.match(c[0].measured, /says \[red\]/);
  boing[1].words = ["Drops", "ba", "red"];
  assert.equal(of(run(page("clinic:heal-boing@L2", boing)), "contract-30").length, 0);
  // a stage with no card on screen at all (nothing written to compare) is not judged
  assert.equal(of(run(page("cook:chai-tray@L3", sorted([stage(T, ST), line(1, T + 1000, "Muke chai khape, with dudh, trae khun.")]))), "contract-30").length, 0);
});

test("contract-31: a replay counted as a hint is a break; a replay that says a ticked step again is a break; a replay of what is left passes", () => {
  const hint = sorted([stage(T, ST), C(T + 900, "hint", { kind: "replay", ids: ["dudh"] }), C(T + 1500, "hint", { kind: "hint", ids: [] })]);
  const b = of(run(page("cook:chai-tray@L3#hint", hint)), "contract-31");
  assert.equal(b.length, 1, "the peek's own hint (kind hint) is the bulb's cost, not a replay");
  assert.match(b[0].measured, /a replay was counted as a hint \(replay: dudh\)/);
  // the clinic's ear L3: two steps ticked, then the face: the replay may say only the rest
  const rows = (done) => C(T + 500, "rows", { list: [{ id: "wax0", key: "wax0", text: "Wax", done: done[0] }, { id: "wax1", key: "wax1", text: "Ba drops", done: done[1] }, { id: "wax2", key: "wax2", text: "Cotton", done: false }] });
  const face = C(T + 2000, "input", { x: 60, y: 60, on: "button.oc-face.face-say", next: false, btn: "button", popup: false, side: true, play: false, exp: {} });
  const all = sorted([stage(T, "host:clinic/heal-ear"), rows([true, true]), face, line(1, T + 2100, "Wax", { who: "doctor" }), line(2, T + 3000, "Ba drops", { who: "doctor" }), line(3, T + 4000, "Cotton", { who: "doctor" })]);
  const c = of(run(page("clinic:heal-ear@L3", all)), "contract-31");
  assert.equal(c.length, 2);
  assert.match(c[0].measured, /a replay said "Wax", a step already ticked/);
  const left = clone(all).filter((e) => !(e.type === "line" && e.id < 3));
  assert.equal(of(run(page("clinic:heal-ear@L3", left)), "contract-31").length, 0);
  // nothing ticked yet: a replay says it all
  const none = sorted([stage(T, "host:clinic/heal-ear"), rows([false, false]), face, line(1, T + 2100, "Wax", { who: "doctor" }), line(2, T + 3000, "Ba drops", { who: "doctor" })]);
  assert.equal(of(run(page("clinic:heal-ear@L3", none)), "contract-31").length, 0);
});

test("contract-22: 'Shabash!' said twice at the serve (the station's praise, then the serve's) is a break; said once passes (wave 1B)", () => {
  const tl = sorted([stage(T, ST), line(1, T + 1000, "Shabash!"), lineEnd(1, T + 1500), stage(T + 1800, "cook:between1:marble"), line(2, T + 2300, "Aadu waari chai."), lineEnd(2, T + 2900), line(3, T + 3300, "Shabash!"), lineEnd(3, T + 3800)]);
  const b = of(run(page("cook:chai-tray@L3", tl)), "contract-22");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /cook:between1:marble: "Shabash!" said twice/);
  const once = tl.filter((e) => !(e.type === "line" && e.id === 1) && !(e.type === "line-end" && e.id === 1));
  assert.equal(of(run(page("cook:chai-tray@L3", once)), "contract-22").length, 0);
});

const review = (t, o) => C(t, "review", { bad: 0, ok: 4, badW: 300, okW: 300, l: 100, r: 700, ...o });

test("contract-32: the review's divider at the middle with no wrong word (the old equal halves) is a break; 4/5 with none wrong, growing with the wrong words, passes", () => {
  const halves = sorted([stage(T, "cook:station1:chai-tray"), review(T + 500, { bad: 0, ok: 4, badW: 300, okW: 300 })]);
  const b = of(run(page("cook:chai-tray", halves)), "contract-32");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /take 50% of the width with 0 wrong and 4 right \(wanted about 80%/);
  const fair = [stage(T, "cook:station1:chai-tray"), review(T + 500, { bad: 0, ok: 4, badW: 120, okW: 480 }), review(T + 900, { bad: 1, ok: 4, badW: 120, okW: 480 }), review(T + 1300, { bad: 3, ok: 3, badW: 258, okW: 342 })];
  assert.equal(of(run(page("cook:chai-tray", sorted(fair))), "contract-32").length, 0, "0 and 1 wrong: 80%; 3 wrong: 4/7 = 57%");
  // one wrong word still at the old middle, and three wrong squeezed into a fifth, are breaks
  assert.equal(of(run(page("cook:chai-tray", sorted([stage(T, "x"), review(T + 500, { bad: 1, ok: 4, badW: 300, okW: 300 })]))), "contract-32").length, 1);
  assert.equal(of(run(page("cook:chai-tray", sorted([stage(T, "x"), review(T + 500, { bad: 3, ok: 3, badW: 120, okW: 480 })]))), "contract-32").length, 1);
  // a taught round (one group) or stacked halves report nothing
  assert.equal(of(run(page("cook:chai-tray", sorted([stage(T, "x"), C(T + 500, "review", { none: true })]))), "contract-32").length, 0);
});

test("contract-33: the order pop-up's headlines in two sizes, or shrunk to one line, are breaks; one size, wrapped at full size, passes", () => {
  const H = (t, list) => C(t, "heads", { list });
  const two = sorted([stage(T, "cook:station1:chai-tray"), H(T + 500, [{ size: 33, full: 40, lines: 1, text: "Muke aadu waari chai khape." }, { size: 40, full: 40, lines: 2, text: "Muke elchi waari chai khape." }]), H(T + 2500, [])]);
  const b = of(run(page("cook:chai-tray@L3", two)), "contract-33");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /2 sizes at once/);
  const wrapped = clone(two);
  wrapped[1].list = [{ size: 40, full: 40, lines: 2, text: "Muke aadu waari chai khape." }, { size: 40, full: 40, lines: 2, text: "Muke elchi waari chai khape." }];
  assert.equal(of(run(page("cook:chai-tray@L3", wrapped)), "contract-33").length, 0);
  // all on one line yet under the full size: they shrank where wrapping would do
  const shrunk = clone(two);
  shrunk[1].list = [{ size: 33, full: 40, lines: 1, text: "a" }, { size: 33, full: 40, lines: 1, text: "b" }];
  assert.match(of(run(page("cook:chai-tray@L3", shrunk)), "contract-33")[0].measured, /shrank to 33px \(full 40px\) to stay on one line/);
  // a common smaller size with a headline that needs two lines (two lines didn't fit at full) passes
  const fits = clone(two);
  fits[1].list = [{ size: 33, full: 40, lines: 2, text: "a" }, { size: 33, full: 40, lines: 1, text: "b" }];
  assert.equal(of(run(page("cook:chai-tray@L3", fits)), "contract-33").length, 0);
  // the card still flying in (the next sample within 400 ms): its easing sizes are not judged
  const flying = clone(two);
  flying[2].t = T + 700;
  assert.equal(of(run(page("cook:chai-tray@L3", sorted(flying))), "contract-33").length, 0);
});

test("contract-30: the order read out under the pop-up, before the station's stage starts, is judged against the first stage's card (what the 19 Oct chai L3 run did)", () => {
  // recorded shape: lines at 1.3 to 3.3 s, the stage at 4 s, the sidebar card drawn at 4 s with the numbers dropped
  const tl = sorted([line(1, T + 1280, "Muke chai khape,"), line(2, T + 2270, "with trae khun."), line(3, T + 3070, "ba khun."), stage(T + 4000, ST), card(T + 3980, ["Muke chai khape.", "dudh na", "khun", "dudh"])]);
  const b = of(run(page("cook:chai@L3", tl)), "contract-30");
  assert.equal(b.length, 2);
  assert.match(b[0].measured, /"with trae khun\." says trae/);
  assert.match(b[1].measured, /"ba khun\." says ba/);
  const written = clone(tl);
  written.find((e) => e.k === "card").words = ["Muke chai khape.", "dudh na", "trae khun", "ba khun", "dudh"];
  assert.equal(of(run(page("cook:chai@L3", written)), "contract-30").length, 0);
});
