// Sprint 17's checks (the three missing ones of docs/process/checks-to-build.md and SH-232's), numbered from 96. Registered in
// lib/contract.mjs (S17_CHECKS, checkS17), so the builder of these checks never edits contract.mjs. Each reads what the probes recorded
// (the S14 probe's lit events, and the S17 probe in lib/contract-hook.mjs: litthing, reveal, panel, fold), never the game's own notes
// where a picture can say it; the one note read is the pot's own boil log (life chai-boil), since a boil-over has no other trace.
//   contract-96 boil-reopen   after a boil-over the pot's rows open again and its card shows the first item (CHAI-57, row 26)
//   contract-97 zoom-in       a light on a part smaller than a quarter of its thing starts on the thing and shrinks onto the part (SH-213)
//   contract-98 lesson-shown  a first-time lesson due (the dotted word, the blurred picture) logs reveal-lesson shown (SH-196)
//   contract-99 panel-follow  after a served card folds in play the panel ends with the next card at its planned place (SH-232)
export const ZOOM_PART = 0.25;          // a part smaller than this share of its thing starts on the whole thing
export const ZOOM_WHOLE = 0.6;          // ... and its first box covers at least this much of the whole thing (a face circle may trim it)
export const REOPEN_MS = 1500;          // from the pot starting again to its rows open and its card at the first item
export const FOLD_MS = 420;             // the fold's own time (js/shared/order-card.js FOLD_MS)
export const FOLLOW_MS = FOLD_MS + 400; // ... and the panel has the next card in place by then (SH-232)
export const PLACE_PX = 4;              // the next card's top sits this far below the panel's top
export const PLACE_TOL = 2;             // px of slack on the scroll

const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");
const ev = (tl, k) => tl.filter((e) => e.type === "c" && e.k === k);
const life = (tl, w) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === w);
const area = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
const inter = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
const pct = (v) => `${Math.round(100 * v)}%`;
// a page that starts with every first-time help seen (a returning player, the take-back path, the evidence loop's seen profiles) has no first time
const NOT_NEW = (r) => /#(returning|takeback)\b/.test(String(r.flow || "")) || ["returning", "seen", "numbers-known"].includes(String(r.profile || ""));

export const S17_CHECKS = {
  "contract-96": { item: "boil-reopen", title: "after a boil-over the pot's rows open and its card shows the first item", how: "Cook flows: every heat ring the kitchen kit draws (s19ring) that goes past its green and empties by itself (cleared, or back to 0, with no tap in the 400 ms before: a boil-over) while the order card had ticked cards: within 1500 ms some ticked card must open again (the s19pad sample) and the card's row come back to its first item (s19row at 2 px or less). Either missing is a break (CHAI-105, CHAI-57). No opt-in (s19-checks-2): it read chai's own chai-boil note." },
  "contract-97": { item: "zoom-in", title: "a light on a small part starts on the whole thing and shrinks onto the part", how: "Every light that comes up on a part smaller than a quarter of the thing it sits on (the S14 probe's lit boxes over time, and the S17 probe's litthing: the item card or order card under the light's middle): its first box must cover at least 60% of the whole thing, then shrink onto the part. A light drawn straight on the part (its first box smaller than a quarter of the thing) is a break, named with the sizes (SH-213, Zafar 5 Nov: 'initially the whole item card is highlighted, and then it quickly zooms in ... see if we can make it a generalizable principle/rule'; Onboard.light zoomFrom). A part with no DOM thing round it (a knob's mark on the canvas) is not read yet." },
  "contract-98": { item: "lesson-shown", title: "a first-time lesson due is shown", how: "Cook flows for a new player (not #returning, #takeback or a seen profile): when the order panel shows a dotted word (the S17 probe's reveal sample: the game's own selectors for the lesson's targets) after the station starts, a life reveal-lesson word whose by begins 'shown' must follow; a blurred picture, the same for reveal-lesson pic. Only none-in-view, or no reveal-lesson at all, is a break, once per step (SH-196, Zafar's recorded play 6 Nov, L2 New player: a tap during the order skipped it and the cards still landing, no lesson came; the paths #tap-mid-order and #slow-cards play it)." },
  "contract-99": { item: "panel-follow", title: "after a served card folds the panel shows the next card in its place", how: "Cook flows: every served card (done) that folds in play (the S17 probe's fold: a card going from open to folded) must leave the order panel, within the fold's time (420 ms) plus 400 ms, with the next card (the person the station is on, else the card speaking, else the first card after it that is not done) either whole in view or at its planned place: its top 4 px below the panel's top, 0 when the whole list fits, clamped to the scroll range (2 px of slack). A panel left where it was, the next card cut or under the top, is a break (SH-232, Zafar 7 Nov, phone L4: 'it scrolled down the left panel as if it had never been scrolled ... the better logic would have been to scroll the left menu such that the second order card found itself in the desired correct position')." },
};

