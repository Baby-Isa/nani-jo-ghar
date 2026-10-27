// S12 W2-A (SH-104, Zafar, 22 Oct): the end screen has two pages in every game. contract-38 is red on a timeline where the
// card holds the steps page and green on one with the badges and the word review only; the switch in js/shared/results.js
// (Results.STEPS_PAGE) is off, and no game file turns it on. node --test build/sandbox/contract-endpages.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { analyse, CHECKS } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const require = createRequire(import.meta.url);
const run = (r) => analyse(r, { root: ROOT, retired: [], clip: () => 0.6, lexicon: new Set(), numbers: new Set() });
const of = (out, c) => out.filter((b) => b.check === c);
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const page = (flow, timeline) => ({ flow, size: "1366x768", t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const T = 1e6;

test("contract-38 is described", () => {
  assert.ok(CHECKS["contract-38"] && CHECKS["contract-38"].item === "two-pages" && CHECKS["contract-38"].how.length > 40);
});

test("contract-38: a steps page on the end screen is a break, in any game", () => {
  for (const flow of ["clinic:heal-eye", "cook:chai-tray", "clinic:heal-cut"]) {
    const red = page(flow, [C(T, "stage", { key: "end" }), C(T + 100, "endpages", { pages: [1, 2, 3], step: 1, steps: 3 })]);
    assert.equal(of(run(red), "contract-38").length, 1, flow);
    const onStep3 = page(flow, [C(T, "stage", { key: "end" }), C(T + 100, "endpages", { pages: [1, 2], step: 3, steps: 0 })]);
    assert.equal(of(run(onStep3), "contract-38").length, 1, `${flow}: shown on step 3`);
    const green = page(flow, [C(T, "stage", { key: "end" }), C(T + 100, "endpages", { pages: [1, 2], step: 1, steps: 0 }), C(T + 900, "endpages", { pages: [1, 2], step: 2, steps: 0 })]);
    assert.equal(of(run(green), "contract-38").length, 0, flow);
  }
});

test("the switch: Results.STEPS_PAGE is off, and only js/shared/results.js names it", () => {
  const Results = require("../../js/shared/results.js");
  assert.equal(Results.STEPS_PAGE, false);
  const hits = [];
  const walk = (d) => {
    for (const f of readdirSync(join(ROOT, d))) {
      const p = join(d, f);
      if (statSync(join(ROOT, p)).isDirectory()) walk(p);
      else if (/\.(m?js|html)$/.test(f) && p !== join("js", "shared", "results.js") && /STEPS_PAGE/.test(readFileSync(join(ROOT, p), "utf8"))) hits.push(p);
    }
  };
  walk("js");
  assert.deepEqual(hits, [], "no game turns the steps page on");
});

test("contract-39: a word card's English past support is a break unless the child opened it", () => {
  const tl = (list) => page("clinic:heal-eye", [C(T, "stage", { key: "host:heal/eye" }), C(T + 100, "card-en", { list })]);
  assert.equal(of(run(tl([{ word: "mirchi", stage: 4, revealed: false, text: "chilli" }])), "contract-39").length, 1);
  assert.equal(of(run(tl([{ word: "mirchi", stage: 4, revealed: true, text: "chilli" }])), "contract-39").length, 0, "opened by the child");
  assert.equal(of(run(tl([{ word: "mirchi", stage: 2, revealed: false, text: "chilli" }])), "contract-39").length, 1, "supported, but not tapped (S13-A2 fix round: only when tapped)");
  assert.ok(CHECKS["contract-39"] && CHECKS["contract-39"].how.length > 40);
});
