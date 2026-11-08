// Sprint 19's part 1 (s19-checks; build/reports/s18-review-and-direction.md §2 and §10, the eye-judge experiment's change 1): the shared
// pieces are THERE, as code checks, numbered from 100. Each guards a named failure of Zafar's 8 Nov play (docs/process/regressions.md),
// read from what is on screen and in the shared logs, never from a game's own code. Registered in lib/contract.mjs (S19_CHECKS, checkS19)
// and probed by S19_HOOK (appended to CONTRACT_HOOK in lib/contract-hook.mjs). Cook flows only (the kitchen kit's pieces).
//   contract-100 kit-card     chai's 6 Nov item card and type on every order card and pop-up: no old card item, count box, strip,
//                             skewer or group box (SH-227, SH-241)
//   contract-101 nani-box     Nani's box is the kit's (the s14 box) with its drop-down in every station, and her line on one line
//                             wherever it fits at the floor size (SH-149, SH-240)
//   contract-102 kit-light    the kit's light only: no game's own ghost finger (Cook's S.ghost) and no glow outside the kit's light
//                             (Fable's maani flaw 3; s18 cause 7: mechanics keep their own ghost fingers; MAA-20)
//   contract-103 no-buttons   no tick, next or X (close) button on screen while a station plays (SH-238)
//   contract-104 card-pic     every item card has its picture, loaded, and never the shelf's crate, heap or pile (SH-242, SEK-24)
//   contract-105 light-whole  a first-time light is whole round its thing (the picture and its pill) and centred on it within 4 px;
//                             never half on a pan's handle (CK-63; s18 §6 Q6: contract-92 asked only about the neighbours)
//   contract-106 light-goes   the light goes within 300 ms of the child starting the move it shows (SH-236)
//   contract-107 hop-shelf    only shelf items hop when lit; a lit shelf item hops (SH-237)
//   contract-108 praise-last  no "well done" while a card row is still open (SH-239)
//   contract-109 shelf-line   the shelf's items stand on one base line and their pills on one chip line, in the bottom band (SH-243)
export const CENTRE_PX = 4;        // CK-63: the light's middle within this of its thing's middle
export const WHOLE_PX = 1;         // the thing may poke out of its light by at most this (rounding)
export const PIC_COVER = 0.6;      // a canvas picture with no word: its light covers at least this share of it (a pan's handle may poke out)
export const PIC_OFF = 0.2;        // ... and its middle is within this share of the picture's size of the picture's middle
export const GOES_MS = 300;        // SH-236: the light gone this soon after the move's first input
export const SAMPLE_SLACK_MS = 120; // the probe samples every 100 ms
export const HOLD_MS = 300;        // a state held this long is on screen (a frame or two of hand-over is not)
export const BAND_TOP = 630 / 900; // js/shared/shelf.js Shelf.BAND: the band is the bottom 30% of the 1600x900 design
export const BASE_TOL = 4;         // contract-109: a shelf item's foot this close to the line
export const CHIP_TOL = 2;         // ... and its pill's middle this close to the chip line
export const CRATE = /(crate|heap|pile|sack|basket)/i;
export const OLD_CARD = ".oc-box, .oc-strip, .oc-skewer, .oc-group, .oc-item:not(.oc-items14)";

const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");
const ev = (tl, k) => tl.filter((e) => e.type === "c" && e.k === k);
const life = (tl, w) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === w);
const box = (b) => Array.isArray(b) ? { l: b[0], t: b[1], r: b[2], b: b[3] } : b;
const mid = (b) => ({ x: (b.l + b.r) / 2, y: (b.t + b.b) / 2 });
const inBox = (p, b, pad = 0) => p.x >= b.l - pad && p.x <= b.r + pad && p.y >= b.t - pad && p.y <= b.b + pad;
const area = (b) => Math.max(0, b.r - b.l) * Math.max(0, b.b - b.t);
const inter = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
const fmt = (b) => `[${[b.l, b.t, b.r, b.b].map(Math.round).join(",")}]`;

// the station stages: [{t0, t1, key}] from the stage samples (lib/contract-hook.mjs: "cook:stationN:<view>", joined with other parts by |)
export function stations(tl) {
  const out = [];
  let cur = null;
  for (const e of ev(tl, "stage")) {
    const on = /(^|\|)cook:station/.test(e.key || "");
    if (cur && (!on || e.key !== cur.key)) { cur.t1 = e.t; out.push(cur); cur = null; }
    if (on && !cur) cur = { t0: e.t, t1: Infinity, key: e.key };
  }
  if (cur) out.push(cur);
  return out;
}
const inStation = (st, t) => st.some((s) => t >= s.t0 && t < s.t1);
// the value of the last `k` sample at or before t, and how long it stood
function held(list, i, tEnd) { const n = list[i + 1]; return (n ? n.t : tEnd) - list[i].t; }

