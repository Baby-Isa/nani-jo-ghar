#!/usr/bin/env node
/*
 * Dress up: the Node leak bot (build brief phase 0; design 8.4 and 8.5).
 *
 * Runs the REAL generator, rack builder and grader (js/dress/look.js,
 * rack.js, grade.js, stubs/pick.js) with no browser, as a player who sees
 * only the screen and knows no Kutchi. English placeholder words are
 * treated as hidden Kutchi. It sees: the things on the rail, shelf, tin,
 * tray and tool board (what they are, their colour and size: anyone can
 * tell red from blue), how many rows the card has, and whose name is said
 * (names are names). It never reads the rows.
 *
 * Strategies (design 8.5 + the phase 0 list):
 *   random     every choice at random
 *   salient    the most eye-catching colour (data words.salience)
 *   frequent   the most common colour / kind on show
 *   usual      the person's usual colour (people.usual; tastes never decide a row)
 *   occasion   the Eid default (white; kurta, cap, dupatta)
 *   order      row order = slot order (fitting) / pile order (lay it out)
 *   empty      put nothing on (beats "no" rows only)
 *   trysee     level 1 only: try at random, the live check says no, try again
 *   recast     press Done at once to hear the recast, then fix
 *   nochange   ignore any change of mind
 *   overfill   lay it out: one extra thing on every pile
 *   tinstops   the table: fill every button spot; bangles: take the whole column
 *   hedge      going out: carry every carry item
 * Plus `oracle`: knows every PLACEHOLDER word and guesses only the real
 * Kutchi (numbers, vadho/nindho, nar). That is the real-Kutchi slice
 * (design D.7), reported on its own and not held to the budget.
 *
 * Pass: every strategy under 10% ear-star rate (design budget 5%).
 * Usage: node build/leak_dress.mjs [--rounds 2000] [--seed 7] [--json out.json]
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const arg = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const ROUNDS = Number(arg("--rounds", 2000));
const SEED = Number(arg("--seed", 7));
const OUT = arg("--json", null);

require(path.join(ROOT, "js/dress/stubs/pick.js"));
require(path.join(ROOT, "js/dress/look.js"));
require(path.join(ROOT, "js/dress/rack.js"));
require(path.join(ROOT, "js/dress/grade.js"));
const { Pick, Look, Rack, Grade } = globalThis.Dress;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data/dress.json"), "utf8"));
const cook = JSON.parse(fs.readFileSync(path.join(ROOT, "data/cook.json"), "utf8"));
// the real words are referenced by id from data/cook.json, never copied: check they're there
const realIds = [...data.real.numbers, ...Object.values(data.real.sizes), data.real.no];
const missing = realIds.filter((id) => !(cook.words[id] || {}).kutchi);
if (missing.length) throw new Error(`real words missing from data/cook.json: ${missing}`);

const sal = (id) => (data.words[id] || {}).salience || 0;
const GAMES = ["layout", "fitting", "table", "bangles", "going-out"];
const STRATS = {
  layout: ["random", "salient", "frequent", "usual", "occasion", "order", "trysee", "recast", "nochange", "overfill", "oracle"],
  fitting: ["random", "salient", "frequent", "usual", "occasion", "order", "empty", "trysee", "recast", "nochange", "oracle"],
  table: ["random", "salient", "frequent", "tinstops", "recast", "oracle"],
  bangles: ["random", "salient", "frequent", "usual", "tinstops", "recast", "oracle"],
  "going-out": ["random", "salient", "occasion", "usual", "hedge", "recast", "oracle"],
};

/* ---------------- helpers the bot uses on what it can see ---------------- */
const byTop = (rng, items, score) => {
  const best = Math.max(...items.map(score));
  return Pick.choose(rng, items.filter((i) => score(i) === best));
};
const countOf = (items, f) => {
  const c = {};
  items.forEach((i) => (c[i[f]] = (c[i[f]] || 0) + 1));
  return c;
};
const EID = data.occasions.eid;

