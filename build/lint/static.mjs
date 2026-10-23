#!/usr/bin/env node
// Static checks (checks-to-build 9, 10, 11, 13, 17, 18, 21; Sprint 6): rules that read the code and data, no browser.
//   kit       shared-kit identity: no CSS outside css/shared/ selects the shared components' classes (.njg-*, .oc-*, .rs-*,
//             .gb-*): one look in every mode (non-negotiable 8)
//   tokens    design tokens: colours only from css/shared/tokens.css (no hex or rgb() elsewhere), no gradients, no text-shadow
//   ladder    level ladders: Cook's timers ~15% quicker per level (timing.levelSpeed 0.13-0.17); each heal game's levels add at
//             most one new knob per level and no count goes down (L1 the smallest round)
//   words     banned forms: no 'aabhar aanjo' or 'arre re' in a line the game says, no 'lal' (laal), no lexicon entry glossed
//             "no" that says 'nar'; the settled words are in the lexicon (khun, ba, hane, khuda-fis, matar)
//   privacy   nothing leaves the device: no fetch/XMLHttpRequest/sendBeacon/WebSocket to an absolute URL in js/, no third-party
//             script in a page, localStorage only in the save and settings modules
//   reward    no reward or send-off item is a sweet (mithai, lolly, biscuit, sweet, candy, chocolate, toffee)
//   bulb      the bulb's English shows 8 s at every level (Zafar, D11 / SH-41) in every bulb time table
//   plane     the doctor and the girl in one plane (CLN-154, s08): at the door one feet line, standing hers 0.02-0.03 in front
//             of his, seated his 0.02-0.04 in front of her bed line (s08-placement-judge); him 1.35-1.6x her body, a tad back
//             (PLANE_BACK), a 1.75 m man by the room door; her tap areas never under today's size (data/clinic/scenes-v2.json)
//   loadcap   an art load is never capped in game time: no Cook.wait inside a Promise.race with a load (at test speed a 5 s cap
//             became 1 s and Phaser drew its green missing-texture box where a face goes; CHAI-25, CK-04, CK-08, s08 w8A):
//             cap it in real time (Cook.Stations.loadArt / capLoad)
// Known findings (today's debt, each must shrink, never grow): build/lint/static-known.json. A finding not in it fails, and so does
// a check with more findings than the list holds for it; --write-known only shrinks the list (Zafar, 23 Oct: compareKnown, shrinkKnown).
//   node build/lint/static.mjs [--only kit,tokens,...] [--write-known] [--all]
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const KNOWN = join(ROOT, "build/lint/static-known.json");

const walk = (root, dir, ok, out = []) => {
  if (!existsSync(join(root, dir))) return out;
  for (const f of readdirSync(join(root, dir))) {
    const p = `${dir}/${f}`;
    if (statSync(join(root, p)).isDirectory()) { if (!/^(vendor|node_modules|archive)$/.test(f)) walk(root, p, ok, out); } else if (ok(p)) out.push(p);
  }
  return out;
};
const lines = (text) => text.split("\n");
const stripCssComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

