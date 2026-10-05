// Layer 6: data/content.json, the class-handout / content-master words (fruit, vegetables, spices, numbers) and the
// handout sentences. A word only seen in the handout is a DRAFT, never confirmed (decisions.md working assumptions;
// rules G1, G21). Where the handout's word is a different spelling of a word Mum has already said for the same thing
// (mango: handout aamo, Mum ambo), the handout's word becomes its own draft entry and both entries get an open
// question: never a silent choice. The ids (fru-01 …) are kept as aliases.
import { readJSON, norm, RANK } from "./lib.mjs";
import { autoParadigm } from "./hand/dsl.mjs";
import { GENDER_ASK } from "./hand/asks.mjs";
import { lemmaOfLine, markOf } from "./import_cook.mjs";

const SOURCE = "data/content.json";

export function importContent(S) {
  const c = readJSON("data/content.json");
  const rank = RANK.handout;
  const stat = { words: 0, merged: 0, alternatives: 0, sentences: 0 };
  for (const w of c.words) {
    const lemma = w.kutchi && w.kutchi.text;
    if (!lemma) continue;
    const src = `data/content.json words.${w.id}: ${w.kutchi.source || "handout"} (class handout / content master; never confirmed by Mum)`;
    const isNum = w.category === "number";
    const existing = S.find(w.id);
    if (existing) {
      // the id is already Cook's alias: add the handout's spelling as a claim (a disagreement shows up as an open question)
      S.add({ id: existing.id, pos: existing.pos, lemma, src, statusDefault: "draft" }, { source: SOURCE, rank });
      stat.merged++;
      continue;
    }
    const pos = isNum ? "Num" : "N";
    const byLemma = (S.byLemma.get(norm(lemma)) || []).map((i) => S.entries.get(i)).find((e) => e && e.pos === pos);
    const sameThing = !byLemma ? S.findByGloss(w.english, pos) : null;
    const spec = { pos, lemma, gloss: w.english, aliases: [w.id], src, statusDefault: "draft" };
    if (isNum) {
      spec.id = `num.${parseInt(w.id.split("-")[1], 10)}`;
      spec.value = parseInt(w.id.split("-")[1], 10);
      spec.number = "pl";
      spec.forms = { "*": lemma };
    } else {
      spec.gender = null;
      spec.ask = { gender: [GENDER_ASK[w.english] || "new"] };
      const par = autoParadigm("N", lemma, null);
      if (par) spec.paradigm = par;
    }
    if (sameThing) {
      // two words for the same thing: the handout's is its own draft entry, flagged on both
      spec.open = [{ q: `The handout says "${lemma}" for ${w.english}; Mum said "${sameThing.lemma}". Which one does the game use?`, src }];
      S.patch(sameThing.id, { open: [{ q: `The class handout (${w.id}) says "${lemma}" for the same thing: ${w.english}. Mum's word is "${sameThing.lemma}".`, src }] }, { source: SOURCE, rank });
      stat.alternatives++;
      S.alternatives.push({ id: w.id, mine: sameThing.id, theirs: lemma, english: w.english });
    }
    S.add(spec, { source: SOURCE, rank });
    stat.words++;
  }
  for (const s of c.sentences) {
    const t = s.kutchi && s.kutchi.text;
    if (!t || /\{\w+\}/.test(t)) continue;
    const lemma = lemmaOfLine(t);
    const src = `data/content.json sentences.${s.id}: ${s.kutchi.source || "handout"} (${s.function}; never confirmed by Mum)`;
    S.add({ pos: "Phrase", lemma, gloss: s.english, forms: { "-": lemma }, aliases: [`content.${s.id}`], src, statusDefault: "draft" }, { source: SOURCE, rank });
    stat.sentences++;
  }
  return stat;
}