/** One item from `items` by strategy (the per-slot / per-pick choice). */
function choose(strat, items, rng, who) {
  if (!items.length) return null;
  if (strat === "salient") return byTop(rng, items, (i) => sal(i.colour));
  if (strat === "frequent") {
    const c = countOf(items, "colour");
    const k = countOf(items, "kind");
    return byTop(rng, items, (i) => (c[i.colour] || 0) * 100 + (k[i.kind] || 0));
  }
  if (strat === "usual" && who && data.people[who]) return byTop(rng, items, (i) => (i.colour === data.people[who].usual ? 1 : 0));
  if (strat === "occasion") return byTop(rng, items, (i) => (i.colour === EID.colour ? 2 : 0) + (EID.garments.includes(i.kind) ? 1 : 0));
  return Pick.choose(rng, items);
}

/* ---------------- one round per game, per strategy -> worn state ---------------- */
function playFitting(strat, round, rack, rng, level) {
  const rows = Look.finalRows(round);
  const who = round.who;
  const slots = Object.keys(round.kindsBySlot);
  const wears = [];
  let misses = 0;
  const pickFor = (slot, s) => choose(s, rack.areas.rail.filter((i) => i.slot === slot), rng, who);
  if (strat === "oracle") {
    // knows every placeholder word; "no" rows turn on nar (real): it guesses wear-or-not
    rows.forEach((r) => {
      if (r.no) {
        if (rng() < 0.5) wears.push({ who, slot: r.slot, item: pickFor(r.slot, "random") });
      } else wears.push({ who, slot: r.slot, item: rack.areas.rail.find((i) => i.slot === r.slot && i.kind === r.garment && i.colour === r.colour) });
    });
  } else if (strat === "empty") {
    /* nothing on */
  } else if (strat === "order") {
    slots.slice(0, rows.length).forEach((slot) => wears.push({ who, slot, item: pickFor(slot, "random") }));
  } else if (strat === "trysee" && level === 1) {
    // try at random; the live check says no; try again (the first miss has already cost the row)
    slots.forEach((slot) => {
      const tried = [];
      for (;;) {
        const pool = rack.areas.rail.filter((i) => i.slot === slot && !tried.includes(i));
        if (!pool.length) break;
        const w = { who, slot, item: Pick.choose(rng, pool) };
        const v = Grade.live(round, { wears }, w);
        if (v === false) {
          misses++;
          tried.push(w.item);
          continue;
        }
        wears.push(w);
        break;
      }
    });
  } else {
    const s = ["trysee", "recast", "nochange"].includes(strat) ? "random" : strat;
    slots.forEach((slot) => wears.push({ who, slot, item: pickFor(slot, s) }));
  }
  if (round.carry) {
    const carry = rack.areas.carry;
    let set = [];
    if (strat === "hedge") set = carry;
    else if (strat === "oracle") set = carry.filter((i) => Look.weatherOk(round.weatherDef, [i.kind]) || round.weatherDef.needs.some((g) => g[0] === i.kind));
    else set = carry.filter(() => rng() < 0.5);
    // carry items on the head or wrap replace what was put there (one per slot)
    set.forEach((i) => wears.push({ who, slot: "carry", item: i }));
  }
  return { wears, misses };
}

function playLayout(strat, round, rack, rng, level) {
  const rows = Look.finalRows(round);
  let left = rack.areas.shelf.slice();
  const take = (it) => (left = left.filter((x) => x !== it));
  const wears = [];
  let misses = 0;
  const counts = {};
  rows.forEach((r) => (counts[r.who] = (counts[r.who] || 0) + 1));
  if (strat === "oracle") {
    rows.forEach((r) => {
      const it = left.find((i) => i.kind === r.garment && i.colour === r.colour);
      take(it);
      wears.push({ who: r.who, slot: "pile", item: it });
    });
    return { wears, misses };
  }
  let plan = round.people.map((who) => [who, counts[who] || 0]);
  if (strat === "order") {
    // row i goes to pile i: the rows spread over the piles in turn
    const n = rows.length;
    plan = round.people.map((who, i) => [who, Math.floor(n / round.people.length) + (i < n % round.people.length ? 1 : 0)]);
  }
  plan.forEach(([who, n]) => {
    const extra = strat === "overfill" ? 1 : 0;
    for (let j = 0; j < n + extra && left.length; j++) {
      if (strat === "trysee" && level === 1) {
        for (;;) {
          const it = Pick.choose(rng, left);
          const w = { who, slot: "pile", item: it };
          if (Grade.live(round, { wears }, w)) {
            take(it);
            wears.push(w);
            break;
          }
          misses++;
          if (misses > 40) break;
        }
        continue;
      }
      const s = ["trysee", "recast", "nochange", "overfill", "order"].includes(strat) ? "random" : strat;
      const it = choose(s, left, rng, who);
      take(it);
      wears.push({ who, slot: "pile", item: it });
    }
  });
  return { wears, misses };
}

