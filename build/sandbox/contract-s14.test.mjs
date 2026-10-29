// Sprint 14 (s14-chai): the new contract checks for the s14 order row, the bubble's speaker and the skip (contract-72, 73, 74),
// red then green on synthetic notes, and chai's level rules in the data (Zafar, 29 Oct). No browser. Run: node --test build/sandbox/contract-s14.test.mjs
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

test("contract-72: a smooth glide within a card's width passes; a jump or a glide past it is a break", () => {
  assert.equal(run(check72, [life(10, "row-glide", 120, "card:130 smooth")]).length, 0);
  assert.equal(run(check72, [life(10, "row-glide", 120, "card:130")]).length, 1);
  assert.equal(run(check72, [life(10, "row-glide", 220, "card:130 smooth")]).length, 0);
  assert.equal(run(check72, [life(10, "row-glide", 400, "card:130 smooth")]).length, 1);
});

test("contract-73: the bubble's speaker at least the tap, 1.8 em and its icon 60%", () => {
  assert.equal(run(check73, [life(5, "bubble-spk", 58, "em:57.6 icon:38 text:32")]).length, 0);
  assert.equal(run(check73, [life(5, "bubble-spk", 40, "em:32.4 icon:26 text:18")]).length, 1);
  assert.equal(run(check73, [life(5, "bubble-spk", 48, "em:57.6 icon:30 text:32")]).length, 1);
  assert.equal(run(check73, [life(5, "bubble-spk", 58, "em:57.6 icon:24 text:32")]).length, 1);
});

test("contract-74: a tap lands every card within 1 s and the station follows within 1 s", () => {
  const segs = [{ key: "cook:order", t0: 0 }, { key: "cook:station1:marble", t0: 1500 }];
  assert.equal(run(check74, { flow: "cook:chai-tray" }, [life(1200, "order-skip", 200, "left:0")], segs).length, 0);
  assert.equal(run(check74, { flow: "cook:chai-tray" }, [life(1200, "order-skip", 200, "left:2")], segs).length, 1);
  assert.equal(run(check74, { flow: "cook:chai-tray" }, [life(2200, "order-skip", 1200, "left:0")], [{ key: "cook:station1:marble", t0: 2300 }]).length >= 1, true);
  assert.equal(run(check74, { flow: "cook:chai-tray" }, [life(1200, "order-skip", 200, "left:0")], [{ key: "cook:station1:marble", t0: 3000 }]).length, 1);
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
test("contract-72 (s14-rules): the row's way back to its first card after the order is a row-home note: any length, never a jump", () => {
  assert.equal(run(check72, [life(10, "row-home", 400, "card:130 smooth")]).length, 0);
  assert.equal(run(check72, [life(10, "row-home", 400, "card:130")]).length, 1);
});

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

test("contract-77: the first-time hold: never a returning player's, always ended by the tap", () => {
  const hold = [life(10, "timed-hold", "start", "nana 0.76"), life(900, "timed-hold", "end", "nana 0.76 890ms")];
  assert.equal(run(check77, { flow: "cook:chai-tray" }, hold).length, 0);
  assert.equal(run(check77, { flow: "cook:chai-tray#returning" }, hold).length, 1);
  assert.equal(run(check77, { flow: "cook:chai-tray" }, hold.slice(0, 1)).length, 1);
  assert.equal(run(check77, { flow: "cook:chai-tray" }, []).length, 0);
});
