/*
 * Stuck help, with no screen. After the first time an action is shown, Nani's voice alone tells the step; help comes
 * only when the child has done nothing for the level's wait, counted from the later of the step opening and the last
 * move. It comes once a step and stays until the step is done. Pure: the help state in, the new state and events out.
 *
 *   newHelp() -> help         help: { idle, hints, given }
 *   acted(help) -> help                       a right move: the clock starts again
 *   stepped(help) -> help                     a new step opened: its help has not been given yet
 *   rush(help) -> { help, events }            the child tried the wrong place: help comes now, not after the wait
 *   pass(help, ms, waitMs) -> { help, events }    time passing; waitMs 0 means this step is never helped
 */
export const newHelp = () => ({ idle: 0, hints: 0, given: false });

export const acted = (h) => ({ ...h, idle: 0 });

export const stepped = (h) => ({ ...h, idle: 0, given: false });

export function rush(h) {
  if (h.given) return { help: h, events: [] };
  return { help: { ...h, idle: 0, given: true, hints: h.hints + 1 }, events: [{ type: "help", why: "wrong-place" }] };
}

export function pass(h, ms, waitMs) {
  const idle = h.idle + ms;
  if (h.given || !waitMs || idle < waitMs) return { help: { ...h, idle }, events: [] };
  return { help: { ...h, idle, given: true, hints: h.hints + 1 }, events: [{ type: "help", why: "stuck" }] };
}
