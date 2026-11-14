// s19-clean-a4: SH-268 (Zafar, 12 Nov: one light from the upper left, every worktop object's soft shadow down and to the right).
// node --test build/sandbox/s19-clean-a4.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { check120, shadeAudit, SHADE_CHECKS, SHADE_HOLD_MS } from "./lib/contract-shade.mjs";
import { CHECKS } from "./lib/contract.mjs";

const r = { flow: "cook:eggs", size: "1280x665" };
const sample = (t, objs) => ({ type: "c", k: "s19shade", t, objs });
const run = (tl) => { const out = []; check120(r, tl, (check, t, m) => out.push({ check, t, m })); return out; };
const pan = (sh) => ({ key: "eg-pan", x: 600, y: 400, w: 300, h: 300, d: 30, sh });
const egg = (sh) => ({ key: "eg-friedEgg", x: 600, y: 400, w: 90, h: 80, d: 30.5, sh, inside: true });

test("contract-120 is registered with the contract checks", () => {
  assert.ok(SHADE_CHECKS["contract-120"] && CHECKS["contract-120"]);
});

test("contract-120: a worktop object held with no shadow is a break (red), with its shadow lower right none (green)", () => {
  const end = { type: "c", k: "x", t: 10000 };
  assert.equal(run([sample(1000, [pan(null)]), end]).length, 1, "no shadow: red");
  assert.equal(run([sample(1000, [pan({ dx: 8, dy: 11 })]), end]).length, 0, "lower right: green");
  assert.equal(run([sample(1000, [pan({ dx: -8, dy: 11 })]), end]).length, 1, "lower left: red (one light, upper left)");
  assert.equal(run([sample(1000, [pan({ dx: 0, dy: 11 })]), end]).length, 1, "straight down: red");
});

test("contract-120: a thing inside a bigger one (food in a pan, CK-21's dish on the serving tray) and a thing passing through are not judged", () => {
  assert.equal(run([sample(1000, [pan({ dx: 8, dy: 11 }), egg(null)]), { type: "c", k: "x", t: 10000 }]).length, 0, "inside: not judged");
  // a thing seen only for a moment before it moved on (flying, carried)
  const tl = [sample(1000, [pan(null)]), sample(1000 + SHADE_HOLD_MS - 300, [{ ...pan(null), x: 900 }]), sample(1000 + 2 * SHADE_HOLD_MS - 600, [])];
  assert.equal(run(tl).length, 0, "moving: not judged");
});

test("contract-120: once per picture per page; the audit lists each object with or without", () => {
  const tl = [sample(1000, [pan(null), egg(null)]), sample(4000, [pan(null), egg({ dx: 2, dy: 3 })]), { type: "c", k: "x", t: 9000 }];
  assert.equal(run(tl).length, 1);
  const a = shadeAudit(tl);
  assert.deepEqual(a.map((x) => [x.key, x.sh, !!x.inside]).sort(), [["eg-friedEgg", true, true], ["eg-pan", false, false]]);
});

test("contract-120: not a Cook flow, not judged", () => {
  const out = [];
  check120({ flow: "clinic:waiting" }, [sample(1000, [pan(null)]), { type: "c", k: "x", t: 9000 }], (c) => out.push(c));
  assert.equal(out.length, 0);
});

// contract-121 (s19-clean-e's report, 12 Nov: sekelo L2-L4 stuck at the order pop-up's card lesson)
import { check121 } from "./lib/contract-shade.mjs";
const run121 = (tl) => { const out = []; check121({ flow: "cook:mishkaki-grill@L2" }, tl, (c, t, m) => out.push(m)); return out; };
const L = (t, box, hit = true) => ({ type: "c", k: "s19lesson", t, sel: ".wc14-lesson .wc14-pic", box, hit, top: hit ? "img" : "div.njg-rq-veil" });
const lit = (t, holes) => ({ type: "c", k: "s19lit", t, holes });
test("contract-121: a part squeezed to a strip, covered, or outside the hole is red; a roomy part in the hole is green", () => {
  const end = { type: "c", k: "x", t: 5000 };
  assert.equal(run121([lit(900, [[360, 10, 660, 200]]), L(1000, [370, 20, 650, 120]), end]).length, 0, "roomy, on top, in the hole: green");
  assert.equal(run121([lit(900, [[369, 19, 651, 31]]), L(1000, [375, 25, 645, 25]), end]).length, 1, "0 px tall: red");
  assert.equal(run121([lit(900, [[360, 10, 660, 200]]), L(1000, [370, 20, 650, 120], false), end]).length, 1, "under the veil: red");
  assert.equal(run121([lit(900, [[700, 10, 900, 200]]), L(1000, [370, 20, 650, 120]), end]).length, 1, "outside the hole: red");
  // (a play-area tap the light blocks while the lesson waits is the order's skip held back: not judged)
  const skip = [lit(900, [[360, 10, 660, 200]]), L(1000, [370, 20, 650, 120]), { type: "c", k: "input", t: 1100, x: 354, y: 8, on: "div.njg-rq-veil", exp: { cook: { selector: ".wc14-lesson .wc14-pic" } } }, { type: "c", k: "input-blocked", t: 1150 }, end];
  assert.equal(run121(skip).length, 0, "a skip tap held back: green");
  // (the frozen run, 14 Nov: the light moved on to the next part ~30 ms before the ask was sampled moving: a beat, not a blocked tap)
  const beat = [lit(900, [[360, 10, 660, 200]]), L(1000, [370, 20, 650, 120]), lit(1570, [[360, 150, 660, 200]]), L(1600, [370, 160, 650, 190]), end];
  assert.equal(run121(beat).length, 0, "the light a beat ahead of the ask: green");
  // (... but a light that leaves the part asked for and stays away for the hold is red, however it started)
  const away = [lit(900, [[360, 10, 660, 200]]), L(1000, [370, 20, 650, 120]), lit(1100, [[360, 150, 660, 200]]), L(1800, [370, 160, 650, 190]), end];
  assert.equal(run121(away).length, 1, "the light away from the part for 700 ms: red");
  // (... and a light that only arrives on the part later than the hold is red too)
  const late = [lit(900, [[700, 10, 900, 200]]), L(1000, [370, 20, 650, 120]), lit(1700, [[360, 10, 660, 200]]), end];
  assert.equal(run121(late).length, 1, "the light reaching the part 700 ms late: red");
});

// contract-122 (the coordinator, 12 Nov: sekelo's row-shaped pop-up card with its picture squeezed to 270x0 px)
import { check122 } from "./lib/contract-shade.mjs";
test("contract-122: a big card's picture squeezed to nothing is red; a real picture is green", () => {
  const run = (pic) => { const out = []; check122({ flow: "cook:mishkaki-grill@L2" }, [{ type: "c", k: "s19pic", t: 1000, cards: [{ cls: "pop", card: [360, 10, 660, 210], pic: pic, fitrow: true }] }, { type: "c", k: "x", t: 3000 }], (c, t, m) => out.push(m)); return out; };
  assert.equal(run([375, 25, 645, 25]).length, 1, "270x0: red");
  assert.equal(run([375, 25, 645, 60]).length, 1, "270x35 on a 200 px card: red");
  assert.equal(run([375, 25, 645, 110]).length, 0, "270x85: green");
});
