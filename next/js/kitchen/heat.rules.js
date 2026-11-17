/*
 * The heat rule, with no screen. One fire under one vessel: it is lit, climbs to its green, and is turned down there.
 * Nothing is turned before the green (the knob only shakes and the clock runs on); past the green the dish spoils and
 * only that dish starts again. The time shows on the thing itself, so the numbers here are all the view needs.
 *
 * Pure: a fire's state and a move in, the new state and events out. Time arrives as milliseconds passed.
 *
 *   k (the numbers, from settings): { rate, lo, hi, greenRate, overResetMs, holdAt, bubbleLead, bubbleMin, near }
 *   newFire() -> fire          fire: { fire: "cold"|"heating"|"ready"|"over"|"spent", heat, overFor, bubbling }
 *   zone(fire, k) -> "off" | "before" | "green" | "past"
 *   turn(fire, { canLight, hold }, k) -> { fire, events }       a tap on the knob
 *   pass(fire, ms, { hold }, k) -> { fire, events }             time passing
 *   nearGreen(fire, k) -> the fire is close enough to its green to watch
 */
export const FIRES = ["cold", "heating", "ready", "over", "spent"];

export const newFire = () => ({ fire: "cold", heat: 0, overFor: 0, bubbling: false });

export const bubbleAt = (k) => Math.max(k.bubbleMin, k.lo - k.rate * k.bubbleLead);

export function zone(f, k) {
  if (f.fire !== "heating") return "off";
  return f.heat < k.lo ? "before" : f.heat <= k.hi ? "green" : "past";
}

export const nearGreen = (f, k) => f.fire === "heating" && f.heat >= k.lo - k.near;

const boilOver = (f) => ({ fire: { ...f, fire: "over", heat: 1, overFor: 0, bubbling: false }, events: [{ type: "over" }] });

/** A tap on the knob. `canLight` is false when the vessel is not ready for the fire; `hold` is the first-time wait in the green. */
export function turn(f, { canLight = true } = {}, k) {
  if (f.fire === "cold") {
    if (!canLight) return { fire: f, events: [{ type: "cannot-light" }] };
    return { fire: { ...f, fire: "heating", heat: 0, bubbling: false }, events: [{ type: "lit" }] };
  }
  if (f.fire !== "heating") return { fire: f, events: [] };
  const z = zone(f, k);
  if (z === "before") return { fire: f, events: [{ type: "not-yet" }] };
  if (z === "green") return { fire: { ...f, fire: "ready", heat: Math.min(f.heat, k.hi), bubbling: false }, events: [{ type: "turned-down" }] };
  return boilOver(f);
}

/** Time passing. Before the green the heat climbs at the level's rate; from the green on, at a share of it. */
export function pass(f, ms, { hold = false } = {}, k) {
  if (f.fire === "over") {
    const overFor = f.overFor + ms;
    if (overFor >= k.overResetMs) return { fire: newFire(), events: [{ type: "spoiled" }] };
    return { fire: { ...f, overFor }, events: [] };
  }
  if (f.fire !== "heating") return { fire: f, events: [] };
  const events = [];
  let heat = f.heat;
  let left = ms / 1000;
  if (heat < k.lo) {
    const toGreen = (k.lo - heat) / k.rate;
    const step = Math.min(left, toGreen);
    heat += k.rate * step;
    left -= step;
    if (left > 0 || heat >= k.lo) {
      heat = Math.max(heat, k.lo);
      events.push({ type: "green" });
    }
  }
  if (left > 0) heat += k.rate * k.greenRate * left;
  const holdAt = k.lo + (k.hi - k.lo) * k.holdAt;
  if (hold && heat > holdAt) heat = holdAt;
  let bubbling = f.bubbling;
  if (!bubbling && heat >= bubbleAt(k)) {
    bubbling = true;
    events.unshift({ type: "bubbling" });
  }
  if (heat >= 1) {
    const out = boilOver(f);
    return { fire: out.fire, events: events.concat(out.events) };
  }
  return { fire: { ...f, heat, bubbling }, events };
}

/** After the last of the dish has been taken from the vessel: the fire is off for good. */
export const spend = (f) => ({ ...f, fire: "spent", bubbling: false });

/** Seconds from lighting to the green, of green, and from lighting to boiling over, for a level's numbers. */
export function times(k) {
  const half = k.rate * k.greenRate;
  return { toGreen: k.lo / k.rate, green: (k.hi - k.lo) / half, toOver: k.lo / k.rate + (1 - k.lo) / half };
}
