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
