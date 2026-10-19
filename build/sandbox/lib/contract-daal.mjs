// The daal station (s08 wave 4A): its contract checks, numbered from 65, judged from the game's own test logs (window.Lifecycle.log
// through the probe, lib/contract-hook.mjs: k "life") and what was heard (the sound log's lines and clips, lib/sound.mjs).
//   contract-65 chop-waves   the chop's waves run on without a gap: between the last throw of one wave and the first of the next
//                            no more than the wave's own throw spacing plus 0.5 s (DAAR-35, P55: "the items should just come
//                            continuously")
//   contract-66 stir-flag    a stir lap counts at the flag (12 o'clock) and its number is heard within 3/4 of that lap; a number
//                            left out only while another line was being said (DAAR-27, DAAR-30; P10, P49)
export const DAAL_CHECKS = {
  "contract-65": { item: "chop-waves", title: "the chop's waves without a gap", how: "Cook flows with the daal chop: each throw the chop logs (Lifecycle chop-throw: its wave, and the spacing it is thrown at in real ms). Where the wave changes from one throw to the next, the time between them less the new wave's spacing must be at most 500 ms; more is a break (DAAR-35, P55: 'the items should just come continuously'). A daal flow whose chop logged no throws is a break too (nothing to judge)." },
  "contract-66": { item: "stir-flag", title: "a lap at the flag, its number heard in step", how: "Daal flows (cook:daar, cook:daal): each lap the stir logs (Lifecycle stir-lap: the lap, the ladle's angle from 12 o'clock, how long the lap took in real ms, and said / quiet:busy). The angle must be within 25 degrees of the flag (DAAR-30: a lap counts as the ladle passes it). A said lap's number (a Cook line tagged role laps, asked for within 250 ms of the lap) must start sounding (its first clip) within 3/4 of that lap's time (at least 300 ms) after it; one that never sounds passes only if a newer lap came within that time (the late number dropped, the newest said: P10). A lap left quiet (quiet:busy) must have another line's clip sounding at that moment. A daal flow that stirred (a stir step opened) and logged no lap is a break (DAAR-27, P10: 'say it within like three quarters of one revolution')." },
};

const GAP_MS = 500; // P55: no gap: at most half a second more than the wave's own spacing
const FLAG_DEG = 25; // within this of 12 o'clock is "at the flag" (a fast drag moves up to 1.3 rad a step)
const LAP_SHARE = 0.75; // P10: "within like three quarters of one revolution"
const LAP_MIN_MS = 300; // a spill-fast lap still gives the number this long
const LINE_WITHIN = 250; // a lap's number is asked for this soon after it

const lifes = (tl, what) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === what);
const num = (by, key) => {
  const m = new RegExp(`${key}:(-?[\\d.]+)`).exec(by || "");
  return m ? Number(m[1]) : null;
};
const isDaal = (flow) => /^cook:(daar|daal)\b/.test(flow || "");

export function check65(r, tl, add) {
  const throws = lifes(tl, "chop-throw").map((e) => ({ t: e.t, wave: Number(e.reason), every: num(e.by, "every") || 0 }));
  if (!throws.length) {
    if (isDaal(r.flow)) {
      const chop = tl.find((e) => e.type === "c" && e.k === "life" && /^decoys$/.test(e.what) && /chop/.test(e.by || ""));
      if (chop) add("contract-65", chop.t, "the daal chop ran and logged no throws (Lifecycle chop-throw): its waves cannot be judged");
    }
    return;
  }
  for (let i = 1; i < throws.length; i++) {
    const a = throws[i - 1];
    const b = throws[i];
    if (b.wave !== a.wave + 1) continue; // the same wave, or a new chop (a redo starts again at wave 0)
    const gap = b.t - a.t - b.every;
    if (gap > GAP_MS) add("contract-65", b.t, `wave ${b.wave + 1}'s first throw came ${Math.round(b.t - a.t)} ms after wave ${a.wave + 1}'s last (its spacing ${Math.round(b.every)} ms): a gap of ${Math.round(gap)} ms between the waves (at most ${GAP_MS})`);
  }
}

export function check66(r, tl, v, add) {
  const laps = lifes(tl, "stir-lap").map((e) => ({ t: e.t, n: Number(e.reason), at: num(e.by, "at"), period: num(e.by, "period"), how: /quiet:busy/.test(e.by || "") ? "quiet" : /muted/.test(e.by || "") ? "muted" : "said" }));
  if (!laps.length) {
    if (isDaal(r.flow)) {
      const stir = tl.find((e) => e.type === "c" && e.k === "life" && e.what === "say-start" && /firai/i.test(e.by || ""));
      if (stir) add("contract-66", stir.t, "the daal stir ran (Nani said its line) and logged no lap (Lifecycle stir-lap): no lap was counted at the flag");
    }
    return;
  }
  const lapLines = v.lines.filter((l) => l.role === "laps");
  const used = new Set();
  laps.forEach((p, i) => {
    if (p.at != null && Math.abs(p.at) > FLAG_DEG) add("contract-66", p.t, `lap ${p.n} counted ${p.at} degrees from the flag (at 12 o'clock it counts as the ladle passes it, within ${FLAG_DEG})`);
    if (p.how === "muted") return;
    const next = laps[i + 1];
    if (p.how === "quiet") {
      const other = v.lines.some((l) => l.role !== "laps" && l.plays.some((q) => q.t0 <= p.t + 20 && q.t1 >= p.t - 20));
      if (!other) add("contract-66", p.t, `lap ${p.n}'s number was left out (quiet:busy) though no other line was sounding`);
      return;
    }
    const l = lapLines.find((x) => !used.has(x.id) && x.t0 >= p.t - 50 && x.t0 <= p.t + LINE_WITHIN);
    if (!l) return add("contract-66", p.t, `lap ${p.n}: no number asked for within ${LINE_WITHIN} ms of the lap`);
    used.add(l.id);
    const within = Math.max(LAP_MIN_MS, LAP_SHARE * (p.period || 0));
    const first = l.plays.slice().sort((a, b) => a.t0 - b.t0)[0];
    if (!first) {
      // dropped by the one queue: fine only for a newer lap (the newest number said)
      if (!next || next.t - p.t > within) add("contract-66", p.t, `lap ${p.n}'s number ("${l.text}") never sounded, and no newer lap replaced it`);
      return;
    }
    const late = first.t0 - p.t;
    if (late > within) add("contract-66", p.t, `lap ${p.n}'s number ("${l.text}") started ${Math.round(late)} ms after the lap; the lap took ${Math.round(p.period)} ms, so it must start within ${Math.round(within)} ms (3/4 of a turn)`);
  });
}
