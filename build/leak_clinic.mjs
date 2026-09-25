#!/usr/bin/env node
/*
 * The clinic's leak bot (the Sceptic as code; no browser).
 * docs/modes/clinic-design.md R3.9 phase 1, 8.3, R2.2 (sweep, leftovers),
 * R3.4 (mumble).
 *
 * It plays the SAME graded rows the game plays (js/clinic/visit.js makes
 * them; ClinicVisit.judge grades them; earStar / voiceStar are the star
 * rules) with players that never hear the words. Each strategy sees only
 * what's on screen (the parts, their size, the trolley in its shuffled
 * order), what happened in earlier visits (which answers were right), and
 * the length of each spoken line (a duration model with take-to-take
 * jitter: data/clinic.json `bot`), never the words themselves.
 *
 * Pass (R3.9): the fair bot 100% ear stars (and voice stars where a visit
 * has speaking rows); every leak strategy under 10% over 500 visits per
 * type per level. Every row is an English placeholder today, so every
 * result is flagged "not yet a Kutchi test".
 *
 * It also runs the speaking core (js/clinic/mechanics/tell.js) through its
 * four paths with a fake recogniser: accepted, a wrong hearing, nothing
 * heard -> "say it again?" -> the pills, and a grown-up judging.
 *
 * Usage: node build/leak_clinic.mjs [--visits 500] [--seed 1] [--json out.json]
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const V = require(path.join(ROOT, "js/clinic/visit.js"));
const T = require(path.join(ROOT, "js/clinic/mechanics/tell.js"));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data/clinic.json"), "utf8"));

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const N = Number(arg("--visits", 500));
const SEED = Number(arg("--seed", 1));
const JSON_OUT = arg("--json", null);

/* ---------------- what the bot can hear: only a line's length ---------------- */
const B = data.bot || {};
function english(id) {
  if (typeof id === "number") return String(id);
  return ((data.words || {})[id] || {}).english || id;
}
function lineText(l) {
  if (!l) return "";
  const f = (data.lines[l.frame] || {}).e || "";
  return f.replace("{x}", (l.x || []).map(english).join(" ")).replace("{y}", (l.y || []).map(english).join(" "));
}
// each distinct line was "recorded" in B.takes takes; each hearing plays one of them
const takes = new Map();
function duration(l, r) {
  const t = lineText(l);
  if (!takes.has(t)) {
    const base = B.frameSec + t.length * B.secPerChar;
    takes.set(t, Array.from({ length: B.takes }, () => base * (1 + B.jitter * (r() * 2 - 1))));
  }
  const ts = takes.get(t);
  // heard, not measured: lengths are perceived to within the Weber fraction
  const g = Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
  return ts[Math.floor(r() * ts.length)] * (1 + (B.weber || 0) * g);
}
/** The length of one word said on its own ("the knee, or the foot?": what echo compares). */
const wordDur = (id) => B.frameSec * 0.4 + english(id).length * B.secPerChar;

/* ---------------- strategies (tap rows) ---------------- */
const SAL = data.salience || {};
const sal = (o) => (typeof o === "string" ? SAL[o.split("#")[0]] || 0 : 0);
const WAIT = Symbol("wait");

