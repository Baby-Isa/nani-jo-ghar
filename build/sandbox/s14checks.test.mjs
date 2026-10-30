// S14 tools (SH-168): each new check red on a fixture of the old fault (what main did on 29 Oct) and green on the new behaviour; the
// measures and the drivers' pure parts. No browser. node --test build/sandbox/s14checks.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { S14_CHECKS, check78, check79, check80, check81, check82, check83, check84, check85, check86, faceShare, CONTROL_CALLS, POINT_AFTER_MOVE_MS } from "./lib/contract-s14.mjs";
import { CHECKS } from "./lib/contract.mjs";
import { measureLight, lum, DARK_BELOW, LIGHT_LIFT } from "./lib/lightpix.mjs";
import { SEED_PROFILES, isSeedProfile, CHAI_WORDS } from "./lib/seed.mjs";
import { PROFILES } from "./lib/evidence.mjs";
import { judgeSpacing } from "../tools/review/lib/cardmeasure.mjs";
import { isPlayTap, judgeLoad } from "../tools/review/lib/loadtime.mjs";
import { CONTRACT_ROWS } from "../tools/review/lib/regressions.mjs";

const run = (fn, ...a) => { const out = []; fn(...a, (id, t, msg) => out.push({ id, t, msg })); return out; };
const c = (k, t, o = {}) => ({ type: "c", k, t, ...o });
const lines = (...l) => ({ lines: l.map(([text, t0]) => ({ text, t0, role: "call" })) });

test("the new checks are in the contract table with their rows", () => {
  for (const k of Object.keys(S14_CHECKS)) { assert.ok(CHECKS[k], k); assert.ok(S14_CHECKS[k].how.length > 60); }
  assert.deepEqual(Object.keys(S14_CHECKS), ["contract-78", "contract-79", "contract-80", "contract-81", "contract-82", "contract-83", "contract-84", "contract-85", "contract-86"]);
  const rows = Object.keys(CONTRACT_ROWS).filter((k) => /^contract-(78|79|8\d)\b/.test(k));
  assert.equal(rows.length, 9, "each check names the fix-list rows it guards");
});

test("contract-78 (B3, CHAI-40): a control's call and its light together; 'voice, pause, dim' is red", () => {
  assert.deepEqual(CONTROL_CALLS["chai-tray"], ["chulo bar", "slow kar"]);
  const r = { flow: "cook:chai-tray#returning" };
  // main: the call at 31.3 s, the light only as the hint, 6 s later
  const mainTl = [c("lit", 37300, { holes: [[531, 240, 571, 280]] })];
  const bad = run(check78, r, mainTl, lines(["Chulo bar!", 31270]));
  assert.equal(bad.length, 1);
  assert.match(bad[0].msg, /6030 ms later/);
  // main at a returning player's speed 3: no light at all
  assert.match(run(check78, r, [], lines(["Slow kar!", 1000]))[0].msg, /no light comes with it/);
  // the branch: the light 22 ms after the call, and one up before it
  assert.equal(run(check78, r, [c("lit", 31292, { holes: [[531, 240, 571, 280]] })], lines(["Chulo bar!", 31270])).length, 0);
  assert.equal(run(check78, r, [c("lit", 31200, { holes: [[1, 1, 2, 2]] })], lines(["Chulo bar!", 31270])).length, 0, "within 200 ms before");
  assert.equal(run(check78, r, [c("lit", 31000, { holes: [[1, 1, 2, 2]] })], lines(["Chulo bar!", 31270])).length, 0, "a light already up at the call");
  assert.equal(run(check78, r, [c("lit", 31000, { holes: [[1, 1, 2, 2]] }), c("lit", 31100, { holes: [] })], lines(["Chulo bar!", 31270])).length, 1, "a light that went out before the call is no light");
  assert.equal(run(check78, { flow: "cook:fetch" }, [], lines(["Chulo bar!", 1])).length, 0, "only the games that list control calls");
});

