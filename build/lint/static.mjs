#!/usr/bin/env node
// Static checks (checks-to-build 9, 10, 11, 13, 17, 18, 21; Sprint 6): rules that read the code and data, no browser.
//   kit       shared-kit identity: no CSS outside css/shared/ selects the shared components' classes (.njg-*, .oc-*, .rs-*, .gb-*,
//             .wc-*, .ng-*, .ob-*, .cv-*, .say-*, .fit, .fit2, .fit-*; S13-A1 widened them), but :not() may keep its own element apart;
//             one look in every mode (non-negotiable 8)
//   tokens    design tokens: colours only from css/shared/tokens.css (no hex or rgb() elsewhere), no gradients, no text-shadow
//   ladder    level ladders: Cook's timers ~15% quicker per level (timing.levelSpeed 0.13-0.17); each heal game's levels add at
//             most one new knob per level and no count goes down (L1 the smallest round)
//   words     banned forms: no 'aabhar aanjo' or 'arre re' in a line the game says, no 'lal' (laal), no lexicon entry glossed
//             "no" that says 'nar'; the settled words are in the lexicon (khun, ba, hane, khuda-fis, matar)
//   privacy   nothing leaves the device: no fetch/XMLHttpRequest/sendBeacon/WebSocket to an absolute URL in js/, no third-party
//             script in a page, localStorage only in the save and settings modules
//   reward    no reward or send-off item is a sweet (mithai, lolly, biscuit, sweet, candy, chocolate, toffee)
//   hintwait  ONE help ladder (the central rules' hint waits); a second table (a helpMs key in other data, a ladder name beside a
//             number in js/) is a finding (S13-A1). (Was "bulb": the bulb's 8 s went with the bulbs, Zafar, 6 Nov)
//   shell     every live page links css/shared/kit.css once and no shared sheet directly; kit.css imports every shared sheet
//   motion    no game keyframes for a kit motion (glow, hop, pulse, throb, bounce, talk, bob, shake) outside css/shared/
//   jscolour  no colour literal in js/ (UI colours through js/shared/tokens.js); an art-only file is listed once in the known list
//   plane     the doctor and the girl in one plane (CLN-154, s08): at the door one feet line, standing hers 0.02-0.03 in front
//             of his, seated his 0.02-0.04 in front of her bed line (s08-placement-judge); him 1.35-1.6x her body, a tad back
//             (PLANE_BACK), a 1.75 m man by the room door; her tap areas never under today's size (data/clinic/scenes-v2.json)
//   loadcap   an art load is never capped in game time: no Cook.wait inside a Promise.race with a load (at test speed a 5 s cap
//             became 1 s and Phaser drew its green missing-texture box where a face goes; CHAI-25, CK-04, CK-08, s08 w8A):
//             cap it in real time (Cook.Stations.loadArt / capLoad)
//   voice     one voice player (S13-V): no speechSynthesis, SpeechSynthesisUtterance, new Audio or .play() outside js/core/voice.js
//             (the voice), js/shared/sfx.js (the sound effects) and the mic (js/shared/speech.js); no synthesized sound (an
//             oscillator, a noise buffer, a filter) outside js/shared/sfx.js; the parked games are left out (out of scope)
//   fonts     a font family is named only in the type tokens (SH-224, Zafar 6 Nov): css/shared/tokens.css names the faces,
//             css/shared/fonts.css the files (assets/fonts/), js/shared/tokens.js the drawn text's last fallback; a face (Lora, Nunito,
//             Baloo, Fraunces, Georgia, a generic serif or sans-serif, ...) or a Google Fonts link anywhere else in chai's files fails
//             (CHAI_FONT_FILES); in every other file it is a warning, counted on the summary line, until the roll-out moves that game
//   shared    the shared pieces are the kit's (SH-257, SH-255, SH-249, Zafar 10 Nov: "lights and bottom bars come only from the shared
//             kit; exceptions become named variants in it"): outside js/shared/, css/shared/ and js/cook/kitchen-kit.js no dim (a
//             shadow spread over the screen, a dim layer, a full-screen dark fill), no gold edge round a light, no light hole, no
//             shelf drawn without the kit's band (a file that draws shelf pills calls St.stoneBand or Shelf.P.tray), and no light
//             option that is not one of the shared light's named variants (Onboard.VARIANTS; round: true is gone). The prototypes
//             and the parked modes are not judged (named on the summary line). A known break is named in SHARED_KNOWN, never hidden.
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
// the shared kit's class prefixes (S13-A1, the kit review 4): the frame and buttons (njg), the order card (oc), the end screen
// (rs), the grown-ups' bits (gb), the word card (wc), Nani's guide box (ng), the onboarding kit (ob), the conversations (cv), the
// fitter (fit, fit2, fit-*) and Say it (say)
export const KIT_CLASS = /\.(?:(?:njg|oc|rs|gb|wc|ng|ob|cv|say)-[\w-]+|fit(?:2|-[\w-]+)?(?![\w-]))/g;
export function kitFindings(file, text) {
  if (file.startsWith("css/shared/")) return [];
  const out = [];
  lines(stripCssComments(text)).forEach((l, i) => {
    const sel = l.split("{")[0];
    if (!l.includes("{")) return;
    const m = sel.match(KIT_CLASS);
    // a mode may name the shared class only to keep its own old element apart (":not(.njg-btn)")
    if (m && m.some((c) => !new RegExp(`:not\\([^)]*\\${c}(?![\\w-])`).test(sel))) out.push({ check: "kit", at: `${file}:${i + 1}`, key: `kit|${file}|${sel.trim()}`, text: sel.trim().slice(0, 100) });
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
    // (a mask's gradient is an alpha ramp, never a painted colour: S13-A1)
    if (/linear-gradient|radial-gradient/i.test(decl.replace(/(?:-webkit-)?mask-image\s*:[^;]*;?/gi, ""))) bad.push("gradient");
    if (/text-shadow\s*:/i.test(decl)) bad.push("text-shadow");
    for (const b of bad) out.push({ check: "tokens", at: `${file}:${i + 1}`, key: `tokens|${file}|${b}|${decl.trim().slice(0, 80)}`, text: `${b}: ${decl.trim().slice(0, 90)}` });
  });
  return out;
}
// ---- fonts: a face is named only in the type tokens (SH-224; Zafar, 6 Nov: "Have it in the central place that everyone pulls upon") ----
// chai first ("start with Chai ... then if I like it, you can just roll it out everywhere"): a name in one of chai's files fails, a name in
// any other game's file is a warning (counted, never failed) until the roll-out adds that game's files to CHAI_FONT_FILES (or drops the list)
export const FONT_HOMES = ["css/shared/tokens.css", "css/shared/fonts.css", "js/shared/tokens.js"];
export const CHAI_FONT_FILES = ["css/cook.css", "css/shared/kit.css", "css/shared/word-card.css", "css/shared/order-card.css", "css/shared/word-moment.css", "css/shared/guide.css", "css/shared/conversations.css", "css/shared/results.css", "js/shared/word-card.js", "js/shared/word-moment.js", "js/shared/order-card.js", "js/cook/stations/chai-tray.js"];
export const FONT_NAME = /\b(?:Baloo(?: 2)?|Fraunces|Nunito(?: Sans)?|Lora|Georgia|Times New Roman|Fredoka|Andika|Literata|Alegreya|Source (?:Serif|Sans) \d|Segoe UI|Arial|Helvetica|Roboto|sans-serif|serif|system-ui|-apple-system|monospace|cursive|fantasy)\b|fonts\.googleapis\.com/g;
// (comments are prose, not fonts: CSS and JS block comments and JS line comments go first; a "//" after a ":" is a URL, kept)
const stripCode = (file, t) => {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  let s = String(t).replace(/\/\*[\s\S]*?\*\//g, blank);
  if (/\.m?js$/.test(file)) s = s.replace(/(^|[^:\\])\/\/.*$/gm, (m, a) => a + blank(m.slice(a.length)));
  if (/\.html?$/.test(file)) s = s.replace(/<!--[\s\S]*?-->/g, blank);
  return s;
};
export function fontFindings(file, text) {
  if (FONT_HOMES.includes(file)) return [];
  const out = [];
  lines(stripCode(file, text)).forEach((l, i) => {
    // (a CSS selector or a class name is never a face: only what follows a "{", a "font" property, a string or a link counts)
    const css = /\.css$/.test(file);
    const part = css ? (l.includes("{") ? l.slice(l.indexOf("{") + 1) : /^\s*[\w-]+\s*:/.test(l) ? l : "") : l;
    const names = [...part.matchAll(FONT_NAME)].map((m) => m[0]);
    for (const n of new Set(names)) out.push({ check: "fonts", at: `${file}:${i + 1}`, key: `fonts|${file}|${n}|${part.trim().slice(0, 70)}`, text: `the face "${n}" named outside the type tokens (css/shared/tokens.css): ${part.trim().slice(0, 90)}` });
  });
  return out;
}
export const FONT_WARN = []; // the other games' names, reported until the roll-out (run() fills it)

// ---- shell: one kit link on every live page (S13-A1) ----
// every live page links css/shared/kit.css (it @imports every shared sheet, in order) and no shared sheet directly; the parked
// games' pages (dress, find, monsoon, snap, tidy, who) switch over when they are unparked (Zafar, 26 Oct: out of scope)
export const LIVE_PAGES = ["index.html", "first.html", "day.html", "cook.html", "clinic.html", "lab.html", "labs.html"];
export function shellFindings(file, html) {
  const out = [];
  // (a <link rel="preload"> of a kit sheet only pulls it earlier for kit.css's own @import, SHARED-3: it is not a second link)
  const links = [...String(html).replace(/<!--[\s\S]*?-->/g, "").matchAll(/<link\b[^>]*\bhref="((?:\.\.\/)?css\/shared\/[^"?]+)[^"]*"[^>]*>/gi)].filter((m) => !/\brel="preload"/i.test(m[0])).map((m) => m[1].replace(/^\.\.\//, ""));
  const kit = links.filter((h) => h === "css/shared/kit.css").length;
  if (kit !== 1) out.push({ check: "shell", at: file, key: `shell|${file}|kit ${kit}`, text: `${file} links css/shared/kit.css ${kit} times: once, in the head` });
  for (const h of links.filter((x) => x !== "css/shared/kit.css")) out.push({ check: "shell", at: file, key: `shell|${file}|${h}`, text: `${file} links ${h} directly: css/shared/kit.css imports it` });
  return out;
}
export function kitImportFindings(text, sharedSheets) {
  const out = [];
  const imported = [...String(text).matchAll(/@import\s+url\(["']?([\w.-]+\.css)/g)].map((m) => m[1]);
  for (const s of sharedSheets) if (s !== "kit.css" && !imported.includes(s)) out.push({ check: "shell", at: "css/shared/kit.css", key: `shell|css/shared/kit.css|misses ${s}`, text: `css/shared/kit.css does not import ${s}: every shared sheet comes through the kit` });
  return out;
}
// ---- motion: the glow, hop, pulse and talk live only in css/shared/focus.css (S13-A1) ----
// a game's own keyframes for a kit motion (glow, hop, pulse, throb, bounce, talk, bob, shake) is a second copy that drifts from
// the kit's: its elements take var(--njg-glow-anim) (and -hop-, -pulse-, -talk-) instead
export const MOTION_NAME = /^(glow|hop|pulse|throb|bounce|talk|bob|shake)$/i;
// a keyframes name in parts (camelCase and dashes: "throbIn" -> throb, in; "ringLow" -> ring, low): any part a kit motion
export const motionName = (name) => String(name).replace(/([a-z0-9])([A-Z])/g, "$1-$2").split(/[-_]+/).some((p) => MOTION_NAME.test(p));
export function motionFindings(file, text) {
  if (file.startsWith("css/shared/")) return [];
  const out = [];
  lines(stripCssComments(text)).forEach((l, i) => {
    for (const m of l.matchAll(/@keyframes\s+([\w-]+)/g)) if (motionName(m[1])) out.push({ check: "motion", at: `${file}:${i + 1}`, key: `motion|${file}|${m[1]}`, text: `@keyframes ${m[1]}: a kit motion of the game's own; take the kit's (var(--njg-glow-anim), -hop-, -pulse-, -talk-: css/shared/focus.css)` });
  });
  return out;
}
// ---- jscolour: UI colours in js/ only through js/shared/tokens.js (S13-A1) ----
// a colour literal (0xRRGGBB, "#hex", rgb(…)) in js/ is a finding; Phaser and SVG take Tokens.hex("focus") / Tokens.int("focus").
// A file of art only (Phaser tints and fills for drawn things) is listed ONCE in the known list as `jscolour|<file>|art-only`:
// its art colours fold into that one finding, but a UI token's colour in it (any --njg-* colour of tokens.css) still counts alone
const JS_COLOUR = /\b0x[0-9a-f]{6}\b|["'`]#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|\brgba?\(\s*\d/gi;
export function uiColours(tokensCss) {
  // the kit's own colours (not the games' aliased palettes, nor white and black, which Phaser uses as "no tint")
  const kit = String(tokensCss).split("the live games' own colours")[0];
  const set = new Set();
  for (const m of kit.matchAll(/--njg-[\w-]+\s*:\s*#([0-9a-f]{6})\b/gi)) set.add(m[1].toLowerCase());
  set.delete("ffffff");
  set.delete("000000");
  return set;
}
export function jscolourFindings(file, text, { artOnly = false, ui = new Set() } = {}) {
  if (file === "js/shared/tokens.js" || file.startsWith("js/vendor/")) return [];
  const out = [];
  let art = false;
  lines(text).forEach((l, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;
    const code = l.replace(/\/\/.*$/, "");
    const hits = code.match(JS_COLOUR) || [];
    for (const h of hits) {
      const hex = (/^0x([0-9a-f]{6})$/i.exec(h) || /^["'`]#([0-9a-f]{6})$/i.exec(h) || [])[1];
      const isUi = hex && ui.has(hex.toLowerCase());
      if (artOnly && !isUi) { art = true; continue; }
      out.push({ check: "jscolour", at: `${file}:${i + 1}`, key: `jscolour|${file}|${isUi ? "ui " : ""}${code.trim().slice(0, 80)}`, text: `${isUi ? "a UI token's colour" : "a colour"} in code (${h}): Tokens.hex()/Tokens.int() from js/shared/tokens.js` });
    }
  });
  if (art) out.push({ check: "jscolour", at: file, key: `jscolour|${file}|art-only`, text: `${file}: art colours (listed once as art-only)` });
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
// ---- hintwait ----
// S13-A1 (the kit review F3, decision 8), SH-155: ONE help ladder, the central rules' hint waits (data/rules.json levels.hintS), filled
// into Tokens.ladder.helpMs by js/shared/tokens.js from data/shared.json's pointer. (The bulb's 8 s table and its check went with the
// bulbs: Zafar, 6 Nov, "remove the bulbs from everywhere and retire them and take their rules out".)
export const LADDER_FILE = "data/shared.json";
// ... and a second table anywhere is a finding: a ladder key in other data, or a ladder name beside a number in code
const LADDER_KEY = /^(helpMs|help_ms)$/;
export function ladderCopyFindings(file, textOrJson) {
  const out = [];
  if (file === LADDER_FILE) return out;
  if (file.endsWith(".json")) {
    const go = (x, path) => {
      if (!x || typeof x !== "object") return;
      for (const [k, v] of Object.entries(x)) {
        if (k.startsWith("_")) continue;
        const p = path ? `${path}.${k}` : k;
        if (LADDER_KEY.test(k)) out.push({ check: "hintwait", at: `${file} ${p}`, key: `hintwait|${file}|${p}`, text: `a second ladder table (the one is ${LADDER_FILE})` });
        else go(v, p);
      }
    };
    go(textOrJson, "");
    return out;
  }
  lines(textOrJson).forEach((l, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;
    const code = l.replace(/\/\/.*$/, "");
    if (/\b(helpMs|PAUSE)\b/.test(code) && /(?<![\w.])\d{4,5}(?![\w.])/.test(code)) out.push({ check: "hintwait", at: `${file}:${i + 1}`, key: `hintwait|${file}|${code.trim().slice(0, 80)}`, text: `a ladder number in code (the one table is ${LADDER_FILE}): ${code.trim().slice(0, 80)}` });
  });
  return out;
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

// ---- voice: one voice player and one sound-effects player (S13-V) ----
export const VOICE_HOME = new Set(["js/core/voice.js", "js/shared/sfx.js", "js/shared/speech.js"]);
export const PARKED_JS = /^js\/(monsoon|tidy|who|dress|find|snap)\//;
const VOICE_USE = /\bspeechSynthesis\b|\bSpeechSynthesisUtterance\b|\bnew\s+(?:global\.|root\.|window\.)?Audio\s*\(|\.play\(\s*\)/;
const SFX_USE = /\.create(?:Oscillator|BiquadFilter)\s*\(|\.createBuffer\s*\(/;
export function voiceFindings(file, text) {
  if (VOICE_HOME.has(file) || PARKED_JS.test(file) || !file.startsWith("js/") || file.startsWith("js/vendor/")) return [];
  const out = [];
  lines(text).forEach((l, i) => {
    const code = l.replace(/\/\/.*$/, "").replace(/^\s*\*.*$/, "");
    const m = VOICE_USE.exec(code) || (file !== "js/shared/sfx.js" && SFX_USE.exec(code));
    if (m) out.push({ check: "voice", at: `${file}:${i + 1}`, key: `voice|${file}|${code.trim().slice(0, 100)}`, text: `${m[0].trim()}: a voice or a sound played outside js/core/voice.js and js/shared/sfx.js (window.NjgVoice, Sfx.play)` });
  });
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

// ---- shared: the dim, the gold edge, the light's hole, the bottom bar and the light's variants are the kit's (s19-checks-1) ----
export const SHARED_HOME = /^(js\/shared\/|css\/shared\/|js\/cook\/kitchen-kit\.js$|js\/vendor\/)/;
export const SHARED_SKIP = /(^js\/(monsoon|tidy|who|dress|find|snap)\/|^css\/(monsoon|tidy|who|dress|find|snap)\.css$|-proto(\/|\.css$)|^js\/farm\/)/;
// the known breaks, each named with its owner and its way out (Zafar, 10 Nov: "named, not hidden")
export const SHARED_KNOWN = {
};
// SH-259 (Zafar, 10 Nov): a recipe that calls a standalone game (Cook.Chop.play and the like) passes no layout, zone or light options of
// its own: the game brings its own (its settings), so it looks the same alone and in the recipe
// (a key given its value, or in shorthand: daar's "knifeKey, blade,")
export const RECIPE_LAYOUT = /[{,]\s*(band|knifeKey|knifeAt|knife|blade|region|footprint|layout|lay|zone|zones|light|lights|variant|round|pad|peak|halves|shadows|timer|board|hopOn)\s*(?=[:,}])/g;
export function standaloneGames(files) {
  const out = new Set();
  for (const [, text] of files) for (const m of String(text).matchAll(/Cook\.([A-Z]\w+)\s*=\s*\{[^}]*\bplay\b/g)) out.add(m[1]);
  return [...out];
}
// the shared light's named variants: Onboard.VARIANTS in js/shared/onboard.js ({name: [games]}), or, until it is there, STD-E2-08a's
// (Zafar, 10 Nov: one chop, chained into recipes: a variant is a game's, and goes wherever that game runs, alone or in daar or chaat)
export const VARIANTS_DEFAULT = { swipe: ["chop"] };
export function readVariants(onboardJs) {
  const m = /VARIANTS\s*=\s*(?:Object\.freeze\()?(\{[\s\S]*?\})\)?\s*;/.exec(onboardJs || "");
  if (!m) return { variants: VARIANTS_DEFAULT, from: "STD-E2-08a (Onboard.VARIANTS is not in js/shared/onboard.js yet)" };
  const v = {};
  for (const x of m[1].matchAll(/["']?([\w-]+)["']?\s*:\s*\[([^\]]*)\]/g)) v[x[1]] = [...x[2].matchAll(/["']([\w-]+)["']/g)].map((y) => y[1]);
  return { variants: v, from: "Onboard.VARIANTS" };
}
const gameOfFile = (f) => (/\/stations\/([\w-]+)\.js$/.exec(f) || /\/mechanics\/([\w-]+)\.js$/.exec(f) || [])[1] || f;
export function sharedFindings(file, text, { variants = VARIANTS_DEFAULT, standalone = ["Chop"] } = {}) {
  if (SHARED_HOME.test(file) || SHARED_SKIP.test(file)) return [];
  const out = [];
  const add = (line, what, msg) => out.push({ check: "shared", at: `${file}:${line}`, key: `shared|${file}|${what}`, text: msg, ...(SHARED_KNOWN[`shared|${file}|${what}`] ? { known: SHARED_KNOWN[`shared|${file}|${what}`] } : {}) });
  const L = lines(file.endsWith(".css") ? stripCssComments(text) : text);
  if (file.endsWith(".css")) {
    L.forEach((l, i) => {
      // a dim: a shadow spread across the screen (a hole cut in a dim: Cook's old #coach .co-hole, 200vmax)
      for (const m of l.matchAll(/box-shadow\s*:([^;}]*)/g)) if (/\b0\s+0\s+0\s+(\d{3,}px|\d+(vmax|vmin|vw|vh))/.test(m[1])) add(i + 1, "dim", `a dim drawn by the game: a shadow spread over the screen (${m[1].trim().slice(0, 60)}); the dim is the shared light's (Onboard.DIM)`);
      // a light hole or a dim layer by name, with a fill or an edge of its own
      const sel = /^([^{]*)\{/.exec(l);
      if (sel && /(^|[^\w-])[.#][\w-]*(?:-hole|hole-|dim|scrim)\b/i.test(sel[1]) && /(background|box-shadow|border)\s*:/.test(l.slice(sel[0].length))) add(i + 1, "hole", `a light hole or dim layer of the game's own: ${sel[1].trim().slice(0, 60)}`);
      // a gold edge round a light: a lit, hint, spot or highlight look drawing a gold ring
      if (sel && /[.#][\w-]*(?:lit|light|hint|spot|highlight|halo)\b/i.test(sel[1]) && /(border|outline|box-shadow)[^;]*var\(--njg-(?:focus|gold)/.test(l)) add(i + 1, "gold", `a gold edge round a light of the game's own: ${sel[1].trim().slice(0, 60)}; the gold box is the shared light's`);
    });
    return out;
  }
  if (!file.endsWith(".js")) return out;
  L.forEach((l, i) => {
    if (/^\s*(\/\/|\*)/.test(l)) return;
    // a light hole in the page: an element styled as a hole (the old coach's .co-hole and its left/top/width)
    if (/querySelector\(\s*["'`][^"'`]*-hole/.test(l) || /\bhole\.style\.(left|top|width|height)\b/.test(l)) add(i + 1, "hole", `a light hole placed by the game: ${l.trim().slice(0, 80)}; the hole is the shared light's (Onboard.light)`);
    // a full-screen dark fill on the canvas (a dim of the game's own)
    if (/fillStyle\(\s*0x(?:[0-3][0-9a-f]){3}\s*,\s*0?\.(?:[2-8]\d*)/i.test(l)) {
      const near = L.slice(i, i + 3).join(" ");
      if (/fillRect\(\s*0\s*,\s*0\s*,\s*(W|w|width|1600|S\.scale|gameSize|view)/.test(near) || /\b(dim|scrim|darken)\w*\b/i.test(near)) add(i + 1, "dim", `a dim drawn on the canvas by the game: ${near.trim().slice(0, 80)}`);
    }
    // a gold edge round a light drawn on the canvas
    if (/lineStyle\([^)]*(gold|GOLD|focus|FOCUS)/.test(l)) {
      const near = L.slice(Math.max(0, i - 2), i + 3).join(" ");
      if (/strokeR(ounded)?ect|strokeRect/.test(near) && /\b(light|lit|hint|spot|highlight|halo)\w*/i.test(near)) add(i + 1, "gold", `a gold edge round a light drawn by the game: ${l.trim().slice(0, 80)}`);
    }
    const lightCall = /Onboard\.|\.light\(|\.spot\(|Coach\.|nextLight|\btarget\s*:/.test(l);
    // the light's options: round is gone (every light a rounded rectangle, Zafar 10 Nov); a variant must be one of the shared light's
    if (lightCall && (/\bround\s*:\s*true\b/.test(l) || /\bround\s*:\s*o\.round\s*!==\s*false/.test(l))) add(i + 1, "round", `a light asked to be round (${l.trim().slice(0, 70)}): every light is one rounded rectangle; a shape of its own is a named variant in the shared light`);
    // (only a light's own options: a call to the shared light or the coach, or a light target; a word card's variant is its own)
    if (lightCall) for (const m of l.matchAll(/\b(?:variant|lightVariant)\s*:\s*["'`]([\w-]+)["'`]/g)) {
      const g = gameOfFile(file);
      if (!variants[m[1]]) add(i + 1, `variant-${m[1]}`, `a light variant "${m[1]}" that the shared light does not name (its variants: ${Object.keys(variants).join(", ") || "none"})`);
      else if (!variants[m[1]].includes(g)) add(i + 1, `variant-${m[1]}`, `the light variant "${m[1]}" asked by ${g}, which the shared light names only for ${variants[m[1]].join(", ")}`);
    }
  });
  // SH-259: a recipe calling a standalone game passes it no layout, zone or light of its own, and gives it no zone of its own
  if (/^js\/cook\/stations\//.test(file)) {
    for (const g of standalone) {
      if (gameOfFile(file) === g.toLowerCase()) continue;
      const re = new RegExp(`Cook\\.${g}\\.play\\(`, "g");
      for (const m of text.matchAll(re)) {
        let depth = 1, i = m.index + m[0].length;
        while (i < text.length && depth) { if (text[i] === "(") depth++; else if (text[i] === ")") depth--; i++; }
        const keys = [...new Set([...text.slice(m.index + m[0].length, i - 1).matchAll(RECIPE_LAYOUT)].map((x) => x[1]))];
        if (keys.length) add(text.slice(0, m.index).split("\n").length, "recipe-call", `${gameOfFile(file)} calls ${g.toLowerCase()}'s game with layout or light options of its own (${keys.join(", ")}): the game brings its own (SH-259)`);
      }
      const zm = new RegExp(`mech\\s*:\\s*["'\`]${g.toLowerCase()}["'\`]`).exec(text);
      if (zm) add(text.slice(0, zm.index).split("\n").length, "recipe-zone", `${gameOfFile(file)} gives ${g.toLowerCase()}'s game a zone of its own (a region and footprint): the game brings its own layout (SH-259)`);
    }
  }
  // the bottom bar: a Cook file that draws shelf pills draws its band through the kit
  // (a station draws its scene's band; a mechanic takes the band its station drew: chop's mechanic stands things on the caller's band)
  if (/^js\/cook\/stations\//.test(file) && /\.chip\(/.test(text) && !/stoneBand\(|Shelf\.P\.tray|\bband\(S\b/.test(text)) {
    const line = text.slice(0, text.search(/\.chip\(/)).split("\n").length;
    add(line, "band", `${gameOfFile(file)} draws its shelf's pills without the kit's band (St.stoneBand or Shelf.P.tray): the bottom bar is the kit's`);
  }
  return out;
}

// what the shared rule did not judge, and its known breaks (printed every run: named, never hidden)
export const SHARED_INFO = { from: "", skipped: 0, known: [] };
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
  if (want("hintwait")) {
    for (const f of walk(root, "data", (p) => p.endsWith(".json") && !/^data\/lang\//.test(p))) { try { out.push(...ladderCopyFindings(f, J(f))); } catch (e) { /* not JSON */ } }
    for (const f of walk(root, "js", (p) => p.endsWith(".js"))) out.push(...ladderCopyFindings(f, rd(f)));
  }
  if (want("shell")) {
    for (const f of LIVE_PAGES) if (existsSync(join(root, f))) out.push(...shellFindings(f, rd(f)));
    const sheets = readdirSync(join(root, "css/shared")).filter((f) => f.endsWith(".css"));
    out.push(...(sheets.includes("kit.css") ? kitImportFindings(rd("css/shared/kit.css"), sheets) : [{ check: "shell", at: "css/shared/kit.css", key: "shell|css/shared/kit.css|missing", text: "css/shared/kit.css is missing" }]));
  }
  if (want("motion")) for (const f of css) out.push(...motionFindings(f, rd(f)));
  if (want("fonts")) {
    FONT_WARN.length = 0;
    const files = [...css, ...walk(root, "js", (p) => p.endsWith(".js") && !/\/vendor\//.test(p)), ...readdirSync(root).filter((x) => x.endsWith(".html"))];
    for (const f of files) {
      const found = fontFindings(f, rd(f));
      if (CHAI_FONT_FILES.includes(f)) out.push(...found);
      else FONT_WARN.push(...found);
    }
  }
  if (want("jscolour")) {
    const ui = uiColours(rd("css/shared/tokens.css"));
    const art = new Set((existsSync(join(root, "build/lint/static-known.json")) ? JSON.parse(rd("build/lint/static-known.json")) : []).filter((k) => /^jscolour\|.*\|art-only$/.test(k)).map((k) => k.split("|")[1]));
    for (const f of walk(root, "js", (p) => p.endsWith(".js"))) out.push(...jscolourFindings(f, rd(f), { artOnly: art.has(f), ui }));
  }
  if (want("loadcap")) for (const f of walk(root, "js", (p) => p.endsWith(".js"))) out.push(...loadcapFindings(f, rd(f)));
  if (want("voice")) for (const f of walk(root, "js", (p) => p.endsWith(".js"))) out.push(...voiceFindings(f, rd(f)));
  if (want("plane")) out.push(...planeFindings(J("data/clinic/scenes-v2.json")));
  if (want("shared")) {
    const v = readVariants(existsSync(join(root, "js/shared/onboard.js")) ? rd("js/shared/onboard.js") : "");
    SHARED_INFO.from = v.from;
    SHARED_INFO.skipped = [...css, ...walk(root, "js", (p) => p.endsWith(".js"))].filter((f) => SHARED_SKIP.test(f)).length;
    const stations = walk(root, "js/cook/stations", (p) => p.endsWith(".js"));
    const standalone = standaloneGames(stations.map((f) => [f, rd(f)]));
    SHARED_INFO.standalone = standalone;
    for (const f of [...css, ...walk(root, "js", (p) => p.endsWith(".js"))]) for (const x of sharedFindings(f, rd(f), { variants: v.variants, standalone })) (x.known ? SHARED_INFO.known : out).push(x);
  }
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
  if (!only || only.includes("shared")) {
    for (const k of SHARED_INFO.known) console.log(`known break shared ${k.at}: ${k.text} (${k.known})`);
    console.log(`shared: variants from ${SHARED_INFO.from}; the standalone games a recipe may call: ${(SHARED_INFO.standalone || []).join(", ") || "none"}; not judged: ${SHARED_INFO.skipped} files of the prototypes and the parked modes`);
  }
  if (FONT_WARN.length && argv.includes("--fonts")) for (const f of FONT_WARN) console.log(`warn fonts ${f.at}: ${f.text}`);
  const fontWarn = FONT_WARN.length ? `; fonts: ${FONT_WARN.length} face names outside the tokens in ${new Set(FONT_WARN.map((f) => f.at.split(":")[0])).size} files of the other games (warn until the roll-out; --fonts lists them)` : "";
  console.log(`static: ${found.length} findings (${Object.entries(cmp.by).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}), ${found.length - cmp.fresh.length} known, ${cmp.fresh.length} new${cmp.up.length ? `, ${cmp.up.length} check(s) up` : ""}${cmp.gone.length ? `; ${cmp.gone.length} known ones are fixed: run --write-known to shrink the list` : ""}${fontWarn}`);
  process.exit(cmp.ok ? 0 : 1);
}
