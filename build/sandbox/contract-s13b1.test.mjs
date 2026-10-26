// S13-B1 (one shared kit, pair 2): contract-40 (one card markup; SH-110, a blanked row starts with its speaker) and contract-41 (one
// order pop-up, the kit's .njg-rq-card, never Cook's #intro), read from the hook's kitcard sample (lib/contract-hook.mjs kitCards).
// node --test build/sandbox/contract-s13b1.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const run = (r) => analyse(r, { root: ROOT, retired: [], clip: () => 0.6, lexicon: new Set(["muke", "chai", "khape"]), numbers: new Set(["ek", "ba"]) });
const of = (out, c) => out.filter((b) => b.check === c);
const T = 1e6;
const page = (timeline, flow = "cook:chai-tray") => ({ flow, size: "1366x768", t0: T, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const kc = (t, o = {}) => ({ type: "c", k: "kitcard", t, n: 1, bad: [], blank: 0, mute: [], pops: 0, ownPop: [], intro: false, ...o });

test("contract-40: a card and its rows with only kit classes is no break; a game's own class on them is, once per page", () => {
  assert.equal(of(run(page([kc(T), kc(T + 100, { n: 2 })])), "contract-40").length, 0, "green: only the kit's classes");
  const b = of(run(page([kc(T, { bad: ["row: cl-row"] }), kc(T + 100, { n: 2, bad: ["row: cl-row", "face: cl-card-face"] })], "clinic:diagnosis")), "contract-40");
  assert.equal(b.length, 2, "red: the clinic's row and face classes, each once");
  assert.match(b[0].measured, /row carries a game's own class: cl-row/);
});

test("contract-40 (SH-110): a blanked row with no speaker at its start is a break; one with its speaker is not", () => {
  assert.equal(of(run(page([kc(T, { blank: 3, mute: [] })])), "contract-40").length, 0, "green: three dotted rows, each with its speaker");
  const b = of(run(page([kc(T, { blank: 3, mute: ["trae •••"] })])), "contract-40");
  assert.equal(b.length, 1, "red: a dotted row with no speaker");
  assert.match(b[0].measured, /SH-110/);
});

test("contract-41: the kit's pop-up is no break; Cook's #intro or a pop-up with no .njg-rq-card is", () => {
  assert.equal(of(run(page([kc(T, { pops: 1 })])), "contract-41").length, 0, "green: the kit's .njg-rq-card");
  assert.equal(of(run(page([kc(T, { pops: 1, intro: true }), kc(T + 50, { pops: 1, intro: true, n: 2 })])), "contract-41").length, 1, "red: #intro, once");
  assert.equal(of(run(page([kc(T, { pops: 1, ownPop: [".my-popup"] })])), "contract-41").length, 1, "red: a pop-up of the game's own");
});

// SH-133 (S13-B1 fix round): the help's hint rungs armed again for a step still open log a second step-open of the same id: that
// is the step still open (judged at its first opening: its call, or its skip), not a new one; a new step with no call still is
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const life = (t, what, step = "", o = {}) => C(t, "life", { what, reason: step, at: t, ...o });
test("contract-36 (SH-133): a step logged open again with nothing between is the same opening; a new uncalled step is a break", () => {
  const base = [C(T, "stage", { key: "cook:station1:marble" }), life(T, "stage-start", "cook:station"),
    life(T + 1000, "step-open", "21", { by: "L4" }), life(T + 1000, "step-call", "21", { by: "skip-novoice" }), life(T + 1001, "step-open", "21"), life(T + 2100, "step-open", "21")];
  const tl = (x) => ({ flow: "cook:chai-tray@L4", size: "1280x665", t0: T, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline: x.sort((a, b) => a.t - b.t) });
  assert.equal(of(run(tl(base.slice())), "contract-36").length, 0, "green: step 21's skip was logged at its opening; the rungs' re-log is the same step");
  assert.equal(of(run(tl([...base, life(T + 3000, "step-open", "22")])), "contract-36").length, 1, "red: step 22 opened, never called, no skip");
});

// S13-B1 round 3 (CLAUDE.md non-negotiable 3: a word's English "only when tapped"): an order card's row never shows its English untapped
test("contract-39: an order card row's English untapped is a break at any stage; tapped open, or a word card while supported, is not", () => {
  const en = (list) => page([C(T, "card-en", { list })]);
  assert.equal(of(run(en([{ word: "veg-03", stage: 1, revealed: false, text: "two onions", oc: true }])), "contract-39").length, 1, "red: a row's English at stage 1, untapped");
  assert.equal(of(run(en([{ word: "veg-03", stage: 1, revealed: true, text: "two onions", oc: true }])), "contract-39").length, 0, "green: the child tapped it open");
  assert.equal(of(run(en([{ word: "veg-03", stage: 1, revealed: false, text: "onion", oc: false }])), "contract-39").length, 0, "green: the big word card while supported");
});
