// s19-clean-a6: the check lines from chai's report (build/reports/s19-clean-chai.md, "For s19-clean-a4") and contract-115's floor
// (Zafar, 12 Nov: 60% of the room; chai's hob is 65%). Each change has its red and its green here; the bad runs stay red
// (build/sandbox/badruns.test.mjs). Run: node --test build/sandbox/s19-clean-a6.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { check36, CALL_BEFORE, check73, check115, MAIN_ROOM } from "./lib/contract-s19b.mjs";
import { check102, check107, LATE_LIGHT_MS } from "./lib/contract-s19.mjs";

const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const collect = (f) => { const out = []; f((id, t, msg) => out.push({ id, t, msg })); return out; };
const ST = [c(0, "stage", { key: "cook:station1:chai" }), c(60000, "stage", { key: "cook:between1:-" })];

// ---- contract-36: the game's own skip may come as early as a call may (CALL_BEFORE), not only 1 s before ----
test("contract-36: a skip logged up to CALL_BEFORE before the step is its call's skip (green); none, or one far earlier, is red", () => {
  const lit = c(10000, "s19lit", { holes: [[100, 100, 200, 200]], things: [{ kind: "pic", id: "s14-pan", box: [110, 110, 190, 190] }] });
  const skip = (t) => c(t, "life", { what: "step-call", by: "skip: no voiced line" });
  const run = (tl) => collect((add) => check36({ flow: "cook:chai-tray" }, tl, [], { lines: [] }, add));
  assert.equal(CALL_BEFORE, 2000);
  assert.equal(run([...ST, lit, c(20000, "x")]).length, 1, "no call, no skip: red");
  assert.equal(run([...ST, skip(10000 - 1500), lit, c(20000, "x")]).length, 0, "the skip 1.5 s before its light (it was red at 1 s): green");
  assert.equal(run([...ST, skip(10000 - CALL_BEFORE - 500), lit, c(20000, "x")]).length, 1, "a skip 2.5 s before is another step's: red");
  // each skip stands for one step: one before the step before is that step's (the bad run's maani chakla: the skip 1.8 s before its light,
  // no other step between, is its own)
  const lit2 = c(8800, "s19lit", { holes: [[600, 100, 700, 200]], things: [{ kind: "pic", id: "s14-jar", box: [610, 110, 690, 190] }] });
  const lit3 = c(10000, "s19lit", { holes: [[100, 100, 200, 200]], things: [{ kind: "pic", id: "s14-pan", box: [110, 110, 190, 190] }] });
  assert.equal(run([...ST, skip(8500), lit2, lit3, c(20000, "x")]).length, 1, "one skip, two steps: the second is red");
  assert.equal(run([...ST, skip(8500), lit2, skip(9200), lit3, c(20000, "x")]).length, 0, "a skip each: green");
});

// ---- contract-102: a glow that starts with its rung belongs to the light even when the light box is painted late ----
const glowAt = (t, key = "ch-milk", bx = [400, 300, 460, 380], bounce = false) => c(t, "s19glow", { canvas: [0, 0, 1280, 665], list: [{ key, box: bx, bounce }] });
const litAt = (t, holes, things = []) => c(t, "s19lit", { holes, things });
const rungAt = (t) => c(t, "life", { what: "rung", step: "milk", rung: 1, light: true });
// (the probe samples a glow when it changes: one sample as it starts, an empty one as it goes)
const glowRun = (t0, t1) => [glowAt(t0), c(t1, "s19glow", { canvas: [0, 0, 1280, 665], list: [] })];
test("contract-102: a glow with its rung, its light box painted 1.3 s late round it, is the light's (green)", () => {
  const run = (tl) => collect((add) => check102({ flow: "cook:chai-tray" }, tl, add));
  const late = [...ST, litAt(900, []), rungAt(1000), ...glowRun(1000, 3000), litAt(2300, [[390, 290, 470, 390]]), c(9000, "x")];
  assert.equal(run(late).length, 0, "late box round the glow: green");
  // red: no rung (the game's own glow), the box elsewhere, or the box far too late
  const noRung = [...ST, litAt(900, []), ...glowRun(1000, 3000), litAt(2300, [[390, 290, 470, 390]]), c(9000, "x")];
  assert.equal(run(noRung).length, 1, "no rung: the game's own glow, red");
  const elsewhere = [...ST, litAt(900, []), rungAt(1000), ...glowRun(1000, 3000), litAt(2300, [[900, 290, 980, 390]]), c(9000, "x")];
  assert.equal(run(elsewhere).length, 1, "the light frames something else: red");
  const tooLate = [...ST, litAt(900, []), rungAt(1000), ...glowRun(1000, 5000), litAt(1000 + LATE_LIGHT_MS + 800, [[390, 290, 470, 390]]), c(9000, "x")];
  assert.equal(run(tooLate).length, 1, "the box past LATE_LIGHT_MS: red");
});

