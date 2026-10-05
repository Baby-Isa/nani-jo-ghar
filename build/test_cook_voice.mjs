// G1 (decision 26, G12): Cook's test path says every line through the core's clip plan (js/core/voice.js planClips,
// handed over by js/cook/boot.js as Cook.voicePlan), so whole-phrase family clips are off in Cook as well.
// For every Cook order line (L1-L4, every recipe and customer), every word and every whole line, Lang.speak plays
// exactly the core's plan (files in order, device-voice turns), and never a clip of more than one word.
// C3: Lang.speak hands the plan to the core's voice (core.voice.say), so the test gives Cook a core voice.
// Without the core Cook's own search is unchanged: build/core/voice-parity.test.mjs.
// Run: node --test build/test_cook_voice.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { loadCook, ROOT } from "./core/cook-harness.mjs";
import { clipIndex, planClips, isPhrase, voicePath, createVoice } from "../js/core/voice.js";

test("Cook's Lang.speak follows the core's plan: stitched word by word, no whole-phrase clip", async () => {
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
  // what js/cook/boot.js sets once the core has loaded
  Cook.voicePlan = (segs) => planClips(segs, index, { path: voicePath(), sayOf });
  // C3: and the core's one voice, playing through Cook's player (js/cook/boot.js's player)
  const player = { play: (u) => Cook.speakFile(u), stop() {}, synth: (t) => Cook.synthSay(t) };
  Cook.core = { voice: createVoice({ index, player, path: "test", phrases: false, gapMs: 0 }) };
  assert.equal(voicePath(), "test");
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
  const phraseFiles = new Set(fam.filter((e) => isPhrase(e.kutchi)).map((e) => e.file));
  const wordFiles = new Set(fam.filter((e) => e.kutchi && !isPhrase(e.kutchi)).map((e) => e.file));
  const differ = [];
  let stitched = 0;
  for (const line of lines) {
    played.length = 0;
    await Cook.Lang.speak(line);
    const plan = planClips(line.segs, index, { path: "test", sayOf, phrases: false });
    const want = plan.filter((c) => c.source !== "missing").map((c) => (c.source === "device" ? "device" : c.file));
    if (JSON.stringify(played) !== JSON.stringify(want)) differ.push({ line: Cook.Lang.plain(line), played: played.slice(), want });
    assert.ok(!played.some((f) => phraseFiles.has(f) && !wordFiles.has(f)), `${Cook.Lang.plain(line)}: a whole-phrase clip played`);
    const ks = plan.filter((c) => c.lang !== "e");
    if (ks.length && ks.every((c) => c.source === "family-ok" || c.source === "family-unchecked")) stitched++;
    // heard whole (read-along lights the whole line) only when the plan is one clip
    if (Cook.Lang.hasWhole(line)) assert.ok(plan.length === 1 && plan[0].file, `${Cook.Lang.plain(line)}: hasWhole but ${plan.length} clips`);
  }
  assert.deepEqual(differ.slice(0, 5), [], `${differ.length} of ${lines.length} lines differ from the core's plan`);
  assert.ok(stitched > 20, `lines said word by word from family clips: ${stitched}`);
  console.log(`# Cook voice through the core: ${lines.length} lines, ${stitched} stitched word by word from family clips`);
});
