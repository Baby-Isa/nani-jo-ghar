#!/usr/bin/env node
// The one recording sheet for Mum (Zafar, 20 Oct): every gap in one place, grammar first, then Cook, the clinic and the story frame.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createEngine, DATA_FILES } from "../../../js/core/lang/engine/index.js";
import { ROOT, args, help, die } from "./lib.mjs";

const HELP = `
node build/tools/ops/recordings.mjs [--check] [--stdout] [--out docs/language/recording-sheet.md]
  Reads what is missing from the family's voices and writes ONE sheet, docs/language/recording-sheet.md, in this order:
    1 Grammar first (open grammar questions that unlock many lines: plurals, "with", "and", genders, verb forms; lock grammar, then
      vocabulary slots in), 2 Cook, 3 Clinic, 4 Story mode: the door, 5 the ride, 6 the evening book, 7 other modes.
  Each section is a table: English meaning, where it is used, how often (the lines that need it, or the days of the 5-day frame), status.
  English meanings and gaps only: the tool never writes Kutchi. A Kutchi spelling shown is one the engine already holds.
  Sources: data/lang/reports/gap-list.md (Cook and clinic gaps; rebuild with node build/lang/import_all.mjs), data/lang/*.json (the engine's
  to-record entries, and whether each line of data/day.json can be said and has a recording), data/family-audio.json, docs/language/
  doctor-recording-list.md, docs/language/grammar-kb.md (open grammar), docs/language/mum-questions/README.md (open questions).
  --check   write nothing; exit 1 if the sheet on disk differs from what the sources give now (run in checks.mjs as "recordings")
  --stdout  print the sheet instead of writing it.   No network, no browser.`;
const a = args(); help(HELP, a);

const rd = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");
const J = (p) => JSON.parse(rd(p));
export const SHEET = "docs/language/recording-sheet.md";

/* ---------------- small helpers ---------------- */
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
const cell = (s) => String(s == null ? "" : s).replace(/\|/g, "/").replace(/\s*\n\s*/g, " ").trim();
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

