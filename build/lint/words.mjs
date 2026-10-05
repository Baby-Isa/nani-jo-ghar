#!/usr/bin/env node
// The word checks (report-only for now: 4d/4e are migrating the games onto the language engine, so this never blocks).
//   A  words typed in game code (rule G26, decision 36): Kutchi and English string literals in js/cook, js/clinic, js/shared
//   B  English shown to the child (non-negotiable 5): the English share of A, and English single words that read as UI labels
//   C  misspelt variants: spellings the engine's clash list says lose (laal not lal, ...), found in game code and data
//   D  lines with no family recording, from the engine (build/core/lang-gaps.mjs)
// Findings carry the same {check, selector, measured, text} shape as the layout lint (checks: word-literal-kutchi, word-literal-english,
// word-variant, word-no-recording; selector is file:line) so the sandbox can adopt them later. Allow-list: build/lint/words-allow.json.
//   node build/lint/words.mjs [--top N] [--json] [--only a,b,c,d] [--dirs js/cook,js/clinic] [--strict]
import { readFileSync, readdirSync, existsSync, writeSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, "..", "..");
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d = null) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };

if (has("--help") || has("-h")) {
  console.log(`node build/lint/words.mjs [--top N] [--json] [--only a,b,c,d] [--dirs js/cook,js/clinic,js/shared] [--strict]
  Report-only word checks (exit 0 unless --strict and there are findings). Prints counts and the top offenders, never a dump.
  A  Kutchi / English string literals typed in game code (G26). A multi-word literal that holds Kutchi words or English function words;
     single words are counted apart ("may be ids") and only when they are a known Kutchi form (not an id or alias from the engine's data)
  B  English shown to the child: the English literals of A plus capitalised single English words that read as labels (Done, Next)
  C  misspelt variants from the engine's clash list (data/lang/reports/clash-list.md) and the settled ones in words-variants below,
     found in game code and data (laal not lal, ...)
  D  lines with no family recording, from the engine (build/core/lang-gaps.mjs: audio gaps)
  Allow-list: build/lint/words-allow.json (exact text, regex, or file; each with a reason).`);
  process.exit(0);
}

const DIRS = (val("--dirs") || "js/cook,js/clinic,js/shared").split(",");
const ONLY = new Set((val("--only") || "a,b,c,d").split(","));
const TOP = +(val("--top") || 6);
const rd = (p) => readFileSync(join(ROOT, p), "utf8");
const J = (p) => JSON.parse(rd(p));
function walk(dir, ok) { const out = []; const d = join(ROOT, dir); if (!existsSync(d)) return out; for (const e of readdirSync(d, { withFileTypes: true })) { const rp = join(dir, e.name); if (e.isDirectory()) out.push(...walk(rp, ok)); else if (ok(e.name)) out.push(rp); } return out; }

