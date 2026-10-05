#!/usr/bin/env node
// Mum question sheet: the engine's gap list and clash list -> the next round's sheet (markdown, and Word through build/build_mum_questions_docx.js).
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, args, help, die, sh } from "./lib.mjs";

const HELP = `
node build/tools/ops/mumsheet.mjs [--round N] [--out file.md] [--docx] [--max 30] [--prefix R6-] [--date "6 Oct 2026"]
  Reads data/lang/reports/gap-list.md and clash-list.md (rebuild them first: node build/lang/import_all.mjs) and writes the next
  round's question sheet in the Round 5 layout: how to answer, Part 1 quick checks (the clash list's open spellings and
  "two words for one thing"), then Cook (decision: Cook first) and the clinic, each as sentences (say once), words (three
  times), he-word or she-word, missing forms, and words to record. The engine's own wording is kept (never re-written by hand,
  never Kutchi guessed): rows show what we have, with the earlier question id in "Asked before".
  --max N     rows per part (default 30); the rest are counted as "next round" so a sitting stays about an hour
  --out       default: print counts only (dry run). Give a path to write, e.g.
              "docs/language/mum-questions/Questions for Mum (Round 6).md" (the round number is the next free one)
  --docx      also write the Word copy beside it (needs the npm "docx" package; it is installed globally here)
  Zafar's spelling and gender calls (clash list sections 3-6) are for him, not Mum, and stay out of the sheet. No network.`;
const a = args(); help(HELP, a);
const REP = join(ROOT, "data", "lang", "reports"), QDIR = join(ROOT, "docs", "language", "mum-questions");
for (const f of ["gap-list.md", "clash-list.md"]) if (!existsSync(join(REP, f))) die(`No ${f}: run node build/lang/import_all.mjs first.`);
const MAX = +a.val("max", 30);
const round = +a.val("round", 0) || Math.max(0, ...readdirSync(QDIR).map((f) => +((/Round (\d+)/.exec(f) || [])[1] || 0))) + 1;
const prefix = a.val("prefix", `R${round}-`);
const date = a.val("date") || new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" }).format(new Date());

