/*
 * The step's moment, with no screen, as the old game has it (data/kitchen.json lights, from its rule table): a step's line
 * shows as it opens; its first-time light and Nani's call wait for its moment, once what moves in the kitchen has ended
 * and a breath has gone. The cook rules time every movement they start (a pour, a spoonful, a serve), so they know when
 * the kitchen is still, and the moment is worked out again on every move (a movement started meanwhile pushes it back).
 * At the moment a first-time light is shown, and so spent (a step left before its moment keeps its light for the next
 * time). The stuck help's wait runs from the step's opening (Zafar, 19 Nov), its clock standing still until the moment, so
 * help never lands on a first light; the end of each movement restarts it, as a tap does.
 *
 *   stepMoment({ settings, kit, kitchen }) -> { opening(s, step, events) -> s, opened(s, events) -> s, keyOf(step) }
 *       keyOf: a step's identity (a step whose key changes has opened anew)
 *   events: step {step} as a step opens | open {step, first?} at its moment: its first-time light and its call (step.spoken)
 */
import { stepped } from "../shared/kit/help.rules.js";

export function stepMoment({ settings, kit, kitchen }) {
  const L = kitchen.lights;
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
  /** The moment has come: the light is shown (and so spent) and the call said; the stuck help's wait runs on. */
  function opened(s, events) {
    if (!s.moment || s.clock < dueAt(s)) return s;
    const { first } = s.moment;
    events.push({ type: "open", step: s.step, first });
    return { ...s, moment: null, lit: first && !s.lit.includes(first) ? s.lit.concat(first) : s.lit };
  }

  return { opening, opened, keyOf };
}
