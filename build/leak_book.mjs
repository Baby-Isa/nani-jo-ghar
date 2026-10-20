#!/usr/bin/env node
/*
 * The evening book's leak bot (BOOK-08, non-negotiable 6; build/reports/s09a-fable-review.md section 2): can someone who knows no
 * Kutchi win name it, stick in the photo or find it? It plans thousands of books with the page's own planner (js/day/book-games.js,
 * data/day-book.json, the language engine) and plays each page's first try with strategies that know no Kutchi:
 *   first        always the first choice (the first thing in the page's order)
 *   position     always the same slot (the best slot over every page)
 *   elimination  never a thing that was an answer earlier in that game, nor one already found
 *   waiting      idle help only says the line again (checked in book-play.js: an idler does nothing but g.say), so waiting is a blind guess
 *   tap-all      taps everything: only the first tap counts (the record is first-try), so it is a blind guess
 *   reading      reads the page before the answer: Kutchi it can't use; a grey "to record" English line (decision 84) is listed as
 *                "still English" (as leak.mjs does) until Mum records it, never counted as the design passing
 *   echo         matches a word said before the answer to a choice (name it: does "What's this?" say the word?)
 * and a fair player who knows the words. Pass: fair wins every page; every blind strategy wins no more than chance (+4 points over
 * the trials); reading and echo find nothing. Exit 1 on a leak.
 *   node build/leak_book.mjs [--trials 3000] [--json] [--plant]   (--plant: the answer always first: the bot must catch it, exit 1)
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { planBook, linesFor } from "../js/day/book-games.js";
import { createEngine, DATA_FILES } from "../js/core/lang/engine/index.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : d);
const TRIALS = Number(val("--trials", 3000));
const PLANT = has("--plant");
const TOL = 0.04;

const D = JSON.parse(readFileSync(join(ROOT, "data/day-book.json"), "utf8"));
const lang = {};
for (const f of DATA_FILES) lang[f] = JSON.parse(readFileSync(join(ROOT, `data/lang/${f}.json`), "utf8"));
const E = createEngine({ data: lang, audio: [] });

function rngOf(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lineOf = (list, thing) => {
  for (const c of linesFor(list, thing, (t) => t.word)) {
    try {
      const r = c.word ? E.word(c.word) : E.say(c.meaning);
      if (r && r.ok) return { ok: true, text: r.text, lex: (r.segments || []).map((s) => s.w).filter(Boolean), en: c.en };
    } catch (e) {
      /* the next candidate */
    }
  }
  const c = linesFor(list, thing, (t) => String((E.linearizer.lexOf(t.word) || {}).gloss || t.word).split(/[,(]/)[0].trim())[0];
  return { ok: false, text: c ? c.en : "", lex: [], en: c ? c.en : "" };
};
const glossOf = (word) => String((E.linearizer.lexOf(word) || {}).gloss || "").split(/[,(]/)[0].trim().toLowerCase();
const sameLex = (a, b) => {
  const x = E.linearizer.lexOf(a);
  const y = E.linearizer.lexOf(b);
  return !!(x && y && x.id === y.id);
};

// the idle help: book-play.js's idlers may only say the line again
const play = readFileSync(join(ROOT, "js/day/book-play.js"), "utf8");
const idleCalls = [...play.matchAll(/idler\(g, \(\) => ([^)]*\))\)/g)].map((m) => m[1]);
const idleOk = idleCalls.length >= 3 && idleCalls.every((c) => /^g\.say\(/.test(c));

const STRATS = ["first", "pos0", "pos1", "pos2", "pos3", "elimination", "random", "fair"];
const tally = {}; // game -> strat -> {won, n}; chance -> {sum, n}
const add = (game, s, won) => {
  const g = (tally[game] = tally[game] || { chance: { sum: 0, n: 0 } });
  const t = (g[s] = g[s] || { won: 0, n: 0 });
  t.won += won ? 1 : 0;
  t.n++;
};
const problems = [];
const stillEnglish = new Set();
const say = (place) => (k) => {
  try {
    return !!E.check({ fn: "Item", kind: D.places[place].things[k].word }).ok;
  } catch (e) {
    return false;
  }
};

for (const [logKey, log] of Object.entries(D.lab)) {
  if (logKey.startsWith("_")) continue;
  const placeKey = D.activityPlace[log.activity] || "farm";
  const place = D.places[placeKey];
  for (let t = 0; t < TRIALS; t++) {
    const rng = rngOf(1000 + t * 7919);
    const plan = planBook({ data: D, place: placeKey, today: { entries: log.entries, words: log.words }, say: say(placeKey), rng });
    const r2 = rngOf(99 + t);
    const pastAnswers = { nameit: [], photo: [] };
    for (const p of plan.pages) {
      if (p.game === "find") {
        // the things in the page's order (the order they are drawn); --plant: the asked one always first
        const things = PLANT ? [...p.asks, ...p.things.map((x) => x.key).filter((k) => !p.asks.includes(k))] : p.things.map((x) => x.key);
        if (p.asks.length >= things.length) problems.push(`find (${logKey}): asks for all ${things.length} things shown`);
        const found = [];
        for (const ask of p.asks) {
          const left = things.filter((k) => !found.includes(k));
          tally.find = tally.find || { chance: { sum: 0, n: 0 } };
          tally.find.chance.sum += 1 / left.length;
          tally.find.chance.n++;
          add("find", "first", left[0] === ask);
          for (let s = 0; s < 4; s++) add("find", `pos${s}`, things[s] === ask && !found.includes(things[s]));
          add("find", "elimination", left[Math.floor(r2() * left.length)] === ask);
          add("find", "random", things[Math.floor(r2() * things.length)] === ask);
          add("find", "fair", true);
          // the question: written before the tap; reading would win if it held a shown thing's English
          const q = lineOf(D.lines.where, place.things[ask]);
          if (!q.ok && things.some((k) => q.text.toLowerCase().includes(glossOf(place.things[k].word)))) problems.push(`find (${logKey}): the question is English that names the thing ("${q.text}")`);
          found.push(ask);
        }
      } else if (p.game === "nameit" || p.game === "photo") {
        const choices = PLANT ? [p.answer, ...p.choices.filter((k) => k !== p.answer)] : p.choices;
        const g = p.game;
        tally[g] = tally[g] || { chance: { sum: 0, n: 0 } };
        tally[g].chance.sum += 1 / choices.length;
        tally[g].chance.n++;
        add(g, "first", choices[0] === p.answer);
        for (let s = 0; s < 3; s++) add(g, `pos${s}`, choices[s] === p.answer);
        const elim = choices.filter((k) => !pastAnswers[g].includes(k));
        add(g, "elimination", elim[Math.floor(r2() * elim.length)] === p.answer);
        add(g, "random", choices[Math.floor(r2() * choices.length)] === p.answer);
        add(g, "fair", true);
        if (pastAnswers[g].some((k) => choices.includes(k))) problems.push(`${g} (${logKey}): an earlier answer is back among the choices`);
        pastAnswers[g].push(p.answer);
        const S = place[g].sentence;
        const sent = lineOf(S[p.answer] || S.default, place.things[p.answer]);
        if (g === "nameit") {
          // said before the answer: "What's this?" only; it must not hold any choice's word (echo)
          const q = lineOf(D.lines.whatsThis);
          if (choices.some((k) => q.lex.some((w) => sameLex(w, place.things[k].word)))) problems.push(`nameit (${logKey}): the question says a choice's word`);
          if (!sent.ok) stillEnglish.add(`nameit: "${sent.text}" (after the answer)`);
        } else {
          // written under the frame BEFORE the drag: English naming a photo would give it away (reading)
          // a to-record placeholder (decision 84) is English until Mum records it: like build/tools/review/leak.mjs's "still English" rows
          // it is counted and listed, never a pass for the design; Kutchi under the frame a reader can't use
          if (!sent.ok) stillEnglish.add(`photo: "${sent.text}" (under the frame, before the drag: names the photo until recorded)`);
        }
      }
    }
  }
}

const report = { trials: TRIALS, plant: PLANT, idleOnlyRepeats: idleOk, games: {}, problems: [...new Set(problems)], stillEnglish: [...stillEnglish] };
let leak = !idleOk;
for (const [g, T] of Object.entries(tally)) {
  const chance = T.chance.sum / T.chance.n;
  const rates = {};
  for (const s of STRATS) if (T[s]) rates[s] = T[s].won / T[s].n;
  const blind = Object.entries(rates).filter(([s]) => s !== "fair");
  const worst = blind.reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0]);
  const ok = rates.fair === 1 && worst[1] <= chance + TOL;
  if (!ok) leak = true;
  report.games[g] = { chance: +chance.toFixed(3), best: worst[0], bestRate: +worst[1].toFixed(3), fair: rates.fair, ok, rates: Object.fromEntries(Object.entries(rates).map(([k, v]) => [k, +v.toFixed(3)])) };
}
const hard = report.problems;
if (hard.length) leak = true;
if (has("--json")) console.log(JSON.stringify(report, null, 1));
else {
  console.log(`leak_book: ${TRIALS} books per lab day${PLANT ? " (PLANTED: the answer always first)" : ""}`);
  for (const [g, r] of Object.entries(report.games)) console.log(`  ${r.ok ? "ok  " : "LEAK"} ${g.padEnd(7)} chance ${(r.chance * 100).toFixed(1)}%, best blind ${r.best} ${(r.bestRate * 100).toFixed(1)}%, fair ${(r.fair * 100).toFixed(0)}%   ${Object.entries(r.rates).map(([k, v]) => `${k} ${(v * 100).toFixed(1)}`).join(" · ")}`);
  console.log(`  ${idleOk ? "ok  " : "LEAK"} idle help only says the line again (${idleCalls.length} idlers)`);
  for (const p of report.problems) console.log(`  LEAK ${p}`);
  if (stillEnglish.size) console.log(`  still English (to record, waiting on Mum; a reader could use the photo ones until then): ${stillEnglish.size} lines\n    ${[...stillEnglish].slice(0, 12).join("\n    ")}`);
  console.log(leak ? "leak_book: FAIL (a player with no Kutchi beats chance)" : "leak_book: PASS (no strategy without Kutchi beats chance; fair play wins every page)");
}
process.exit(leak ? 1 : 0);
