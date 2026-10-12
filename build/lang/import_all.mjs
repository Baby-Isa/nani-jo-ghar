#!/usr/bin/env node
// Re-runnable: rebuilds data/lang/{lexicon,paradigms,abstract,concrete,clips}.json and the reports from every
// source in the repo (decision 40, rule G27). Run it again after each of Mum's rounds, after adding her answers to
// grammar-notes / the hand files / the recordings list:
//
//   node build/lang/import_all.mjs            write data/lang/ and data/lang/reports/
//   node build/lang/import_all.mjs --check    build in memory, run the data check, write nothing (exit 1 on errors)
//
// The layers, in order (a later layer adds to or merges with an earlier one; a disagreement between two sources
// becomes an open question on the entry and a row in data/lang/reports/clash-list.md, never a silent choice):
//   1 import_seed       the cited 4a seed (grammar-notes §1-§52)
//   2 hand/*            what lives only in prose: grammar-notes sections, decisions (each entry cites its section)
//   3 import_lexicon_md the tables in lexicon.md §6 (Mum's 5 Oct words)
//   4 import_cook       data/cook.json, stations, conversations, story
//   5 import_clinic     data/lang/seed/clinic.json (+ data/clinic.json's ids), clinic/pipeline.json, clinic/heal/*
//   6 import_content    data/content.json (the class handout words: always draft)
//   7 import_modes      the parked modes' placeholders (dress, who, relations, monsoon, snap, tidy, find)
//   8 phrases           fixed expressions are made of other words (parts) wherever every word is an entry
//   9 import_audio      every recording in data/family-audio.json as a clips.json row
//  10 reports           the gap list and the clash list
import { Store, writeJSON, readJSON } from "./lib.mjs";
import { importSeed } from "./import_seed.mjs";
import * as handWords from "./hand/words.mjs";
import * as handRules from "./hand/rules.mjs";
import * as handResolutions from "./hand/resolutions.mjs";
import * as handLate from "./hand/late.mjs";
import * as handConfirmed from "./hand/confirmed.mjs";
import * as handLoans from "./hand/loans.mjs";
import { importLexiconMd } from "./import_lexicon_md.mjs";
import { importCook } from "./import_cook.mjs";
import { importClinic } from "./import_clinic.mjs";
import { importConversations } from "./import_conv.mjs";
import { importContent } from "./import_content.mjs";
import { importModes } from "./import_modes.mjs";
import { phrasify } from "./phrases.mjs";
import { importAudio } from "./import_audio.mjs";
import { writeReports } from "./reports.mjs";
import { validate } from "../../js/core/lang/engine/validate.js";

export function buildStore() {
  const S = new Store();
  const log = {};
  log.seed = importSeed(S);
  handWords.apply(S);
  handRules.apply(S);
  handResolutions.apply(S);
  log.lexiconMd = importLexiconMd(S);
  log.cook = importCook(S);
  log.conversations = importConversations(S);
  log.clinic = importClinic(S);
  log.content = importContent(S);
  log.modes = importModes(S);
  handLate.apply(S);
  log.phrases = phrasify(S);
  log.audio = importAudio(S);
  log.clashes = S.settle();
  handConfirmed.apply(S);
  handLoans.apply(S);
  return { S, log };
}

export function dataOf(S) {
  const params = readJSON("data/lang/params.json");
  return {
    params,
    lexicon: { _about: "The one source of words (engine-design § 5.1; rules G13, G18, G26, G27). Built by build/lang/import_all.mjs from every source in the repo; do not edit by hand: change the source or a build/lang/hand/ file and re-run it. Every entry cites its source.", entries: S.lexicon() },
    paradigms: { _about: "Word classes: how each form (cell) is made, with a status per cell (engine-design § 5.2). Built by build/lang/import_all.mjs.", paradigms: S.paradigms },
    abstract: { _about: "The meanings game code asks for, language-neutral (engine-design § 5.3). `core` expands a meaning into other meanings; `elicit` is how Mum is asked when a rule is missing. Built by build/lang/import_all.mjs.", functions: S.functions },
    concrete: { _about: "How each meaning becomes Kutchi words: slots, agreement, register variants, exceptions (engine-design § 5.4). Built by build/lang/import_all.mjs.", lin: S.lin },
    clips: { _about: "The clip index: which family recording (an id in data/family-audio.json) says which word form (lex + cell) or which whole meaning (a meaning key). Recordings never change the engine (rule G12). Built by build/lang/import_all.mjs from data/family-audio.json.", clips: S.clips },
  };
}

