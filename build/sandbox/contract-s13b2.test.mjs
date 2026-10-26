// S13-B2 (one shared kit, pair 3): contract-4 (every speech bubble is the kit's .cv-bubble, js/shared/conversations.js
// Conversations.bubble, its tail at its speaker's head) and contract-41b (nothing inside the end screen, .njg-results, carries a
// game's own class: the clinic's receipt is the kit's receipt slot, Results.show({receipt})), read from the hook's bubble and
// kitend samples (lib/contract-hook.mjs).
// node --test build/sandbox/contract-s13b2.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const run = (r) => analyse(r, { root: ROOT, retired: [], clip: () => 0.6, lexicon: new Set(["muke", "chai", "khape"]), numbers: new Set(["ek", "ba"]) });
const of = (out, c) => out.filter((b) => b.check === c);
const T = 1e6;
const page = (timeline, flow = "clinic:diagnosis") => ({ flow, size: "1280x665", t0: T, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const head = { who: "patient", src: "fig-head", box: { l: 400, t: 200, r: 480, b: 280 } };
const bub = (t, o = {}) => ({ type: "c", k: "bubble", t, list: [{ who: "patient", text: "Ach!", box: { l: 380, t: 120, r: 520, b: 190 }, tail: { x: 440, y: 195 }, ...o }], heads: [head], play: { l: 0, t: 0, r: 1280, b: 665 }, vw: 1280, vh: 665 });
const ke = (t, o = {}) => ({ type: "c", k: "kitend", t, n: 1, bad: [], ...o });

test("contract-4 (S13-B2): the kit's bubble at its speaker's head is no break; a bubble of a game's own is, once per page", () => {
  assert.equal(of(run(page([bub(T, { kit: true })])), "contract-4").length, 0, "green: the kit's .cv-bubble above her head");
  assert.equal(of(run(page([bub(T)])), "contract-4").length, 0, "an older timeline with no kit flag is judged by its place only");
  const b = of(run(page([bub(T, { kit: false, sel: "div.cl-bubble.who-patient" }), bub(T + 100, { kit: false, sel: "div.cl-bubble.who-patient", text: "Ouch" })])), "contract-4");
  assert.equal(b.length, 1, "red: the clinic's own .cl-bubble, once");
  assert.match(b[0].measured, /not the kit's bubble/);
  assert.match(b[0].measured, /cl-bubble/);
});

test("contract-4: the kit's bubble away from the head still breaks on its place", () => {
  const b = of(run(page([bub(T, { kit: true, box: { l: 900, t: 400, r: 1040, b: 470 }, tail: { x: 960, y: 475 } })])), "contract-4");
  assert.equal(b.length, 1, "red: the kit's bubble, but nowhere near her head");
  assert.doesNotMatch(b[0].measured, /not the kit's bubble/);
});

test("contract-41b (S13-B2): an end screen of kit classes only is no break; a game's own class inside it is, once each per page", () => {
  assert.equal(of(run(page([ke(T), ke(T + 100, { n: 2 })])), "contract-41b").length, 0, "green: rs-, njg-, the kit's face circle");
  const b = of(run(page([ke(T, { bad: ["cl-receipt", "cl-face"] }), ke(T + 100, { bad: ["cl-receipt"] })])), "contract-41b");
  assert.equal(b.length, 2, "red: the clinic's receipt and its face class, each once");
  assert.match(b[0].measured, /cl-receipt/);
});
