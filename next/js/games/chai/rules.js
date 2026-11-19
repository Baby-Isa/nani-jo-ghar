/*
 * The game's rules, with no screen: what a person's card holds, what may go into a pan, the pour, and whether a glass
 * is what its person asked for. Pure functions: a pan's state and a move in, the new state and events out.
 * Every word id and number comes in through `ctx` from the settings file; none is written here.
 *
 *   context(settings, { ask, level }) -> ctx    everything below reads the settings only through this
 *   ctx: { ask, words, sugarMax, level }       ask: one person's { milk, sugar, spice, named, amount }
 *   card(ask, { words }) -> { headline, items }                     the person's order card, as meanings and rows
 *   newDish() -> dish
 *   use(dish, item, ctx) -> { dish, events }                        a thing from the bottom row, for this pan
 *   takeBack(dish, item, ctx) -> { dish, events }                   one spoonful out again
 *   take(dish, ctx) -> { dish, events, left }                       the pan is ready and is tapped: it pours
 *   setAside(dish) -> dish                                          the child moves to another pan
 *   next(dish, ctx) -> { use: item } | { fire: true } | { take: true } | null     the next right move
 *   reset() -> dish                                                 this pan starts again
 *   asAsked(ctx) -> dish                                            the dish as asked, shown after three wrong tries
 *   look(dish, heat) -> what the pan looks like     glass(dish, art, rest), pourFrames, glassFrame -> the glass's pictures
 *   cardArt, wordMomentArt, spoonArt -> which of the game's pictures a card or a spoon shows
 *   artList(art, asks) -> { draw, then }   this order's pictures: what a vessel is drawn with, then what its moves show
 *   served(dish, ctx), needs(dish, ctx), ticks(dish, ctx), counts(dish)
 *   tally(dish, ctx) -> { rows: { [rowId]: { want, got } }, extra: [{ word, n, against }], lost: [rowId] }   the dish counted
 *       against its card (whether it is right is the kit's, from this)
 */

/** What the rules need from the game's settings for one person's dish. */
export const context = (settings, { ask, level }) => ({ ask, level, words: { ...settings.words, lookalike: settings.row.lookalike }, sugarMax: settings.rules.sugarMax });

export const newDish = () => ({ water: 0, leaves: 0, milk: 0, sugar: 0, lookalike: 0, spices: [], spoons: [], poured: 0, closed: false, capped: false, firstWrong: [] });
export const reset = newDish;

/** How many pours the glass takes to hold what was asked: half is one, full is two; where no amount is asked one tap fills it. */
const poursAsked = (ctx) => (ctx.ask.amount ? (ctx.ask.amount === ctx.words.half ? 1 : 2) : 2);
const kindOf = (item, ctx) => {
  const w = ctx.words;
  if (item === w.water) return "water";
  if (item === w.milk) return "milk";
  if (item === w.leaves) return "leaves";
  if (item === w.sugar) return "sugar";
  if (item === w.lookalike) return "lookalike";
  return "spice";
};

/** The person's card: the headline as a meaning, then the rows in their fixed order, the "no" rows last. */
export function card(ask, { words }) {
  const w = words;
  const item = (kind, extra = {}) => ({ fn: "Item", kind, ...extra });
  const want = (thing) => ({ meaning: { fn: "Need", who: "p1", thing }, register: "polite" });
  const halfAsked = ask.amount === w.half;
  let headline;
  let inHeadline = null;
  if (ask.spice) {
    headline = want({ fn: "MixedIn", head: w.dish, x: item(ask.spice) });
    inHeadline = "spice";
  } else if (halfAsked && (!ask.named || (ask.milk && ask.sugar > 0))) {
    headline = want(item(w.dish, { mods: [w.half] }));
    inHeadline = "amount";
  } else if (ask.named && !ask.milk) headline = want(item(w.dish, { mods: [w.black] }));
  else if (ask.named && ask.sugar === 0) headline = want(item(w.dish, { mods: [w.unsweet] }));
  else headline = want(item(w.dish));

  const row = (id, word, meaning, more = {}) => ({ id, word, meaning, n: 1, no: false, said: true, inHeadline: inHeadline === id, ...more });
  const items = [row("water", w.water, item(w.water), { said: false }), row("leaves", w.leaves, item(w.leaves), { said: false })];
  if (ask.spice) items.push(row("spice", ask.spice, item(ask.spice)));
  if (ask.milk) items.push(row("milk", w.milk, item(w.milk)));
  if (ask.sugar > 0) items.push(row("sugar", w.sugar, item(w.sugar, { n: ask.sugar }), { n: ask.sugar }));
  // (half or full is seen only as the glass is poured, so it comes last, before the pour: Zafar, 18 Nov; its card ticks
  // as the dish is served)
  if (ask.amount) items.push(row("amount", ask.amount, { fn: "Amt", x: ask.amount }, { atServe: true }));
  if (!ask.milk) items.push(row("no-milk", w.milk, { fn: "NoItem", x: item(w.milk) }, { no: true }));
  if (ask.sugar === 0) items.push(row("no-sugar", w.sugar, { fn: "NoItem", x: item(w.sugar) }, { no: true }));
  return { headline, items, dishCard: { fn: "Item", kind: w.dish, n: 1 } };
}

