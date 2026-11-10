// s19-checks-1: contract-112 and -113's reading, "judged N of M", the probe faults' fixes (102, 106, 107) and contract-95's fallback.
// No browser. Run: node --test build/sandbox/screen-checks.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { check112, check113, pageJudged, judgedByGame, judgedMd, readsOf, gameOf } from "./lib/contract-screen.mjs";
import { check102, check106, check107 } from "./lib/contract-s19.mjs";
import { check95 } from "./lib/contract-s14.mjs";
import { CHECKS } from "./lib/contract.mjs";
import { sameLight } from "./lib/lightshot.mjs";

const run = (fn, ...a) => { const out = []; fn(...a, (id, t, msg) => out.push({ id, t, msg })); return out; };
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const life = (t, what, o = {}) => c(t, "life", { what, ...o });
const ST = [c(0, "stage", { key: "cook:station1:eggs" })];

test("contract-112 reads each light's verdict: a failing light is a break with its picture; a light the judge could not see is not", () => {
  const r = { flow: "cook:eggs", lights: [{ n: 1, t0: 10, dir: "x/01", verdict: { ok: false, dir: "x/01", region: [1, 2, 3, 4], fails: ["the dim is darker than chai's"] } }, { n: 2, t0: 20, dir: "x/02", verdict: { ok: true } }, { n: 3, t0: 30, dir: "x/03", verdict: { ok: null, skipped: "nothing darkened" } }] };
  const out = run(check112, r, []);
  assert.equal(out.length, 1);
  assert.match(out[0].msg, /light 1 \[1,2,3,4\]: the dim is darker than chai's \(picture: x\/01\/mark\.jpg\)/);
});

test("contract-113: a cover held 300 ms is a break, once per pair; a picture passing over (its box moving) is not", () => {
  const cov = (t, byBox) => c(t, "s19over", { list: [{ what: "face", id: "nana", box: [0, 0, 10, 10], by: "picture", byId: "plate", byBox, share: 0.3, on: "over" }] });
  const held = [cov(100, [0, 0, 50, 50]), cov(500, [0, 0, 50, 50]), c(900, "s19over", { list: [] })];
  const out = run(check113, { flow: "cook:corn" }, held);
  assert.equal(out.length, 1);
  assert.match(out[0].msg, /nana's face sits over plate/);
  const passing = [cov(100, [0, 0, 50, 50]), cov(250, [40, 0, 90, 50]), cov(400, [80, 0, 130, 50]), c(550, "s19over", { list: [] })];
  assert.equal(run(check113, { flow: "cook:corn" }, passing).length, 0);
});

test("no silent passes: a game missing a games.json field is named with it; a page without a check's sample says so; the summary counts", () => {
  const r = { flow: "cook:eggs#speed1", size: "740x320", lights: [] };
  const j = pageJudged(r, [...ST, c(5, "s19lit", { holes: [] })], CHECKS);
  assert.equal(j["contract-70"], "games.json has no slowAtGreen for eggs");
  assert.match(j["contract-110"], /no s19knob on its pages/);
  assert.equal(j["contract-112"], "no light caught on its pictures");
  const by = judgedByGame([{ r, tl: ST }], CHECKS);
  assert.equal(by.eggs.of, Object.keys(CHECKS).length);
  assert.ok(by.eggs.judged < by.eggs.of);
  assert.match(judgedMd(by), /\*\*eggs\*\*: judged \d+ of \d+ checks over 1 page; not judged: .*contract-70/);
  assert.equal(gameOf("lab:cook/maani-line@L2"), "maani");
  assert.deepEqual(readsOf("contract-110").kinds, ["s19knob"]);
});

test("the probe faults: 106 counts from the game's act (a tap lands as the finger lifts); 107's hop may come 400 ms after the light; 102 lets a glow outlive its light", () => {
  const box = [100, 100, 200, 200];
  const tl106 = [...ST, c(1000, "s19lit", { holes: [box] }), c(1100, "input", { x: 150, y: 150 }), life(1700, "act"), c(1800, "s19lit", { holes: [] })];
  assert.equal(run(check106, { flow: "cook:eggs" }, tl106).length, 0);
  const late = [...ST, c(1000, "s19lit", { holes: [box] }), c(1100, "input", { x: 150, y: 150 }), c(2200, "s19lit", { holes: [] })];
  assert.equal(run(check106, { flow: "cook:eggs" }, late).length, 1);
  const shelf = { kind: "word", id: "jar", shelf: true };
  const sb = [100, 480, 200, 590]; // (a shelf thing: its foot in the bottom band)
  const tl107 = [...ST, c(1000, "s19lit", { holes: [sb], things: [shelf], vh: 600 }), c(1600, "s19glow", { list: [{ key: "jar", bounce: true, box: [120, 500, 180, 580] }], canvas: [0, 0, 800, 600] }), c(3000, "s19lit", { holes: [], vh: 600 })];
  assert.equal(run(check107, { flow: "cook:chaat" }, tl107).length, 0);
  const tl102 = [...ST, c(1000, "s19lit", { holes: [box] }), c(1500, "s19lit", { holes: [] }), c(1600, "s19glow", { list: [{ key: "jar", box: [120, 120, 180, 180] }] }), c(2100, "s19glow", { list: [] })];
  assert.equal(run(check102, { flow: "cook:chai-tray" }, tl102).length, 0);
});

test("contract-95: an order skipped by its order-skip note alone is judged (its fallback sat inside a comment and never ran)", () => {
  const tl = [life(1000, "order-skip", { reason: "0" }), life(3000, "step-open")];
  const v = { lines: [{ t0: 1500, text: "Muke chai khape.", plays: [{}] }] };
  assert.equal(run(check95, { flow: "cook:chai-tray" }, tl, v).length, 1);
});

test("the light capture: a box that moves a little is the same light; one moved to another thing is new", () => {
  assert.ok(sameLight([[100, 100, 200, 200]], [[104, 98, 204, 198]]));
  assert.ok(!sameLight([[100, 100, 200, 200]], [[400, 100, 500, 200]]));
});
