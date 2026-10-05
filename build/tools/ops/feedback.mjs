#!/usr/bin/env node
// Voice-note feedback pipeline: a timestamped transcript -> the report skeleton CLAUDE.md asks for, plus draft regression rows.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { ROOT, rel, args, help, die } from "./lib.mjs";

const HELP = `
node build/tools/ops/feedback.mjs <transcript.md|.txt|.srt|.vtt> [more parts...] --name <slug> [--out file] [--source path]
  Reads one or more timestamped transcripts (Whisper's "- **m:ss** text" from build/transcribe_family.py, "[h:mm:ss] text",
  "m:ss text", SRT or VTT; several files are parts 1, 2 ... and times print as 1:m:ss, 2:m:ss) and writes the report skeleton
  in the CLAUDE.md voice-note format:
    1. What it would change: every mechanic changed (now -> proposed) and old art reused, to fill
    2. Every point: P#, time, what Zafar said, screen, cause (checked in code), fix: cause and fix left blank
    3. Draft regression rows (next free id per section of docs/process/regressions.md), to paste once checked
    4. Coverage: every transcript line -> a point, or "chatter"
  Points are drafts: whole sentences grouped while they stay on one screen; short filler is chatter. Merge, split and re-word
  them as you check causes in code. Default output build/reports/feedback-<slug>.md (or docs/feedback/<date>-<slug>.md once
  final, by hand). No network.`;
const a = args(); help(HELP, a);
if (!a.pos.length) die("Give the transcript file(s) and --name. --help shows the formats.");
const name = a.val("name") || basename(a.pos[0]).replace(/\.\w+$/, "");
const out = a.val("out") || join("build", "reports", `feedback-${name}.md`);

// ---- read lines with times
const sec = (t) => t.replace(",", ".").split(":").reduce((s, x) => s * 60 + +x, 0);
const fmt = (s, part) => { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = String(s % 60).padStart(2, "0"); const t = h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`; return part ? `${part}:${t}` : t; };
const lines = [];
a.pos.forEach((f, pi) => {
  if (!existsSync(f)) die(`No file ${f}.`);
  const part = a.pos.length > 1 ? pi + 1 : 0, raw = readFileSync(f, "utf8").split(/\r?\n/);
  for (let i = 0; i < raw.length; i++) {
    const l = raw[i];
    let m = /^\s*-\s*\*\*(\d+(?::\d\d){1,2})\*\*\s*(.+)$/.exec(l) || /^\s*\[(\d+(?::\d\d){1,2}(?:\.\d+)?)\]\s*(.+)$/.exec(l) || /^\s*(\d+(?::\d\d){1,2})\s+[-–]?\s*(.+)$/.exec(l);
    if (m) { lines.push({ part, t: sec(m[1]), text: m[2].trim() }); continue; }
    m = /^(\d\d:\d\d:\d\d[,.]\d+)\s*-->/.exec(l);   // SRT / VTT cue: text follows until a blank line
    if (m) { const txt = []; while (raw[i + 1]?.trim()) txt.push(raw[++i].trim()); lines.push({ part, t: sec(m[1]), text: txt.join(" ") }); }
  }
});
if (!lines.length) die("No timestamped lines found. --help shows the formats.");
lines.forEach((l, i) => (l.n = i));

// ---- screens and their regression sections
const SCREENS = [
  ["pantry", "PAN", /pantry|fetch/i], ["chai", "CHAI", /\bchai|tea\b|sugar/i], ["maani", "MAA", /maani|roti|chapati|tawa/i],
  ["daar", "DAAR", /\bdaa?[rl]\b|lentil/i], ["chaat", "CHT", /chaat|tadka/i], ["samosa", "SAM", /samosa/i], ["sekelo", "SEK", /sekelo|skewer|mishkaki|grill/i],
  ["clinic heal games", "CLN", /scrape|plaster|knee|bandage|\bear\b|tooth|teeth|fever|thermometer|boing|\beye\b|\bfoot\b|splinter|injection|heal/i],
  ["clinic", "CLN", /clinic|patient|doctor|waiting|pharmacy|diagnos|stethoscope/i],
  ["shared components", "SH", /end screen|badge|order card|\bcard\b|button|onboarding|bulb|speaker|pop-?up|headline/i],
  ["art", "ART", /\bart(work)?\b|background|drawing|image|picture|blurr/i],
  ["language and audio", "LNG", /kutchi|word|voice|record|pronounc|say(s|ing)?\b|sound/i],
  ["first launch and shell", "FL", /first launch|title screen|menu|home screen|hub/i],
  ["Cook (general)", "CK", /cook|kitchen|station|recipe|nani/i],
];
const screenOf = (t) => (SCREENS.find(([, , re]) => re.test(t)) || [null])[0];
const FILLER = /^(ok(ay)?|yeah|yes|um+|uh+|right|so|and|anyway|hmm+|oh|mm+|cool|great)[\s,.!?]*$/i;

// ---- utterances: join Whisper's broken lines into sentences
const utts = [];
let cur = null;
for (const l of lines) {
  if (!cur || cur.part !== l.part) cur = (utts.push({ part: l.part, t: l.t, lines: [], text: "" }), utts.at(-1));
  cur.lines.push(l.n); cur.text += (cur.text ? " " : "") + l.text;
  if (/[.!?]["')]?$/.test(l.text)) cur = null;
}
// ---- points: sentences with substance, grouped while the screen stays the same
const points = [], chatter = new Set();
for (const u of utts) {
  const words = u.text.split(/\s+/).length;
  if (words < 6 || FILLER.test(u.text)) { u.lines.forEach((n) => chatter.add(n)); continue; }
  const scr = screenOf(u.text), last = points.at(-1);
  if (last && last.part === u.part && (scr === last.screen || !scr) && last.words + words < 120) { last.text += " " + u.text; last.lines.push(...u.lines); last.words += words; }
  else points.push({ part: u.part, t: u.t, screen: scr || last?.screen || "?", text: u.text, lines: [...u.lines], words });
}
points.forEach((p, i) => (p.id = `P${i + 1}`));
const pointOf = new Map(); points.forEach((p) => p.lines.forEach((n) => pointOf.set(n, p.id)));

// ---- next free regression ids
const regs = readFileSync(join(ROOT, "docs", "process", "regressions.md"), "utf8");
const maxId = {};
for (const m of regs.matchAll(/^\| ([A-Z]+)-(\d+)\b/gm)) maxId[m[1]] = Math.max(maxId[m[1]] || 0, +m[2]);
const prefixOf = (scr) => (SCREENS.find(([s]) => s === scr) || [, "CK"])[1];
const short = (t, n = 160) => (t.length > n ? t.slice(0, t.lastIndexOf(" ", n)) + " …" : t);
const cell = (t) => t.replace(/\|/g, "/");

const src = a.val("source") || a.pos.map((f) => rel(f.startsWith("/") ? f : join(ROOT, f))).join(", ");
const L = [];
L.push(`# Feedback: ${name} (draft skeleton)`, "",
  `**Source:** ${src}. ${lines.length} transcript lines, ${points.length} draft points, ${chatter.size} lines of chatter. Made by \`build/tools/ops/feedback.mjs\`; every cause is to be checked in code before this goes to Zafar.`, "",
  "## 1. What it would change (read this first)", "",
  "### 1a. Every mechanic changed", "", "| Game or screen | Now (checked in code) | Proposed | Points |", "|---|---|---|---|", "| | | | |", "",
  "### 1b. Old art reused", "", "| Asset | Where it is reused | Points |", "|---|---|---|", "| | | |", "",
  "## 2. Every point", "",
  "| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |", "|---|---|---|---|---|---|");