// ---- contract-107: a shelf item's hop that started with its rung counts for the light painted late ----
test("contract-107: the hop with the rung counts for a late light box (green); a lit shelf item that never hopped is red", () => {
  const run = (tl) => collect((add) => check107({ flow: "cook:chai-tray" }, tl, add));
  const th = [{ kind: "word", id: "milk", shelf: 1, box: [400, 500, 460, 600] }];
  const hops = [500, 600, 700, 800, 900].map((t) => glowAt(t + 600, "ch-milk", [400, 500, 460, 600], true));
  const late = [...ST, rungAt(1000), ...hops, glowAt(1700, "ch-milk", [400, 500, 460, 600], false), c(2300, "s19lit", { holes: [[390, 490, 470, 610]], things: th, vh: 1 }), c(9000, "x")];
  assert.equal(run(late).length, 0, "the hop with its rung, the box 1.3 s later: green");
  const still = [...ST, rungAt(1000), glowAt(1700, "ch-milk", [400, 500, 460, 600], false), c(2300, "s19lit", { holes: [[390, 490, 470, 610]], things: th, vh: 1 }), c(9000, "x")];
  assert.equal(run(still).length, 1, "never hopped: red");
  const oldHop = [...ST, rungAt(1000), glowAt(1000 - LATE_LIGHT_MS - 900, "ch-milk", [400, 500, 460, 600], true), c(2300, "s19lit", { holes: [[390, 490, 470, 610]], things: th, vh: 1 }), c(9000, "x")];
  assert.equal(run(oldHop).length, 1, "a hop long before the rung: red");
});

// ---- contract-73: the conversation speaker's tap is its box grown by its ::before (CHAI-104: 47 px drawn, a 48 px tap) ----
test("contract-73: a 47 px speaker whose ::before makes a 48 px tap is green; a 47 px tap is red; the probe measures the pseudo-element", () => {
  const run = (list) => collect((add) => check73({ flow: "cook:chai-tray" }, [c(1000, "s19spk", { list }), c(5000, "x")], add));
  const spk = (tap) => ({ cls: "cv-spk", box: [100, 100, 147, 147], tap, text: "Salaam" });
  assert.equal(run([spk([99.5, 99.5, 147.5, 147.5])]).length, 0, "the ::before's 48 px: green");
  assert.equal(run([spk(null)]).length, 1, "no ::before (the old sample): 47 px, red");
  assert.equal(run([spk([100, 100, 147, 147])]).length, 1, "a ::before no bigger: red");
  const hook = readFileSync(new URL("./lib/contract-s19b-hook.mjs", import.meta.url), "utf8");
  assert.match(hook, /getComputedStyle\(sp, ps\)/, "the probe reads the speaker's ::before and ::after");
});

