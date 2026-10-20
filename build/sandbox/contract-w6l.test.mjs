// S08 wave 6L (the evidence tools; requests from wave 6J, Cook): contract-3 matches a clip to its line by the turn's id, contract-35's L4
// rule lets the daal chop card stay open and does not read the rows a #hint player paid to reveal.
// node --test build/sandbox/contract-w6l.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const clip = () => 0.6;
const LEX = new Set(["muke", "bhar", "chai", "khape", "dhania", "dungri"]);
const NUMS = new Set(["ek", "ba", "trae"]);
const run = (r) => analyse(r, { root: ROOT, retired: [], clip, lexicon: LEX, numbers: NUMS });
const of = (out, c) => out.filter((b) => b.check === c);
const page = (flow, timeline, size = "1366x768") => ({ flow, size, t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const stage = (t, key) => C(t, "stage", { key });
const life = (t, what, step = "", o = {}) => C(t, "life", { what, reason: step, at: t, ...o });
const line = (id, t, text, o = {}) => ({ type: "line", id, who: "cook", text, t, ...o });
const lineEnd = (id, t) => ({ type: "line-end", id, t });
const play = (pid, t, url, dur, o = {}) => ({ type: "play", via: "webaudio", url, pid, dur, t, ...o });
const playEnd = (pid, t, why = "ended") => ({ type: "play-end", pid, why, t });
const T = 1e6;
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);

test("contract-3: a clip belongs to the line its turn said (by id), not to an earlier line with the same words that never sounded", () => {
  const f = "assets/audio/family/mum/bhar-rc.mp3";
  // stage 1 asks for "Bhar!" (line 1) and is over before it sounds (a cut count clip); stage 2 says its own "Bhar!" (line 2, turn 2)
  const tl = sorted([stage(T, "cook:station1:chai"), life(T, "stage-start", "cook:station"),
    line(1, T + 500, "Bhar!"), lineEnd(1, T + 520),
    stage(T + 2000, "cook:station2:chaat"), life(T + 2000, "stage-start", "cook:station"),
    line(2, T + 2600, "Bhar!"), life(T + 2610, "say-start", "2", { by: "Bhar!" }), play(1, T + 2620, f, 0.6), playEnd(1, T + 3220), life(T + 3230, "say-end", "2"), lineEnd(2, T + 3240)]);
  assert.equal(of(run(page("cook:chaat", tl)), "contract-3").length, 0, "green: the clip is line 2's, said in stage 2");
  // a clip that really runs on past its own stage's end is still a break
  const late = sorted([stage(T, "cook:station1:chai"), life(T, "stage-start", "cook:station"),
    line(1, T + 1500, "Bhar!"), life(T + 1510, "say-start", "1", { by: "Bhar!" }), play(1, T + 1520, f, 1.5), playEnd(1, T + 3020), life(T + 3030, "say-end", "1"), lineEnd(1, T + 3040),
    stage(T + 2000, "cook:station2:chaat")]);
  assert.equal(of(run(page("cook:chaat", late)), "contract-3").length, 1, "red: its own stage ended at +2 s and the clip sounded to +3 s");
});

// ---- contract-35 ----
const card = (t, n, closed, peek = 0) => C(t, "side", { n, rows: n, done: 0, closed, peek, dots: 0, words: [] });
const rows = (t, list) => C(t, "rows", { list: list.map((text, i) => ({ id: `r${i}`, key: "k", text, done: false, en: false, no: false })) });
const firstTap = (t) => C(t, "input", { x: 400, y: 300, on: "canvas", next: false, btn: null, popup: false, side: false, play: true });
const l4 = (flow, n, closed) => sorted([stage(T, "cook:station1:" + flow.split(":")[1]), life(T, "stage-start", "cook:station"), life(T + 10, "order-level", "", { level: 4 }), card(T + 500, n, closed), rows(T + 600, ["Muke dhania"]), firstTap(T + 1000)]);

test("contract-35: at L4 the daal's chop card (Nani's, with the other items dotted so the child sees there are three) may stay open; another station's open card is still a break", () => {
  assert.equal(of(run(page("cook:daar@L4", l4("cook:daar", 2, 1))), "contract-35").length, 0, "green: the order card folded, the chop card open");
  assert.equal(of(run(page("cook:chai-tray@L4", l4("cook:chai-tray", 2, 1))), "contract-35").length, 1, "red: chai's second card open at L4");
  assert.equal(of(run(page("cook:daar@L4", l4("cook:daar", 2, 0))), "contract-35").length, 1, "red: at L4 even the daal's order card must be folded");
});

test("contract-35: the rows a #hint player paid to reveal (the bulb, a peek) are not the card at rest", () => {
  const mk = (flow) => sorted([stage(T, "cook:station1:chai"), life(T, "stage-start", "cook:station"), card(T + 500, 1, 0), rows(T + 600, ["Muke dungri •••"]), firstTap(T + 1000)]);
  assert.equal(of(run(page("cook:chai-tray", mk())), "contract-35").length, 1, "red: a dotted word on an L1 card");
  assert.equal(of(run(page("cook:chai-tray#hint", mk())), "contract-35").length, 0, "green: the hint player revealed it");
});

test("contract-30: the card sample leaves out a [data-howto] line (the doctor's spoken strip), so 'One more thing.' is not counted as written", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(join(ROOT, "build", "sandbox", "lib", "contract-hook.mjs"), "utf8");
  const line = src.split("\n").find((l) => /const cw = cards\.flatMap/.test(l)) || "";
  assert.match(line, /!x\.closest\("\[data-howto\]"\)/, "the written words skip the howto strip");
  assert.match(line, /!x\.closest\("\.cl-row-en"\)/, "and still the bulb's English");
});
