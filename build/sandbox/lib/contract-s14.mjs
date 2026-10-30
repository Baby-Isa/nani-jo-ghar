// S14 tools (s14-tools builder, 30 Oct): the contract checks for what Zafar found on 29 Oct and the checks missed
// (docs/feedback/chai-rules-2026-10-29.md section 5, docs/sprints/S14-rollout-plan.md section 3). Numbered from 78. Each reads what the
// second contract probe (lib/contract-hook-s14.mjs) and the first (lib/contract-hook.mjs) recorded, never the game's own notes, so a
// game that is wrong cannot also say it is right:
//   contract-78 call-light    a control step's call and its light come together (within 200 ms): never "voice, pause, dim" (CHAI-40)
//   contract-79 card-light    the order card's light waits until nothing moves, then pointAfterMoveMs (data/rules.json showing) (CHAI-42)
//   contract-80 no-jump       from a view's first drawn frame to 2 s on, the kitchen's fit does not change (CHAI-45)
//   contract-81 over-gauge    no picture of the thing a gauge is on is drawn over its ring (CHAI-46)
//   contract-82 edge-on-face  no lit box's edge crosses a face circle (CHAI-47)
//   contract-83 card-on-face  no big card, and no card in flight, over a face, measured with the games' own face boxes (B2) (SH-154, CHAI-43)
//   contract-84 light-clear   the lit box's inside is lighter than the dim around it by a set margin (SH-164)
//   contract-85 replay        a round played again has every picture it had the first time, the painted worktop, its fx (SH-161)
//   contract-86 bubble-clear  no bubble over a side panel ([data-njg-keepout]) while the play area has room (SH-166)
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DARK_BELOW, LIGHT_LIFT } from "./lightpix.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const RULES_SHOWING = (() => { try { return JSON.parse(readFileSync(join(ROOT, "data", "rules.json"), "utf8")).showing || {}; } catch (e) { return {}; } })();
export const WITHIN_MS = 200;            // a step's call and its light (CHAI-40, the rollout plan B3)
export const POINT_AFTER_MOVE_MS = Number(RULES_SHOWING.pointAfterMoveMs) || 500;
export const SAMPLE_MS = 100;            // the contract probe samples twice a ... ten times a second: its end of a move is within this
export const JUMP_WINDOW_MS = 2000;      // from the first drawn frame (CHAI-45, B5)
export const JUMP_PX = 3;                // the kitchen's picture moved or grew by more than this on screen
// the calls that open a control step (a knob, a timed turn, a pour): each is lit with its call for every player (chai: CONTROL14 in
// js/cook/stations/chai-tray.js). The words are what the engine says (family lines already in the game), lower case, no marks.
export const CONTROL_CALLS = { "chai-tray": ["chulo bar", "slow kar"] };
const norm = (s) => String(s || "").toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, " ").replace(/\s+/g, " ").trim();
const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");
const stationOf = (flow) => { const m = /^(?:cook:(?:recipe:)?|lab:cook\/(?:recipe-)?)([\w-]+)/.exec(flow || ""); return m ? m[1] : null; };
const ev = (tl, k) => tl.filter((e) => e.type === "c" && e.k === k);
const area = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
const over = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));