test("contract-79 (B3, CHAI-42): the order card's light waits until nothing moves, then 500 ms", () => {
  assert.equal(POINT_AFTER_MOVE_MS, 500, "the central rules' showing.pointAfterMoveMs");
  const mv = (t, n, what = "") => c("moving", t, { n, what });
  const card = (t) => c("lit", t, { holes: [[3, 72, 315, 338]], card: true });
  // main: the light starts while the water jar still flies
  assert.match(run(check79, [mv(1000, 1, "obj:jar-cook-paani:91"), card(1300)])[0].msg, /while something moves/);
  // too soon after the last move
  assert.match(run(check79, [mv(1000, 1, "x"), mv(1200, 0), card(1300)])[0].msg, /100 ms after the last move ended/);
  // the beat kept
  assert.equal(run(check79, [mv(1000, 1, "x"), mv(1200, 0), card(1800)]).length, 0);
  assert.equal(run(check79, [card(500)]).length, 0, "nothing ever moved");
  assert.equal(run(check79, [mv(1000, 1, "x"), c("lit", 1100, { holes: [[1, 1, 9, 9]], card: false })]).length, 0, "only the order card's light is judged");
});

test("contract-80 (B5, CHAI-45): no change of the kitchen's fit in the first 2 s of a lab.html view", () => {
  const fit = (t, o = {}) => c("fit", t, { view: null, bg: "bg-service", drawn: true, box: [85.9, -186.1, 1044.1, 429.8], zoom: 1, scroll: [0, -42], canvas: [730, 430], world: [1600, 942], fade: 0, ...o });
  const r = { flow: "lab:cook/chai-tray@L3" };
  // main at 930x430: three fits in half a second (the canvas 730 to 614 wide, the world 942 to 1121 tall: the ceiling shows)
  const jump = [fit(1580), fit(1680, { box: [202.1, -186.1, 1160.3, 429.8] }), fit(2100, { box: [220.3, -87.9, 1025.9, 430.1], canvas: [614, 430], world: [1600, 1121], scroll: [0, -221] })];
  const bad = run(check80, r, jump);
  assert.equal(bad.length, 1);
  assert.match(bad[0].msg, /changed 100 ms after its first drawn frame \(an edge moved 116 px/);
  // the branch: one fit from the first frame, then the next view's own
  assert.equal(run(check80, r, [fit(1920), fit(10680, { view: "marble", bg: "spr:bg:marble", box: [199.6, -123.2, 1872.2, 951.3] })]).length, 0);
  assert.equal(run(check80, r, [fit(1000), fit(5000, { zoom: 1.2 })]).length, 0, "a change after 2 s is the game's own");
  assert.equal(run(check80, r, [fit(1000, { fade: 0.5 }), fit(1100, { box: [0, 0, 5, 5] })]).length, 0, "frames of a camera fade are not drawn frames");
  assert.equal(run(check80, { flow: "cook:chai-tray" }, jump).length, 0, "cook.html's title backdrop is outside this check (a finding in the report)");
});

test("contract-81 (B7, CHAI-46): a picture of the pan drawn over its heat ring, lasting, is red", () => {
  const over = (t, o) => c("gaugeover", t, { ring: 38, over: o });
  // main: the handle at depth 38.1 over the ring at 38, for seconds
  const bad = run(check81, [over(1000, [{ key: "s14-pan-empty", depth: 38.1, ov: 6022 }]), over(5000, [])]);
  assert.equal(bad.length, 1);
  assert.match(bad[0].msg, /s14-pan-empty \(depth 38.1\) is drawn over the heat ring \(depth 38\)/);
  assert.equal(run(check81, [over(1000, []), over(2000, [])]).length, 0, "the branch: the ring above the handle, nothing over it");
  assert.equal(run(check81, [over(1000, [{ key: "x", depth: 41, ov: 5 }]), over(1300, [])]).length, 0, "a pan carried across for 300 ms is not a picture over it");
});

test("contract-82 (B7, CHAI-47): a lit box edge across a face circle is red; a face whole inside, or clear, is not", () => {
  const face = { who: "nana", kind: "circle", box: [100, 100, 148, 148] };
  assert.ok(faceShare([0, 0, 124, 300], face.box) > 0.4 && faceShare([0, 0, 124, 300], face.box) < 0.6);
  assert.equal(faceShare([0, 0, 300, 300], face.box), 1);
  assert.equal(faceShare([200, 0, 300, 300], face.box), 0);
  const lit = (holes) => c("lit", 500, { holes, faces: [face] });
  const bad = run(check82, [lit([[0, 0, 124, 300]])]);
  assert.equal(bad.length, 1);
  assert.match(bad[0].msg, /cuts across nana circle/);
  assert.equal(run(check82, [lit([[90, 90, 160, 160]])]).length, 0, "the glass's box takes in its face (the branch)");
  assert.equal(run(check82, [lit([[300, 0, 400, 100]])]).length, 0);
  assert.equal(run(check82, [lit([[3, 67, 315, 333]])]).length, 0, "no faces: nothing to cut");
  // (the card's box 2 px inside a face's bounding square only clips the square's corner, never the circle)
  assert.equal(run(check82, [c("lit", 1, { holes: [[3, 67, 315, 333]], faces: [{ who: "x", kind: "circle", box: [5, 65, 53, 113] }] })]).length, 0);
});

test("contract-83 (B2, B7, SH-154): a card over a face, measured with the face boxes", () => {
  assert.match(run(check83, [c("cardface", 100, { over: 2064, who: "nana", card: [241, 85, 348, 258] })])[0].msg, /over nana: 2064 px squared/);
  assert.equal(run(check83, [c("cardface", 100, { over: 0, who: "", card: [1, 1, 2, 2] })]).length, 0);
});

test("contract-84 (B8, SH-164): on a dark thing the light lifts the inside; a lit black burner that stays black is red", () => {
  assert.equal(DARK_BELOW, 110);
  const px = (v) => ({ w: 100, h: 100, data: Buffer.from(new Uint8ClampedArray(100 * 100 * 4).map((_, i) => (i % 4 === 3 ? 255 : v))) });
  const hole = [[30, 30, 70, 70]];
  // the burner: 40 under the light and 40 with it (main's lit box: no fill)
  const [none] = measureLight(px(40), px(40), hole);
  assert.deepEqual([none.lin, none.under, none.lift], [40, 40, 0]);
  const [fill] = measureLight(px(70), px(40), hole);
  assert.equal(fill.lift, 30);
  const tl = (m) => [c("lightpix", 700, { holes: [m] })];
  assert.match(run(check84, tl(none))[0].msg, /dark thing \(40 bright under it\) lifts it to 40, by 0 of 255/);
  assert.equal(run(check84, tl(fill)).length, 0);
  // a bright thing needs no lift
  assert.equal(run(check84, tl({ ...none, lin: 200, under: 200, lift: 0 })).length, 0);
  assert.ok(LIGHT_LIFT >= 8);
  assert.ok(Math.abs(lum(Buffer.from([100, 100, 100, 255]), 0) - 100) < 1);
  assert.equal(measureLight(px(40), px(40), [[0, 0, 10, 10]])[0].lin, null, "a box too small to measure");
});

test("contract-85 (B4, SH-161): after Play again no picture is lost, none missing, the painted worktop, the fx", () => {
  const rep = (t, o) => c("replay", t, { round: 1, keys: ["spr:bg:marble", "elchi", "milk-jug", "s14-pan-empty"], missing: 0, marble: true, fx: [], ...o });
  // main: 14 pictures gone, the worktop drawn in code
  const main = [rep(1000), rep(40000, { round: 2, keys: ["s14-pan-empty"], marble: false })];
  const bad = run(check85, {}, main);
  assert.equal(bad.length, 2);
  assert.match(bad[0].msg, /3 pictures of the first round are gone: spr:bg:marble, elchi, milk-jug/);
  assert.match(bad[1].msg, /not the painted marble/);
  assert.equal(run(check85, {}, [rep(1000), rep(40000, { round: 2 })]).length, 0, "the branch: the same textures in round two");
  assert.match(run(check85, {}, [rep(1000), rep(40000, { round: 2, missing: 2 })])[0].msg, /2 pictures are drawn as the missing-picture texture/);
  assert.match(run(check85, {}, [rep(1000, { fx: ["fx-s11-splash"] }), rep(2000, { round: 2 })])[0].msg, /fx textures are not loaded: fx-s11-splash/);
  assert.equal(run(check85, {}, [rep(1000)]).length, 0, "one round: nothing to compare");
});

test("contract-86 (B7, SH-166): a bubble over a side panel for 400 ms or more while the play area has room", () => {
  const kp = (t, b, extra = {}) => c("keepout", t, { bubbles: [b], panels: [{ sel: "#side", box: [0, 0, 316, 430], tagged: true }], play: [316, 0, 930, 430], ...extra });
  // main: 67 px into the panel for seconds, 614 px of room
  const bad = run(check86, [kp(1000, [249, 71, 652, 147]), kp(6000, [330, 71, 700, 147])]);
  assert.equal(bad.length, 1);
  assert.match(bad[0].msg, /reaches 67 px into the keep-out panel #side/);
  assert.equal(run(check86, [kp(1000, [330, 71, 700, 147])]).length, 0, "clear of the panel");
  assert.equal(run(check86, [kp(1000, [300, 71, 690, 147]), kp(1100, [330, 71, 700, 147])]).length, 0, "a bubble on its way is not where the child sees it");
  assert.equal(run(check86, [kp(1000, [249, 71, 652, 147], { play: [316, 0, 560, 430] }), kp(5000, [330, 71, 700, 147], { play: [316, 0, 560, 430] })]).length, 0, "no room beside the panel: it may reach in");
  assert.equal(run(check86, [kp(1000, [310, 71, 700, 147]), kp(5000, [330, 71, 700, 147])]).length, 0, "6 px is the panel's shadow, not a reach");
});

test("the seed profiles (B11): every one is a spec profile, with a words list and a way in", () => {
  for (const p of Object.keys(SEED_PROFILES)) { assert.ok(PROFILES.includes(p), p); assert.ok(isSeedProfile(p)); }
  assert.ok(!isSeedProfile("seen") && !isSeedProfile("fresh"));
  assert.deepEqual(CHAI_WORDS, ["cook-paani", "cook-dudh", "cook-chai", "cook-khun"]);
  const src = readFileSync(new URL("./lib/seed.mjs", import.meta.url), "utf8");
  assert.match(src, /P\.pill\(id, \{ ok: true, firstTry: true \}\)/, "three right in a row through the progress service");
  assert.match(src, /P\.pill\("cook-paani", \{ ok: false/, "a miss on paani");
  assert.match(src, /levelUp = Object\.assign\(\{\}, C\.save\.levelUp, \{ "chai-tray": \{ level: 1, streak: 2 \}/, "two rounds done at level 1");
  // the service's own rule: three right in a row earn the pill, a miss brings it back (js/core/progress.js pillPick)
  return import("../../js/core/progress.js").then(({ pillPick, pillShows }) => {
    let r = null;
    for (let i = 0; i < 3; i++) r = pillPick(r, { ok: true }, 3);
    assert.equal(pillShows(r), false, "hidden after three right");
    r = pillPick(r, { ok: false }, 3);
    assert.equal(pillShows(r), true, "back after a miss");
    r = pillPick(r, { ok: true }, 3);
    assert.equal(pillShows(r), false, "one right hides it again");
  });
});

test("the card spacing measure (B9, SH-165): a speaker following its words at the item card's padding passes; one pushed away fails", () => {
  const item = { side: false, card: [0, 0, 200, 300], spk: [80, 250, 120, 288], words: null, tokenGap: 12 };          // pads 12 to the bottom
  const side = (gapPx, padRight) => ({ side: true, card: [0, 0, 400, 100], words: [100, 20, 200, 60], spk: [200 + gapPx, 20, 240 + gapPx, 60], tokenGap: 12, _pr: padRight });
  const ok = side(12, 0); ok.card[2] = ok.spk[2] + 30;
  assert.equal(judgeSpacing([item, ok])[0].ok, true, "12 px from its words");
  const far = side(60, 0); far.card[2] = far.spk[2] + 30;
  const j = judgeSpacing([item, far])[0];
  assert.equal(j.ok, false);
  assert.match(j.what, /48 px too far from its words/);
  const edge = side(60, 0); edge.card[2] = edge.spk[2] + 12;   // main's old grid: the speaker at the far edge, padded like the item card
  assert.equal(judgeSpacing([item, edge])[0].ok, true, "a long word may push it to the card's edge at the same padding");
  assert.equal(judgeSpacing([item])[0], undefined, "no side-by-side card on the page: nothing to judge");
  assert.equal(judgeSpacing([{ ...ok, tokenGap: null }])[0].ok, null, "nothing to measure against");
});

test("the load check (B6, CHAI-44): a growth of 20% in bytes or time fails, noise does not", () => {
  const base = { ms: 8000, bytes: 6_000_000, requests: 80 };
  assert.equal(judgeLoad(base, { ms: 8300, bytes: 6_100_000, requests: 82 }).ok, true);
  assert.equal(judgeLoad(base, { ms: 8000, bytes: 7_300_000, requests: 90 }).ok, false, "21% more bytes");
  assert.match(judgeLoad(base, { ms: 8000, bytes: 7_300_000, requests: 90 }).why, /22% more bytes/);
  assert.equal(judgeLoad(base, { ms: 9700, bytes: 6_000_000, requests: 80 }).ok, false, "21% more time");
  assert.equal(judgeLoad({ ms: 100, bytes: 5000 }, { ms: 140, bytes: 7000 }).ok, true, "a tiny game's noise is no growth");
  assert.equal(judgeLoad(null, base).ok, null, "no baseline: recorded, not judged");
  // the first play tap, not the greeting or the order
  assert.equal(isPlayTap({ kind: "click", selector: "#choices .choice" }), false);
  assert.equal(isPlayTap({ kind: "click", selector: ".njg-rq-card" }), false);
  assert.equal(isPlayTap({ kind: "wait" }), false);
  assert.equal(isPlayTap(null), false);
  assert.equal(isPlayTap({ kind: "tap", selector: null }), true);
  assert.equal(isPlayTap({ kind: "timing", selector: null }), true);
});

test("the paths and profiles the evidence loop plays through lab.html at a child's pace (B10) and the film's order-whole (B1)", async () => {
  const { resolveFlow } = await import("./flows/index.mjs");
  const { driverPaths } = await import("./drivers/catalog.mjs");
  // lab.html, speed 1, a returning player: the timing rows play as Zafar plays
  for (const id of ["lab:cook/chai-tray@L1#speed1", "lab:cook/chai-tray@L3#replay", "lab:cook/order#auto-level", "cook:chai-tray#order-whole", "cook:chai-tray#returning"]) assert.ok(resolveFlow(id), `${id} resolves to a flow`);
  assert.equal(resolveFlow("lab:cook/chai-tray@L1#speed1").timeoutMs > 400000, true, "a child's pace gets the longer time");
  assert.ok(driverPaths("cook").includes("order-whole"), "the order-whole driver is catalogued");
  assert.ok(PROFILES.includes("returning"), "a returning player is an evidence profile");
  assert.equal(resolveFlow("cook:chai-tray#sideways"), null);
  // the order-whole path plays at speed 1 (flows/cook.mjs): its id carries no speed of its own
  assert.equal(resolveFlow("cook:chai-tray#order-whole").id, "cook:chai-tray#order-whole");
});
