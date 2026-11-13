// The geometry rules' pure parts (Sprint 20 P5): each rule passes a sound read and fails a read with its fault, and the fault's message
// says what, where and by how much.   node --test build/sandbox/lib/geometry.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { judge, overlap, gap, formatRules, RULE_IDS } from "./geometry.mjs";

// a sound read, 740x320: the side panel, the play area with the bottom row inside it, Nani's box, one order card with its face and items
const sound = () => ({
  boxes: {
    canvas: [224.39, 0, 740, 320], stage: [224.39, 0, 740, 320], play: [224.39, 0, 740, 320], side: [0, 0, 224.39, 320], list: [2.27, 59.44, 221.13, 293.2],
    "bottom-row": [224.39, 233, 740, 320], hob: [336, 31, 472, 224], tray: [495, 52, 640, 195], board: [333, 55, 450, 174],
    nani: [5.27, 5.27, 218.13, 55.17], "nani/face": [10.53, 6.22, 58.53, 54.22], "card-1": [5.27, 66.44, 218.13, 259], "card-1/face": [4.95, 61.92, 52.95, 109.92],
    "light-1": [315, 228, 381, 319], "glow-1": [338, 241, 363, 295],
  },
  texts: { "card-1/oc-headline#1": { box: [60, 75, 91, 94], cut: false, text: "Muke" } },
  info: { view: "marble" },
  extra: {
    faces: { "card-1": [14, 70, 46, 102], nani: [12, 8, 52, 50] },
    items: { "card-1/item-1": [10, 112, 86, 250], "card-1/item-2": [92, 112, 168, 250] },
    fit: { "card-1/oc-headline#1": { fs: 14.5, lines: 1, box: [60, 75, 170, 94], sw: 110, cw: 110, text: "Muke chai khape." } },
    taps: { "dom:button.x#1": [10, 10, 60, 60] },
    pills: { "pill-1": [354, 4, 428, 22] },
  },
});
const page = (reads, size = "740x320", extra = {}) => ({ key: `L1@${size}`, game: "t", level: 1, size, moments: Object.fromEntries(Object.entries(reads).map(([m, r]) => [m, { read: r }])), ...extra });
const one = (id, mut, size) => { const r = sound(); mut(r); return judge([page({ mid: r }, size)], { only: [id] })[0]; };
const failsWith = (res, re) => res.faults.some((f) => re.test(f.msg));