// 96
// 96: judged in lib/contract-s19b.mjs since s19-checks-2 (from the heat ring and the card as drawn; it read chai's chai-boil note)

// 97
export function check97(tl, add) {
  const lits = ev(tl, "lit"), things = ev(tl, "litthing");
  if (!lits.length || !things.length) return;
  let i = 0;
  while (i < lits.length) {
    if (!(lits[i].holes && lits[i].holes.length)) { i++; continue; }
    let j = i;
    while (j + 1 < lits.length && lits[j + 1].holes && lits[j + 1].holes.length) j++;
    const first = lits[i], end = lits[j];
    i = j + 1;
    const th = things.find((x) => x.thing && x.t >= first.t - 250 && x.t <= first.t + 600);
    if (!th) continue;
    const T = th.thing, H0 = first.holes[0], HL = end.holes[0];
    if (!(area(T) > 0) || !(area(H0) > 0) || !(area(HL) > 0)) continue;
    const small = area(HL) < ZOOM_PART * area(T) && inter(HL, T) >= 0.9 * area(HL);   // the settled box is a part of the thing
    if (!small) continue;
    const dims = (b) => `${Math.round(b[2] - b[0])}x${Math.round(b[3] - b[1])}`;
    if (area(H0) < ZOOM_PART * area(T)) {
      add("contract-97", first.t, `the light on a ${dims(HL)} part of a ${dims(T)} ${th.sel || "thing"} starts straight on the part (${dims(H0)}), not on the whole thing first`);
      return;
    }
    const cover = inter(H0, T) / area(T);
    if (cover < ZOOM_WHOLE) {
      add("contract-97", first.t, `the light on a ${dims(HL)} part of a ${dims(T)} ${th.sel || "thing"} starts on ${pct(cover)} of the thing (${dims(H0)}), not the whole of it`);
      return;
    }
  }
}

// 98
export function check98(r, tl, add) {
  if (!isCookFlow(r.flow) || NOT_NEW(r)) return;
  const rv = ev(tl, "reveal");
  if (!rv.length) return;
  const st = life(tl, "stage-start").find((n) => /^cook:station/.test(n.reason || ""));
  const t0 = st ? st.t : -Infinity;
  const lessons = life(tl, "reveal-lesson").map((n) => ({ step: String(n.step || n.reason || ""), by: String(n.by || ""), t: n.at || n.t }));
  for (const [step, key, what] of [["word", "dots", "dotted word"], ["pic", "eyes", "blurred picture"]]) {
    const due = rv.find((e) => e.t >= t0 && e[key] > 0);
    if (!due) continue;
    if (lessons.some((l) => l.step === step && /^shown/.test(l.by))) continue;
    const got = lessons.filter((l) => l.step === step);
    add("contract-98", due.t, `a ${what} showed on the order panel and the first-time lesson for it was ${got.length ? `not shown (${got.map((l) => l.by.slice(0, 60)).join("; ")})` : "never logged"}`);
  }
}

// 99
export function check99(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const panels = ev(tl, "panel");
  if (!panels.length) return;
  for (const f of ev(tl, "fold")) {
    const at = f.at || f.t;
    let p = null;
    for (const e of panels) { if (e.t > at + FOLLOW_MS) break; p = e; }
    // (a sample before the fold is the panel as it stood: nothing changed since, or the probe would have sampled it)
    if (!p || !p.cards || p.cards.length < 2) continue;
    const next = nextCard(p, f.who);
    if (!next) continue;
    const view = p.view, max = Math.max(0, p.sh - view), st = p.st;
    const top = next.top, bottom = next.top + next.h;
    // whole in view where it is: nothing was asked to move
    if (top >= -1 && bottom <= view + 1) continue;
    const aim = max <= 1 ? 0 : Math.max(0, Math.min(max, st + top - PLACE_PX));
    if (Math.abs(aim - st) <= PLACE_TOL) continue;
    add("contract-99", at, `after ${f.who}'s card folded, ${next.who}'s card is ${top < 0 ? `${Math.round(-top)} px above the panel's top` : `${Math.round(top)} px down, cut at the foot (${Math.round(bottom - view)} px over)`} ${FOLLOW_MS} ms on, with the panel at ${Math.round(st)} (its planned place: ${Math.round(aim)} of ${Math.round(max)})`);
    return;
  }
}

// the card in progress when `who` folded: the person the station is on, else the card speaking, else the first card after it not done
function nextCard(p, who) {
  const open = (p.cards || []).filter((c) => c.who !== who && !c.done);
  const i = (p.cards || []).findIndex((c) => c.who === who);
  return open.find((c) => p.focus && c.who === p.focus) || open.find((c) => c.speaking) || (p.cards || []).slice(i + 1).find((c) => !c.done) || open[0] || null;
}

export function checkS17(r, tl, v, add) {
  check97(tl, add);
  check98(r, tl, add);
  check99(r, tl, add);
}
