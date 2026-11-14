#!/usr/bin/env node
// The engine's needs -> rows of the one recording sheet (Zafar, 14 Nov). This tool never writes a sheet of its own: it adds what the
// language engine still needs to data/lang/recording-sheet.json (a new row only where no row has the need's key or the same English),
// moves rows on (recorded once a clip with the row's id or Kutchi exists; closed or answered once the engine no longer needs them),
// then regenerates docs/language/recording-sheet.docx and .md (build/tools/lang/recording-sheet.mjs). Rows are never deleted.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createEngine, DATA_FILES } from "../../../js/core/lang/engine/index.js";
import { ROOT, args, help, die } from "./lib.mjs";
import { loadSheet, saveSheet, addRow, validate, stale, writeOutputs, summary, norm, OPEN, SOURCE } from "../lang/recording-sheet.mjs";

const HELP = `
node build/tools/ops/recordings.mjs [--check] [--dry] [--date YYYY-MM-DD]
  Reads what the language engine still needs and adds it to ${SOURCE}, the one recording sheet (grammar first, then each game),
  then regenerates docs/language/recording-sheet.docx and .md from it. Each need has a key; a need already on the sheet (by key,
  or by the same English) is never added twice, and no row is ever deleted or renumbered.
  Needs: data/lang/reports/gap-list.md (Cook and clinic: sentences, words with no Kutchi, genders, missing forms, words with no
  recording; rebuild with node build/lang/import_all.mjs), the lexicon's unknown and draft forms and its open questions (grammar),
  data/day.json (the door, the ride, the evening book) and the parked modes' to-record words.
  Moves rows on: an open row is "recorded" once data/family-audio.json has a clip whose question id is the row's id (Mum says the
  id before each line), or, for a known word, a clip of that Kutchi; a need the engine no longer lists is closed (a gap) or
  answered (a grammar slot). Hand-set statuses (answered, recorded, confirmed, to confirm) are never moved back.
  --check  write nothing; exit 1 if a need is missing from the sheet or the two files are out of date (checks.mjs "recordings")
  --dry    print what would change; write nothing.   --date  the date stamped on changed rows (default today). No network.`;

const rd = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");
const J = (p) => JSON.parse(rd(p));

/* ---------------- the gap list (the engine's generated report) ---------------- */
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
  if (it.kind === "rule") return { en: quotes.join(" ") || text, ask, note };
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
// "A; B; C … (39 lines)" -> { where: [short labels, deduped], count, ids: [the ids in brackets] }
export function usedBy(needed) {
  const m = / … \((\d+) lines\)$/.exec(needed);
  const labels = (m ? needed.slice(0, m.index) : needed).split("; ").filter(Boolean);
  const where = [...new Set(labels.map(shortLabel))];
  const ids = [...new Set(labels.map((l) => (/\(([a-z][\w.-]*)\)/.exec(l) || [])[1]).filter(Boolean))];
  return { where, count: m ? +m[1] : labels.length, ids };
}
const whereText = (u) => `${u.where.slice(0, 3).join("; ")}${u.where.length > 3 ? ` (+${u.where.length - 3} more)` : ""}${u.count > 1 ? ` (${u.count} lines)` : ""}`;

