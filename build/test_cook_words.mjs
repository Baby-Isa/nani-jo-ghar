#!/usr/bin/env node
/*
 * Step 4d: Cook's words through the language engine (js/cook/words.js over js/core/lang/engine/ and data/lang/).
 *   node --test build/test_cook_words.mjs
 * 1. Every frame key and fixed line Cook says is the engine's: a sample of each says what the engine says, never
 *    Cook's own data; an English placeholder only where the engine reports a gap (rule G9).
 * 2. The decided clash rows: thank you in English, khuda-fis for goodbye (G6), mirchi (decision 5).
 * 3. PAN-02: the pantry's spoken lines are full sentences ("Muke atto de."), never the verbless "Ne atto.".
 * 4. No word lookups in Cook's code (G26, decision 36): js/cook/** (but the parked pages' js/cook/lang.js) never reads
 *    a word's Kutchi, English, forms, gender or voice spelling, data.lines, data.grammar or the placeholder TTS table.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createEngine } from "../js/core/lang/engine/index.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const J = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

/** Cook's bridge in a bare window, on the real engine data. */
export function cookWords() {
  const data = {};
  for (const f of ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"]) data[f] = J(`data/lang/${f}.json`);
  const engine = createEngine({ data, audio: J("data/family-audio.json") });
  const win = { Cook: { data: J("data/cook.json"), langEngine: engine, speed: 1 } };
  win.window = win;
  vm.createContext(win);
  vm.runInContext(readFileSync(join(ROOT, "js/cook/words.js"), "utf8"), win, { filename: "js/cook/words.js" });
  return win.Cook;
}
const C = cookWords();
const L = C.Lang;
const text = (l) => L.plain(l);
const english = (l) => l.segs.filter((s) => s.lang === "e").map((s) => s.t.trim()).filter(Boolean);

test("frames: the engine's sentences", () => {
  assert.equal(text(L.line("need", L.phrase(["cook-chai"]))), "Muke chai khape.");
  assert.equal(text(L.line("need", L.phrase([2, "cook-maani"]))), "Muke ba maani khape.");
  assert.equal(text(L.line("need", L.phrase([1, "ph-big", "cook-maani"]))), "Muke hakri wadhi maani khape.");
  assert.equal(text(L.line("and", L.phrase([3, "veg-02"]))), "Ne trae dungri.");
  assert.equal(text(L.line("then", L.phrase(["cook-maani"]))), "Ne poi maani.");
  assert.equal(text(L.line("need_waari", L.phrase(["cook-dudh"]))), "Muke dudh waari chai khape.");
  assert.equal(text(L.line("give", L.phrase(["cook-khun"]))), "Muke khun de.");
  assert.equal(text(L.line("no", L.phrase(["cook-dudh"]))), "Dudh na.");
  assert.equal(text(L.line("canyou", L.phrase(["cook-chai"]))), "Tu muke chai banai dinda?");
});

test("rows: lower case, no full stop (F10); the Cook id stays on the word", () => {
  const p = L.phrase([2, "cook-maani"]);
  assert.equal(text(p), "ba maani");
  assert.ok(p.segs.some((s) => s.w === "cook-maani"));
  assert.ok(p.segs.some((s) => s.w === C.numId(2)));
});

test("a frame the engine can't say is its gap, in English, flagged (G2, G9)", () => {
  const w = L.line("with", L.phrase(["cook-dudh"]));
  assert.ok(!w.ok);
  assert.deepEqual(english(w), ["with"]);
  assert.ok(w.segs.some((s) => s.lang === "k" && s.t === "dudh"));
});

test("clash rows: thank you (English, as the family says it), khuda-fis, mirchi", () => {
  assert.equal(text(L.line("thanks")), "Thank you!");
  assert.ok(L.line("thanks").segs.every((s) => s.lang !== "e"), "thank you is the family's word, not a placeholder");
  assert.equal(text(L.line("bye")), "Khuda-fis!");
  assert.equal(C.display("veg-12"), "mirchi");
});

test("PAN-02: the pantry asks in full sentences", () => {
  const def = C.data.recipes.pantry;
  assert.ok(def.say.every((e) => e.frame === "give"), "every pantry line is Muke {x} de.");
  assert.equal(text(L.line("give", L.phrase(["cook-atto"]))), "Muke atto de.");
});

test("the guide box and the pantry headline are the engine's lines", () => {
  const g = C.data.guide;
  assert.equal(text(L.guideLine("knead", g.knead)), "Atto gund!");
  const pour = L.guideLine("pour", g.pour);
  assert.ok(!pour.ok && english(pour).length, "a guide line Mum hasn't given stays the engine's placeholder");
  const hl = L.line("headline-pantry", L.phrase(["cook-chai"]));
  assert.ok(!hl.ok && hl.segs.some((s) => s.lang === "k" && s.t === "chai"), text(hl));
});

test("speech is the engine's clip plan", () => {
  const l = L.line("need", L.phrase([2, "cook-maani"]));
  assert.ok(l.plan.length >= 3);
  assert.ok(l.plan.every((c) => c.source));
  const j = L.join([l, L.line("and", L.phrase(["cook-dudh"]))]);
  assert.equal(j.plan.length, l.plan.length + L.line("and", L.phrase(["cook-dudh"])).plan.length);
});

test("no word lookups in Cook's code (G26)", () => {
  const files = [];
  const walk = (d) => readdirSync(join(ROOT, d)).forEach((n) => (statSync(join(ROOT, d, n)).isDirectory() ? walk(join(d, n)) : n.endsWith(".js") && files.push(join(d, n))));
  walk("js/cook");
  const BAD = [
    [/data\.(lines|grammar)\b/, "data/cook.json lines or grammar"],
    [/Cook\.data\.words\b|\bdata\.words\[/, "data/cook.json words (use Cook.item for the item catalogue, the engine for words)"],
    [/Cook\.tts\b|cook-tts\.json|content\.json/, "the placeholder TTS table or the class handout"],
  ];
  const hits = [];
  for (const f of files) {
    if (f === "js/cook/lang.js") continue; // the parked pages' adapter (dress, find, snap, tidy, monsoon)
    readFileSync(join(ROOT, f), "utf8")
      .split("\n")
      .forEach((ln, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(ln)) return;
        // allowed: the item catalogue accessor (core.js) and the parked pages' TTS table, each marked on its line
        for (const [re, why] of BAD) if (re.test(ln) && !/parked pages only|item catalogue/.test(ln)) hits.push(`${f}:${i + 1} ${why}: ${ln.trim().slice(0, 90)}`);
      });
  }
  assert.deepEqual(hits, []);
});
