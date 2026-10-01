// build/host/check_arcs.mjs: the arc format's validator, on the real arcs and on broken ones.
// Run: node --test build/host/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { checkAll, checkArc, knownModes } from "./check_arcs.mjs";
import { errandsOf } from "../../js/shared/mode.js";

const json = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), "utf8"));
const birthday = json("data/arcs/birthday.json");
const ctx = { arcIds: ["birthday", "demo"], modes: knownModes(), places: ["kitchen", "clinic", "beach"] };
const clone = (o) => JSON.parse(JSON.stringify(o));

test("the arcs in data/arcs pass, and the script says so", () => {
  const { problems, disagree } = checkAll();
  assert.deepEqual(problems, []);
  assert.deepEqual(disagree, []);
  const out = execFileSync("node", [fileURLToPath(new URL("./check_arcs.mjs", import.meta.url))]).toString();
  assert.match(out, /check_arcs: ok \(2 arcs/);
});

test("the Birthday skeleton is rule H36 in order: cook, set the table, find the sweets, pack the box, candles, the Fire", () => {
  const errands = errandsOf(birthday).map((x) => [x.chapter, x.errand.id, x.errand.mode]);
  assert.deepEqual(errands, [
    [1, "cook-guests", "cook"],
    [1, "set-table", "put-it-there"],
    [2, "find-sweets", "hide-and-seek"],
    [2, "pack-sweet-box", "put-it-there"],
    [3, "story-by-the-fire", "fire"],
  ]);
  const party = birthday.chapters[2].flow;
  assert.equal(party[0].beat, "candles"); // the candles are a finale beat before the Fire
  // no new content: every beat is still to write, and no errand says a word
  birthday.chapters.forEach((c) => c.flow.filter((s) => s.beat).forEach((s) => assert.equal(s.status, "to-write")));
  assert.equal(JSON.stringify(birthday).match(/"(kutchi|text|line)"/), null);
  // consecutive errands never repeat the same main action (story-and-arcs.md): no two errands in a row share a mode
  const modes = errands.map((e) => e[2]);
  modes.slice(1).forEach((m, i) => assert.notEqual(m, modes[i]));
});

test("broken arcs: each kind of mistake is named", () => {
  const cases = [
    [(a) => (a.version = 2), /version/],
    [(a) => (a.id = "Birthday Arc"), /id/],
    [(a) => (a.chapters[1].id = "guests-coming"), /used twice/],
    [(a) => (a.chapters[0].flow[1].errand.id = "set-table"), /errand "set-table" is used twice/],
    [(a) => (a.chapters[0].flow[0] = { beat: "x", errand: { id: "y" } }), /one of beat, errand, conversation/],
    [(a) => (a.chapters[0].flow[1].errand.status = "done"), /status one of/],
    // (Cook is a plug-in since R4: a parked mode stands in for "not moved yet")
    [(a) => Object.assign(a.chapters[0].flow[1].errand, { status: "playable", mode: "tidy" }), /"tidy" is playable only once js\/tidy\/main.js exists/],
    [(a) => (a.chapters[0].flow[3].errand.status = "waiting"), /waiting, but js\/put-it-there\/ doesn't exist/],
    [(a) => (a.chapters[0].flow[1].errand.settings = { level: 7 }), /level 1-4/],
    [(a) => (a.chapters[0].flow[0].kutchi = "Mageni achenta."), /no words for the child/],
    [(a) => (a.chapters[0].flow[2].conversation.text = "Hello"), /no words for the child/],
    [(a) => (a.chapters[0].opens = ["moon"]), /opens "moon"/],
    [(a) => (a.open = { after: { arc: "eid" } }), /no arc "eid"/],
    [(a) => (a.open = { when: "always" }), /not a rule/],
    [(a) => a.chapters[2].flow.pop(), /Story by the Fire/],
    [(a) => (a.chapters[1].flow = [{ beat: "only-a-beat" }]), /no errand/],
  ];
  for (const [break_, re] of cases) {
    const a = clone(birthday);
    break_(a);
    const p = checkArc(a, Object.assign({ file: "birthday.json" }, ctx));
    assert.ok(p.some((x) => re.test(x)), `${re} in ${JSON.stringify(p)}`);
  }
  // a test arc needn't end with the Fire
  const t = clone(json("data/arcs/demo.json"));
  assert.deepEqual(checkArc(t, Object.assign({ file: "demo.json" }, ctx)), []);
});
