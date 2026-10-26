// SH-127 (Zafar, 22 Oct: "I said na ... it just shook"): the eye test's two-choice match (haa or na) on the family's own
// takes (data/family-audio.json, through Speech.familyTakes), the same code the browser runs (js/shared/speech.js).
//   * every take is heard leave-one-out (its own file is never a template), as recorded and through child-like shifts (pitch
//     and tempo up 20-30 %, a little noise): the pair's settings (Speech.PAIR) must name it right far more often than the
//     general settings did, and never name the other word;
//   * other family words (single short clips that are neither) are rarely taken for haa or na.
// Needs ffmpeg on PATH to decode the mp3s; skipped (with a note) without it.
// Run: node --test build/test_shared_speech_pair.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const Speech = require("../js/shared/speech.js");
const SR = Speech.SR;
const FF = spawnSync("ffmpeg", ["-version"]).status === 0;
const decode = (f) => {
  const r = spawnSync("ffmpeg", ["-loglevel", "error", "-i", join(ROOT, f), "-f", "f32le", "-ac", "1", "-ar", String(SR), "-"], { maxBuffer: 1 << 26 });
  return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length / 4);
};
// a take heard as a child might say it: resampled (pitch and tempo together), padded with room noise
const shift = (x, f, noise, seed = 7) => {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  const n = Math.floor(x.length / f);
  const pad = Math.floor(SR * 0.15);
  const y = new Float32Array(n + 2 * pad);
  for (let i = 0; i < n; i++) {
    const p = i * f;
    const j = Math.floor(p);
    const fr = p - j;
    y[pad + i] = (x[j] || 0) * (1 - fr) + (x[j + 1] || 0) * fr;
  }
  for (let i = 0; i < y.length; i++) y[i] += noise * rnd();
  return y;
};
const family = JSON.parse(readFileSync(join(ROOT, "data/family-audio.json"), "utf8"));
const TAKES = { yes: Speech.familyTakes(family, ["ha", "haa"]), no: Speech.familyTakes(family, ["na"]) };
const SHIFTS = [
  [1, 0],
  [1.2, 0.003],
  [1.3, 0.005],
];

test("familyTakes: every single-word take of haa and of na, never a phrase that starts with it", () => {
  assert.ok(TAKES.yes.length >= 4, `haa takes: ${TAKES.yes.join(", ")}`);
  assert.ok(TAKES.no.length >= 2, `na takes: ${TAKES.no.join(", ")}`);
  for (const f of [...TAKES.yes, ...TAKES.no]) assert.ok(existsSync(join(ROOT, f)), f);
  assert.ok(!TAKES.no.some((f) => /thank-you|khape/.test(f)), "a phrase is not a take of the word");
  assert.deepEqual(Speech.familyTakes([{ kutchi: "Ha!", file: "a.mp3", checked: "ok" }, { kutchi: "ha", file: "b.mp3", checked: "bad" }, { kutchi: "ha kadh", file: "c.mp3" }], ["ha"]), ["a.mp3"]);
});

test("the two-choice match names haa and na on the family's takes, leave-one-out, and never the wrong one", { skip: FF ? false : "no ffmpeg on PATH" }, (t) => {
  const pcm = {};
  for (const c in TAKES) for (const f of TAKES[c]) pcm[f] = decode(f);
  const tpl = (skip) => {
    const out = [];
    for (const c in TAKES) for (const f of TAKES[c]) if (f !== skip) out.push({ choice: c, feat: Speech.features(pcm[f], SR) });
    return out;
  };
  const score = (cfg) => {
    const r = { ok: 0, wrong: 0, none: 0, n: 0 };
    for (const c in TAKES)
      for (const f of TAKES[c]) {
        const t = tpl(f);
        for (const [k, nz] of SHIFTS) {
          const out = Speech.classify(Speech.queryFeatures(shift(pcm[f], k, nz), SR), t, cfg);
          r.n++;
          if (out.choice === c) r.ok++;
          else if (out.choice) r.wrong++;
          else r.none++;
        }
      }
    return r;
  };
  const pair = score(Speech.PAIR);
  const general = score({});
  t.diagnostic(`pair ${JSON.stringify(pair)} general ${JSON.stringify(general)}`);
  assert.equal(pair.wrong, 0, `the pair named the other word: ${JSON.stringify(pair)}`);
  assert.ok(pair.ok / pair.n >= 0.66, `the pair names at least 2 in 3: ${JSON.stringify({ pair, general })}`);
  assert.ok(pair.ok >= general.ok + Math.ceil(pair.n * 0.25), `the pair names far more than the general settings: ${JSON.stringify({ pair, general })}`);
});

test("other family words are rarely taken for haa or na", { skip: FF ? false : "no ffmpeg on PATH" }, () => {
  const t = [];
  for (const c in TAKES) for (const f of TAKES[c]) t.push({ choice: c, feat: Speech.features(decode(f), SR) });
  const others = family.filter((e) => e.speaker === "mum" && e.end - e.start <= 1.4 && !/^(ha|haa|na)\b/i.test(String(e.kutchi || "").trim()) && e.file && existsSync(join(ROOT, e.file))).slice(0, 40);
  let taken = 0;
  for (const e of others) if (Speech.classify(Speech.queryFeatures(decode(e.file), SR), t, Speech.PAIR).choice) taken++;
  assert.ok(others.length >= 20, `enough other words: ${others.length}`);
  assert.ok(taken / others.length <= 0.12, `${taken} of ${others.length} other words taken for haa or na`);
});

test("wavePath: a flat line in quiet, taller with the voice, always inside its box", () => {
  const ys = (d) => d.match(/[\d.]+ ([\d.]+)/g).map((p) => +p.split(" ")[1]);
  const quiet = ys(Speech.wavePath(0, 1, 172, 53));
  const loud = ys(Speech.wavePath(1, 1, 172, 53));
  const span = (a) => Math.max(...a) - Math.min(...a);
  assert.ok(span(quiet) < 3, `quiet span ${span(quiet)}`);
  assert.ok(span(loud) > 25, `loud span ${span(loud)}`);
  assert.ok(loud.every((y) => y >= 0 && y <= 53));
});
