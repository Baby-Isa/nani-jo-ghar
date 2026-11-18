/*
 * The cook scene's rules, with no screen. One vessel on the hob for each dish; one of them is the chosen one, and a
 * thing tapped on the bottom row goes to it. This file composes three sets of pure rules into one state: the heat rule
 * (this family's), the stuck-help clocks (the kit's) and the game's own rules, which it asks three questions:
 * what is the next right move, is this dish right, reset this dish. It ends itself when every dish holds what was asked.
 *
 *   cookRules({ game, settings, kitchen, kit }) -> { start, move, leave, stepOf, ctxOf }
 *   rowMayHold(settings, kit, level) -> every thing the row may hold (its pictures are named before the row is drawn)
 *   moves while cooking: item {id} | knob {vessel} | vessel {vessel} | face {vessel} | count {item} | time {ms}
 *   then: reviewed (the dishes have been looked at) and, for a wrong dish, understood (it is made again)
 *   events: step {step} as a step opens (Nani's line shows) | open {step, first?} at the step's moment: once what moves
 *   in the kitchen has ended and a breath has gone (step.wait), its first-time light (first) and its call (step.spoken)
 *
 * THE STEP'S MOMENT, as the old game has it (data/kitchen.json lights, from its rule table): the rules time every
 * movement they start (a pour, a spoonful, a serve), so they know when the kitchen is still, and work the moment out
 * again on every move (a movement started meanwhile pushes it back). At the moment a first-time
 * light is shown, and so spent (a step left before its moment keeps its light for the next time), and the stuck help's
 * wait starts again; the end of each movement restarts it too, as a tap does.
 */
import { machine } from "../shared/machine.js";
import { atLevel } from "../shared/round.js";
import { newFire, turn, pass, spend, zone, nearGreen } from "./heat.rules.js";
import { newHelp, acted, stepped, rush, pass as helpPass } from "../shared/kit/help.rules.js";

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);

/** Every thing a round's row may hold at a level: its fixed groups, the pool its asks and decoys are drawn from, the lookalike. */
const lookalikeAt = (settings, kit, level) => (atLevel(kit.levels.lookalike, level) ? [settings.row.lookalike] : []);
export const rowMayHold = (settings, kit, level) => settings.row.groups.flat().concat(settings.row.pool, lookalikeAt(settings, kit, level));

