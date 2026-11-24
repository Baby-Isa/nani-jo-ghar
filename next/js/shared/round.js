/*
 * The round as data, built once before the first scene: the level, who is at the counter, and the order. An order is
 * data about people as well as food: who spoke, who each dish is for, gender, elder or child, the number, a "no".
 * Everything here is pure: chance comes from the round's seed, so the same seed gives the same round.
 *
 *   chanceFrom(holder) -> () => number in [0, 1)        holder: { seed, drawn }; each draw moves `drawn` on
 *   levelsOf(kit) -> how many levels there are       atLevel(list, level) -> a level's entry
 *   pictureHidden(kit, round, word) -> whether a word's card blurs its picture this round
 *   newRound({ game, settings, people, level, seed, player, ladder, met, today, best, earned, tried, card }) -> round      today: the day, as text (a greeting is due on the day's first meeting)
 *       settings.order: who orders and what each can ask for, by level (the game's settings file)
 *       people: the family, by id (data/people.json)
 *       ladder: the child's word ladder as the round starts, { wordId: stage }
 *       earned, tried: the words whose shelf pill is earned, and those picked right at least once, { wordId: true }
 *       card(asks, { level, words }) -> { headline, items, dishCard?, dishWord? }   the game's own rule for turning asks into a
 *       card; dishCard: the dish's own card as a meaning, dishWord: the word it is (said in the headline)
 *   round.touches: the kit's ledger of touches (./kit/touches.rules.js), empty as the round starts, filled by the scenes
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

/** How many levels there are: the kit's one count (check step 1 holds every by-level list to it). */
export const levelsOf = (kit) => kit.levels.count;

/** A level's entry in a by-level list: the last entry stands for every later level. */
export const atLevel = (list, level) => (Array.isArray(list) && list.length ? list[Math.min(level, list.length) - 1] : undefined);

/** The level hides a card's picture only for a word the child has earned (its shelf pill the speaker alone). */
export const pictureHidden = (kit, round, word) => !atLevel(kit.levels.cardPicture, round.level) && !!round.earned[word];

function shuffle(list, chance) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(chance() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One ask for one person, drawn from what the level allows: no person has a usual order (Zafar, 24 Nov). */
function drawAsk(ask, level, chance) {
  const rule = atLevel(ask.byLevel, level);
  if (rule == null) return ask.kind === "yesno" ? false : ask.kind === "count" ? 0 : null;
  if (ask.kind === "yesno") return chance() < rule.chance;
  if (ask.kind === "count") {
    const [lo, hi] = rule.range;
    const n = lo + Math.floor(chance() * (hi - lo + 1));
    return rule.none && chance() < rule.none ? 0 : n;
  }
  if (ask.kind === "pick") return rule.pick[Math.floor(chance() * rule.pick.length)];
  throw new Error(`round: unknown kind of ask "${ask.kind}"`);
}

/**
 * While the words of an ask are still new to the child, each of them is asked for by one person, so all are heard; who
 * asks for which is drawn at random each round (Zafar, 24 Nov: not always the first seat). -> { [seat]: word }, empty
 * when nothing is taught; the others draw their ask as usual. Drawn only where a word is taught, so a round that teaches
 * nothing spends none of its chance on it.
 */
function taught(ask, level, seats, ladder, chance) {
  const rule = atLevel(ask.byLevel, level);
  const t = rule && rule.teach;
  if (!t || !t.words.some((w) => (ladder[w] || 0) <= t.newUntilStage)) return {};
  const who = shuffle([...Array(seats).keys()], chance);
  return Object.fromEntries(t.words.slice(0, seats).map((word, i) => [who[i], word]));
}

export function newRound({ game, settings, people, level, seed, player = {}, ladder = {}, met = {}, today = null, best = {}, earned = {}, tried = {}, card }) {
  const o = settings.order;
  if (!["each", "nani"].includes(o.speaker)) throw new Error(`round: order.speaker "${o.speaker}" is not a way of speaking the order`);
  const round = { game, level, seed: seed >>> 0, drawn: 0, player: { gender: player.gender || null }, ladder: { ...ladder }, met: { ...met }, today, touches: [] };
  round.earned = { ...earned }; // the words whose shelf pill is the speaker alone
  round.tried = { ...tried };
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
  const teach = Object.fromEntries(o.asks.map((ask) => [ask.id, taught(ask, level, round.people.length, round.ladder, chance)]));
  round.order = {
    speaker: o.speaker,
    dish: o.dish,
    for: round.people.map((p, seat) => {
      const asks = {};
      for (const ask of o.asks) {
        const t = teach[ask.id][seat];
        asks[ask.id] = t !== undefined ? t : drawAsk(ask, level, chance);
      }
      const c = card(asks, { level, words: settings.words });
      return { who: p.id, spokenBy: o.speaker === "each" ? p.id : "nani", asks, headline: c.headline, items: c.items, dishCard: c.dishCard || null, dishWord: c.dishWord || null };
    }),
  };
  return round;
}
