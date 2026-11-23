/*
 * The cook scene's rules, with no screen. One vessel on the hob for each dish; one of them is the chosen one, and a
 * thing tapped on the bottom row goes to it. This file composes three sets of pure rules into one state: the heat rule
 * (this family's), the stuck-help clocks (the kit's) and the game's own rules, which it asks three questions:
 * what is the next right move, is this dish right, reset this dish. It ends itself when every dish holds what was asked.
 *
 *   cookRules({ game, settings, kitchen, kit }) -> { start, move, leave, stepOf, ctxOf }
 *   hiddenWord(step, hint) -> the thing whose word Nani's line shows as dots while her hint is shut, or null
 *   rowMayHold(settings, kit, level) -> every thing the row may hold (its pictures are named before the row is drawn)
 *   moves while cooking: item {id} | knob {vessel} | vessel {vessel} | face {vessel} | count {item} | time {ms} | hint
 *   (Nani's hint opened or shut: her helper card and the step's word; counted as help; opened on a word she hides, it is a
 *   peek at that word, so the word's ladder does not move this round)
 *   then: reviewed and, for wrong dishes, understood; wrong-order {right, wrong: [{vessel, who, faults, play}]},
 *   remake {vessels, away}: only those are made again, the rest leave the screen (state.away) until all-right
 *   state.vessels[v].ticked: that person's ticked rows in the order they were ticked (the order card's ticks)
 *   state.vessels[v].placed: the rows that keep their place in the order card's row: every row ticked since the dish began,
 *       ticked or not now, so the row never slides back to one; a dish started again starts its row again
 *   events: step {step} as a step opens (Nani's line shows) | open {step, first?} at the step's moment (./moment.rules.js)
 *   | light {first: "takeBack", vessel, item} (./moment.rules.js): the first time ever a spoonful thing goes past what was
 *   asked, its count pill is lit once, at the kitchen's next stillness, if its pill is shown then (pillHolds)
 */
import { machine } from "../shared/machine.js";
import { atLevel } from "../shared/round.js";
import { newFire, turn, pass, spend, zone, nearGreen } from "./heat.rules.js";
import { newHelp, acted, rush, pass as helpPass } from "../shared/kit/help.rules.js";
import { stepMoment } from "./moment.rules.js";
import { dishCheck, playOf } from "../shared/kit/wrong-order.rules.js";
import { ruling } from "../shared/kit/mistakes.rules.js";
import { labDishes, LAB_WRONG_ORDER } from "./lab.rules.js";

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
// what the child has met once a count pill has been lit as the way to take a spoonful out (kept with the other first-time lights)
const TAKE_BACK = "takeBack";

/** Every thing a round's row may hold at a level: its fixed groups, the pool its asks and decoys are drawn from, the lookalike. */
const lookalikeAt = (settings, kit, level) => (atLevel(kit.levels.lookalike, level) ? [settings.row.lookalike] : []);
export const rowMayHold = (settings, kit, level) => settings.row.groups.flat().concat(settings.row.pool, lookalikeAt(settings, kit, level));

export const hiddenWord = (step, hint = false) => {
  const st = step && step.kind === "choose" ? step.then : step;
  return st && st.hides && !hint ? st.item : null;
};