function playTable(strat, round, rack, rng) {
  const k = round.knobs;
  const rows = Look.finalRows(round);
  const wears = [];
  const bRow = rows.find((r) => r.thing === "ph-button");
  const mRow = rows.find((r) => r.thing === "motif");
  const s = strat === "recast" || strat === "tinstops" ? "random" : strat;
  if (rack.areas.tin) {
    const size = Pick.choose(rng, ["big", "small"]); // the oracle guesses the real word (vadho / nindho)
    const it = strat === "oracle" ? rack.areas.tin.find((i) => i.colour === bRow.colour && (!i.size || i.size === size)) : choose(s, rack.areas.tin, rng);
    const n = strat === "tinstops" ? round.spots : Pick.int(rng, k.buttons.count);
    for (let j = 0; j < n; j++) wears.push({ slot: "placket", item: it });
  }
  if (rack.areas.tray) {
    const places = [];
    data.parts.forEach((p) => (p === "ph-sleeve" && k.motif.sides ? ["ph-left", "ph-right"].forEach((side) => places.push({ part: p, side })) : places.push({ part: p })));
    let it;
    let place;
    if (strat === "oracle") {
      const size = Pick.choose(rng, ["big", "small"]);
      it = rack.areas.tray.find((i) => i.motif === mRow.motif && i.colour === mRow.colour && (!i.size || i.size === size));
      place = { part: mRow.part, side: mRow.side };
    } else {
      it = choose(s, rack.areas.tray, rng);
      place = Pick.choose(rng, places);
    }
    const n = strat === "tinstops" ? k.motif.count[1] : Pick.int(rng, k.motif.count);
    for (let j = 0; j < n; j++) wears.push({ slot: Grade.partSlot(place), item: it });
  }
  const passed = strat === "oracle" ? round.passme.want : Pick.choose(rng, rack.areas.tools).kind;
  return { wears, passed };
}

function playBangles(strat, round, rack, rng) {
  const k = round.knobs;
  const rows = Look.finalRows(round);
  const colours = [...new Set(rack.areas.tray.map((b) => b.colour))];
  let chosen;
  if (strat === "oracle") chosen = rows.map((r) => r.colour);
  else if (strat === "salient") chosen = colours.slice().sort((a, b) => sal(b) - sal(a) || rng() - 0.5).slice(0, rows.length);
  else if (strat === "usual") chosen = [data.people.ma.usual].filter((c) => colours.includes(c)).concat(Pick.shuffle(rng, colours.filter((c) => c !== data.people.ma.usual))).slice(0, rows.length);
  else chosen = Pick.sample(rng, colours, rows.length);
  const wears = [];
  chosen.forEach((colour) => {
    const n = strat === "tinstops" ? round.each : Pick.int(rng, k.count);
    rack.areas.tray.filter((b) => b.colour === colour).slice(0, n).forEach((b) => wears.push({ who: "ma", slot: "wrist", item: b }));
  });
  return { wears };
}

const PLAY = { fitting: playFitting, "going-out": playFitting, layout: playLayout, table: playTable, bangles: playBangles };

