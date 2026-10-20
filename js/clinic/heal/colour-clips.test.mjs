// CLN-119 (a child heard Mum's "laal" under the word "yellow"): every heal game's lines, at every level and over many
// rounds, play only the clip of the word they show. Each piece of a line's clip plan that plays a family file is that
// file's own word (data/family-audio.json), and a colour word plays its own colour's clip or nothing (a colour with no
// recording is the grey to-record placeholder, silent). Also: the words each game teaches (CLN-119's marks) are listed
// in its data the way the engine says them. Run: node --test js/clinic/heal/colour-clips.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const require = createRequire(import.meta.url);
const Heal = require(join(ROOT, "js/clinic/heal/registry.js"));
const GAMES = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];
GAMES.forEach((g) => require(join(ROOT, `js/clinic/heal/games/${g}.js`)));

const audio = JSON.parse(readFileSync(join(ROOT, "data/family-audio.json"), "utf8"));
const byFile = new Map(audio.filter((a) => a.file).map((a) => [a.file, a]));
const lex = JSON.parse(readFileSync(join(ROOT, "data/lang/lexicon.json"), "utf8")).entries || [];
const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ").trim();
// the colour words: English gloss -> the engine's Kutchi lemma (null: still to record)
const COLOURS = new Map(
  ["red", "blue", "green", "yellow", "orange", "purple", "white", "black", "pink", "brown"].map((c) => {
    const e = lex.find((x) => x.id === `a.${c}`);
    return [c, e && e.lemma && e.status !== "to-record" ? norm(e.lemma) : null];
  })
);
const rngFrom = (seed) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 16807) % 2147483647), s / 2147483647);
};
// every display word in a plan (an object with a clip plan and an English text: rows, lines, words)
function words(o, out = [], seen = new Set()) {
  if (!o || typeof o !== "object" || seen.has(o)) return out;
  seen.add(o);
  if (Array.isArray(o.plan) && typeof o.english === "string") out.push(o);
  for (const v of Array.isArray(o) ? o : Object.values(o)) if (v && typeof v === "object") words(v, out, seen);
  return out;
}

test("every heal game's lines play only their own words' clips; a colour word plays its own colour or nothing", () => {
  const bad = [];
  let pieces = 0;
  let colourLines = 0;
  for (const g of GAMES) {
    const def = Heal.get(g);
    assert.ok(def && def.bot, `${g} bot`);
    for (const level of def.levels) {
      for (let seed = 1; seed <= 40; seed++) {
        const p = def.bot(level, rngFrom(seed * 7919 + level)).plan;
        for (const w of words(p)) {
          const shown = `${w.kutchi || ""} | ${w.english}`;
          const cols = [...COLOURS.keys()].filter((c) => new RegExp(`\\b${c}\\b`).test(norm(w.english)));
          if (cols.length) colourLines++;
          for (const c of w.plan) {
            if (!c || !c.file) continue;
            pieces++;
            const rec = byFile.get(c.file);
            if (!rec) {
              bad.push(`${g} L${level} [${shown}] ${c.file} ∉ family-audio`);
              continue;
            }
            // the clip is the word it plays under (the piece's own text)
            if (norm(rec.kutchi) !== norm(c.text)) bad.push(`${g} L${level} [${shown}] ${c.file} [${rec.kutchi}] ≠ [${c.text}]`);
            // and a colour line never plays another colour's word
            for (const [other, lemma] of COLOURS) {
              if (!lemma || cols.includes(other)) continue;
              if (new RegExp(`\\b${lemma}\\b`).test(norm(rec.kutchi))) bad.push(`${g} L${level} [${shown}] ${cols.join("+")} ≠ ${other} ${c.file}`);
            }
          }
          // a colour with no recording shows its English (to record) and plays nothing for it
          for (const col of cols) {
            if (COLOURS.get(col)) continue;
            const said = w.plan.filter((c) => c && c.file && norm(c.text).split(" ").includes(col));
            if (said.length) bad.push(`${g} L${level} [${shown}] ${col} → ${said.map((c) => c.file).join("+")}`);
          }
        }
      }
    }
  }
  assert.ok(pieces > 0); // some lines play family clips
  assert.ok(colourLines > 0); // some lines name a colour
  assert.deepEqual([...new Set(bad)].slice(0, 20), []);
});

