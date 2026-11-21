/*
 * The game's rules, with no screen: what a person's card holds, what may go into a pan, the pour, and whether a glass
 * is what its person asked for. Pure functions: a pan's state and a move in, the new state and events out.
 * Every word id and number comes in through `ctx` from the settings file; none is written here.
 *
 *   context(settings, { ask, level }) -> ctx    everything below reads the settings only through this
 *   ctx: { ask, words, level, halves, rest, foamShare }       ask: one person's { milk, sugar, spice, named, amount }
 *       halves: the pours a glass takes to be full (half is one); rest: the pour's frame each number of halves poured
 *       rests on; foamShare: past the green, the share of milky chai's rise that foams before it spills
 *   card(ask, { words }) -> { headline, items, dishCard, dishWord }   the person's order card, as meanings and rows
 *   newDish() -> dish
 *   wrongNow(dish, item, ctx), howMany(dish, item, ctx)   is this thing wrong now for this pan; how many of it are in (the
 *       level's rule for mistakes is the kit's, js/shared/kit/mistakes.rules.js, and the kitchen applies it)
 *   use(dish, item, ctx) -> { dish, events }                        a thing from the bottom row, for this pan
 *   takeBack(dish, item, ctx) -> { dish, events }                   one spoonful out again
 *   take(dish, ctx) -> { dish, events, left }                       the pan is ready and is tapped: it pours
 *   setAside(dish, ctx) -> dish                                     the child moves to another pan
 *   next(dish, ctx) -> { use: item } | { fire: true } | { take: true } | null     the next right move
 *   reset() -> dish                                                 this pan starts again
 *   asAsked(ctx) -> dish                                            the dish as asked, shown after three wrong tries
 *   look(dish, heat, ctx) -> what the pan looks like     glass(dish, art, rest), pourFrames, glassFrame -> the glass's pictures
 *   cardArt, wordMomentArt, spoonArt -> which of the game's pictures a card or a spoon shows
 *   artList(art, asks) -> { draw, then }   this order's pictures: what a vessel is drawn with, then what its moves show
 *   served(dish, ctx), close(dish), needs(dish, ctx), ticks(dish, ctx), counts(dish)
 *   tally(dish, ctx) -> { rows: { [rowId]: { want, got } }, extra: [{ word, n, against }], lost: [rowId] }   the dish counted
 *       against its card (whether it is right is the kit's, from this)
 *   made(dish, ctx) -> [{ row, word, n, meaning }]   the dish as made, as cards (the wrong-order card shows them)
 *   thing(word, n, ctx) -> meaning                   n of a thing as a card says it
 */

/** What the rules need from the game's settings for one person's dish. */
export const context = (settings, { ask, level }) => ({ ask, level, words: { ...settings.words, lookalike: settings.row.lookalike }, halves: settings.serving.halves, rest: settings.serving.rest, foamShare: settings.heat.foamShare });

/** Which tea a dish (or an ask) is: "milky" or "black", the name its pour, glass and card pictures go by. */
const teaOf = (x) => (x.milk ? "milky" : "black");

export const newDish = () => ({ water: 0, leaves: 0, milk: 0, sugar: 0, lookalike: 0, spices: [], spoons: [], poured: 0, closed: false, empty: false, firstWrong: [] });
export const reset = newDish;

/** How many pours the glass takes to hold what was asked: half is one, full is two; where no amount is asked one tap fills it. */
const poursAsked = (ctx) => (ctx.ask.amount === ctx.words.half ? 1 : ctx.halves);
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
  return { headline, items, dishCard: { fn: "Item", kind: w.dish, n: 1 }, dishWord: w.dish };
}

const refuse = (dish, item, why) => ({ dish, events: [{ type: "refused", item, why }] });

/**
 * Is this thing, now, a wrong thing or a wrong amount for this person: not asked for (an unasked spice, the lookalike,
 * milk or sugar asked as "no"), or one more of a counted thing than was asked.
 */
export function wrongNow(dish, item, ctx) {
  const kind = kindOf(item, ctx);
  const ask = ctx.ask;
  if (kind === "milk") return !ask.milk;
  if (kind === "sugar") return dish.sugar >= ask.sugar;
  if (kind === "lookalike") return true;
  if (kind === "spice") return item !== ask.spice || dish.spices.includes(item);
  return false;
}

/** How many of this thing are in the pan now. */
export function howMany(dish, item, ctx) {
  const kind = kindOf(item, ctx);
  if (kind === "water" || kind === "milk" || kind === "leaves") return dish[kind];
  return dish.spoons.filter((x) => x === item).length;
}

