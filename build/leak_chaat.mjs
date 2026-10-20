/*
 * The chaat bowl's leak bot (CHT-14, CHT-15; decision 9; non-negotiable 6), a leak.mjs adapter
 * (build/tools/review/leak-configs/chaat.json): can a player who knows no Kutchi earn every tick by trying each thing?
 *   node build/tools/review/leak.mjs chaat
 * It plays the bowl's own rules, read from js/cook/mechanics/assemble.js's CHAAT_RULES block (checker, judgeDrop,
 * rowsMissed: the code the game runs, not a copy), on orders shaped like data/cook.json recipes.chaat by level: the two
 * bases in either order, 1-3 toppings, potato, onion and tomato said as one or two spoons, decoys from the toppings by the
 * level table (1, 2, 3, 3), the 'no' item on the shelf from level 3.
 * What the bot sees: the shelf, the bowl (what stayed in, what came back out, when it emptied) and how many rows the card
 * has; never the words. A round is won (passed) when three quarters of the rows or more keep their tick (a tick is the right
 * thing on its first go, P63): the accuracy badge's pass, not only a perfect round.
 * --old (the red run): the bowl before decision 9: anything goes in, the card ticks only a row it matches (so a thing that
 * did not tick is taken back, free), and only the first mistake costs a tick (assemble.js's firstMiss).
 * Strategies:
 *   fair      knows the order (must win every round)
 *   random    a random untried thing at each place
 *   eliminate never tries again what came back out; after the bowl empties, puts back what it knows, then tries
 *             what the bowl said is in the order (it emptied it) before anything new
 *   shelf     the shelf left to right, skipping what it has ruled out (a pattern, not a guess)
 *   repeat    the thing just put in again first (the order's "ba bataato"), else eliminate
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = readFileSync(join(ROOT, "js/cook/mechanics/assemble.js"), "utf8");
const DATA = JSON.parse(readFileSync(join(ROOT, "data/cook.json"), "utf8"));

/** The game's own rules, from their markers in assemble.js. */
export function rules(src = SRC) {
  const a = src.indexOf("/* ---- CHAAT_RULES");
  const b = src.indexOf("/* ---- /CHAAT_RULES ---- */");
  if (a < 0 || b < a) throw new Error("assemble.js: no CHAAT_RULES block");
  // eslint-disable-next-line no-new-func
  return new Function(`${src.slice(a, b)}\nreturn { checker, judgeDrop, rowsMissed };`)();
}

const R = DATA.recipes.chaat;
const TOPPINGS = R.lists.toppings;
const BASES = R.slots.base.pick;
const TAKE = R.slots.seq.take.byLevel;
const NO_FROM = R.slots.no.else.from;
const DECOYS = { 1: 1, 2: 2, 3: 3, 4: 3 };
const QTY = ["veg-01", "veg-02", "veg-03"];

const pick = (rng, xs) => xs[Math.floor(rng() * xs.length)];
const shuffle = (rng, xs) => {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** An order as the game builds it: {sequence (qty spelt out), rows (the card's), shelf, exclude}. */
export function order(level, rng) {
  const exclude = level >= 3 ? [pick(rng, NO_FROM)] : [];
  const [lo, hi] = TAKE[level - 1];
  const n = lo + Math.floor(rng() * (hi - lo + 1));
  const tops = shuffle(rng, TOPPINGS.filter((x) => !exclude.includes(x))).slice(0, n);
  const base = pick(rng, BASES);
  const seq0 = base.concat(tops);
  const qty = {};
  QTY.forEach((id) => (qty[id] = 1 + Math.floor(rng() * 2)));
  const sequence = [].concat(...seq0.map((id) => (qty[id] > 1 ? Array(qty[id]).fill(id) : [id])));
  const pool = shuffle(rng, TOPPINGS.filter((x) => !seq0.includes(x) && !exclude.includes(x))).slice(0, Math.max(0, DECOYS[level] - exclude.length));
  const shelf = shuffle(rng, [...new Set(pool.concat(seq0, exclude))]);
  const rows = seq0.map((id) => ({ id })).concat(exclude.map((id) => ({ id, no: true })));
  return { sequence, rows, shelf, exclude };
}

/** One round: the strategy taps until the bowl is full. {win, right, total}. */
const OLD = process.argv.includes("--old");
export const PASS = 0.75;
export function play(level, strategy, rng, { R: rr = rules(), o = order(level, rng), old = OLD } = {}) {
  const { checker, judgeDrop, rowsMissed } = rr;
  const C = checker(o.sequence);
  const missed = new Set();
  const got = [];
  const out = new Set(); // came back out: not wanted at all (from now on)
  const inOrder = new Set(); // the bowl emptied for it: in the order, later
  const tried = new Map(); // place -> things tried there that did not stay
  const known = []; // what stayed, in order (a guesser remembers the bowl)
  let taps = 0;
  while (got.length < C.total && taps < 400) {
    const at = got.length;
    const here = tried.get(at) || new Set();
    tried.set(at, here);
    let id;
    const fresh = o.shelf.filter((x) => !here.has(x) && !out.has(x));
    if (strategy === "fair") id = C.next(got);
    else if (known[at] && strategy !== "random") id = known[at];
    else if (strategy === "random") id = pick(rng, o.shelf.filter((x) => !here.has(x)));
    else if (strategy === "shelf") id = fresh[0];
    else if (strategy === "repeat" && at > 0 && fresh.includes(got[at - 1])) id = got[at - 1];
    else {
      const likely = fresh.filter((x) => inOrder.has(x));
      id = pick(rng, likely.length ? likely : fresh);
    }
    if (id == null) id = pick(rng, o.shelf);
    taps++;
    const j = judgeDrop(C, got, id);
    if (old) {
      // the old bowl: it goes in; no tick on the card for it, so it comes straight back out (the take-back is free); only
      // the first mistake of the round is scored
      if (j.verdict !== "in" && !missed.size) rowsMissed(j, id, o.exclude).slice(0, 1).forEach((x) => missed.add(`${x.no ? "no:" : ""}${x.id}`));
      if (j.verdict === "in") (got.push(id), (known[at] = id));
      else here.add(id), j.verdict === "bounce" && out.add(id);
      continue;
    }
    rowsMissed(j, id, o.exclude).forEach((x) => missed.add(`${x.no ? "no:" : ""}${x.id}`));
    if (j.verdict === "in") {
      got.push(id);
      known[at] = id;
    } else {
      here.add(id);
      if (j.verdict === "bounce") out.add(id);
      else {
        inOrder.add(id);
        got.length = 0;
      }
    }
  }
  const right = o.rows.filter((r) => !missed.has(`${r.no ? "no:" : ""}${r.id}`)).length;
  return { win: got.length >= C.total && right >= PASS * o.rows.length, right, total: o.rows.length };
}

const STRATEGIES = ["fair", "random", "eliminate", "shelf", "repeat"];
export default function adapter() {
  const rr = rules();
  return {
    games: ["chaat"],
    def: () => ({ levels: [1, 2, 3, 4], part: "the chaat bowl (Cook)", gestures: ["tap"] }),
    strategies: () => STRATEGIES,
    run: (id, level, s, rng) => play(level, s, rng, { R: rr, o: order(level, rng) }),
    rows: () => [],
  };
}
