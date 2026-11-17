/*
 * A scene's rules as a table of named states. This helper keeps no state of its own: it turns the table into the pure
 * function every rules file exports, "state and a move in, new state and events out".
 *
 *   const move = machine({
 *     states: { waiting: { tap: (state, mv, ctx) => ({ state: {...state, name: "done"}, events: [...] }) }, done: {} },
 *     any: { time: (state, mv, ctx) => ... },      // moves allowed in every state
 *   });
 *   move(state, { type: "tap" }, ctx) -> { state, events }
 *
 * A move with no entry for the state now is refused: the state comes back unchanged with one "refused" event, so a
 * view can wiggle the thing and a robot can count it.
 */
export function machine({ states, any = {} }) {
  const names = Object.keys(states);
  return function move(state, mv, ctx = {}) {
    if (!state || !names.includes(state.name)) throw new Error(`machine: unknown state "${state && state.name}" (known: ${names.join(", ")})`);
    if (!mv || typeof mv.type !== "string") throw new Error("machine: a move needs a type");
    const handler = states[state.name][mv.type] || any[mv.type];
    if (!handler) return { state, events: [{ type: "refused", move: mv, in: state.name }] };
    const out = handler(state, mv, ctx) || {};
    const next = out.state || state;
    if (!names.includes(next.name)) throw new Error(`machine: "${state.name}" moved to unknown state "${next.name}"`);
    return { state: next, events: out.events || [] };
  };
}

/** The named states of a table, for the checks. */
export const stateNames = (table) => Object.keys(table.states);
