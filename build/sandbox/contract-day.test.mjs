// Sprint 9, s09-frame: contracts 45 (the door's lines in turn) and 46 (English written only under the door's lines), each red on a
// timeline of what a broken door would do and green on what day.html does. The timelines use the probe's own event shapes
// (lib/sound.mjs lines, lib/contract-hook.mjs texts). node --test build/sandbox/contract-day.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, CHECKS } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const LEX = new Set(["ach", "tu", "muke", "randhan", "lai", "madad", "kar", "de", "warsaad", "ha"]);
const run = (r) => analyse(r, { root: ROOT, retired: [], clip: () => 0.6, lexicon: LEX, numbers: new Set() });
const of = (out, c) => out.filter((b) => b.check === c);
const page = (flow, timeline) => ({ flow, size: "1366x768", t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const line = (id, t, text, who = "day:door:nani") => ({ type: "line", id, who, text, t });
const lineEnd = (id, t) => ({ type: "line-end", id, t });
const T = 1e6;
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);

test("contracts 45 and 46 are registered", () => {
  for (const k of ["contract-45", "contract-46"]) assert.ok(CHECKS[k] && CHECKS[k].item && CHECKS[k].how.length > 40, k);
});

test("contract-45: a door line that starts before the one before it ended is a break; lines in turn pass", () => {
  const over = sorted([C(T, "stage", { key: "host:day" }), line(1, T + 100, "warsaad"), line(2, T + 600, "Ach!"), lineEnd(1, T + 1400), lineEnd(2, T + 2000)]);
  const b = of(run(page("day:door", over)), "contract-45");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /started 800 ms before "warsaad" ended/);
  const never = sorted([C(T, "stage", { key: "host:day" }), line(1, T + 100, "warsaad"), line(2, T + 600, "Ach!"), lineEnd(2, T + 2000)]);
  assert.match(of(run(page("day:door", never)), "contract-45")[0].measured, /never ended/);
  const turn = sorted([C(T, "stage", { key: "host:day" }), line(1, T + 100, "warsaad"), lineEnd(1, T + 1400), line(2, T + 1850, "Ach!"), lineEnd(2, T + 2600), line(3, T + 3050, "Tu muke randhan lai madad kar de."), lineEnd(3, T + 5000)]);
  assert.equal(of(run(page("day:door", turn)), "contract-45").length, 0);
  // the child's own Ha! and the book's lines are not the door's
  const child = sorted([C(T, "stage", { key: "host:day" }), line(1, T + 100, "Ach!"), line(2, T + 300, "Ha!", "day:door:child"), lineEnd(1, T + 900), lineEnd(2, T + 600)]);
  assert.equal(of(run(page("day:door", child)), "contract-45").length, 0);
});

test("contract-46: door English off the door or not under a Kutchi line is a break; under the door's Kutchi it passes", () => {
  const off = sorted([C(T, "stage", { key: "host:day" }), C(T + 100, "texts", { list: [{ t: "Come!", rec: false, en: false, grown: false, door: { stage: false, under: true }, sel: "p.day-en" }] })]);
  assert.match(of(run(page("day:book", off)), "contract-46")[0].measured, /off the door/);
  const alone = sorted([C(T, "stage", { key: "host:day" }), C(T + 100, "texts", { list: [{ t: "Come!", rec: false, en: false, grown: false, door: { stage: true, under: false }, sel: "p.day-en" }] })]);
  assert.match(of(run(page("day:door", alone)), "contract-46")[0].measured, /not under a Kutchi line/);
  const ok = sorted([C(T, "stage", { key: "host:day" }), C(T + 100, "texts", { list: [{ t: "Ach!", rec: false, en: false, grown: false, sel: "p.day-k" }, { t: "Come!", rec: false, en: false, grown: false, door: { stage: true, under: true }, sel: "p.day-en" }] })]);
  const out = run(page("day:door", ok));
  assert.equal(of(out, "contract-46").length, 0);
  // and the door's English is not contract-16's (no written English for the child) when it is where it belongs
  assert.equal(of(out, "contract-16").length, 0);
  // English with no door tag is still contract-16's
  const loose = sorted([C(T, "stage", { key: "host:day" }), C(T + 100, "texts", { list: [{ t: "Come here", rec: false, en: false, grown: false, sel: "p.day-x" }] })]);
  assert.equal(of(run(page("day:door", loose)), "contract-16").length, 1);
});
