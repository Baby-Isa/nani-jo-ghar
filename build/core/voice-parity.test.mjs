// No audible change when Cook moves onto the one Voice (gap-analysis R2b): on the test path, the core's clip plan
// (js/core/voice.js planClips) plays the same files in the same order as today's js/cook/lang.js Lang.speak, for
// every Cook order line (L1-L4, every recipe and customer) and every word. Today's code runs unchanged in a vm with
// the classic js/shared/family-voice.js; its players are stubbed to record what they would play.
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { loadCook, ROOT } from "./cook-harness.mjs";
import { clipIndex, planClips } from "../../js/core/voice.js";

test("test path: the core's clip plan = what Cook's Lang.speak plays today (files, order, device-voice turns)", async () => {
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
  let n = 0;
  const differ = [];
  const kinds = { family: 0, tts: 0, device: 0 };
  for (const line of lines) {
    played.length = 0;
    await Cook.Lang.speak(line);
    const today = played.slice();
    today.forEach((f) => (f === "device" ? kinds.device++ : /\/family\//.test(f) ? kinds.family++ : kinds.tts++));
    const plan = planClips(line.segs, index, { path: "test", sayOf }).filter((c) => c.source !== "missing").map((c) => (c.source === "device" ? "device" : c.file));
    n++;
    if (JSON.stringify(today) !== JSON.stringify(plan)) differ.push({ line: Cook.Lang.plain(line), today, plan });
  }
  assert.ok(n > 150, `lines compared: ${n}`);
  assert.ok(kinds.family > 50 && kinds.tts > 50, `a real mix of family clips and stand-ins: ${JSON.stringify(kinds)}`);
  assert.deepEqual(differ.slice(0, 5), [], `${differ.length} of ${n} lines differ`);
  console.log(`# voice parity: ${n} Cook lines play the same clips in the same order (${JSON.stringify(kinds)})`);
});
