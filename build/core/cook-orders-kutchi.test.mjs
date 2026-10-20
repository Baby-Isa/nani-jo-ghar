// s08 w6a (LNG-17, PAN-16): the orders say no English, and a line is said once.
//   1. LNG-17 (judges, 19 Oct; non-negotiable 5): every order Cook can give (every recipe, L1-L4, every customer, eight seeds)
//      is built from lexicon words only: no English join ("with", "and": the engine's WithFood / AndKind gaps, Mum's Q5) and
//      no plural the lexicon lacks ("tomatoes": n.tomato's plural is Q14). The join is left out (the row said bare) or the
//      engine's confirmed list frame says it ("Ne ba samosa, ..."); the tomato count stays one until the plural is in.
//   2. PAN-16 / contract-22: Lang.speak (js/cook/words.js, the one speech queue) says a line once; the same line again only
//      after 10 s of the child's time, unless the child asked, another person says it in the same pop-up, it is a step's call,
//      or a stop cleared it before it began.
// Run: node --test build/core/cook-orders-kutchi.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCookEngine } from "../test_cook_harness.mjs";
import { createVoice } from "../../js/core/voice.js";

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
const segsOf = (l) => (l.parts && l.parts.length ? l.parts.flatMap(segsOf) : l.segs || []);

test("LNG-17: every order is said in Kutchi: no English join, no 'tomatoes'", async () => {
  const bad = [];
  let n = 0;
  for (const seed of SEEDS) {
    const { Cook } = await loadCookEngine({ seed });
    const D = Cook.data;
    for (const id of Object.keys(D.recipes).filter((x) => x[0] !== "_" && x !== "pantry"))
      for (const level of [1, 2, 3, 4])
        for (const who of Object.keys(D.customers)) {
          const L = Cook.Order.ladder(Cook.Recipes[id].make(who, { level }), 0);
          // the whole order as the game says it, the sections said later at their station too (the chai tray's cups, the
          // tadka); the stir section is left out: its count is Nani's own line at the stir (the engine's Times gap, DAAR-26, Mum's list)
          const line = Cook.Order.speech([Object.assign({}, L, { sections: L.sections.filter((s) => s.when !== "stir") })], { withWhen: true });
          n++;
          const text = Cook.Lang.plain(line);
          if (segsOf(line).some((s) => s.lang === "e") || /\b(with|and|tomatoes)\b/i.test(text)) bad.push(`${id} L${level} ${who} seed ${seed}: ${text}`);
        }
  }
  assert.deepEqual(bad.slice(0, 8), [], `${bad.length} of ${n} orders say English`);
  assert.ok(n > 500, `orders checked: ${n}`);
});

test("LNG-17: the join is left out, the second kind says 'ne', a single tomato is 'hakro tameto'", async () => {
  const { Cook } = await loadCookEngine({ seed: 3 });
  const L = Cook.Lang;
  const row = (parts) => ({ parts, ids: parts.filter((p) => typeof p === "string"), phrase: L.phrase(parts) });
  const head = { ids: ["cook-chai"], line: L.line("need", L.phrase(["cook-chai"])) };
  assert.equal(L.plain(Cook.Order.sentence(head, [row(["cook-dudh"]), row([3, "cook-khun"])], { join: "with" })), "Muke chai khape, dudh, trae khun.");
  assert.equal(L.plain(L.phrase([1, "veg-03"])), "hakro tameto");
  // the plural is still the engine's gap (Q14): never asked for, and never invented here
  assert.equal(L.phrase([2, "veg-03"]).ok, false);
  for (const id of ["daal", "chaat"]) {
    const t = Cook.data.recipes[id].slots.tomatoes;
    const ranges = t.byLevel ? t.byLevel.map((x) => x.int) : [t.int];
    ranges.forEach((r) => assert.ok(r[1] <= 1, `${id}: at most one tomato until the plural is in the lexicon (${JSON.stringify(r)})`));
  }
});