export function cookRules({ game, settings, kitchen, kit }) {
  const G = game.rules;
  const heatAt = (level) => ({ ...kitchen.heat, ...atLevel(settings.heat.byLevel, level) });
  const ctxOf = (s, v) => G.context(settings, { ask: s.vessels[v].ask, level: s.level });
  /** Is this dish what was asked, row by row: the kit's one answer, from the game's count of it against its card. */
  const checkOf = (s, v) => dishCheck(s.vessels[v].items, G.tally(s.vessels[v].dish, ctxOf(s, v)));
  /** Does this dish hold more of a spoonful thing than was asked, or one nobody asked for (what the count pill's light is for)? */
  const overIn = (s, v, item) => s.vessels[v].dish.spoons.includes(item) && checkOf(s, v).faults.some((f) => f.word === item && (f.kind === "many" || f.kind === "extra"));
  // every movement the rules start, with when it ends; one that blocks holds the next step back while it is in the air
  const busyNow = (s) => s.moves.some((m) => m.blocks);
  const moving = (s, ms, blocks) => ({ ...s, moves: s.moves.concat({ until: s.clock + ms, blocks }) });
  const pourMs = sum(settings.motion.row);
  const spoonMs = settings.motion.spoon.fly + settings.motion.spoon.stir;
  // a pour's length: the lift, the pour itself for each half poured, the way back and the settle
  const T = settings.motion.take;
  const takeMs = (halves) => T.lift + T.pour * halves + T.back + T.end;

  const askedOf = (round) => {
    const fixed = settings.row.groups.flat();
    return [...new Set(round.order.for.flatMap((p) => p.items.map((i) => i.word)).filter((w) => !fixed.includes(w) && settings.row.pool.includes(w)))];
  };

  /** The bottom row: the game's fixed groups, then what was asked for with the level's decoys among it, shuffled. */
  function rowFor(round, chance) {
    const asked = askedOf(round);
    const n = Math.max(1, Math.min(atLevel(kit.levels.decoys, round.level), settings.row.most - asked.length));
    const look = lookalikeAt(settings, kit, round.level);
    const pool = settings.row.pool.filter((id) => !asked.includes(id));
    const picked = [];
    while (picked.length < n - look.length && pool.length) picked.push(pool.splice(Math.floor(chance() * pool.length), 1)[0]);
    const last = asked.concat(look, picked);
    for (let i = last.length - 1; i > 0; i--) {
      const j = Math.floor(chance() * (i + 1));
      [last[i], last[j]] = [last[j], last[i]];
    }
    return settings.row.groups.concat([last]);
  }

  /** The step now: which thing is next, for Nani's line, the light and the help. */
  function stepOf(s) {
    const k = heatAt(s.level);
    for (let v = 0; v < s.vessels.length; v++) {
      const f = s.vessels[v].fire;
      if (nearGreen(f, k)) return { kind: "knob", vessel: v, line: zone(f, k) === "before" ? null : "turn-down" };
    }
    // while a pour is in the air (a bottle into the pan, the pan into its dish) the next step has not opened yet
    if (busyNow(s)) return { kind: "wait", line: null };
    for (let v = 0; v < s.vessels.length; v++) {
      const nx = s.vessels[v].fire.fire === "ready" ? G.next(s.vessels[v].dish, ctxOf(s, v), "ready") : null;
      if (nx && nx.take) return { kind: "take", vessel: v, line: nx.again ? "take-again" : "take" };
    }
    const cold = s.vessels.findIndex((x) => x.fire.fire === "cold");
    if (cold >= 0) {
      const nx = G.next(s.vessels[cold].dish, ctxOf(s, cold), "cold");
      const then = nx && nx.use ? useStep(s, cold, nx.use) : nx && nx.fire ? { kind: "knob", vessel: cold, line: "light" } : null;
      // picking the next vessel shows what comes then in it (as the old game, data/kitchen.json lines), so her box never
      // keeps a step already done; the pick is due (lit, helped) only once no other dish is on the heat or waiting
      if (cold !== s.chosen) return { kind: "choose", vessel: cold, due: pickDue(s), then };
      if (then) return then;
    }
    return s.vessels.some((x) => x.fire.fire === "heating") ? { kind: "wait", line: null } : null;
  }
  /**
   * A thing to put in. Past support, a word someone asked for is never written in Nani's line, so no step is won by reading
   * it (non-negotiable 3): it shows as dots until her hint opens (Zafar, 9 Nov: "where it says put the milk in, it should be
   * put the ... in. But ... if you click the down arrow and expand the hint ... show you what the item is"). Only the
   * child opens it: stuck help never comes for a word past support (helped, below), so waiting never names it, and
   * opening it is a peek at the word. Water and leaves are the steps themselves and stay named; a dish being made again is
   * study, so its words show (old js/shared/onboard.js:512-519 hintHides; old js/cook/station-lib.js:44 hideKnown).
   */
  const pastSupport = (s, v, item) => !settings.row.always.includes(item) && !s.vessels[v].redone && s.pastSupport.includes(item);
  const useStep = (s, v, item) => ({ kind: "use", vessel: v, item, line: "use", ...(pastSupport(s, v, item) ? { hides: true } : {}) });
  const pickDue = (s) => !s.vessels.some((x, v) => x.fire.fire === "heating" || (x.fire.fire === "ready" && !G.served(x.dish, ctxOf(s, v))));
  /** Is the step now one that stuck help may come for? Never a timed control; never a word past support. */
  function helped(s) {
    const st = s.step;
    if (!st || st.kind === "wait" || !st.line && st.kind !== "choose") return false;
    if (st.kind === "knob") return st.line === "light";
    if (st.kind === "choose") return st.due;
    if (st.kind === "use") return !pastSupport(s, st.vessel, st.item);
    return true;
  }
  /**
   * The count pill's light still has its place (the one test, asked by the step's moment just before the light is shown and
   * so spent): its pan chosen, as the pills shown are the chosen pan's; not boiling over, while the pills hide; and the extra
   * still in its dish, a tap on its pill able to take one out (never once the pan has poured, nor in a dish spoilt or made
   * again). If not, the light goes unshown and waits for the next time a child puts in too many.
   */
  const pillHolds = (s, { vessel: v, item }) =>
    v === s.chosen && s.vessels[v].fire.fire !== "over" && overIn(s, v, item) && !G.takeBack(s.vessels[v].dish, item, ctxOf(s, v)).events.some((e) => e.type === "refused");
  const moment = stepMoment({ settings, kit, kitchen, holds: { [TAKE_BACK]: pillHolds } });
  const { opened, keyOf } = moment;
  // every step opens with Nani's hint shut
  const opening = (s, step, events) => ({ ...moment.opening(s, step, events), hint: false });

  /**
   * Each person's ticked rows in the order they were ticked, kept after every move (the order card's row shows its ticked
   * cards so, and the robot plays the row's rule on the same list): a row ticked now joins the end, an unticked one leaves.
   */
  const ticking = (s) => ({
    ...s,
    vessels: s.vessels.map((x, v) => {
      const ctx = ctxOf(s, v);
      const t = G.ticks(x.dish, ctx);
      const kept = x.ticked.filter((id) => t[id]);
      const now = Object.keys(t).filter((id) => t[id] && !kept.includes(id));
      const ticked = kept.length === x.ticked.length && !now.length ? x.ticked : kept.concat(now);
      // where each card stands in the row: once ticked, a card keeps its place for the rest of the dish, ticked or not (too
      // many, or a spoonful taken out again), so the row never slides back to it (Zafar, 21 Nov: "it should untick but not
      // scroll back ... in this instance and almost ever"); a dish the kitchen starts again (spoilt, made again) starts its
      // row again where it is reset
      const placed = x.placed.concat(ticked.filter((id) => !x.placed.includes(id)));
      return ticked === x.ticked && placed.join() === x.placed.join() ? x : { ...x, ticked, placed };
    }),
  });
  const move = (s, mv, c) => {
    const out = play(s, mv, c);
    return { ...out, state: ticking(out.state) };
  };

  const setVessel = (s, v, patch) => ({ ...s, vessels: s.vessels.map((x, i) => (i === v ? { ...x, ...patch } : x)) });

  /**
   * Another vessel is chosen. The one left may close (a glass holding what was asked is final once left): it closes as
   * every glass does, seen and heard, never silently.
   */
  function choose(s, v, events) {
    if (v === s.chosen) return s;
    const from = s.chosen;
    events.push({ type: "chosen", vessel: v, from });
    const left = G.setAside(s.vessels[from].dish, ctxOf(s, from));
    if (left.closed && !s.vessels[from].dish.closed) events.push({ type: "closed", vessel: from });
    return { ...setVessel(s, from, { dish: left }), chosen: v };
  }

  /** After every move: the step may have changed, and the scene may be over. */
  function settle(s, events, { rightMove = false, wrongPlace = false } = {}) {
    let next = s;
    if (rightMove) next = { ...next, help: acted(next.help) };
    const step = stepOf(next);
    if (keyOf(step) !== keyOf(next.step)) next = opening(next, step, events);
    next = opened(next, events);
    if (wrongPlace && next.step) {
      const r = rush(next.help);
      next = { ...next, help: r.help };
      events.push(...r.events.map((e) => ({ ...e, step: next.step })));
    }
    if (!busyNow(next) && next.vessels.every((x, v) => G.served(x.dish, ctxOf(next, v)))) {
      // every glass is final as the dishes are looked at: one still open closes now, seen as every glass closes
      next.vessels.forEach((x, v) => !x.dish.closed && events.push({ type: "closed", vessel: v }));
      next = { ...next, vessels: next.vessels.map((x) => ({ ...x, dish: G.close(x.dish) })) };
      const checks = next.vessels.map((x, v) => checkOf(next, v));
      // a row that is wrong at any look stays "not right first time", however the dish ends
      const vessels = next.vessels.map((x, v) => ({ ...x, missed: [...new Set(x.missed.concat(Object.keys(checks[v].byRow).filter((r) => !checks[v].byRow[r])))] }));
      next = { ...next, vessels, name: "review", checks };
      events.push({ type: "review", checks });
    }
    return { state: next, events };
  }

  const play = machine({
    states: {
      cooking: {
        item(s, mv) {
          const v = s.chosen;
          const x = s.vessels[v];
          const events = [];
          const out = G.use(x.dish, mv.id, ctxOf(s, v));
          const refused = out.events.find((e) => e.type === "refused");
          if (x.fire.fire === "over" || (refused && refused.why === "poured")) {
            if (!busyNow(s)) events.push({ type: "wiggle", item: mv.id });
            // a thing tapped for a vessel that is already served: the child is shown where to go next
            return settle(s, events, { wrongPlace: x.fire.fire !== "over" });
          }
          const how = settings.row.how[mv.id] || settings.row.how.other;
          if (busyNow(s) && how === "pour") return { state: s, events: [] };
          if (refused) return settle(setVessel(s, v, { dish: out.dish }), [{ type: "wiggle", item: mv.id, why: refused.why }]);
          // the level's rule for mistakes, every game's (the kit's): a wrong thing or amount refused with the wiggle and
          // Nani's "no" where the level refuses it; a thing that has all it can take refused with the wiggle alone
          const ctx = ctxOf(s, v);
          const said = ruling({ kit, level: s.level, wrong: G.wrongNow(x.dish, mv.id, ctx), n: G.howMany(x.dish, mv.id, ctx), once: settings.row.once.includes(mv.id) });
          if (said === "full") return settle(s, [{ type: "wiggle", item: mv.id }]);
          if (said === "no") {
            // one more of an asked thing than was asked costs that row its first try (a thing nobody asked for costs none)
            const row = x.items.find((i) => i.word === mv.id && !i.no);
            const next = row && !x.missed.includes(row.id) ? setVessel(s, v, { missed: x.missed.concat(row.id) }) : s;
            // (said again only after a beat: a run of taps queues one "no", not one each)
            const again = s.clock - s.noAt >= kitchen.noEveryMs;
            return settle(again ? { ...next, noAt: s.clock } : next, [{ type: "wiggle", item: mv.id }].concat(again ? { type: "no" } : []));
          }
          const went = out.events.find((e) => e.type === "in");
          let next = setVessel(s, v, { dish: out.dish });
          if (went) next = moving(next, how === "pour" ? pourMs : spoonMs, how === "pour");
          events.push(...out.events.map((e) => ({ ...e, vessel: v, how })));
          // the first time ever a child puts in more of a spoonful thing than was asked, or one nobody asked for, its count
          // pill is lit once: a tap there takes one out (Zafar, 21 Nov: "nothing shows the pills can be tapped ... a short
          // first-time light on a pill the first time a child puts in too many")
          if (went && overIn(next, v, mv.id)) next = moment.asking(next, TAKE_BACK, { vessel: v, item: mv.id });
          return settle(next, events, { rightMove: !!went });
        },
        knob(s, mv) {
          const v = mv.vessel;
          const x = s.vessels[v];
          const k = heatAt(s.level);
          const needs = G.needs(x.dish, ctxOf(s, v));
          const out = turn(x.fire, { canLight: !needs.length }, k);
          const events = [];
          let next = setVessel(s, v, { fire: out.fire });
          let rightMove = false;
          for (const e of out.events) {
            // (not lit while a thing every dish needs is missing: each missing one shakes and glows on the shelf, at every level:
            // Zafar, 21 Nov, "it should shake the tea and the water, or whichever one of them is missing")
            // (each missing one shakes; only the next to put in glows, so the order of the steps still reads)
            if (e.type === "cannot-light") events.push({ type: "wiggle", knob: v }, ...needs.map((item) => ({ type: "wiggle", item })), { type: "point", item: needs[0] });
            else if (e.type === "lit") {
              next = choose(next, v, events);
              events.push({ type: "lit", vessel: v });
              rightMove = true;
            } else if (e.type === "not-yet") {
              events.push({ type: "wiggle", knob: v });
              if (s.clock - s.notYetAt >= kitchen.notYetEveryMs) {
                events.push({ type: "not-yet", vessel: v });
                next = { ...next, notYetAt: s.clock };
              }
            } else if (e.type === "turned-down") {
              events.push({ type: "turned-down", vessel: v, firstTime: s.hold });
              next = { ...next, hold: false };
              rightMove = true;
            } else if (e.type === "over") events.push({ type: "over", vessel: v });
          }
          return settle(next, events, { rightMove });
        },
        vessel(s, mv) {
          if (busyNow(s)) return { state: s, events: [] };
          const v = mv.vessel;
          const events = [];
          // a tap on a vessel (or its glass) not chosen only chooses it, ready or not: a second tap pours. Choosing another
          // is a move, so the stuck help's wait starts again (as the old game's pan tap)
          if (v !== s.chosen) return settle(choose(s, v, events), events, { rightMove: true });
          let next = s;
          const x = next.vessels[v];
          // nothing is taken before the green
          if (x.fire.fire !== "ready") return settle(next, events);
          const out = G.take(x.dish, ctxOf(next, v));
          if (out.events.some((e) => e.type === "refused")) return settle(next, events.concat({ type: "wiggle", vessel: v }));
          next = setVessel(next, v, { dish: out.dish, fire: out.left ? x.fire : spend(x.fire) });
          const poured = out.events.find((e) => e.type === "pour");
          next = moving(next, takeMs(poured.to - poured.from), true);
          events.push(...out.events.map((e) => ({ ...e, vessel: v, who: x.who })));
          return settle(next, events, { rightMove: true });
        },
        face(s, mv) {
          const events = [];
          const next = choose(s, mv.vessel, events);
          // at the levels the dish has its own card, it shows again as the order is said again (Zafar, 13 Nov)
          events.push({ type: "replay", vessel: mv.vessel, who: s.vessels[mv.vessel].who, dishCard: !!atLevel(kit.levels.dishCard, s.level) });
          return settle({ ...next, replays: (next.replays || 0) + 1 }, events);
        },
        // a look at a hidden part of a card: free, counted as help, never a right pick nor a miss
        peek: (s, mv) => ({ state: { ...s, peeks: (s.peeks || []).concat(mv.word) }, events: [] }),
        // her hint, opened on a word she hides, names it: a peek at it (counted there); opened on a named one, help alone
        hint(s) {
          if (!s.step || s.step.kind !== "use") return { state: s, events: [] };
          const open = !s.hint;
          const peeked = open && !!s.step.hides;
          const next = { ...s, hint: open, peeks: peeked ? (s.peeks || []).concat(s.step.item) : s.peeks, hintsOpened: (s.hintsOpened || 0) + (open && !peeked ? 1 : 0) };
          return { state: next, events: [{ type: "hint", open, step: s.step }] };
        },
        count(s, mv) {
          const v = s.chosen;
          const out = G.takeBack(s.vessels[v].dish, mv.item, ctxOf(s, v));
          if (out.events.some((e) => e.type === "refused")) return { state: s, events: [] };
          // (a spoonful taken out before its pill was lit: the child has found the pill alone, so the light it waited for is
          // not needed, even with too many still in)
          const next = moving(moment.drop(setVessel(s, v, { dish: out.dish }), TAKE_BACK), settings.motion.takeBackMs, true);
          return settle(next, out.events.map((e) => ({ ...e, vessel: v })), { rightMove: true });
        },
        time(s, mv) {
          const k = heatAt(s.level);
          const clock = s.clock + mv.ms;
          const events = [];
          const vessels = s.vessels.map((x, v) => {
            const out = pass(x.fire, mv.ms, { hold: s.hold }, k);
            let dish = x.dish;
            let placed = x.placed;
            for (const e of out.events) {
              // (a spoilt dish starts again, its row with it)
              if (e.type === "spoiled") (dish = G.reset()), (placed = []);
              events.push({ ...e, vessel: v });
            }
            return { ...x, fire: out.fire, dish, placed };
          });
          // the end of a pour, a spoonful or a serve is a right move too: the stuck clock starts again, as in the old game
          const ended = s.moves.filter((m) => m.until <= clock);
          let next = { ...s, clock, moves: s.moves.filter((m) => m.until > clock), vessels, stillAt: Math.max(s.stillAt, ...ended.map((m) => m.until)) };
          if (ended.length) next = { ...next, help: acted(next.help) };
          // the level's wait runs from the step's start, but its clock stands still while the step's moment (its first light)
          // is still to come, so help never lands on the moment the light shows
          const h = helpPass(next.help, next.moment ? 0 : mv.ms, helped(next) ? atLevel(kit.levels.hintS, s.level) * 1000 : 0);
          next = { ...next, help: h.help };
          events.push(...h.events.map((e) => ({ ...e, step: next.step })));
          return settle(next, events);
        },
      },
      // every dish is looked at against what its person asked for; the wrong ones are made again, and only they
      review: {
        reviewed(s) {
          const wrong = s.checks.map((c, v) => (c.right ? null : v)).filter((v) => v != null);
          if (!wrong.length) return { state: { ...s, name: "done", away: [] }, events: [{ type: "all-right" }] };
          let next = s;
          for (const v of wrong) next = setVessel(next, v, { tries: next.vessels[v].tries + 1 });
          // each wrong card's rows (right, missed, too few, too many or extra), and what it plays: the dish as made onto the
          // card until it is the order as asked
          const cards = wrong.map((v) => {
            const ctx = ctxOf(s, v);
            const play = playOf(s.vessels[v].items, s.checks[v].faults, G.made(s.vessels[v].dish, ctx));
            return { vessel: v, who: s.vessels[v].who, faults: s.checks[v].faults, play };
          });
          // the orders still on screen that are right go first; the ones already gone stay gone
          const right = s.checks.map((c, v) => v).filter((v) => s.checks[v].right && !s.away.includes(v));
          return { state: { ...next, name: "wrong-order", wrong }, events: [{ type: "wrong-order", right, wrong: cards }] };
        },
      },
      "wrong-order": {
        understood(s) {
          let next = s;
          // the third wrong try is shown the right way instead of being made again; otherwise the whole dish is remade
          const redo = s.wrong.filter((v) => s.vessels[v].tries < kit.help.showTheWayAt);
          for (const v of s.wrong) next = setVessel(next, v, redo.includes(v) ? { dish: G.reset(), fire: newFire(), redone: true, placed: [] } : { dish: G.asAsked(ctxOf(s, v)), shownTheWay: true });
          const events = s.wrong.map((v) => ({ type: redo.includes(v) ? "redo" : "shown-the-way", vessel: v }));
          if (!redo.length) return { state: { ...next, name: "done", checks: null, wrong: null, away: [] }, events: events.concat({ type: "all-right" }) };
          // only what is remade stays, its card at the top (Zafar, 11 Nov: "the correct tea glasses disappear, the correct order
          // cards disappear, and the people disappear, and you're just left with the person that got it wrong")
          const away = next.vessels.map((x, v) => v).filter((v) => !redo.includes(v));
          events.push({ type: "remake", vessels: redo, away });
          // the first pan made again is chosen, the leftmost, its card the first, and the screen is told, so the pan lit is
          // the pan a tap pours into (Zafar, 21 Nov: "You should only be able to pour into the highlighted pan ... it should
          // select the leftmost pan or the one where the order card is first"); the light moves only on this event
          if (redo[0] !== s.chosen) events.push({ type: "chosen", vessel: redo[0], from: s.chosen });
          next = { ...next, name: "cooking", chosen: redo[0], checks: null, wrong: null, away };
          next = opening(next, stepOf(next), events);
          return { state: next, events };
        },
      },
      done: {},
    },
  });

  return {
    states: ["cooking", "review", "wrong-order", "done"],
    start(round, chance) {
      const s = {
        name: "cooking",
        clock: 0,
        level: round.level,
        chosen: 0,
        hold: !!kitchen.heat.firstTimeHold && !round.met.timed,
        moves: [],
        stillAt: 0,
        notYetAt: -1e9,
        noAt: -1e9,
        row: rowFor(round, chance),
        lit: [],
        metLit: round.met.lit || [],
        aside: null,
        vessels: round.order.for.map((p) => ({ who: p.who, ask: p.asks, items: p.items, fire: newFire(), dish: G.newDish(), tries: 0, missed: [], ticked: [], placed: [] })),
        help: newHelp(),
        // the words asked for that the child's ladder has past support as the round starts
        pastSupport: [...new Set(round.order.for.flatMap((p) => p.items.filter((i) => i.said && !i.no).map((i) => i.word)))].filter((w) => (round.ladder[w] || 0) >= kit.help.pastSupportFrom),
        step: null,
        moment: null,
        away: [],
      };
      // the labs page's wrong order: every dish made and poured as the scene opens, the last pan chosen (as a child who
      // poured last there), so it opens on every glass closing, the dishes looked at and the pop-up (./lab.rules.js)
      if (round.lab === LAB_WRONG_ORDER) {
        const dishes = labDishes({ G, vessels: s.vessels, ctxOf: (v) => ctxOf(s, v), row: s.row });
        // (each pan poured, its fire spent, so no step opens: nothing is asked of the child before the review)
        const made = { ...s, chosen: s.vessels.length - 1, vessels: s.vessels.map((x, v) => ({ ...x, dish: dishes[v], fire: spend(x.fire) })) };
        const out = settle(ticking(made), []);
        return { ...out.state, opens: out.events };
      }
      // (its first step is told by first, as the scene is entered, so the step event opening makes here is not kept; its
      // moment comes with the scene's clock)
      return opening(s, stepOf(s), []);
    },
    // the scene opens with its first step, as every later step is told (the lab's with every glass closing and the review)
    first: (round, s) => (s.opens ? s.opens : s.step ? [{ type: "step", step: s.step }] : []),
    move,
    stepOf,
    ctxOf,
    /** What the scene hands on: each dish as it was made, and whether it is right. */
    leave(round, s) {
      const dishes = s.vessels.map((x, v) => {
        const check = checkOf(s, v);
        const rowsRight = round.order.for[v].items.map((i) => !x.missed.includes(i.id) && !check.lost.includes(i.id));
        return { who: x.who, dish: x.dish, check, tries: x.tries, rowsRight, look: G.servedLook(x.dish) };
      });
      return { ...round, dishes, cookMs: s.clock, peeks: (round.peeks || []).concat(s.peeks || []), hints: (round.hints || 0) + s.help.hints + (s.peeks || []).length + (s.replays || 0) + (s.hintsOpened || 0), met: { ...round.met, timed: round.met.timed || !s.hold, lit: [...new Set((round.met.lit || []).concat(s.lit))] } };
    },
  };
}