/* ---------------- which game a Cook need belongs to ---------------- */
const GAME_FILES = {
  "CK-CHAI": ["data/stations/chai-tray.json", "js/cook/stations/chai-tray.js", "js/cook/mechanics/pour.js", "js/cook/mechanics/boil.js", "js/cook/mechanics/count.js"],
  "CK-EGGS": ["data/stations/eggs.json", "js/cook/stations/eggs.js"],
  "CK-BAKE": ["data/stations/baking.json", "js/cook/stations/baking.js"],
  "CK-CORN": ["data/stations/corn.json", "js/cook/stations/corn.js"],
  "CK-PANTRY": ["js/cook/mechanics/fetch.js", "js/cook/mechanics/passme.js"],
  "CK-CHOP": ["data/stations/chop.json", "js/cook/stations/chop.js", "js/cook/mechanics/chop.js"],
  "CK-CHAAT": ["data/stations/chaat.json", "js/cook/mechanics/assemble.js"],
  "CK-DAAR": ["data/stations/daar.json", "js/cook/stations/daar.js", "js/cook/mechanics/tadka.js", "js/cook/mechanics/stir.js", "data/stations/stir.json"],
  "CK-SAMOSA": ["data/stations/samosa.json", "js/cook/stations/samosa.js", "js/cook/mechanics/fill-fold.js", "js/cook/mechanics/fry.js"],
  "CK-MAANI": ["data/stations/maani-line.json", "js/cook/stations/maani-line.js", "data/stations/roll-tawa.json", "js/cook/stations/roll-tawa.js", "js/cook/mechanics/knead.js", "js/cook/mechanics/roll.js", "js/cook/mechanics/tawa.js"],
  "CK-SEKELO": ["data/stations/mishkaki-grill.json", "js/cook/stations/mishkaki-grill.js", "js/cook/mechanics/thread.js", "js/cook/mechanics/grill.js"],
};
const RECIPE = { chai: "CK-CHAI", eggs: "CK-EGGS", baking: "CK-BAKE", corn: "CK-CORN", pantry: "CK-PANTRY", chaat: "CK-CHAAT", daal: "CK-DAAR", samosa: "CK-SAMOSA", maani: "CK-MAANI", mishkaki: "CK-SEKELO" };
const STATION = { fetch: "CK-PANTRY", passme: "CK-PANTRY", pour: "CK-CHAI", add: "CK-CHAI", watch: "CK-CHAI", count: "CK-CHAI", "chai-tray": "CK-CHAI", knead: "CK-MAANI", roll: "CK-MAANI", flip: "CK-MAANI", "maani-line": "CK-MAANI", "roll-tawa": "CK-MAANI", chop: "CK-CHOP", tadka: "CK-DAAR", stir: "CK-DAAR", daar: "CK-DAAR", assemble: "CK-CHAAT", fill: "CK-SAMOSA", fold: "CK-SAMOSA", fry: "CK-SAMOSA", samosa: "CK-SAMOSA", thread: "CK-SEKELO", grill: "CK-SEKELO", "mishkaki-grill": "CK-SEKELO" };
export const KEYWORDS = [["CK-EGGS", /\beggs?\b|turner|boiled|fried egg/i], ["CK-BAKE", /\bnaan|flour|bak(e|ing)|cups?\b|pinch|knead|oven|dough\b/i], ["CK-CORN", /\bcorn|cob\b|makai|lemon/i], ["CK-PANTRY", /pantry|bring (me )?these|pass me|shelf|basket/i], ["CK-CHOP", /\bchop|board|knife/i], ["CK-CHAAT", /chaat|bowl|\bsev\b|chutney|tamarind|yoghurt/i], ["CK-DAAR", /\bdaa?[lr]\b|spices|tadka|\bstir|turmeric|cumin|mustard/i], ["CK-SAMOSA", /samosa|\bfold|\bfill|\bfry\b|mince|chips/i], ["CK-MAANI", /maani|chapati|\broll|tawa|millet|dough ball/i], ["CK-SEKELO", /skewer|grill|sekelo|mishkaki|thread/i], ["CK-CHAI", /\bchai|\btea\b|\bmilk|sugar|glass|pour|cardamom|ginger|spoons?\b|\bpan\b/i]];
let gameIndex = null;
export function cookGame(ids, text) {
  if (!gameIndex) {
    gameIndex = Object.fromEntries(Object.entries(GAME_FILES).map(([g, fs]) => [g, fs.map(rd).join("\n")]));
    const cook = J("data/cook.json");
    for (const [r, g] of Object.entries(RECIPE)) gameIndex[g] += "\n" + JSON.stringify((cook.recipes || {})[r] || {});
  }
  // the game of each line or word that needs it; a need of more than one game belongs to every kitchen game
  const games = new Set();
  for (const id of ids) {
    const m = /^cook\.(?:guide|line)\.(.+)$/.exec(id);
    if (m && STATION[m[1]]) { games.add(STATION[m[1]]); continue; }
    const tok = (m ? m[1] : id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const g = Object.keys(GAME_FILES).find((k) => new RegExp(`["'\`]${tok}["'\`]`).test(gameIndex[k]));
    if (g) games.add(g);
  }
  if (games.size === 1) return [...games][0];
  if (games.size > 1) return "CK-ALL";
  return (KEYWORDS.find(([, re]) => re.test(text)) || ["CK-ALL"])[0];
}
const clinicSection = (ids, text) => (ids.some((i) => /pipeline|ailment|heal|scrape|knee|ear|tooth|drink|fever|jab|eye|foot|feet|plaster|bandage/.test(i)) || /scrape|bandage|plaster|drops|thermometer|syringe|cream|tooth|brush/i.test(text) ? "CL-HEAL" : "CL-VISIT");

// is a spelling Mum's, and is it settled? (the Kutchi column holds only the family's words, never a guess)
const MUMS = /grammar-notes|\bMum\b|mum-20\d\d/, NOT_MUMS = /handout|content\.json|Claude|guess/i;
function heard(es, w) {
  for (const e of es) {
    const cell = e.lemma === w ? "" : (Object.entries(e.forms || {}).find(([, f]) => ((f && f.t) || f) === w) || [])[0] || "";
    const f = cell ? e.forms[cell] : null;
    const src = [].concat(e.src || [], (f && f.src) || []).join(" | ");
    const mum = MUMS.test(src) && !(NOT_MUMS.test(src) && !/grammar-notes/.test(src));
    const sure = e.status === "confirmed" && (!f || typeof f === "string" || !f.status || f.status === "confirmed");
    if (mum) return { mum, sure, cell };
  }
  return { mum: false, sure: false, cell: "" };
}

/* ---------------- the engine ---------------- */
function engines() {
  const data = {};
  for (const f of DATA_FILES) data[f] = J(`data/lang/${f}.json`);
  const audio = J("data/family-audio.json");
  const mk = (path) => createEngine({ data, audio, path, phrases: false });
  return { data, test: mk("test"), store: mk("store") };
}
const BLOCKING = new Set(["lexeme", "form", "rule"]);
export const RIDE_CANDIDATES = ["cow", "tree", "flower", "bus", "bicycle", "tractor", "camel", "horse", "sheep", "buffalo", "boat", "sun", "moon", "star", "cloud", "road", "field", "shop"];
const POLITE = (gloss) => `"${gloss.split(/[,(;]/)[0].trim().replace(/^./, (c) => c.toUpperCase())}, please." Said politely to an elder (the "please" form of the verb).`;
// open questions written for the team, not for Mum (the clash list's bookkeeping, a settled spelling, a pointer to the grammar rows)
const SKIP_OPEN = /Sources disagree|needs new art|Mum answered|answered\.|Round 5 Q12 answered|not linked|Claude's check|^Whisper wrote|Zafar confirmed the spelling|kb feature|^The class handout|^data\/cook\.json shows/;
// a grammar cell in plain words ("pres.she.sg" -> "now or every day, a she-word, one")
const WORDS = { pres: "now or every day", fut: "will", past: "did", imp: "telling someone", conj: "joined to a helper verb", dat: "to (someone)", obl: "before in, with or on", poss: "whose", sg: "one", pl: "more than one", he: "a he-word", she: "a she-word", p1: "I", p2: "you", p2resp: "you (an elder)", p3: "he or she", polite: "said politely", informal: "everyday" };
export const plainCell = (cell) => cell.split(".").map((t) => WORDS[t] || "").filter(Boolean).join(", ") || "its own form";
const OPEN_SECTION = (id) => (/^a\./.test(id) ? "G-ADJ" : /^v\./.test(id) ? "G-VERB" : /^pron\./.test(id) ? "G-POS" : /^post\./.test(id) ? "G-PLACE" : /^q\./.test(id) ? "G-Q" : /^num\./.test(id) ? "G-NUM" : /^neg\./.test(id) ? "G-NEG" : /^adv\./.test(id) ? "G-JOIN" : "G-CHK");
const PARA_EN = { "noun.o-he|sg.obl": "A he-word ending in -o, before in, with or on: the boy, with the boy; the mango, on the mango", "noun.o-he|pl.obl": "More than one he-word ending in -o, before in, with or on: the boys, with the boys; the mangoes, on the mangoes", "adj.o|he.pl.obl": "A describing word with more than one he-word, before in, with or on: with the big boys; in the big cups" };

// every need the engine has today, each with a key: [{ key, section, en, for, status, kutchi, who, note, source }]
export function needs() {
  const out = [];
  const add = (n) => out.push(n);
  const E = engines(), lex = E.data.lexicon.entries;
  const gloss = new Map(lex.map((e) => [e.id, e.gloss || e.id]));
  const bySpelling = new Map();
  for (const e of lex) for (const s of [e.lemma, ...Object.values(e.forms || {}).map((f) => (f && f.t) || f)]) if (typeof s === "string" && s) (bySpelling.get(s) || bySpelling.set(s, []).get(s)).push(e);
  // 1. Cook and the clinic (the gap list)
  const gl = parseGapList(rd("data/lang/reports/gap-list.md"));
  for (const mode of ["cook", "clinic"]) for (const it of gl[mode]) {
    const x = interpretGap(it), u = usedBy(it.needed), asked = x.ask.length ? `asked before: ${x.ask.join(", ")}` : "";
    const src = `engine gap list (${mode === "cook" ? "Cook" : "clinic"})`;
    const where = whereText(u);
    if (it.kind === "feature") { add({ key: `gap:${mode}:feature:${u.ids[0] || norm(x.en)}`, section: "G-NOUN", en: `${x.en}: a he-word or a she-word? Say "one ${x.en}" and "two".`, for: where, status: "to record", note: asked, source: src }); continue; }
    if (it.kind === "form") { add({ key: `gap:${mode}:form:${u.ids[0] || norm(x.en)}`, section: "G-NOUN", en: x.en, for: where, status: "to record", note: asked, source: src }); continue; }
    if (it.kind === "audio") {
      const es = bySpelling.get(x.spelling) || [], h = heard(es, x.spelling);
      const en = [...new Set(es.map((e) => e.gloss || e.id))].slice(0, 2).join(" / ") || (u.where[0] || "").replace(/^(Cook|Clinic)( line)?: /, "");
      const section = mode === "clinic" ? "CL-WORDS" : u.count >= 4 ? "CK-ALL" : cookGame(u.ids, `${en} ${where}`);
      add({ key: `gap:${mode}:audio:${x.spelling}`, section, en: `${en}${h.cell && h.cell !== "-" ? ` (${plainCell(h.cell)})` : ""} (say ${/\s/.test(x.spelling) ? "it" : "the word"} alone, three times)`, for: where, status: h.sure ? "to record" : "to confirm", kutchi: h.mum ? x.spelling : "", who: h.mum ? (h.sure ? "Mum" : "Mum (spelling to confirm)") : "", note: h.sure ? "" : h.mum ? "a draft spelling of Mum's word: Mum to say it again" : "the engine's spelling is not Mum's (a handout or a guess): Mum to say the word", source: src });
      continue;
    }
    const key = `gap:${mode}:${it.kind}:${u.ids[0] || norm(x.en)}`;
    let section;
    if (mode === "clinic") section = it.kind === "lexeme" && !/^clinic\.line/.test(u.ids[0] || "") ? "CL-WORDS" : clinicSection(u.ids, x.en);
    else if (it.kind === "rule") section = /\btimes\b|once|twice/.test(x.en) ? "G-NUM" : /in my/i.test(x.en) ? "G-POS" : /bring me these/i.test(x.en) ? "CK-PANTRY" : "G-JOIN";
    else section = cookGame(u.ids, `${x.en} ${where}`);
    add({ key, section, en: x.en, for: where, status: "to record", note: [x.note, asked].filter(Boolean).join("; "), source: src });
  }
  // 2. grammar slots the engine has no answer for (unknown cells), or only a draft of
  for (const e of lex) {
    for (const [cell, f] of Object.entries(e.forms || {})) {
      if (!f || typeof f !== "object" || !f.status || f.status === "confirmed" || cell === "pl.*") continue;
      const key = `slot:${e.id}:${cell}`, g = e.gloss || e.id;
      const section = cell === "imp.polite" ? "G-POL" : e.pos === "V" ? (/^(pres|fut|past)/.test(cell) ? "G-TENSE" : "G-VERB") : /^(pron|gen)\./.test(e.id) ? "G-POS" : "G-NOUN";
      if (f.status === "unknown") add({ key, section, en: cell === "imp.polite" ? POLITE(g) : `"${g}" (${plainCell(cell)}): say it in a short sentence`, for: `the engine's ${e.id} (${cell})`, status: "to record", source: "the engine's lexicon (no answer yet)" });
      else add({ key, section, en: `"${g}" (${plainCell(cell)}): say it in a short sentence, so we hear it again`, for: `the engine's ${e.id} (${cell})${f.src ? `; ${f.src}` : ""}`, status: "to confirm", kutchi: MUMS.test(f.src || "") ? f.t : "", who: MUMS.test(f.src || "") ? "Mum (heard once, flagged)" : "", note: "heard once, flagged: Mum to say it again", source: "the engine's lexicon (a draft)" });
    }
    (e.open || []).forEach((o, i) => {
      if (!o || !o.q || SKIP_OPEN.test(o.q)) return;
      const g = (e.gloss || e.id).split(/[,(]/)[0].trim();
      add({ key: `open:${e.id}:${i}`, section: OPEN_SECTION(e.id), en: norm(o.q).includes(norm(g)) ? o.q : `${g}: ${o.q}`, for: `the engine's ${e.id}${o.ask ? ` (asked before: ${[].concat(o.ask).join(", ")})` : ""}`, status: "to record", source: `the engine's open questions (${o.src || "lexicon"})` });
    });
  }
  for (const [pid, p] of Object.entries(E.data.paradigms.paradigms || {})) for (const [cell, c] of Object.entries(p.cells || {})) {
    if (c.status === "confirmed") continue;
    add({ key: `para:${pid}:${cell}`, section: /^adj/.test(pid) ? "G-ADJ" : "G-NOUN", en: `${PARA_EN[`${pid}|${cell}`] || `The ${pid} pattern (${plainCell(cell)})`}: ${c.status === "unknown" ? "not said yet" : "heard, to confirm"}`, for: `every ${p.pos === "A" ? "describing word" : "noun"} of this pattern${c.src ? ` (${c.src})` : ""}`, status: c.status === "unknown" ? "to record" : "to confirm", source: "the engine's paradigms" });
  }
  // 3. the day: the door, the ride, the evening book (data/day.json)
  const day = J("data/day.json"), days = day.days || [];
  const say = (m, en, where, section, n) => {
    const t = E.test.say(m), block = t.gaps.filter((g) => BLOCKING.has(g.kind)), rec = t.gaps.filter((g) => g.kind === "audio");
    if (!block.length && !rec.length) return;
    const miss = [...new Set((block.length ? block : rec).map((g) => (g.lex && gloss.get(g.lex)) || null).filter((y) => y && norm(y) !== norm(en)))];
    add({ key: `day:${section}:${norm(en)}`, section, en: en.replace(/\s+/g, " "), for: `${where}${n ? `, ${n} of ${days.length} days` : ""}`, status: "to record", note: block.length ? (miss.length ? `no Kutchi yet for: ${miss.join(", ")}` : "") : `the engine can say it; no family recording${miss.length ? ` of: ${miss.join(", ")}` : ""}`, source: "data/day.json" });
  };
  if (day.door) say(day.door.yes.meaning, day.door.yes.en, "The door: the child's answer", "DAY-DOOR", days.length);
  for (const [w, c] of Object.entries(day.weather || {})) {
    const n = days.filter((d) => d.weather === w).length;
    if (c.word) say(c.word.meaning, c.word.en, n ? `The door: the ${w} day, the weather word` : "The evening book: the night sky", n ? "DAY-DOOR" : "DAY-BOOK", n || days.length);
    if (c.sentence) say(c.sentence.meaning, c.sentence.en, `The door: the ${w} day, in a sentence`, "DAY-DOOR", n);
  }
  for (const d of days) {
    const act = d.activity === "trip" ? (day.trips || {})[d.trip] : (day.activities || {})[d.activity];
    for (const l of (act && act.lines) || []) say(l.meaning, l.en, `The door: ${d.activity === "trip" ? `the trip to the ${d.trip === "shops" ? "market" : d.trip}` : d.activity} day${l.thought ? " (thought bubble)" : ""}`, "DAY-DOOR", 0);
  }
  for (const [rid, r] of Object.entries((day.window && day.window.rides) || {})) {
    const meaningOf = (t) => (typeof t.say === "string" ? { fn: "Item", kind: t.say } : t.say);
    say(r.headline.meaning, r.headline.en, "The ride: Nani's headline", "DAY-RIDE", 0);
    for (const t of Object.values(r.things)) say(meaningOf(t), t.en, `The ride (${rid}): Nani names it${t.scenery ? " (scenery, never called)" : ""}`, "DAY-RIDE", 0);
    for (const [k, l] of Object.entries(r.speedLines || {})) if (!k.startsWith("_")) say(l.meaning, l.en, `The ride: Nani to the driver (${k === "up" ? "faster" : "slower"})`, "DAY-RIDE", 0);
  }
  if (day.book) {
    say(day.book.goodnight.meaning, day.book.goodnight.en, "The evening book: Nani at the end", "DAY-BOOK", days.length);
    say(day.book.tomorrow.meaning, day.book.tomorrow.en, "The evening book: the tomorrow's-sky doorway", "DAY-BOOK", days.length);
  }
  for (const c of RIDE_CANDIDATES) {
    const e = lex.find((y) => y.id === `n.${c}` || y.id === `n.the-${c}` || (y.aliases || []).includes(c) || norm(y.gloss).replace(/^(a|the) /, "") === c);
    const w = e && E.test.word(e.id);
    if (w && w.ok && !w.gaps.some((g) => g.kind === "audio")) continue;
    add({ key: `ride-candidate:${c}`, section: "DAY-RIDE", en: c, for: "a thing the ride could name next (not in it yet)", status: "to record", note: !e ? "not in the engine: Mum's word first" : w && w.ok ? "Kutchi known, no recording" : "no Kutchi yet", source: "the ride's candidate words" });
  }
  // 4. the parked modes' and the conversations' words (the lexicon's to-record entries no game above uses)
  const PARK = [["PK-PEOPLE", /data\/(dress|who|relations)\.json/], ["PK-HOUSE", /data\/(tidy|find)\.json/], ["PK-MONSOON", /data\/monsoon\.json/], ["STORY", /conversations|first-launch|story/]];
  for (const e of lex) {
    if (e.status !== "to-record") continue;
    const src = (e.src || []).join(" | ");
    if (/data\/clinic|data\/cook|stations\//.test(src)) continue;
    const section = (PARK.find(([, re]) => re.test(src)) || ["PK-MORE"])[0];
    add({ key: `lex:${e.id}`, section, en: e.gloss || prettyId(e.id), for: section === "PK-MORE" ? (/content\.json/.test(src) ? "the class handout's words" : "asked in an earlier round; no game uses it yet") : "a parked game's word (waits until it returns)", status: "to record", source: "the engine's to-record words" });
  }
  return out;
}

/* ---------------- moving the sheet on ---------------- */
const playable = (c) => c.file && c.checked !== "redo" && c.kutchi;
const srcDate = (c) => (/(\d{4}-\d\d-\d\d)/.exec(c.source || "") || [])[1] || "";
const byMum = (cs) => cs.find((c) => c.speaker === "mum") || cs[0];
export const OWN_KEY = /^(gap|slot|para|open|day|ride-candidate|lex):/;
export function sync(sheet, list, clips, date) {
  const now = new Map(list.map((n) => [n.key, n]));
  const log = { added: [], recorded: [], closed: [], reopened: [] };
  for (const n of list) {
    const { row, added } = addRow(sheet, { section: n.section, en: n.en, for: n.for, status: n.status, kutchi: n.kutchi, who: n.who, note: n.note, source: n.source, keys: [n.key] });
    if (added) log.added.push(row.id);
    else if (row.status === "closed") { row.status = n.status; delete row.date; delete row.note; log.reopened.push(row.id); }
  }
  const byQid = new Map(), byKutchi = new Map();
  for (const c of clips.filter(playable)) {
    (byQid.get(c.qid) || byQid.set(c.qid, []).get(c.qid)).push(c);
    const k = norm(c.kutchi);
    (byKutchi.get(k) || byKutchi.set(k, []).get(k)).push(c);
  }
  for (const r of sheet.rows) {
    if (!OPEN.has(r.status)) continue;
    // only this tool's own keys move a row on (another tool's, such as the clash list's, are left to that tool)
    const keys = (r.keys || []).filter((k) => OWN_KEY.test(k));
    const still = keys.some((k) => now.has(k)) || keys.length < (r.keys || []).length;
    const cs = byQid.get(r.id) || (r.kutchi && !still ? byKutchi.get(norm(r.kutchi)) : null);
    if (cs && cs.length) {
      const c = byMum(cs);
      Object.assign(r, { status: "recorded", date: srcDate(c) || date, clip: [...new Set(cs.map((y) => y.id))].slice(0, 4), kutchi: r.kutchi || c.kutchi, who: r.who || (c.speaker === "mum" ? "Mum" : `${c.speaker}'s take`) });
      log.recorded.push(r.id);
    } else if (keys.length && !still) {
      const slot = keys.every((k) => /^(slot|para|open):/.test(k));
      Object.assign(r, { status: slot ? "answered" : "closed", date, note: slot ? "the engine now has it" : "the engine no longer lists it (answered, recorded, or no longer in the game)" });
      log.closed.push(r.id);
    }
  }
  return log;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = args(); help(HELP, a);
  const date = a.val("date") || new Date().toISOString().slice(0, 10);
  const sheet = loadSheet();
  const before = JSON.stringify(sheet);
  const log = sync(sheet, needs(), J("data/family-audio.json"), date);
  const changed = JSON.stringify(sheet) !== before;
  const say = `${log.added.length} added, ${log.recorded.length} recorded, ${log.closed.length} closed or answered, ${log.reopened.length} reopened`;
  if (a.has("check")) {
    const errs = validate(loadSheet());
    if (errs.length) die(`${SOURCE}: ${errs.slice(0, 10).join("; ")}`, 1);
    if (log.added.length) die(`${SOURCE} is missing ${log.added.length} need(s) of the engine (${log.added.slice(0, 6).join(", ")}${log.added.length > 6 ? " …" : ""}): run node build/tools/ops/recordings.mjs`, 1);
    const st = stale(loadSheet());
    if (st.length) die(`${st.join(" and ")} out of date with ${SOURCE}: run node build/tools/lang/recording-sheet.mjs`, 1);
    console.log(`recording sheet is current: ${summary(loadSheet())}${changed ? `; a sync would move rows on (${say})` : ""}`);
    process.exit(0);
  }
  if (a.has("dry")) { console.log(`Dry run: ${say}.${log.added.length ? ` New: ${log.added.join(", ")}` : ""}`); process.exit(0); }
  if (changed) sheet.updated = date;
  const errs = validate(sheet);
  if (errs.length) die(`${SOURCE}: ${errs.slice(0, 10).join("; ")}`, 1);
  saveSheet(sheet);
  writeOutputs(sheet);
  console.log(`${SOURCE}: ${say}. Wrote docs/language/recording-sheet.docx and .md: ${summary(sheet)}`);
}