const refuse = (dish, item, why) => ({ dish, events: [{ type: "refused", item, why }] });

/** A thing from the bottom row is tapped for this pan. Each thing goes in once; sugar stops at the number asked. */
export function use(dish, item, ctx) {
  const kind = kindOf(item, ctx);
  const ask = ctx.ask;
  if (dish.poured > 0) return refuse(dish, item, "poured");
  if ((kind === "water" && dish.water) || (kind === "milk" && dish.milk) || (kind === "leaves" && dish.leaves)) return refuse(dish, item, "once");
  if (kind === "sugar" && ask.sugar >= 1 && dish.sugar >= ask.sugar) return { dish: { ...dish, capped: true }, events: [{ type: "refused", item, why: "enough" }] };
  if (kind === "spice" && item === ask.spice && dish.spices.includes(item)) return refuse(dish, item, "once");
  if (kind === "sugar" && dish.sugar >= ctx.sugarMax) return { dish, events: [{ type: "full", item }] };
  const d = { ...dish };
  if (kind === "water") d.water = 1;
  else if (kind === "milk") d.milk = 1;
  else if (kind === "leaves") d.leaves = 1;
  else {
    d.spoons = dish.spoons.concat(item);
    if (kind === "sugar") d.sugar = dish.sugar + 1;
    else if (kind === "lookalike") d.lookalike = dish.lookalike + 1;
    else if (!dish.spices.includes(item)) d.spices = dish.spices.concat(item);
  }
  return { dish: d, events: [{ type: "in", item, kind, how: kind === "water" || kind === "milk" ? "pour" : "spoon", n: kind === "sugar" ? d.sugar : 1 }] };
}

/** Was this spoonful a wrong one when it went in? The first placement is the one judged, even if it is taken back. */
const wrongSpoon = (dish, item, kind, ask) => (kind === "sugar" ? dish.sugar > ask.sugar : kind === "lookalike" || item !== ask.spice);

/** One spoonful out again. Water, milk and leaves never come back; nothing comes back once the pan has poured. */
export function takeBack(dish, item, ctx) {
  const at = dish.spoons.lastIndexOf(item);
  if (dish.poured > 0 || dish.closed || at < 0) return refuse(dish, item, "cannot-take-back");
  const kind = kindOf(item, ctx);
  const d = { ...dish, spoons: dish.spoons.filter((s, i) => i !== at) };
  if (wrongSpoon(dish, item, kind, ctx.ask)) d.firstWrong = dish.firstWrong.concat(item);
  if (kind === "sugar") d.sugar = dish.sugar - 1;
  else if (kind === "lookalike") d.lookalike = dish.lookalike - 1;
  else if (!d.spoons.includes(item)) d.spices = dish.spices.filter((s) => s !== item);
  return { dish: d, events: [{ type: "out", item, kind }] };
}