export const S19_CHECKS = {
  "contract-100": { item: "kit-card", title: "chai's 6 Nov card and type on every order card", how: "Cook flows, in a station (the stage samples): every s19card sample (lib/contract-s19.mjs S19_HOOK: the side panel's order cards and the order pop-up) must show the 6 Nov type (<html class=\"njg-lora\">) and no old card piece: an old item (.oc-item that is not the 6 Nov row, .oc-items14), a count box (.oc-box), a top strip (.oc-strip), the old skewer or group box (.oc-skewer, .oc-group). One is a break, once per piece per page (SH-227, SH-241, Zafar 8 Nov: 'the relic of the old order card'; the 6 Nov card was on only for an all-chai order, ui.js applyType)." },
  "contract-101": { item: "nani-box", title: "Nani's box with its drop-down, her line on one line where it fits", how: "Cook flows: in each station that opens a step (life step-open), Nani's box (#guide) on screen must be the kit's s14 box (.ng-s14) and its drop-down (.ng-arrow) must show at least once before the station ends; a station without it is a break (SH-149; Zafar 8 Nov, maani and chaat: 'Nani only has a drop down', 'the missing drop-down'). Her line (.ng-line) on two or more lines while the same words at the floor size (the larger of 14 px and its --fit-min) fit one line of its box, held 300 ms, is a break too (SH-240: 'it could have easily fit on one line')." },
  "contract-102": { item: "kit-light", title: "the kit's light only: no game's own ghost finger or glow", how: "Cook flows, in a station: a ghost finger the game plays itself (Lifecycle ghost from Cook's S.ghost, which logs where it points: the mechanics' roll, stir, knead, fold and maani's tap ghosts) is a break, once per step name; the kit's light brings its own finger (Onboard). A glowing picture (njgTest.cook.glowing()) whose middle is outside every light box on screen, held 300 ms, is the game's own glow and a break (Fable's maani flaw 3: a gold ring round the tawa while the light is on the dough; s18 cause 7: mechanics keep their own ghost fingers; MAA-20 'just one finger')." },
  "contract-103": { item: "no-buttons", title: "no tick, next or X button while a station plays", how: "Cook flows, in a station: a tick, next or close button on screen (#done-btn, #go-btn, #samosa-next, .njg-done, .njg-next, [data-go], or a button reading ✓, →, × or labelled done, next or close; not the end screen, the order pop-up, the grown-ups' ? pop-up or the cog) is a break, once per button per page (SH-238, Zafar 8 Nov: 'no ticks in any of the games anymore ... you can't have an X button'). The flow still has to reach its end (the sandbox's own check)." },
  "contract-104": { item: "card-pic", title: "every item card has the item's own picture", how: "Cook flows: every 6 Nov item card on screen (.wc14 in the side panel or the order pop-up) must show a picture that loaded (an <img> with a source and a natural width, or a background image), and never the shelf's crate, heap, pile, sack or basket (its file name). A blank picture or a crate is a break, once per word per page (SH-242, Zafar 8 Nov: 'it's a crate of onions but it should be one onion'; SEK-24; Fable's eggs flaw 2, the blank card)." },
  "contract-105": { item: "light-whole", title: "the first-time light is whole round its thing and centred on it", how: "Cook flows: every light box on screen, once it has stood 300 ms (s19lit: the kit's drawn holes and the thing under each box's middle: a picture with a word and its pill, else the smallest canvas picture there, else an item card). Round a picture with its pill: the thing whole inside the box (1 px of rounding) and the box's middle within 4 px of the thing's, unless the box meets the screen's edge or stops short of a neighbour on that side (contract-92's rule). Round a picture with no word (a pan, a board): the box covers at least 60% of it and its middle is within a fifth of the picture's size of the picture's middle (a handle may poke out). A light only partly round its thing, or off its middle, is a break, once per thing per page (CK-63, Zafar 8 Nov: 'it's half on the handle ... way too small and it's off-centered like how can that pass'; s18 §6 Q6: contract-92 asked only about the neighbours). A light on a part smaller than a quarter of its thing is contract-97's." },
  "contract-106": { item: "light-goes", title: "the light goes as the child starts the move", how: "Cook flows: a real press (the input sample, a trusted pointerdown) inside a light box on screen starts the move it shows; within 300 ms (plus the probe's 100 ms sampling) that box must be gone (no box, or none round the press). A box still round the press after that is a break, once per page (SH-236, Zafar 8 Nov, maani's roll: 'I start rolling the box should go away')." },
  "contract-107": { item: "hop-shelf", title: "only shelf items hop", how: "Cook flows: every glowing picture that hops (njgTest.cook.glowing() bounce) must stand in the shelf band (its foot in the bottom 30% of the canvas, js/shared/shelf.js Shelf.BAND); a hop off the shelf (a pan, a board, the dough on the board) is a break. A shelf item lit by a light box of its own (its middle inside one) for 300 ms without its hop is a break too. Once per thing per page (SH-237, Zafar 8 Nov: 'items in the bottom bar bounce up and down')." },
  "contract-108": { item: "praise-last", title: "well done only once the whole card is ticked", how: "Cook flows, in a station: a well done (a line saying shabash) that starts while an order card row on screen is still open (the rows sample just before it: not done and not a no row) is a break, once per page (SH-239, Zafar 8 Nov: 'say well done when ... the whole menu card is complete')." },
  "contract-109": { item: "shelf-line", title: "the shelf's items on one base line, their pills on one chip line", how: "Cook flows: each s19shelf sample (the tappable pictures with a word whose foot is in the bottom band, with no glow on them: a hop lifts one) with three or more items: every item's foot within 4 px of the band's base line (the lowest feet's median) and every pill's middle within 2 px of the chip line (the pills' median). One off the line is a break, once per page (SH-243, Zafar 8 Nov: 'the bottom items they're not on a shelf like tea's'; Shelf.BAND: things stand on one base, pills centred on one chip line)." },
};