/* ---------------- the gap list (the existing generated report) ---------------- */
const KIND = [[/^Sentences and frames/, "rule"], [/^Words with no Kutchi/, "lexeme"], [/^A form of a word/, "form"], [/^Is it a he-word/, "feature"], [/^We know the word/, "audio"]];
export function parseGapList(text) {
  const out = { cook: [], clinic: [], awaiting: 0 };
  let mode = null, kind = null, cur = null, inAwait = false;
  for (const line of String(text).split("\n")) {
    if (/^## Cook\b/.test(line)) { mode = "cook"; kind = null; inAwait = false; continue; }
    if (/^## The clinic/.test(line)) { mode = "clinic"; kind = null; inAwait = false; continue; }
    if (/^## Recorded but not yet ticked OK/.test(line)) { mode = null; inAwait = true; continue; }
    if (/^## /.test(line)) { mode = null; inAwait = false; continue; }
    if (inAwait) { if (/^- /.test(line)) out.awaiting++; continue; }
    const h = /^### (.+?) \(\d+\)$/.exec(line);
    if (h && mode) { kind = (KIND.find(([re]) => re.test(h[1])) || [])[1] || null; continue; }
    const it = /^\d+\. (.+)$/.exec(line);
    if (it && mode && kind) { cur = { mode, kind, text: it[1], needed: "" }; out[mode].push(cur); continue; }
    const nb = /^\s+- Needed by: (.+)$/.exec(line);
    if (nb && cur) cur.needed = nb[1].replace(/\.$/, "");
  }
  return out;
}
const prettyId = (s) => (/^[a-z]+\.[a-z0-9.-]+$/.test(s) ? s.replace(/^[a-z]+\./, "").replace(/-/g, " ") : s);
// -> { en, ask: [ids], note, spelling }
export function interpretGap(it) {
  let text = it.text, ask = [], note = "";
  const m = /\s*Ask: (.+?)\.?$/.exec(text);
  if (m) {
    text = text.slice(0, m.index);
    for (const x of m[1].split(/,\s*/)) { if (/^[A-Z]\d+$/.test(x)) ask.push(x); else if (!/^(new|to record.*)$/.test(x)) note = x; }
  }
  const quotes = [...text.matchAll(/"([^"]+)"/g)].map((q) => q[1]);
  if (it.kind === "rule") return { en: quotes.join(" · ") || text, ask, note };
  if (it.kind === "lexeme") return { en: prettyId(quotes[0] || text), ask, note };
  if (it.kind === "audio") return { en: "", ask, note, spelling: quotes[0] || text };
  if (it.kind === "feature") return { en: ((/^One (.+?), two /.exec(text) || [])[1]) || text, ask, note };
  return { en: text.trim(), ask, note };
}
const shortLabel = (l) => {
  let m;
  if ((m = /^(Cook|Clinic) word "(.+)" \([^()]*\)(?:, more than one)?$/.exec(l))) return `${m[1]}: ${m[2]}`;
  if ((m = /^(cook|clinic) line "(.+?)" \([^()]*\)(?:, with .+?)?(?: \((?:informal|polite)\))?$/.exec(l))) return `${m[1] === "cook" ? "Cook" : "Clinic"} line: ${m[2]}`;
  return l;
};
// "A; B; C … (39 lines)" -> { where: [short labels, deduped], count }
export function usedBy(needed) {
  const m = / … \((\d+) lines\)$/.exec(needed);
  const labels = (m ? needed.slice(0, m.index) : needed).split("; ").filter(Boolean);
  const where = [...new Set(labels.map(shortLabel))];
  return { where, count: m ? +m[1] : labels.length, more: m ? +m[1] - labels.length : 0 };
}
const whereText = (where, extra = 0) => where.slice(0, 3).join("; ") + (where.length > 3 || extra > 0 ? ` (+${where.length > 3 ? where.length - 3 + extra : extra} more)` : "");

/* ---------------- the doctor's list ---------------- */
export function parseDoctorList(text) {
  const rows = []; let sec = "", sub = "", dCount = 0;
  for (const line of String(text).split("\n")) {
    let m;
    if ((m = /^## ([A-E])\./.exec(line))) { sec = m[1]; sub = ""; continue; }
    if ((m = /^### (.+)/.exec(line))) { sub = m[1]; continue; }
    if (!/^\| [A-E]\d+ \|/.test(line)) continue;
    const c = line.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((x) => x.trim());
    if (c.length < 4) continue;
    if (c[0][0] === "D") { dCount++; continue; }
    rows.push({ id: c[0], sec: c[0][0], sub, en: c[1], guide: c[2], where: c[3] });
  }
  return { rows, dCount };
}
const oftenOf = (r) => /every visit|every errand|every patient|every heal|after every/.test(r.where) ? "every visit" : (/level (\d)/.exec(r.where) ? `level ${/level (\d)/.exec(r.where)[1]}+` : r.sec === "B" ? "when that game is played" : r.sec === "E" ? "when he plays the patient" : "—");

/* ---------------- the grammar knowledge base and the README's open questions ---------------- */
export function parseKbTable(text) {
  const out = [];
  for (const line of String(text).split("\n")) {
    const m = /^\| (\d+) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$/.exec(line);
    if (!m) continue;
    const status = m[3].replace(/\*\*/g, "").trim();
    // closed: "Known", "Known: none", "Known (…)", "Known list"; a "Known for one thing" is partly open
    if (/^(Known|Rule known$)(?! for)/.test(status) && !/open|unknown|partly/i.test(status)) continue;
    out.push({ n: +m[1], feature: m[2].replace(/\*\*/g, "").trim(), status, priority: m[4].trim(), settled: m[5].trim() });
  }
  return out;
}
export function parseOpenQuestions(text) {
  const t = String(text), i = t.indexOf("## For the next round");
  if (i < 0) return [];
  return t.slice(i).split("\n").slice(1).map((l) => l.replace(/^- /, "").replace(/\*\*/g, "").replace(/`/g, "").trim()).filter(Boolean);
}

/* ---------------- the engine and the story frame ---------------- */
function engines() {
  const data = {};
  for (const f of DATA_FILES) data[f] = J(`data/lang/${f}.json`);
  const audio = J("data/family-audio.json");
  const mk = (path) => createEngine({ data, audio, path, phrases: false });
  return { data, test: mk("test"), store: mk("store") };
}
const BLOCKING = new Set(["lexeme", "form", "rule"]);
function statusOf(E, m, gloss, en = "") {
  const names = (gaps) => [...new Set(gaps.map((g) => (g.lex && gloss.get(g.lex)) || null).filter((x) => x && norm(x) !== norm(en)))];
  const detail = (gaps, none) => { const n = names(gaps); return n.length ? `: ${n.join(", ")}` : none; };
  const t = E.test.say(m);
  const block = t.gaps.filter((g) => BLOCKING.has(g.kind));
  if (block.length) return { kind: "none", text: `No Kutchi yet (grey English)${detail(block, ": the whole line")}` };
  const rec = t.gaps.filter((g) => g.kind === "audio");
  if (rec.length) return { kind: "rec", text: `The engine can say it; no family recording${detail(rec, " yet").replace(/^: /, " of: ")}` };
  const s = E.store.say(m);
  if (s.gaps.some((g) => g.kind === "audio")) return { kind: "ok", text: "Recorded; waiting for Zafar's OK in lab/family-audio.html" };
  if (t.drafts && t.drafts.length) return { kind: "draft", text: "Said, but a draft (flagged until Mum confirms)" };
  return { kind: "ready", text: "Ready" };
}

/* ---------------- the sheet ---------------- */
class Rows {
  constructor() { this.map = new Map(); }
  add(key, row) {
    const old = this.map.get(key);
    if (!old) { this.map.set(key, { where: [], count: 0, ...row }); return this.map.get(key); }
    for (const w of row.where || []) if (!old.where.includes(w)) old.where.push(w);
    old.count += row.count || 0;
    return old;
  }
  list() { return [...this.map.values()]; }
}
const table = (rows, { often = "How often" } = {}) => {
  const L = ["| English meaning | Where it is used | " + often + " | Status |", "|---|---|---|---|"];
  for (const r of rows) L.push(`| ${cell(r.en)} | ${cell(r.whereText != null ? r.whereText : whereText(r.where))} | ${cell(r.often != null ? r.often : r.count ? plural(r.count, "line") : "—")} | ${cell(r.status)} |`);
  return L;
};
const byCount = (x, y) => (y.count || 0) - (x.count || 0) || String(x.en).localeCompare(String(y.en));

export const RIDE_CANDIDATES = ["cow", "tree", "flower", "bus", "bicycle", "tractor", "camel", "horse", "sheep", "buffalo", "boat", "sun", "moon", "star", "cloud", "road", "field", "shop"];

export function buildSheet() {
  const gl = parseGapList(rd("data/lang/reports/gap-list.md"));
  const doc = parseDoctorList(rd("docs/language/doctor-recording-list.md"));
  const kb = parseKbTable(rd("docs/language/grammar-kb.md"));
  const open = parseOpenQuestions(rd("docs/language/mum-questions/README.md"));
  const day = J("data/day.json");
  const E = engines();
  const lex = E.data.lexicon.entries;
  const gloss = new Map(lex.map((e) => [e.id, e.gloss || e.id]));
  const bySpelling = new Map();
  for (const e of lex) for (const s of [e.lemma, ...Object.values(e.forms || {}).map((f) => (f && f.t) || f)]) if (typeof s === "string" && s) (bySpelling.get(s) || bySpelling.set(s, new Set()).get(s)).add(e.gloss || e.id);
  const seen = new Rows(); // English already on the sheet (section 7 does not repeat it)
  const counts = {};

  /* ---- 2 Cook / 3 Clinic words, from the gap list ---- */
  const grammar = new Rows(), cook = new Rows(), clinic = new Rows(), genders = { cook: [], clinic: [] };
  const lineCount = { cook: 0, clinic: 0 };
  for (const mode of ["cook", "clinic"]) {
    for (const it of gl[mode]) {
      const x = interpretGap(it), u = usedBy(it.needed);
      const asked = x.ask.length ? ` Asked before: ${x.ask.join(", ")}.` : x.note ? ` ${x.note}.` : "";
      const base = { where: u.where, count: u.count };
      if (it.kind === "feature") { genders[mode].push({ en: x.en, count: u.count }); continue; }
      if (it.kind === "form") {
        const noun = (/^One (.+?),/.exec(x.en) || [])[1];
        const seeToo = noun && open.some((q) => new RegExp(`\\b${noun}\\b`, "i").test(q)) ? " Zafar, 20 Oct: see 1c." : "";
        grammar.add(`form|${norm(x.en)}`, { ...base, en: x.en, status: `Form missing: Mum's answer unlocks it.${asked}${seeToo}`, order: 1 }); continue;
      }
      if (it.kind === "rule" && mode === "cook") { grammar.add(`rule|${norm(x.en)}`, { ...base, en: x.en, status: `Rule not known yet: needs Mum.${asked}`, order: 0 }); continue; }
      if (it.kind === "rule") { clinic.add(`rule|${norm(x.en)}`, { ...base, en: x.en, status: `Sentence not buildable yet: the doctor's script.${asked}`, sub: "sentences" }); continue; }
      const target = mode === "cook" ? cook : clinic;
      if (it.kind === "lexeme") target.add(`none|${norm(x.en)}`, { ...base, en: x.en, status: `No Kutchi yet (grey English).${asked}`, sub: "words", kind: "none" });
      else {
        const gl2 = [...(bySpelling.get(x.spelling) || [])].slice(0, 2);
        const en = gl2.length ? gl2.join(" / ") : (u.where[0] || "").replace(/^(Cook|Clinic): /, "");
        target.add(`audio|${x.spelling}`, { ...base, en, status: `Kutchi known (${x.spelling}); no family recording.`, sub: "words", kind: "rec" });
      }
    }
    lineCount[mode] = gl[mode].length;
  }
  for (const r of [...cook.list(), ...clinic.list()]) seen.add(`e|${norm(r.en)}`, { en: r.en });

  /* ---- 4 door, 5 ride, 6 book (data/day.json) ---- */
  const door = new Rows(), ride = new Rows(), book = new Rows();
  const days = day.days || [];
  const say = (m, en, where, count, into, extra = {}) => {
    const st = statusOf(E, m, gloss, en);
    return into.add(`${JSON.stringify(m)}`, { en: en.replace(/\s+/g, " "), where: [where], count, status: st.text, skind: st.kind, ...extra });
  };
  say(day.door.yes.meaning, day.door.yes.en, "Door: the child's answer", days.length, door);
  for (const [w, c] of Object.entries(day.weather || {})) {
    const n = days.filter((d) => d.weather === w).length;
    if (c.word) say(c.word.meaning, c.word.en, n ? `Door: the ${w} day, the weather word` : "Evening book: the night sky", n || days.length, n ? door : book);
    if (c.sentence) say(c.sentence.meaning, c.sentence.en, `Door: the ${w} day, in a sentence`, n, door);
  }
  for (const d of days) {
    const act = d.activity === "trip" ? (day.trips || {})[d.trip] : (day.activities || {})[d.activity];
    for (const l of (act && act.lines) || []) say(l.meaning, l.en, `Door: ${d.activity === "trip" ? `trip to the ${d.trip === "shops" ? "market" : d.trip}` : d.activity} day${l.thought ? " (thought bubble)" : ""}`, 1, door);
  }
  const rides = day.window.rides || {};
  const tripDays = days.filter((d) => d.activity === "trip");
  for (const [rid, r] of Object.entries(rides)) {
    const n = tripDays.filter((d) => (day.trips[d.trip] || {}).ride === rid).length || tripDays.length;
    const meaningOf = (t) => (typeof t.say === "string" ? { fn: "Item", kind: t.say } : t.say);
    say(r.headline.meaning, r.headline.en, "Ride: Nani's headline", n, ride);
    const itemGlosses = new Set();
    for (const [, t] of Object.entries(r.things)) {
      const m = meaningOf(t);
      say(m, t.en, `Ride ${rid}: Nani names it${t.scenery ? " (passes as scenery, never called)" : ""}`, n, ride);
      for (const g of E.test.say(m).gaps) if (g.lex) itemGlosses.add(g.lex);
    }
    // Nani's call "Where is the …?": the frame's own words, apart from the thing named
    const probe = Object.values(r.things).find((t) => E.test.check(meaningOf(t)).ok) || Object.values(r.things)[0];
    const callM = { fn: (r.call && r.call.fn) || "Where", [(r.call && r.call.arg) || "thing"]: meaningOf(probe) };
    const frame = E.test.say(callM).gaps.filter((g) => g.lex && !itemGlosses.has(g.lex) && !E.test.say(meaningOf(probe)).gaps.some((x) => x.lex === g.lex));
    const fs = frame.length ? (frame.some((g) => BLOCKING.has(g.kind)) ? "none" : "rec") : "ready";
    ride.add(`frame|${rid}`, { en: String((r.call && r.call.en) || "Where is the {x}?").replace("{x}", "…"), where: [`Ride ${rid}: Nani's call for every thing`], count: n, often: `${n} of ${days.length} days, every call`, status: frame.length ? `${fs === "none" ? "No Kutchi yet" : "The engine can say it; no family recording"} of: ${[...new Set(frame.map((g) => gloss.get(g.lex) || g.lex))].join(", ")}` : "Ready" });
    for (const [k, l] of Object.entries(r.speedLines || {})) if (!k.startsWith("_")) say(l.meaning, l.en, `Ride: Nani to the driver (${k === "up" ? "faster" : "slower"})`, n, ride);
  }
  say(day.book.goodnight.meaning, day.book.goodnight.en, "Evening book: Nani at the end", days.length, book);
  say(day.book.tomorrow.meaning, day.book.tomorrow.en, "Evening book: the tomorrow's-sky doorway", days.length, book);
  if (day.book.tomorrowWord) say({ fn: "Item", kind: day.book.tomorrowWord }, gloss.get(day.book.tomorrowWord) || prettyId(day.book.tomorrowWord), "Evening book: the word for tomorrow", days.length, book);
  for (const r of [...door.list(), ...ride.list(), ...book.list()]) seen.add(`e|${norm(r.en)}`, { en: r.en });
  for (const r of [...door.list(), ...ride.list(), ...book.list()]) if (r.often == null) r.often = `${Math.min(r.count, days.length)} of ${days.length} days`;
  // a story row with nothing to ask is not listed
  const pending = (rows) => rows.list().filter((r) => r.status !== "Ready" && r.skind !== "ready").sort(byCount);
  const readyN = (rows) => rows.list().length - pending(rows).length;

  // the ride's candidate words with no family recording (English only)
  const candidate = RIDE_CANDIDATES.map((c) => {
    const e = lex.find((x) => x.id === `n.${c}` || x.id === `n.the-${c}` || (x.aliases || []).includes(c) || norm(x.gloss).replace(/^(a|the) /, "") === c);
    if (!e) return { c, has: false, why: "not in the engine" };
    const w = E.test.word(e.id);
    return { c, has: w.ok && !w.gaps.some((g) => g.kind === "audio"), why: w.ok ? "Kutchi known, no recording" : "no Kutchi yet" };
  });
  const needRec = candidate.filter((x) => !x.has).map((x) => x.c), haveRec = candidate.filter((x) => x.has).map((x) => x.c);

  /* ---- 7 other modes: the engine's to-record entries not used by Cook, the clinic or the story frame ---- */
  const MODES = ["dress", "who", "relations", "monsoon", "snap", "tidy", "find"];
  const other = new Rows();
  for (const e of lex) {
    if (e.status !== "to-record") continue;
    const src = (e.src || []).join(" | ");
    if (/data\/clinic|data\/cook|stations\//.test(src)) continue;
    const modes = MODES.filter((m) => new RegExp(`data/${m}\\.json`).test(src));
    const where = modes.length ? modes.map((m) => `${m} (parked)`) : /conversations|first-launch|story/.test(src) ? ["conversations / story"] : /content\.json/.test(src) ? ["class handout"] : ["asked in Mum's rounds (grammar-notes), not used by a game yet"];
    const en = e.gloss || prettyId(e.id);
    if (seen.map.has(`e|${norm(en)}`)) continue;
    other.add(`o|${norm(en)}|${where[0]}`, { en, where, count: 0, often: "—", status: "No Kutchi yet", order: MODES.indexOf(modes[0]) });
  }

  /* ---- assemble ---- */
  const L = [];
  const push = (...x) => L.push(...x);
  const nGender = (m) => genders[m].reduce((s, g) => s + g.count, 0);
  push("# Recording sheet: everything still to record, in one place", "",
    "Built by `node build/tools/ops/recordings.mjs` (do not edit by hand; `--check` says when it is out of date). English meanings and gaps only: this sheet never holds Kutchi we have not been given. Zafar, 20 Oct: **lock the grammar first, then the vocabulary slots in.** So Mum's next sitting starts at section 1; each later section is a table to work down, most-used first.", "",
    "**Status words:** *No Kutchi yet* = the game shows the English in grey italic (to record). *Kutchi known, no recording* = the engine has the word, but no family voice says it yet. *Recorded, waiting for OK* = a take exists, not yet ticked in `lab/family-audio.html` (only OK takes ship). **How often** is the number of game lines that need it (Cook and clinic), or the days of the five-day frame that say it (story mode).", "");

  // 1 grammar
  const gRows = grammar.list().sort((x, y) => (x.order - y.order) || byCount(x, y));
  const gProse = [];
  for (const m of ["cook", "clinic"]) if (genders[m].length) gProse.push({ en: `He-word or she-word? ${plural(genders[m].length, "noun")} in ${m === "cook" ? "Cook" : "the clinic"}: ${genders[m].map((g) => g.en).join(", ")}`, where: [`${m === "cook" ? "Cook" : "Clinic"}: every line that names them`], count: nGender(m), status: "Gender not known; until asked the game uses the he-form (Mum's rule) and flags it" });
  push("## 1. Grammar first", "",
    `The open questions that unlock many lines at once. ${plural(gRows.length + gProse.length, "row")} that block lines now, then the wider grammar (from \`docs/language/grammar-kb.md\`) and the questions already written down for the next sitting.`, "",
    "### 1a. Blocking lines today", "", ...table([...gRows, ...gProse]), "");
  push("### 1b. Wider grammar still open", "", "| Feature | Status | Priority | Settled by |", "|---|---|---|---|");
  for (const k of kb) push(`| ${cell(k.feature)} | ${cell(k.status)} | ${cell(k.priority)} | ${cell(k.settled)} |`);
  push("", "### 1c. Already written down for the next sitting (`docs/language/mum-questions/README.md`)", "");
  for (const q of open) push(`- ${q}`);
  push("");

  // 2 cook
  const cookRows = cook.list().sort(byCount);
  push("## 2. Cook", "", `${plural(cookRows.length, "row")}: ${cookRows.filter((r) => r.kind === "none").length} with no Kutchi yet, ${cookRows.filter((r) => r.kind === "rec").length} with Kutchi but no recording. Cook's sentence gaps and genders are in section 1.`, "", ...table(cookRows), "");

  // 3 clinic
  const cl = clinic.list();
  const clSent = cl.filter((r) => r.sub === "sentences").sort(byCount), clWords = cl.filter((r) => r.sub === "words").sort(byCount);
  const dRows = doc.rows.filter((r) => r.sec !== "C");
  const dTable = dRows.map((r) => ({ en: `**${r.id}** ${r.en}`, whereText: r.where || r.sub, often: oftenOf(r), status: r.guide ? `To record (some words known: ${r.guide.replace(/\*/g, "")})` : "To record" }));
  const dC = doc.rows.filter((r) => r.sec === "C").length;
  push("## 3. Clinic", "",
    `The doctor says these himself (Zafar as the doctor; Mum helps with the words). ${plural(dRows.length, "line")} in \`docs/language/doctor-recording-list.md\` (sections A, B and E; ${dC} word groups in section C are the word rows below; section D's ${doc.dCount} questions are for the doctor), then the engine's own gaps.`, "",
    "### 3a. The doctor's lines (A: every visit, B: the heal games, E: the old man)", "", ...table(dTable, { often: "How often" }), "",
    `### 3b. Sentences the engine cannot say yet (${clSent.length})`, "", ...table(clSent), "",
    `### 3c. Words (${clWords.length}): ${clWords.filter((r) => r.kind === "none").length} with no Kutchi yet, ${clWords.filter((r) => r.kind === "rec").length} with Kutchi but no recording`, "", ...table(clWords), "");

  // 4-6 story
  const pd = pending(door), pr = pending(ride), pb = pending(book);
  const storyHead = (name, rows, ready, extra = "") => `${plural(rows.length, "row")} to record${ready ? `; ${ready} more already ready` : ""}. ${extra}`.trim();
  push("## 4. Story mode: the door", "", storyHead("door", pd, readyN(door), "Nani's weather word, the weather sentence and the day's lines, in turn; the English under them is the one written English for the child (rule 5)."), "", ...table(pd.sort((x, y) => (y.count - x.count) || String(x.en).localeCompare(String(y.en)))), "");
  push("## 5. Story mode: the ride", "", storyHead("ride", pr, readyN(ride), "Nani names a thing and asks \"Where is the …?\" as it passes the window."), "", ...table(pr), "");
  const inEngine = candidate.filter((x) => x.why !== "not in the engine" && !x.has).map((x) => x.c);
  push(`**The ride's candidate words with no family recording yet (English only; ${needRec.length} of ${RIDE_CANDIDATES.length}):** ${needRec.join(", ")}.${haveRec.length ? ` Already recorded, so not listed: ${haveRec.join(", ")}.` : ""} These are things the ride could name next, not in it yet.${inEngine.length ? ` ${inEngine.join(", ")} already have an engine entry with no Kutchi; the rest are not in the engine, so they need Mum's word first.` : ""}`, "");
  push("## 6. Story mode: the evening book", "", storyHead("book", pb, readyN(book), "The words the book shows are the day's Cook and clinic words (sections 2 and 3); these are the book's own lines."), "", ...table(pb), "");

  // 7 other
  const oRows = other.list().sort((x, y) => (x.order - y.order) || String(x.en).localeCompare(String(y.en)));
  push("## 7. Other modes", "", `${plural(oRows.length, "row")}: words and lines of the parked modes (dress, who, relations, monsoon, snap, tidy, find), the conversations, and words asked in earlier rounds that no game uses yet. They wait until those modes return; none blocks story mode.`, "", ...table(oRows), "");

  push("---", "", `*Sources: \`data/lang/reports/gap-list.md\` (${gl.cook.length} Cook and ${gl.clinic.length} clinic gaps; rebuild with \`node build/lang/import_all.mjs\`), \`data/lang/*.json\`, \`data/day.json\`, \`data/family-audio.json\`, \`docs/language/doctor-recording-list.md\`, \`docs/language/grammar-kb.md\`, \`docs/language/mum-questions/README.md\`. ${gl.awaiting} recorded words wait for Zafar's OK. Words with a draft Kutchi (spoken, flagged) are not listed; \`build/reports/lines-needing-family.md\` is the retired shopping game's list and is not a source.*`, "");
  counts.grammar = gRows.length + gProse.length; counts.grammarKb = kb.length; counts.cook = cookRows.length; counts.clinic = dTable.length + clSent.length + clWords.length;
  counts.door = pd.length; counts.ride = pr.length; counts.book = pb.length; counts.other = oRows.length;
  return { text: L.join("\n"), counts };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { text, counts } = buildSheet();
  const out = a.val("out") && a.val("out") !== true ? a.val("out") : SHEET;
  const sum = `grammar ${counts.grammar} (+${counts.grammarKb} wider), cook ${counts.cook}, clinic ${counts.clinic}, door ${counts.door}, ride ${counts.ride}, book ${counts.book}, other ${counts.other}`;
  if (a.has("stdout")) { process.stdout.write(text); process.exit(0); }
  if (a.has("check")) {
    const now = rd(out);
    if (now !== text) die(`${out} is out of date: run node build/tools/ops/recordings.mjs (${sum})`, 1);
    console.log(`recording sheet is current (${sum})`);
  } else {
    writeFileSync(join(ROOT, out), text);
    console.log(`Wrote ${out}: ${sum}`);
  }
}
