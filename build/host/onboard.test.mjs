// build/check_onboard.mjs, made general: any moved mode's mini-games, plus Cook's and the clinic's own checks
// (which an adapter over that code pulls in). Run: node --test build/host/
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkMode, run } from "../check_onboard.mjs";

const game = (o) => Object.assign({ id: "g", gestures: ["tap"], levels: [1], mount() {} }, o);
const mode = (games) => ({ id: "m", games });
const tapDemo = [{ spotlight: "#cup", ghost: { gesture: "tap" } }];

test("a moved mode's game passes with a ghost-finger demo of every gesture it declares", () => {
  const r = checkMode(mode({ g: game({ gestures: ["tap", "drag"], onboard: { first: tapDemo, second: [{ spotlight: ["#jug", "#pan"], ghost: { gesture: "drag", from: "#jug", to: "#pan" }, wait: "pour-done" }] } }) }));
  assert.deepEqual(r.errors, []);
  assert.match(r.summary, /2 demo steps/);
});

test("each kind of gap is named", () => {
  const cases = [
    [game({}), /no first-time help/],
    [game({ onboard: false }), /no onboardWhy/],
    [game({ onboard: [{ spotlight: "#cup" }] }), /no ghost-finger demo/],
    [game({ onboard: [{ spotlight: "#cup", ghost: { gesture: "wiggle" } }] }), /isn't a move the shared kit shows/],
    [game({ onboard: [{ spotlight: "#cup", ghost: { gesture: "tap" }, text: "Tap the cup" }] }), /carries words/],
    [game({ onboard: [{ spotlight: "#cup", ghost: { gesture: "tap" }, hint: "tap the cup now" }] }), /carries words/],
    [game({ gestures: ["tap", "circle"], onboard: tapDemo }), /declares "circle" but its first-time help never shows it \(circle-stir\)/],
    [game({ gestures: [] , onboard: tapDemo }), /no gestures declared/],
    [game({ adapter: { of: "tetris" } }), /no check here knows/],
  ];
  for (const [g, re] of cases) {
    const r = checkMode(mode({ g }));
    assert.ok(r.errors.some((e) => re.test(e)), `${re} in ${JSON.stringify(r.errors)}`);
  }
  assert.deepEqual(checkMode(mode({ g: game({ onboard: false, onboardWhy: "the child only watches the countdown" }) })).errors, []);
});

test("the demo's adapters are checked by Cook's and the clinic's own checks, which pass today", async () => {
  const results = await run(["demo"]);
  assert.deepEqual(results.flatMap((r) => r.errors), []);
  const all = results.map((r) => r.summary).join(" | ");
  assert.match(all, /cook: \d+ stations/);
  assert.match(all, /clinic: 9 heal games/);
  assert.match(all, /demo: 2 games, 0 demo steps, adapters checked as cook and clinic/);
  // a single built-in mode still runs on its own
  assert.equal((await run(["cook"])).length, 1);
});
