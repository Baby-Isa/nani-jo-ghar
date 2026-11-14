#!/usr/bin/env node
// The next sitting with Mum, from the one recording sheet (Zafar, 14 Nov: one central sheet, only ever added to, never rebuilt in a
// new shape). This tool no longer writes a sheet of its own: it adds the clash list's questions for Mum to data/lang/recording-sheet.json
// (quick checks: two spellings or two words for one thing), regenerates docs/language/recording-sheet.docx and .md, and prints the
// plan for the next sitting (grammar first, then each game, the rows still to do).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, args, help, die } from "./lib.mjs";
import { loadSheet, saveSheet, addRow, validate, writeOutputs, summary, ordered, norm, OPEN, SOURCE, DOCX } from "../lang/recording-sheet.mjs";

const HELP = `
node build/tools/ops/mumsheet.mjs [--dry] [--max 8] [--sections G-NOUN,CK-CHAI] [--date YYYY-MM-DD]
  1. Adds the clash list's questions only Mum can settle (data/lang/reports/clash-list.md sections 1 and 2, not yet settled: two
     spellings or two words for one thing) to ${SOURCE} as "which is right?" rows in G-CHK (once each; never a sheet of its own).
     Zafar's own calls (clash list sections 3-6) are for him, not Mum, and stay out.
  2. Regenerates ${DOCX} and its .md (node build/tools/lang/recording-sheet.mjs).
  3. Prints the next sitting: in the sheet's order (grammar first, then each game), up to --max rows still to do per section
     (needs Mum's Kutchi first), with each row's ID, which Mum says before the line so the recording lines up with the sheet.
  Run node build/tools/ops/recordings.mjs first (it adds what the engine needs). --dry: print only, write nothing. No network.
  After the sitting: node build/tools/ops/mumround.mjs <folder>; the clips' question ids are the rows' ids, so
  node build/tools/ops/recordings.mjs marks those rows recorded.`;

// the clash list: only what Mum can settle (section 1 not yet settled, section 2)
export function parseClash(text) {
  const out = [];
  let sec = 0, settled = false;
  for (const line of String(text).split("\n")) {
    const s = /^## (\d)\./.exec(line); if (s) { sec = +s[1]; settled = false; continue; }
    if (/^### Already settled/.test(line)) { settled = true; continue; }
    const it = /^\d+\. (.+)$/.exec(line);
    if (!it || settled || (sec !== 1 && sec !== 2)) continue;
    const m1 = /^\*\*(.+?)\*\* \(`([^`]+)`\): the (spelling or the word|form)\. The engine uses "([^"]+)".*the other source says "([^"]+)"/.exec(it[1]);
    const m2 = /^\*\*(.+?)\*\*:? .*?\*?([\w-]+)\*? \(`([^`]+)`\) against .*?\*([\w-]+)\*/.exec(it[1]);
    const m3 = /^\*\*(.+?)\*\* \(`([^`]+)`\): Two words for the same thing \(([^)]+)\)/.exec(it[1]);
    const row = m1 ? { en: m1[1], id: m1[2], have: [m1[4], m1[5]], ask: "which is right for you?" }
      : m3 ? { en: m3[1], id: m3[2], have: m3[3].split(/\s*\/\s*/), ask: "which does the family say?" }
      : m2 ? { en: m2[1], id: m2[3], have: [m2[2], m2[4]], ask: "which does the family say?" } : null;
    if (row && !out.some((c) => c.en === row.en && c.have.join() === row.have.join())) out.push(row);
  }
  return out;
}
// a clash as a row of the sheet: the two spellings are the question (both come from the family's sources), never an answer
export const clashRow = (c) => ({ section: "G-CHK", en: `${c.en}: ${c.have.join(" or ")}? (${c.ask})`, for: `two of our sources disagree (the engine's ${c.id})`, status: "to record", source: "the engine's clash list", keys: [`clash:${c.id}:${norm(c.have.join(" "))}`] });

// the next sitting: per section, in the sheet's order, the first rows still to do
export function plan(sheet, { max = 8, sections = null } = {}) {
  const out = [];
  for (const s of sheet.sections) {
    if (sections && !sections.includes(s.id)) continue;
    const open = ordered(sheet.rows.filter((r) => r.section === s.id && OPEN.has(r.status)));
    if (open.length) out.push({ section: s, rows: open.slice(0, max), more: Math.max(0, open.length - max) });
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = args(); help(HELP, a);
  if (a.has("out") || a.has("docx") || a.has("round")) die(`mumsheet.mjs no longer writes a sheet of its own: the one sheet is ${DOCX} (Zafar, 14 Nov). Run it with no flags.`);
  const sheet = loadSheet();
  const clash = existsSync(join(ROOT, "data/lang/reports/clash-list.md")) ? parseClash(readFileSync(join(ROOT, "data/lang/reports/clash-list.md"), "utf8")) : [];
  const added = clash.map((c) => addRow(sheet, clashRow(c))).filter((r) => r.added).map((r) => r.row.id);
  if (!a.has("dry")) {
    if (added.length) sheet.updated = a.val("date") || new Date().toISOString().slice(0, 10);
    const errs = validate(sheet);
    if (errs.length) die(`${SOURCE}: ${errs.slice(0, 10).join("; ")}`, 1);
    saveSheet(sheet);
    writeOutputs(sheet);
  }
  console.log(`${a.has("dry") ? "Dry run: " : ""}${added.length} quick check(s) from the clash list ${a.has("dry") ? "would be " : ""}added${added.length ? ` (${added.join(", ")})` : ""}. ${summary(sheet)}.`);
  const p = plan(sheet, { max: +a.val("max", 8), sections: a.val("sections") ? String(a.val("sections")).split(",") : null });
  console.log(`\nThe next sitting (grammar first; say each row's ID before the line):`);
  for (const { section, rows, more } of p) {
    console.log(`\n${section.id} · ${section.title}`);
    for (const r of rows) console.log(`  ${r.id.padEnd(13)} ${r.en}${r.kutchi ? `  [known: ${r.kutchi}]` : ""}`);
    if (more) console.log(`  … ${more} more in ${DOCX}`);
  }
}
