// Layer 10: the reports (written to data/lang/reports/): the gap list (the minimum 4c, decision 38 c: what Cook and the
// clinic say today that the engine cannot say yet, or that has no family recording, as a plain list grouped for Mum),
// the clash list (every place two sources disagree, for Zafar and Mum), and the coverage numbers. No frequency
// analysis and no simulator (decision 38 c): each gap lists the lines that need it, in the game's own order.
import { readJSON, writeText, norm } from "./lib.mjs";
import { gapReport } from "../../js/core/lang/engine/gaps.js";
import { createEngine } from "../../js/core/lang/engine/index.js";
import { REASONS, PAIRS } from "./hand/contradictions.mjs";
import { DECISION_CLASHES } from "./hand/clash-notes.mjs";
import { NOT_LOADED } from "./hand/not-kutchi.mjs";
import { readText } from "./lib.mjs";

const OUT = "data/lang/reports/";

/** an engine over the freshly built data and the family recordings (test path: any take counts as a recording) */
function engineFor(data, audio, path) {
  return createEngine({ data, audio, path, phrases: false });
}

const plain = (s) => String(s || "").replace(/\s+/g, " ").trim();

/* ---------------- what the games ask for ---------------- */

function wordNeeds(S, game, ids) {
  const needs = [];
  for (const id of ids) {
    const e = S.find(id);
    if (!e) continue;
    const label = `${game} word "${e.gloss}" (${id})`;
    if (e.pos === "N" || e.pos === "PN") {
      needs.push({ label, meaning: { fn: "Item", kind: e.id, n: 1 } });
      if (e.pos === "N" && e.status !== "to-record") needs.push({ label: `${label}, more than one`, meaning: { fn: "Item", kind: e.id, n: 3 } });
    } else if (e.pos === "Num") needs.push({ label, meaning: { fn: "Item", kind: "n.cup", n: e.value } });
    else if (e.pos === "A") {
      // a describing word that only has a she-form is asked on a she-word (tea), not alone
      const sheOnly = e.forms && Object.keys(e.forms).length && Object.keys(e.forms).every((k) => k.startsWith("she"));
      needs.push({ label, meaning: sheOnly ? { fn: "Item", kind: "n.tea", mods: [e.id] } : { fn: "Amt", x: e.id } });
    }
    else if (e.pos === "V") needs.push({ label, meaning: { fn: "Command", verb: e.id } });
    else needs.push({ label, meaning: { fn: "Say", x: e.id } });
  }
  return needs;
}

const subst = (m, id) => JSON.parse(JSON.stringify(m, (k, v) => (v === "$x" ? id : v)));

function lineNeeds(S, game) {
  const needs = [];
  for (const g of S.gameLines.filter((x) => x.game === game)) {
    if (!g.meaning) continue;
    const label = `${game} line "${g.en}" (${g.alias})`;
    const samples = g.sample && g.sample.length ? g.sample : [null];
    for (const smp of samples) {
      const m = subst(g.meaning, smp);
      if (smp === null && JSON.stringify(g.meaning).includes('"$x"')) continue;
      const lbl = smp ? `${label}, with ${smp}` : label;
      if (["Need", "WantIn", "NotNeed"].includes(m.fn)) {
        needs.push({ label: `${lbl} (informal)`, meaning: m, ctx: { register: "informal" } });
        needs.push({ label: `${lbl} (polite)`, meaning: m, ctx: { register: "polite" } });
      } else needs.push({ label: lbl, meaning: m });
    }
  }
  return needs;
}

function cookWordIds(S) {
  const ids = [];
  const cook = readJSON("data/cook.json");
  ids.push(...Object.keys(cook.words));
  for (const f of ["mishkaki-grill", "maani-line"]) ids.push(...Object.keys(readJSON(`data/stations/${f}.json`).words || {}));
  return ids;
}
function clinicWordIds(S) {
  const ids = new Set();
  const add = (o) => Object.keys(o || {}).forEach((k) => k !== "_about" && ids.add(k));
  const c = readJSON("data/clinic.json");
  add(c.words);
  for (const k of Object.keys(c.items || {})) if (k !== "_about") ids.add(`clinic.item.${k}`);
  const lang = readJSON("data/clinic/lang.json");
  add(lang.words);
  return Array.from(ids).filter((id) => {
    const e = S.find(id);
    return e && !(lang.words[id] && lang.words[id].from);
  });
}