for (const p of points) L.push(`| ${p.id} | ${fmt(p.t, p.part)} | ${cell(short(p.text, 220))} | ${p.screen} | | |`);
L.push("", "## 3. Draft regression rows (check, then add to `docs/process/regressions.md` the same day)", "",
  "| ID | Issue | Status | Check | Source |", "|---|---|---|---|---|");
for (const p of points) {
  const pre = prefixOf(p.screen); maxId[pre] = (maxId[pre] || 0) + 1;
  L.push(`| ${pre}-${String(maxId[pre]).padStart(2, "0")} | ${cell(short(p.text, 120))} | **open** | eye: | \`${src.split(", ")[p.part ? p.part - 1 : 0]}\` ${fmt(p.t, p.part)} (${p.id}) |`);
}
L.push("", "## 4. Coverage: every transcript line → a point", "", "| Lines | Point |", "|---|---|");
// runs of consecutive lines with the same mapping
let run = null;
const flush = () => run && L.push(`| ${run.a === run.b ? run.a : `${run.a}–${run.b}`} | ${run.p} |`);
for (const l of lines) {
  const p = pointOf.get(l.n) || (chatter.has(l.n) ? "chatter" : "unmapped"), t = fmt(l.t, l.part);
  if (run && run.p === p && run.part === l.part) run.b = t; else { flush(); run = { a: t, b: t, p, part: l.part }; }
}
flush();
const unmapped = lines.filter((l) => !pointOf.has(l.n) && !chatter.has(l.n)).length;
L.push("", `Lines: ${lines.length}; in a point ${pointOf.size}; chatter ${chatter.size}; unmapped ${unmapped}.`, "");
writeFileSync(join(ROOT, out), L.join("\n"));
const byScreen = {}; points.forEach((p) => (byScreen[p.screen] = (byScreen[p.screen] || 0) + 1));
console.log(`Wrote ${out}: ${lines.length} lines -> ${points.length} draft points (${Object.entries(byScreen).map(([k, v]) => `${k} ${v}`).join(", ")}), ${chatter.size} chatter, ${unmapped} unmapped.`);
console.log("Next: check each cause in code, fill 1a/1b, merge or split points, then add the rows to regressions.md.");
