// The day's frame (Sprint 9, s09-frame: day.html's morning door, evening book and window ride): its contract checks, numbered
// from 45, judged from what was heard (the sound log's lines, lib/sound.mjs: day.html says every line through window.Day.say,
// whose speaker reads "day:<stage>:<who>") and what was on screen (the probe's texts sample, lib/contract-hook.mjs: a text
// under [data-door-en] carries `door`: {stage: the page was on its door, under: it sits right under a Kutchi line}).
//   contract-45 door-turn     the door's lines are said in turn: each of Nani's lines starts only once the one before it has
//                             ended (never two at once, never one cut by the next)
//   contract-46 door-english  written English shows for the child only under Nani's door lines (rule 5's door exception,
//                             Zafar, 19 Oct): English tagged as a door line's is a break off the door or not under a Kutchi line
//   contract-47 ride-hidden   the window ride (s09-ride, RIDE-02): Nani never asks for a thing while it is more than about two
//                             thirds hidden (behind a prop, under the verge's edge, behind the car's frame) or off screen
//   contract-48 ride-fair     the window ride (s09-ride, RIDE-04): a thing is asked for only as it comes into view, never as it
//                             leaves; a thing asked for and missed comes round again until it is found
// Both read the ride's own test log (js/shared/window-ride.js through Lifecycle.note: ride-call, ride-pass, ride-found, ride-end),
// whose boxes are the screen boxes the page measured (getBoundingClientRect) at the moment of the call.
export const DAY_CHECKS = {
  "contract-45": { item: "door-turn", title: "the door's lines in turn", how: "The sound log's lines said at the door (speaker day:door:nani: day.html's Day.say on the door stage), in the order they started: each must start no earlier than 40 ms before the line before it ended (its line-end), and the one before must have ended at all (a line that never ends while the next starts is two at once). A line starting while the one before it is still being said is a break: Nani's lines come one at a time, in turn (the door, Zafar, 19 Oct)." },
  "contract-46": { item: "door-english", title: "English written only under the door's lines", how: "Every texts sample's text tagged as a door line's English (lib/contract-hook.mjs: inside [data-door-en]) must be on the door (window.Day.stage 'door') and sit right under a Kutchi line (its element follows a .day-k that is not a to-record placeholder); either missing is a break. Every other English a child could read is contract-16's (no written English for the child): the door's English is the one exception (non-negotiable 5, Zafar, 19 Oct)." },
  "contract-47": { item: "ride-hidden", title: "the ride never asks for a hidden thing", how: "Every call of the window ride (Lifecycle ride-call: the named thing's screen box, the window's opening, the boxes in front of it (the props) and, for a thing in the field, the verge's top edge, all measured on screen at the moment Nani asks): the box is sampled on a 12x12 grid; a point outside the opening, inside a box in front of it or below the verge's edge is hidden. More than two thirds hidden, or nothing of it inside the opening, is a break (RIDE-02, Zafar, 20 Oct: 'never asking for a fully hidden item'). A day:window flow that logged no call is a break too (nothing to judge)." },
  "contract-48": { item: "ride-fair", title: "the ride asks as a thing comes into view, and a missed one comes round", how: "The window ride's log (Lifecycle ride-call, ride-pass, ride-end): a call whose thing's centre is already in the left half of the window's opening (it has crossed more than half the window: leaving) is a break; a pass that ended with the thing missed (ride-pass missed) and no later call for the same thing in the same call is a break; a ride that ends (ride-end) with fewer things found than called is a break (RIDE-04, Zafar, 20 Oct: 'asked only as it comes into view, and a missed item comes round until found'). A day:window flow that logged no call is a break too." },
};

// ---------------------------------------------------------------- the window ride (contracts 47, 48)
const HIDDEN_MAX = 2 / 3; // more than this share hidden at the call is a break (RIDE-02: 'about two thirds')
const GRID = 12;
const nums = (s) => String(s || "").split(",").map(Number);
const boxOf = (s) => {
  const [x, y, w, h] = nums(s);
  return [x, y, w, h].every(Number.isFinite) ? { x, y, w, h } : null;
};
/** a ride log entry's `by` ("thing:goat pass:1 box:x,y,w,h open:l,t,r,b occ:x,y,w,h;x,y,w,h edge:y how:missed") as fields */
export function rideFields(by) {
  const o = {};
  for (const m of String(by || "").matchAll(/(\w+):(\S*)/g)) o[m[1]] = m[2];
  const out = { thing: o.thing || "", pass: Number(o.pass) || 1, how: o.how || "" };
  out.box = o.box ? boxOf(o.box) : null;
  const op = nums(o.open);
  out.open = o.open && op.length === 4 && op.every(Number.isFinite) ? { l: op[0], t: op[1], r: op[2], b: op[3] } : null;
  out.occ = (o.occ || "").split(";").filter(Boolean).map(boxOf).filter(Boolean);
  out.edge = o.edge != null && o.edge !== "" && Number.isFinite(Number(o.edge)) ? Number(o.edge) : null;
  out.found = o.found != null ? Number(o.found) : null;
  out.calls = o.calls != null ? Number(o.calls) : null;
  return out;
}
/** the share of a call's thing that is hidden (0..1), sampled on a grid over its box */
export function hiddenShare(f) {
  if (!f.box || !f.open) return 1;
  let hid = 0;
  for (let i = 0; i < GRID; i++)
    for (let j = 0; j < GRID; j++) {
      const x = f.box.x + ((i + 0.5) / GRID) * f.box.w;
      const y = f.box.y + ((j + 0.5) / GRID) * f.box.h;
      const out = x < f.open.l || x > f.open.r || y < f.open.t || y > f.open.b;
      const behind = f.occ.some((o) => x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h);
      const under = f.edge != null && y > f.edge;
      if (out || behind || under) hid++;
    }
  return hid / (GRID * GRID);
}
const rideLog = (tl, what) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === what).map((e) => ({ t: e.t, step: e.step != null ? String(e.step) : String(e.reason || ""), ...rideFields(e.by) }));
const isRide = (flow) => /^day:window\b/.test(flow || "");
const rideRan = (tl) => tl.some((e) => e.type === "c" && e.k === "life" && e.what === "stage-start");

