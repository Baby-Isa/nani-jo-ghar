// node --test build/sandbox/sound.test.mjs : what plays is classified against the family manifest, a line is given what played while it
// was open, and a line that played nothing is "silent". No browser.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/env.mjs";
import { classify, SoundLog, mergeSound } from "./lib/sound.mjs";

const fam = JSON.parse(readFileSync(join(ROOT, "data", "family-audio.json"), "utf8"));
const okClip = fam.find((e) => e.checked === "ok" && e.file);
const redoClip = fam.find((e) => e.checked === "redo" && e.file);

test("a file is classified against the family manifest, the Cook computer-voice files and the older word files", () => {
  assert.equal(classify({ via: "audio", url: okClip.file + "?v=1" }).kind, "family-ok");
  assert.equal(classify({ via: "audio", url: redoClip.file }).kind, "family-redo"); // marked to re-record: never a family clip the game may use
  assert.equal(classify({ via: "webaudio", url: "assets/audio/cook-tts/aadu.mp3" }).kind, "tts");
  assert.equal(classify({ via: "audio", url: "assets/audio/word/num-01.mp3" }).kind, "other");
  assert.equal(classify({ via: "speechSynthesis", text: "hakro khun" }).kind, "device-voice");
});

test("a line gets what played while it was open; a line with no sound is silent; the gap list is the lines never heard whole from family clips", () => {
  const L = new SoundLog();
  const t = 1000;
  L.push({ type: "line", id: 1, who: "cook", text: "chai", t });
  L.push({ type: "play", via: "audio", url: okClip.file, t: t + 20 });
  L.push({ type: "line-end", id: 1, t: t + 400 });
  L.push({ type: "line", id: 2, who: "cook", text: "Muke aadu khape.", t: t + 500 });
  L.push({ type: "play", via: "webaudio", url: "assets/audio/cook-tts/aadu.mp3", t: t + 520 });
  L.push({ type: "line-end", id: 2, t: t + 900 });
  L.push({ type: "line", id: 3, who: "clinic", text: "hedo", t: t + 1000 });
  L.push({ type: "line-end", id: 3, t: t + 1100 });
  const s = L.summary();
  const by = Object.fromEntries(s.lines.map((l) => [l.text, l.status]));
  assert.deepEqual(by, { chai: "family-ok", "Muke aadu khape.": "tts", hedo: "silent" });
  const m = mergeSound([{ flow: "x@1", sound: s }]);
  assert.deepEqual(m.gaps.map((g) => g.text).sort(), ["Muke aadu khape.", "hedo"]);
  assert.equal(m.informational.some((p) => p.kind === "tts"), true);
});
