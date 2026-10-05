// Layer 5: the clinic (data/clinic.json, clinic/lang.json, clinic/pipeline.json, clinic/heal/*.json). Almost all of it
// is English placeholders: each becomes one to-record entry per English word (or an alias of the word the engine already
// knows: a "closable" gap), and each line the doctor or patient says becomes an engine meaning whose rule is unknown
// (with the questions that would settle it) unless Mum has already given the shape. The words the clinic shares
// with Cook keep Cook's ids. Re-run after the clinic's data changes.
import { readJSON, norm, RANK } from "./lib.mjs";
import { importWords, importLine, mumOkWords, recordWord } from "./import_cook.mjs";
import { POS_PREFIX, POS, VERB_PREFIX, SAME_AS, FRAMES, ASK } from "./hand/clinic-map.mjs";
import { readdirSync } from "node:fs";
import { ROOT } from "./lib.mjs";

const SOURCE = "data/clinic.json";

function posOf(id, w) {
  if (POS[id]) return POS[id];
  for (const p of Object.keys(POS_PREFIX)) if (id.startsWith(p)) return POS_PREFIX[p];
  if (VERB_PREFIX.some((p) => id.startsWith(p))) return "V";
  return null; // not a clinic-only id: Cook's part-of-speech map, then a noun
}

