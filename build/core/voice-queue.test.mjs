// S08 wave 1A: the core voice's one speech queue (PAN-04, PAN-16, SH-94) and the device voice (LNG-09, LNG-16).
// node --test build/core/voice-queue.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createVoice, clipIndex, deviceSpeak, DEVICE_RATE, CANCEL_GAP_MS } from "../../js/core/voice.js";

const clips = (...names) => ({ clipPlan: names.map((n, i) => ({ file: n, source: "family-ok", tokens: [i, i] })) });
const make = (ms = 15) => {
  const log = [];
  const player = { play: (f) => (log.push(`+${f}`), new Promise((r) => setTimeout(() => (log.push(`-${f}`), r(true)), ms))), stop() { log.push("stop"); }, synth: async () => true };
  return { log, V: createVoice({ index: clipIndex([]), player, path: "test", gapMs: 0 }) };
};

test("queue: true waits its turn and cuts nothing: every clip of the first line sounds, then the second, none over another", async () => {
  const { V, log } = make();
  const a = V.say(clips("a1", "a2"), { channel: "cook", queue: true });
  const b = V.say(clips("b1"), { channel: "cook", queue: true });
  const [ra, rb] = await Promise.all([a, b]);
  assert.deepEqual([ra.done, rb.done], [true, true]);
  assert.deepEqual(log, ["+a1", "-a1", "+a2", "-a2", "+b1", "-b1"], "no stop, no overlap, a whole before b");
});

test("a line without queue still replaces the one playing (the clinic's lines), and clears what was waiting", async () => {
  const { V, log } = make();
  const a = V.say(clips("a1", "a2"), { channel: "cook", queue: true });
  const w = V.say(clips("w1"), { channel: "cook", queue: true });
  const r = V.say(clips("r1"), { channel: "cook" });
  const [ra, rw, rr] = await Promise.all([a, w, r]);
  assert.deepEqual([ra.done, rw.done, rr.done], [false, false, true]);
  assert.ok(!log.includes("+a2") && !log.includes("+w1"));
});

test("ifIdle: an item's name is said only when nothing is saying or waiting; busy() counts a line waiting", async () => {
  const { V, log } = make();
  const a = V.say(clips("a1"), { channel: "cook", queue: true });
  const w = V.say(clips("w1"), { channel: "cook", queue: true });
  assert.equal(V.busy("cook"), true);
  const skipped = await V.say(clips("pop"), { channel: "cook", queue: true, ifIdle: true });
  assert.deepEqual([skipped.done, skipped.skipped], [false, true], "dropped, not queued behind");
  await Promise.all([a, w]);
  assert.equal(V.busy("cook"), false);
  const said = await V.say(clips("pop"), { channel: "cook", queue: true, ifIdle: true });
  assert.equal(said.done, true);
  assert.ok(!log.slice(0, log.indexOf("-w1")).includes("+pop") && log.includes("+pop"));
});

test("key and ttl: the newest count replaces an older one still waiting; a count that waited too long is not said (P10)", async () => {
  const { V, log } = make(40);
  const a = V.say(clips("line"), { channel: "cook", queue: true });
  const c1 = V.say(clips("one"), { channel: "cook", queue: true, key: "count", ttl: 1500 });
  const c2 = V.say(clips("two"), { channel: "cook", queue: true, key: "count", ttl: 1500 });
  const c3 = V.say(clips("three"), { channel: "cook", queue: true, key: "count", ttl: 1500 });
  const rs = await Promise.all([a, c1, c2, c3]);
  assert.deepEqual(rs.map((r) => r.done), [true, false, false, true]);
  assert.ok(log.includes("+three") && !log.includes("+one") && !log.includes("+two"));
  // too late
  const { V: V2, log: log2 } = make(80);
  const first = V2.say(clips("long"), { channel: "cook", queue: true });
  const late = V2.say(clips("late"), { channel: "cook", queue: true, key: "count", ttl: 20 });
  const [, rl] = await Promise.all([first, late]);
  assert.equal(rl.done, false);
  assert.ok(!log2.includes("+late"));
});

test("a stop clears the line playing and every line waiting (a station's end); the next line is heard", async () => {
  const { V, log } = make(30);
  const a = V.say(clips("a1", "a2"), { channel: "cook", queue: true });
  const w = V.say(clips("w1"), { channel: "cook", queue: true });
  await new Promise((r) => setTimeout(r, 10));
  V.stop("cook");
  const [ra, rw] = await Promise.all([a, w]);
  assert.deepEqual([ra.done, rw.done], [false, false]);
  assert.ok(!log.includes("+w1") && !log.includes("+a2"));
  const n = await V.say(clips("n1"), { channel: "cook", queue: true });
  assert.equal(n.done, true);
});

// ---- the device voice ----
function fakeSynth() {
  const S = {
    cancelAt: -1e9, spoken: [], dropped: [],
    cancel() { S.cancelAt = Date.now(); },
    // Chrome throws away an utterance spoken in the same breath as a cancel
    speak(u) {
      if (Date.now() - S.cancelAt < 100) return void S.dropped.push(u.text);
      S.spoken.push({ text: u.text, rate: u.rate });
      setTimeout(() => (u.onstart && u.onstart(), setTimeout(() => u.onend && u.onend(), 20)), 5);
    },
    getVoices: () => [{ lang: "gu-IN" }],
  };
  return S;
}

test("LNG-16: the device voice waits out a cancel (the request pop-up's stop), so the opening line's stand-in word is spoken, not thrown away", async () => {
  const S = fakeSynth();
  globalThis.speechSynthesis = S;
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  try {
    await deviceSpeak("warm up"); // (the first call puts the cancel watch on)
    S.cancel();
    const t0 = Date.now();
    const ok = await deviceSpeak("muke");
    assert.equal(ok, true);
    assert.deepEqual(S.dropped, [], "not spoken in the cancel's breath");
    assert.ok(S.spoken.some((u) => u.text === "muke"));
    assert.ok(Date.now() - t0 >= CANCEL_GAP_MS - 20, "it waited out the gap");
  } finally {
    delete globalThis.speechSynthesis;
    delete globalThis.SpeechSynthesisUtterance;
  }
});

test("LNG-09: the device voice speaks at normal speed (1.0), and one piece ends before the next begins", async () => {
  const S = fakeSynth();
  globalThis.speechSynthesis = S;
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  try {
    assert.equal(DEVICE_RATE, 1);
    await deviceSpeak("khape");
    assert.equal(S.spoken[0].rate, 1);
    // no voice installed: let go quickly rather than hold the line up
    S.getVoices = () => [];
    S.speak = () => {};
    const t0 = Date.now();
    await deviceSpeak("x");
    assert.ok(Date.now() - t0 < 600);
  } finally {
    delete globalThis.speechSynthesis;
    delete globalThis.SpeechSynthesisUtterance;
  }
});