function makeMemory() {
  return { freq: {}, slotFreq: {}, last: {}, durs: [], prevVisitLast: {} };
}
const TAP = {
  fair: (row) => row.accept[0],
  random: (row, m, r) => V.pick(row.screen, r),
  salience: (row) => (row.kind === "part" || row.kind === "path" ? row.screen.slice().sort((a, b) => sal(b) - sal(a))[0] : row.screen[0]),
  frequency: (row, m, r) => {
    const f = m.freq[row.kind] || {};
    const best = row.screen.slice().sort((a, b) => (f[b] || 0) - (f[a] || 0) || r() - 0.5)[0];
    return best;
  },
  slotmemory: (row, m, r) => {
    const f = m.slotFreq[row.kind] || {};
    const idx = [...row.screen.keys()].sort((a, b) => (f[b] || 0) - (f[a] || 0) || r() - 0.5)[0];
    return row.screen[idx];
  },
  repeat: (row, m, r) => (m.prevVisitLast[row.kind] != null && row.screen.includes(m.prevVisitLast[row.kind]) ? m.prevVisitLast[row.kind] : V.pick(row.screen, r)),
  duration: (row, m, r) => {
    // nearest heard line of the same kind whose answer was then shown
    const same = m.durs.filter((d) => d.kind === row.kind && row.screen.includes(d.answer));
    if (!same.length) return V.pick(row.screen, r);
    same.sort((a, b) => Math.abs(a.dur - row.dur) - Math.abs(b.dur - row.dur));
    return same[0].answer;
  },
  wait: () => WAIT,
  visualcue: (row, m, r) => (row.cue != null && row.screen.includes(row.cue) ? row.cue : V.pick(row.screen, r)),
  sweep: (row, m, r) => TAP.salience(row, m, r), // taps every part in salience order: the first tap is what counts
  leftovers: (row, m, r, vs) => {
    const left = row.screen.filter((o) => !(vs.checked[row.kind] || new Set()).has(o));
    return V.pick(left.length ? left : row.screen, r);
  },
  // the "?" rung, once a visit on a part row: the doctor narrows to two, in random order
  second: (row, m, r, vs) => {
    if (row.kind === "part" && vs.asks > 0 && row.screen.length > 2) {
      vs.asks--;
      row.helped = true;
      return V.shuffle([row.accept[0], V.pick(row.screen.filter((o) => o !== row.accept[0]), r)], r)[0];
    }
    return V.pick(row.screen, r);
  },
  echo: (row, m, r, vs) => {
    if (row.kind === "part" && vs.asks > 0 && row.screen.length > 2) {
      vs.asks--;
      row.helped = true;
      // pick the option that SOUNDS like the key word of the line (sound matching, no meaning)
      const two = V.shuffle([row.accept[0], V.pick(row.screen.filter((o) => o !== row.accept[0]), r)], r);
      const key = wordDur(row.accept[0]) * (1 + B.jitter * (r() * 2 - 1));
      return two.sort((a, b) => Math.abs(wordDur(a) - key) - Math.abs(wordDur(b) - key))[0];
    }
    return V.pick(row.screen, r);
  },
};
/* ---------------- strategies (speaking rows) ---------------- */
// a mumble always sounds most like the same word: a fixed ranking of every word
const rank = {};
Object.keys(data.words).forEach((w, i) => (rank[w] = (i * 2654435761) % 1009));
const SAY = {
  fair: (row) => ({ choice: row.accept[0], confidence: 0.9 }),
  mumble: (row) => ({ choice: row.options.slice().sort((a, b) => rank[b] - rank[a])[0], confidence: 0.6 }),
  randomsay: (row, r) => ({ choice: V.pick(row.options, r), confidence: 0.6 }),
  silent: () => null,
  pills: "pills",
};

/* ---------------- play one visit ---------------- */
function play(visit, tap, mem, r) {
  const results = {};
  const vs = { asks: data.ask.perVisit || 1, checked: {} };
  const lastThisVisit = {};
  for (const row of visit.rows) {
    if (row.kind === "voice" || row.kind === "probe") continue;
    // the screen: body parts are where they are; the trolley and the kit are shuffled each visit
    row.screen = ["care", "tool"].includes(row.kind) ? V.shuffle(row.options, r) : row.options.slice();
    row.dur = duration(row.say || visit.lines[0], r);
    let p = TAP[tap](row, mem, r, vs);
    let first = p !== WAIT && V.judge(row, p);
    // a row with a recast before it counts (a side: "My other knee"): any player who then switches gets it
    if (!first && p !== WAIT && row.tries > 1) first = true;
    results[row.id] = { first, helped: !!row.helped };
    // what the bot learns afterwards: the right answer is always found in the end (the patient touches it after two misses)
    const ans = row.accept[0];
    const f = (mem.freq[row.kind] = mem.freq[row.kind] || {});
    f[ans] = (f[ans] || 0) + 1;
    const sf = (mem.slotFreq[row.kind] = mem.slotFreq[row.kind] || {});
    const slot = row.screen.indexOf(ans);
    sf[slot] = (sf[slot] || 0) + 1;
    mem.durs.push({ kind: row.kind, dur: row.dur, answer: ans });
    if (mem.durs.length > 400) mem.durs.shift();
    (vs.checked[row.kind] = vs.checked[row.kind] || new Set()).add(ans);
    lastThisVisit[row.kind] = ans;
  }
  mem.prevVisitLast = lastThisVisit;
  return results;
}
function playVoice(visit, say, r) {
  const results = {};
  for (const row of visit.rows) {
    if (row.kind !== "voice") continue;
    if (say === "pills") {
      results[row.id] = { first: false, spoken: false };
      continue;
    }
    const heard = SAY[say](row, r);
    const ok = heard && heard.confidence >= data.voice.minConfidence && heard.choice === row.accept[0];
    results[row.id] = { first: !!ok, spoken: !!ok };
  }
  return results;
}