export const S14_CHECKS = {
  "contract-78": { item: "call-light", title: "a control's call and its light come together", how: "Cook flows: for each call line (role call) whose words are a control step's (CONTROL_CALLS: chai's \"Chulo bar!\" and \"Slow kar!\"), the first-time help's light (the S14 probe's lit event: the dim with its gold box, timed on the animation frame) must come up within 200 ms of the call starting, either way, or already be up. A call with no light within 200 ms is a break, named with when the light came (never: the child hears the voice, waits, and sees the dim later: Zafar's video, 29 Oct: \"voice, pause, dim, pause, gold outline\", CHAI-40)." },
  "contract-79": { item: "card-light", title: "the order card's light waits until nothing moves", how: "Every lit event whose box is the order card's (the S14 probe: a hole over half of an .oc-card): no finite animation may be in flight at that moment (moving events: Phaser tweens that end, DOM animations that end, the order row's scroll; the characters' own idling and the speech bubbles left out), and the last one must have ended at least the central rules' showing.pointAfterMoveMs (500 ms; minus the probe's 100 ms sample) before the light starts. A light that starts while the tea still flies, or a beat too soon after, is a break (CHAI-42: \"start its timer after the last animation action ... when the tea has finished going in\")." },
  "contract-80": { item: "no-jump", title: "the kitchen does not change after its first drawn frame", how: "lab.html Cook flows (Zafar's route): the S14 probe's fit events (every animation frame the Cook scene's fit changes: the kitchen picture's box on screen, the camera's zoom and scroll, the canvas, the world). For each named view (the station or the counter, not the title's backdrop while the page lays itself out), from the first frame its picture is drawn (a real texture, not fading) to 2 s on, a later fit of the same picture that moved an edge by more than 3 px or changed the zoom by more than 0.5% is a break: the picture that loads and then jerks into a different zoom (CHAI-45, Zafar 29 Oct: \"the kitchen ceiling becomes more visible\")." },
  "contract-81": { item: "over-gauge", title: "no picture over a gauge", how: "Every gaugeover event (the S14 probe: the heat ring found by its arc round the gauge's centre in the Phaser display list, then every picture drawn above it that sits on it, tools and effects left out): any picture of the thing the gauge is on (the pan's handle) drawn above the ring is a break, named with its key and depth against the ring's (CHAI-46: \"part of the handle looks like it covers the loading circle\")." },
  "contract-82": { item: "edge-on-face", title: "no lit box edge across a face", how: "Every lit event with the faces on screen then (the games' own face boxes, njgTest.faces(); B2): a face circle (or head) that a lit box covers partly, more than 3% and less than 97% of its area, has the box's edge across it; a face whole inside the box, or clear of it, is fine (CHAI-47: \"the highlight box on the chai tray should go under the face circle so the face circle sits on top and doesn't get a line over the face\")." },
  "contract-83": { item: "card-on-face", title: "no card over a face", how: "Every cardface event (the S14 probe: the big card (.wc14-pop) and every card in flight (.wc14-flyer) against every person's face box from njgTest.faces(): a head in the kitchen, a face circle in the page; the round badges on a hob or tray left out, whatever the game's own check says): any overlap is a break, with whose face (SH-154, CHAI-43: nothing is drawn over a face)." },
  "contract-84": { item: "light-clear", title: "the lit box is clear against the dim", how: "Every lightpix measure (lib/lightpix.mjs: a beat after a light comes up the sandbox takes the screen with the light and without it, and measures each lit box: the mean brightness inside it, 8 px in from its edge, with the light and under it): on a dark thing (under it, below 110 of 255) the light must lift the inside by at least 12 of 255, the soft warm fill. A lit black burner that looks as black as it did is a break (SH-164: \"the highlight on the burner isn't clear enough because the burner is black ... it might need lightening inside the highlight box\")." },
  "contract-85": { item: "replay", title: "a round played again is whole", how: "The replay driver (a lab.html round, then Play again: build/sandbox/flows/labs.mjs, mode replay) records each round's textures (k replay): after Play again no picture of the first round is missing, nothing is drawn as the missing-picture texture, the station's worktop is the painted marble (spr:bg:marble), and the fx textures are loaded. Any of them missing is a break (SH-161: the replay lost its pictures and drew the worktop in code)." },
  "contract-86": { item: "bubble-clear", title: "a bubble keeps off a side panel", how: "Every keepout event (the S14 probe: each speech bubble against every [data-njg-keepout] panel and the side panel (#side, .njg-side, .cl-side)): a bubble that reaches more than 8 px into a panel while the play area has room for it beside the panel (the play area's right edge less the panel's is at least the bubble's width) is a break (SH-166: \"why does the speech bubble go over the left panel even though there is space to right?\")." },
  "contract-87": { item: "one-light", title: "one light at a time", how: "Every lit event (the S14 probe: the light layers up, .njg-onboard): two or more light layers up together for longer than 300 ms is a break: their dims stack (the screen darker each time) and the older one's box stays on a control whose step has ended (CHAI-50, Zafar, 30 Oct: \"a black tint ... that never goes away, although it gets even more darker ... the gold square box doesn't go away either\")." },
  "contract-88": { item: "item-said", title: "no item on the order card before it is said", how: "Every rows14 event (the S14 probe: the order panel's item rows, the words of those shown and how many wait as a dashed slot): a row shown and later back to its dashed slot (the item seen, then hidden as the person greets, then shown again) is a break (SH-171, Zafar, 30 Oct: \"before the guy even comes to give the order ... it gives the order card for ... one onion ... when he comes and he says, Salaam Alaikum, the item card for the onion disappears, but it leaves a dotted outline and then reappears again ... You shouldn't see the item until he's given the order\")." },
  "contract-89": { item: "helper-call", title: "the helper says the item as her card opens", how: "Cook flows: every Cook line tagged role call that starts while Nani's helper card names an item (the S14 probe's helper event: her arrow up) and is closed, and more than 1.5 s (scaled by the test speed) after her card last opened, is a break: the next item said before her card shows it (SH-172, Zafar, 30 Oct: \"that instruction should be said out loud, only at the same time as the order hint is shown ... when she expands her card to help you ... that's a rule for all the games always\"). A control's call (no item named) is contract-78's." },
};