export function check47(r, tl, add) {
  const calls = rideLog(tl, "ride-call");
  if (!calls.length) {
    if (isRide(r.flow) && rideRan(tl)) add("contract-47", tl[tl.length - 1].t, "the window ride logged no call (Lifecycle ride-call): what was hidden at each call cannot be judged");
    return;
  }
  for (const c of calls) {
    if (!c.box || !c.open) {
      add("contract-47", c.t, `call ${Number(c.step) + 1} (${c.thing}): no screen box logged`);
      continue;
    }
    const inside = c.box.x + c.box.w > c.open.l && c.box.x < c.open.r && c.box.y + c.box.h > c.open.t && c.box.y < c.open.b;
    const share = hiddenShare(c);
    if (!inside) add("contract-47", c.t, `call ${Number(c.step) + 1}: Nani asked for the ${c.thing} while it was off screen (outside the window's opening)`);
    else if (share > HIDDEN_MAX) add("contract-47", c.t, `call ${Number(c.step) + 1}: Nani asked for the ${c.thing} while ${Math.round(share * 100)}% of it was hidden (${c.occ.length} thing(s) in front${c.edge != null ? ", the verge's edge" : ""}; at most ${Math.round(HIDDEN_MAX * 100)}%)`);
  }
}

export function check48(r, tl, add) {
  const calls = rideLog(tl, "ride-call");
  if (!calls.length) {
    if (isRide(r.flow) && rideRan(tl)) add("contract-48", tl[tl.length - 1].t, "the window ride logged no call (Lifecycle ride-call): when each thing was asked for cannot be judged");
    return;
  }
  for (const c of calls) {
    if (!c.box || !c.open) continue;
    const rel = (c.box.x + c.box.w / 2 - c.open.l) / Math.max(1, c.open.r - c.open.l);
    if (rel < 0.5) add("contract-48", c.t, `call ${Number(c.step) + 1}: Nani asked for the ${c.thing} as it was leaving (its centre ${Math.round(rel * 100)}% across the window from the left; asked only as it comes into view, in the right half)`);
  }
  for (const p of rideLog(tl, "ride-pass").filter((x) => /missed/.test(x.how))) {
    const again = calls.some((c) => c.step === p.step && c.t > p.t && c.thing === p.thing);
    if (!again) add("contract-48", p.t, `call ${Number(p.step) + 1}: the ${p.thing} went by unfound (pass ${p.pass}) and never came round again`);
  }
  for (const e of rideLog(tl, "ride-end")) if (e.found != null && e.calls != null && e.found < e.calls) add("contract-48", e.t, `the ride ended with ${e.found} of ${e.calls} things found: a missed thing comes round until it is found`);
}

const TURN_SLACK = 40; // ms: a line-end logged a frame after the next line's start is still in turn

export function check45(tl, add) {
  const lines = [];
  const byId = new Map();
  for (const e of tl) {
    if (e.type === "line" && /^day:door:nani\b/.test(String(e.who || ""))) {
      const l = { id: e.id, t0: e.t, t1: null, text: e.text };
      lines.push(l);
      byId.set(e.id, l);
    } else if (e.type === "line") byId.delete(e.id); // a line id used again (a second page in one flow: the day picked up after Cook)
    else if (e.type === "line-end" && byId.has(e.id) && byId.get(e.id).t1 == null) byId.get(e.id).t1 = e.t;
  }
  lines.sort((a, b) => a.t0 - b.t0);
  for (let i = 1; i < lines.length; i++) {
    const a = lines[i - 1];
    const b = lines[i];
    if (a.t1 == null) add("contract-45", b.t0, `"${b.text}" started while "${a.text}" was still being said (it never ended)`);
    else if (b.t0 < a.t1 - TURN_SLACK) add("contract-45", b.t0, `"${b.text}" started ${Math.round(a.t1 - b.t0)} ms before "${a.text}" ended: the door's lines come in turn`);
  }
}

export function check46(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "texts") continue;
    for (const x of e.list || []) {
      if (!x.door) continue;
      const why = !x.door.stage ? "shown off the door" : !x.door.under ? "not under a Kutchi line" : null;
      if (!why || seen.has(x.t + why)) continue;
      seen.add(x.t + why);
      add("contract-46", e.t, `"${x.t}" (${x.sel}): door English ${why}`);
    }
  }
}