/**
 * The built data against the committed data/lang/*.json: every changed field, and the status demotions among them (a
 * confirmed entry or form cell coming out as draft, unknown or to-record). A rebuild must never demote a confirmation
 * silently (S05 plan, flaw 2): a confirmation lives in a source or build/lang/hand/, never only in data/lang/.
 */
export function compare(built) {
  const rank = { confirmed: 3, draft: 1, unknown: 0, "to-record": 0 };
  const out = [];
  const walk = (a, b, p) => {
    if (JSON.stringify(a) === JSON.stringify(b)) return;
    if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], `${p}.${k}`);
      return;
    }
    out.push({ p, was: a, now: b });
  };
  const byId = (o) => {
    const x = Object.assign({}, o);
    delete x._about;
    for (const k of Object.keys(x)) if (Array.isArray(x[k]) && x[k].every((e) => e && e.id)) x[k] = Object.fromEntries(x[k].map((e) => [e.id, e]));
    return x;
  };
  for (const f of ["lexicon", "paradigms", "abstract", "concrete", "clips"]) walk(byId(readJSON(`data/lang/${f}.json`)), byId(built[f]), f);
  // a confirmed entry that is gone, or whose status went down
  const demotions = out.filter((d) => (/\.status$/.test(d.p) && d.was === "confirmed" && (rank[d.now] ?? 0) < 3) || (d.was && typeof d.was === "object" && d.was.status === "confirmed" && !(d.now && d.now.status === "confirmed")));
  return { out, demotions };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes("--check");
  const { S, log } = buildStore();
  const data = dataOf(S);
  const audio = readJSON("data/family-audio.json");
  const v = validate(data, { audio });
  console.log(JSON.stringify(log, (k, val) => (k === "unresolved" ? val.length : val), 1));
  console.log(`store errors: ${S.errors.length}`);
  S.errors.slice(0, 40).forEach((e) => console.log("  store:", e));
  console.log(`validator: ${v.errors.length} errors, ${v.warnings.length} warnings`);
  v.errors.slice(0, 60).forEach((e) => console.log(`  ERROR ${e.where}: ${e.msg}`));
  // never demote a confirmation (S05 B): refuse unless the person running it says why (--allow-demote "<why>")
  const { demotions } = compare(data);
  const allow = process.argv.includes("--allow-demote");
  if (demotions.length) {
    console.log(`${allow ? "ALLOWED" : "REFUSED"}: ${demotions.length} confirmed entries or forms would be demoted:`);
    demotions.forEach((d) => console.log(`  ${d.p}: ${JSON.stringify(d.was)} -> ${JSON.stringify(d.now)}`));
    if (!allow) {
      console.error("not writing: put the confirmation in a source or build/lang/hand/confirmed.mjs (node build/lang/diff.mjs lists them), or pass --allow-demote \"<why>\"");
      process.exit(1);
    }
  }
  if (!check) {
    if (v.errors.length || S.errors.length) {
      console.error("not writing: fix the errors above first");
      process.exit(1);
    }
    for (const f of ["lexicon", "paradigms", "abstract", "concrete", "clips"]) writeJSON(`data/lang/${f}.json`, data[f]);
    writeReports({ S, log, data, audio, validation: v });
    console.log("wrote data/lang/*.json and data/lang/reports/");
  } else if (v.errors.length || S.errors.length) process.exit(1);
}