export function importClinic(S) {
  const rank = RANK.game;
  const okWords = mumOkWords();
  const stat = { words: 0, items: 0, lines: 0, frames: 0, unknown: 0, toRecord: 0, phrases: 0, ladder: 0 };
  const opts = { okWords, rank, posOf, sameAsMap: SAME_AS, partsMap: {} };
  const clinic = readJSON("data/clinic.json");
  stat.words += importWords(S, clinic.words, { file: "data/clinic.json", ...opts });

  // the tray nouns: one entry per English word; the ones the family has (paani, limu, loon, khun, dudh) keep Cook's entries
  for (const [id, it] of Object.entries(clinic.items || {})) {
    if (id === "_about" || !it || typeof it !== "object") continue;
    const src = `data/clinic.json items.${id}: the pharmacy tray's ${it.placeholder ? "placeholder (English, to record)" : "word from Cook"}`;
    if (it.cook) {
      const target = S.find(it.cook);
      if (target) S.patch(target.id, { aliases: [id], src }, { source: SOURCE, rank });
    } else {
      recordWord(S, { pos: "N", english: it.english, src, alias: `clinic.item.${id}`, file: "data/clinic.json items", rank });
    }
    stat.items++;
  }
  for (const [key, ln] of Object.entries(clinic.lines || {})) {
    if (key === "_about" || !ln || typeof ln !== "object") continue;
    const r = importLine(S, "clinic", key, { e: ln.e, _about: ln._about, src: ln._about || ln.who || "the clinic's own line, no Kutchi yet", record: true }, { frames: FRAMES, src: "data/clinic.json", okWords, rank, ask: ASK });
    stat.lines++;
    count(stat, r);
  }

  // clinic/lang.json: the words the clinic's code used to hold, and the four join lines
  const lang = readJSON("data/clinic/lang.json");
  stat.words += importWords(S, lang.words, { file: "data/clinic/lang.json", ...opts });
  for (const [key, ln] of Object.entries(lang.lines || {})) {
    if (!ln || typeof ln !== "object") continue;
    const r = importLine(S, "clinic", `lang.${key}`, ln, { frames: Object.fromEntries(Object.entries(FRAMES).map(([k, v]) => [`lang.${k}`, v])), src: "data/clinic/lang.json", okWords, rank, ask: ASK });
    stat.lines++;
    count(stat, r);
  }

  // clinic/pipeline.json: the patient flow
  const pl = readJSON("data/clinic/pipeline.json");
  const english = (pos, word, where, alias) => {
    if (!word || typeof word !== "string") return;
    recordWord(S, { pos, english: word, src: `data/clinic/pipeline.json ${where}: an English placeholder, to record (the doctor's session, Round 4 Section G)`, alias: alias ? `clinic.pipeline.${alias}` : undefined, file: "data/clinic/pipeline.json", rank });
    stat.ladder++;
  };
  for (const [k, v] of Object.entries(pl.kinds || {})) if (v && v.english) english("Phrase", v.english, `kinds.${k}`, `kind.${k}`);
  for (const [k, v] of Object.entries(pl.ladder_words || {})) if (typeof v === "string") english("N", v, `ladder_words.${k}`, `ladder.${k}`);
  for (const [k, v] of Object.entries(pl.colour_words || {})) if (v && v.english) english("Phrase", v.english, `colour_words.${k}`, `colour.${k}`);
  for (const [k, v] of Object.entries(pl.part_words || {})) english("N", v, `part_words.${k}`, `part.${k}`);
  for (const [k, v] of Object.entries(pl.feelings || {})) {
    if (!v || typeof v !== "object" || k === "_about") continue;
    english("A", v.english, `feelings.${k}`, `feeling.${k}`);
    if (v.line && v.line.english) {
      const r = importLine(S, "clinic", `feeling-${k}`, { e: v.line.english, src: "data/clinic/pipeline.json feelings: English placeholder, to record", record: true }, { frames: {}, src: "data/clinic/pipeline.json", okWords, rank, ask: ASK });
      stat.lines++;
      count(stat, r);
    }
  }
  for (const [k, v] of Object.entries(pl.goodbyes || {})) {
    if (!v || typeof v !== "object") continue;
    const r = importLine(S, "clinic", `goodbye-${k}`, { k: v.kutchi, e: v.english, src: "data/clinic/pipeline.json goodbyes" }, { frames: {}, src: "data/clinic/pipeline.json", okWords, rank, ask: ASK });
    stat.lines++;
    count(stat, r);
    if (v.cue && v.cue.english) {
      const c = importLine(S, "clinic", `cue-${k}`, { e: v.cue.english, record: true, src: "data/clinic/pipeline.json goodbyes cue: English placeholder, to record" }, { frames: {}, src: "data/clinic/pipeline.json", okWords, rank, ask: ASK });
      stat.lines++;
      count(stat, c);
    }
  }
  for (const [k, v] of Object.entries(pl.ailments || {})) {
    if (!v || typeof v !== "object" || k === "_about") continue;
    if (v.say && v.say.english) {
      const r = importLine(S, "clinic", `ailment-${k}`, { e: v.say.english, record: true, src: "data/clinic/pipeline.json ailments: the doctor names it; English placeholder, to record" }, { frames: {}, src: "data/clinic/pipeline.json", okWords, rank, ask: ASK });
      stat.lines++;
      count(stat, r);
    }
  }
  for (const [key, ln] of Object.entries(pl.lines || {})) {
    if (!ln || typeof ln !== "object" || key.startsWith("_")) continue;
    const r = importLine(S, "clinic", `pipeline.${key}`, { k: ln.kutchi, e: ln.english, en: ln.english, src: "data/clinic/pipeline.json", record: true, _about: ln._src }, { frames: Object.fromEntries(Object.entries(FRAMES).map(([k, v]) => [`pipeline.${k}`, v])), src: "data/clinic/pipeline.json", okWords, rank, ask: ASK });
    stat.lines++;
    count(stat, r);
  }

  // clinic/heal/*.json: each healing game's words and its lines (a line with no text is a sound, not a word)
  for (const f of readdirSync(ROOT + "data/clinic/heal").filter((x) => x.endsWith(".json")).sort()) {
    const d = readJSON(`data/clinic/heal/${f}`);
    const file = `data/clinic/heal/${f}`;
    if (d.words) stat.words += importWords(S, d.words, { file, ...opts });
    for (const [key, ln] of Object.entries(d.lines || {})) {
      if (!ln || typeof ln !== "object" || (!ln.k && !ln.e)) continue;
      const r = importLine(S, "clinic", key, ln, { frames: FRAMES, src: file, okWords, rank, ask: ASK });
      stat.lines++;
      count(stat, r);
    }
  }
  return stat;
}

function count(stat, r) {
  if (r.kind === "frame") stat.frames++;
  else if (r.kind === "unknown-frame") stat.unknown++;
  else if (r.kind === "torecord") stat.toRecord++;
  else stat.phrases++;
}
