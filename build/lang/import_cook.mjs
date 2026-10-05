// Layer 4: Cook (data/cook.json words, lines and guide; data/stations/*.json words and lines). Every word becomes
// (or merges into) a lexicon entry with Cook's id as an alias; every sentence frame is registered as the meaning the
// game asks the engine for; every fixed line becomes a phrase entry; a line with no Kutchi becomes a to-record entry.
// Source disagreements become open questions and clash-list rows (lib.mjs settle()). Re-run after Cook's data changes.
import { readJSON, norm, RANK } from "./lib.mjs";
import { autoParadigm } from "./hand/dsl.mjs";
import { POS, PARTS, SAME_AS, CLASH_NOTES, FRAMES } from "./hand/cook-map.mjs";
import { GENDER_ASK } from "./hand/asks.mjs";

const SOURCE = "data/cook.json";
const ASK_DEFAULT = "to record with Mum (the game line has no Kutchi yet)";
const LINE_SAME_AS = { "clinic.pipeline.haa": "phrase.yes" }; // the clinic spells yes haa, Mum said ha (a clash, kept)

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

export function importWords(S, words, { file, okWords, rank = RANK.game, posOf = null, sameAsMap = SAME_AS, partsMap = PARTS }) {
  let n = 0;
  for (const [cid, w] of Object.entries(words)) {
    if (cid === "_about" || !w || typeof w !== "object" || w.from) continue; // `from`: a copy of a Cook word, already loaded
    let pos = (posOf && posOf(cid, w)) || POS[cid] || (cid.startsWith("num-") ? "Num" : null);
    if (!pos) {
      // no part of speech given for this id: the same word already loaded under another id (the heal files spell one word under several ids) keeps its part of speech
      const hit = w.kutchi ? (S.byLemma.get(norm(w.kutchi)) || [])[0] : null;
      pos = (hit && S.entries.get(hit) && S.entries.get(hit).pos) || "N";
    }
    const sameAs = sameAsMap[cid];
    // a copy of a word Cook already loaded (same id, same Kutchi): nothing to add but where else it is used
    const have = S.find(cid);
    if (have && w.kutchi && have.lemma && norm(w.kutchi) === norm(have.lemma) && !sameAs) {
      S.patch(have.id, { src: `${file} words.${cid}: a copy of this word` }, { source: file, rank });
      continue;
    }
    const srcStr = `${file} words.${cid}: ${w.src || "no source given"}`;
    const english = w.english;
    const notes = [];
    for (const k of Object.keys(w)) if ((k.startsWith("_") && k !== "_about") || k === "note") notes.push(`${k.replace(/^_/, "")}: ${w[k]}`);
    if (w.say_forms) notes.push(`say_forms: ${JSON.stringify(w.say_forms)}`);
    const history = w.src_change ? [{ date: "2026-09-26", change: String(w.src_change), src: srcStr }] : undefined;
    const open = CLASH_NOTES[cid] ? [{ q: CLASH_NOTES[cid], src: srcStr }] : undefined;
    const gender = w.gender === "he" || w.gender === "she" ? w.gender : null;
    // no Kutchi yet: the entry that already answers it, a known word under another id, or one to-record entry per English word
    if (!w.kutchi) {
      let target = sameAs ? S.find(sameAs) : null;
      let viaGloss = false;
      if (!target) {
        target = S.findByGloss(english, pos === "Phrase" ? "Phrase" : null);
        viaGloss = !!target;
      }
      if (target) {
        S.patch(target.id, { aliases: [cid], notes: sameAs ? notes : undefined, open, history, src: srcStr }, { source: SOURCE, rank });
        if (viaGloss || target.status !== "to-record") S.closable.push({ id: cid, file, entry: target.id, english, word: target.lemma || null });
      } else {
        const key = `${pos}|${norm(english)}`;
        const known = S.recordIndex.get(key);
        if (known) S.patch(known, { aliases: [cid], src: srcStr }, { source: SOURCE, rank });
        else {
          const e = S.add({ pos, gloss: english, status: "to-record", src: srcStr, aliases: [cid], notes, open, history, ...(pos === "N" ? { gender: null, ask: { word: [w.qfm || "new"] } } : { ask: { word: [w.qfm || "new"] } }) }, { source: SOURCE, rank });
          S.recordIndex.set(key, e.id);
        }
      }
      n++;
      continue;
    }
    let lemma = w.kutchi_one && sameAs ? w.kutchi_one : w.kutchi;
    if (pos === "Phrase") lemma = lemmaOfLine(lemma);
    const spec = { pos, lemma, gloss: english, ...statusOf(w, lemma, okWords), src: srcStr, aliases: [cid], notes, open, history };
    if (sameAs && S.find(sameAs)) spec.id = S.find(sameAs).id;
    else if (sameAs) spec.id = sameAs;
    if (pos === "Num") spec.id = `num.${parseInt(cid.split("-")[1], 10)}`;
    if (pos === "N" || pos === "PN") {
      spec.gender = gender;
      if (gender == null && pos === "N") spec.ask = { gender: [GENDER_ASK[english] || "new"] };
    }
    if (w.say) spec.say = w.say;
    if (partsMap[cid]) {
      const p = partsMap[cid];
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
    } else if (pos === "Adv" || pos === "Post" || pos === "Phrase") {
      spec.forms = { "-": lemma };
    } else if (pos === "A" && /o$/.test(lemma) && !sameAs) {
      spec.paradigm = "adj.o";
    }
    if (w.alt && w.alt.length) spec.notes = [...(spec.notes || []), `also accepted: ${w.alt.join(", ")} (alt)`];
    S.add(spec, { source: file, rank });
    n++;
  }
  return n;
}

