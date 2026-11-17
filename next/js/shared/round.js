/*
 * The round as data, built once before the first scene: the level, who is at the counter, and the order. An order is
 * data about people as well as food: who spoke, who each dish is for, gender, elder or child, the number, a "no".
 * Everything here is pure: chance comes from the round's seed, so the same seed gives the same round.
 *
 *   chanceFrom(holder) -> () => number in [0, 1)        holder: { seed, drawn }; each draw moves `drawn` on
 *   newRound({ game, settings, people, level, seed, player, ladder, met, today, best, earned, card }) -> round      today: the day, as text (a greeting is due on the day's first meeting)
 *       settings.order: who orders and what each can ask for, by level (the game's settings file)
 *       people: the family, by id (data/people.json)
 *       ladder: the child's word ladder as the round starts, { wordId: stage }
 *       card(asks, { level, words }) -> { headline, items }   the game's own rule for turning asks into a card
 */

export function chanceFrom(holder) {
  return function chance() {
    holder.drawn = (holder.drawn || 0) + 1;
    const a = ((holder.seed >>> 0) + Math.imul(holder.drawn, 0x6d2b79f5)) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A level's entry in a by-level list: the last entry stands for every later level. */
export const atLevel = (list, level) => (Array.isArray(list) && list.length ? list[Math.min(level, list.length) - 1] : undefined);

function shuffle(list, chance) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(chance() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One ask for one person: their usual, as often as the settings say; otherwise drawn from what the level allows. */
function drawAsk(ask, level, usual, chance) {
  const rule = atLevel(ask.byLevel, level);
  if (rule == null) return ask.kind === "yesno" ? false : ask.kind === "count" ? 0 : null;
  if (rule.usualChance && usual !== undefined && chance() < rule.usualChance) return usual;
  if (ask.kind === "yesno") return chance() < rule.chance;
  if (ask.kind === "count") {
    const [lo, hi] = rule.range;
    const n = lo + Math.floor(chance() * (hi - lo + 1));
    return rule.none && chance() < rule.none ? 0 : n;
  }
  if (ask.kind === "pick") return rule.pick[Math.floor(chance() * rule.pick.length)];
  throw new Error(`round: unknown kind of ask "${ask.kind}"`);
}

/** While the words of an ask are still new to the child, the first people ask for them in a set order, so both are heard. */
function taught(ask, level, seat, ladder) {
  const rule = atLevel(ask.byLevel, level);
  const t = rule && rule.teach;
  if (!t || seat >= t.seats.length) return undefined;
  const isNew = t.words.some((w) => (ladder[w] || 0) <= t.newUntilStage);
  return isNew ? t.seats[seat] : undefined;
}

export function newRound({ game, settings, people, level, seed, player = {}, ladder = {}, met = {}, today = null, best = {}, earned = {}, card }) {
  const o = settings.order;
  if (!["each", "nani"].includes(o.speaker)) throw new Error(`round: order.speaker "${o.speaker}" is not a way of speaking the order`);
  const round = { game, level, seed: seed >>> 0, drawn: 0, player: { gender: player.gender || null }, ladder: { ...ladder }, met: { ...met }, today };
  round.earned = { ...earned }; // the words whose shelf pill is the speaker alone
  round.best = best[`${game}:${level}`] || null; // the best time so far at this level
  // a greeting is due on the first meeting of the day
  round.greeting = !!settings.greeting && !!today && met.greetedOn !== today;
  const chance = chanceFrom(round);
  const count = atLevel(o.people.countByLevel, level);
  const who = o.people.first.concat(shuffle(o.people.others, chance)).slice(0, count);
  const spots = o.people.spots[String(who.length)];
  round.people = who.map((id, i) => {
    const p = people[id];
    if (!p) throw new Error(`round: nobody called "${id}" in the family`);
    return { id, name: p.name, gender: p.gender, elder: !!p.elder, spot: spots[i] };
  });
  round.order = {
    speaker: o.speaker,
    dish: o.dish,
    for: round.people.map((p, seat) => {
      const usual = (o.usual && o.usual[p.id]) || {};
      const asks = {};
      for (const ask of o.asks) {
        const t = taught(ask, level, seat, round.ladder);
        asks[ask.id] = t !== undefined ? t : drawAsk(ask, level, usual[ask.id], chance);
      }
      const c = card(asks, { level, words: settings.words });
      return { who: p.id, spokenBy: o.speaker === "each" ? p.id : "nani", asks, headline: c.headline, items: c.items, dishCard: c.dishCard || null };
    }),
  };
  return round;
}