// 100
export function check100(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const st = stations(tl);
  const seen = new Set();
  for (const e of ev(tl, "s19card")) {
    if (!inStation(st, e.t) || !(e.cards > 0)) continue;
    if (!e.lora && !seen.has("type")) { seen.add("type"); add("contract-100", e.t, `the order cards are set in the old type (<html> has no njg-lora): chai's 6 Nov card and type are off in this game`); }
    for (const o of e.old || []) {
      if (seen.has(o)) continue;
      seen.add(o);
      add("contract-100", e.t, `an old order-card piece on screen: ${o} (only the 6 Nov item cards, no count box, strip, skewer or group box)`);
    }
  }
}

// 101
export function check101(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const st = stations(tl);
  const gs = ev(tl, "s19guide");
  const opens = life(tl, "step-open");
  for (const s of st) {
    if (!opens.some((o) => (o.at || o.t) >= s.t0 && (o.at || o.t) < s.t1)) continue;
    const g = gs.filter((e) => e.t >= s.t0 && e.t < s.t1 && e.shown);
    // (the sample standing as the station starts counts as well)
    const before = gs.filter((e) => e.t < s.t0).pop();
    if (before && before.shown) g.unshift(before);
    if (!g.length) continue;
    const old = g.find((e) => !e.s14);
    if (old) { add("contract-101", Math.max(old.t, s.t0), `Nani's box in ${s.key.split("|").pop()} is not the kit's s14 box (no .ng-s14): no drop-down, the old look`); continue; }
    if (!g.some((e) => e.arrow)) add("contract-101", s.t0, `Nani's box in ${s.key.split("|").pop()} never showed its drop-down (.ng-arrow) while the station played`);
  }
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  for (let i = 0; i < gs.length; i++) {
    const e = gs[i];
    if (!e.shown || !(e.lines > 1) || !e.fits1) continue;
    if (held(gs, i, tEnd) < HOLD_MS) continue;
    add("contract-101", e.t, `Nani's line "${(e.text || "").slice(0, 60)}" is on ${e.lines} lines though it fits one line of ${Math.round(e.room)} px at ${e.floor} px (${Math.round(e.need)} px)`);
    return;
  }
}

// 102
export function check102(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const st = stations(tl);
  const seen = new Set();
  for (const g of ev(tl, "s19ghost")) {
    if (!g.game || !inStation(st, g.at || g.t) || seen.has(g.step)) continue;
    seen.add(g.step);
    add("contract-102", g.at || g.t, `the game played its own ghost finger (${g.step}, a ${g.gesture || "move"}): the kit's light brings the one finger`);
  }
  const lits = ev(tl, "s19lit");
  const holesAt = (t) => { let cur = null; for (const e of lits) { if (e.t > t) break; cur = e; } return cur ? (cur.holes || []).map(box) : []; };
  const glows = ev(tl, "s19glow");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  for (let i = 0; i < glows.length; i++) {
    const e = glows[i];
    if (!inStation(st, e.t) || held(glows, i, tEnd) < HOLD_MS) continue;
    // (a light that comes or goes within the hold is the same help: judged at the hold's end too)
    const hs = holesAt(e.t), hs2 = holesAt(e.t + HOLD_MS);
    const out = (e.list || []).find((g) => { const m = mid(box(g.box)); return !hs.some((h) => inBox(m, h, 2)) && !hs2.some((h) => inBox(m, h, 2)); });
    if (!out || seen.has("glow:" + out.key)) continue;
    seen.add("glow:" + out.key);
    add("contract-102", e.t, `${out.key} glows ${fmt(box(out.box))} outside the kit's light${hs.length ? ` (the light is at ${hs.map(fmt).join(" ")})` : " (no light up)"}: the game's own glow`);
  }
}

// 103
export function check103(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const st = stations(tl);
  const seen = new Set();
  for (const e of ev(tl, "s19btn")) {
    if (!inStation(st, e.t)) continue;
    for (const b of e.list || []) {
      const k = b.sel + "|" + b.kind;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-103", e.t, `a ${b.kind} button on screen while the station plays: ${b.sel}${b.text ? ` "${b.text}"` : ""} (each step moves on by itself)`);
    }
  }
}

