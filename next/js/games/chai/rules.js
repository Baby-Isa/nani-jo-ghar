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
 *   right(dish, ctx) -> { right, rows, unasked, miss }              is this glass right
 *   reset() -> dish                                                 this pan starts again
 *   asAsked(ctx) -> dish                                            the dish as asked, shown after three wrong tries
 *   look(dish, heat) -> what the pan looks like     glass(dish, art, rest), pourFrames, glassFrame -> the glass's pictures
 *   cardArt, wordMomentArt, spoonArt, artList -> which of the game's pictures a card, a spoon or the loader needs
 *   served(dish, ctx), needs(dish, ctx), ticks(dish, ctx), counts(dish)
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
  if (ask.amount) items.push(row("amount", ask.amount, { fn: "Amt", x: ask.amount }));
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

/** The asked spice counts as known only when it was chosen: in the cup with nothing unasked beside it. */
export function spiceCheck(asked, spices) {
  const inCup = asked ? spices.includes(asked) : true;
  const unasked = spices.filter((id) => id !== asked);
  return { shown: inCup, right: inCup && !unasked.length, unasked, miss: unasked.length > 0 };
}

/** Is this glass what its person asked for? Row by row, for the card and for the word ladder. */
export function right(dish, ctx) {
  const ask = ctx.ask;
  const sp = spiceCheck(ask.spice, dish.spices);
  const rows = {
    made: !!(dish.water && dish.leaves && dish.poured > 0),
    milk: !!dish.milk === !!ask.milk,
    sugar: dish.sugar === ask.sugar && dish.lookalike === 0,
    spice: sp.shown,
    unasked: !sp.unasked.length,
    amount: !ask.amount || dish.poured === poursAsked(ctx),
  };
  // the same answer by the card's own rows, so the card can tick or cross each one
  const byRow = { water: !!dish.water, leaves: !!dish.leaves, spice: sp.right, milk: rows.milk, "no-milk": rows.milk, sugar: rows.sugar, "no-sugar": rows.sugar, amount: rows.amount };
  const firstTry = !dish.firstWrong.length && !dish.capped;
  // a wrong spoonful taken back still costs the counted rows their first try
  return { right: Object.values(rows).every(Boolean), rows, byRow, unasked: sp.unasked, spiceKnown: sp.right, miss: sp.miss, firstTry, lostFirstTry: firstTry ? [] : ["sugar", "spice"] };
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

/** Every picture the game needs before its scene is drawn. */
export const artList = (art) => [].concat(Object.values(art.pan), Object.values(art.over), Object.values(art.emptying), Object.values(art.filling), Object.values(art.spoon));

/** A word-moment card's picture: the word shown as a glass of chai. */
export const wordMomentArt = (word, art) => art.amountCard[word].milky;

/** A card's picture where the word has none of its own: the amount, shown as a glass of what this person drinks. */
export function cardArt(item, ask, art) {
  const set = ask.milk ? "milky" : "black";
  if (item === "dish") return art.dishCard[set];
  return art.amountCard[item.word] ? art.amountCard[item.word][set] : null;
}