// ---------- vocabularies ----------
const lex = existsSync(join(ROOT, "data/lang/lexicon.json")) ? J("data/lang/lexicon.json").entries : [];
const kutchi = new Set(), ids = new Set(), gloss = new Set();
const strip = (w) => w.toLowerCase().replace(/[^a-z']/g, "");
for (const e of lex) {
  if (e.lemma) for (const w of String(e.lemma).split(/\s+/)) if (strip(w).length >= 3) kutchi.add(strip(w));
  for (const f of Object.values(e.forms || {})) { const t = typeof f === "string" ? f : f && f.t; if (t) for (const w of String(t).split(/\s+/)) if (strip(w).length >= 3) kutchi.add(strip(w)); }
  for (const al of e.aliases || []) ids.add(String(al).toLowerCase());
  if (e.id) ids.add(e.id.toLowerCase());
  for (const g of [e.gloss, e.glossPl]) if (g) for (const w of String(g).split(/[^A-Za-z]+/)) if (w.length >= 3) gloss.add(w.toLowerCase());
}
const STOP = new Set("the a an and or to you your yours is are am it its of in on for with this that these those tap press click drag drop touch swipe please bring give take put me my we us he she they them his her their not no yes do does did can will would should could have has had be been was were from at by as but if so what which who whom how when where why all any each every some more most other just only very too also than then there here now next back done close open start stop play again try well good great nice thank thanks sorry hello hi bye ok okay oh choose pick find look listen say tell show hear see want need like make use get go come run wait help hint hungry hot cold sore hurt".split(" "));
const LABELS = new Set("done next back close open start stop play again try ok okay yes no help hint skip continue retry menu home settings sound mute word words score stars star coins coin level levels hello thanks".split(" "));
const kutchiOnly = (w) => kutchi.has(w) && !STOP.has(w);

// ---------- the allow-list ----------
const allow = existsSync(join(HERE, "words-allow.json")) ? JSON.parse(readFileSync(join(HERE, "words-allow.json"), "utf8")) : {};
const allowText = new Set((allow.literals || []).filter((x) => !/example/.test(x.why || "")).map((x) => x.text));
const allowRe = (allow.patterns || []).map((x) => new RegExp(x.re));
const allowFile = (allow.files || []).map((x) => x.file);

// ---------- a small JS string tokenizer (skips comments and regex literals) ----------
export function literals(src) {
  const out = [];
  let i = 0, line = 1, last = "";
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === "\n") { line++; i++; continue; }
    if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { i += 2; while (i < n && !(src[i] === "*" && src[i + 1] === "/")) { if (src[i] === "\n") line++; i++; } i += 2; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1, s = "";
      while (j < n && src[j] !== c && src[j] !== "\n") { if (src[j] === "\\") { s += src[j + 1] || ""; j += 2; } else s += src[j++]; }
      out.push({ text: s, line, ctx: ctxOf(src, i) });
      i = j + 1; last = '"'; continue;
    }
    if (c === "`") {
      let j = i + 1, s = "", startLine = line;
      while (j < n && src[j] !== "`") {
        if (src[j] === "\\") { s += src[j + 1] || ""; j += 2; continue; }
        if (src[j] === "$" && src[j + 1] === "{") { let d = 1; j += 2; while (j < n && d) { if (src[j] === "{") d++; else if (src[j] === "}") d--; if (src[j] === "\n") line++; j++; } s += " "; continue; }
        if (src[j] === "\n") line++;
        s += src[j++];
      }
      out.push({ text: s, line: startLine, ctx: ctxOf(src, i), template: true });
      i = j + 1; last = "`"; continue;
    }
    if (c === "/" && /[(,=:[!&|?{};]|^$/.test(last)) { // a regex literal
      let j = i + 1, cls = false;
      while (j < n && src[j] !== "\n" && (cls || src[j] !== "/")) { if (src[j] === "\\") j++; else if (src[j] === "[") cls = true; else if (src[j] === "]") cls = false; j++; }
      i = j + 1; last = "r"; continue;
    }
    if (!/\s/.test(c)) last = c;
    i++;
  }
  return out;
}
const ctxOf = (src, i) => { let a = src.lastIndexOf("\n", i - 1) + 1; return src.slice(Math.max(a, i - 70), i); };
const NOT_TEXT_CTX = /console\.|new Error\(|throw |require\(|import |from\s*$|fetch\(|querySelector|classList|className|addEventListener|removeEventListener|getElementById|setAttribute\(\s*$|getAttribute|dataset|\.style\.|style\.set|createElement\(|\.closest\(|\.matches\(|localStorage|sessionStorage|new RegExp|\.test\(|\.type\s*===|\bkind\s*===|\bcase\s*$|\.on\(|\.emit\(|\.once\(|postMessage|performance\.|typeof |\.hasOwnProperty|\bin\s*$/;

// ---------- A and B: literals ----------
const files = DIRS.flatMap((d) => walk(d, (nm) => /\.m?js$/.test(nm)));
const findings = [];
const weak = []; // single-word Kutchi forms: may be ids
function classify(text) {
  const t = text.trim();
  if (t.length < 2 || !/[A-Za-z]/.test(t) || t === "use strict") return null;
  if (/[{}()=;<>[\]\\|&^~$@*+#]|^https?:|\.(png|webp|jpe?g|mp3|json|js|css|svg|html)\b|\/|^\w+\.\w+/.test(t)) return null;
  if (/^[#.]/.test(t) || /^\d/.test(t) || /%[sd]/.test(t) || /^[A-Za-z0-9]+(-[A-Za-z0-9]*)+$/.test(t) || /^[a-z]+([A-Z][a-z0-9]*)+$/.test(t) || /^[A-Z0-9_]+$/.test(t)) return null;
  const toks = (t.match(/[A-Za-z][A-Za-z'’]*/g) || []).map((w) => w.toLowerCase().replace(/’/g, "'"));
  if (toks.some((w) => /-/.test(w))) return null;
  const eng = toks.filter((w) => STOP.has(w)), kut = toks.filter((w) => kutchiOnly(w));
  if (toks.length === 1) {
    const w = toks[0];
    if (/^[A-Z][a-z]{2,}[.!?]?$/.test(t) && (LABELS.has(w) || STOP.has(w))) return { kind: "english", weak: true, why: "single English word shown as a label?" };
    if (kut.length && !ids.has(w) && w.length >= 3) return { kind: "kutchi", weak: true, why: "Kutchi form typed as a literal (may be an id)" };
    return null;
  }
  if (eng.length >= 1 && eng.length >= kut.length) return { kind: "english", why: `English words (${eng.slice(0, 3).join(", ")})` };
  if (kut.length >= 1) return { kind: "kutchi", why: `Kutchi words (${kut.slice(0, 3).join(", ")})` };
  return null;
}
if (ONLY.has("a") || ONLY.has("b")) {
  for (const f of files) {
    if (allowFile.includes(f)) continue;
    const src = rd(f);
    for (const L of literals(src)) {
      if (NOT_TEXT_CTX.test(L.ctx) || allowText.has(L.text.trim()) || allowRe.some((r) => r.test(L.text))) continue;
      const k = classify(L.text);
      if (!k) continue;
      const fd = { check: k.kind === "kutchi" ? "word-literal-kutchi" : "word-literal-english", selector: `${f}:${L.line}`, measured: k.why, text: L.text.trim().slice(0, 70), weak: !!k.weak, file: f };
      (k.weak ? weak : findings).push(fd);
    }
  }
}

// ---------- C: misspelt variants ----------
const ignoreVar = new Set((allow.variantsIgnore || []).map((x) => x.word));
const variants = new Map(); // wrong -> {right, src}
const SETTLED = [["lal", "laal", "decision 32"]]; // (hand-kept: spellings the family or Zafar settled; the clash list covers the rest)
for (const [w, r, s] of SETTLED) variants.set(w, { right: r, src: s });
const clash = join(ROOT, "data/lang/reports/clash-list.md");
if (existsSync(clash)) for (const m of readFileSync(clash, "utf8").matchAll(/the spelling or the word\. The engine uses "([^"]+)".*?the other source says "([^"]+)"/g)) {
  const right = m[1].toLowerCase(), wrong = m[2].toLowerCase();
  if (wrong.length >= 3 && !ignoreVar.has(wrong) && wrong !== right && !variants.has(wrong) && !/\s/.test(wrong)) variants.set(wrong, { right, src: "clash list" });
}
const variantHits = new Map();
if (ONLY.has("c")) {
  const scan = [...DIRS.flatMap((d) => walk(d, (nm) => /\.m?js$/.test(nm))), ...walk("data", (nm) => nm.endsWith(".json")).filter((f) => !/^data\/(lang|conversations|arcs|examples)\//.test(f) && !/family-audio|audio-manifest|cook-tts|asset-list|hand-|monsoon-audio/.test(f)), ...walk("js/core", (nm) => /\.js$/.test(nm)).filter(() => false)];
  for (const f of scan) {
    const lines = rd(f).split("\n");
    for (const [wrong, info] of variants) {
      const re = new RegExp(`(?<![A-Za-z-])${wrong}(?![A-Za-z-])`, "i");
      lines.forEach((ln, i) => { if (re.test(ln) && !/^\s*(\/\/|\*)/.test(ln)) { const h = variantHits.get(wrong) || { ...info, n: 0, where: [] }; h.n++; if (h.where.length < 3 && !h.where.includes(`${f}:${i + 1}`)) h.where.push(`${f}:${i + 1}`); variantHits.set(wrong, h); } });
    }
  }
  for (const [wrong, h] of variantHits) findings.push({ check: "word-variant", selector: h.where[0], measured: `"${wrong}" x${h.n}, the engine says "${h.right}" (${h.src})`, text: wrong, file: h.where[0].split(":")[0], count: h.n });
}

// ---------- D: no family recording ----------
let gaps = null;
if (ONLY.has("d")) {
  const r = spawnSync(process.execPath, [join(ROOT, "build/core/lang-gaps.mjs"), "--json"], { cwd: ROOT, encoding: "utf8", timeout: 60000 });
  try { const j = JSON.parse(r.stdout); const rows = j.rows.filter(([k]) => k.startsWith("audio")); gaps = { said: j.said, rows, other: j.rows.length - rows.length }; for (const [k, n] of rows.slice(0, 200)) findings.push({ check: "word-no-recording", selector: "engine", measured: `${n}x`, text: k.replace(/^audio /, "").replace(/"/g, "") }); }
  catch (e) { gaps = { error: String((r.stderr || r.error || e.message || "").toString().split("\n")[0]).slice(0, 120) }; }
}

// ---------- output ----------
const group = (list, key) => { const m = new Map(); for (const f of list) m.set(key(f), (m.get(key(f)) || 0) + 1); return [...m].sort((a, b) => b[1] - a[1]); };
const lits = findings.filter((f) => /^word-literal/.test(f.check));
if (has("--json")) { writeSync(1, JSON.stringify({ findings, weak, gaps }, null, 1) + "\n"); process.exit(0); }
const eng = lits.filter((f) => f.check === "word-literal-english"), kut = lits.filter((f) => f.check === "word-literal-kutchi");
console.log(`words (report-only; ${files.length} files in ${DIRS.join(", ")})`);
if (ONLY.has("a") || ONLY.has("b")) {
  console.log(`A  string literals typed in game code: ${lits.length} (${kut.length} Kutchi, ${eng.length} English); ${weak.length} single words that may be ids`);
  for (const [f, n] of group(lits, (x) => x.file).slice(0, TOP)) console.log(`     ${String(n).padStart(4)}  ${f}`);
  for (const x of lits.slice(0, TOP)) console.log(`       e.g. ${x.selector}  "${x.text}"  (${x.measured})`);
  const lab = weak.filter((w) => w.check === "word-literal-english");
  console.log(`B  English that a child may see: ${eng.length} English literals + ${lab.length} English label words (Done, Next ...)`);
  for (const [f, n] of group([...eng, ...lab], (x) => x.file).slice(0, TOP)) console.log(`     ${String(n).padStart(4)}  ${f}`);
}
if (ONLY.has("c")) {
  console.log(`C  misspelt variants: ${variantHits.size} of ${variants.size} known variants appear (${[...variantHits.values()].reduce((s, h) => s + h.n, 0)} places)`);
  for (const [w, h] of [...variantHits].sort((x, y) => y[1].n - x[1].n).slice(0, TOP)) console.log(`     "${w}" x${h.n} -> "${h.right}" (${h.src})  ${h.where[0]}`);
}
if (ONLY.has("d")) {
  if (!gaps || gaps.error) console.log(`D  no family recording: could not run build/core/lang-gaps.mjs (${gaps ? gaps.error : "?"})`);
  else { console.log(`D  lines with no family recording: ${gaps.rows.length} distinct words with no clip in ${gaps.said} Cook lines played`); for (const [k, n] of gaps.rows.slice(0, TOP)) console.log(`     ${String(n).padStart(5)}x  ${k.replace(/^audio /, "")}`); }
}
process.exit(has("--strict") && findings.length ? 1 : 0);
