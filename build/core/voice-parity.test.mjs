// No audible change when Cook moves onto the one Voice (gap-analysis R2b): on the test path, the core's clip plan
// (js/core/voice.js planClips) plays the same files in the same order as today's js/cook/lang.js Lang.speak, for
// every Cook order line (L1-L4, every recipe and customer) and every word. Today's code runs unchanged in a vm with
// the classic js/shared/family-voice.js; its players are stubbed to record what they would play.
//
// R6 (decision 26, G12: stitched speech everywhere until the pre-publish pass): the core's default is now
// `phrases: false`, so it deliberately differs from Cook's own search wherever a whole-phrase family clip exists.
// The parity rule therefore holds with the pre-publish setting (`phrases: true`, what Lang.speak does today), and a
// second test holds the new rule: with phrases off no plan uses a clip of more than one word, every line whose
// words all have family clips is said word by word from them, and every other line keeps its stand-ins exactly as
// before (the old plan with only the phrase clips taken out).
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { loadCook, ROOT } from "./cook-harness.mjs";
import { clipIndex, planClips, isPhrase } from "../../js/core/voice.js";

async function setup() {
  const { Cook, win } = await loadCook({ seed: 5 });
  vm.runInContext(readFileSync(ROOT + "js/shared/family-voice.js", "utf8"), win, { filename: "family-voice.js" });
  await win.FamilyVoice.load();
  const played = [];
  Cook.speed = 1e6;
  Cook.speakFile = async (url) => played.push(url);
  Cook.speakKey = async (key) => played.push(Cook.tts[key]);
  win.speechSynthesis = { getVoices: () => [{ lang: "gu-IN" }], speak: (u) => (played.push("device"), u.onend && u.onend()) };
  win.SpeechSynthesisUtterance = function (t) {
    this.text = t;
  };
  const fam = JSON.parse(readFileSync(ROOT + "data/family-audio.json", "utf8"));
  const index = clipIndex(fam, { tts: Cook.tts });
  const sayOf = (id) => (id && Cook.data.words[id] && Cook.data.words[id].say) || null;
  const lines = [];
  const D = Cook.data;
  for (const id of Object.keys(D.recipes).filter((x) => x[0] !== "_"))
    for (const level of [1, 2, 3, 4])
      for (const who of id === "pantry" ? ["nani"] : Object.keys(D.customers)) {
        const d = Cook.Recipes[id].make(who, { level });
        if (id === "pantry") d.for = "chai";
        lines.push(Cook.Order.speech([Cook.Order.ladder(d, 0)], { withWhen: true }));
      }
  Object.keys(D.words).forEach((w) => lines.push(Cook.Lang.wordLine(w)));
  Object.keys(D.lines).forEach((k) => !String(D.lines[k].k || D.lines[k].e).includes("{x}") && lines.push(Cook.Lang.line(k)));
  return { Cook, played, index, sayOf, lines, fam };
}

test("test path, pre-publish setting (phrases on): the core's clip plan = what Cook's Lang.speak plays today (files, order, device-voice turns)", async () => {
  const { Cook, played, index, sayOf, lines } = await setup();
  let n = 0;
  const differ = [];
  const kinds = { family: 0, tts: 0, device: 0 };
  for (const line of lines) {
    played.length = 0;
    await Cook.Lang.speak(line);
    const today = played.slice();
    today.forEach((f) => (f === "device" ? kinds.device++ : /\/family\//.test(f) ? kinds.family++ : kinds.tts++));
    const plan = planClips(line.segs, index, { path: "test", sayOf, phrases: true }).filter((c) => c.source !== "missing").map((c) => (c.source === "device" ? "device" : c.file));
    n++;
    if (JSON.stringify(today) !== JSON.stringify(plan)) differ.push({ line: Cook.Lang.plain(line), today, plan });
  }
  assert.ok(n > 150, `lines compared: ${n}`);
  assert.ok(kinds.family > 50 && kinds.tts > 50, `a real mix of family clips and stand-ins: ${JSON.stringify(kinds)}`);
  assert.deepEqual(differ.slice(0, 5), [], `${differ.length} of ${n} lines differ`);
  console.log(`# voice parity: ${n} Cook lines play the same clips in the same order (${JSON.stringify(kinds)})`);
});

test("stitched speech (phrases off, the default until the pre-publish pass): word by word from family clips; stand-ins only for the gaps", async () => {
  const { Cook, index, sayOf, lines, fam } = await setup();
  const phraseFiles = new Set(fam.filter((e) => isPhrase(e.kutchi)).map((e) => e.file));
  const wordFiles = new Set(fam.filter((e) => e.kutchi && !isPhrase(e.kutchi)).map((e) => e.file));
  let stitched = 0, standIn = 0, phraseBefore = 0;
  for (const line of lines) {
    for (const path of ["test", "store"]) {
      const plan = planClips(line.segs, index, { path, sayOf, phrases: false });
      assert.ok(!plan.some((c) => c.file && phraseFiles.has(c.file) && !wordFiles.has(c.file)), `${Cook.Lang.plain(line)} (${path}): a whole-phrase clip played`);
      if (path === "store") assert.ok(plan.every((c) => c.source === "family-ok" || c.source === "missing"), `store: family OK clips or a reported gap only`);
      if (path !== "test") continue;
      const fams = plan.filter((c) => c.source === "family-ok" || c.source === "family-unchecked");
      const ks = plan.filter((c) => c.lang !== "e");
      if (ks.length && fams.length === ks.length) stitched++;
      else {
        standIn++;
        // a line that can't be stitched keeps exactly the stand-ins it had, phrase clips aside
        const before = planClips(line.segs, index, { path, sayOf, phrases: true });
        if (before.some((c) => c.file && phraseFiles.has(c.file))) phraseBefore++;
        else assert.deepEqual(plan.map((c) => c.file || c.source), before.map((c) => c.file || c.source), Cook.Lang.plain(line));
      }
    }
  }
  assert.ok(stitched > 20, `lines said word by word from family clips: ${stitched}`);
  // a family word beats a computer voice: "Muke chai khape." is stitched when all three words are recorded
  const one = planClips([{ t: "Muke", lang: "k" }, { t: " ", lang: null }, { t: "chai", lang: "k", w: "cook-chai" }, { t: " khape.", lang: "k" }], index, { path: "test", sayOf, phrases: false });
  const all = ["muke", "chai", "khape"].every((w) => index.match(w, { path: "test", phrases: false }));
  if (all) assert.deepEqual(one.map((c) => c.text.toLowerCase().replace(/[^a-z]/g, "")), ["muke", "chai", "khape"]);
  console.log(`# stitched speech: ${stitched} lines word by word from family clips, ${standIn} keep stand-ins for missing words (${phraseBefore} of them used a whole-phrase clip before)`);
});
