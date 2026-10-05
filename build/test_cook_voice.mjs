// G1 (decision 26, G12), on the language engine since step 4d: Cook says every line from the engine's clip plan
// (js/core/lang/engine/clips.js: stitched word by word from the family's recordings, whole phrases off), through the
// core's one voice. For every Cook order line (L1-L4, every recipe and customer) and every word, Lang.speak plays
// exactly the plan's family clips in order, the device voice for a Kutchi word with no recording (test path only:
// TTS never ships), nothing for an English placeholder (rule E1), and never a clip of more than one word.
// Run: node --test build/test_cook_voice.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadCookEngine, allOrderLines, ROOT } from "./test_cook_harness.mjs";
import { isPhrase, voicePath, createVoice } from "../js/core/voice.js";

test("Cook's Lang.speak plays the engine's plan: stitched word by word, no whole-phrase clip", async () => {
  const { Cook, win } = await loadCookEngine({ seed: 5 });
  const played = [];
  Cook.speed = 1e6;
  Cook.speakFile = async (url) => played.push(url);
  win.speechSynthesis = { getVoices: () => [{ lang: "gu-IN" }], speak: (u) => (played.push("device"), u.onend && u.onend()) };
  win.SpeechSynthesisUtterance = function (t) {
    this.text = t;
  };
  // the core's one voice, playing through Cook's player (js/cook/boot.js's player)
  const player = { play: (u) => Cook.speakFile(u), stop() {}, synth: (t) => Cook.synthSay(t) };
  Cook.core = { voice: createVoice({ index: null, player, path: "test", phrases: false, gapMs: 0 }) };
  assert.equal(voicePath(), "test");
  const lines = allOrderLines(Cook).map((x) => x.line);
  Cook.items().forEach((w) => Cook.Lang.known(w) && lines.push(Cook.Lang.wordLine(w)));
  const fam = JSON.parse(readFileSync(ROOT + "data/family-audio.json", "utf8"));
  const phraseFiles = new Set(fam.filter((e) => isPhrase(e.kutchi)).map((e) => e.file));
  const wordFiles = new Set(fam.filter((e) => e.kutchi && !isPhrase(e.kutchi)).map((e) => e.file));
  const differ = [];
  let stitched = 0;
  let english = 0;
  for (const line of lines) {
    played.length = 0;
    await Cook.Lang.speak(line);
    const plan = line.plan || [];
    // a line with Kutchi in it is never silent: every word of it is in the plan
    const kWords = line.segs.filter((x) => x.lang === "k").length;
    assert.ok(plan.filter((c) => c.lang !== "e").length >= Math.min(1, kWords), `${Cook.Lang.plain(line)}: Kutchi with no plan`);
    const want = plan.filter((c) => c.file || c.lang !== "e").map((c) => c.file || "device");
    english += plan.filter((c) => c.lang === "e").length;
    if (JSON.stringify(played) !== JSON.stringify(want)) differ.push({ line: Cook.Lang.plain(line), played: played.slice(), want });
    // a clip of more than one word plays only as one lexicon entry's own recording (aste thi, "slowly": one word to the engine)
    const own = new Set(plan.filter((c) => c.kind === "word" && c.file).map((c) => c.file));
    assert.ok(!played.some((f) => phraseFiles.has(f) && !wordFiles.has(f) && !own.has(f)), `${Cook.Lang.plain(line)}: a whole-phrase clip played`);
    assert.ok(plan.every((c) => c.kind !== "whole"), `${Cook.Lang.plain(line)}: a whole-phrase clip planned`);
    const ks = plan.filter((c) => c.lang !== "e");
    if (ks.length && ks.every((c) => c.file)) stitched++;
    if (Cook.Lang.hasWhole(line)) assert.ok(plan.length === 1 && plan[0].file, `${Cook.Lang.plain(line)}: hasWhole but ${plan.length} clips`);
  }
  assert.deepEqual(differ.slice(0, 5), [], `${differ.length} of ${lines.length} lines differ from the engine's plan`);
  assert.ok(stitched > 20, `lines said word by word from family clips: ${stitched}`);
  console.log(`# Cook voice from the engine's plan: ${lines.length} lines, ${stitched} wholly from family clips, ${english} English placeholder pieces kept silent`);
});