// ---- kit: one look in every mode ----
export function kitFindings(file, text) {
  if (file.startsWith("css/shared/")) return [];
  const out = [];
  lines(stripCssComments(text)).forEach((l, i) => {
    const sel = l.split("{")[0];
    if (!l.includes("{")) return;
    const m = sel.match(/\.(?:njg|oc|rs|gb)-[\w-]+/g);
    // a mode may name the shared class only to keep its own old element apart (":not(.njg-btn)")
    if (m && m.some((c) => !new RegExp(`:not\\([^)]*\\${c}`).test(sel))) out.push({ check: "kit", at: `${file}:${i + 1}`, key: `kit|${file}|${sel.trim()}`, text: sel.trim().slice(0, 100) });
  });
  return out;
}
// ---- tokens: colours from tokens.css only ----
export function tokenFindings(file, text) {
  if (file === "css/shared/tokens.css") return [];
  const out = [];
  lines(stripCssComments(text)).forEach((l, i) => {
    const decl = l.replace(/^[^{]*\{/, "");
    const bad = [];
    if (/#[0-9a-f]{3,8}\b/i.test(decl)) bad.push("hex colour");
    if (/\brgba?\(\s*\d/i.test(decl)) bad.push("rgb colour");
    if (/linear-gradient|radial-gradient/i.test(decl)) bad.push("gradient");
    if (/text-shadow\s*:/i.test(decl)) bad.push("text-shadow");
    for (const b of bad) out.push({ check: "tokens", at: `${file}:${i + 1}`, key: `tokens|${file}|${b}|${decl.trim().slice(0, 80)}`, text: `${b}: ${decl.trim().slice(0, 90)}` });
  });
  return out;
}
// ---- ladder ----
const size = (v) => (Array.isArray(v) ? Math.max(v.length, ...v.filter((x) => typeof x === "number")) : typeof v === "number" ? v : null);
export function ladderFindings(file, levels) {
  const out = [];
  const keys = Object.keys(levels || {}).filter((k) => /^\d+$/.test(k)).sort((a, b) => a - b);
  for (let i = 1; i < keys.length; i++) {
    const a = levels[keys[i - 1]], b = levels[keys[i]];
    const added = Object.keys(b).filter((k) => !k.startsWith("_") && !(k in a));
    if (added.length > 1) out.push({ check: "ladder", at: file, key: `ladder|${file}|L${keys[i]} adds ${added.join("+")}`, text: `L${keys[i]} adds ${added.length} new knobs (${added.join(", ")}): one per level` });
    for (const k of Object.keys(a)) {
      if (k.startsWith("_") || !(k in b)) continue;
      const x = size(a[k]), y = size(b[k]);
      // L1 is the smallest round; from L3 a step may hold fewer (heard only, at most two things to remember: D19)
      if (+keys[i] <= 2 && x !== null && y !== null && y < x && !/ms$|time|speed|rate|window/i.test(k)) out.push({ check: "ladder", at: file, key: `ladder|${file}|L${keys[i]} ${k} down`, text: `${k} goes down from L${keys[i - 1]} (${x}) to L${keys[i]} (${y}): L1 is the smallest round` });
    }
  }
  return out;
}
// ---- words ----
const SAID = /^(kutchi|k|say|line|text)$/i;
export function wordFindings(file, json) {
  const out = [];
  const go = (x, key, path) => {
    if (typeof x === "string") {
      if (!SAID.test(key || "")) return;
      for (const [re, why] of [[/\baabhar aanjo\b/i, "'aabhar aanjo' was dropped: the family says 'thank you' (decision 87)"], [/\barre re\b/i, "'arre re' is not a family word (decision 61)"], [/\blal\b/i, "'lal' is spelt 'laal'"]])
        if (re.test(x)) out.push({ check: "words", at: `${file} ${path}`, key: `words|${file}|${path}|${why}`, text: `${why}: "${x.slice(0, 60)}"` });
    } else if (Array.isArray(x)) x.forEach((y, i) => go(y, key, `${path}[${i}]`));
    else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) if (!k.startsWith("_")) go(v, k, path ? `${path}.${k}` : k);
  };
  go(json, "", "");
  return out;
}
export function lexiconFindings(lex) {
  const out = [], E = lex.entries || [];
  const forms = (e) => [e.lemma, ...Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t))].filter(Boolean).map((s) => String(s).toLowerCase());
  for (const e of E) {
    if (/^no\b/i.test(e.gloss || "") && forms(e).includes("nar")) out.push({ check: "words", at: `lexicon ${e.id}`, key: `words|lexicon|${e.id}|nar`, text: `"no" is 'na', never 'nar' (${e.id})` });
    if (forms(e).some((f) => /\baabhar aanjo\b/.test(f))) out.push({ check: "words", at: `lexicon ${e.id}`, key: `words|lexicon|${e.id}|aabhar`, text: `the dropped draft 'aabhar aanjo' (${e.id})` });
  }
  const all = new Set(E.flatMap(forms));
  for (const w of ["khun", "ba", "hane", "khuda-fis", "matar"]) if (!all.has(w)) out.push({ check: "words", at: "lexicon", key: `words|lexicon|settled ${w}`, text: `the settled word '${w}' is missing from the lexicon` });
  return out;
}
// ---- privacy ----
export const STORAGE_OK = new Set(["js/core/save.js", "js/shared/save.js", "js/shared/uistore.js", "js/shared/speech.js"]);
export function privacyFindings(file, text) {
  const out = [];
  lines(text).forEach((l, i) => {
    if (/^\s*(\/\/|\*)/.test(l)) return;
    if (/\b(fetch|sendBeacon)\s*\(\s*["'`]https?:|new\s+WebSocket\s*\(|new\s+XMLHttpRequest\b|\.open\(\s*["'`]\w+["'`]\s*,\s*["'`]https?:/.test(l)) out.push({ check: "privacy", at: `${file}:${i + 1}`, key: `privacy|${file}|net|${l.trim().slice(0, 60)}`, text: `a request off the device: ${l.trim().slice(0, 80)}` });
    if (file.endsWith(".js") && /\blocalStorage\b/.test(l) && !STORAGE_OK.has(file)) out.push({ check: "privacy", at: `${file}:${i + 1}`, key: `privacy|${file}|localStorage`, text: "localStorage outside the save and settings modules" });
    if (file.endsWith(".html") && /<script[^>]+src=["']https?:/i.test(l)) out.push({ check: "privacy", at: `${file}:${i + 1}`, key: `privacy|${file}|script|${l.trim().slice(0, 60)}`, text: `a third-party script: ${l.trim().slice(0, 80)}` });
  });
  return out;
}
// ---- reward ----
const SWEET = /\b(mithai|lolly|lollies|lollipop|biscuits?|sweets?|candy|chocolate|toffee)\b/i;
export function rewardFindings(file, json) {
  const out = [];
  const go = (x, key, path) => {
    if (typeof x === "string") { if (/reward|gift|help|treat/i.test(key || "") && SWEET.test(x)) out.push({ check: "reward", at: `${file} ${path}`, key: `reward|${file}|${path}`, text: `a sweet as a reward: "${x}" (${path})` }); }
    else if (Array.isArray(x)) x.forEach((y, i) => go(y, key, `${path}[${i}]`));
    else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) if (!k.startsWith("_")) go(v, /reward|gift|help|treat/i.test(k) ? k : /reward|gift|help|treat/i.test(key || "") ? key : null, path ? `${path}.${k}` : k);
  };
  go(json, "", "");
  return out;
}
// ---- bulb ----
// the bulb's English shows long enough to read: 8 s at every level (Zafar, D11 / SH-41); every bulb time table holds >= 7.5 s
export const BULB_MIN = 7500;
export function bulbFindings(tables) {
  const out = [];
  for (const [where, ms] of Object.entries(tables)) {
    const list = (Array.isArray(ms) ? ms : Object.values(ms || {})).filter((x) => typeof x === "number");
    if (!list.length) { out.push({ check: "bulb", at: where, key: `bulb|${where}|missing`, text: `${where}: no bulb time found` }); continue; }
    if (list.some((x) => x < BULB_MIN)) out.push({ check: "bulb", at: where, key: `bulb|${where}`, text: `${where}: the bulb's English shows [${list.join(", ")}] ms; 8 s at every level (D11, SH-41)` });
  }
  return out;
}
export function bulbTables(rd, J) {
  const t = {};
  const num = (src, re) => { const m = re.exec(src || ""); return m ? m[1].split(/[,\s]+/).map((x) => +String(x).replace(/^\d:\s*/, "")).filter((x) => !isNaN(x) && x > 100) : []; };
  t["data/cook.json calm.bulbMs"] = [].concat((J("data/cook.json").calm || {}).bulbMs ?? []);
  t["js/clinic/kit.js Kit.BULB_MS"] = Object.values(Function(`return ${(/Kit\.BULB_MS\s*=\s*(\{[^}]*\})/.exec(rd("js/clinic/kit.js")) || [0, "{}"])[1]}`)());
  t["js/shared/bulb.js Bulb.MS"] = num(rd("js/shared/bulb.js"), /MS\s*:\s*\[([^\]]*)\]/);
  t["js/shared/conversations.js BULB_MS"] = Object.values(Function(`return ${(/const BULB_MS\s*=\s*(\{[^}]*\})/.exec(rd("js/shared/conversations.js")) || [0, "{}"])[1]}`)());
  return t;
}

// ---- plane ----
// CLN-154 (Zafar, 16 Oct: "he's much too close to the foreground than she is"): the send-off's relation in the exam room
// s08-doctor-stitch (Zafar, 16 Oct: "the grandad looks too big for the room - maybe him and the girl both need to be a tad
// further back into the room and smaller"): every room's feet line at most BACK (CLN-154's were 0.91, 0.95 on a phone, 0.84
// seated and 0.82/0.88 at the door), his height that of a 1.75 m man by the room's 2 m door at his feet line (within 12%:
// scenes-v2 horizon and the room's door), and her tap areas never under today's size however small she is drawn
// s08-placement-judge (CLN-155, Zafar 16 Oct: "the middle or the front of the stool"): seated, his feet leave her bed line for
// the stool's front legs, 0.02-0.04 in front of it (exam 0.84); CLN-156 (Zafar: "bring her forward a touch and a little bigger"):
// standing, her feet 0.02-0.03 in front of his (EXAM_AHEAD, STAND_AHEAD)
export const PLANE_BACK = { stand: 0.85, exam: 0.84, door: 0.8 };
export const EXAM_AHEAD = [0.02, 0.04];
export const STAND_AHEAD = [0.02, 0.03];
const within = (v, [a, b]) => v >= a - 1e-9 && v <= b + 1e-9;
export function planeFindings(sc) {
  const out = [];
  const add = (where, text) => out.push({ check: "plane", at: `data/clinic/scenes-v2.json ${where}`, key: `plane|${where}`, text });
  const persp = (where, room, doc) => {
    const d = room.door, hz = sc.horizon;
    if (!d || hz == null) return add(`${where}.door`, `no door or horizon: his size against the room cannot be checked`);
    const want = (0.875 * (d[1] - d[0]) * (doc.y - hz)) / (d[1] - hz);
    if (!(Math.abs(doc.h / want - 1) <= 0.12)) add(`${where}.size`, `him ${doc.h} at feet line ${doc.y}: a 1.75 m man by the door there is ${want.toFixed(2)} (within 12%)`);
  };
  const back = (where, room, y) => { if (!(y <= PLANE_BACK[room])) add(`${where}.back`, `the feet line at ${y}: at most ${PLANE_BACK[room]}, a tad further back into the room (Zafar, 16 Oct)`); };
  const st = sc.stand || {}, ph = st.phone || {};
  for (const [where, fig, doc] of st.fig && st.doctor ? [["stand", st.fig, st.doctor], ["stand.phone", { ...st.fig, ...ph.fig }, { ...st.doctor, ...ph.doctor }]] : []) {
    if (!fig || !doc) continue;
    if (!within(+(fig.bottom - doc.y).toFixed(4), STAND_AHEAD)) add(where, `her feet at ${fig.bottom}, his at ${doc.y}: hers ${STAND_AHEAD.join("-")} in front of his (CLN-156)`);
    const r = doc.h / fig.body;
    if (!(r >= 1.35 && r <= 1.6)) add(where, `him ${doc.h} beside her body ${fig.body}: about 1.4-1.5x her (fig.body)`);
    back(where, "stand", doc.y);
    persp(where, st, doc);
    // her tap areas are drawn for max(body, tapBody) (figure.js partAt pads them): never under her art's 1x size, the size
    // before CLN-154 and s08 (CLN-93, CLN-09)
    if (!(Math.max(fig.body, fig.tapBody || 0) >= 600 / 1024)) add(`${where}.body`, `her tap areas are sized for body ${Math.max(fig.body, fig.tapBody || 0)}, under her art's 1x size (0.586): her tap targets would shrink (pad them: fig.tapBody)`);
  }
  const ex = sc.exam || {};
  if (ex.doctor) {
    if (!within(+(ex.doctor.y - ex.floor).toFixed(4), EXAM_AHEAD)) add("exam", `his feet at ${ex.doctor.y}, her bed line at ${ex.floor}: his ${EXAM_AHEAD.join("-")} in front of it, at the stool's front legs (CLN-155)`);
    back("exam", "exam", ex.doctor.y);
    persp("exam", ex, ex.doctor);
    // sitting, her tap areas are drawn for max(big, tapBig): never under the 1.3 they were (D1, CLN-93)
    const big = ex.fig && ex.fig.big != null ? ex.fig.big : 1.3;
    if (!(Math.max(big, (ex.fig && ex.fig.tapBig) || 0) >= 1.3)) add("exam.body", `her sitting tap areas are sized for ${Math.max(big, (ex.fig && ex.fig.tapBig) || 0)}x her art, under 1.3x: her tap targets would shrink (pad them: fig.tapBig)`);
  }
  const dr = sc.door || {};
  if (dr.patient && dr.doctor) {
    if (!(Math.abs(dr.patient.y - dr.doctor.y) <= 0.01)) add("door", `her feet at ${dr.patient.y}, his at ${dr.doctor.y}: one feet line (within 0.01)`);
    const r = dr.doctor.h / dr.patient.body;
    if (!(r >= 1.35 && r <= 1.6)) add("door", `him ${dr.doctor.h} beside her body ${dr.patient.body}: about 1.4-1.5x her (patient.body)`);
    back("door", "door", dr.doctor.y);
    persp("door", dr, dr.doctor);
  }
  return out;
}

// ---- loadcap: an art load's safety cap runs in real time ----
// each Promise.race( ... ) call's arguments, bracket-matched; a load in them and a Cook.wait beside it is a finding
const LOAD_CALL = /(?:\.|\b)load(?:Served|File|Art)?\s*\(/;
export function loadcapFindings(file, text) {
  const out = [];
  const re = /Promise\.race\s*\(/g;
  let m;
  while ((m = re.exec(text))) {
    let depth = 1, i = m.index + m[0].length;
    for (; i < text.length && depth; i++) { const c = text[i]; if (c === "(") depth++; else if (c === ")") depth--; }
    const args = text.slice(m.index + m[0].length, i - 1);
    if (LOAD_CALL.test(args) && /\bCook\.wait\s*\(/.test(args)) {
      const line = text.slice(0, m.index).split("\n").length;
      out.push({ check: "loadcap", at: `${file}:${line}`, key: `loadcap|${file}|${args.replace(/\s+/g, " ").trim().slice(0, 80)}`, text: "an art load raced against Cook.wait (game time: at test speed the cap shrinks and the art misses it); cap it in real time (St.loadArt / St.capLoad)" });
    }
  }
  return out;
}

// ---------- the repo ----------
export function run(root = ROOT, only = null) {
  const want = (k) => !only || only.includes(k);
  const rd = (p) => readFileSync(join(root, p), "utf8");
  const J = (p) => JSON.parse(rd(p));
  const out = [];
  const css = walk(root, "css", (p) => p.endsWith(".css"));
  if (want("kit")) for (const f of css) out.push(...kitFindings(f, rd(f)));
  if (want("tokens")) for (const f of css) out.push(...tokenFindings(f, rd(f)));
  if (want("ladder")) {
    const s = (J("data/cook.json").timing || {}).levelSpeed;
    if (!(s >= 0.13 && s <= 0.17)) out.push({ check: "ladder", at: "data/cook.json timing", key: "ladder|cook levelSpeed", text: `Cook's timers quicken ${s} per level: about 15%` });
    for (const f of walk(root, "data/clinic/heal", (p) => p.endsWith(".json"))) out.push(...ladderFindings(f, J(f).levels));
  }
  if (want("words")) {
    const said = [...walk(root, "data/clinic", (p) => p.endsWith(".json")), "data/cook.json", ...walk(root, "data/conversations", (p) => p.endsWith(".json")), ...walk(root, "data/stations", (p) => p.endsWith(".json")), ...walk(root, "data/patients", (p) => p.endsWith(".json")), ...walk(root, "data/story", (p) => p.endsWith(".json"))];
    for (const f of said) { try { out.push(...wordFindings(f, J(f))); } catch (e) { /* not JSON */ } }
    out.push(...lexiconFindings(J("data/lang/lexicon.json")));
  }
  if (want("privacy")) {
    for (const f of walk(root, "js", (p) => p.endsWith(".js"))) out.push(...privacyFindings(f, rd(f)));
    for (const f of readdirSync(root).filter((x) => x.endsWith(".html"))) out.push(...privacyFindings(f, rd(f)));
  }
  if (want("reward")) for (const f of walk(root, "data", (p) => p.endsWith(".json") && !/lang\/|audio|candidates/.test(p))) { try { out.push(...rewardFindings(f, J(f))); } catch (e) { /* not JSON */ } }
  if (want("bulb")) out.push(...bulbFindings(bulbTables(rd, J)));
  if (want("loadcap")) for (const f of walk(root, "js", (p) => p.endsWith(".js"))) out.push(...loadcapFindings(f, rd(f)));
  if (want("plane")) out.push(...planeFindings(J("data/clinic/scenes-v2.json")));
  return out;
}

// ---------- the known list only shrinks (Zafar, 23 Oct; docs/process/checks-to-build.md) ----------
// The known findings are today's debt (the 52 kit restyles, the 883 raw values, ...). A finding not on the list fails; and no
// check may have more findings than the list holds for it (a known line edited into two still fails). --write-known only ever
// rewrites the list DOWNWARDS: it keeps the known keys still found and drops the fixed ones; it never adds one (a new finding
// is fixed, never made known), and it refuses while any is new.
const checkOf = (key) => String(key).split("|")[0];
export function countBy(keys) {
  const by = {};
  for (const k of keys) by[checkOf(k)] = (by[checkOf(k)] || 0) + 1;
  return by;
}
/**
 * found findings against the known list (one entry per occurrence: a line written twice is two) -> {fresh, gone, by, knownBy,
 * up: [{check, now, known}], ok}. Counted by occurrence, so a known restyle copied to a second place is one more, and fails.
 */
export function compareKnown(found, knownKeys) {
  const known = new Set(knownKeys);
  const keys = new Set(found.map((f) => f.key));
  const fresh = found.filter((f) => !known.has(f.key));
  const gone = [...known].filter((k) => !keys.has(k));
  const by = countBy(found.map((f) => f.key));
  const knownBy = countBy(knownKeys);
  const up = Object.keys(by).filter((c) => by[c] > (knownBy[c] || 0)).map((c) => ({ check: c, now: by[c], known: knownBy[c] || 0 }));
  return { fresh, gone, by, knownBy, up, ok: !fresh.length && !up.length };
}
/** The list --write-known writes: each known key as many times as it is both known and still found (never more), sorted. */
export function shrinkKnown(found, knownKeys) {
  const left = new Map();
  for (const f of found) left.set(f.key, (left.get(f.key) || 0) + 1);
  const out = [];
  for (const k of knownKeys) {
    const n = left.get(k) || 0;
    if (n > 0) (out.push(k), left.set(k, n - 1));
  }
  return out.sort();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2), val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const only = val("--only") ? val("--only").split(",") : null;
  const found = run(ROOT, only);
  const knownKeys = existsSync(KNOWN) ? JSON.parse(readFileSync(KNOWN, "utf8")) : [];
  const known = new Set(knownKeys);
  const cmp = compareKnown(found, only ? knownKeys.filter((k) => only.includes(checkOf(k))) : knownKeys);
  if (argv.includes("--write-known")) {
    if (only) { console.error("static: --write-known runs on every check (no --only)"); process.exit(2); }
    if (cmp.fresh.length) {
      for (const f of cmp.fresh.slice(0, 60)) console.log(`NEW ${f.check} ${f.at}: ${f.text}`);
      console.error(`static: ${cmp.fresh.length} new finding(s): the known list only shrinks (Zafar, 23 Oct). Fix them; nothing written`);
      process.exit(1);
    }
    const next = shrinkKnown(found, knownKeys);
    writeFileSync(KNOWN, JSON.stringify(next, null, 1) + "\n");
    console.log(`static: known list ${knownKeys.length} -> ${next.length} (${Object.entries(countBy(next)).map(([k, v]) => `${k} ${v}`).join(", ")})`);
    process.exit(0);
  }
  for (const f of (argv.includes("--all") ? found : cmp.fresh).slice(0, 60)) console.log(`${known.has(f.key) ? "known" : "NEW"} ${f.check} ${f.at}: ${f.text}`);
  for (const u of cmp.up) console.log(`UP ${u.check}: ${u.now} findings, the known list holds ${u.known} (it only shrinks)`);
  console.log(`static: ${found.length} findings (${Object.entries(cmp.by).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}), ${found.length - cmp.fresh.length} known, ${cmp.fresh.length} new${cmp.up.length ? `, ${cmp.up.length} check(s) up` : ""}${cmp.gone.length ? `; ${cmp.gone.length} known ones are fixed: run --write-known to shrink the list` : ""}`);
  process.exit(cmp.ok ? 0 : 1);
}