// ---- contract-113: no canvas pair judged while the wrong-order card is open (its veil holds the kitchen) ----
test("contract-113: the probe skips the canvas pairs under .njg-wo-open, and still judges the page's covers", () => {
  const src = readFileSync(new URL("./lib/contract-s19.mjs", import.meta.url), "utf8");
  assert.match(src, /const woOpen = \[\.\.\.document\.querySelectorAll\("\.njg-wo-open"\)\]/);
  assert.match(src, /if \(g && !woOpen\) \{/);
  assert.match(src, /for \(const tx of document\.querySelectorAll\("\.wc14-k, \.wc14-en/, "the card words' covers are judged outside the gate");
});

// ---- contract-115: the main thing's floor is 60% of the room (Zafar, 12 Nov: chai's hob is 65%) ----
test("contract-115: the main thing at 65% of the room (chai's hob) is green, at 55% red", () => {
  assert.equal(MAIN_ROOM, 0.6);
  // a 1280x665 canvas: the band the bottom 30%, the room above it 465.5 px
  // (the s19it sample: the canvas box, and each picture [id, key, l, t, r, b, alpha%, ...])
  const scene = (h) => [c(0, "stage", { key: "cook:station1:chai" }), c(100, "s19it", { cv: [0, 0, 1280, 665], ch: [[1, "s14-hob", 300, 460 - h, 700, 460, 100]] }), c(60000, "stage", { key: "cook:between1:-" })];
  const run = (tl) => collect((add) => check115({ flow: "cook:chai-tray", size: "1280x665" }, tl, add, { root: new URL("../..", import.meta.url).pathname }));
  const room = 0.7 * 665;
  assert.equal(run(scene(0.65 * room)).length, 0, "65%: green");
  const red = run(scene(0.55 * room));
  assert.equal(red.length, 1, "55%: red");
  assert.match(red[0].msg, /under the 60% floor, flagged for a look/);
});

// ---- contract-123 (SH-248): each kitchen game draws the band its settings name, through the kit ----
import { check123, bandSetting, flowGame } from "./lib/contract-shade.mjs";
import { CHECKS } from "./lib/contract.mjs";
test("contract-123: the band drawn is the one the game's settings name; none drawn, or a band with no game, is red", () => {
  assert.ok(CHECKS["contract-123"]);
  assert.equal(bandSetting("chai-tray"), "shelf");
  assert.equal(bandSetting("chaat"), "tray");
  assert.equal(flowGame("cook:maani-line@L3#speed1"), "maani-line");
  const run = (flow, tl) => collect((add) => check123({ flow }, tl, add));
  const stage = c(100, "stage", { key: "cook:station1:marble" });
  const band = (game, by) => c(200, "life", { what: "band", step: game, by, at: 200 });
  assert.equal(run("cook:chai-tray", [stage, band("chai-tray", "shelf named shelf"), c(9000, "x")]).length, 0, "chai's shelf: green");
  assert.equal(run("cook:samosa@L2", [stage, band("samosa", "tray named tray"), c(9000, "x")]).length, 0, "samosa's tray: green");
  assert.equal(run("cook:samosa", [stage, band("samosa", "shelf named tray"), c(9000, "x")]).length, 1, "the tray named, the shelf drawn (the kit's tray not ready): red");
  assert.equal(run("cook:baking", [stage, c(9000, "x")]).length, 1, "a game with a band in its settings drew none (its own counter): red");
  assert.equal(run("cook:corn", [stage, band("", "tray named none"), c(9000, "x")]).length, 1, "a band with no game's key: red");
  assert.equal(run("cook:fetch", [stage, c(9000, "x")]).length, 0, "the pantry names no band (its painted shelves, PAN-06): not judged");
  const src = readFileSync(new URL("../../js/cook/kitchen-kit.js", import.meta.url), "utf8");
  assert.match(src, /Lifecycle\.note\("band", \{ step: game \|\| "", by: `\$\{kitTray \? "tray" : "shelf"\} named/, "the kit logs the band it drew");
});

// ---- contract-106: the light's frame-timed sample (the S14 hook's "lit") counts, not only the 100 ms s19lit (lags 0.5 s under load) ----
import { check106 } from "./lib/contract-s19.mjs";
test("contract-106: a light gone at once by its frame-timed sample is green though s19lit lags; a light that stays in both is red", () => {
  const run = (tl) => collect((add) => check106({ flow: "cook:daar@L2" }, tl, add));
  const A = [[369, 19, 651, 278]], B = [[369, 273, 651, 382]];
  const press = c(38900, "input", { x: 510, y: 149 });
  const lag = [...ST, c(38000, "s19lit", { holes: A }), press, c(38950, "lit", { holes: B }), c(39520, "s19lit", { holes: B }), c(45000, "x")];
  assert.equal(run(lag).length, 0, "the light moved 50 ms after the press (the frame-timed sample): green");
  const stays = [...ST, c(38000, "s19lit", { holes: A }), press, c(39520, "s19lit", { holes: B }), c(45000, "x")];
  assert.equal(run(stays).length, 1, "only the lagging sample, gone at 620 ms: red");
});
