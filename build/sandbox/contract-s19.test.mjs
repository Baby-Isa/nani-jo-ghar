// Sprint 19 part 1 (s19-checks): contract-100 to -109, the shared pieces present, each red then green on a synthetic timeline (the
// failure it guards, then the agreed end state), and the probe's registration. No browser. Run: node --test build/sandbox/contract-s19.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { NOT_A_THING, S19_HOOK, S19_CHECKS, checkS19, check100, check101, check102, check103, check104, check105, check106, check107, check108, check109, stations } from "./lib/contract-s19.mjs";
import { CHECKS } from "./lib/contract.mjs";
import { CONTRACT_HOOK } from "./lib/contract-hook.mjs";
import { CONTRACT_ROWS } from "../tools/review/lib/regressions.mjs";

const run = (fn, ...a) => { const out = []; fn(...a, (id, t, msg) => out.push({ id, t, msg })); return out; };
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const R = { flow: "cook:maani-line" };
const ST = [c(0, "stage", { key: "cook:station1:maani" }), c(60000, "stage", { key: "cook:between1:-" })];
const life = (t, what, step) => c(t, "life", { what, reason: step || "", step: step || "", at: t });

test("contract-100 to -109 are registered, numbered and mapped to the rows they guard", () => {
  for (let n = 100; n <= 109; n++) {
    assert.ok(CHECKS[`contract-${n}`], `contract-${n} in CHECKS`);
    assert.ok(S19_CHECKS[`contract-${n}`].how.length > 80);
    assert.ok(Object.keys(CONTRACT_ROWS).some((k) => k.startsWith(`contract-${n} `)), `contract-${n} names its rows in CONTRACT_ROWS`);
  }
  assert.match(CONTRACT_HOOK, /__njgS19Hook/);
  assert.doesNotThrow(() => new Function(CONTRACT_HOOK));
  assert.deepEqual(stations(ST).map((s) => [s.t0, s.t1]), [[0, 60000]]);
});

test("the S17, S19 and S19b probes all start: each is its own statement (s19-checks found S19 silently never ran)", () => {
  // two IIFEs on adjacent lines with no ";" between call the first one's result with the second: the second probe never ran
  const tail = CONTRACT_HOOK.slice(CONTRACT_HOOK.indexOf("(function s17hook"));
  const w = { };
  const doc = { documentElement: {}, addEventListener() {}, querySelectorAll: () => [], querySelector: () => null };
  const fn = new Function("window", "document", "location", "setInterval", "MutationObserver", "getComputedStyle", "setTimeout", tail);
  fn(w, doc, { pathname: "/cook.html" }, () => 0, class { observe() {} }, () => ({}), () => 0);
  assert.equal(w.__njgS17Hook, true);
  assert.equal(w.__njgS19Hook, true);
  assert.equal(w.__njgS19bHook, true, "the s19-checks-2 probe (contract-114 to -116, the screen rewrites)");
});

test("contract-100: the old card (count box, strip, old item) or the old type is a break; the 6 Nov card passes", () => {
  const red = [...ST, c(1000, "s19card", { cards: 2, lora: false, old: [".oc-item", ".oc-box"], pics: [] })];
  const out = run(check100, R, red);
  assert.equal(out.length, 3);
  assert.match(out[0].msg, /old type/);
  assert.match(out[2].msg, /\.oc-box/);
  const green = [...ST, c(1000, "s19card", { cards: 2, lora: true, old: [], pics: [] })];
  assert.equal(run(check100, R, green).length, 0);
  // outside a station (the counter's pop-up before the kitchen) and on a clinic flow: not judged here
  assert.equal(run(check100, R, [c(1000, "s19card", { cards: 1, lora: false, old: [".oc-strip"] }), c(1500, "s19card", { cards: 0, lora: false, old: [] }), c(2000, "stage", { key: "cook:station1:maani" })]).length, 0);
  assert.equal(run(check100, { flow: "clinic:waiting" }, red).length, 0);
});