async function speaker() {
  const { Cook, win } = await loadCookEngine({ seed: 1 });
  const played = [];
  let hold = null; // a clip that is still sounding until released (a line cut part-way)
  const player = {
    play: (u) => (played.push(u), hold ? new Promise((r) => (hold = r)) : Promise.resolve(true)),
    stop() {},
    synth: async (t) => (played.push(`device:${t}`), true),
  };
  Cook.core = { voice: createVoice({ index: null, player, path: "test", phrases: false, gapMs: 0 }) };
  Cook.speed = 1;
  let now = 1e6;
  const realNow = Date.now;
  const clock = { set: (t) => (now = t), add: (ms) => (now += ms), restore: () => (Date.now = realNow) };
  Date.now = () => now;
  return { Cook, win, played, clock, holdNext: () => (hold = true), release: () => typeof hold === "function" && (hold(true), (hold = null)) };
}

test("PAN-16: a line is said once; again only after 10 s of the child's time", async () => {
  const { Cook, played, clock } = await speaker();
  try {
    const L = Cook.Lang;
    const line = () => L.line("then", L.phrase(["veg-12"])); // "Ne poi mirchi."
    assert.equal(await L.speak(line()), true);
    const once = played.length;
    assert.ok(once > 0);
    clock.add(2000);
    // every caller asks Lang.hasVoice before it says a line: false now, so it shows the line without saying it again
    assert.equal(L.hasVoice(line()), false, "not to be voiced again 2 s later");
    assert.equal(L.voiced(line()), true, "it can still be heard (a speaker button, a replay)");
    assert.equal(await L.speak(line()), false, "said again 2 s later");
    assert.equal(played.length, once, "nothing played the second time");
    clock.add(8100);
    assert.equal(await L.speak(line()), true, "said again after 10 s");
    // the test speed shortens the wait as it shortens every wait (10 s / speed)
    Cook.speed = 3;
    clock.add(3500);
    assert.equal(await L.speak(line()), true, "10 s of the child's time at speed 3 is 3.3 s");
    // a step's call keeps its own rule (maani's Firai on both turns, MAA-15); a count and a word tapped to hear are free
    clock.add(100);
    assert.equal(await L.speak(L.role(line(), "call")), true);
    assert.equal(await L.speak(L.role(line(), "hear")), true);
    assert.equal(await L.speak(line(), { kind: "count" }), true);
  } finally {
    clock.restore();
  }
});

test("PAN-16: two people in one pop-up may say the same; a later pop-up may not; a line a stop cleared before it began may", async () => {
  const { Cook, win, clock, holdNext, release } = await speaker();
  try {
    const L = Cook.Lang;
    const order = () => L.line("need", L.phrase(["cook-chai"]));
    let serial = 4;
    let card = { who: "nana" };
    win.Lifecycle = { serial: () => serial, isOpen: () => serial > 0 };
    win.document = { querySelector: (sel) => (/\.speaking/.test(sel) ? card : null) };
    assert.equal(await L.speak(order()), true);
    clock.add(900);
    card = { who: "ma" };
    assert.equal(await L.speak(order()), true, "the second person's own card, in the same pop-up");
    card = null;
    clock.add(300);
    assert.equal(await L.speak(order()), false, "the same pop-up, but no one's card being read: the station's own line again");
    serial = 5;
    clock.add(900);
    assert.equal(await L.speak(order()), false, "the order again in the next pop-up (the reveal) is a repeat");
    serial = 0;
    // a tap through the pop-up: the line being said is cut (heard as far as the child wanted: not said again); the line
    // waiting its turn behind it never began, so it may be said later
    const a = () => L.line("then", L.phrase(["veg-02"]));
    const b = () => L.line("then", L.phrase(["cook-maani"]));
    holdNext();
    const pa = L.speak(a());
    const pb = L.speak(b());
    await new Promise((r) => setTimeout(r, 5));
    Cook.core.voice.stop("cook");
    release();
    await Promise.all([pa, pb]);
    clock.add(500);
    assert.equal(await L.speak(a()), false, "the line cut part-way is not said again at once");
    assert.equal(await L.speak(b()), true, "the line that never began is said");
  } finally {
    clock.restore();
  }
});
