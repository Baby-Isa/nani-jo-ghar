// Sprint 17 (s17-chk2): contract-96 (a boil-over reopens the pot's rows), 97 (the zoom-in light everywhere), 98 (a first-time lesson is
// shown), 99 (the panel follows a fold), red then green on synthetic timelines; the hook's S17 probe and the paths' registration.
// No browser. Run: node --test build/sandbox/contract-s17.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { S17_CHECKS, checkS17, check96, check97, check98, check99 } from "./lib/contract-s17.mjs";
import { CONTRACT_HOOK } from "./lib/contract-hook.mjs";
import { resolveFlow } from "./flows/index.mjs";

const run = (fn, ...a) => {
  const out = [];
  fn(...a, (id, t, msg) => out.push({ id, t, msg }));
  return out;
};
const life = (t, what, reason, by) => ({ type: "c", k: "life", t, at: t, what, reason: String(reason), step: String(reason), by });
const lit = (t, ...holes) => ({ type: "c", k: "lit", t, holes, card: false, faces: [], layers: holes.length ? 1 : 0 });
const thing = (t, box, sel = "wc14") => ({ type: "c", k: "litthing", t, hole: box, thing: box, sel });
const R = { flow: "cook:chai-tray@L2" };

// ---- 96 ----
const panelRows = (t, who, done, sl) => ({ type: "c", k: "panel", t, st: 0, sh: 400, view: 300, top: 0, cards: [], rows: [{ who, n: 6, done, sl }], focus: null });

test("contract-96: after the pot starts again its rows are open and its card is back at the first item", () => {
  const tl = [panelRows(1000, "nana", 6, 130), life(5000, "chai-boil", "over", "nana 1"), panelRows(5100, "nana", 6, 130), life(6200, "chai-boil", "again", "nana 0"), panelRows(6300, "nana", 0, 0)];
  assert.equal(run(check96, { flow: "cook:chai-tray#boil-over" }, tl).length, 0);
});

test("contract-96: rows left ticked, or the row left where it was, is a break", () => {
  const stay = [panelRows(1000, "nana", 6, 130), life(6200, "chai-boil", "again", "nana 0"), panelRows(6300, "nana", 6, 0)];
  const out = run(check96, { flow: "cook:chai-tray#boil-over" }, stay);
  assert.equal(out.length, 1);
  assert.match(out[0].msg, /6 of 6 rows are still ticked/);
  const along = [panelRows(1000, "nana", 6, 130), life(6200, "chai-boil", "again", "nana 0"), panelRows(6300, "nana", 0, 130)];
  assert.match(run(check96, { flow: "cook:chai-tray#boil-over" }, along)[0].msg, /scrolled 130 px along/);
  // a sample after the window does not count; another person's card does not either
  assert.equal(run(check96, { flow: "cook:chai-tray#boil-over" }, [life(6200, "chai-boil", "again", "nana 0"), panelRows(9000, "nana", 6, 0)]).length, 0);
  assert.equal(run(check96, { flow: "cook:chai-tray#boil-over" }, [panelRows(1000, "ma", 6, 130), life(6200, "chai-boil", "again", "nana 0")]).length, 0);
});

test("contract-96: the player's refill just after the reset is not a stuck tick (S18, CHAI-105)", () => {
  const tl = [panelRows(1000, "nana", 5, 304), life(6200, "chai-boil", "again", "nana 0"), panelRows(6220, "nana", 0, 304), panelRows(6600, "nana", 0, 0), life(6730, "chai-add", "cook-paani", "nana:1"), panelRows(6740, "nana", 1, 0)];
  assert.equal(run(check96, { flow: "cook:chai-tray@L3#returning" }, tl).length, 0);
});

// ---- 97 ----
const CARD = [15, 148, 138, 353];
test("contract-97: a light that starts on the whole card and shrinks onto the dotted word passes", () => {
  const tl = [lit(100), thing(150, CARD), lit(200, CARD), lit(900, [30, 190, 123, 328]), lit(1500, [57, 264, 97, 284]), lit(3000)];
  assert.equal(run(check97, tl).length, 0);
});