/* ---------------- the gap list ---------------- */

export function buildGapList(S, data, audio) {
  const engineTest = engineFor(data, audio, "test");
  const engineStore = engineFor(data, audio, "store");
  const cookNeeds = [...wordNeeds(S, "Cook", cookWordIds(S)), ...lineNeeds(S, "cook")];
  const clinicNeeds = [...wordNeeds(S, "Clinic", clinicWordIds(S)), ...lineNeeds(S, "clinic")];
  const elicit = readJSON("data/lang/elicit.json");
  const ctx = { register: "informal" };
  const dropUnknownWords = (rep) => {
    // a word we have no Kutchi for needs its word first: its gender is not asked until then
    rep.items = rep.items.filter((i) => !(i.kind === "feature" && S.entries.get(i.lex) && S.entries.get(i.lex).status === "to-record"));
    return rep;
  };
  const cook = dropUnknownWords(gapReport(engineTest, cookNeeds, { elicit, title: "Cook", ctx }));
  const clinic = dropUnknownWords(gapReport(engineTest, clinicNeeds, { elicit, title: "The clinic", ctx }));
  const unchecked = gapReport(engineStore, cookNeeds.concat(clinicNeeds), { elicit, ctx }).items.filter((i) => i.kind === "audio");
  const testAudioKeys = new Set([...cook.items, ...clinic.items].filter((i) => i.kind === "audio").map((i) => i.key));
  const awaiting = unchecked.filter((i) => !testAudioKeys.has(i.key));
  return { cook, clinic, awaiting, cookNeeds, clinicNeeds };
}

const KIND_HEADS = {
  lexeme: "Words with no Kutchi yet (English placeholders in the game today)",
  rule: "Sentences and frames the engine cannot say yet",
  form: "A form of a word we know is missing (plural, 'with the …')",
  feature: "Is it a he-word or a she-word? (the engine used the he-form, Mum's rule, and flags it)",
  audio: "We know the word but have no recording of it",
};
const KIND_ORDER = ["rule", "lexeme", "form", "feature", "audio"];

/** what Mum is asked: a word as a short sentence, a whole line as the line itself */
function requestOf(S, it) {
  if (it.kind === "lexeme") {
    const e = it.lex ? S.entries.get(it.lex) : null;
    if (e && e.pos === "Phrase") return `Please say, the way you would at home: "${plain(e.gloss)}"`;
  }
  return plain(it.request || it.what);
}

function section(S, report, title) {
  const items = report.items;
  const lines = [`## ${title}`, "", `${report.items.length} things to ask or record, from the lines and words the game uses today.`, ""];
  for (const kind of KIND_ORDER) {
    const group = items.filter((i) => i.kind === kind);
    if (!group.length) continue;
    lines.push(`### ${KIND_HEADS[kind]} (${group.length})`, "");
    group.forEach((it, n) => {
      const ask = it.ask.length ? ` Ask: ${it.ask.join(", ")}.` : "";
      const by = it.neededBy.slice(0, 3).join("; ") + (it.neededBy.length > 3 ? ` … (${it.neededBy.length} lines)` : "");
      lines.push(`${n + 1}. ${requestOf(S, it)}${ask}`);
      lines.push(`   - Needed by: ${by}.`);
    });
    lines.push("");
  }
  return lines;
}