// 104
export function check104(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const seen = new Set();
  for (const e of ev(tl, "s19card")) {
    for (const p of e.pics || []) {
      if (seen.has(p.word)) continue;
      if (!p.src || !p.ok) { seen.add(p.word); add("contract-104", e.t, `the item card "${p.word}" has no picture${p.src ? ` (${p.src} did not load)` : ""}`); continue; }
      if (CRATE.test(p.src.split("/").pop())) { seen.add(p.word); add("contract-104", e.t, `the item card "${p.word}" shows the shelf's ${CRATE.exec(p.src.split("/").pop())[1]} (${p.src}), not one of the thing`); }
    }
  }
}

// 105
export function check105(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const lits = ev(tl, "s19lit");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  const seen = new Set();
  for (let i = 0; i < lits.length; i++) {
    const e = lits[i];
    if (!(e.holes || []).length || held(lits, i, tEnd) < HOLD_MS) continue;
    const W = e.vw || 1e9, H = e.vh || 1e9;
    (e.holes || []).forEach((hb, j) => {
      const h = box(hb), th = (e.things || [])[j];
      if (!th || !th.box) return;
      const t = box(th.box);
      const id = th.id || th.kind;
      if (seen.has(id)) return;
      const hm = mid(h), tm = mid(t);
      const near = (side) => (e.near || []).some((o0) => { const o = box(o0); if (side === "l") return o.r <= t.l + 1 && o.r >= h.l - 6 && Math.min(o.b, h.b) > Math.max(o.t, h.t); if (side === "r") return o.l >= t.r - 1 && o.l <= h.r + 6 && Math.min(o.b, h.b) > Math.max(o.t, h.t); if (side === "t") return o.b <= t.t + 1 && o.b >= h.t - 6 && Math.min(o.r, h.r) > Math.max(o.l, h.l); return o.t >= t.b - 1 && o.t <= h.b + 6 && Math.min(o.r, h.r) > Math.max(o.l, h.l); });
      const edge = { l: h.l <= 1, r: h.r >= W - 1, t: h.t <= 1, b: h.b >= H - 1 };
      if (th.kind === "word" || th.kind === "card") {
        if (inter(h, t) < 0.25 * area(t)) return; // (a light on a part of it: contract-97's)
        const poke = [["left", t.l < h.l - WHOLE_PX && !edge.l], ["right", t.r > h.r + WHOLE_PX && !edge.r], ["top", t.t < h.t - WHOLE_PX && !edge.t], ["bottom", t.b > h.b + WHOLE_PX && !edge.b]].filter((x) => x[1]).map((x) => x[0]);
        if (poke.length) { seen.add(id); add("contract-105", e.t, `the light ${fmt(h)} is not whole round ${id} ${fmt(t)} (its picture and pill): it pokes out at the ${poke.join(" and ")}`); return; }
        const dx = hm.x - tm.x, dy = hm.y - tm.y;
        const offX = Math.abs(dx) > CENTRE_PX && !(dx > 0 ? edge.l || near("l") : edge.r || near("r"));
        const offY = Math.abs(dy) > CENTRE_PX && !(dy > 0 ? edge.t || near("t") : edge.b || near("b"));
        if (offX || offY) { seen.add(id); add("contract-105", e.t, `the light ${fmt(h)} is off the middle of ${id} ${fmt(t)} by ${Math.round(dx)}, ${Math.round(dy)} px (within ${CENTRE_PX} px)`); }
        return;
      }
      // a canvas picture with no word (a pan, a board, a pot)
      const cover = inter(h, t) / Math.max(1, area(t));
      if (area(h) < 0.25 * area(t)) return; // (a part of it: contract-97's)
      const offX = Math.abs(hm.x - tm.x) / Math.max(1, t.r - t.l), offY = Math.abs(hm.y - tm.y) / Math.max(1, t.b - t.t);
      if (cover < PIC_COVER || offX > PIC_OFF || offY > PIC_OFF) {
        seen.add(id);
        add("contract-105", e.t, `the light ${fmt(h)} is ${cover < PIC_COVER ? `round ${Math.round(100 * cover)}% of` : "off the middle of"} ${id} ${fmt(t)} (middle off by ${Math.round(100 * offX)}%, ${Math.round(100 * offY)}% of its size): it should sit whole round it`);
      }
    });
  }
}