test("contract-97: a light drawn straight on a small part is a break", () => {
  const tl = [lit(100), thing(150, CARD), lit(200, [57, 264, 97, 284]), lit(3000)];
  const out = run(check97, tl);
  assert.equal(out.length, 1);
  assert.match(out[0].msg, /starts straight on the part/);
});

test("contract-97: a first box that covers little of the whole thing is a break; a part of a quarter or more, or no DOM thing, is not read", () => {
  const half = [lit(100), thing(150, CARD), lit(200, [15, 148, 138, 250]), lit(900, [57, 264, 97, 284]), lit(3000)];
  assert.match(run(check97, half)[0].msg, /starts on 50% of the thing/);
  const big = [lit(100), thing(150, CARD), lit(200, [15, 148, 138, 300]), lit(3000)];
  assert.equal(run(check97, big).length, 0, "a box of three quarters of the card is not a part");
  assert.equal(run(check97, [lit(100), lit(200, [57, 264, 97, 284]), lit(3000)]).length, 0, "no thing under the light (a canvas jar): not read");
  assert.equal(run(check97, [lit(100), { ...thing(150, CARD), thing: null }, lit(200, [57, 264, 97, 284]), lit(3000)]).length, 0);
});

// ---- 98 ----
const reveal = (t, dots, eyes = 0) => ({ type: "c", k: "reveal", t, dots, eyes });
const station = life(1000, "stage-start", "cook:station", null);

test("contract-98: a dotted word on the panel and its lesson shown passes", () => {
  const tl = [station, reveal(2000, 2), life(3000, "reveal-lesson", "word", "shown nana:ok")];
  assert.equal(run(check98, R, tl).length, 0);
});