export function gapListMarkdown(S, gl) {
  const n = (r, k) => r.items.filter((i) => i.kind === k).length;
  const out = [
    "# Gap list: what Cook and the clinic say today that the engine cannot say yet, or has no recording for",
    "",
    "The minimum for step 4c (decision 38 c). **No frequency ranking and no simulator** (they wait until whole arcs are settled): each gap lists the lines that need it, in the order the game gives them. Built by `node build/lang/import_all.mjs` (re-run it after every round of Mum's answers). The English here is for grown-ups; Mum's sheet is written from it (`docs/language/fill-the-engine.md` § 3).",
    "",
    "| | Cook | Clinic |",
    "|---|---|---|",
    ...KIND_ORDER.map((k) => `| ${KIND_HEADS[k]} | ${n(gl.cook, k)} | ${n(gl.clinic, k)} |`),
    "",
    `Lines and words checked: Cook ${gl.cookNeeds.length}, clinic ${gl.clinicNeeds.length}. A recording counts here if any take exists; ${gl.awaiting.length} more words have a take that is not yet ticked OK in \`lab/family-audio.html\` (only OK takes ship, rule G16).`,
    "",
    "Gaps are listed once, however many lines need them: closing a word closes it everywhere. The words and lines that exist only in the parked modes (dress, who, snap, tidy, find, monsoon, relations) are in the lexicon as to-record entries and are not repeated here.",
    "",
    ...section(S, gl.cook, "Cook"),
    ...section(S, gl.clinic, "The clinic"),
  ];
  // the placeholders the engine can already answer
  out.push("## Placeholders in a game's data that the engine can already say", "", "A game file still shows an English placeholder (`kutchi: null`) for something the engine already knows. Step 4d and 4e (moving Cook and the clinic onto the engine) pick these up for free; nothing needs asking.", "");
  const seen = new Set();
  for (const c of S.closable) {
    const k = `${c.file}|${c.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    const e = S.entries.get(c.entry);
    out.push(`- \`${c.id}\` (${c.file}): "${c.english}" → ${e && e.lemma ? `*${e.lemma}*` : e ? "(" + e.id + ")" : c.entry}${e && e.status !== "confirmed" ? ` (${e.status})` : ""}`);
  }
  out.push("");
  if (gl.awaiting.length) {
    out.push("## Recorded but not yet ticked OK", "");
    for (const a of gl.awaiting.slice(0, 80)) out.push(`- ${plain(a.what)}`);
    out.push("");
  }
  return out.join("\n");
}

/* ---------------- the clash list ---------------- */

const FIELD_ASK = { lemma: "the spelling or the word", gender: "he-word or she-word", status: "draft or confirmed", form: "the form" };

