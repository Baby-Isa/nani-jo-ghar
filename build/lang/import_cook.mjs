// Layer 4: Cook (data/cook.json words, lines and guide; data/stations/*.json words and lines). Every word becomes
// (or merges into) a lexicon entry with Cook's id as an alias; every sentence frame is registered as the meaning the
// game asks the engine for; every fixed line becomes a phrase entry; a line with no Kutchi becomes a to-record entry.
// Source disagreements become open questions and clash-list rows (lib.mjs settle()). Re-run after Cook's data changes.
import { readJSON, norm, RANK } from "./lib.mjs";
import { autoParadigm } from "./hand/dsl.mjs";
import { POS, PARTS, SAME_AS, CLASH_NOTES, FRAMES } from "./hand/cook-map.mjs";
import { GENDER_ASK } from "./hand/asks.mjs";

const SOURCE = "data/cook.json";

/** Single-word Mum clips Zafar has ticked OK in lab/family-audio.html: evidence that Mum said the word and it was heard right. */
export function mumOkWords() {
  const set = new Set();
  for (const a of readJSON("data/family-audio.json")) if (a && a.speaker === "mum" && a.checked === "ok" && a.file && a.kutchi) set.add(norm(a.kutchi));
  return set;
}

/**
 * confirmed when Cook's own source names Mum (and no draft flag) or a Mum clip was ticked OK; draft when Cook flags it;
 * otherwise no claim (a handout or "OK for now" source neither confirms nor doubts: new words start as drafts)
 */
export function statusOf(item, lemma, okWords) {
  if (item.draft) return { status: "draft" };
  const src = String(item.src || "");
  if (/^Mum\b/.test(src) || /confirmed by Mum/.test(src)) return { status: "confirmed" };
  if (okWords.has(norm(lemma))) return { status: "confirmed" };
  return { statusDefault: "draft" };
}

const predictPlural = (lemma, gender) => (/o$/.test(lemma) && gender !== "she" ? lemma.slice(0, -1) + "a" : lemma);

export function importWords(S, words, { file, okWords, rank = RANK.game }) {
  let n = 0;
  for (const [cid, w] of Object.entries(words)) {
    if (cid === "_about" || !w || typeof w !== "object") continue;
    const pos = POS[cid] || (cid.startsWith("num-") ? "Num" : "N");
    const sameAs = SAME_AS[cid];
    const srcStr = `${file} words.${cid}: ${w.src || "no source given"}`;
    const english = w.english;
    const notes = [];
    for (const k of Object.keys(w)) if ((k.startsWith("_") && k !== "_about") || k === "note") notes.push(`${k.replace(/^_/, "")}: ${w[k]}`);
    if (w.say_forms) notes.push(`say_forms: ${JSON.stringify(w.say_forms)}`);
    const history = w.src_change ? [{ date: "2026-09-26", change: String(w.src_change), src: srcStr }] : undefined;
    const open = CLASH_NOTES[cid] ? [{ q: CLASH_NOTES[cid], src: srcStr }] : undefined;
    const gender = w.gender === "he" || w.gender === "she" ? w.gender : null;
    // no Kutchi yet: a to-record entry (or the entry the notes say already answers it)
    if (!w.kutchi) {
      if (sameAs) S.patch(sameAs, { aliases: [cid], notes, open, history, src: srcStr }, { source: SOURCE, rank });
      else S.add({ pos, gloss: english, status: "to-record", src: srcStr, aliases: [cid], notes, open, history, ...(pos === "N" ? { gender: null, ask: { word: [w.qfm || "new"] } } : {}) }, { source: SOURCE, rank });
      n++;
      continue;
    }
    const lemma = w.kutchi_one && sameAs ? w.kutchi_one : w.kutchi;
    const spec = { pos, lemma, gloss: english, ...statusOf(w, lemma, okWords), src: srcStr, aliases: [cid], notes, open, history };
    if (sameAs) spec.id = sameAs;
    if (pos === "Num") spec.id = `num.${parseInt(cid.split("-")[1], 10)}`;
    if (pos === "N" || pos === "PN") {
      spec.gender = gender;
      if (gender == null && pos === "N") spec.ask = { gender: [GENDER_ASK[english] || "new"] };
    }
    if (w.say) spec.say = w.say;
    if (PARTS[cid]) {
      const p = PARTS[cid];
      spec.parts = p.parts.map(([lex, cell]) => ({ lex, cell }));
      spec.lemmaKey = lemma;
      delete spec.lemma;
      if ("gender" in p) spec.gender = p.gender;
      if (p.number) spec.number = p.number;
    } else if (pos === "N" || pos === "PN") {
      const par = autoParadigm(pos, lemma, gender);
      if (par) spec.paradigm = par;
      if (w.kutchi_many && norm(w.kutchi_many) !== norm(predictPlural(lemma, gender)) && !sameAs) {
        spec.forms = { "pl.dir": { t: w.kutchi_many, src: srcStr }, "pl.obl": { t: w.kutchi_many, src: srcStr } };
      }
    } else if (pos === "Adv" || pos === "Post") {
      spec.forms = { "-": lemma };
    }
    if (w.alt && w.alt.length) spec.notes = [...(spec.notes || []), `also accepted: ${w.alt.join(", ")} (alt)`];
    S.add(spec, { source: SOURCE, rank });
    n++;
  }
  return n;
}