/** The ready pan is tapped: it pours into its person's glass. `left` says whether the pan still holds some. */
export function take(dish, ctx) {
  const asked = poursAsked(ctx);
  if (dish.poured > 0 && (dish.closed || dish.poured >= asked)) return { dish, events: [{ type: "refused", why: "holds-what-was-asked" }], left: dish.poured < 2 };
  const from = dish.poured;
  const to = ctx.ask.amount ? dish.poured + 1 : 2;
  const d = { ...dish, poured: to, closed: to >= asked };
  const events = [{ type: "pour", from, to, look: dish.milk ? "milky" : "black", last: to >= 2 }];
  if (d.closed) events.push({ type: "closed" });
  return { dish: d, events, left: to < 2 };
}

/** The child turns to another pan: a glass already poured into is then final, whatever was asked. */
export const setAside = (dish) => (dish.poured > 0 && !dish.closed ? { ...dish, closed: true } : dish);

export const served = (dish, ctx) => dish.poured > 0 && (dish.closed || dish.poured >= poursAsked(ctx));

/** What the fire needs before it can be lit: the thing still missing, or null. */
export const needs = (dish, ctx) => (dish.water ? null : ctx.words.water);

/** The next right move for this pan, in the card's order; the fire when nothing is missing. */
export function next(dish, ctx, fire) {
  const { ask, words: w } = ctx;
  if (fire === "ready") return !dish.closed && dish.poured < poursAsked(ctx) ? { take: true, again: dish.poured > 0 } : null;
  if (fire !== "cold") return null;
  if (!dish.water) return { use: w.water };
  if (!dish.leaves) return { use: w.leaves };
  if (ask.spice && !dish.spices.includes(ask.spice)) return { use: ask.spice };
  if (ask.milk && !dish.milk) return { use: w.milk };
  if (dish.sugar < ask.sugar) return { use: w.sugar };
  return { fire: true };
}

/**
 * The dish counted against the card, the game's one answer about it: for each of the card's rows how many were asked and
 * how many went in (the amount in halves poured); what went in that no row asks for, with the row it costs (an unasked
 * jar the spice, the lookalike the sugar: the asked spice is known only when it was chosen, with nothing unasked beside
 * it); and the rows whose first try was lost (a wrong spoonful taken back still costs the counted rows theirs). Whether
 * the dish is right, and each row's fault, are the kit's (js/shared/kit/wrong-order.rules.js dishCheck).
 */
export function tally(dish, ctx) {
  const { ask, words: w } = ctx;
  const spoonsOf = (id) => dish.spoons.filter((x) => x === id).length;
  const rows = {
    water: { want: 1, got: dish.water },
    leaves: { want: 1, got: dish.leaves },
    spice: { want: 1, got: ask.spice ? spoonsOf(ask.spice) : 0 },
    milk: { want: 1, got: dish.milk },
    sugar: { want: ask.sugar, got: dish.sugar },
    amount: { want: poursAsked(ctx), got: dish.poured },
    "no-milk": { want: 0, got: dish.milk },
    "no-sugar": { want: 0, got: dish.sugar },
  };
  const unasked = [...new Set(dish.spoons)].filter((id) => id !== ask.spice && id !== w.sugar && id !== w.lookalike);
  const extra = unasked.map((id) => ({ word: id, n: spoonsOf(id), against: "spice" }));
  if (dish.lookalike) extra.push({ word: w.lookalike, n: dish.lookalike, against: ask.sugar > 0 ? "sugar" : "no-sugar" });
  const lost = dish.firstWrong.length || dish.capped ? ["sugar", "spice"] : [];
  return { rows, extra, lost };
}

/** Which of the card's rows are done, for the ticks. A closed card ticks every row. */
export function ticks(dish, ctx) {
  const ask = ctx.ask;
  const all = dish.closed;
  return {
    water: all || !!dish.water,
    leaves: all || !!dish.leaves,
    spice: all || (!!ask.spice && dish.spices.includes(ask.spice)),
    milk: all || !!dish.milk,
    sugar: all || (ask.sugar > 0 && dish.sugar === ask.sugar),
    amount: all,
    "no-milk": all,
    "no-sugar": all,
  };
}

/** What the child has counted into this pan, in the order first counted: the count pills. */
export function counts(dish) {
  const out = [];
  for (const id of dish.spoons) {
    const c = out.find((x) => x.item === id);
    if (c) c.n += 1;
    else out.push({ item: id, n: 1 });
  }
  return out;
}

