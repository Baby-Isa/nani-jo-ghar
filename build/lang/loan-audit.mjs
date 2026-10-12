#!/usr/bin/env node
// The borrowing audit (decision 87, LNG-13): every lexicon word that looks English (its Kutchi is a word of its own
// English gloss, before any bracket), with whether it is marked loan: "en". Read-only. Exit 1 if a loan Zafar named in
// decision 87 is not marked, or the dropped draft 'aabhar aanjo' is back.
//   node build/lang/loan-audit.mjs [--md]      (--md: a table for a report)
import { readJSON } from "./lib.mjs";
import { LOANS } from "./hand/loans.mjs";

const entries = readJSON("data/lang/lexicon.json").entries;
// words English took from South Asia (a checker may read them as English; they are not loans from English)
const SOUTH_ASIAN = new Set(["chai", "chaat", "chutney", "ghee", "kebab", "keema", "samosa", "sev", "tawa", "bhajiya", "garam", "masalo"]);
// the game's own Kutchi names for its dishes and a sound: their gloss is the word itself, not English
const OWN = new Set(["mishkaki", "sekelo", "mmm"]);
const rows = [];
for (const e of entries) {
  // words only: a phrase is made of words, and a loan inside it is its word's (cup in wadho cup khanech)
  if (!e.lemma || e.status === "to-record" || e.pos === "PN" || e.pos === "Phrase" || OWN.has(String(e.lemma).toLowerCase())) continue;
  const head = String(e.gloss || "").toLowerCase().split("(")[0];
  const gw = new Set(head.match(/[a-z]+/g) || []);
  const lw = String(e.lemma).toLowerCase().match(/[a-z]+/g) || [];
  const eng = lw.filter((w) => w.length > 2 && gw.has(w));
  if (!eng.length) continue;
  const kind = e.loan === "en" ? "loan (marked)" : eng.every((w) => SOUTH_ASIAN.has(w)) ? "South Asian word, not from English" : /english word|english 'thank you'|the family says it/i.test(e.gloss + " " + (e.src || []).join(" ")) ? "English, the source says the family uses it: to mark" : "looks English: to confirm";
  rows.push({ id: e.id, lemma: e.lemma, gloss: e.gloss, status: e.status, kind });
}
const bad = [];
for (const [id] of LOANS) if (!entries.some((e) => e.id === id && e.loan === "en")) bad.push(`${id} is not marked loan: "en"`);
if (entries.some((e) => /aabhar aanjo/i.test(e.lemma || ""))) bad.push("the draft 'aabhar aanjo' is still in the lexicon");
if (process.argv.includes("--md")) {
  console.log("| Word | Meaning | Status | What it is |\n|---|---|---|---|");
  rows.forEach((r) => console.log(`| ${r.lemma} | ${r.gloss} | ${r.status} | ${r.kind} |`));
} else rows.forEach((r) => console.log(`${r.kind.padEnd(52)} ${r.lemma.padEnd(28)} ${r.id}`));
console.log(`${rows.length} English-looking words: ${rows.filter((r) => r.kind === "loan (marked)").length} marked loans${bad.length ? `; FAIL: ${bad.join("; ")}` : ""}`);
process.exit(bad.length ? 1 : 0);