// 78
export function check78(r, tl, v, add) {
  if (!isCookFlow(r.flow)) return;
  const calls = CONTROL_CALLS[stationOf(r.flow)];
  if (!calls) return;
  const lits = ev(tl, "lit");
  const lines = v.lines.filter((l) => l.role === "call" && calls.includes(norm(l.text)));
  for (const l of lines) {
    // a light up at the call (opened before it, not yet out) counts as together; else an opening within 200 ms either side
    let open = null;
    for (const e of lits) { if (e.t > l.t0) break; open = e.holes && e.holes.length ? e : null; }
    if (open && l.t0 - open.t <= 4000) continue;
    const near = lits.find((e) => e.holes && e.holes.length && Math.abs(e.t - l.t0) <= WITHIN_MS);
    if (near) continue;
    const after = lits.find((e) => e.holes && e.holes.length && e.t > l.t0);
    add("contract-78", l.t0, `the call "${l.text.trim()}" starts and ${after ? `the light comes ${Math.round(after.t - l.t0)} ms later (more than ${WITHIN_MS} ms)` : "no light comes with it"}`);
  }
}

// 79
export function check79(tl, add, { pointAfterMove = POINT_AFTER_MOVE_MS } = {}) {
  const mv = ev(tl, "moving");
  if (!mv.length) return;
  for (const e of ev(tl, "lit")) {
    if (!e.card || !e.holes || !e.holes.length) continue;
    // the move state at the light's start: the last moving event at or before it
    let state = null, endedAt = null;
    for (const m of mv) {
      if (m.t > e.t) break;
      if (m.n > 0) { state = m; endedAt = null; } else { endedAt = m.t; state = null; }
    }
    if (state) { add("contract-79", e.t, `the order card's light starts while something moves (${state.what || "an animation"})`); continue; }
    if (endedAt != null && e.t - endedAt < pointAfterMove - SAMPLE_MS) add("contract-79", e.t, `the order card's light starts ${Math.round(e.t - endedAt)} ms after the last move ended (the rules ask ${pointAfterMove} ms)`);
  }
}