/**
 * A thing from the bottom row goes into this pan, until it has poured. Whether it may (the level's rule for mistakes, how
 * many of one) is the kitchen's to ask first, from wrongNow and howMany.
 */
export function use(dish, item, ctx) {
  const kind = kindOf(item, ctx);
  if (dish.poured > 0) return refuse(dish, item, "poured");
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

/**
 * The chosen ready pan is tapped: it pours into its person's glass, a half at a time where an amount is asked, else the
 * whole glass. Until the glass is full or closed it takes another pour, whatever was asked (a pour more than asked is a
 * mistake the review catches; refusing it would tell the amount). `left` says whether the pan still holds some.
 */
export function take(dish, ctx) {
  const full = ctx.halves;
  if (dish.closed || dish.poured >= full) return { dish, events: [{ type: "refused", why: "closed" }], left: dish.poured < full };
  const from = dish.poured;
  const to = ctx.ask.amount ? dish.poured + 1 : full;
  // (the pan holds a full glass: once that is poured it is empty)
  const d = { ...dish, poured: to, closed: to >= full, empty: to >= full };
  const events = [{ type: "pour", from, to, look: teaOf(dish), last: to >= full }];
  if (d.closed) events.push({ type: "closed" });
  return { dish: d, events, left: to < full };
}

/**
 * The child turns to another pan. A glass that holds what was asked is then final: left at a half asked for, it closes
 * (the kitchen shows it closing); a glass that still needs more stays open, to be come back to and topped up.
 */
export const setAside = (dish, ctx) => (dish.poured > 0 && !dish.closed && dish.poured >= poursAsked(ctx) ? { ...dish, closed: true } : dish);

export const served = (dish, ctx) => dish.poured > 0 && (dish.closed || dish.poured >= poursAsked(ctx));

/** Closed as it is: every glass is final when the dishes are looked at. */
export const close = (dish) => (dish.poured > 0 && !dish.closed ? { ...dish, closed: true } : dish);

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
  const lost = dish.firstWrong.length ? ["sugar", "spice"] : [];
  return { rows, extra, lost };
}

/**
 * n of a thing as a card says it: an amount by its word; a pour or the tea by the thing alone; a thing counted by the
 * spoonful with its count (one sugar as the order card asks it, one spice by its name alone, as the card asks it).
 */
export function thing(word, n, ctx) {
  const w = ctx.words;
  if (word === w.half || word === w.full) return { fn: "Amt", x: word };
  const alone = word === w.water || word === w.milk || word === w.leaves || (n === 1 && word !== w.sugar);
  return alone ? { fn: "Item", kind: word } : { fn: "Item", kind: word, n };
}

/**
 * The dish as made, as cards: each thing that went in once (a count as one card), with the row of its person's card it
 * answers (null where nobody asked for it), in the card's order, what nobody asked for last; the amount is what was poured.
 */
export function made(dish, ctx) {
  const { ask, words: w } = ctx;
  const spoonsOf = (id) => dish.spoons.filter((x) => x === id).length;
  const out = [];
  const add = (row, word, n) => n > 0 && out.push({ row, word, n, meaning: thing(word, n, ctx) });
  add("water", w.water, dish.water);
  add("leaves", w.leaves, dish.leaves);
  if (ask.spice) add("spice", ask.spice, spoonsOf(ask.spice));
  add(ask.milk ? "milk" : "no-milk", w.milk, dish.milk);
  add(ask.sugar > 0 ? "sugar" : "no-sugar", w.sugar, dish.sugar);
  if (ask.amount && dish.poured) add("amount", dish.poured >= ctx.halves ? w.full : w.half, 1);
  for (const id of new Set(dish.spoons)) if (id !== ask.spice && id !== w.sugar) add(null, id, spoonsOf(id));
  return out;
}

/**
 * Which of the card's rows are done, for the ticks: a row ticks the moment it holds what was asked, the amount too, as
 * any other thing (Zafar, 19 Nov: "I prefer the consistency with other items ... the half/whole should be the same"); a
 * wrong row is never ticked in play (a "no sugar" with sugar in, three sugars for one, a second half for a half); the
 * "no" rows as the glass holds what was asked.
 */
