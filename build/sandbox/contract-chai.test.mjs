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

// Sprint 17 (s17-chk1): the checks read the per-game data list (data/games.json): today's games keep the stations the old patterns
// named, and a game is checked the day it is listed (a fake game added to the list is judged; before it is listed it is not)
import { GAMES, setGames, flowParts, gamesFor, S14_TAPS, CHAI_ROW, DECOY_STATIONS, DECOY_AT_LEAST, CONTROL_CALLS } from "./lib/contract-chai.mjs";
import { helpStage } from "./lib/contract.mjs";

test("games.json: today's games keep the stations the old patterns named", () => {
  const old = {
    s14: /^(chai-tray|chai|fetch|pantry|assemble|chaat|samosa|mishkaki-grill|mishkaki)$/,
    row: /^chai-tray$/,
    decoys: /^(fetch|pantry|chai-tray|chai|samosa|mishkaki-grill|mishkaki|daar|daal|assemble|chaat)$/,
    atLeast: /^(fetch|pantry|daar|daal)$/,
  };
  const ids = ["chai-tray", "chai", "fetch", "pantry", "assemble", "chaat", "samosa", "mishkaki-grill", "mishkaki", "daar", "daal", "maani-line", "maani", "chop", "tadka", "stir", "eggs", "baking", "corn", "fill", "pour", "round", "order"];
  for (const st of ids) {
    assert.equal(S14_TAPS.test(st), old.s14.test(st), `S14_TAPS ${st}`);
    assert.equal(CHAI_ROW.test(st), old.row.test(st), `CHAI_ROW ${st}`);
    assert.equal(DECOY_STATIONS.test(st), old.decoys.test(st), `DECOY_STATIONS ${st}`);
    assert.equal(DECOY_AT_LEAST.test(st), old.atLeast.test(st), `DECOY_AT_LEAST ${st}`);
  }
  assert.deepEqual({ ...CONTROL_CALLS }, { "chai-tray": ["chulo bar", "slow kar"] });
  // contract-70 and -71 cover the flows the old CHAI_FLOW did; contract-90 only cook:chai-tray
  const CHAI_FLOW = /^(cook:(recipe:)?chai(-tray)?\b|lab:cook\/(recipe-)?chai(-tray)?\b)/;
  for (const f of ["cook:chai-tray", "cook:chai-tray@L4#mistake", "cook:chai", "cook:chai@L2", "cook:recipe:chai", "lab:cook/chai-tray@L3", "lab:cook/recipe-chai", "cook:daar", "cook:samosa@L2", "lab:cook/round", "cook:pour", "clinic:morning"]) {
    assert.equal(gamesFor("slowAtGreen", f).length > 0, CHAI_FLOW.test(f), `70 ${f}`);
    assert.equal(gamesFor("onceEach", f).length > 0, CHAI_FLOW.test(f), `71 ${f}`);
    assert.equal(gamesFor("cardLight", f).length > 0, /^cook:chai-tray\b/.test(f), `90 ${f}`);
  }
  assert.deepEqual(flowParts("lab:cook/recipe-chai@L2"), { route: "lab-recipe", station: "chai" });
  // contract-91's stages as before: a Cook station, the game host's Cook and the clinic's
  assert.ok(helpStage("cook:station1:marble") && helpStage("host:cook/chai-tray|cook:station1:marble") && helpStage("host:clinic/heal-knee"));
  assert.ok(!helpStage("cook:between1:marble") && !helpStage("host:day/window"));
  // every family game has an entry (S18's list), each with its stations
  for (const g of ["chai", "chop", "daar", "chaat", "samosa", "maani", "sekelo", "eggs", "baking", "corn", "pantry"]) assert.ok((GAMES.games[g] || {}).stations.length, g);
});

test("a fake game added to the list is checked (contract-70, -71, -90), and not before it is listed", () => {
  const tan = {
    stations: ["tandoor"],
    help: "cook",
    slowAtGreen: { slow: "tan-slow", down: "tan-down", line: "Dhimo kar" },
    onceEach: { note: "tan-add", items: ["cook-atto"], what: "flour" },
    cardLight: { note: "tan-add", first: "cook-atto", routes: ["cook"] },
  };
  const tl = [life(2000, "tan-slow", "0.400", band), life(3000, "tan-add", "cook-atto", "nana:1"), life(3500, "tan-add", "cook-atto", "nana:2"), life(7000, "tan-add", "cook-ghee", "nana:1")];
  const before = run("cook:tandoor", tl);
  for (const c of ["contract-70", "contract-71", "contract-90"]) assert.equal(of(before, c).length, 0, `${c} before the game is listed`);
  const was = setGames({ ...GAMES, games: { ...GAMES.games, tandoor: tan } });
  try {
    const out = run("cook:tandoor", tl);
    assert.match(of(out, "contract-70")[0].measured, /"Dhimo kar" .*before the green/);
    assert.match(of(out, "contract-71")[0].measured, /cook-atto .*second time: there is one of flour/);
    assert.match(of(out, "contract-90")[0].measured, /never lit/);
    // its route: the card light is the cook route's only; a lab tile of it is not judged for 90, but is for 70
    assert.equal(of(run("lab:cook/tandoor", tl), "contract-90").length, 0);
    assert.equal(of(run("lab:cook/tandoor", tl), "contract-70").length, 1);
    // chai is still judged as before alongside it
    assert.equal(of(run("cook:chai-tray", [life(2000, "chai-slow", "0.480", band)]), "contract-70").length, 1);
  } finally {
    setGames(was);
  }
  assert.equal(of(run("cook:tandoor", tl), "contract-70").length, 0, "taken off the list, not judged");
});
