// The chai tray (s08 wave 4B, js/cook/stations/chai-tray.js): its contract checks, numbered from 70, judged from the station's own
// test notes (Lifecycle.note, only logged: lib/contract-hook.mjs passes them on as k "life" with what, reason = the note's step, by).
//   contract-70 slow-at-green  "Slow kar" (the turn-off line, step "slow") is called as the heat bar enters the green, never
//                              before it and not well past it (CHAI-24, Zafar 17 Oct, P56)
//   contract-71 once-each      milk, water and the tea leaves go into a pan once each: a second tap adds nothing (CHAI-22, P33)
export const CHAI_CHECKS = {
  "contract-70": { item: "slow-at-green", title: "chai: the turn-off line at the green", how: "Cook flows of the chai tray (cook:chai-tray, cook:chai, their labs): every note the station logs as it calls the turn-off step (Lifecycle chai-slow: the heat bar's level as a fraction, by: the green band's lo/hi and whose pan) must have the level at or above lo and at most 0.06 past it (the bar has just entered the green: P56, 'so that you don't think you have to stop it early'). A round where a pan was turned down in or past the green (chai-down, the level as it was turned down) with no call at all is a break too." },
  "contract-71": { item: "once-each", title: "chai: milk, water and tea once each", how: "Cook flows of the chai tray: every note the station logs as milk (cook-dudh), water (cook-paani) or the tea leaves (cook-chai) is tapped for a pan (Lifecycle chai-add: the thing, then who:count, with :again when the tap was refused) must have a count of 1, or carry :again (the second tap only wiggled, nothing went in). A count of 2 or more is a break: there is one of milk, water and tea in a pan (P33)." },
};

const CHAI_FLOW = /^(cook:(recipe:)?chai(-tray)?\b|lab:cook\/(recipe-)?chai(-tray)?\b)/;
export const SLOW_LATE = 0.06;
const lifeOf = (tl, what) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === what);
// the green band and whose pan, as the station logs them: "lo/hi/who"
const band = (by) => {
  const [lo, hi, who] = String(by || "").split("/");
  return { lo: lo !== "" && Number.isFinite(+lo) ? +lo : null, hi: Number.isFinite(+hi) ? +hi : null, who: who || "?" };
};

export function check70(r, tl, add) {
  if (!CHAI_FLOW.test(r.flow || "")) return;
  const slows = lifeOf(tl, "chai-slow");
  for (const n of slows) {
    const h = Number(n.reason);
    const { lo, who } = band(n.by);
    if (lo == null || !Number.isFinite(h)) continue;
    if (h < lo - 1e-3) add("contract-70", n.t, `"Slow kar" for ${who} at ${h.toFixed(3)}, before the green (it starts at ${lo}): called early, as if the pan must be stopped before the green`);
    else if (h > lo + SLOW_LATE) add("contract-70", n.t, `"Slow kar" for ${who} at ${h.toFixed(3)}, ${(h - lo).toFixed(3)} past the green's edge (${lo}): called late`);
  }
  // a pan turned down in or past the green, in a round with no call at all
  const downs = lifeOf(tl, "chai-down").filter((n) => {
    const { lo } = band(n.by);
    return lo != null && Number(n.reason) >= lo;
  });
  if (downs.length && !slows.length) add("contract-70", downs[0].t, `a pan was turned down at ${Number(downs[0].reason).toFixed(3)} (in or past the green) and the turn-off line was never called (no chai-slow note in the round)`);
}

export function check71(r, tl, add) {
  if (!CHAI_FLOW.test(r.flow || "")) return;
  for (const n of lifeOf(tl, "chai-add")) {
    const [who, count, again] = String(n.by || "").split(":");
    if (!/^cook-(dudh|paani|chai)$/.test(n.reason || "")) continue;
    if (again === "again") continue;
    if (Number(count) > 1) add("contract-71", n.t, `${n.reason} went into ${who}'s pan a ${Number(count) === 2 ? "second" : `${count}th`} time: there is one of milk, water and tea in a pan (a second tap only wiggles)`);
  }
}