export function clashListMarkdown(S, log, gl) {
  const out = [
    "# Clash list: every place two sources disagree, for Zafar and Mum",
    "",
    "Where two sources disagree the engine never chooses silently: it uses the higher-ranked source (Mum and Zafar over a game's data over the class handout; for status, the more cautious one), keeps the other as an **open question on the entry**, and lists it here. Rebuilt by `node build/lang/import_all.mjs`. Each row says what the engine uses now and what we recommend; answer \"yes to all except …\".",
    "",
  ];
  const spelling = log.clashes.filter((c) => c.field === "lemma" || c.field.startsWith("form:") || c.field === "gender");
  const status = log.clashes.filter((c) => c.field === "status");
  let n = 0;
  const row = (c) => {
    const e = S.entries.get(c.id);
    const others = c.others.map((o) => `"${o.value}" (${o.source})`).join("; ");
    const res = c.resolved ? ` **Settled:** ${c.resolved.why} (${c.resolved.src}).` : "";
    return `${++n}. **${e ? e.gloss : c.id}** (\`${c.id}\`): ${FIELD_ASK[c.field.split(":")[0]] || c.field}. The engine uses "${c.chosen}" (${c.chosenSource}); the other source says ${others}.${res}`;
  };
  out.push(`## 1. Spelling, gender and form: two sources say different things (${spelling.length})`, "");
  for (const c of spelling.filter((x) => !x.resolved)) out.push(row(c));
  out.push("", `### Already settled by a rule or a decision (${spelling.filter((x) => x.resolved).length})`, "");
  for (const c of spelling.filter((x) => x.resolved)) out.push(row(c));

  out.push("", `## 2. Two words for one thing (${S.alternatives.length + S.entriesWithAlternatives().length})`, "", "The family, or two of our sources, give more than one word for the same thing. Which one does the game use?", "");
  n = 0;
  for (const a of S.alternatives) out.push(`${++n}. **${a.english}**: Mum's *${(S.entries.get(a.mine) || {}).lemma}* (\`${a.mine}\`) against the class handout's *${a.theirs}* (${a.id}). Recommendation: Mum's word; the handout's stays a draft.`);
  for (const e of S.entriesWithAlternatives()) out.push(`${++n}. **${e.gloss}** (\`${e.id}\`): ${e.open.filter((q) => /two words|Two words/.test(q.q)).map((q) => q.q).join(" ")}`);

  out.push("", `## 3. Status only: one source says confirmed, another draft (${status.length})`, "", "The more cautious status is used (a draft shows flagged until Zafar ticks it). These are mostly a game's draft flag that has not caught up with a later answer from Mum, or the reverse.", "");
  n = 0;
  for (const c of status) {
    const e = S.entries.get(c.id);
    const res = c.resolved ? ` **Settled:** ${c.resolved.why} (${c.resolved.src}).` : "";
    out.push(`${++n}. **${e ? e.gloss : c.id}** (\`${c.id}\`): the engine uses ${c.chosen} (${c.chosenSource}); the other source says ${c.others.map((o) => `${o.value} (${o.source})`).join("; ")}.${res}`);
  }

  // decisions or sources the games have not caught up with
  out.push("", "## 4. The game's data and a decision or an answer disagree", "");
  const gaps = DECISION_CLASHES;
  out.push("| Thing | What disagrees | Recommendation |", "|---|---|---|");
  for (const [a, b, c] of gaps) out.push(`| ${a} | ${b} | ${c} |`);

  // game lines whose draft flag disagrees with what the engine finds
  out.push("", "## 5. A game line's draft flag against the engine", "", "Cook's own flag on a line against the status the engine finds from its words and rule (the engine marks a line draft when any word, form or rule in it is a draft).", "");
  const eng = gl.engineTest;
  const flagged = [];
  for (const g of S.gameLines.filter((x) => x.game === "cook" && x.meaning && x.kind !== "torecord" && x.kind !== "unknown-frame")) {
    const smp = (g.sample && g.sample[0]) || null;
    const m = subst(g.meaning, smp);
    if (JSON.stringify(g.meaning).includes('"$x"') && smp === null) continue;
    let r;
    try {
      r = eng.say(m, { register: "informal" }, { plan: false });
    } catch (e) {
      continue;
    }
    if (!r.ok) continue;
    const engineDraft = r.drafts.length > 0;
    if (!!g.draft !== engineDraft) flagged.push({ g, engineDraft, text: r.text, why: r.drafts.map((d) => d.t).join(", ") });
  }
  n = 0;
  for (const f of flagged) out.push(`${++n}. Cook line \`${f.g.key}\` ("${f.g.text || f.g.en}"): Cook ${f.g.draft ? "flags it draft" : "does not flag it draft"}; the engine says ${f.engineDraft ? "draft (" + f.why + ")" : "confirmed"} for "${f.text}".`);
  if (!flagged.length) out.push("None.");

  // recordings that are not linked
  out.push("", "## 6. Recordings that are not linked to any entry", "", "Every other recording in `data/family-audio.json` is linked in `clips.json`. These are not, and why:", "");
  const rows = S.audioLog.unlinked;
  const groups = { contradicts: [], spelling: [], rule: [], engine: [], pair: [], other: [] };
  for (const u of rows) {
    const r = REASONS[u.id];
    if (r) groups[r.kind].push({ u, r });
    else if (PAIRS.test(u.id)) groups.pair.push({ u });
    else groups.other.push({ u });
  }
  const names = { contradicts: "The recording contradicts a settled rule or a later answer (never use it as it is)", spelling: "The recording and a game spell the word differently (Zafar to listen)", rule: "A sentence the engine has no rule for yet", engine: "Something the engine cannot do yet", pair: "Two phrases said in one take (one X, two Xs): to be split into two clips", other: "Not explained yet" };
  for (const k of Object.keys(groups)) {
    if (!groups[k].length) continue;
    out.push(`### ${names[k]} (${groups[k].length})`, "");
    for (const { u, r } of groups[k]) out.push(`- \`${u.id}\`: *${u.text}* (${u.english || ""})${r ? `. ${r.why} Source: ${r.src}. Recommendation: ${r.recommend}` : ""}`);
    out.push("");
  }
  return out.join("\n");
}