/** the entry a fixed line becomes: lemma = the text without its final mark, first letter lower case */
export const lemmaOfLine = (text) => {
  const t = String(text).replace(/[.!?]+\s*$/, "").trim();
  return t.charAt(0).toLowerCase() + t.slice(1);
};
export const markOf = (text) => (/!\s*$/.test(text) ? "!" : /\?\s*$/.test(text) ? "?" : ".");
const sayFn = (mark) => (mark === "!" ? "Exclaim" : mark === "?" ? "Ask" : "Say");

/**
 * Register one line of a game. A frame (or a fixed line that is really a frame) is only a meaning; any other line
 * with Kutchi is a phrase entry; a line with no Kutchi is a to-record phrase. Returns the game-line record.
 */
export function importLine(S, game, key, ln, { frames, src, okWords, rank }) {
  const alias = `${game}.line.${key}`;
  const text = ln.k || null;
  const en = ln.en || ln.e || key;
  const record = { game, key, alias, text, en, draft: !!ln.draft, kind: null, meaning: null, entry: null };
  const frame = frames[key];
  const srcStr = `${src} lines.${key}: ${ln.src || "no source given"}`;
  if (frame) {
    record.kind = "frame";
    record.meaning = frame.meaning;
    record.sample = frame.sample;
    S.gameLines.push(record);
    return record;
  }
  if (!text) {
    const e = S.add({ pos: "Phrase", gloss: en, status: "to-record", src: srcStr, aliases: [alias], notes: ln._about ? [String(ln._about)] : undefined, ask: { word: [ln.record ? "to record" : "new"] } }, { source: SOURCE, rank });
    record.kind = "torecord";
    record.entry = e.id;
    record.meaning = { fn: "Say", x: e.id };
    S.gameLines.push(record);
    return record;
  }
  const mark = markOf(text);
  const lemma = lemmaOfLine(text);
  const e = S.add({ pos: "Phrase", lemma, gloss: en, forms: { "-": lemma }, ...statusOf(ln, lemma, okWords), src: srcStr, aliases: [alias], notes: ln.confirm ? [String(ln.confirm)] : undefined }, { source: SOURCE, rank });
  record.kind = "phrase";
  record.entry = e.id;
  record.meaning = { fn: sayFn(mark), x: e.id };
  S.gameLines.push(record);
  return record;
}

export function importCook(S) {
  const cook = readJSON("data/cook.json");
  const okWords = mumOkWords();
  S.gameLines = S.gameLines || [];
  const rank = RANK.game;
  const stat = { words: 0, lines: 0, frames: 0, phrases: 0, toRecord: 0, guide: 0 };
  stat.words += importWords(S, cook.words, { file: "data/cook.json", okWords, rank });
  for (const f of ["mishkaki-grill", "maani-line", "chai-tray"]) {
    const st = readJSON(`data/stations/${f}.json`);
    if (st.words && Object.keys(st.words).length) stat.words += importWords(S, st.words, { file: `data/stations/${f}.json`, okWords, rank });
  }
  // Mum's pantry answer, and a few cross-source facts that only Cook's data shows
  for (const [key, ln] of Object.entries(cook.lines)) {
    const r = importLine(S, "cook", key, ln, { frames: FRAMES, src: "data/cook.json", okWords, rank });
    stat.lines++;
    if (r.kind === "frame") stat.frames++;
    else if (r.kind === "phrase") stat.phrases++;
    else stat.toRecord++;
  }
  const stir = readJSON("data/stations/stir.json");
  for (const [key, ln] of Object.entries(stir.lines || {})) {
    const r = importLine(S, "cook", key === "stir-now" ? "now" : key, { ...ln }, { frames: FRAMES, src: "data/stations/stir.json", okWords, rank });
    r.alias = `cook.line.${key}`;
    stat.lines++;
  }
  // Nani's guide box: each key says a line (a line key above) or is English "to record"
  const byEn = new Map();
  for (const [key, g] of Object.entries(cook.guide || {})) {
    if (key === "_about" || !g || typeof g !== "object") continue;
    stat.guide++;
    const rec = { game: "cook", key: `guide.${key}`, alias: `cook.guide.${key}`, en: g.en, kind: null, meaning: null };
    if (g.line) {
      const target = S.gameLines.find((x) => x.game === "cook" && x.key === g.line);
      rec.kind = "guide-line";
      rec.meaning = target && target.meaning;
      rec.entry = target && target.entry;
      if (target && target.entry) S.patch(target.entry, { aliases: [rec.alias] }, { source: SOURCE, rank });
    } else {
      let id = byEn.get(g.en);
      if (!id) {
        const e = S.add({ pos: "Phrase", gloss: g.en, status: "to-record", src: `data/cook.json guide.${key}: Nani's guide box says what to do now; no Kutchi recorded yet`, aliases: [rec.alias], ask: { word: ["new"] } }, { source: SOURCE, rank });
        id = e.id;
        byEn.set(g.en, id);
      } else S.patch(id, { aliases: [rec.alias] }, { source: SOURCE, rank });
      rec.kind = "torecord";
      rec.entry = id;
      rec.meaning = { fn: "Say", x: id };
    }
    S.gameLines.push(rec);
  }
  return stat;
}