/** The dish exactly as its person asked for it, made and poured: what the child is shown after three wrong tries. */
export function asAsked(ctx) {
  const ask = ctx.ask;
  const spoons = Array(ask.sugar).fill(ctx.words.sugar).concat(ask.spice || []);
  return { ...newDish(), water: 1, leaves: 1, milk: ask.milk ? 1 : 0, sugar: ask.sugar, spices: ask.spice ? [ask.spice] : [], spoons, poured: ask.amount === ctx.words.half ? 1 : 2, closed: true };
}

/** The finished dish as its person gets it, for the serve. */
export const servedLook = (dish) => ({ look: dish.milk ? "milky" : "black", amount: dish.poured });

/**
 * What the pan looks like now: one stage, or one fading into the next as the heat climbs. The drawing file draws
 * exactly this; it decides nothing. heat: { fire, heat, lo, hi, boilAt }.
 *   -> { a, b, u, wet, spoons, sink }     a, b: stage names; u: how far b has come in over a (0 to 1)
 */
export function look(dish, heat) {
  const calm = dish.milk ? "milky" : "tea";
  const boil = dish.milk ? "boil-milky" : "boil-tea";
  const wet = !!(dish.water || dish.milk);
  const done = { a: "empty", b: null, u: 0, wet: false, spoons: [], sink: 1 };
  if (dish.poured >= 2 || !wet) return done;
  const heating = heat.fire === "heating";
  // spoonfuls lie on the surface until the boil takes them
  const sink = heat.fire === "ready" || heat.fire === "over" ? 1 : heating && heat.heat > heat.boilAt ? Math.min(1, (heat.heat - heat.boilAt) / (heat.lo - heat.boilAt)) : 0;
  const out = (a, b = null, u = 0) => ({ a, b, u, wet, spoons: dish.spoons.slice(), sink });
  if (!dish.leaves) return dish.milk ? out("water", "milky", 0.5) : out("water");
  if (heat.fire === "over") return dish.milk ? out("boil-milky", "foam", 1) : out(calm, "boil-tea", 1);
  if (heat.fire === "ready" || heat.fire === "spent") return out(calm);
  if (!heating || heat.heat < heat.boilAt) return dish.milk ? out(calm) : out("leaves", "tea", heating ? heat.heat / heat.boilAt : 0);
  if (!dish.milk || heat.heat <= heat.hi) return out(calm, boil, Math.min(1, (heat.heat - heat.boilAt) / (heat.lo - heat.boilAt)));
  return out("boil-milky", "foam", (heat.heat - heat.hi) / (1 - heat.hi));
}

/** The glass as it rests (null: still empty), and the frames of a pour: which state of which piece, for the serving spot to draw. */
export function glass(dish, art, rest) {
  if (!dish.poured) return null;
  return `${art.filling[dish.milk ? "milky" : "black"].replace("#*", "")}#${rest[dish.poured]}`;
}
export const pourFrames = (from, to, rest) => [from ? rest[from] : 1, rest[to]];
export const glassFrame = (art, set, n) => `${art.filling[set].replace("#*", "")}#${n}`;

/** The spoon a thing travels on, by what kind of thing it is. */
export const spoonArt = (kind, settings) => settings.art.spoon[settings.row.spoon[kind] || settings.row.spoon.other];

/**
 * This order's pictures: the empty pan its vessels are drawn with, then the rest, the pours of the teas asked for first
 * (a pan made without its milk pours black, so both teas' pours come, the one asked for ahead).
 */
export function artList(art, asks) {
  const teas = [...new Set(asks.map((a) => (a.milk ? "milky" : "black")).concat("milky", "black"))];
  return {
    draw: [art.pan.empty],
    then: [].concat(Object.values(art.pan), Object.values(art.over), Object.values(art.spoon), teas.flatMap((t) => [art.emptying[t], art.filling[t]])),
  };
}

/** A word-moment card's picture: the word shown as a glass of chai. */
export const wordMomentArt = (word, art) => art.amountCard[word].milky;

/** A card's picture where the word has none of its own: the amount, shown as a glass of what this person drinks. */
export function cardArt(item, ask, art) {
  const set = ask.milk ? "milky" : "black";
  if (item === "dish") return art.dishCard[set];
  return art.amountCard[item.word] ? art.amountCard[item.word][set] : null;
}
