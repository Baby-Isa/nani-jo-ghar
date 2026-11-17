/*
 * The greeting's rules, with no screen. One person greets; the child answers from two choices offered alike, in one
 * voice and one look, so only the Kutchi tells them apart. A wrong answer costs nothing: the person asks again, and
 * after a couple of wrong tries the right one is lit. Nobody is made to wait: with no answer the person says it for
 * the child. The slot is filled only when the round says a greeting is due; otherwise the scene costs no time.
 *
 *   greetingRules({ settings, kit }) -> { start, move, leave }
 *   moves: answer {choice} | hear {what} | skip | time {ms}
 *   events: answered | wrong-answer {light} | modelled | hear
 */
import { machine } from "../machine.js";

export function greetingRules({ settings, kit }) {
  const g = settings.greeting || null;
  const K = kit.greeting;
  const modelled = (s) => ({ state: { ...s, name: "done", answered: false, skipped: true }, events: [{ type: "modelled", choice: s.right }] });
  const move = machine({
    states: {
      asking: {
        answer(s, mv) {
          if (mv.choice === s.right) return { state: { ...s, name: "done", answered: true }, events: [{ type: "answered", choice: mv.choice }] };
          const wrongs = s.wrongs + 1;
          return { state: { ...s, wrongs, idle: 0 }, events: [{ type: "wrong-answer", choice: mv.choice, wrongs, light: wrongs >= K.lightAfterWrongs }] };
        },
        time(s, mv) {
          const idle = s.idle + mv.ms;
          return idle < K.idleMs ? { state: { ...s, idle } } : modelled(s);
        },
        skip: modelled,
        hear: (s, mv) => ({ state: { ...s, idle: 0 }, events: [{ type: "hear", what: mv.what }] }),
      },
      done: {},
    },
  });
  return {
    states: ["asking", "done"],
    slots: ["greeting", "options", "goodbye"],
    start(round, chance) {
      if (!g || !round.greeting) return { name: "done" };
      const options = chance() < K.rightFirst ? [g.right, g.wrong] : [g.wrong, g.right];
      // the very first greeting a child meets shows the right answer lit from the start
      return { name: "asking", who: round.people[0].id, line: g.line, options, right: g.right, wrongs: 0, idle: 0, lit: !round.met.greeted };
    },
    move,
    leave: (round, s) => (s.who ? { ...round, met: { ...round.met, greeted: true, greetedOn: round.today || null } } : round),
  };
}
