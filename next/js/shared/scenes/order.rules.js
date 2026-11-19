/*
 * The order scene's rules, with no screen. Each person's order is said part by part: the headline, then each thing
 * asked for, the "no" things last. Nothing of an order shows before it is said: a card lands only as its part ends.
 * The slots are named so a game fills or leaves them: ask (the headline), items, check, question, options.
 * Pure: the view (or a robot) says when a part has been said; a tap on the kitchen skips to the end.
 *
 *   orderRules({ settings, kit }) -> { start, move, leave }
 *   moves: said | skip | repeat {who} | peek {word} | lessoned
 *   events: person {seat} | part {seat, part} | landed {seat, items} | skipped | folded
 */
import { machine } from "../machine.js";
import { atLevel, pictureHidden } from "../round.js";

const SPEAKERS = ["each", "nani"];
// what the child has met once the first-time lesson has played (progress keeps it)
const LESSON_MET = "revealCard";

/**
 * The parts one person's order is said in: the headline with the things it names, then each other thing said. A thing
 * the headline names that ticks only as its dish is served (a measure, half or full) lands with the last part, at the row's
 * end, so the row only ever moves forward as the order is said (Zafar, 18 Nov).
 */
export function partsOf(person) {
  const said = person.items.filter((i) => i.said);
  const late = said.filter((i) => i.inHeadline && i.atServe).map((i) => i.id);
  const head = { kind: "headline", line: person.headline, lands: said.filter((i) => i.inHeadline && !i.atServe).map((i) => i.id) };
  const parts = [head].concat(said.filter((i) => !i.inHeadline).map((i) => ({ kind: "item", item: i.id, lands: [i.id] })));
  const last = parts[parts.length - 1];
  parts[parts.length - 1] = { ...last, lands: last.lands.concat(late) };
  return parts;
}

export function orderRules({ settings, kit }) {
  const speaker = settings.order.speaker;
  if (!SPEAKERS.includes(speaker)) throw new Error(`order: "${speaker}" is not a way of speaking the order`);
  if (speaker !== "each") throw new Error(`order: speaking the order as "${speaker}" is not built yet`);

  const partEvent = (s, round) => {
    const person = round.order.for[s.seat];
    const part = partsOf(person)[s.part];
    return { type: "part", seat: s.seat, who: person.who, spokenBy: person.spokenBy, part, last: s.part === partsOf(person).length - 1, lesson: !!s.lesson && !s.lessoned && s.lesson.seat === s.seat && s.lesson.part === s.part ? LESSON_MET : null, dishCard: s.part === 0 && atLevel(kit.levels.dishCard, round.level) ? person.dishCard || true : null };
  };
  const unsaid = (person) => person.items.filter((i) => !i.said).map((i) => i.id);

  const move = machine({
    states: {
      saying: {
        said(s, mv, { round }) {
          const person = round.order.for[s.seat];
          const parts = partsOf(person);
          const events = [];
          const lands = parts[s.part].lands;
          if (lands.length) events.push({ type: "landed", seat: s.seat, items: lands });
          let next;
          if (s.part + 1 < parts.length) next = { ...s, part: s.part + 1 };
          else {
            // the things on the card that are never said land as the order moves on
            events.push({ type: "landed", seat: s.seat, items: unsaid(person), quiet: true });
            if (s.seat + 1 >= round.order.for.length) return { state: { ...s, name: "done" }, events: events.concat({ type: "folded" }) };
            next = { ...s, seat: s.seat + 1, part: 0 };
            events.push({ type: "person", seat: next.seat, who: round.order.for[next.seat].who });
          }
          return { state: next, events: events.concat(partEvent(next, round)) };
        },
        skip(s, mv, { round }) {
          // while the first-time lesson is due or up, a tap on the kitchen does not skip
          if (s.lesson && !s.lessoned) return { state: s, events: [] };
          return { state: { ...s, name: "done", skipped: true }, events: [{ type: "skipped" }, { type: "folded" }] };
        },
        // hearing a person again and a look at a hidden part are help: free, counted, never a verdict
        repeat(s, mv, { round }) {
          return { state: { ...s, repeats: s.repeats + 1 }, events: [{ type: "repeat", who: mv.who, dishCard: !!atLevel(kit.levels.dishCard, round.level) }] };
        },
        peek: (s, mv) => ({ state: { ...s, peeks: s.peeks.concat(mv.word) }, events: [] }),
        lessoned: (s) => ({ state: { ...s, lessoned: true }, events: [] }),
        time: (s) => ({ state: s }),
      },
      done: {},
    },
  });

  return {
    states: ["saying", "done"],
    slots: ["ask", "items", "check", "question", "options"],
    start(round) {
      if (!round.order.for.length) return { name: "done" };
      // the first-time lesson: once ever per child, on the first big card that really hides a part, just before it is seen.
      // A card hides its picture (it never hides its Kutchi: only Nani's line does); dotted English alone does not call it
      let lesson = null;
      round.order.for.forEach((person, seat) =>
        partsOf(person).forEach((x, part) => {
          const shows = x.lands[0] && person.items.find((i) => i.id === x.lands[0]);
          if (!lesson && !round.met[LESSON_MET] && shows && pictureHidden(kit, round, shows.word)) lesson = { seat, part };
        })
      );
      return { name: "saying", seat: 0, part: 0, skipped: false, lesson, lessoned: false, peeks: [], repeats: 0 };
    },
    /** The first thing to show: the runner has no events at a scene's start, so the view asks. */
    first: (round, s) => [{ type: "person", seat: 0, who: round.order.for[0].who }, partEvent(s, round)],
    move,
    leave: (round, s) => ({
      ...round,
      orderSkipped: !!s.skipped,
      peeks: (round.peeks || []).concat(s.peeks || []),
      hints: (round.hints || 0) + (s.peeks || []).length + (s.repeats || 0),
      met: s.lessoned ? { ...round.met, [LESSON_MET]: true } : round.met,
    }),
  };
}