/** One to-record entry per English word: the engine's answer if it already knows the word (a closable gap), else a new entry. */
export function recordWord(S, { pos, english, src, alias, file, ask = "new", rank = RANK.game, notes }) {
  const target = S.findByGloss(english, pos === "Phrase" ? "Phrase" : null);
  if (target) {
    S.patch(target.id, { aliases: alias ? [alias] : undefined, src }, { source: SOURCE, rank });
    S.closable.push({ id: alias || english, file, entry: target.id, english, word: target.lemma || null });
    return target;
  }
  const key = `${pos}|${norm(english)}`;
  const known = S.recordIndex.get(key);
  if (known) return S.patch(known, { aliases: alias ? [alias] : undefined, src }, { source: SOURCE, rank });
  const e = S.add({ pos, gloss: english, status: "to-record", src, aliases: alias ? [alias] : undefined, notes, ...(pos === "N" ? { gender: null, ask: { word: [ask] } } : { ask: { word: [ask] } }) }, { source: SOURCE, rank });
  S.recordIndex.set(key, e.id);
  return e;
}

const pascal = (s) => String(s).replace(/\{(\w+)\}/g, " $1 ").replace(/[^A-Za-z0-9\s]/g, " ").split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
const SAMPLE_ARG = { part: "body-ear", x: "body-ear", side: "side-left", tool: "tool-torch", kind: "cook-maani", a: "cook-maani", b: "cook-dudh", c: "cook-khun", rest: "cook-dudh", n: 2, what: "body-ear", y: "cook-dudh", pela: "lnk-pela", nepoi: "lnk-nepoi" };

/** A game frame Mum has not given: an abstract meaning with an unknown rule, asking for the questions that would settle it. */
export function unknownFrame(S, { english, src, ask, key }) {
  const args = Array.from(new Set(Array.from(String(english).matchAll(/\{(\w+)\}/g)).map((m) => m[1])));
  let name = pascal(english) || "Line";
  if (/^[0-9]/.test(name)) name = "L" + name;
  const sig = JSON.stringify(args);
  while (S.functions[name] && S.functions[name]._sig !== sig) name += "2";
  if (!S.functions[name]) {
    S.functions[name] = { cat: "Utt", args: Object.fromEntries(args.map((a) => [a, { type: a === "n" ? "Num" : "NP" }])), en: english, elicit: [english.replace(/\{(\w+)\}/g, (_, a) => ({ part: "knee", x: "knee", side: "left", tool: "torch", kind: "man", n: "two" }[a] || a))], _sig: sig };
    S.lin[name] = { status: "unknown", ask: [ask], english, what: english, src };
  }
  const meaning = { fn: name };
  for (const a of args) meaning[a] = SAMPLE_ARG[a] != null ? SAMPLE_ARG[a] : "cook-maani";
  return { name, meaning };
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
export function importLine(S, game, key, ln, { frames, src, okWords, rank, ask = ASK_DEFAULT }) {
  const alias = `${game}.line.${key}`;
  const text = ln.k || null;
  const en = ln.en || ln.e || key;
  const record = { game, key, alias, text, en, draft: !!ln.draft, kind: null, meaning: null, entry: null };
  const frame = frames[key];
  const srcStr = `${src} lines.${key}: ${ln.src || ln._src || "no source given"}`;
  const finish = (kind, meaning, entry) => {
    Object.assign(record, { kind, meaning, entry: entry || null });
    S.gameLines.push(record);
    return record;
  };
  if (frame) {
    record.sample = frame.sample;
    return finish("frame", frame.meaning);
  }
  const bracketed = !!text && /\[[^\]]+\]/.test(text); // an English placeholder inside the Kutchi frame: to record
  const hasSlot = /\{\w+\}/.test(text || "") || (!text && /\{\w+\}/.test(en));
  if (hasSlot) return finish("unknown-frame", unknownFrame(S, { english: en, src: srcStr, ask, key }).meaning);
  if (!text || bracketed) {
    const t = recordWord(S, { pos: "Phrase", english: en, src: srcStr, alias, file: src, ask: ln.record ? "to record" : "new", rank, notes: ln._about ? [String(ln._about)] : undefined });
    return finish("torecord", { fn: "Say", x: t.id }, t.id);
  }
  const mark = markOf(text);
  const lemma = lemmaOfLine(text);
  const sameAs = (LINE_SAME_AS || {})[alias];
  const e = S.add({ ...(sameAs ? { id: sameAs } : {}), pos: "Phrase", lemma, gloss: en, forms: { "-": lemma }, ...statusOf(ln, lemma, okWords), src: srcStr, aliases: [alias], notes: ln.confirm ? [String(ln.confirm)] : undefined }, { source: SOURCE, rank });
  return finish("phrase", { fn: sayFn(mark), x: e.id }, e.id);
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
  // a recipe's card headline (the pantry's "bring me these for {dish}", step 4d): a frame Mum hasn't given, with the
  // dish in its slot (data/cook.json meanings names the meaning), and its plain form for a trip with no dish
  for (const [rid, r] of Object.entries(cook.recipes || {})) {
    const hl = r && r.headline;
    if (!hl || !hl.line) continue;
    importLine(S, "cook", hl.line, { e: String(hl.en).replace("{dish}", "{x}"), src: hl._about }, { frames: FRAMES, src: "data/cook.json", okWords, rank });
    if (hl.line_plain && hl.en_plain) importLine(S, "cook", hl.line_plain, { e: hl.en_plain, src: hl._about }, { frames: FRAMES, src: "data/cook.json", okWords, rank });
    stat.lines++;
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