/* ---------------- coverage ---------------- */

export function coverageMarkdown(S, log, data, validation, audio) {
  const entries = data.lexicon.entries;
  const by = (f) => entries.reduce((m, e) => ((m[f(e)] = (m[f(e)] || 0) + 1), m), {});
  const row = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join("\n");
  const rules = Object.entries(data.concrete.lin);
  const stat = by((e) => e.status);
  const srcKinds = {};
  for (const e of entries) for (const s of [].concat(e.src || [])) {
    const k = /^lexicon\.md/.test(s) ? "lexicon.md §6" : /^grammar-notes|^§/.test(s) ? "grammar-notes" : /data\/cook\.json/.test(s) ? "data/cook.json" : /data\/clinic/.test(s) ? "data/clinic*" : /data\/content\.json/.test(s) ? "data/content.json (handout)" : /data\/(dress|who|relations|monsoon|snap|tidy|find)\.json/.test(s) ? "parked modes" : /data\/conversations|data\/story/.test(s) ? "conversations / story" : /decisions|rule G/.test(s) ? "decisions / rulebook" : "other";
    srcKinds[k] = (srcKinds[k] || 0) + 1;
  }
  const withParts = entries.filter((e) => e.parts && e.parts.length).length;
  const clipsBy = { word: data.clips.clips.filter((c) => c.lex).length, phrase: data.clips.clips.filter((c) => c.meaning && /^(Say|Exclaim|Ask)\(/.test(c.meaning)).length, sentence: data.clips.clips.filter((c) => c.meaning && !/^(Say|Exclaim|Ask)\(/.test(c.meaning)).length };
  return [
    "# Coverage: what the engine holds (step 4b)",
    "",
    `Built by \`node build/lang/import_all.mjs\`. The data check: ${validation.errors.length} errors, ${validation.warnings.length} warnings.`,
    "",
    "## Lexicon",
    "",
    `${entries.length} entries (${withParts} are fixed expressions made of other words).`,
    "",
    "| By part of speech | Entries |", "|---|---|", row(by((e) => e.pos)),
    "",
    "| By status | Entries |", "|---|---|", row(stat),
    "",
    "| By source (an entry can cite several) | Citations |", "|---|---|", row(srcKinds),
    "",
    "## Grammar",
    "",
    `${Object.keys(data.paradigms.paradigms).length} word classes (paradigms); ${Object.keys(data.abstract.functions).length} meanings; ${rules.length} rules (${rules.filter(([, r]) => (r.status || "confirmed") === "confirmed").length} confirmed, ${rules.filter(([, r]) => r.status === "draft").length} draft, ${rules.filter(([, r]) => r.status === "unknown").length} unknown, asking Mum); ${rules.reduce((s, [, r]) => s + (r.exceptions || []).length, 0)} exceptions.`,
    "",
    "## Recordings",
    "",
    `${S.audioLog.recordings} distinct recordings in data/family-audio.json (${S.audioLog.withFile} with a file). ${data.clips.clips.length} rows in clips.json: ${clipsBy.word} word forms, ${clipsBy.phrase} fixed phrases, ${clipsBy.sentence} sentences the rules build. ${S.audioLog.unlinked.length} recordings are not linked (clash list § 6).`,
    "",
    "## Games",
    "",
    `Game lines registered: ${S.gameLines.length} (${["cook", "clinic"].map((g) => `${g} ${S.gameLines.filter((x) => x.game === g).length}`).join(", ")}, and ${S.gameLines.filter((x) => !["cook", "clinic"].includes(x.game)).length} in the conversations, the story and the parked modes). Placeholders the engine can already answer: ${new Set(S.closable.map((c) => c.id)).size}.`,
    "",
    "## Sources loaded, and sources deliberately not",
    "",
    "Loaded: data/cook.json, data/stations/*.json, data/content.json, data/clinic.json, data/clinic/lang.json, data/clinic/pipeline.json, data/clinic/heal/*.json, data/conversations/lines.json, data/story/first-launch.json, the parked modes' data (dress, who, relations, monsoon, snap, tidy, find), docs/language/lexicon.md §6 (the tables), docs/language/grammar-notes.md and grammar-kb.md (by hand, each entry citing its section), the 5 Oct report, data/family-audio.json.",
    "",
    "Not loaded as Kutchi (rule G1: two AIs agreeing is not evidence): the Gemini blueprints, Claude's grammar checklist, the Sindhi and Gujarati comparisons in grammar-notes, the 'Claude's check' paragraphs, the agreement paper, and `Mum yes-no list (2026-10-05).md`. They shaped the questions, never the data. Data/cook-tts.json and data/monsoon-audio.json are test-only text-to-speech indexes (rule G14): they are checked against the lexicon, not loaded.",
    "",
  ].join("\n");
}

/* ---------------- source coverage: emphasised words in the notes the lexicon cannot say ---------------- */

export function sourceCoverageMarkdown(data) {
  const known = new Set();
  const par = data.paradigms.paradigms;
  for (const e of data.lexicon.entries) {
    if (e.status === "to-record") continue;
    for (const t of [e.lemma, ...Object.values(e.forms || {}).map((v) => (typeof v === "string" ? v : v && v.t))]) if (t) for (const w of norm(t).split(" ")) known.add(w);
    const p = e.paradigm && par[e.paradigm];
    if (p && e.lemma) {
      const stem = p.stem && p.stem.drop && e.lemma.endsWith(p.stem.drop) ? e.lemma.slice(0, -p.stem.drop.length) : e.lemma;
      for (const c of Object.values(p.cells)) if (c.make) known.add(norm(c.make.replace("{stem}", stem).replace("{lemma}", e.lemma)));
    }
  }
  const files = ["docs/language/grammar-notes.md", "docs/language/lexicon.md", "build/reports/mum-2026-10-05.md"];
  const ignore = new Map();
  for (const [why, list] of Object.entries(NOT_LOADED)) for (const w of list.split(/\s+/)) if (w) ignore.set(w, why);
  const missing = new Map();
  for (const f of files) {
    const text = readText(f);
    for (const m of text.matchAll(/\*\*\*([^*\n]+?)\*\*\*|(?<![*\w])\*([^*\n]{1,60}?)\*(?![*\w])/g)) {
      for (const w of norm(m[1] || m[2]).split(" ")) if (w && /^[a-z]+$/.test(w) && !known.has(w)) (missing.get(w) || missing.set(w, new Set()).get(w)).add(f.split("/").pop());
    }
  }
  const out = ["# Source coverage: emphasised words in the notes that the lexicon cannot say", "", "Every word in bold or italic in `grammar-notes.md`, `lexicon.md` and the 5 Oct report that is not a form of some entry. Re-run `node build/lang/import_all.mjs` after adding Mum's next answers to the notes and the hand files: a word she gave that nobody loaded shows up under **to review**. Words are grouped by why they are not loaded (never a silent skip).", ""];
  const byWhy = new Map();
  const review = [];
  for (const [w, fs] of missing) {
    const why = ignore.get(w);
    if (why) (byWhy.get(why) || byWhy.set(why, []).get(why)).push(w);
    else review.push(w);
  }
  out.push(`## To review (${review.length})`, "", review.length ? review.sort().join(", ") : "Nothing: every emphasised word is loaded or accounted for below.", "");
  for (const [why, list] of byWhy) out.push(`## ${why} (${list.length})`, "", list.sort().join(", "), "");
  return out.join("\n");
}

export function writeReports({ S, log, data, audio, validation }) {
  const gl = buildGapList(S, data, audio);
  gl.engineTest = engineFor(data, audio, "test");
  writeText(OUT + "gap-list.md", gapListMarkdown(S, gl) + "\n");
  writeText(OUT + "clash-list.md", clashListMarkdown(S, log, gl) + "\n");
  writeText(OUT + "coverage.md", coverageMarkdown(S, log, data, validation, audio) + "\n");
  writeText(OUT + "source-coverage.md", sourceCoverageMarkdown(data) + "\n");
  return gl;
}