export function ticks(dish, ctx) {
  const ask = ctx.ask;
  const spoonsOf = (id) => dish.spoons.filter((x) => x === id).length;
  return {
    water: !!dish.water,
    leaves: !!dish.leaves,
    spice: !!ask.spice && spoonsOf(ask.spice) === 1,
    milk: !!dish.milk,
    sugar: ask.sugar > 0 && dish.sugar === ask.sugar,
    amount: dish.poured === poursAsked(ctx),
    "no-milk": served(dish, ctx) && !dish.milk,
    "no-sugar": served(dish, ctx) && dish.sugar === 0,
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
  return { ...newDish(), water: 1, leaves: 1, milk: ask.milk ? 1 : 0, sugar: ask.sugar, spices: ask.spice ? [ask.spice] : [], spoons, poured: poursAsked(ctx), closed: true, empty: poursAsked(ctx) >= ctx.halves };
}

/** The finished dish as its person gets it, for the serve. */
export const servedLook = (dish) => ({ look: teaOf(dish), amount: dish.poured });

/**
 * What the pan looks like now: one stage, or one fading into the next as the heat climbs. The drawing file draws
 * exactly this; it decides nothing. heat: { fire, heat, lo, hi, boilAt }.
 *   -> { a, b, u, wet, spoons, sink }     a, b: stage names; u: how far b has come in over a (0 to 1)
 */
export function look(dish, heat, ctx) {
  const calm = dish.milk ? "milky" : "tea";
  const boil = dish.milk ? "boil-milky" : "boil-tea";
  const wet = !!(dish.water || dish.milk);
  const done = { a: "empty", b: null, u: 0, wet: false, spoons: [], sink: 1 };
  if (dish.empty) return done;
  // poured but not empty (a half glass taken): the pan stays at what is left, the pour's frame a half glass rests on, until
  // it pours again from there (Zafar, 20 Nov: "At a half pour, yes, the pan stays at half left")
  if (dish.poured) return { ...done, a: "poured", set: teaOf(dish), frame: ctx.rest[dish.poured] };
  // (a spoonful in a dry pan lies on its floor)
  if (!wet) return { ...done, spoons: dish.spoons.slice(), sink: 0 };
  const heating = heat.fire === "heating";
  // spoonfuls lie on the surface until the boil takes them
  const sink = heat.fire === "ready" || heat.fire === "over" ? 1 : heating && heat.heat > heat.boilAt ? Math.min(1, (heat.heat - heat.boilAt) / (heat.lo - heat.boilAt)) : 0;
  const out = (a, b = null, u = 0) => ({ a, b, u, wet, spoons: dish.spoons.slice(), sink });
  if (!dish.leaves) return dish.milk ? out("water", "milky", 0.5) : out("water");
  // boiling over: the pan's own spilt picture, milky or black
  if (heat.fire === "over") return dish.milk ? out("foam", "over-milky", 1) : out("boil-tea", "over-black", 1);
  if (heat.fire === "ready" || heat.fire === "spent") return out(calm);
  if (!heating || heat.heat < heat.boilAt) return dish.milk ? out(calm) : out("leaves", "tea", heating ? heat.heat / heat.boilAt : 0);
  if (heat.heat <= heat.hi) return out(calm, boil, Math.min(1, (heat.heat - heat.boilAt) / (heat.lo - heat.boilAt)));
  // past the green it rises and starts to spill (Zafar, 19 Nov: the boil-over look from the green): black tea straight to its
  // spill, milky chai foaming up first, then spilling
  const past = (heat.heat - heat.hi) / (1 - heat.hi);
  if (!dish.milk) return out("boil-tea", "over-black", past);
  const f = ctx.foamShare;
  return past < f ? out("boil-milky", "foam", past / f) : out("foam", "over-milky", (past - f) / (1 - f));
}

/** The glass as it rests (null: still empty), and the frames of a pour: which state of which piece, for the serving spot to draw. */
export function glass(dish, art, rest) {
  if (!dish.poured) return null;
  return `${art.filling[teaOf(dish)].replace("#*", "")}#${rest[dish.poured]}`;
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
  const teas = [...new Set(asks.map(teaOf).concat("milky", "black"))];
  return {
    draw: [art.pan.empty],
    then: [].concat(Object.values(art.pan), Object.values(art.over), Object.values(art.spoon), Object.values(art.onSurface), teas.flatMap((t) => [art.emptying[t], art.filling[t]])),
  };
}

/** A word-moment card's picture: the word shown as a glass of chai. */
export const wordMomentArt = (word, art) => art.amountCard[word].milky;

/**
 * A card's picture where the word has none of its own: the amount, shown as a glass of what this person drinks; the dish's
 * own card, one plain glass of chai for every order, so it never gives away milk or none.
 */
export function cardArt(item, ask, art) {
  if (item === "dish") return art.dishCard;
  return art.amountCard[item.word] ? art.amountCard[item.word][teaOf(ask)] : null;
}