export function cookRules({ game, settings, kitchen, kit }) {
  const G = game.rules;
  const heatAt = (level) => ({ ...kitchen.heat, ...atLevel(settings.heat.byLevel, level) });
  const ctxOf = (s, v) => G.context(settings, { ask: s.vessels[v].ask, level: s.level });
  const L = kitchen.lights;
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
      const then = nx && nx.use ? { kind: "use", vessel: cold, item: nx.use, line: "use" } : nx && nx.fire ? { kind: "knob", vessel: cold, line: "light" } : null;
      // picking the next vessel shows what comes then in it (as the old game, data/kitchen.json lines), so her box never
      // keeps a step already done; the pick is due (lit, helped) only once no other dish is on the heat or waiting
      if (cold !== s.chosen) return { kind: "choose", vessel: cold, due: pickDue(s), then };
      if (then) return then;
    }
    return s.vessels.some((x) => x.fire.fire === "heating") ? { kind: "wait", line: null } : null;
  }
  const pickDue = (s) => !s.vessels.some((x, v) => x.fire.fire === "heating" || (x.fire.fire === "ready" && !G.served(x.dish, ctxOf(s, v))));
  /** Is the step now one that stuck help may come for? Never a timed control; never a word the child already knows. */
  function helped(s, round) {
    const st = s.step;
    if (!st || st.kind === "wait" || !st.line && st.kind !== "choose") return false;
    if (st.kind === "knob") return st.line === "light";
    if (st.kind === "choose") return st.due;
    if (st.kind === "use") {
      const always = settings.row.always.includes(st.item);
      return always || s.vessels[st.vessel].redone || (round.ladder[st.item] || 0) < kit.help.noHelpFromStage;
    }
    return true;
  }
  /** What a step would be lit as, the first time: each control once, each thing every dish needs once, and once the card of the first thing asked for. */
  function firstKey(step) {
    if (!step || step.kind === "wait" || !(step.line || step.kind === "choose")) return null;
    // the next vessel's first light comes only once it is due: after the first dish is poured
    if (step.kind === "choose") return step.due ? "choose" : null;
    if (step.kind === "use") return settings.row.always.includes(step.item) ? `use:${step.item}` : "card";
    return step.kind === "knob" ? `knob:${step.line}` : step.line;
  }
  const keyOf = (step) => (step ? [step.kind, step.vessel, step.item, step.line, step.due, step.then && keyOf(step.then)].join(":") : "");

  /**
   * The step's moment, by kind: which steps wait so (is), and when the moment comes (at), from the kitchen's stillness (the
   * end of the last movement) and the step's opening, never later than the most after it opened. The first that fits.
   */
  const WAITS = [
    // the card of the first thing asked for: once the kitchen has been still a moment, and never while the order list moves
    { wait: "card", is: (st, first) => st.kind === "use" && first === "card", at: (still, from) => Math.max(still + L.cardStillMs, from + kit.panel.settleMs), most: L.cardMaxMs },
    // a thing on the row, its first light, and a control's call: after a breath
    { wait: "breath", is: (st, first) => (st.kind === "use" && !!first) || (st.kind === "knob" && st.line === "light"), at: (still) => still + L.breathMs, most: L.breathMaxMs },
    // the next vessel's first light: a moment after the pour before it
    { wait: "next", is: (st, first) => st.kind === "choose" && st.due && !!first, at: (still) => still + L.nextAfterMs, most: L.nextAfterMs + L.breathMaxMs },
    // a pour, and the next vessel's help: the stillness
    { wait: "still", is: (st) => st.kind === "take" || (st.kind === "choose" && st.due), at: (still) => still, most: L.breathMaxMs },
    // anything else (the knob at the green, a thing on the row met before): at once
    { wait: "none", is: () => true, at: (still, from) => from, most: 0 },
  ];
  /** How a step opens: what its moment waits for (step.wait) and whether Nani calls it then (step.spoken). */
  const dressed = (step, first) => step && { ...step, wait: WAITS.find((w) => w.is(step, first)).wait, spoken: step.kind === "take" || (step.kind === "knob" && !!step.line) };
  /** When the step's moment comes, worked out afresh on every move (a movement started during the wait pushes it back). */
  function dueAt(s) {
    const { wait, from } = s.moment;
    const w = WAITS.find((x) => x.wait === wait);
    return Math.min(w.at(Math.max(from, s.stillAt, ...s.moves.map((m) => m.until)), from), from + w.most);
  }
  /** A step opens: its line shows now; its light and call wait for its moment. */
  function opening(s, step, events) {
    const key = firstKey(step);
    const first = key && !s.lit.includes(key) && !s.metLit.includes(key) ? key : null;
    const st = dressed(step, first);
    if (st) events.push({ type: "step", step: st });
    return { ...s, step: st, help: stepped(s.help), moment: st && st.kind !== "wait" ? { wait: st.wait, from: s.clock, first } : null };
  }
  /** The moment has come: the light is shown (and so spent), the call said, and the stuck help's wait starts again. */
  function opened(s, events) {
    if (!s.moment || s.clock < dueAt(s)) return s;
    const { first } = s.moment;
    events.push({ type: "open", step: s.step, first });
    return { ...s, moment: null, help: acted(s.help), lit: first && !s.lit.includes(first) ? s.lit.concat(first) : s.lit };
  }

  const setVessel = (s, v, patch) => ({ ...s, vessels: s.vessels.map((x, i) => (i === v ? { ...x, ...patch } : x)) });

  function choose(s, v, events) {
    if (v === s.chosen) return s;
    const from = s.chosen;
    events.push({ type: "chosen", vessel: v, from });
    return { ...setVessel(s, from, { dish: G.setAside(s.vessels[from].dish) }), chosen: v };
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
      const checks = next.vessels.map((x, v) => G.right(x.dish, ctxOf(next, v)));
      // a row that is wrong at any look stays "not right first time", however the dish ends
      const vessels = next.vessels.map((x, v) => ({ ...x, missed: [...new Set(x.missed.concat(Object.keys(checks[v].byRow).filter((r) => !checks[v].byRow[r])))] }));
      next = { ...next, vessels, name: "review", checks };
      events.push({ type: "review", checks });
    }
    return { state: next, events };
  }

  const move = machine({
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
          const went = out.events.find((e) => e.type === "in");
          let next = setVessel(s, v, { dish: out.dish });
          if (went) next = moving(next, how === "pour" ? pourMs : spoonMs, how === "pour");
          events.push(...out.events.map((e) => ({ ...e, vessel: v, how })));
          return settle(next, events, { rightMove: !!went });
        },
        knob(s, mv) {
          const v = mv.vessel;
          const x = s.vessels[v];
          const k = heatAt(s.level);
          const needs = G.needs(x.dish, ctxOf(s, v));
          const out = turn(x.fire, { canLight: !needs }, k);
          const events = [];
          let next = setVessel(s, v, { fire: out.fire });
          let rightMove = false;
          for (const e of out.events) {
            if (e.type === "cannot-light") events.push({ type: "wiggle", knob: v }, { type: "point", item: needs });
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
          let next = choose(s, v, events);
          const x = next.vessels[v];
          // nothing is taken before the green: a vessel that is not ready, or served, is only chosen; choosing another is a
          // move, so the stuck help's wait starts again (as the old game's pan tap)
          if (x.fire.fire !== "ready") return settle(next, events, { rightMove: v !== s.chosen });
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
          events.push({ type: "replay", vessel: mv.vessel, who: s.vessels[mv.vessel].who });
          return settle({ ...next, replays: (next.replays || 0) + 1 }, events);
        },
        // a look at a hidden part of a card: free, counted as help, never a right pick nor a miss
        peek: (s, mv) => ({ state: { ...s, peeks: (s.peeks || []).concat(mv.word) }, events: [] }),
        count(s, mv) {
          const v = s.chosen;
          const out = G.takeBack(s.vessels[v].dish, mv.item, ctxOf(s, v));
          if (out.events.some((e) => e.type === "refused")) return { state: s, events: [] };
          const next = moving(setVessel(s, v, { dish: out.dish }), settings.motion.takeBackMs, true);
          return settle(next, out.events.map((e) => ({ ...e, vessel: v })), { rightMove: true });
        },
        time(s, mv, { round }) {
          const k = heatAt(s.level);
          const clock = s.clock + mv.ms;
          const events = [];
          const vessels = s.vessels.map((x, v) => {
            const out = pass(x.fire, mv.ms, { hold: s.hold }, k);
            let dish = x.dish;
            for (const e of out.events) {
              if (e.type === "spoiled") dish = G.reset();
              events.push({ ...e, vessel: v });
            }
            return { ...x, fire: out.fire, dish };
          });
          // the end of a pour, a spoonful or a serve is a right move too: the stuck clock starts again, as in the old game
          const ended = s.moves.filter((m) => m.until <= clock);
          let next = { ...s, clock, moves: s.moves.filter((m) => m.until > clock), vessels, stillAt: Math.max(s.stillAt, ...ended.map((m) => m.until)) };
          if (ended.length) next = { ...next, help: acted(next.help) };
          // no stuck-help time passes while the step's moment is still to come (the moment starts its wait again)
          const h = helpPass(next.help, next.moment ? 0 : mv.ms, helped(next, round) ? atLevel(kit.levels.hintS, s.level) * 1000 : 0);
          next = { ...next, help: h.help };
          events.push(...h.events.map((e) => ({ ...e, step: next.step })));
          return settle(next, events);
        },
      },
      // every dish is looked at against what its person asked for; a wrong one is made again, and only that one
      review: {
        reviewed(s) {
          const wrong = s.checks.findIndex((c) => !c.right);
          if (wrong < 0) return { state: { ...s, name: "done" }, events: [{ type: "all-right" }] };
          const tries = s.vessels[wrong].tries + 1;
          return { state: { ...setVessel(s, wrong, { tries }), name: "wrong-order", wrong }, events: [{ type: "wrong-order", vessel: wrong, who: s.vessels[wrong].who, check: s.checks[wrong], showTheWay: tries >= kit.help.showTheWayAt }] };
        },
      },
      "wrong-order": {
        understood(s) {
          const v = s.wrong;
          // the third wrong try is shown the right way instead of being made again
          const shown = s.vessels[v].tries >= kit.help.showTheWayAt;
          let next = setVessel(s, v, shown ? { dish: G.asAsked(ctxOf(s, v)), shownTheWay: true } : { dish: G.reset(), fire: newFire(), redone: true });
          const checks = s.checks.map((c, i) => (i === v ? { ...c, right: true, redo: true } : c));
          const more = checks.findIndex((c) => !c.right);
          const events = [{ type: shown ? "shown-the-way" : "redo", vessel: v }];
          if (more >= 0) {
            const tries = next.vessels[more].tries + 1;
            return { state: { ...setVessel(next, more, { tries }), checks, wrong: more }, events: events.concat({ type: "wrong-order", vessel: more, who: s.vessels[more].who, check: checks[more], showTheWay: tries >= kit.help.showTheWayAt }) };
          }
          const redo = next.vessels.findIndex((x) => x.redone && x.fire.fire === "cold");
          if (redo < 0) return { state: { ...next, name: "done", checks }, events: events.concat({ type: "all-right" }) };
          next = { ...next, name: "cooking", chosen: redo, checks: null, wrong: null };
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
        row: rowFor(round, chance),
        lit: [],
        metLit: round.met.lit || [],
        vessels: round.order.for.map((p) => ({ who: p.who, ask: p.asks, fire: newFire(), dish: G.newDish(), tries: 0, missed: [] })),
        help: newHelp(),
        step: null,
        moment: null,
      };
      // (its first step's line shows as the scene is drawn; its moment comes with the scene's clock)
      return opening(s, stepOf(s), []);
    },
    move,
    stepOf,
    ctxOf,
    /** What the scene hands on: each dish as it was made, and whether it is right. */
    leave(round, s) {
      const dishes = s.vessels.map((x, v) => {
        const check = G.right(x.dish, ctxOf(s, v));
        const rowsRight = round.order.for[v].items.map((i) => !x.missed.includes(i.id) && !check.lostFirstTry.includes(i.id));
        return { who: x.who, dish: x.dish, check, tries: x.tries, rowsRight, look: G.servedLook(x.dish) };
      });
      return { ...round, dishes, cookMs: s.clock, peeks: (round.peeks || []).concat(s.peeks || []), hints: (round.hints || 0) + s.help.hints + (s.peeks || []).length + (s.replays || 0), met: { ...round.met, timed: round.met.timed || !s.hold, lit: [...new Set((round.met.lit || []).concat(s.lit))] } };
    },
  };
}