// 106
export function check106(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const lits = ev(tl, "s19lit");
  if (!lits.length) return;
  const holesAt = (t) => { let cur = null; for (const e of lits) { if (e.t > t) break; cur = e; } return cur ? (cur.holes || []).map(box) : []; };
  for (const p of ev(tl, "input")) {
    const pt = { x: p.x, y: p.y };
    const h0 = holesAt(p.t).find((h) => inBox(pt, h));
    if (!h0) continue;
    const until = p.t + GOES_MS + SAMPLE_SLACK_MS;
    // gone: some sample between the press and the deadline with no box round the press
    const after = lits.filter((e) => e.t > p.t && e.t <= until);
    if (after.some((e) => !(e.holes || []).map(box).some((h) => inBox(pt, h)))) continue;
    if (!holesAt(until).some((h) => inBox(pt, h))) continue;
    const goneAt = lits.find((e) => e.t > until && !(e.holes || []).map(box).some((h) => inBox(pt, h)));
    add("contract-106", p.t, `the light ${fmt(h0)} stayed round the child's press at (${p.x}, ${p.y}) ${goneAt ? `for ${Math.round(goneAt.t - p.t)} ms` : "to the end of the page"}: it goes within ${GOES_MS} ms of the move's start`);
    return;
  }
}

// 107
export function check107(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const glows = ev(tl, "s19glow");
  const lits = ev(tl, "s19lit");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  const seen = new Set();
  for (const e of glows) {
    const cv = e.canvas ? box(e.canvas) : null;
    if (!cv) continue;
    const band = cv.t + BAND_TOP * (cv.b - cv.t) - 2;
    for (const g of e.list || []) {
      if (!g.bounce || seen.has(g.key)) continue;
      const b = box(g.box);
      if (b.b >= band) continue;
      seen.add(g.key);
      add("contract-107", e.t, `${g.key} hops when lit, off the shelf (its foot at ${Math.round(b.b)} px, the band starts at ${Math.round(band)}): only shelf items hop`);
    }
  }
  // a shelf item in a light of its own, held, with no hop
  for (let i = 0; i < lits.length; i++) {
    const e = lits[i];
    if (held(lits, i, tEnd) < HOLD_MS || !e.vh) continue;
    (e.holes || []).forEach((hb, j) => {
      const th = (e.things || [])[j];
      if (!th || th.kind !== "word" || !th.shelf || seen.has("still:" + th.id)) return;
      let g = null;
      for (const x of glows) { if (x.t > e.t + HOLD_MS) break; g = x; }
      const hop = g && (g.list || []).some((x) => x.bounce && inBox(mid(box(x.box)), box(hb), 2));
      if (hop) return;
      seen.add("still:" + th.id);
      add("contract-107", e.t, `the shelf item ${th.id} is lit ${fmt(box(hb))} without its hop`);
    });
  }
}

// 108
export function check108(r, tl, v, add) {
  if (!isCookFlow(r.flow)) return;
  const st = stations(tl);
  const rows = ev(tl, "rows");
  for (const l of v.lines || []) {
    if (!/shabash/i.test(l.text || "") || !inStation(st, l.t0)) continue;
    let cur = null;
    for (const e of rows) { if (e.t > l.t0) break; cur = e; }
    const open = ((cur && cur.list) || []).filter((x) => !x.done && !x.no);
    if (!open.length) continue;
    add("contract-108", l.t0, `"${(l.text || "").trim()}" was said with ${open.length} card row${open.length > 1 ? "s" : ""} still open (${open.slice(0, 3).map((x) => `"${x.text}"`).join(", ")}): well done once the whole card is ticked`);
    return;
  }
}

// 109
export function check109(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  for (const e of ev(tl, "s19shelf")) {
    const it = e.items || [];
    if (it.length < 3) continue;
    const base = med(it.map((x) => x.foot)), chip = it.some((x) => x.chip != null) ? med(it.filter((x) => x.chip != null).map((x) => x.chip)) : null;
    const off = it.find((x) => Math.abs(x.foot - base) > BASE_TOL);
    if (off) { add("contract-109", e.t, `the shelf item ${off.id} stands ${Math.round(off.foot - base)} px off the base line (${Math.round(base)} px): one line for every item`); return; }
    const offc = chip == null ? null : it.find((x) => x.chip != null && Math.abs(x.chip - chip) > CHIP_TOL);
    if (offc) { add("contract-109", e.t, `the pill under ${offc.id} sits ${Math.round(offc.chip - chip)} px off the chip line (${Math.round(chip)} px): one line for every pill`); return; }
  }
}

export function checkS19(r, tl, v, add) {
  check100(r, tl, add);
  check101(r, tl, add);
  check102(r, tl, add);
  check103(r, tl, add);
  check104(r, tl, add);
  check105(r, tl, add);
  check106(r, tl, add);
  check107(r, tl, add);
  check108(r, tl, v, add);
  check109(r, tl, add);
}