test("contract-101: no drop-down in a station, the old box, or a line wrapped that fits one line is a break", () => {
  const open = life(2000, "step-open", "maani:roll");
  const noArrow = [...ST, open, c(1500, "s19guide", { shown: true, s14: true, arrow: false, lines: 1, fits1: true })];
  assert.match(run(check101, R, noArrow)[0].msg, /never showed its drop-down/);
  const oldBox = [...ST, open, c(1500, "s19guide", { shown: true, s14: false, arrow: false, lines: 1 })];
  assert.match(run(check101, R, oldBox)[0].msg, /not the kit's s14 box/);
  const wrapped = [...ST, open, c(1500, "s19guide", { shown: true, s14: true, arrow: true, lines: 2, fits1: true, text: "hakri lakri mishkaki", room: 210, need: 180, floor: 14 }), c(3000, "s19guide", { shown: true, s14: true, arrow: true, lines: 1, fits1: true })];
  assert.match(run(check101, R, wrapped)[0].msg, /on 2 lines though it fits one line/);
  const green = [...ST, open, c(1500, "s19guide", { shown: true, s14: true, arrow: false, lines: 1, fits1: true }), c(2500, "s19guide", { shown: true, s14: true, arrow: true, lines: 2, fits1: false })];
  // a grey to-record English line is going away (Zafar, 6 Nov, SH-224): chai's "Pour it into their glass." is not judged
  assert.equal(run(check101, R, [...ST, open, c(1500, "s19guide", { shown: true, s14: true, arrow: true, lines: 2, fits1: true, rec: true, text: "Pour it into their glass." }), c(3000, "s19guide", { shown: false })]).length, 0);
  // her line at the counter, before the kitchen, is not judged (SH-240 is the hint in play)
  assert.equal(run(check101, R, [c(100, "s19guide", { shown: true, s14: true, arrow: true, lines: 2, fits1: true, text: "Cook it the way they said." }), c(900, "s19guide", { shown: false }), c(1000, "stage", { key: "cook:station1:maani" })]).length, 0);
  assert.equal(run(check101, R, green).length, 0);
});

test("contract-102: the game's own ghost finger, or a glow outside the kit's light, is a break; the kit's finger and a glow in its light pass", () => {
  const red = [...ST, c(3000, "s19ghost", { step: "maani-tap", gesture: "tap", game: true, at: 3000 }), c(4000, "s19lit", { holes: [] }), c(4000, "s19glow", { list: [{ key: "tawa", bounce: false, box: [500, 200, 700, 330] }] }), c(5000, "s19glow", { list: [] })];
  const out = run(check102, R, red);
  assert.equal(out.length, 2);
  assert.match(out[0].msg, /its own ghost finger \(maani-tap/);
  assert.match(out[1].msg, /tawa glows .* outside the kit's light \(no light up\)/);
  // the kit's own pan ring glowing at its window (chai L4, kit-pan-ring-158) is the kit's
  assert.equal(run(check102, R, [...ST, c(4000, "s19lit", { holes: [[496, 333, 556, 393]] }), c(4000, "s19glow", { list: [{ key: "kit-pan-ring-158", bounce: false, box: [430, 174, 554, 298] }] }), c(5000, "s19glow", { list: [] })]).length, 0);
  const green = [...ST, c(3000, "s19ghost", { step: "chai:s14", gesture: "tap", game: false, at: 3000 }), c(4000, "s19lit", { holes: [[90, 500, 210, 640]] }), c(4000, "s19glow", { list: [{ key: "jar-paani", bounce: true, box: [100, 510, 200, 600] }] }), c(5000, "s19glow", { list: [] })];
  assert.equal(run(check102, R, green).length, 0);
});

test("contract-103: a tick, next or close button while a station plays is a break; none passes", () => {
  const red = [...ST, c(9000, "s19btn", { list: [{ sel: "button#done-btn", kind: "tick", text: "✓" }, { sel: "button.njg-close", kind: "close", text: "×" }] })];
  const out = run(check103, R, red);
  assert.equal(out.length, 2);
  assert.match(out[0].msg, /tick button/);
  assert.match(out[1].msg, /close button/);
  assert.equal(run(check103, R, [...ST, c(9000, "s19btn", { list: [] })]).length, 0);
  // the end screen's buttons come after the station: not judged
  assert.equal(run(check103, R, [...ST, c(70000, "s19btn", { list: [{ sel: "button.njg-next", kind: "next" }] })]).length, 0);
});

test("contract-104: a blank picture or the shelf's crate on an item card is a break; one of the thing passes", () => {
  const red = [...ST, c(1000, "s19card", { cards: 1, lora: true, old: [], pics: [{ word: "dungri", src: "assets/cook/items/v3/daar/chop-heap-onion.webp", ok: true }, { word: "tarelo indo", src: "", ok: false }] })];
  const out = run(check104, R, red);
  assert.equal(out.length, 2);
  assert.match(out[0].msg, /shelf's heap/);
  assert.match(out[1].msg, /has no picture/);
  const green = [...ST, c(1000, "s19card", { cards: 1, lora: true, old: [], pics: [{ word: "dungri", src: "assets/cook/items/v3/daar/onion-one.webp", ok: true }, { word: "hakro cup atto", src: "assets/cook/items/shelf-cook-atto-bare-f.webp", ok: false, hidden: true }] }), c(3000, "s19card", { cards: 0, pics: [] })];
  // chai L3, 8 Nov: the second card drawn again, its pictures loading for 300 ms, is not blank; one still not in after 600 ms is
  const redraw = (ok) => c(30400, "s19card", { cards: 2, lora: true, old: [], pics: [{ word: "paani", src: "assets/cook/items/shelf-cook-paani-bare-f.webp", ok }] });
  assert.equal(run(check104, R, [...ST, redraw(false), c(30700, "s19card", { cards: 2, lora: true, old: [], pics: [{ word: "paani", src: "assets/cook/items/shelf-cook-paani-bare-f.webp", ok: true }] })]).length, 0);
  assert.match(run(check104, R, [...ST, redraw(false), c(31200, "s19card", { cards: 2, lora: true, old: [], pics: [{ word: "paani", src: "assets/cook/items/shelf-cook-paani-bare-f.webp", ok: true }] })])[0].msg, /did not load/);
  assert.equal(run(check104, R, green).length, 0);
});

test("contract-105: CK-63, the light half on the pan's handle and off its middle, is a break; a light whole and centred passes", () => {
  // eggs' pan: body 400-520 x 300-420 with its handle to 600; the light 470-560 (half on the handle, too small)
  const pan = { kind: "pic", id: "eggs-pan", box: [400, 300, 600, 420] };
  const red = [...ST, c(1000, "s19lit", { holes: [[470, 320, 560, 400]], things: [pan], near: [], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [], things: [] })];
  assert.match(run(check105, R, red)[0].msg, /round \d+% of eggs-pan/);
  const green = [...ST, c(1000, "s19lit", { holes: [[396, 296, 604, 424]], things: [pan], near: [], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [], things: [] })];
  assert.equal(run(check105, R, green).length, 0);
  // a shelf item and its pill: poking out of its light, or its light off the middle, is a break
  const jar = { kind: "word", id: "cook-paani", box: [100, 500, 200, 640], shelf: true };
  const poke = [...ST, c(1000, "s19lit", { holes: [[96, 496, 204, 600]], things: [jar], near: [], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [] })];
  assert.match(run(check105, R, poke)[0].msg, /pokes out at the bottom/);
  const off = [...ST, c(1000, "s19lit", { holes: [[90, 496, 220, 644]], things: [jar], near: [], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [] })];
  assert.match(run(check105, R, off)[0].msg, /off the middle of cook-paani \[100,500,200,640\] by 5, 0 px/);
  // ... unless it stops short of a neighbour on that side (contract-92's rule)
  const short = [...ST, c(1000, "s19lit", { holes: [[90, 496, 202, 644]], things: [jar], near: [[204, 500, 300, 640]], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [] })];
  assert.equal(run(check105, R, short).length, 0);
  // a light over the whole side panel round one item card frames a region (maani's card light, 8 Nov smoke run)
  const card = { kind: "card", id: "card:hakri maani", box: [142, 152, 258, 347] };
  const region = [...ST, c(1000, "s19lit", { holes: [[1, 73, 351, 376]], things: [card], near: [], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [] })];
  assert.match(run(check105, R, region)[0].msg, /frames a region 4\.\d times the size of card:hakri maani/);
  // samosa L3, 8 Nov: a light on the dotted part of an item card (under half of it) is contract-97's
  const chunda = { kind: "card", id: "card:trae chunda", box: [19, 208, 134, 388] };
  assert.equal(run(check105, R, [...ST, c(1000, "s19lit", { holes: [[32, 283, 122, 344]], things: [chunda], near: [], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [] })]).length, 0);
  // chai at 1920x1080: the light round the water bottle holds its hop's room above it (7 px off the middle, the bottle 214 px tall)
  const paani = { kind: "word", id: "cook-paani", box: [746, 850, 852, 1064], shelf: true };
  assert.equal(run(check105, R, [...ST, c(1000, "s19lit", { holes: [[733, 821, 865, 1078]], things: [paani], near: [], vw: 1920, vh: 1080 }), c(2000, "s19lit", { holes: [] })]).length, 0);
  const ok = [...ST, c(1000, "s19lit", { holes: [[94, 494, 206, 646]], things: [jar], near: [], vw: 1280, vh: 665 }), c(2000, "s19lit", { holes: [] })];
  assert.equal(run(check105, R, ok).length, 0);
});

test("contract-106: SH-236, the light staying round the press as the roll starts, is a break; gone within 300 ms passes", () => {
  const hole = [[500, 200, 700, 400]];
  const red = [...ST, c(1000, "s19lit", { holes: hole }), c(2000, "input", { x: 600, y: 300 }), c(4200, "s19lit", { holes: [] })];
  assert.match(run(check106, R, red)[0].msg, /stayed round the child's press .* for 2200 ms/);
  const green = [...ST, c(1000, "s19lit", { holes: hole }), c(2000, "input", { x: 600, y: 300 }), c(2250, "s19lit", { holes: [] })];
  assert.equal(run(check106, R, green).length, 0);
  // a press outside the light (blocked) is not the move
  assert.equal(run(check106, R, [...ST, c(1000, "s19lit", { holes: hole }), c(2000, "input", { x: 50, y: 50 })]).length, 0);
});

test("contract-107: SH-237, a pan hopping off the shelf or a lit shelf item standing still, is a break; a shelf item's hop passes", () => {
  const cv = [0, 0, 1280, 665];
  const red = [...ST, c(1000, "s19glow", { canvas: cv, list: [{ key: "tawa", bounce: true, box: [500, 200, 700, 330] }] })];
  assert.match(run(check107, R, red)[0].msg, /tawa hops when lit, off the shelf/);
  const still = [...ST, c(1000, "s19lit", { holes: [[96, 496, 204, 644]], things: [{ kind: "word", id: "cook-paani", box: [100, 500, 200, 640], shelf: true }], vh: 665 }), c(1000, "s19glow", { canvas: cv, list: [] }), c(2000, "s19lit", { holes: [] })];
  assert.match(run(check107, R, still)[0].msg, /lit .* without its hop/);
  const green = [...ST, c(1000, "s19lit", { holes: [[96, 496, 204, 644]], things: [{ kind: "word", id: "cook-paani", box: [100, 500, 200, 640], shelf: true }], vh: 665 }), c(1000, "s19glow", { canvas: cv, list: [{ key: "jar-paani", bounce: true, box: [100, 500, 200, 600] }] }), c(2000, "s19lit", { holes: [] })];
  assert.equal(run(check107, R, green).length, 0);
});

test("contract-108: SH-239, well done with a row still open, is a break; well done after the last tick passes", () => {
  const rows = (t, done) => c(t, "rows", { list: [{ id: "a", text: "hakri maani", done: true }, { id: "b", text: "hakri bajr ji maani", done }] });
  const v = { lines: [{ text: "Shabash!", t0: 5000, who: "nani" }] };
  assert.match(run(check108, R, [...ST, rows(4000, false)], v)[0].msg, /1 card row still open/);
  assert.equal(run(check108, R, [...ST, rows(4000, true)], v).length, 0);
});

test("contract-109: SH-243, an item off the shelf's base line or a pill off the chip line, is a break; one line passes", () => {
  const items = (d, p) => [{ id: "a", foot: 600, chip: 640 }, { id: "b", foot: 600 + d, chip: 640 + p }, { id: "c", foot: 601, chip: 640 }];
  // (a shelf sample stands until the next one: here to the station's end)
  const at = (e) => [ST[0], e, ST[1]];
  assert.match(run(check109, R, at(c(1000, "s19shelf", { items: items(12, 0) })))[0].msg, /stands 11 px off the base line/);
  assert.match(run(check109, R, at(c(1000, "s19shelf", { items: items(0, 6) })))[0].msg, /6 px off the chip line/);
  assert.equal(run(check109, R, at(c(1000, "s19shelf", { items: items(2, 1) }))).length, 0);
  // s19-checks-1, the probe fault (s19-wave-d, baking#mistake): a thing turned by the wrong-pick wiggle, or a shelf seen for a moment, is not the line
  const turned = [{ id: "a", foot: 600, chip: 640 }, { id: "b", foot: 614, chip: 640, rot: 1 }, { id: "c", foot: 601, chip: 640 }, { id: "d", foot: 600, chip: 640 }];
  assert.equal(run(check109, R, at(c(1000, "s19shelf", { items: turned }))).length, 0);
  assert.equal(run(check109, R, [ST[0], c(1000, "s19shelf", { items: items(12, 0) }), c(1100, "s19shelf", { items: items(0, 0) }), ST[1]]).length, 0);
});

test("checkS19 runs every check on one timeline", () => {
  const out = [];
  checkS19(R, [...ST, c(9000, "s19btn", { list: [{ sel: "button#done-btn", kind: "tick" }] })], { lines: [] }, (id) => out.push(id));
  assert.deepEqual(out, ["contract-103"]);
});

test("contract-105's scan never takes a shadow, halo, glow, dim or light picture for the lit thing (the final run judged two lights against a pan's shadow)", () => {
  for (const k of ["shadow", "eg-pan-shadow", "kit-halo", "__glow:x", "plate-cream:shade:8"]) assert.ok(NOT_A_THING.test(k) || /^__/.test(k), k);
  for (const k of ["eg-pan-dry", "mv-velan", "kit-pan-ring-158", "sv3-fold-strip"]) assert.ok(!NOT_A_THING.test(k), k);
  assert.match(S19_HOOK, /!\/shadow\|shade\|halo\|glow\|dim\|light\/i\.test\(o\.texture\.key\)/);
});