// ---- gap list: mode -> category -> items
const gaps = { cook: {}, clinic: {} };
let mode = null, cat = null;
for (const line of readFileSync(join(REP, "gap-list.md"), "utf8").split("\n")) {
  if (/^## Cook/.test(line)) { mode = "cook"; continue; }
  if (/^## The clinic/.test(line)) { mode = "clinic"; continue; }
  if (/^## /.test(line)) { mode = null; continue; }
  const h = /^### (.+?) \(\d+\)$/.exec(line);
  if (h && mode) { cat = h[1]; gaps[mode][cat] = []; continue; }
  const it = /^\d+\. (.+)$/.exec(line);
  if (it && mode && cat) {
    const ask = /\s*Ask: (.+?)\.?$/.exec(it[1]);
    gaps[mode][cat].push({ say: (ask ? it[1].slice(0, ask.index) : it[1]).trim(), was: ask && ask[1] !== "new" ? ask[1] : "" });
  }
  const need = /^\s+- Needed by: (.+)$/.exec(line);
  if (need && mode && cat && gaps[mode][cat].length) gaps[mode][cat].at(-1).need = need[1];
}

// ---- clash list: only what Mum can settle (section 1 not yet settled, section 2)
const clash = [];
let sec = 0, settled = false;
for (const line of readFileSync(join(REP, "clash-list.md"), "utf8").split("\n")) {
  const s = /^## (\d)\./.exec(line); if (s) { sec = +s[1]; settled = false; continue; }
  if (/^### Already settled/.test(line)) { settled = true; continue; }
  const it = /^\d+\. (.+)$/.exec(line);
  if (!it || settled || (sec !== 1 && sec !== 2)) continue;
  const m1 = /^\*\*(.+?)\*\* \(`[^`]+`\): the (spelling or the word|form)\. The engine uses "([^"]+)".*the other source says "([^"]+)"/.exec(it[1]);
  const m2 = /^\*\*(.+?)\*\*:? .*?\*?([\w-]+)\*? \(`[^`]+`\) against .*?\*([\w-]+)\*/.exec(it[1]);
  const m3 = /^\*\*(.+?)\*\* \(`[^`]+`\): Two words for the same thing \(([^)]+)\)/.exec(it[1]);
  const row = m1 ? { en: m1[1], have: `${m1[3]} · ${m1[4]}`, note: "which is right for you?" }
    : m3 ? { en: m3[1], have: m3[2].replace(/ \/ /g, " · "), note: "which does the family say?" }
    : m2 ? { en: m2[1], have: `${m2[2]} · ${m2[3]}`, note: "which does the family say?" } : null;
  if (row && !clash.some((c) => c.en === row.en && c.have === row.have)) clash.push(row);
}

// ---- the sheet
const PARTS = [
  ["Sentences and frames the engine cannot say yet", "Sentences: say each once, the way you would at home", "once", 30],
  ["Words with no Kutchi yet (English placeholders in the game today)", "New words: say each three times, in a short sentence if that is easier", "three", 20],
  ["Is it a he-word or a she-word? (the engine used the he-form, Mum's rule, and flags it)", "One and two: say each line once", "once", 15],
  ["A form of a word we know is missing (plural, 'with the …')", "Missing forms: say each once", "once", 15],
  ["We know the word but have no recording of it", "Words to record: say each three times, with a gap after each", "three", 10],
];
const md = (t) => t.replace(/\|/g, "/").replace(/^Please say(, the way you would at home:| these the way you would at home:)\s*/i, "").replace(/^Please record:\s*/i, "");
let n = 0, secs = 0, later = 0;
const id = () => `${prefix}${++n}`;
const L = [`# Nani jo Ghar — Questions for Mum (Round ${round})`, "",
  `${date} · Made from the language engine's gap list: every line below is something the game says today and cannot yet say in Kutchi, or has no recording of. **Cook comes first**, then the clinic.`, "",
  "## How to answer", "",
  "- **Record one long voice file** on the phone, in a quiet room, in as many sittings as you like.",
  "- **Before each part say its name** (\"Part 2\"), **and before each line its number** (\"R" + round + "-12\"). That is how the recording is lined up with this sheet.",
  "- **Words: say each three times**, with a gap of about two seconds after each. **Sentences: say each once**, naturally.",
  "- **Say it the way you really would**, not word for word. Two ways? Say both. Not sure? Say \"skip\". If the family just uses the English word, say so: that is a real answer.",
  "- The right-hand column is for Zafar to fill in afterwards.", "", "---", ""];
const table = (rows, third = "Asked before") => { L.push(`| ID | Say | ${third} | Notes |`, "|---|---|---|---|"); for (const r of rows) L.push(r); L.push(""); };

let part = 0;
if (clash.length) {
  const rows = clash.slice(0, MAX); later += clash.length - rows.length;
  L.push(`## Part ${++part} · Quick checks: which is right? (about ${Math.ceil(rows.length * 20 / 60)} minutes)`, "", "*Two of our sources disagree. Say the one you would use, three times.*", "");
  table(rows.map((c) => `| ${id()} | ${c.en}: *${c.have}* | ${c.note} | |`), "Question"); secs += rows.length * 20;
}
for (const [mkey, mname] of [["cook", "The cooking game"], ["clinic", "The clinic"]]) {
  L.push(`# ${mname}`, "");
  for (const [cat, title, times, per] of PARTS) {
    const items = gaps[mkey][cat] || [];
    if (!items.length) continue;
    const rows = items.slice(0, MAX); later += items.length - rows.length;
    const mins = Math.ceil(rows.length * per / 60); secs += rows.length * per;
    L.push(`## Part ${++part} · ${title} (about ${mins} minute${mins > 1 ? "s" : ""})`, "");
    if (items.length > rows.length) L.push(`*The first ${rows.length} of ${items.length}; the rest come next round.*`, "");
    table(rows.map((it) => `| ${id()} | ${md(it.say)}${times === "three" ? " ×3" : ""} | ${it.was} | |`));
  }
}
L.push("---", "", `*${n} lines, about ${Math.round(secs / 60)} minutes of recording; ${later} more wait for the next round. Built by \`node build/tools/ops/mumsheet.mjs\` from \`data/lang/reports/\`; after the recording: \`node build/tools/ops/mumround.mjs <folder>\`.*`, "");

const count = (m) => Object.values(gaps[m]).reduce((s, x) => s + x.length, 0);
console.log(`Round ${round}: ${n} lines in ${part} parts (quick checks ${Math.min(clash.length, MAX)}, Cook gaps ${count("cook")}, clinic gaps ${count("clinic")}, ${MAX} a part at most), about ${Math.round(secs / 60)} min; ${later} left for the next round.`);
const out = a.val("out");
if (!out) { console.log("Dry run: give --out <file.md> to write it."); process.exit(0); }
writeFileSync(out, L.join("\n"));
console.log(`Wrote ${out}`);
if (a.has("docx")) {
  const docx = out.replace(/\.md$/, ".docx");
  const NODE_PATH = [process.env.NODE_PATH, sh("npm", ["root", "-g"], { soft: true })].filter(Boolean).join(":");
  try { sh("env", [`NODE_PATH=${NODE_PATH}`, "node", "build/build_mum_questions_docx.js", out, docx]); console.log(`Wrote ${docx}`); }
  catch (e) { console.log(`Word copy not made (${e.message.slice(0, 120)}): the markdown is complete on its own.`); }
}
