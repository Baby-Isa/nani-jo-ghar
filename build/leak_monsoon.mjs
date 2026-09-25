#!/usr/bin/env node
/*
 * Monsoon rush: the Node leak bot and the engine checks (no browser).
 * Build brief task 1; design sections 8.1 and 8.5.
 *
 *   node build/leak_monsoon.mjs                    # everything: unit, check, bots (500 storms)
 *   node build/leak_monsoon.mjs --unit             # the grading unit cases
 *   node build/leak_monsoon.mjs --check 1000       # constraints + chi-squared over 1,000 storms per game/level
 *   node build/leak_monsoon.mjs --game g1 --level 1 --storms 500 --report
 *   node build/leak_monsoon.mjs --profile mixed    # word stages: known (all 3, the default, everything tested), mixed, fresh
 *   node build/leak_monsoon.mjs --drizzle          # Drizzle instead of Busy
 *   node build/leak_monsoon.mjs --english          # the recogniser on English speech vs the Kutchi closed set
 *   node build/leak_monsoon.mjs --write-audio      # (re)write data/monsoon-audio.json from the voice files
 *   --md FILE  also write the report as markdown
 *
 * Every bot must earn the ear star (the voice star for G3) in under 2% of
 * storms; 10% is a hard fail (exit code 1).
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { spawnSync, execSync } from "child_process";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const Calls = require(path.join(ROOT, "js/monsoon/calls.js"));
const Bots = require(path.join(ROOT, "js/monsoon/bots.js"));

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 && i + 1 < args.length && !args[i + 1].startsWith("--") ? args[i + 1] : d;
};
const flag = (n) => args.includes(n);
const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));

const D = readJSON("data/monsoon.json");
const COOK = readJSON("data/cook.json");
const SCENE = readJSON("data/scenes/kitchen-monsoon.json");
const AUDIO_PATH = "data/monsoon-audio.json";
let AUDIO = fs.existsSync(path.join(ROOT, AUDIO_PATH)) ? readJSON(AUDIO_PATH) : { clips: {} };

const md = [];
const out = (s = "") => {
  console.log(s);
  md.push(s);
};
let failed = false;

/* ------------------------------------------------------------ ffmpeg */
function ffmpegExe() {
  const w = spawnSync("which", ["ffmpeg"]);
  if (w.status === 0) return w.stdout.toString().trim();
  return execSync('python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"').toString().trim();
}
function decode(FF, file, sr) {
  const r = spawnSync(FF, ["-loglevel", "error", "-i", file, "-f", "f32le", "-ac", "1", "-ar", String(sr), "-"], { maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${file}`);
  const b = r.stdout;
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
}

/* ------------------------------------------------------------ the audio sidecar */
function writeAudio() {
  const FF = ffmpegExe();
  const tts = readJSON("data/cook-tts.json").lines;
  const clips = {};
  for (const [key, url] of Object.entries(tts)) {
    const f = path.join(ROOT, url);
    if (!fs.existsSync(f)) continue;
    const pcm = decode(FF, f, 16000);
    // trim the silence the TTS leaves at either end: the key word ends where the sound does
    let a = 0;
    let b = pcm.length;
    const thr = 0.01;
    while (a < b && Math.abs(pcm[a]) < thr) a++;
    while (b > a && Math.abs(pcm[b - 1]) < thr) b--;
    const dur = Math.round((pcm.length / 16000) * 1000) / 1000;
    const keyAt = Math.round((b / 16000) * 1000) / 1000;
    clips[key] = { file: url, dur, keyAt };
  }
  const doc = {
    _about:
      "Monsoon rush audio timing sidecar (build brief task 1): each voice clip's length (dur, s) and where its key word ends (keyAt, s), keyed like data/cook-tts.json (the normalised line; 'en|' for English placeholders). Until the family's recordings are marked up, keyAt is where the clip's sound ends (trailing silence trimmed). Written by `node build/leak_monsoon.mjs --write-audio`; meant to be merged into the audio manifest by the foundation (build_audio_manifest.py is not edited). A line with no clip is timed word by word, and a word with no clip is estimated (js/monsoon/calls.js partTime).",
    tokenGap: 0.08,
    clips,
  };
  fs.writeFileSync(path.join(ROOT, AUDIO_PATH), JSON.stringify(doc, null, 1) + "\n");
  AUDIO = doc;
  out(`wrote ${AUDIO_PATH}: ${Object.keys(clips).length} clips`);
}

/* ------------------------------------------------------------ helpers */
const profiles = {
  known: () => () => 3,
  fresh: () => () => 1,
  mixed: (seed) => {
    const R = Calls.rng(seed);
    const m = {};
    return (id) => (m[id] = m[id] || R.int(1, 4));
  },
};
function makeStorm(game, level, seed, extra = {}) {
  const prof = profiles[extra.profile || opt("--profile", "known")](seed * 3 + 1);
  return Calls.storm(game, level, {
    data: D,
    cook: COOK,
    audio: AUDIO,
    scene: SCENE,
    stage: prof,
    mode: extra.mode || (flag("--drizzle") ? "drizzle" : "busy"),
    seed,
  });
}
// chi-squared upper-tail p-value (Wilson-Hilferty)
function chiP(x2, k) {
  if (k <= 0) return 1;
  const z = (Math.pow(x2 / k, 1 / 3) - (1 - 2 / (9 * k))) / Math.sqrt(2 / (9 * k));
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? p : 1 - p;
}
function chi(counts) {
  const vals = Object.values(counts);
  const n = vals.reduce((s, x) => s + x, 0);
  const e = n / vals.length;
  const x2 = vals.reduce((s, x) => s + ((x - e) * (x - e)) / e, 0);
  return { x2, df: vals.length - 1, p: chiP(x2, vals.length - 1) };
}
const pct = (x) => `${(100 * x).toFixed(2)}%`;
const GAMES = ["g1", "g2", "g3", "g4", "g6"];

/* ------------------------------------------------------------ unit cases */
function unit() {
  out("## Grading unit cases");
  out("");
  let n = 0;
  let bad = 0;
  const expect = (name, got, want) => {
    n++;
    const ok = JSON.stringify(got) === JSON.stringify(want);
    if (!ok) bad++;
    out(`- ${ok ? "ok  " : "FAIL"} ${name}${ok ? "" : `: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
  };
  // one G1 wave, all words known (stage 3), Busy
  const s1 = makeStorm("g1", 1, 11, { profile: "known", mode: "busy" });
  const w = s1.waves[0];
  const T = Calls.timing(w, 10, s1);
  const tg = w.targets[0];
  const other = s1.candidates.find((c) => c.id !== tg.cand).id;
  const g = (answers, wave = w, TT = T, storm = s1) => Calls.grade(wave, TT, answers, storm).targets.t1;
  expect("early right is heard", g([{ t: T.keyEnd + 0.5, pick: tg.cand }]).outcome, "heard");
  expect("guessing before the key word ends, right, is heard", g([{ t: T.keyEnd - 0.2, pick: tg.cand }]).outcome, "heard");
  expect("early wrong is wrong", g([{ t: T.keyEnd + 0.5, pick: other }]).outcome, "wrong");
  expect("early wrong blames the noun", g([{ t: T.keyEnd + 0.5, pick: other }]).blame, [tg.word]);
  expect("late dive before the drop lands: late, but saved", [g([{ t: T.reveal.t1 + 0.1, pick: tg.cand }]).outcome, g([{ t: T.reveal.t1 + 0.1, pick: tg.cand }]).saved], ["late", true]);
  expect("a dive after it lands saves nothing", g([{ t: T.land.t1 + 0.3, pick: tg.cand }]).saved, false);
  expect("no answer is late", g([]).outcome, "late");
  expect("spam: the first tap is the answer, the rest ignored", g([{ t: T.keyEnd + 0.2, pick: other }, { t: T.keyEnd + 0.25, pick: tg.cand }]).outcome, "wrong");
  expect("camping: a tap before the call starts does nothing", g([{ t: T.t0 - 0.5, pick: tg.cand }]).outcome, "late");
  expect("a wrong answer, then a dive on the right pot after the reveal: still wrong, but saved", [g([{ t: T.keyEnd + 0.2, pick: other }, { t: T.reveal.t1 + 0.1, pick: tg.cand }]).outcome, g([{ t: T.keyEnd + 0.2, pick: other }, { t: T.reveal.t1 + 0.1, pick: tg.cand }]).saved], ["wrong", true]);
  // retry
  const rw = JSON.parse(JSON.stringify(w));
  rw.retry = true;
  const rg = Calls.grade(rw, T, [{ t: T.keyEnd + 0.4, pick: tg.cand }], s1).targets.t1;
  expect("a retry is graded but not counted for the ear", [rg.outcome, rg.graded], ["retry", "heard"]);
  // stage 1 (taught)
  const s0 = makeStorm("g1", 1, 12, { profile: "fresh", mode: "busy" });
  const w0 = s0.waves[0];
  const T0 = Calls.timing(w0, 10, s0);
  const r0 = Calls.grade(w0, T0, [{ t: T0.keyEnd + 0.4, pick: w0.targets[0].cand }], s0).targets.t1;
  expect("a stage-1 word is taught, not tested", r0.outcome, "taught");
  expect("a stage-1 word gets 2 extra beats", Math.round((T0.reveal.t1 - T0.keyEnd) / T0.beat), 4 + 2);
  expect("a fresh storm has at most 3 stage-1 words", s0.newWords.length <= 3, true);
  // double: order doesn't matter; sequence: it does
  const s2 = makeStorm("g1", 2, 5, { profile: "known", mode: "busy" });
  const wd = s2.waves.find((x) => x.frame === "double");
  const Td = Calls.timing(wd, 10, s2);
  const [a, b] = wd.targets;
  const gd = Calls.grade(wd, Td, [{ t: Td.keyEnd + 0.3, pick: b.cand }, { t: Td.keyEnd + 0.6, pick: a.cand }], s2).targets;
  expect("double: both right in either order", [gd.t1.outcome, gd.t2.outcome], ["heard", "heard"]);
  const s3 = makeStorm("g1", 3, 9, { profile: "known", mode: "busy" });
  const wsq = s3.waves.find((x) => x.frame === "sequence");
  const Ts = Calls.timing(wsq, 10, s3);
  expect("sequence: the second reveal is a beat later", Math.round((Ts.reveal.t2 - Ts.reveal.t1) * 1000) / 1000, Math.round(Ts.beat * 1000) / 1000);
  const gs = Calls.grade(wsq, Ts, [{ t: Ts.keyEnd + 0.3, pick: wsq.targets[1].cand }, { t: Ts.keyEnd + 0.6, pick: wsq.targets[0].cand }], s3).targets;
  expect("sequence: the wrong order is wrong for both", [gs.t1.outcome, gs.t2.outcome], ["wrong", "wrong"]);
  const wsw = s3.waves.find((x) => x.frame === "switch");
  if (wsw) {
    const Tw = Calls.timing(wsw, 10, s3);
    const gw = Calls.grade(wsw, Tw, [{ t: Tw.keyEnd - 0.1, pick: wsw.lure }], s3).targets.t1;
    expect("switch: lidding the first-named pot is wrong and blames the switch word", [gw.outcome, gw.blame.includes("ph-no")], ["wrong", true]);
  }
  // G2 counts
  const c1 = makeStorm("g2", 1, 21, { profile: "known", mode: "busy" });
  const wc = c1.waves.find((x) => x.targets[0].n === 3) || c1.waves[0];
  const Tc = Calls.timing(wc, 10, c1);
  const n3 = wc.targets[0].n;
  const pot = wc.targets[0].cand;
  const gc = (t) => Calls.grade(wc, Tc, t == null ? [] : [{ t, pick: pot }], c1).targets.t1;
  expect(`count: lid after drop ${n3} is heard`, gc(Tc.dropLand(n3) + 0.2).outcome, "heard");
  expect("count: an early lid is wrong, blaming the number", [gc(Tc.dropLand(n3) - 0.2).outcome, gc(Tc.dropLand(n3) - 0.2).why, gc(Tc.dropLand(n3) - 0.2).blame], ["wrong", "early", [wc.targets[0].slots.number]]);
  expect(`count: drop ${n3 + 1} landing first (no lid) is wrong`, [gc(null).outcome, gc(null).why], ["wrong", "overflow"]);
  expect(`count: lidding after drop ${n3 + 1} is wrong`, gc(Tc.dropLand(n3 + 1) + 0.1).outcome, "wrong");
  const c2 = makeStorm("g2", 2, 22, { profile: "known", mode: "busy" });
  const w2 = c2.waves[0];
  const T2 = Calls.timing(w2, 10, c2);
  const wrongPot = c2.candidates.find((c) => c.id !== w2.targets[0].cand).id;
  const g2 = Calls.grade(w2, T2, [{ t: T2.dropLand(w2.targets[0].n) + 0.2, pick: wrongPot }], c2).targets.t1;
  expect("count L2: the right count on the wrong pot blames the noun", [g2.outcome, g2.blame], ["wrong", [w2.targets[0].word]]);
  // G4 no-go
  const f2 = makeStorm("g4", 2, 3, { profile: "known", mode: "busy" });
  const wn = f2.waves.find((x) => x.targets[0].nogo);
  if (wn) {
    const Tn = Calls.timing(wn, 10, f2);
    expect("no-go: doing nothing is heard", Calls.grade(wn, Tn, [], f2).targets.t1.outcome, "heard");
    expect("no-go acted on is wrong", Calls.grade(wn, Tn, [{ t: Tn.keyEnd + 0.3, pick: "pull" }], f2).targets.t1.outcome, "wrong");
  }
  const wg = f2.waves.find((x) => !x.targets[0].nogo);
  const Tg = Calls.timing(wg, 10, f2);
  expect("weather: the right gesture is heard", Calls.grade(wg, Tg, [{ t: Tg.keyEnd + 0.3, pick: wg.targets[0].gesture }], f2).targets.t1.outcome, "heard");
  // Drizzle: the reveal waits
  const dz = makeStorm("g1", 1, 13, { profile: "known", mode: "drizzle" });
  const Tz = Calls.timing(dz.waves[0], 10, dz);
  expect("Drizzle: no reveal until the answer", Tz.reveal.t1, Infinity);
  expect("Drizzle: an answer 30 s later still counts", Calls.grade(dz.waves[0], Tz, [{ t: Tz.keyEnd + 30, pick: dz.waves[0].targets[0].cand }], dz).targets.t1.outcome, "heard");
  // the Busy stage rule
  const fake = () => {
    const st = {};
    const right = {};
    return {
      st,
      stage: (id) => st[id] || 3,
      right: (id) => (right[id] = (right[id] || 0) + 1),
      miss: (id) => (st[id] = Math.max(1, (st[id] || 3) - 1)),
      seen: () => {},
    };
  };
  const mkSess = (mode, grades) => {
    const s = makeStorm("g1", 1, 31, { profile: "known", mode });
    const S = Calls.session(s);
    const w0b = s.waves[0];
    const Tb = Calls.timing(w0b, 10, s);
    grades.forEach((a) => S.results.push({ wave: w0b, timing: Tb, answers: [], grade: Calls.grade(w0b, Tb, a(w0b, Tb, s), s) }));
    return { S, word: w0b.targets[0].word };
  };
  const wrongA = (w0b, Tb, s) => [{ t: Tb.keyEnd + 0.3, pick: s.candidates.find((c) => c.id !== w0b.targets[0].cand).id }];
  {
    const { S, word } = mkSess("busy", [() => [], () => [], () => []]);
    const api = fake();
    Calls.applyProgress(S, api);
    expect("Busy: late never drops a word", api.stage(word), 3);
  }
  {
    const { S, word } = mkSess("busy", [wrongA]);
    const api = fake();
    const log = Calls.applyProgress(S, api);
    expect("Busy: one wrong counts half (no drop yet)", [api.stage(word), log[0].op], [3, "half"]);
  }
  {
    const { S, word } = mkSess("busy", [wrongA, wrongA, wrongA, wrongA]);
    const api = fake();
    Calls.applyProgress(S, api);
    expect("Busy: at most one stage per storm", api.stage(word), 2);
  }
  {
    const { S, word } = mkSess("drizzle", [wrongA]);
    const api = fake();
    Calls.applyProgress(S, api);
    expect("Drizzle: a wrong counts as a whole miss", api.stage(word), 2);
  }
  out("");
  out(`${n - bad}/${n} unit cases pass`);
  if (bad) failed = true;
  out("");
}

/* ------------------------------------------------------------ constraints and chi-squared */
function check(N) {
  out(`## Generator: section 8.1 constraints and chi-squared over ${N} storms per game and level`);
  out("");
  out("| Game | Level | Constraint failures | Targets χ² p | Slots χ² p | Next-slot distance χ² p | Candidates | Pool |");
  out("|---|---|---|---|---|---|---|---|");
  for (const game of GAMES) {
    for (let level = 1; level <= 3; level++) {
      let fails = 0;
      const firstFail = [];
      const tCount = {};
      const sCount = {};
      const dCount = {};
      let nc = 0;
      let pool = 0;
      for (let i = 0; i < N; i++) {
        const s = makeStorm(game, level, 1000 + i);
        const bad = Calls.check(s, D);
        if (bad.length) {
          fails++;
          if (firstFail.length < 2) firstFail.push(bad[0]);
        }
        nc = s.candidates.length;
        pool = s.pool.length;
        let prevSlot = null;
        s.waves.forEach((w) => {
          w.targets.forEach((t) => {
            const key = s.kind === "count" ? `${t.word}:${t.n}` : s.kind === "weather" ? t.word : t.word;
            if (s.kind === "count") tCount[t.n] = (tCount[t.n] || 0) + 1;
            else tCount[key] = (tCount[key] || 0) + 1;
            const c = s.candidates.find((x) => x.id === t.cand);
            if (c && s.kind !== "weather" && !(s.kind === "count" && !s.cfg.named)) {
              sCount[c.slot] = (sCount[c.slot] || 0) + 1;
              if (prevSlot != null) {
                const d = Math.abs(c.slot - prevSlot);
                dCount[d] = (dCount[d] || 0) + 1;
              }
              prevSlot = c.slot;
            }
          });
        });
      }
      // the distance distribution should match independent uniform picks of different targets
      let dP = "–";
      if (Object.keys(dCount).length > 1) {
        const slots = [...new Set(Object.keys(sCount).map(Number))];
        const exp = {};
        slots.forEach((a) => slots.forEach((b) => a !== b && (exp[Math.abs(a - b)] = (exp[Math.abs(a - b)] || 0) + 1)));
        const tot = Object.values(dCount).reduce((s, x) => s + x, 0);
        const etot = Object.values(exp).reduce((s, x) => s + x, 0);
        let x2 = 0;
        Object.keys(exp).forEach((d) => {
          const e = (exp[d] / etot) * tot;
          x2 += ((dCount[d] || 0) - e) ** 2 / e;
        });
        dP = chiP(x2, Object.keys(exp).length - 1).toFixed(3);
      }
      const tc = chi(tCount);
      const sc = Object.keys(sCount).length > 1 ? chi(sCount).p.toFixed(3) : "–";
      // weather at level 1 is state-dependent by design (rain only when the tarp is off), so not uniform
      const tp = game === "g4" && level === 1 ? `${tc.p.toFixed(3)} (by design, state-led)` : tc.p.toFixed(3);
      if (fails) failed = true;
      out(`| ${game} | ${level} | ${fails}${firstFail.length ? " (" + firstFail.join("; ") + ")" : ""} | ${tp} | ${sc} | ${dP} | ${nc} | ${pool} |`);
    }
  }
  out("");
  out("p-values well above 0.01 mean the targets, positions and jumps look uniform; a failure column other than 0 fails the run.");
  out("");
}

/* ------------------------------------------------------------ the bots */
function bots(N, games, levels) {
  const LIM = D.bots || { warn: 0.02, fail: 0.1 };
  const mode = flag("--drizzle") ? "drizzle" : "busy";
  out(`## Leak bots: ${N} storms each, ${mode}, word profile "${opt("--profile", "known")}"`);
  out("");
  out("The rate is storms in which the bot earned the ear star (the voice star for G3, which has no ear star). Heard is the bot's share of tested calls heard; craft is the umbrella star rate.");
  out("");
  out("| Game | Level | Bot | Ear star (voice for G3) | Heard / tested | Craft star | Verdict |");
  out("|---|---|---|---|---|---|---|");
  const englishHeard = englishModel();
  for (const game of games) {
    const kind = D.games[game].kind;
    for (const level of levels) {
      for (const name of Bots.names[kind]) {
        const bot = Bots.make(name, 77);
        let star = 0;
        let craft = 0;
        let heard = 0;
        let tested = 0;
        for (let i = 0; i < N; i++) {
          const s = makeStorm(game, level, 50000 + i);
          bot.reset();
          const S = Bots.play(s, bot, { menu: D.menu_words, englishHeard });
          const r = Calls.stars(S);
          if (kind === "say" ? r.stars.voice : r.stars.ear) star++;
          if (r.stars.hand) craft++;
          heard += kind === "say" ? r.tally.voiceOk : r.tally.heard;
          tested += kind === "say" ? r.tally.voiceCalls : r.tally.tested;
        }
        const rate = star / N;
        const verdict = rate >= LIM.fail ? "**FAIL**" : rate >= LIM.warn ? "warn" : "ok";
        if (rate >= LIM.fail) failed = true;
        out(`| ${game} | ${level} | ${name} | ${pct(rate)} | ${tested ? pct(heard / tested) : "–"} | ${pct(craft / N)} | ${verdict} |`);
      }
    }
  }
  out("");
}

/* ------------------------------------------------------------ the english bot */
// The recogniser (js/shared/speech.js, the same code the browser runs) on
// English speech against the Kutchi closed set: it should mostly say null.
let _english = null;
function englishModel() {
  return _english || (() => null);
}
function english() {
  let Speech;
  try {
    Speech = require(path.join(ROOT, "js/shared/speech.js"));
  } catch (e) {
    out("english: js/shared/speech.js not loadable in Node; skipped");
    return;
  }
  let FF;
  try {
    FF = ffmpegExe();
  } catch (e) {
    out("english: no ffmpeg (pip install imageio-ffmpeg); skipped");
    return;
  }
  const tts = readJSON("data/cook-tts.json").lines;
  const choices = ["cook-paani", "cook-dudh", "cook-chai", "cook-atto", "cook-daal", "cook-khun", "spi-16"];
  const tokOf = (id) => Calls.norm(COOK.words[id].kutchi);
  for (const id of choices) {
    const url = tts[tokOf(id)];
    if (!url) continue;
    const pcm = decode(FF, path.join(ROOT, url), Speech.SR);
    Speech.addTemplate(id, Speech.features(pcm, Speech.SR), `family:${url}`);
    // the "ne X" take is a second template, as a second family recording would be
    const url2 = tts["ne " + tokOf(id)];
    if (url2) Speech.addTemplate(id, Speech.features(decode(FF, path.join(ROOT, url2), Speech.SR), Speech.SR), `family:${url2}`);
  }
  const english = Object.keys(tts).filter((k) => k.startsWith("en|"));
  const extra = fs.readdirSync(path.join(ROOT, "build/voice-test")).filter((f) => f.includes("english")).map((f) => "build/voice-test/" + f);
  const queries = english.map((k) => tts[k]).concat(extra);
  const res = { null: 0, named: 0, byChoice: {} };
  const tpl = Speech.templatesFor(choices);
  for (const q of queries) {
    const pcm = decode(FF, path.join(ROOT, q), Speech.SR);
    const r = Speech.classify(Speech.queryFeatures(pcm, Speech.SR), tpl);
    if (r.choice) {
      res.named++;
      res.byChoice[r.choice] = (res.byChoice[r.choice] || 0) + 1;
    } else res.null++;
  }
  // self-check: each Kutchi clip should name itself (leave-one-out would be stricter; there's one take)
  let self = 0;
  let selfN = 0;
  for (const id of choices) {
    const url = tts[tokOf(id)];
    if (!url) continue;
    selfN++;
    const pcm = decode(FF, path.join(ROOT, url), Speech.SR);
    const r = Speech.classify(Speech.queryFeatures(pcm, Speech.SR), tpl);
    if (r.choice === id) self++;
  }
  const tot = res.null + res.named;
  out("## The english bot: the recogniser on English speech");
  out("");
  out(`Closed set: ${choices.length} kitchen words, templates from the placeholder voice (bare word and "ne X"). Queries: ${tot} English clips (the game's English placeholder voice, plus build/voice-test's English takes).`);
  out("");
  out(`- null (no choice named): **${res.null}/${tot} (${pct(res.null / tot)})**`);
  out(`- named a Kutchi word: ${res.named}/${tot}${res.named ? " (" + Object.entries(res.byChoice).map(([k, v]) => `${k} ${v}`).join(", ") + ")" : ""}`);
  out(`- sanity: the Kutchi clips name themselves ${self}/${selfN}`);
  out("");
  const pNamed = res.named / tot;
  // for the G3 bot: an English speaker's call is named at this rate, uniformly among the choices it named
  _english = (target) => null;
  _english.rate = pNamed;
  // the bot says the English word for what it sees: whatever the recogniser picks is target only by chance
  const R = Calls.rng(99);
  _english = (target) => (R() < pNamed ? R.pick(choices) : null);
  if (res.null / tot < 0.5) out("**warn:** fewer than half of English calls come back null");
}

/* ------------------------------------------------------------ main */
const t0 = Date.now();
if (flag("--write-audio")) writeAudio();
const any = ["--unit", "--check", "--game", "--report", "--english", "--storms"].some(flag);
if (flag("--unit") || !any) unit();
if (flag("--check") || !any) check(Number(opt("--check", 1000)));
if (flag("--english") || !any) english();
if (flag("--game") || flag("--report") || flag("--storms") || !any) {
  const games = opt("--game") ? [opt("--game")] : GAMES;
  const levels = opt("--level") ? [Number(opt("--level"))] : [1, 2, 3];
  bots(Number(opt("--storms", 500)), games, levels);
}
out(`${failed ? "FAILED" : "all passed"} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
if (opt("--md")) fs.writeFileSync(opt("--md"), md.join("\n") + "\n");
process.exit(failed ? 1 : 0);