/* ---------------- run everything ---------------- */
const TYPES = [
  ["checkup", [1, 2, 3]],
  ["mystery", [1, 2, 3]],
  ["hurt", [1, 2, 3]],
  ["round", [1, 2, 3]],
  ["round:wrap", [2, 3]],
  ["round:drops", [3]],
  ["you", [1, 2, 3]],
  ["bring", [2, 3]],
];
const TAPS = ["fair", "random", "salience", "frequency", "slotmemory", "repeat", "duration", "wait", "visualcue", "sweep", "leftovers", "second", "echo"];
const SAYS = ["fair", "mumble", "randomsay", "silent", "pills"];

function makeVisit(type, level, r) {
  if (type === "round") return V.round(data, { level, rng: r });
  if (type.startsWith("round:")) return V.round(data, { level, rng: r, only: type.slice(6) });
  return V.make(data, { type, level, rng: r });
}

const out = { visits: N, seed: SEED, ear: {}, voice: {}, fails: [], placeholderRows: 0, rows: 0 };
let seed = SEED;
for (const [type, levels] of TYPES) {
  for (const level of levels) {
    const key = `${type} L${level}`;
    const probe = makeVisit(type, level, V.rng(99));
    const hasEar = probe.ear !== false && probe.rows.some((x) => x.kind !== "voice" && x.tested);
    const hasVoice = probe.rows.some((x) => x.kind === "voice");
    if (hasEar) {
      out.ear[key] = {};
      for (const s of TAPS) {
        const r = V.rng(seed++);
        const mem = makeMemory();
        let stars = 0;
        let counted = 0;
        for (let i = 0; i < N; i++) {
          const v = makeVisit(type, level, r);
          out.rows += v.rows.length;
          out.placeholderRows += V.placeholderRows(v, data);
          const e = V.earStar(v, play(v, s, mem, r));
          if (e === null) continue; // no ear slot on this visit
          counted++;
          if (e) stars++;
        }
        const pct = counted ? (100 * stars) / counted : 0;
        if (s === "fair") out.ear[key].slots = counted;
        out.ear[key][s] = pct;
        if (s === "fair" ? pct < 100 : pct >= 10) out.fails.push(`${key} ear ${s} ${pct.toFixed(1)}%`);
      }
    }
    if (hasVoice) {
      out.voice[key] = {};
      for (const s of SAYS) {
        const r = V.rng(seed++);
        let stars = 0;
        let counted = 0;
        for (let i = 0; i < N; i++) {
          const v = makeVisit(type, level, r);
          const vs = V.voiceStar(v, playVoice(v, s, r), data);
          if (vs === null) continue;
          counted++;
          if (vs) stars++;
        }
        if (!counted) {
          delete out.voice[key];
          break; // a speaking row but never enough for a voice slot (S4 alone at the hand-over)
        }
        const pct = (100 * stars) / counted;
        out.voice[key][s] = pct;
        if (s === "fair") out.voice[key].slots = counted;
        if (s === "fair" ? pct < 100 : pct >= 10) out.fails.push(`${key} voice ${s} ${pct.toFixed(1)}%`);
      }
    }
  }
}

