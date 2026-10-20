// Zafar, 20 Oct: an item's word is written on its jar or chip while the child is still learning it; once they have used
// it right, from the next round the chip is the speaker alone (Cook.chipWord, js/cook/core.js, on the core's per-word
// progress; "Start over" and "Play as new" forget it). Per station kind: written before the first success, not after.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadCook } from "./cook-harness.mjs";
import { createProgress } from "../../js/core/progress.js";
import { createSave } from "../../js/core/save.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const progressData = json("data/progress.json");
const R = json("data/cook.json").recipes;

// each station kind: the file that builds its chips, and item words its chips carry (from the recipes' lists)
const STATIONS = {
  chaat: { file: "js/cook/mechanics/assemble.js", ids: R.chaat.lists.toppings.slice(0, 3) },
  samosa: { file: "js/cook/stations/samosa.js", ids: R.samosa.lists.fillings_all.slice(0, 3) },
  daal: { file: "js/cook/stations/daar.js", ids: R.daal.lists.spices.slice(0, 3) },
  chai: { file: "js/cook/stations/chai-tray.js", ids: ["cook-paani", "cook-dudh", "cook-khun"] },
  maani: { file: "js/cook/stations/maani-line.js", ids: ["cook-maani", "cook-bajrmaani"] },
  sekelo: { file: "js/cook/mechanics/grill.js", ids: R.mishkaki.lists.skewer.slice() },
};

async function cookOnCore() {
  const { Cook } = await loadCook({ seed: 3 });
  const Save = createSave({});
  Save.use(Save.memoryStore());
  Save.ensurePlayer();
  Cook.core = { progress: createProgress({ save: Save, data: progressData }) };
  return Cook;
}
// a round's ctx as flow.js makeCtx builds it (the snapshot of the words used right before it began)
const round = (Cook) => (Cook.ctx = { learned: Cook.learnedNow() });

for (const [kind, { file, ids }] of Object.entries(STATIONS)) {
  test(`chip words (${kind}): written before the first success, the speaker alone from the next round`, async () => {
    const src = read(file);
    assert.match(src, /Cook\.chipWord\(/, `${file} builds its chips by Cook.chipWord`);
    assert.doesNotMatch(src, /word:\s*level\s*</, `${file}: no chip word by level`);
    const Cook = await cookOnCore();
    let ctx = round(Cook);
    ids.forEach((id) => assert.equal(Cook.chipWord(id, ctx), true, `${id}: written on a fresh save`));
    const [used, ...rest] = ids;
    Cook.markSeen(used);
    Cook.markMiss(used);
    assert.equal(Cook.chipWord(used, round(Cook)), true, `${used}: met and missed is not used right: still written`);
    ctx = round(Cook);
    Cook.markRight(used);
    assert.equal(Cook.chipWord(used, ctx), true, `${used}: used right mid-round keeps its chip till the round ends`);
    ctx = round(Cook);
    assert.equal(Cook.chipWord(used, ctx), false, `${used}: the next round shows the speaker alone`);
    rest.forEach((id) => assert.equal(Cook.chipWord(id, ctx), true, `${id}: not used yet, still written`));
    // "Start over" / "Play as new" forget the learned words: written again
    Cook.resetSave();
    assert.equal(Cook.chipWord(used, round(Cook)), true, `${used}: written again after Start over`);
  });
}

test("chip words: the same rule on the parked pages' own records (no core)", async () => {
  const { Cook } = await loadCook({ seed: 4 });
  Cook.core = null;
  Cook.ctx = null;
  assert.equal(Cook.chipWord("cook-dudh"), true);
  Cook.markRight("cook-dudh");
  assert.equal(Cook.chipWord("cook-dudh"), false);
});