// 80
export function check80(r, tl, add) {
  // (Zafar's route: lab.html, where chai's look is set before the first draw; cook.html's title backdrop still lays itself out for about
  // half a second after its first frame, on the branch as on main: a finding in the s14-tools report, not a break on every Cook flow)
  if (!/^lab:cook\//.test(r.flow || "")) return;
  const fits = ev(tl, "fit");
  const base = new Map();   // view -> the first drawn frame's fit
  const said = new Set();
  for (const f of fits) {
    if (!f.drawn || f.fade > 0.02 || !f.box) continue;
    const key = `${f.view}|${f.bg}`;
    if (!base.has(key)) { base.set(key, f); continue; }
    const b = base.get(key);
    if (f.t - b.t > JUMP_WINDOW_MS) continue;
    const moved = Math.max(...f.box.map((v, i) => Math.abs(v - b.box[i])));
    const zoomed = Math.abs(f.zoom - b.zoom) / (b.zoom || 1);
    const resized = (f.world && b.world && (f.world[0] !== b.world[0] || f.world[1] !== b.world[1])) || (f.canvas && b.canvas && (f.canvas[0] !== b.canvas[0] || f.canvas[1] !== b.canvas[1]));
    if ((moved > JUMP_PX || zoomed > 0.005 || resized) && !said.has(key)) {
      said.add(key);
      add("contract-80", f.t, `${f.view}: the kitchen picture (${f.bg}) changed ${Math.round(f.t - b.t)} ms after its first drawn frame (an edge moved ${Math.round(moved)} px${zoomed > 0.005 ? `, the zoom ${b.zoom} to ${f.zoom}` : ""}${resized ? ", the canvas or world size changed" : ""})`);
    }
  }
}

// 81
export const OVER_GAUGE_MS = 600;       // a pan carried across a ring for a moment is not a picture over it
export function check81(tl, add) {
  const seen = new Set();
  const evs = ev(tl, "gaugeover");
  evs.forEach((e, i) => {
    const until = (evs[i + 1] || { t: e.t + 1e9 }).t;
    for (const o of e.over || []) {
      const k = `${o.key}|${o.depth}`;
      if (seen.has(k) || until - e.t < OVER_GAUGE_MS) continue;
      seen.add(k);
      add("contract-81", e.t, `${o.key} (depth ${o.depth}) is drawn over the heat ring (depth ${e.ring}), ${o.ov} px squared of it on the gauge`);
    }
  });
}

// 82
// the share of a face's own shape (a circle, or the head's ellipse, inscribed in its box) that a lit box covers: a grid of points
export function faceShare(hole, fb, n = 14) {
  const cx = (fb[0] + fb[2]) / 2, cy = (fb[1] + fb[3]) / 2, rx = (fb[2] - fb[0]) / 2, ry = (fb[3] - fb[1]) / 2;
  let inFace = 0, inBoth = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const x = cx + ((i + 0.5) / n * 2 - 1) * rx, y = cy + ((j + 0.5) / n * 2 - 1) * ry;
    if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 1) continue;
    inFace++;
    if (x >= hole[0] && x <= hole[2] && y >= hole[1] && y <= hole[3]) inBoth++;
  }
  return inFace ? inBoth / inFace : 0;
}
export function check82(tl, add) {
  const seen = new Set();
  for (const e of ev(tl, "lit")) {
    for (const f of e.faces || []) {
      if (area(f.box) <= 0) continue;
      for (const h of e.holes || []) {
        const share = faceShare(h, f.box);
        if (share > 0.05 && share < 0.95) {
          const k = `${f.who}|${f.kind}`;
          if (seen.has(k)) continue;
          seen.add(k);
          add("contract-82", e.t, `a lit box [${h.join(",")}] cuts across ${f.who || "a"} ${f.kind} [${f.box.map(Math.round).join(",")}] (${Math.round(100 * share)}% of it inside)`);
        }
      }
    }
  }
}

// 83
export function check83(tl, add) {
  const seen = new Set();
  for (const e of ev(tl, "cardface")) {
    if (!(e.over > 0)) continue;
    const k = e.who || "?";
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-83", e.t, `a card (${(e.card || []).map(Math.round).join(",")}) sits over ${e.who || "a face"}: ${e.over} px squared`);
  }
}

// 84
export function check84(tl, add, { dark = DARK_BELOW, lift = LIGHT_LIFT } = {}) {
  const seen = new Set();
  for (const e of ev(tl, "lightpix")) {
    for (const h of e.holes || []) {
      if (h.under == null || h.lift == null || h.under >= dark || h.lift >= lift) continue;
      const k = (h.box || []).map((v) => Math.round(v / 20)).join(",");
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-84", e.t, `the lit box [${h.box.join(",")}] over a dark thing (${h.under} bright under it) lifts it to ${h.lin}, by ${h.lift} of 255 (at least ${lift} wanted: the soft fill inside the box)`);
    }
  }
}

// 85
export function check85(r, tl, add) {
  const rounds = ev(tl, "replay");
  if (rounds.length < 2) return;
  const first = rounds[0], again = rounds[rounds.length - 1];
  // (the orchestrator, 30 Oct: a second round with another order loads only its own pictures (daar's garlic), and the pantry never
  // had the marble: what counts is a picture the second round draws as missing, and the worktop where the first round had it)
  if (again.missing > 0) add("contract-85", again.t, `after Play again ${again.missing} picture${again.missing > 1 ? "s are" : " is"} drawn as the missing-picture texture`);
  if (first.marble === true && again.marble === false) add("contract-85", again.t, "after Play again the worktop is not the painted marble (spr:bg:marble): it is drawn in code");
  const fx = (first.fx || []).filter((k) => !(again.keys || []).includes(k));
  if (fx.length) add("contract-85", again.t, `after Play again the fx textures are not loaded: ${fx.slice(0, 6).join(", ")}`);
}