test("contract-98: a missing 'shown', or only none-in-view, is a break; a returning player has no first time", () => {
  const none = run(check98, R, [station, reveal(2000, 2)]);
  assert.equal(none.length, 1);
  assert.match(none[0].msg, /never logged/);
  const lost = run(check98, R, [station, reveal(2000, 2), life(3000, "reveal-lesson", "word", "none-in-view nana:out@10,20")]);
  assert.equal(lost.length, 1);
  assert.match(lost[0].msg, /not shown \(none-in-view/);
  assert.equal(run(check98, { flow: "cook:chai-tray@L3#returning" }, [station, reveal(2000, 2)]).length, 0);
  assert.equal(run(check98, { flow: "cook:chai-tray@L3", profile: "seen" }, [station, reveal(2000, 2)]).length, 0);
  // no dotted word on the panel: nothing was due
  assert.equal(run(check98, R, [station, reveal(2000, 0)]).length, 0);
  // before the station starts is the order's, not the lesson's
  assert.equal(run(check98, R, [station, reveal(500, 2)]).length, 0);
});

test("contract-98: the blurred picture's lesson is judged on its own", () => {
  const ok = [station, reveal(2000, 2, 1), life(3000, "reveal-lesson", "word", "shown nana:ok"), life(6000, "reveal-lesson", "pic", "shown nana:ok")];
  assert.equal(run(check98, R, ok).length, 0);
  const miss = run(check98, R, [station, reveal(2000, 2, 1), life(3000, "reveal-lesson", "word", "shown nana:ok")]);
  assert.equal(miss.length, 1);
  assert.match(miss[0].msg, /blurred picture/);
});

// ---- 99 ----
const card = (who, top, h = 100, extra = {}) => ({ who, top, h, done: false, folded: false, speaking: false, ...extra });
const panel = (t, st, cards, o = {}) => ({ type: "c", k: "panel", t, st, sh: 700, view: 300, top: 0, cards, rows: [], focus: null, ...o });
const fold = (t, who) => ({ type: "c", k: "fold", t, at: t, who });

test("contract-99: the next card at its planned place after the fold passes", () => {
  // the next card (ma) sits at the list's 520, scrolled to 516: its top 4 px below the panel's top
  const tl = [panel(1000, 0, [card("nana", 0), card("ma", 520)]), fold(2000, "nana"), panel(2500, 516, [card("nana", -516, 40, { done: true, folded: true }), card("ma", 4)])];
  assert.equal(run(check99, R, tl).length, 0);
});

test("contract-99: a panel left where it was is a break", () => {
  const tl = [panel(1000, 0, [card("nana", 0), card("ma", 520)]), fold(2000, "nana"), panel(2100, 0, [card("nana", 0, 40, { done: true, folded: true }), card("ma", 520)])];
  const out = run(check99, R, tl);
  assert.equal(out.length, 1);
  assert.match(out[0].msg, /after nana's card folded, ma's card is 520 px down, cut at the foot/);
});

test("contract-99: whole in view, a list that fits, the scroll range's end and the panel's focus", () => {
  // the next card whole in view where it is: nothing moves
  assert.equal(run(check99, R, [panel(1000, 0, [card("nana", 0), card("ma", 130)]), fold(2000, "nana"), panel(2100, 0, [card("nana", 0, 40, { done: true, folded: true }), card("ma", 130)])]).length, 0);
  // clamped to the end of the scroll range (700 - 300 = 400): the card is cut by the range, not left
  const end = [panel(1000, 0, [card("nana", 0), card("ma", 520)]), fold(2000, "nana"), panel(2400, 400, [card("nana", -400, 40, { done: true, folded: true }), card("ma", 250)])];
  assert.equal(run(check99, R, end).length, 0);
  // the card in progress is the panel's focus (the pan in hand), not the first not done
  const three = (st, a, b) => [card("nana", 0, 40, { done: true, folded: true }), card("ma", a), card("cousin", b)];
  const focus = [panel(1000, 0, three(0, 120, 520), { focus: "cousin" }), fold(2000, "nana"), panel(2100, 0, three(0, 120, 520), { focus: "cousin" })];
  assert.equal(run(check99, R, focus).length, 1, "cousin is the one in progress and is left at the foot");
  const focusOk = [panel(1000, 0, three(0, 120, 520), { focus: "cousin" }), fold(2000, "nana"), panel(2500, 516, three(516, -396, 4), { focus: "cousin" })];
  assert.equal(run(check99, R, focusOk).length, 0);
  // a late move (after the fold's time plus 400 ms) is a break all the same
  const late = [panel(1000, 0, [card("nana", 0), card("ma", 520)]), fold(2000, "nana"), panel(3500, 516, [card("nana", -516, 40, { done: true, folded: true }), card("ma", 4)])];
  assert.equal(run(check99, R, late).length, 1);
  // a clinic or lab page without the Cook panel logs nothing
  assert.equal(run(check99, R, [fold(2000, "nana")]).length, 0);
});

// ---- the registry, the hook and the paths ----
test("the S17 checks are registered with an item, a title and its measure, and run on a quiet timeline", () => {
  assert.deepEqual(Object.keys(S17_CHECKS), ["contract-96", "contract-97", "contract-98", "contract-99"]);
  for (const c of Object.values(S17_CHECKS)) assert.ok(c.item && c.title && c.how.length > 80);
  const out = [];
  checkS17({ flow: "cook:chai-tray" }, [], { lines: [] }, (id, t, m) => out.push(id));
  assert.equal(out.length, 0);
});

test("the page probe carries the S17 sampler and still compiles", () => {
  assert.doesNotThrow(() => new Function(CONTRACT_HOOK));
  for (const k of ["litthing", "reveal", "panel", "fold"]) assert.match(CONTRACT_HOOK, new RegExp(`k: "${k}"`));
});

test("the paths cook:chai-tray#boil-over, #tap-mid-order and #slow-cards resolve at every level", () => {
  for (const id of ["cook:chai-tray#boil-over", "cook:chai-tray@L2#tap-mid-order", "cook:chai-tray@L3#tap-mid-order", "cook:chai-tray@L2#slow-cards", "cook:chai-tray@L3#slow-cards"]) assert.equal(resolveFlow(id) && resolveFlow(id).id, id);
});
