// The static 'voice' check (S13-V): one voice player (js/core/voice.js) and one sound-effects player (js/shared/sfx.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { voiceFindings } from "./static.mjs";

test("voice: the device voice, an <audio> or a .play() outside the two players is a finding", () => {
  assert.equal(voiceFindings("js/clinic/kit.js", "global.speechSynthesis.speak(u);").length, 1);
  assert.equal(voiceFindings("js/shared/results.js", "const a = new Audio(w.audio);").length, 1);
  assert.equal(voiceFindings("js/shared/story.js", "const a = new global.Audio(v(file));").length, 1);
  assert.equal(voiceFindings("js/shared/onboard.js", "a.play().catch(() => {});").length, 1);
  assert.equal(voiceFindings("js/cook/core.js", "const o = ctx.createOscillator();").length, 1, "a synthesized sound outside sfx.js");
});
test("voice: the players themselves, the mic, the parked games, comments and calls through the players are not", () => {
  assert.equal(voiceFindings("js/core/voice.js", "globalThis.speechSynthesis.cancel(); new Audio(url).play()").length, 0);
  assert.equal(voiceFindings("js/shared/sfx.js", "const o = c.createOscillator();").length, 0);
  assert.equal(voiceFindings("js/shared/speech.js", "speechSynthesis").length, 0);
  assert.equal(voiceFindings("js/tidy/engine.js", "const ss = global.speechSynthesis;").length, 0);
  assert.equal(voiceFindings("js/clinic/kit.js", "// the old speechSynthesis.cancel() is gone").length, 0);
  assert.equal(voiceFindings("js/clinic/kit.js", "const h = NV().clip(Kit.url(src)); root.Sfx.play(\"boing\");").length, 0);
});