// 86
export const KEEPOUT_MS = 400;          // a bubble on its way to its place (placed after its words) is not where the child sees it
export function check86(tl, add) {
  const seen = new Set();
  const evs = ev(tl, "keepout");
  evs.forEach((e, i) => {
    const until = (evs[i + 1] || { t: e.t + 1e9 }).t;
    if (until - e.t < KEEPOUT_MS) return;
    for (const b of e.bubbles || []) for (const p of e.panels || []) {
      const ox = Math.min(b[2], p.box[2]) - Math.max(b[0], p.box[0]);
      const oy = Math.min(b[3], p.box[3]) - Math.max(b[1], p.box[1]);
      if (!(ox > 8 && oy > 0)) continue;
      const room = e.play ? e.play[2] - Math.max(p.box[2], e.play[0]) : 0;
      if (room < b[2] - b[0] + 8) continue;     // no room beside the panel: the bubble may reach in
      const k = `${p.sel}|${Math.round(b[0] / 10)}|${Math.round(b[1] / 10)}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-86", e.t, `a bubble [${b.map(Math.round).join(",")}] reaches ${Math.round(ox)} px into ${p.tagged ? "the keep-out panel" : "the side panel"} ${p.sel} for ${Math.round(Math.min(until - e.t, 9999))} ms while the play area has ${Math.round(room)} px beside it`);
    }
  });
}

// 87
export const TWO_LIGHTS_MS = 300;       // a light handing over to the next may overlap for a frame or two
export function check87(tl, add) {
  const evs = ev(tl, "lit");
  for (let i = 0; i < evs.length; i++) {
    const e = evs[i];
    if (!(e.layers > 1)) continue;
    const until = (evs.slice(i + 1).find((x) => !(x.layers > 1)) || { t: e.t + 1e9 }).t;
    if (until - e.t < TWO_LIGHTS_MS) continue;
    add("contract-87", e.t, `${e.layers} light layers up together for ${Math.round(Math.min(until - e.t, 99999))} ms (boxes ${(e.holes || []).map((h) => `[${h.join(",")}]`).join(" ")}): the dims stack and one box outlives its step`);
    return;
  }
}

// 88
export function check88(tl, add) {
  const seen = new Set();
  // (the order's first giving, up to the station's start: a replay asked for later reads the card again, its own matter)
  const st = tl.find((e) => e.type === "c" && e.k === "life" && e.what === "stage-start" && /^cook:station/.test(e.reason || ""));
  const until = st ? st.t + 500 : Infinity;
  for (const e of ev(tl, "rows14").filter((x) => x.t <= until)) {
    for (const w of e.shown || []) seen.add(w);
    if (!(e.away > 0) || !seen.size) continue;
    const prev = ev(tl, "rows14").filter((x) => x.t < e.t).pop();
    const gone = (prev ? prev.shown || [] : []).filter((w) => !(e.shown || []).includes(w));
    // (a said person's card folding to face and headline as the next one speaks, SH-169, hides its rows without a slot: only rows
    // that went back to their dashed slots count, the slots' number grown)
    if (!gone.length || !prev || !(e.away > (prev.away || 0))) continue;
    add("contract-88", e.t, `the order card showed ${gone.map((w) => `"${w}"`).join(", ")} and then hid ${gone.length > 1 ? "them" : "it"} again as a dashed slot: the item seen before it was said`);
    return;
  }
}

// 89
export const HELPER_CALL_MS = 1500;
export function check89(r, tl, v, add) {
  if (!isCookFlow(r.flow)) return;
  const hs = ev(tl, "helper");
  if (!hs.length) return;
  const speed = +((/#speed(\d+)/.exec(r.flow || "") || [])[1] || 3); // (Cook's test speed, as contract-22 reads it)
  const lines = v.lines.filter((l) => l.role === "call" && (l.text || "").trim());
  for (const l of lines) {
    let st = null, openedAt = -Infinity;
    for (const h of hs) { if (h.t > l.t0) break; st = h; if (h.open) openedAt = h.t; }
    if (!st || !st.named || st.open) continue;
    // (the probe samples ten times a second: a helper that let its item go, or opened, within 200 ms of the line was not closed on it)
    if (hs.some((h) => h.t > l.t0 && h.t <= l.t0 + 200 && (!h.named || h.open))) continue;
    // (a control's call comes with its light, contract-78: a light up at the line, or coming within 400 ms of it, is that)
    const lits = ev(tl, "lit");
    let cur = null;
    for (const e of lits) { if (e.t > l.t0) break; cur = e; }
    if ((cur && cur.holes && cur.holes.length) || lits.some((e) => e.t > l.t0 && e.t <= l.t0 + 400 && e.holes && e.holes.length)) continue;
    if (l.t0 - openedAt <= HELPER_CALL_MS / speed) continue;
    add("contract-89", l.t0, `"${l.text.trim()}" was said while Nani's helper card named the item and was closed: the item said before her card shows it`);
    return;
  }
}
