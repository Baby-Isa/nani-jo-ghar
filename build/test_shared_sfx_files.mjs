// CHAI-92 / SH-226 (Zafar's picks, 6 Nov; the contract rule of the sound library): every sound chai calls exists (a recipe in
// js/shared/sfx.js, or one of its recorded files on disk), every recorded file in assets/shared/sfx/ has its SOURCES.md row with a
// licence, only the picked files are named by the game (the others stay for lab/juice.html), and the voice gate holds: no effect
// longer than a tick starts while a family voice line sounds.
//   node --test build/test_shared_sfx_files.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const rd = (p) => readFileSync(join(ROOT, p), "utf8");
// (comments left out: a doc line naming a sound is not a call)
const code = (p) => rd(p).replace(/\/\*[\s\S]*?\*\/|(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
const Sfx = require("../js/shared/sfx.js");
const SFX_DIR = "assets/shared/sfx";
const sfxSrc = rd("js/shared/sfx.js");
const LOOPS = new Set([...((sfxSrc.match(/const LOOPS = \{([\s\S]*?)\n {2}\};/) || [])[1] || "").matchAll(/^\s{4}(?:"([\w-]+)"|(\w+)):/gm)].map((m) => m[1] || m[2]));

// Cook.sfx.<method> -> the shared sound it plays (js/cook/core.js: `method: (...) => fx("name"...)` or fxLoop / Sfx.loop("name"))
const coreSrc = code("js/cook/core.js");
const cookBlock = (coreSrc.match(/Cook\.sfx = \{([\s\S]*?)\n {2}\};/) || [])[1] || "";
const COOK = {};
for (const m of cookBlock.matchAll(/^\s{4}(\w+):[^\n]*?(?:fx|fxLoop)\("([\w-]+)"/gm)) COOK[m[1]] = { name: m[2], loop: /fxLoop\(/.test(m[0]) };
for (const m of cookBlock.matchAll(/^\s{4}(\w+):[^\n]*?Sfx\.loop\("([\w-]+)"/gm)) COOK[m[1]] = { name: m[2], loop: true };

// what chai plays: its station, the kit's hob, the serve and the word moment and end screen it shows
const CHAI = ["js/cook/stations/chai-tray.js", "js/cook/kitchen-kit.js", "js/cook/flow.js", "js/shared/word-moment.js", "js/shared/results.js"];
const calls = () => {
  const out = [];
  for (const f of CHAI) {
    const s = code(f);
    for (const m of s.matchAll(/\bCook\.sfx\.(?!preload\b)(\w+)\(/g)) out.push({ f, via: `Cook.sfx.${m[1]}`, ...(COOK[m[1]] || { name: null }) });
    // the shared files' own small helpers: sfx("name") (results.js, word-moment.js) and Sfx.play / Sfx.loop
    for (const m of s.matchAll(/\b(?:sfx|Sfx\.play)\(\s*["'`]([\w-]+)["'`]/g)) out.push({ f, via: m[0], name: m[1], loop: false });
    for (const m of s.matchAll(/\bSfx\.loop\(\s*["'`]([\w-]+)["'`]/g)) out.push({ f, via: m[0], name: m[1], loop: true });
  }
  return out;
};

test("Cook.sfx's map is read from js/cook/core.js", () => {
  for (const k of ["pop", "knob", "flame", "green", "glass", "settle", "sparkle", "drop", "simmerLoop", "pourLoop"]) assert.ok(COOK[k], k);
  assert.equal(COOK.simmerLoop.name, "simmer");
  assert.equal(COOK.simmerLoop.loop, true);
});

test("every sound chai calls exists: a recipe, a loop, or a recorded file on disk", () => {
  const bad = [];
  const seen = calls();
  assert.ok(seen.length > 15, `read ${seen.length} calls`);
  for (const c of seen) {
    if (!c.name) {
      bad.push(`${c.f}: ${c.via} is not in Cook.sfx (js/cook/core.js)`);
      continue;
    }
    const file = Sfx.files[c.name];
    if (file) {
      if (!existsSync(join(ROOT, SFX_DIR, file + ".mp3"))) bad.push(`${c.f}: ${c.via} -> ${file}.mp3 is not in ${SFX_DIR}`);
    } else if (c.loop ? !LOOPS.has(c.name) : !Sfx.names.includes(c.name)) bad.push(`${c.f}: ${c.via} -> "${c.name}" is no sound of js/shared/sfx.js`);
  }
  assert.deepEqual(bad, []);
});

test("chai calls each of Zafar's picks (6 Nov)", () => {
  const names = new Set(calls().map((c) => c.name));
  for (const n of ["cook-pop", "knob", "flame", "simmer", "green", "glass", "drop", "settle", "sparkle", "pour-tea", "pour-glass", "pour-short"]) assert.ok(names.has(n), n);
});

const SOURCES = rd(join(SFX_DIR, "SOURCES.md"));
const rowOf = (file) => SOURCES.split("\n").find((l) => l.startsWith(`| ${file} |`));
test("every recorded file has its SOURCES.md row, with a licence", () => {
  const files = readdirSync(join(ROOT, SFX_DIR)).filter((f) => f.endsWith(".mp3"));
  assert.ok(files.length >= 7);
  const bad = [];
  for (const f of files) {
    const row = rowOf(f);
    if (!row) bad.push(`${f}: no row`);
    else if (!/\| (CC0|Mixkit SFX Free) \|/.test(row)) bad.push(`${f}: no licence in its row`);
  }
  // and every row is a file
  for (const m of SOURCES.matchAll(/^\| ([\w-]+\.mp3) \|/gm)) if (!files.includes(m[1])) bad.push(`${m[1]}: a row with no file`);
  assert.deepEqual(bad, []);
});

test("only the picked files are named by the game (the others stay for the lab)", () => {
  assert.deepEqual([...new Set(Object.values(Sfx.files))].sort(), ["ding-a", "flame-b", "glass-c", "knob-a", "pour-a", "settle-a", "simmer-a", "sparkle-a"]);
  const picked = new Set(Object.values(Sfx.files));
  const others = readdirSync(join(ROOT, SFX_DIR)).filter((f) => f.endsWith(".mp3")).map((f) => f.slice(0, -4)).filter((s) => !picked.has(s));
  const bad = [];
  const walk = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".js") ? [join(dir, e.name)] : []));
  for (const f of walk("js").filter((f) => !f.startsWith("js/vendor"))) {
    const s = code(f);
    for (const o of others) if (new RegExp(`["'\`/]${o}(\\.mp3)?["'\`]`).test(s)) bad.push(`${f}: names ${o}`);
  }
  assert.deepEqual(bad, []);
  // (a picked Mixkit file is Zafar's decision before the stores: listed, not failed)
  const mixkit = Object.values(Sfx.files).filter((s) => /Mixkit SFX Free/.test(rowOf(s + ".mp3") || ""));
  assert.deepEqual(mixkit.sort(), ["ding-a", "knob-a", "sparkle-a"]);
});

// ---- the voice gate, on a stand-in Web Audio (every node a recorder) ----
function fakeAudio() {
  const made = [];
  const param = () => ({ value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} });
  const node = (kind) => {
    const n = { kind, gain: param(), frequency: param(), Q: param(), connect: (x) => x, start() { made.push(n); }, stop() {}, type: "", buffer: null, loop: false };
    return n;
  };
  class AC {
    constructor() {
      this.state = "running";
      this.currentTime = 0;
      this.sampleRate = 8000;
      this.destination = node("out");
    }
    createGain() {
      const g = node("gain");
      made.push(g);
      return g;
    }
    createOscillator() { return node("osc"); }
    createBiquadFilter() { return node("filter"); }
    createBufferSource() { return node("src"); }
    createBuffer(c, len) { return { getChannelData: () => new Float32Array(len), duration: len / 8000 }; }
    resume() { return Promise.resolve(); }
  }
  class OAC { decodeAudioData(ab, ok) { ok({ duration: 1.2, file: ab.file }); } }
  return { made, AC, OAC };
}
function freshSfx(fake, busy) {
  const root = { AudioContext: fake.AC, OfflineAudioContext: fake.OAC, setInterval: () => 1, clearInterval() {}, setTimeout: (f) => f(), dispatchEvent() {}, CustomEvent: class {}, fetch: (u) => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve({ file: u }) }) };
  globalThis.self = root;
  delete require.cache[require.resolve("../js/shared/sfx.js")];
  const S = require("../js/shared/sfx.js");
  delete globalThis.self;
  S.voiceBusy = () => busy.on;
  return S;
}

test("the gate: no effect longer than a tick starts under a family voice line; a tick plays ducked", async () => {
  const fake = fakeAudio();
  const busy = { on: false };
  const S = freshSfx(fake, busy);
  assert.equal(S.play("cook-soft"), true, "plays when no one speaks");
  busy.on = true;
  assert.equal(S.play("cook-soft"), false, "160 ms: not under a voice");
  assert.equal(S.play("gold"), false);
  assert.equal(S.play("shutter"), false);
  const before = fake.made.length;
  assert.equal(S.play("cook-pop"), true, "an 80 ms tick still answers the tap");
  const out = fake.made.slice(before).find((n) => n.kind === "gain");
  assert.ok(out && Math.abs(out.gain.value - 0.35 * S.volume) < 1e-9, `ducked to x0.35 (${out && out.gain.value})`);
  assert.equal(S.play("drop"), true, "the drop's plink is a tick");
  assert.equal(S.play("cook-soft", { under: true }), true, "under: true is the caller's own choice");
  // the recorded ones: not in yet -> skipped (never late); in -> gated like the rest
  busy.on = false;
  assert.equal(S.play("glass"), false, "not loaded yet: skipped, not late");
  await S.preload(["glass", "knob", "simmer"]);
  assert.equal(S.play("glass"), true);
  busy.on = true;
  assert.equal(S.play("glass"), false, "the glass's 1.2 s ring never starts under a voice");
  assert.equal(S.play("knob"), false, "the knob's 235 ms click neither");
  assert.equal(S.play("flame", { delay: 180 }), false, "nor a delayed one");
  // the simmer loop starts silent under a voice
  const L = S.loop("simmer", { volume: 0.6 });
  assert.ok(L && !L.none, "the loop starts");
  L.stop();
});

test("muted: nothing plays, recorded or made", async () => {
  const fake = fakeAudio();
  const S = freshSfx(fake, { on: false });
  await S.preload(["glass"]);
  S.muted = true;
  assert.equal(S.play("glass"), false);
  assert.equal(S.play("cook-pop"), false);
  assert.ok(S.loop("simmer").none);
});
