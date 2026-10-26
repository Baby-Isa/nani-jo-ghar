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