test("a sound read passes every rule", () => {
  const res = judge([page({ mid: sound() })], { only: RULE_IDS.filter((i) => i !== "frame-slots") });
  for (const r of res) assert.equal(r.pass, true, `${r.id}: ${r.faults.map((f) => f.msg).join("; ")}`);
});
test("overlap helpers: touching is not overlapping; gap counts the space between", () => {
  assert.equal(overlap([0, 0, 10, 10], [10, 0, 20, 10]), null);
  assert.deepEqual(overlap([0, 0, 10, 10], [8, 6, 20, 20]), { w: 2, h: 4 });
  assert.equal(gap([0, 0, 10, 10], [13, 0, 20, 10]), 3);
});
test("overlap: an item card laid over a card's face fails, with how far", () => {
  const r = one("overlap", (x) => { x.extra.items["card-1/item-1"] = [20, 80, 96, 218]; });
  assert.equal(r.pass, false);
  assert.ok(failsWith(r, /card-1 \[14, 70, 46, 102\] overlaps card-1\/item-1 .* by 26 x 22 px/), r.faults[0].msg);
});
test("overlap: Nani's face over her words, and a card's words over its face, fail", () => {
  const r = one("overlap", (x) => { x.texts["nani/word#1"] = { box: [40, 20, 100, 40], cut: false, text: "E chai" }; });
  assert.ok(failsWith(r, /nani .* overlaps nani\/word#1/));
  const r2 = one("overlap", (x) => { x.texts["card-1/oc-headline#1"].box = [40, 75, 91, 94]; });
  assert.ok(failsWith(r2, /card-1 .* overlaps card-1\/oc-headline#1/));
});
test("frame-apart: the side panel over the play area or the bottom row fails; the bottom row must lie inside the play area", () => {
  const r = one("frame-apart", (x) => { x.boxes.side = [0, 0, 232.39, 320]; });
  assert.equal(r.pass, false);
  assert.ok(failsWith(r, /side panel .* overlaps play area .* by 8 x 320 px/));
  const r2 = one("frame-apart", (x) => { x.boxes["bottom-row"] = [200, 233, 740, 320]; });
  assert.ok(failsWith(r2, /side panel .* overlaps bottom row/));
  const r3 = one("frame-apart", (x) => { x.boxes["bottom-row"] = [224.39, 233, 740, 360]; });
  assert.ok(failsWith(r3, /bottom row .* is not inside the play area/));
});
test("on-screen: a thing past the screen's edge fails, and says which edge and by how much", () => {
  const r = one("on-screen", (x) => { x.boxes.tray = [695, 52, 840, 195]; });
  assert.equal(r.pass, false);
  assert.ok(failsWith(r, /tray .* off the 740x320 screen: right by 100 px/));
  const r2 = one("on-screen", (x) => { x.boxes.nani = [5, -9, 218, 55]; });
  assert.ok(failsWith(r2, /nani .* top by 9 px/));
});
test("text-whole: a cut word, a word wider than its box and too many lines fail", () => {
  const r = one("text-whole", (x) => { x.texts["card-1/oc-headline#1"].cut = true; });
  assert.ok(failsWith(r, /"Muke" .* is cut/));
  const r2 = one("text-whole", (x) => { x.extra.fit["card-1/oc-headline#1"].sw = 130; });
  assert.ok(failsWith(r2, /is 20 px wider than its box/));
  const r3 = one("text-whole", (x) => { x.extra.fit["card-1/oc-headline#1"].lines = 3; });
  assert.ok(failsWith(r3, /is 3 lines at 14.5 px, 1 more than the 2/));
});
test("light: whole round its target and centred passes; shifted, partial or empty fails", () => {
  const r = one("light", (x) => { x.boxes["light-1"] = [335, 228, 401, 319]; });
  assert.equal(r.pass, false);
  assert.ok(failsWith(r, /off its target glow-1 .* by -?17\.\d px across/));
  const r2 = one("light", (x) => { x.boxes["light-1"] = [345, 228, 411, 319]; });
  assert.ok(failsWith(r2, /sticks out of light-1/));
  const r3 = one("light", (x) => { x.boxes["light-1"] = [10, 10, 60, 60]; });
  assert.ok(failsWith(r3, /holds none of the 1 lit thing/));
  const r4 = one("light", (x) => { x.boxes["light-1/ring-1"] = [100, 100, 140, 140]; });
  assert.ok(failsWith(r4, /ring-1 .* rings nothing lit/));
});
test("tap-size: a target under 48 px either way fails; one off the screen is not judged", () => {
  const r = one("tap-size", (x) => { x.extra.taps["canvas:jar#2"] = [338, 241, 363, 295]; });
  assert.equal(r.pass, false);
  assert.ok(failsWith(r, /canvas:jar is 25 x 54 px .* under 48 px by 23/));
  const r2 = one("tap-size", (x) => { x.extra.taps["canvas:far#3"] = [900, 10, 910, 20]; });
  assert.equal(r2.pass, true);
});
test("headline: one size through the round; at most two lines on a phone, not on a big screen", () => {
  const a = sound(), b = sound();
  b.extra.fit["card-1/oc-headline#1"].fs = 11.5;
  const r = judge([page({ order: a, end: b })], { only: ["headline"] })[0];
  assert.equal(r.pass, false);
  assert.ok(failsWith(r, /is set 2 ways in one round: order 14.5 px in 1 line, end 11.5 px/));
  const c = sound(); c.extra.fit["card-1/oc-headline#1"].lines = 3;
  const r2 = judge([page({ end: c })], { only: ["headline"] })[0];
  assert.ok(failsWith(r2, /at end is 3 lines at 14.5 px on a phone \(740x320\), most 2/));
  const r3 = judge([page({ end: c }, "1280x665")], { only: ["headline"] })[0];
  assert.equal(r3.pass, true);
});
test("pill-clear: a pill over a thing, or under 6 px from it, fails", () => {
  const r = one("pill-clear", (x) => { x.extra.pills["pill-1"] = [354, 30, 428, 60]; });
  assert.ok(failsWith(r, /pill-1 .* lies over board .* by 74 x 5 px/));
  const r2 = one("pill-clear", (x) => { x.extra.pills["pill-1"] = [354, 28, 428, 50]; });
  assert.ok(failsWith(r2, /touches board .*: 5 px between/));
  assert.equal(one("pill-clear", (x) => { x.extra.pills["pill-1"] = [354, 8, 428, 24]; }).pass, true);
});
test("panel-holds: Nani's box or a card wider than the side panel fails", () => {
  const r = one("panel-holds", (x) => { x.boxes.nani = [5, 5, 278, 55]; });
  assert.ok(failsWith(r, /nani .* is not inside the side panel/));
  const r2 = one("panel-holds", (x) => { x.boxes["card-1"] = [5, 66, 250, 259]; });
  assert.ok(failsWith(r2, /card-1 .* runs 25\.6 px past the side panel's sides/));
});
test("frame-slots: the same place through moments and levels, and the same as the reference; a shifted slot fails by how far", () => {
  const ref = [page({ mid: sound() })];
  const ok = judge([page({ mid: sound() })], { ref, only: ["frame-slots"] })[0];
  assert.equal(ok.pass, true);
  const x = sound(); x.boxes.side = [0, 0, 228.39, 320]; x.boxes["bottom-row"] = [224.39, 240, 740, 320];
  const bad = judge([page({ mid: x })], { ref, only: ["frame-slots"] })[0];
  assert.equal(bad.pass, false);
  assert.ok(bad.faults.some((f) => /side \[0, 0, 228.4, 320\] is not where it is in .*: .* right 4/.test(f.msg)));
  assert.ok(bad.faults.some((f) => /bottom-row .* top 7/.test(f.msg)));
  // another view (the serve) is judged against its own kind, a slot not drawn is not a fault
  const sv = sound(); sv.info.view = "service"; sv.boxes.play = [224.39, -50, 740, 269]; delete sv.boxes["bottom-row"];
  assert.equal(judge([page({ serve: sv })], { ref, only: ["frame-slots"] })[0].faults.length, 0);
  // with no reference, two levels of one game must agree
  const l4 = page({ mid: x }); l4.key = "L4@740x320"; l4.level = 4;
  assert.equal(judge([page({ mid: sound() }), l4], { only: ["frame-slots"] })[0].pass, false);
});
test("a read with no extras is skipped, never a pass; the printout names it", () => {
  const r = sound(); delete r.extra;
  const res = judge([page({ mid: r })], { only: ["tap-size", "overlap", "frame-apart"] });
  assert.equal(res[0].pass, null);
  assert.equal(res[2].pass, true);
  assert.match(formatRules(res), /skip tap-size: no extra reads/);
});
