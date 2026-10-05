// Layer 9: every recording in data/family-audio.json becomes a row in clips.json, linked to the entry it says (rule G27:
// "every recording as a clips.json row linked to its entry"). Recordings never change the engine (G12): the row says
// which word form or which whole phrase a recording is; where the recording and the entry disagree the row is not
// written and the recording is listed as unlinked. A recording of one word is linked to every entry that says exactly
// that text; a recording of a fixed phrase is linked as a whole meaning (Say / Exclaim / Ask of that phrase); a
// recording of a sentence the rules build (an order, a place, a possessive) is attached by finding the meaning whose
// linearisation is exactly that text (attach.mjs).
import { readJSON, norm } from "./lib.mjs";
import { formIndex } from "./phrases.mjs";
import { attachSentences } from "./attach.mjs";

export function importAudio(S) {
  const audio = readJSON("data/family-audio.json");
  const byId = new Map();
  for (const a of audio) {
    if (!a || !a.id) continue;
    const g = byId.get(a.id) || byId.set(a.id, { id: a.id, text: null, english: null, qid: a.qid, takes: 0, speakers: new Set() }).get(a.id);
    if (!g.text && a.kutchi) g.text = a.kutchi;
    if (!g.english && a.english) g.english = a.english;
    if (a.file) {
      g.takes++;
      g.speakers.add(a.speaker);
    }
  }
  const { L, index } = formIndex(S);
  const multi = new Map();
  for (const e of S.entries.values()) if (e.pos === "Phrase" && e.lemma && e.status !== "to-record" && /\s/.test(norm(e.lemma))) multi.set(norm(e.lemma), e.id);
  const multiAny = new Map(); // a word whose own text is more than one word (an adverb like aste thi)
  for (const e of S.entries.values()) if (e.pos !== "Phrase" && e.lemma && e.status !== "to-record" && /\s/.test(norm(e.lemma))) multiAny.set(norm(e.lemma), e.id);
  const single = new Map();
  for (const e of S.entries.values()) if (e.pos === "Phrase" && e.lemma && e.status !== "to-record" && !/\s/.test(norm(e.lemma))) single.set(norm(e.lemma), e.id);

  const rows = [];
  const stat = { recordings: byId.size, withFile: 0, word: 0, phrase: 0, sentence: 0, unlinked: [], noFile: 0 };
  const seen = new Set();
  const add = (r) => {
    const k = JSON.stringify(r);
    if (!seen.has(k)) (seen.add(k), rows.push(r));
  };
  const unlinked = [];
  for (const g of byId.values()) {
    if (!g.takes) {
      stat.noFile++;
      continue;
    }
    stat.withFile++;
    const t = norm(g.text);
    if (!t) continue;
    let linked = false;
    if (!t.includes(" ")) {
      // one word: every entry that says exactly this text; an entry whose every cell says it gets one row (cell *)
      const cands = (index.get(t) || []).filter((c) => c.status !== "to-record");
      const byEntry = new Map();
      for (const c of cands) (byEntry.get(c.id) || byEntry.set(c.id, []).get(c.id)).push(c);
      for (const [id, cs] of byEntry) {
        const own = cs.some((c) => c.own);
        if (!own && cs.every((c) => c.cell === "-")) continue;
        const cells = cs.map((c) => c.cell);
        const wild = cells.includes("-") || cells.includes("*");
        // every cell of the word says it (an invariant word): one row for all cells; else one row per cell that says it
        const e = S.entries.get(id);
        const total = new Set();
        for (const c of cs) total.add(c.cell);
        if (wild || (e && !e.paradigm && Object.keys(e.forms || {}).every((k) => k === "-" || k === "*"))) add({ clip: g.id, lex: id, cell: "*" });
        else for (const cell of cells) add({ clip: g.id, lex: id, cell });
        linked = true;
        stat.word++;
      }
      if (!linked && single.has(t)) {
        add({ clip: g.id, lex: single.get(t), cell: "*" });
        linked = true;
        stat.word++;
      }
    } else if (multiAny.has(t)) {
      add({ clip: g.id, lex: multiAny.get(t), cell: "*" });
      linked = true;
      stat.word++;
    } else if (multi.has(t)) {
      const id = multi.get(t);
      for (const fn of ["Say", "Exclaim", "Ask"]) add({ clip: g.id, meaning: `${fn}(${id})` });
      linked = true;
      stat.phrase++;
    }
    if (!linked) unlinked.push(g);
  }
  // sentences the rules build: attach where the engine says exactly what Mum said
  const att = attachSentences(S, unlinked, L);
  for (const r of att.rows) add(r);
  stat.sentence = att.attached.length;
  stat.unlinked = unlinked.filter((g) => !att.attached.includes(g.id)).map((g) => ({ id: g.id, text: g.text, english: g.english, qid: g.qid }));
  S.clips = rows;
  S.audioLog = stat;
  return { recordings: stat.recordings, withFile: stat.withFile, rows: rows.length, word: stat.word, phrase: stat.phrase, sentence: stat.sentence, unlinked: stat.unlinked.length };
}