/* ---------------- the speaking core's paths (fake recogniser, fake child) ---------------- */
async function voicePaths() {
  const choices = ["body-hand", "body-finger", "body-arm", "body-elbow", "body-knee", "body-foot", "body-toe"];
  const answer = "body-knee";
  const script = (hears, { parent = null, prompts = null } = {}) => {
    const acts = [];
    let said = 0;
    const io = {
      prompt: async (o) => (prompts ? prompts(o) : { via: "mic" }),
      listen: async () => hears.shift() ?? null,
      parent: async () => parent.shift(),
      act: async (c, ok) => acts.push([c, ok]),
      sayAgain: async () => said++,
    };
    return { io, acts, said: () => said };
  };
  const checks = [];
  const expect = (name, cond) => checks.push([name, !!cond]);
  // 1 accepted first time
  let s = script([{ choice: answer, confidence: 0.8 }]);
  let r = await T.run({ choices, answer, io: s.io });
  expect("accept: voice star", r.spoken && r.first && s.acts[0][1]);
  // 2 a wrong hearing: the doctor presses where he heard ("Here?"), the child says it again
  s = script([{ choice: "body-elbow", confidence: 0.8 }, { choice: answer, confidence: 0.8 }]);
  r = await T.run({ choices, answer, io: s.io });
  expect("wrong hearing: acted on as a miss, then accepted, no voice star", s.acts[0][0] === "body-elbow" && s.acts[0][1] === false && r.spoken && !r.first);
  // 3 nothing heard -> "say it again?" -> nothing -> the pills
  let sawPills = false;
  s = script([null, { choice: answer, confidence: 0.1 }], {
    prompts: (o) => {
      if (o.pills) {
        sawPills = true;
        return { via: "pill", choice: answer };
      }
      return { via: "mic" };
    },
  });
  r = await T.run({ choices, answer, io: s.io, minConfidence: 0.35 });
  expect("null: one 'say it again?', then the pills; a pill earns no voice star", s.said() === 1 && sawPills && !r.spoken && r.choice === answer);
  // 4 a grown-up judges: again, then yes
  s = script([], { parent: ["again", "yes"] });
  r = await T.run({ choices, answer, io: s.io, parentJudge: true });
  expect("parent judges: again then yes (no first-try star)", r.spoken && !r.first && r.path.join(",") === "parent-again,parent-yes");
  s = script([], { parent: ["yes"] });
  r = await T.run({ choices, answer, io: s.io, parentJudge: true });
  expect("parent judges: yes first time (voice star)", r.spoken && r.first);
  // 5 level 1: pills from the start; the mic is never required
  s = script([], { prompts: (o) => (o.pills ? { via: "pill", choice: answer } : { via: "mic" }) });
  r = await T.run({ choices, answer, io: s.io, pillsFromStart: true });
  expect("level 1: pills from the start, progress without the mic", !r.spoken && r.choice === answer && r.attempts === 0);
  // 6 closed sets are 2-8
  let threw = false;
  try {
    await T.run({ choices: choices.concat(["a", "b"]), answer, io: s.io });
  } catch (e) {
    threw = true;
  }
  expect("a set over 8 is refused", threw);
  return checks;
}

const checks = await voicePaths();
out.voicePaths = checks.map(([n, ok]) => ({ check: n, ok }));
checks.forEach(([n, ok]) => !ok && out.fails.push(`voice path: ${n}`));

/* ---------------- report ---------------- */
const fmt = (v) => (v >= 10 ? v.toFixed(0) : v.toFixed(1)).padStart(5);
console.log(`Clinic leak bot: ${N} visits per strategy per type per level (seed ${SEED}). Ear star %:`);
console.log("".padEnd(16) + TAPS.map((s) => s.slice(0, 7).padStart(8)).join("") + "   slots");
Object.entries(out.ear).forEach(([k, row]) => console.log(k.padEnd(16) + TAPS.map((s) => fmt(row[s]).padStart(8)).join("") + String(row.slots).padStart(8)));
console.log(`\nVoice star %:`);
console.log("".padEnd(16) + SAYS.map((s) => s.padStart(10)).join("") + "   slots");
Object.entries(out.voice).forEach(([k, row]) => console.log(k.padEnd(16) + SAYS.map((s) => fmt(row[s]).padStart(10)).join("") + String(row.slots).padStart(8)));
console.log(`\nSpeaking paths:`);
checks.forEach(([n, ok]) => console.log(`  ${ok ? "ok  " : "FAIL"} ${n}`));
console.log(`\nPlaceholder rows: ${out.placeholderRows} of ${out.rows} graded rows are English placeholders: not yet a Kutchi test.`);
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1));
if (out.fails.length) {
  console.log(`\nFAIL (${out.fails.length}):\n  ` + out.fails.join("\n  "));
  process.exit(1);
}
console.log("\nPASS: fair bot 100%; every leak strategy under 10%.");
