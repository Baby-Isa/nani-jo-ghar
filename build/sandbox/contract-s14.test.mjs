// Sprint 14 (s14-chai): the contract checks for the s14 order row, the bubble's speaker and the skip (contract-72, 73, 74), red then
// green, and chai's level rules in the data (Zafar, 29 Oct). s19-checks-2: 72, 73 and 74 read the screen (lib/contract-s19b-hook.mjs:
// s19row, s19spk, s19ord), so their tests are the probe's samples, not the game's notes. No browser. Run: node --test build/sandbox/contract-s14.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { check72, check73, check74, check75, check76, check77 } from "./lib/contract.mjs";

const life = (t, what, reason, by) => ({ type: "c", k: "life", t, what, reason: String(reason), by });
const run = (fn, ...a) => {
  const out = [];
  fn(...a, (id, t, msg) => out.push({ id, t, msg }));
  return out;
};

const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
// the order row's scroll as the probe sees it, frame by frame (each sample with the frame before: px its scroll, pt its time)
const glide = (t, xs, w = 130) => xs.map((x, i) => c(t + i * 16, "s19row", { x, w, n: 4, vis: 1, px: i ? xs[i - 1] : 0, pt: t + i * 16 - 16 }));
test("contract-72: a glide frame by frame passes; a move of more than a card in one frame, or a glide past 2.5 cards, is a break", () => {
  const before = [c(0, "s19row", { x: 0, w: 130, n: 4, vis: 1, px: 0, pt: 0 })];
  assert.equal(run(check72, {}, [...before, ...glide(100, [20, 60, 100, 120])]).length, 0);
  assert.equal(run(check72, {}, [...before, ...glide(100, [140])]).length, 1, "140 px in one frame, a card is 130");
  assert.equal(run(check72, {}, [...before, ...glide(100, [100, 200, 300, 400])]).length, 1, "past 2.5 cards");
  // (a row that shows already scrolled was hidden as it moved: no jump; a late frame of 180 ms may hold a short glide)
  assert.equal(run(check72, {}, [c(0, "s19row", { x: 0, w: 130, n: 4, vis: 0, px: 0, pt: 0 }), c(100, "s19row", { x: 140, w: 130, n: 4, vis: 1, px: 0, pt: 84 })]).length, 0);
  assert.equal(run(check72, {}, [...before, c(300, "s19row", { x: 140, w: 130, n: 4, vis: 1, px: 0, pt: 120 })]).length, 0);
});

test("contract-73: a Cook line's speaker in a speech bubble is a break (SH-153, 1 Nov); a conversation's speaker under the tap is a break", () => {
  const spk = (list, t = 100) => [c(t, "s19spk", { list }), c(t + 500, "s19spk", { list: [] })];
  assert.equal(run(check73, {}, spk([{ cls: "cv-spk", box: [0, 0, 48, 48], text: "Salamun alaykum!" }])).length, 0);
  assert.match(run(check73, {}, spk([{ cls: "wp-say", box: [0, 0, 58, 58], text: "Dudh wiji chad!" }]))[0].msg, /no speaker button in any speech bubble/);
  assert.match(run(check73, {}, spk([{ cls: "cv-spk", box: [0, 0, 40, 40], text: "Salamun alaykum!" }]))[0].msg, /under the 48 px tap/);
  // a bubble popping in (held under 300 ms) is not judged
  assert.equal(run(check73, {}, [c(100, "s19spk", { list: [{ cls: "cv-spk", box: [0, 0, 30, 30], text: "x" }] }), c(200, "s19spk", { list: [] })]).length, 0);
});

test("contract-74: a tap during the order lands every card within 1 s and the station follows within 1 s", () => {
  const ord = (t, pop, away) => c(t, "s19ord", { pop, fly: 0, away, rows: 4 });
  const tap = (t) => c(t, "input", { x: 1, y: 1, on: "canvas", play: true });
  const segs = [{ key: "cook:order", t0: 0 }, { key: "cook:station1:marble", t0: 1500 }];
  const R = { flow: "cook:chai-tray" };
  assert.equal(run(check74, R, [ord(0, 0, 4), ord(500, 1, 3), tap(1000), ord(1200, 0, 0)], segs).length, 0);
  assert.match(run(check74, R, [ord(0, 0, 4), ord(500, 1, 3), tap(1000), ord(1200, 0, 2)], segs)[0].msg, /2 cards not yet in its row/);
  assert.match(run(check74, R, [ord(0, 0, 4), tap(1000), ord(1200, 0, 0)], [{ key: "cook:station1:marble", t0: 3000 }])[0].msg, /started 2000 ms after/);
  // no tap during the order: not judged
  assert.equal(run(check74, R, [ord(0, 0, 4), ord(1200, 0, 0), tap(3000)], segs).length, 0);
});

