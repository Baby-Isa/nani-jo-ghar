// LNG-16 (S13-V): a phone's voices load lazily; the opening "muke" (the page's first device-voice word) was spoken before they were
// in and never heard. deviceSpeak waits for them (at most VOICES_WAIT_MS from the first ask); a device with no voice is let go of.
import { test } from "node:test";
import assert from "node:assert/strict";
import { deviceSpeak, VOICES_WAIT_MS } from "../../js/core/voice.js";

function lazySynth(loadMs) {
  const t0 = Date.now();
  const on = new Set();
  const S = {
    spoken: [], dropped: [],
    getVoices: () => (Date.now() - t0 >= loadMs ? [{ lang: "gu-IN" }] : []),
    addEventListener: (k, f) => k === "voiceschanged" && on.add(f),
    cancel() {},
    speak(u) {
      if (Date.now() - t0 < loadMs) return void S.dropped.push(u.text); // before the voices: never heard
      S.spoken.push(u.text);
      setTimeout(() => (u.onstart && u.onstart(), setTimeout(() => u.onend && u.onend(), 10)), 5);
    },
  };
  if (loadMs < 1e6) setTimeout(() => on.forEach((f) => f()), loadMs);
  return S;
}
const withSynth = async (S, fn) => {
  globalThis.speechSynthesis = S;
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  try { await fn(); } finally { delete globalThis.speechSynthesis; delete globalThis.SpeechSynthesisUtterance; }
};

test("LNG-16: the first device-voice word waits for the voices, so 'muke' is heard", async () => {
  const S = lazySynth(300);
  await withSynth(S, async () => {
    const ok = await deviceSpeak("muke");
    assert.equal(ok, true);
    assert.deepEqual(S.dropped, [], "nothing spoken before the voices were in");
    assert.deepEqual(S.spoken, ["muke"]);
  });
});

test("LNG-16: a device with no voice at all is waited on once at most, then let go of at once", async () => {
  const S = lazySynth(1e9);
  await withSynth(S, async () => {
    const t0 = Date.now();
    await deviceSpeak("muke");
    assert.ok(Date.now() - t0 <= VOICES_WAIT_MS + 600, "the first word waits at most the voices' wait (and the let-go)");
    const t1 = Date.now();
    await deviceSpeak("khape");
    assert.ok(Date.now() - t1 < 600, "never waited on again");
  });
});