/* ---------------- run ---------------- */
const results = [];
const placeholders = {};
const ruleBreaks = {};
for (const game of GAMES) {
  const levels = data.games[game].levels.length;
  for (let level = 1; level <= levels; level++) {
    const rng = Pick.rng(SEED * 1000 + GAMES.indexOf(game) * 10 + level);
    const rounds = [];
    let oddsSum = 0;
    let oddsMax = 0;
    let overBudget = 0;
    for (let n = 0; n < ROUNDS; n++) {
      const round = Look.generate({ game, level, data, rng });
      const rack = Rack.build(round, rng);
      const broke = Rack.rules(round, rack);
      broke.forEach((b) => (ruleBreaks[`${game} L${level}: ${b.replace(/ph-\w+/g, "x")}`] = true));
      Grade.placeholders(round, data).forEach((p) => ((placeholders[game] = placeholders[game] || new Set()).add(p)));
      oddsSum += round.odds;
      oddsMax = Math.max(oddsMax, round.odds);
      if (round.odds > data.budget.blindOdds) overBudget++;
      rounds.push([round, rack]);
    }
    for (const strat of STRATS[game]) {
      if (strat === "trysee" && level > 1) continue;
      if (strat === "recast" && level === 1 && (game === "layout" || game === "fitting")) continue;
      const srng = Pick.rng(SEED * 7919 + STRATS[game].indexOf(strat) * 131 + level);
      let ear = 0;
      let real = 0;
      rounds.forEach(([round, rack]) => {
        const st = PLAY[game](strat, round, rack, srng, level);
        const g = Grade.check(round, st);
        if (g.ear) ear++;
        if (g.realOk) real++;
      });
      results.push({ game, id: data.games[game].id, level, strat, rate: ear / ROUNDS, real: real / ROUNDS, oddsMean: oddsSum / ROUNDS, oddsMax, overBudget });
    }
  }
}

/* ---------------- report ---------------- */
const pct = (x) => (100 * x).toFixed(1).padStart(5) + "%";
console.log(`Dress up leak bot: ${ROUNDS} rounds per game per level, seed ${SEED}. Budget: blind odds <= ${pct(data.budget.blindOdds)}, bot pass < ${pct(data.budget.botPass)}.\n`);
let fail = 0;
for (const game of GAMES) {
  const rs = results.filter((r) => r.game === game);
  console.log(`${data.games[game].id} ${data.games[game].name}${data.games[game].phase ? " (logic only, phase " + data.games[game].phase + ")" : ""}`);
  const levels = [...new Set(rs.map((r) => r.level))];
  levels.forEach((level) => {
    const lr = rs.filter((r) => r.level === level);
    const blind = lr.filter((r) => r.strat !== "oracle");
    const worst = blind.reduce((a, b) => (b.rate > a.rate ? b : a));
    const oracle = lr.find((r) => r.strat === "oracle");
    const bad = blind.filter((r) => r.rate >= data.budget.botPass);
    fail += bad.length;
    console.log(
      `  L${level}  generator odds mean ${pct(lr[0].oddsMean)} max ${pct(lr[0].oddsMax)} (over budget: ${lr[0].overBudget})  | ` +
        blind.map((r) => `${r.strat} ${pct(r.rate).trim()}`).join(", ") +
        `  | worst ${worst.strat} ${pct(worst.rate).trim()}${bad.length ? "  FAIL" : ""}  | real-Kutchi slice (oracle for placeholders) ${pct(oracle.rate).trim()}`
    );
  });
  console.log(`  placeholder decisions: ${[...(placeholders[game] || [])].join(", ")}\n`);
}
const breaks = Object.keys(ruleBreaks);
console.log(breaks.length ? `Leak-rule breaks on the rack (8.4 rules 2-4):\n  ${breaks.join("\n  ")}` : "Leak rules 2-4: no rack broke them.");
console.log(fail ? `\n${fail} strategy/level cells at or over 10%: FAIL` : "\nEvery blind strategy under 10%: PASS");
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ rounds: ROUNDS, seed: SEED, results, placeholders: Object.fromEntries(Object.entries(placeholders).map(([k, v]) => [k, [...v]])), ruleBreaks: breaks }, null, 1));
process.exit(fail || breaks.length ? 1 : 0);