// ---- the S19 probe: what the checks above read. A function, not a string: the page gets its source ----
//   k: "s19card"  {cards, lora, old: [sel], pics: [{word, src, ok}]}   the side panel's order cards and the order pop-up: the 6 Nov
//                                        type, any old card piece on screen, each item card's picture (100, 104)
//   k: "s19guide" {shown, s14, arrow, lines, fits1, text, room, need, floor}   Nani's box (#guide), its drop-down, her line (101)
//   k: "s19ghost" {step, gesture, game, at}   a ghost finger played (Lifecycle ghost); game: Cook's S.ghost (it logs where it points) (102)
//   k: "s19glow"  {list: [{key, bounce, box}], canvas}   the glowing pictures (njgTest.cook.glowing()) and the canvas's box (102, 107)
//   k: "s19btn"   {list: [{sel, kind, text}]}   a tick, next or close button on screen outside the end screen, pop-ups and cog (103)
//   k: "s19lit"   {holes, things, near, vw, vh}   the kit's light boxes, the thing under each box's middle, the other things with a word (105-107)
//   k: "s19shelf" {items: [{id, foot, chip}]}   the shelf's pictures with a word, their feet and their pills' middles (109)
function s19hook() {
  if (window.__njgS19Hook) return;
  window.__njgS19Hook = true;
  const emit = (e) => {
    try {
      e.type = "c"; e.t = Date.now(); e.page = location.pathname.replace(/^\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) { /* a probe only */ }
  };
  const safe = (f, d = null) => { try { return f(); } catch (e) { return d; } };
  const R = (r) => [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)];
  const shown = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    let o = 1;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden") return false; o *= parseFloat(cs.opacity); }
    return o > 0.2;
  };
  const desc = (el) => { const c = typeof el.className === "string" ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".") : ""; return el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (c ? "." + c : ""); };
  const last = {};
  const same = (k, v) => { const j = JSON.stringify(v); if (last[k] === j) return true; last[k] = j; return false; };
  const games = () => { const g = (window.__njgGames || []).slice(); if (!g.length && window.Cook && window.Cook.game) g.push(window.Cook.game); return g.filter((x) => x && x.canvas && x.canvas.isConnected && x.scene); };

  // ---- the order cards (100, 104) ----
  const popup = () => [...document.querySelectorAll(".njg-rq-card, .wc14-pop")].filter(shown);
  const cardsNow = () => {
    const side = [...document.querySelectorAll("#side .oc-card, #mission .oc-card")].filter((c) => shown(c) && !c.closest(".njg-results"));
    const roots = side.concat(popup());
    if (!roots.length) return { cards: 0, lora: document.documentElement.classList.contains("njg-lora"), old: [], pics: [] };
    const old = new Set();
    for (const r0 of roots) for (const x of r0.querySelectorAll(".oc-box, .oc-strip, .oc-skewer, .oc-group, .oc-item:not(.oc-items14)")) if (shown(x)) old.add("." + [...x.classList].filter((c) => /^oc-(box|strip|skewer|group|item)$/.test(c)).join("."));
    const pics = [];
    const cards = new Set();
    for (const r0 of roots) { if (r0.matches(".wc14")) cards.add(r0); for (const w of r0.querySelectorAll(".wc14")) cards.add(w); }
    for (const w of cards) {
      if (!shown(w)) continue;
      const k = w.querySelector(".wc14-k, .wc-k");
      const word = ((k && k.textContent) || "").replace(/\s+/g, " ").trim().slice(0, 30) || (w.dataset.word || "?");
      const slot = w.querySelector(".wc14-pic, .wc-pic");
      if (!slot) continue;
      const img = slot.querySelector("img");
      let src = img ? (img.getAttribute("src") || "") : "";
      let ok = !!(img && img.complete && img.naturalWidth > 0);
      if (!img) { const bg = getComputedStyle(slot).backgroundImage || ""; const m = /url\(["']?([^"')]+)/.exec(bg); if (m) { src = m[1]; ok = true; } }
      // (a hidden picture, the L3 blur's eye, is still the picture: only its file is read)
      pics.push({ word, src: src.replace(location.origin + "/", "").split("?")[0], ok });
    }
    return { cards: roots.length, lora: document.documentElement.classList.contains("njg-lora"), old: [...old], pics: pics.slice(0, 30) };
  };

  // ---- Nani's box (101) ----
  const guideNow = () => {
    const g = document.querySelector("#guide");
    if (!g || !shown(g)) return { shown: false };
    const a = g.querySelector(".ng-arrow");
    const line = g.querySelector(".ng-line");
    const out = { shown: true, s14: g.classList.contains("ng-s14"), arrow: !!(a && shown(a)), lines: 0, fits1: false };
    if (line && shown(line) && (line.textContent || "").trim()) {
      const range = document.createRange();
      range.selectNodeContents(line);
      const tops = new Set([...range.getClientRects()].filter((q) => q.width > 1).map((q) => Math.round(q.top / 4)));
      out.lines = tops.size;
      const cs = getComputedStyle(line);
      const floor = Math.max(14, parseFloat(cs.getPropertyValue("--fit-min")) || 0);
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;left:-9999px;top:0;white-space:nowrap;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};font-style:${cs.fontStyle};letter-spacing:${cs.letterSpacing};font-size:${floor}px`;
      probe.textContent = line.textContent.replace(/\s+/g, " ").trim();
      document.body.appendChild(probe);
      const need = probe.getBoundingClientRect().width;
      probe.remove();
      const say = line.parentElement || line;
      const ps = getComputedStyle(say);
      const room = say.clientWidth - (parseFloat(ps.paddingLeft) || 0) - (parseFloat(ps.paddingRight) || 0);
      Object.assign(out, { text: probe.textContent.slice(0, 80), floor, need: Math.round(need), room: Math.round(room), fits1: need <= room - 1 });
    }
    return out;
  };

  // ---- ghost fingers (102) ----
  const ghostSeen = new WeakSet();
  const ghosts = () => {
    const L = window.Lifecycle && window.Lifecycle.log;
    if (!L || !L.length) return;
    for (const x of L) {
      if (!x || typeof x !== "object" || x.what !== "ghost" || ghostSeen.has(x)) continue;
      ghostSeen.add(x);
      emit({ k: "s19ghost", step: String(x.step || x.reason || ""), gesture: x.gesture || null, game: !!(x.at && typeof x.at === "object"), at: +x.t || Date.now() });
    }
  };

  // ---- glows (102, 107) ----
  const glowsNow = () => {
    const T = window.njgTest && window.njgTest.cook;
    const g = games()[0];
    if (!T || typeof T.glowing !== "function" || !g) return null;
    const list = (T.glowing() || []).map((x) => ({ key: x.key, bounce: !!x.bounce, box: [Math.round(x.box.left), Math.round(x.box.top), Math.round(x.box.left + x.box.width), Math.round(x.box.top + x.box.height)] }));
    return { list, canvas: R(g.canvas.getBoundingClientRect()) };
  };

  // ---- tick, next and close buttons (103) ----
  const BTN = "#done-btn, #go-btn, #samosa-next, .njg-done, .njg-next, [data-go], .njg-close, [data-close]";
  const btnKind = (b) => {
    const t = (b.textContent || "").trim(), a = ((b.getAttribute("aria-label") || "") + " " + (b.title || "")).toLowerCase();
    if (b.matches("#done-btn, .njg-done") || /^[✓✔]$/.test(t) || /\bdone\b/.test(a)) return "tick";
    if (b.matches("#go-btn, #samosa-next, .njg-next, [data-go]") || /^[→➜➔>]$/.test(t) || /\b(next|go on|continue)\b/.test(a)) return "next";
    if (b.matches(".njg-close, [data-close]") || /^[×✕✖xX]$/.test(t) || /\bclose\b/.test(a)) return "close";
    return null;
  };
  const buttonsNow = () => {
    const out = [];
    for (const b of document.querySelectorAll("button, [role=button], " + BTN)) {
      if (b.closest(".njg-results, .njg-rq-veil, #intro, #help-pop, .gb-pop, .njg-gb, #btn-help, .njg-cog, #cog, .rs-root, .njg-say, .ng-arrow")) continue;
      if (b.matches("#btn-help, .njg-cog, .ng-face, .ng-mute, .wc14-spk, .oc-spk, .njg-pill")) continue;
      const kind = btnKind(b);
      if (!kind || !shown(b) || b.disabled) continue;
      out.push({ sel: desc(b), kind, text: (b.textContent || "").trim().slice(0, 12) });
    }
    return out;
  };

  // ---- the light and its thing (105-107), the shelf's line (109) ----
  const holesNow = () => {
    const out = [];
    for (const l of document.querySelectorAll(".njg-onboard")) {
      if (!l.classList.contains("on")) continue;
      let hs = [];
      try { hs = JSON.parse(l.dataset.holes || "[]"); } catch (e) { /* none */ }
      for (const h of hs) out.push([Math.round(h.x), Math.round(h.y), Math.round(h.x + h.w), Math.round(h.y + h.h)]);
    }
    return out;
  };
  const scan = () => {
    const words = [], pics = [];
    const g = games()[0];
    if (!g) return { words, pics, cv: null };
    const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
    for (const sc of g.scene.getScenes(true)) {
      const cam = sc.cameras.main;
      const P = (x, y) => [cr.left + (x - cam.worldView.x) * kx * cam.zoom, cr.top + (y - cam.worldView.y) * ky * cam.zoom];
      const walk = (list) => {
        for (const o of list) {
          if (!o || o.visible === false || o.alpha === 0) continue;
          if (o.list) walk(o.list);
          if (!o.getBounds) continue;
          const b = safe(() => o.getBounds());
          if (!b) continue;
          const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom);
          if (o.wordId && o.input && o.input.enabled) {
            const ch = o.chip;
            let chipBox = null;
            if (ch && ch.active && ch.cardW) { const sx = Math.abs(ch.scaleX || 1), sy = Math.abs(ch.scaleY || 1), hw = (ch.cardW / 2) * sx, hh = ((ch.cardH || 46) / 2) * sy; const [cl, ct] = P(ch.x - hw, ch.y - hh), [cr2, cb] = P(ch.x + hw, ch.y + hh); chipBox = [cl, ct, cr2, cb]; }
            // (a glowing thing hops: its foot is read from where it stands, glowFx.y, not mid-hop)
            const foot = o.glowFx && o.glowFx.y != null ? bt + (o.glowFx.y - o.y) * ky * cam.zoom : bt;
            words.push({ id: String(o.wordId), pic: [l, t, r, bt], chip: chipBox, foot, glow: !!o.glowFx });
          } else if (o.texture && o.texture.key && !/^__/.test(o.texture.key) && (o.type === "Image" || o.type === "Sprite")) {
            pics.push({ id: o.texture.key, box: [l, t, r, bt] });
          }
        }
      };
      safe(() => walk(sc.children.list));
    }
    return { words, pics, cv: [cr.left, cr.top, cr.right, cr.bottom] };
  };
  const u = (a, b) => b ? [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])] : a;
  const rnd = (b) => b.map(Math.round);
  const litNow = (holes) => {
    if (!holes.length) return { holes: [], things: [], near: [] };
    const s = scan();
    const cvA = s.cv ? (s.cv[2] - s.cv[0]) * (s.cv[3] - s.cv[1]) : 1;
    const band = s.cv ? s.cv[1] + (630 / 900) * (s.cv[3] - s.cv[1]) - 2 : Infinity;
    const things = holes.map((h) => {
      const cx = (h[0] + h[2]) / 2, cy = (h[1] + h[3]) / 2;
      const inside = (b) => cx >= b[0] && cx <= b[2] && cy >= b[1] && cy <= b[3];
      const w = s.words.find((x) => inside(u(x.pic, x.chip)));
      if (w) return { kind: "word", id: w.id, box: rnd(u(w.pic, w.chip)), shelf: w.foot >= band };
      for (const el of document.elementsFromPoint(cx, cy)) {
        if (el.closest(".njg-onboard")) continue;
        const c = el.closest(".wc14");
        if (c) return { kind: "card", id: "card:" + (((c.querySelector(".wc14-k, .wc-k") || {}).textContent || "").trim().slice(0, 20)), box: rnd(R(c.getBoundingClientRect())) };
        if (el.tagName === "CANVAS") break;
        break;
      }
      const ar = (b) => (b[2] - b[0]) * (b[3] - b[1]);
      const p = s.pics.filter((x) => inside(x.box) && ar(x.box) < 0.3 * cvA && ar(x.box) > 0).sort((a, b) => ar(a.box) - ar(b.box))[0];
      return p ? { kind: "pic", id: p.id, box: rnd(p.box) } : null;
    });
    const near = s.words.map((x) => rnd(u(x.pic, x.chip)));
    return { holes, things, near, vw: innerWidth, vh: innerHeight };
  };
  const shelfNow = () => {
    const s = scan();
    if (!s.cv) return null;
    const band = s.cv[1] + (630 / 900) * (s.cv[3] - s.cv[1]);
    const items = s.words.filter((x) => x.foot >= band && !x.glow).map((x) => ({ id: x.id, foot: Math.round(x.foot), chip: x.chip ? Math.round((x.chip[1] + x.chip[3]) / 2) : null }));
    return items.length ? { items } : null;
  };

  let shelfAt = 0;
  setInterval(() => {
    try {
      if (window.__njgFilm) return;
      ghosts();
      const c = safe(cardsNow, null);
      if (c && !same("s19card", [c.cards > 0, c.lora, c.old, c.pics.map((p) => p.word + p.src + p.ok)])) emit({ k: "s19card", ...c });
      const gd = safe(guideNow, null);
      if (gd && !same("s19guide", [gd.shown, gd.s14, gd.arrow, gd.lines, gd.fits1, gd.text])) emit({ k: "s19guide", ...gd });
      const gl = safe(glowsNow, null);
      if (gl && !same("s19glow", gl.list.map((x) => [x.key, x.bounce, x.box.map((v) => Math.round(v / 8))]))) emit({ k: "s19glow", ...gl });
      const bt = safe(buttonsNow, []);
      if (!same("s19btn", bt.map((b) => b.sel + b.kind))) emit({ k: "s19btn", list: bt });
      const hs = safe(holesNow, []);
      if (!same("s19holes", hs)) { const lt = safe(() => litNow(hs), { holes: hs, things: [], near: [] }); emit({ k: "s19lit", ...lt }); }
      if (Date.now() - shelfAt > 1000) {
        shelfAt = Date.now();
        const sh = safe(shelfNow, null);
        if (sh && !same("s19shelf", sh.items.map((x) => [x.id, Math.round(x.foot / 2), x.chip == null ? null : Math.round(x.chip / 2)]))) emit({ k: "s19shelf", ...sh });
      }
    } catch (e) { /* a probe only */ }
  }, 100);
}
export const S19_HOOK = `(${s19hook.toString()})()`;
