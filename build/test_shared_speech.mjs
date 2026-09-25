// Node tests for js/shared/speech.js as a module: classify / listen on
// synthetic "words", profile-scoped enrolment capped at three takes, the
// enrolment rule, template URLs from the audio manifest, and the log.
// Run: node --test build/test_shared_speech.mjs   (or: node --test build/)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => (store[k] = String(v)),
  removeItem: (k) => delete store[k],
};
const Speech = require("../js/shared/speech.js");
const SR = Speech.SR;

// A voiced "word": a glottal-ish harmonic source whose two formants glide
// between the given frequencies, with a little noise. Different glides are
// different words; pitch and noise vary between takes.
function word(f1a, f1b, f2a, f2b, { pitch = 140, dur = 0.6, noise = 0.01, seed = 1 } = {}) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  const n = Math.round(dur * SR);
  const pad = Math.round(0.25 * SR);
  const x = new Float32Array(n + 2 * pad);
  for (let i = 0; i < x.length; i++) x[i] = noise * 0.2 * rnd();
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f1 = f1a + (f1b - f1a) * t;
    const f2 = f2a + (f2b - f2a) * t;
    let v = 0;
    for (let h = 1; h * pitch < 5000; h++) {
      const f = h * pitch;
      const g = Math.exp(-(((f - f1) / 120) ** 2)) + 0.7 * Math.exp(-(((f - f2) / 180) ** 2)) + 0.02;
      v += g * Math.sin((2 * Math.PI * f * i) / SR);
    }
    const env = Math.min(1, t * 12, (1 - t) * 12);
    x[pad + i] = 0.2 * env * v + noise * rnd();
  }
  return x;
}
const WORDS = {
  chai: [300, 800, 2200, 1200],
  dudh: [800, 300, 1000, 2400],
  khun: [500, 500, 1500, 1500],
};
const take = (w, o) => word(...WORDS[w], o);

function freshBank() {
  for (const k of Object.keys(Speech.templates)) delete Speech.templates[k];
}
function loadFamily() {
  freshBank();
  for (const w of Object.keys(WORDS))
    for (const [i, pitch] of [110, 130].entries()) Speech.addTemplate(w, Speech.features(take(w, { pitch, seed: 10 + i }), SR), `family:${w}${i}`);
}

test("listen names the right word from a different take (pcm path)", async () => {
  loadFamily();
  for (const w of Object.keys(WORDS)) {
    const r = await Speech.listen({ choices: Object.keys(WORDS), pcm: take(w, { pitch: 150, seed: 99, noise: 0.02 }) });
    assert.ok(r, `null for ${w}`);
    assert.equal(r.choice, w);
    assert.ok(r.confidence >= 0 && r.confidence <= 1);
  }
});

test("listen: fewer than two choices, or a choice without templates, is null", async () => {
  loadFamily();
  assert.equal(await Speech.listen({ choices: ["chai"], pcm: take("chai") }), null);
  assert.equal(await Speech.listen({ choices: ["chai", "elchi"], pcm: take("chai") }), null);
});

test("listen drops the audio: Speech.last keeps features, never pcm", async () => {
  loadFamily();
  await Speech.listen({ choices: ["chai", "dudh"], pcm: take("chai", { seed: 5 }) });
  assert.ok(Speech.last.feat.length > 3);
  assert.equal(Speech.last.pcm, undefined);
});

test("no mic in Node: status is absent and a mic listen is a quiet null", async () => {
  loadFamily();
  assert.equal(Speech.status(), "absent");
  assert.equal(await Speech.listen({ choices: ["chai", "dudh"] }), null);
  Speech.cancel(); // safe with nothing running
  assert.equal(Speech.busy(), false);
});

test("confirm: parent always enrols, the game only on a clear margin", async () => {
  loadFamily();
  Speech.setProfile("layla");
  await Speech.listen({ choices: ["chai", "dudh", "khun"], pcm: take("chai", { seed: 7 }) });
  const m = Speech.last.result.margin;
  assert.equal(Speech.shouldEnrol(Speech.last, "chai", "game"), m >= Speech.ENROL_MARGIN);
  assert.equal(Speech.shouldEnrol(Speech.last, "dudh", "game"), false, "game never enrols a word it didn't hear");
  assert.equal(Speech.shouldEnrol(Speech.last, "dudh", "parent"), true);
  assert.equal(Speech.confirm("chai", "parent"), true);
  assert.equal(Speech.confirm("chai", "parent"), false, "one take enrols once");
  assert.equal(Speech.enrolmentCount("chai"), 1);
});

test("enrolment keeps at most three takes per word, newest wins", async () => {
  loadFamily();
  Speech.setProfile("zayn");
  Speech.clearEnrolments();
  for (let i = 0; i < 5; i++) assert.ok(Speech.enrol("dudh", take("dudh", { seed: 30 + i })));
  assert.equal(Speech.enrolmentCount("dudh"), Speech.MAX_TAKES);
  assert.equal(Speech.templates.dudh.filter((t) => t.from.startsWith("family:")).length, 2, "family templates untouched");
});

test("enrolments are per profile and persist through the store", async () => {
  loadFamily();
  Speech.setProfile("maryam");
  Speech.clearEnrolments();
  Speech.enrol("khun", take("khun", { seed: 41 }));
  assert.equal(Speech.enrolmentCount("khun"), 1);
  Speech.setProfile("isa");
  assert.equal(Speech.enrolmentCount("khun"), 0, "another child's takes are not loaded");
  Speech.setProfile("maryam");
  assert.equal(Speech.enrolmentCount("khun"), 1, "reloaded from storage");
  assert.ok(Object.keys(store).some((k) => k.endsWith(":maryam")));
  Speech.clearEnrolments("khun");
  assert.equal(Speech.enrolmentCount("khun"), 0);
  Speech.setProfile("default");
});

test("templateUrls reads family recordings only", () => {
  const manifest = { word: ["cook-chai", "cook-chai__2", "cook-dudh"], "cook-tts": ["chai"], carrier: ["cook-chai"] };
  assert.deepEqual(Speech.templateUrls("cook-chai", manifest), ["assets/audio/word/cook-chai.mp3", "assets/audio/word/cook-chai__2.mp3"]);
  assert.deepEqual(Speech.templateUrls("chai", manifest), []);
});

test("logMoment appends and calls onLog", () => {
  const seen = [];
  Speech.onLog = (e) => seen.push(e);
  const e = Speech.logMoment({ mode: "cook", choices: ["a", "b"], result: "a", via: "voice" });
  assert.ok(e.t > 0);
  assert.equal(seen.length, 1);
  assert.equal(Speech.log[Speech.log.length - 1], e);
  Speech.onLog = null;
});
