// s08 wave 4B (chai): contracts 70 (the turn-off line at the green, CHAI-24) and 71 (milk, water and tea once each, CHAI-22), each
// red on the notes the old tray logged (the line 0.14 before the green; a second milk poured in) and green on the new ones. The
// notes use the probe's own shape (lib/contract-hook.mjs: k "life", what, reason = the note's step, by).
// node --test build/sandbox/contract-chai.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyse, CHECKS } from "./lib/contract.mjs";

const run = (flow, tl) => analyse({ flow, size: "1366x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "cook:station1:marble", t: 1000 }, ...tl] }, { lexicon: new Set(), numbers: new Set() });
const of = (out, c) => out.filter((b) => b.check === c);
const life = (t, what, step, by) => ({ type: "c", k: "life", what, reason: String(step), step: String(step), by, at: t, t });
const band = "0.62/0.86/nana";

test("contracts 70 and 71 are registered", () => {
  for (const k of ["contract-70", "contract-71"]) assert.ok(CHECKS[k] && CHECKS[k].item && CHECKS[k].how.length > 40, k);
});

test("contract-70: the turn-off line before the green is a break; at the green's edge it passes", () => {
  const early = of(run("cook:chai-tray", [life(2000, "chai-slow", "0.480", band), life(4000, "chai-down", "0.700", band)]), "contract-70");
  assert.equal(early.length, 1);
  assert.match(early[0].measured, /before the green/);
  assert.match(of(run("cook:chai@L2", [life(2000, "chai-slow", "0.750", band)]), "contract-70")[0].measured, /late/);
  assert.equal(of(run("cook:chai-tray@L3", [life(2000, "chai-slow", "0.623", band), life(4000, "chai-down", "0.700", band)]), "contract-70").length, 0);
  // turned down in the green with the line never called
  assert.match(of(run("cook:chai-tray", [life(4000, "chai-down", "0.700", band)]), "contract-70")[0].measured, /never called/);
  // turned down early, before the green: no line is owed
  assert.equal(of(run("cook:chai-tray", [life(4000, "chai-down", "0.400", band)]), "contract-70").length, 0);
  // another station's flow is not judged
  assert.equal(of(run("cook:daar", [life(2000, "chai-slow", "0.100", band)]), "contract-70").length, 0);
});

test("contract-71: a second milk poured in is a break; a refused second tap passes", () => {
  const twice = of(run("cook:chai-tray#mistake", [life(2000, "chai-add", "cook-dudh", "nana:1"), life(3000, "chai-add", "cook-dudh", "nana:2")]), "contract-71");
  assert.equal(twice.length, 1);
  assert.match(twice[0].measured, /second time/);
  assert.equal(of(run("cook:chai-tray#mistake", [life(2000, "chai-add", "cook-dudh", "nana:1"), life(3000, "chai-add", "cook-dudh", "nana:1:again"), life(3500, "chai-add", "cook-paani", "ma:1")]), "contract-71").length, 0);
  // spoonfuls (sugar, a spice) count up by design
  assert.equal(of(run("cook:chai-tray", [life(2000, "chai-add", "cook-khun", "nana:3")]), "contract-71").length, 0);
});