test("the tooth and taste games list the words they teach (CLN-119), as the engine says them", () => {
  for (const g of ["tooth", "taste"]) {
    const data = JSON.parse(readFileSync(join(ROOT, `data/clinic/heal/${g}.json`), "utf8"));
    const listed = data.words || {};
    const taught = new Map();
    const def = Heal.get(g);
    for (const level of def.levels) for (let seed = 1; seed <= 40; seed++) (def.bot(level, rngFrom(seed)).plan.words || []).forEach((w) => w && w.id != null && taught.set(String(w.id), w));
    assert.ok(taught.size >= 4, `${g} words`);
    for (const [id, w] of taught) {
      assert.ok(listed[id], `${g}.json words.${id}`);
      assert.equal(listed[id].kutchi || null, w.kutchi || null, `${g}.json words.${id}.kutchi`);
      assert.equal(!!listed[id].placeholder, !w.kutchi, `${g}.json words.${id}.placeholder`);
    }
  }
});

// s08 w6N (CLN-107; the voice log: "I can see!" played over mum/dungri-rc.mp3): every line the heal games say by key (each
// game's data lines, the clinic's and the pipeline's), built by the engine as the game builds it, plays only its own words'
// clips: each piece's family file is that piece's own word, and a line's whole recording is that line's own Kutchi. A line
// still to record (the grey English placeholder) plays nothing at all.
test("every heal line said by key plays only its own words' clips (the clip test over every line)", () => {
  const L = require(join(ROOT, "js/clinic/lang.js"));
  const pools = [["clinic", JSON.parse(readFileSync(join(ROOT, "data/clinic.json"), "utf8")).lines || {}], ["pipeline", JSON.parse(readFileSync(join(ROOT, "data/clinic/pipeline.json"), "utf8")).lines || {}]];
  for (const g of GAMES) pools.push([g, JSON.parse(readFileSync(join(ROOT, `data/clinic/heal/${g}.json`), "utf8")).lines || {}]);
  const bad = [];
  let lines = 0;
  let pieces = 0;
  for (const [pool, defs] of pools) {
    for (const [key, def] of Object.entries(defs)) {
      if (!def || typeof def !== "object") continue;
      let w;
      try {
        w = L.line(key, {}, { def, pipeline: pool === "pipeline" });
      } catch (e) {
        continue; // a line with slots needs its game's words (its pieces are covered by the plan test above)
      }
      lines++;
      const shown = `${pool}.${key} [${w.kutchi || ""} | ${w.english}]`;
      if (w.placeholder && (w.plan || []).some((c) => c && c.file)) bad.push(`${shown}: a line to record plays ${(w.plan || []).filter((c) => c && c.file).map((c) => c.file).join("+")}`);
      for (const c of w.plan || []) {
        if (!c || !c.file) continue;
        pieces++;
        const rec = byFile.get(c.file);
        if (!rec) bad.push(`${shown}: ${c.file} ∉ family-audio`);
        else if (norm(rec.kutchi) !== norm(c.text)) bad.push(`${shown}: ${c.file} [${rec.kutchi}] ≠ [${c.text}]`);
      }
      if (w.audio) {
        const rec = byFile.get(w.audio);
        if (!rec) bad.push(`${shown}: its recording ${w.audio} ∉ family-audio`);
        else if (norm(rec.kutchi) !== norm(w.kutchi)) bad.push(`${shown}: its recording ${w.audio} [${rec.kutchi}] ≠ the line`);
      }
    }
  }
  assert.ok(lines > 100, `lines read: ${lines}`);
  assert.ok(pieces > 0, "some lines play family clips");
  assert.deepEqual([...new Set(bad)].slice(0, 20), []);
});