test("chai's level rules (Zafar, 29 Oct): L1 no no-asks, names from L3, decoys 1-4 with the lookalike at L4, the card always open", () => {
  const cook = JSON.parse(readFileSync(new URL("../../data/cook.json", import.meta.url), "utf8"));
  const each = cook.recipes.chai.slots.cups.each;
  assert.equal(each.dudh.byLevel[0].chance, 1, "every cup has milk at L1");
  assert.equal(each.khun.byLevel[0].zero, 0, "one sugar at L1, never none");
  assert.deepEqual(each.named.byLevel.map((x) => x.chance), [0, 0, 0.5], "kari / mori chai from L3");
  // (SH-155, 29 Oct: chai's level row moved to the central rules, data/rules.json levels; the active card's Kutchi always written)
  const row = JSON.parse(readFileSync(new URL("../../data/rules.json", import.meta.url), "utf8")).levels;
  assert.equal(cook.levelTable.stations["chai-tray"], undefined, "no copy of the rules in cook.json");
  assert.deepEqual(row.decoys, [1, 2, 3, 4]);
  assert.deepEqual(row.lookalike, [false, false, false, true]);
  assert.ok(row.cardKutchi.every((c) => c === true), "the active card's Kutchi always written");
  const st = JSON.parse(readFileSync(new URL("../../data/stations/chai-tray.json", import.meta.url), "utf8"));
  const lv = st.mechanic ? st.mechanic.levels : st.levels || [];
  assert.ok(lv.length >= 4 || JSON.stringify(st).includes('"heat"'), "chai's heat by level");
});

// s14-rules (Zafar, 29 Oct, round 4): the central rules' skip zones, the pop-out off faces, the first-time hold, the row's way home
test("contract-75: a tap on a bubble, the side or the cog never skips; a tap in the play area does", () => {
  assert.equal(run(check75, [life(1000, "skip-zone", "bubble", "skipped:0")]).length, 0);
  assert.equal(run(check75, [life(1000, "skip-zone", "bubble", "skipped:0"), life(1300, "order-skip", 200, "left:0")]).length, 1, "the bubble skipped");
  assert.equal(run(check75, [life(1000, "skip-zone", "play", "skipped:1"), life(1500, "order-skip", 500, "left:0")]).length, 0);
  assert.equal(run(check75, [life(1000, "skip-zone", "play", "skipped:1")]).length, 1, "the play area did not skip");
});

test("contract-76: the big pop-out card over a face is a break", () => {
  assert.equal(run(check76, [life(10, "pop-face", 0, "faces:2 w:180")]).length, 0);
  assert.equal(run(check76, [life(10, "pop-face", 340, "faces:2 w:180")]).length, 1);
});

// (contract-77 reads the kit's heat ring since s19-checks-2: its tests are in build/sandbox/contract-chai.test.mjs)

// s19-checks-2 (no opt-ins): contract-78's control calls and contract-37's decoys come from the page, not data/games.json: a game is
// judged the day it plays, never the day it is listed
import { analyse } from "./lib/contract.mjs";
import { check78 } from "./lib/contract-s14.mjs";

test("contract-78 and -37 judge any game from the page: a call said in a heat ring's green is a control's; the shelf's decoys are counted", () => {
  const ring = [0.3, 0.5, 0.62, 0.7].map((lv, i) => c(800 + i * 100, "s19ring", { id: 1, lv, lo: 0.6, hi: 0.9 }));
  const call = { lines: [{ role: "call", text: "Dhimo kar!", t0: 1000, t1: 1800, plays: [{}] }] };
  assert.match(run(check78, { flow: "cook:tandoor" }, ring, call)[0].msg, /no light comes with it/);
  assert.equal(run(check78, { flow: "cook:tandoor" }, [...ring, c(1050, "lit", { holes: [[1, 1, 2, 2]] })], call).length, 0, "its light with it");
  assert.equal(run(check78, { flow: "cook:tandoor" }, [], call).length, 0, "no ring, no knob: not a control's call");
  // contract-37: the shelf's things the order card does not ask for, by level (L2: 2)
  const page = (shelf) => analyse({ flow: "cook:tandoor@L2", size: "1366x768", t0: 0, states: [], timeline: [c(0, "stage", { key: "cook:station1:marble" }), c(100, "s19pad", { box: [0, 0, 300, 300], row: [10, 50, 290, 250], cards: [{ w: "atto", done: 0, box: [10, 50, 120, 250], in: [17, 57, 113, 243] }] }), c(500, "s19shelf", { items: shelf.map((id) => ({ id, foot: 600, chip: 640 })) }), c(2000, "s19shelf", { items: [] })] }, { lexicon: new Set(), numbers: new Set() }).filter((b) => b.check === "contract-37");
  assert.match(page(["cook-atto", "veg-01"])[0].measured, /1 decoy on the shelf .* the table wants 2/);
  assert.equal(page(["cook-atto", "veg-01", "veg-02"]).length, 0);
});
