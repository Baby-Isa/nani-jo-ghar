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
//   contract-110 knob-side    the knob rule (SH-247): in a game with only ever one pan the knob and the face sit to the pan's left,
//                             centred on its height, clear of it and of the side panel; with several pans (chai) below each
//   contract-111 item-reach   an item's tap area reaches its pill (SH-244): a tap at a shelf item's foot, or just above its pill,
//                             picks the item, never the word; a tap on the pill still says the word
export const CENTRE_PX = 4;        // CK-63: the light's middle within this of its thing's middle
export const WHOLE_PX = 1;         // the thing may poke out of its light by at most this (rounding)
export const PIC_COVER = 0.6;      // a canvas picture with no word: its light covers at least this share of it (a pan's handle may poke out)
export const REGION = 2.5;         // a light more than this many times its card's area frames a region, not the card (STD-E2-08)
export const PIC_OFF = 0.2;        // ... and its middle is within this share of the picture's size of the picture's middle
export const GOES_MS = 300;        // SH-236: the light gone this soon after the move's first input
export const SAMPLE_SLACK_MS = 120; // the probe samples every 100 ms
export const HOLD_MS = 300;        // a state held this long is on screen (a frame or two of hand-over is not)
export const BAND_TOP = 630 / 900; // js/shared/shelf.js Shelf.BAND: the band is the bottom 30% of the 1600x900 design
export const BASE_TOL = 4;         // contract-109: a shelf item's foot this close to the line
export const CHIP_TOL = 2;         // ... and its pill's middle this close to the chip line
export const LOAD_MS = 600;        // contract-104: a picture not in after this long is blank (a card drawn again reloads its pictures)
export const CARD_PART = 0.5;      // contract-105: a light round less than this share of an item card is on a part of it (contract-97's)
// contract-105: a picture whose key says it is a shadow, halo, glow, dim or light is never the lit thing (the final 8 Nov run judged
// two lights against a pan's contact shadow); kept in the probe's scan below, the same words
export const KNOB_CLEAR = 2;       // contract-110: the knob and the face this clear of the pan's picture and of the side panel
export const KNOB_MID = 0.08;      // ... and their middle within this share of the pan's height (at least 8 px) of the burner's middle
export const FOOT_IN = 4;
export const TAP_HOLD_MS = 900;    // contract-111: a shelf's tap areas judged once they have stood this long (the probe samples once a second)          // contract-111: the foot's tap this many CSS px inside the item's picture, above its lowest edge
export const NOT_A_THING = /shadow|shade|halo|glow|dim|light/i;
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
  "contract-101": { item: "nani-box", title: "Nani's box with its drop-down, her line on one line where it fits", how: "Cook flows: in each station that opens a step (life step-open), Nani's box (#guide) on screen must be the kit's s14 box (.ng-s14) and its drop-down (.ng-arrow) must show at least once before the station ends; a station without it is a break (SH-149; Zafar 8 Nov, maani and chaat: 'Nani only has a drop down', 'the missing drop-down'). Her line (.ng-line) on two or more lines while the same words at the floor size (the larger of 14 px and its --fit-min) fit one line of its box, held 300 ms, is a break too (SH-240: 'it could have easily fit on one line'); a grey to-record English line is not judged (it is going away: Zafar, 6 Nov, SH-224)." },
  "contract-102": { item: "kit-light", title: "the kit's light only: no game's own ghost finger or glow", how: "Cook flows, in a station: a ghost finger the game plays itself (Lifecycle ghost from Cook's S.ghost, which logs where it points: the mechanics' roll, stir, knead, fold and maani's tap ghosts) is a break, once per step name; the kit's light brings its own finger (Onboard). A glowing picture (njgTest.cook.glowing()) whose middle is outside every light box on screen, held 300 ms, is the game's own glow and a break (a kit piece's own glow, kit-*, the pan's heat ring at its window, is the kit's) (Fable's maani flaw 3: a gold ring round the tawa while the light is on the dough; s18 cause 7: mechanics keep their own ghost fingers; MAA-20 'just one finger')." },
  "contract-103": { item: "no-buttons", title: "no tick, next or X button while a station plays", how: "Cook flows, in a station: a tick, next or close button on screen (#done-btn, #go-btn, #samosa-next, .njg-done, .njg-next, [data-go], or a button reading ✓, →, × or labelled done, next or close; not the end screen, the order pop-up, the grown-ups' ? pop-up or the cog) is a break, once per button per page (SH-238, Zafar 8 Nov: 'no ticks in any of the games anymore ... you can't have an X button'). The flow still has to reach its end (the sandbox's own check)." },
  "contract-104": { item: "card-pic", title: "every item card has the item's own picture", how: "Cook flows: every 6 Nov item card on screen (.wc14 in the side panel or the order pop-up) must show a picture that loaded (an <img> with a source and a natural width, or a background image; a picture the card hides at L3, the lesson's eye in its place, only needs its file), and never the shelf's crate, heap, pile, sack or basket (its file name). A blank picture (still not in after 600 ms: a card drawn again reloads its pictures) or a crate is a break, once per word per page (SH-242, Zafar 8 Nov: 'it's a crate of onions but it should be one onion'; SEK-24; Fable's eggs flaw 2, the blank card)." },
  "contract-105": { item: "light-whole", title: "the first-time light is whole round its thing and centred on it", how: "Cook flows: every light box on screen, once it has stood 300 ms (s19lit: the kit's drawn holes and the thing under each box's middle: a picture with a word and its pill, else the canvas picture under its middle that the box fits best, else the item card or order card it fits best). Round a picture with its pill: the thing whole inside the box (1 px of rounding) and the box's middle within 4 px of the thing's, unless the box meets the screen's edge or stops short of a neighbour on that side (contract-92's rule); a light on a card more than 2.5 times the card's area frames a region (STD-E2-08). Round a picture with no word (a pan, a board): the box covers at least 60% of it and its middle is within a fifth of the picture's size of the picture's middle (a handle may poke out). A light only partly round its thing, or off its middle, is a break, once per thing per page (CK-63, Zafar 8 Nov: 'it's half on the handle ... way too small and it's off-centered like how can that pass'; s18 §6 Q6: contract-92 asked only about the neighbours). A light on a part (under a quarter of a picture, under half of an item card) is contract-97's." },
  "contract-106": { item: "light-goes", title: "the light goes as the child starts the move", how: "Cook flows: a real press (the input sample, a trusted pointerdown) inside a light box on screen starts the move it shows; within 300 ms (plus the probe's 100 ms sampling) that box must be gone (no box, or none round the press). A box still round the press after that is a break, once per page (SH-236, Zafar 8 Nov, maani's roll: 'I start rolling the box should go away')." },
  "contract-107": { item: "hop-shelf", title: "only shelf items hop", how: "Cook flows: every glowing picture that hops (njgTest.cook.glowing() bounce) must stand in the shelf band (its foot in the bottom 30% of the canvas, js/shared/shelf.js Shelf.BAND); a hop off the shelf (a pan, a board, the dough on the board) is a break. A shelf item lit by a light box of its own (its middle inside one) for 300 ms without its hop is a break too. Once per thing per page (SH-237, Zafar 8 Nov: 'items in the bottom bar bounce up and down')." },
  "contract-108": { item: "praise-last", title: "well done only once the whole card is ticked", how: "Cook flows, in a station: a well done (a line saying shabash) that starts while an order card row on screen is still open (the rows sample just before it: not done and not a no row) is a break, once per page (SH-239, Zafar 8 Nov: 'say well done when ... the whole menu card is complete')." },
  "contract-110": { item: "knob-side", title: "the knob rule: left of a pan alone in the width; else below it", how: "Cook flows, each s19knob sample (the S19 probe: every kitchen knob, kit-knob-off, with its burner's flame ring, the face badge beside it, the pan's picture on that burner, the other pictures and item cards sharing the pan's height (beside it, at least 15% of its height: a board, the dial's pictures, a plate, the lap card) and the side panel's box, in CSS px). A single pan alone across the width (nothing else beside it): the knob and the face wholly left of the pan's picture and its flame ring by 2 px, their middle within 8% of the pan's height (8 px at least) of the burner's middle, clear of the side panel and inside the screen. Several pans, or a single pan sharing the width: each knob below its burner (its middle under the burner's), clear of the pan's body (the flame ring's 85%). One off is a break, once per page (SH-247, Zafar 9 Nov: 'where you only have one item ... you put the button off to the left'; refined the same day: 'if there's multiple things taking up width, then we put the button underneath to maximize our width')." },
  "contract-111": { item: "item-reach", title: "a tap at an item's foot picks the item, never its word", how: "Cook flows, each s19tap sample (the S19 probe, once a second while the shelf changes: for every shelf item with a word and its pill, Phaser's own hit test, topmost first, at the item's foot (4 CSS px inside its picture's lowest edge, its middle across), just above its pill's card (2 CSS px) and at the pill's middle). The foot and the spot above the pill must pick the item (or a hit area carrying its word); the pill's middle must pick the pill. A tap there that says the word, or picks nothing, is a break, once per item per page (SH-244, Zafar 9 Nov, his tester on his phone: 'She thought she was pressing the items, but she was pressing the speaker buttons below the items'; measured with the browser's bar showing: 930x374)." },
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
    if (!e.shown || !(e.lines > 1) || !e.fits1 || e.rec || !inStation(st, e.t)) continue;
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
    // (s19-games, 8 Nov: the s19lit sample can lag the light by about half a second: a light up within 600 ms counts)
    // (s19-checks-1, the probe fault: a glow fades for up to 600 ms after its light has gone, chai's #hint glows: the light just gone counts)
    const hs = holesAt(e.t).concat(holesAt(e.t + 600), holesAt(e.t - 600)), hs2 = holesAt(e.t + HOLD_MS);
    // (a kit piece's own glow, its texture named kit-: the pan's heat ring at its window, is the kit's, not the game's)
    const out = (e.list || []).find((g) => { if (/^kit-/.test(g.key || "")) return false; const m = mid(box(g.box)); return !hs.some((h) => inBox(m, h, 2)) && !hs2.some((h) => inBox(m, h, 2)); });
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
  const cards = ev(tl, "s19card");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  cards.forEach((e, i) => {
    // (a card drawn again loads its pictures again: a picture still not in after LOAD_MS is blank, a redraw's moment is not)
    const late = held(cards, i, tEnd) >= LOAD_MS;
    for (const p of e.pics || []) {
      if (seen.has(p.word)) continue;
      if (!p.src || (!p.ok && !p.hidden && late)) { seen.add(p.word); add("contract-104", e.t, `the item card "${p.word}" has no picture${p.src ? ` (${p.src} did not load)` : ""}`); continue; }
      if (p.src && CRATE.test(p.src.split("/").pop())) { seen.add(p.word); add("contract-104", e.t, `the item card "${p.word}" shows the shelf's ${CRATE.exec(p.src.split("/").pop())[1]} (${p.src}), not one of the thing`); }
    }
  });
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
      const t = { ...box(th.box) };
      const id = th.id || th.kind;
      if (seen.has(id)) return;
      const hm = mid(h), tm = mid(t);
      const near = (side) => (e.near || []).some((o0) => { const o = box(o0); if (side === "l") return o.r <= t.l + 1 && o.r >= h.l - 6 && Math.min(o.b, h.b) > Math.max(o.t, h.t); if (side === "r") return o.l >= t.r - 1 && o.l <= h.r + 6 && Math.min(o.b, h.b) > Math.max(o.t, h.t); if (side === "t") return o.b <= t.t + 1 && o.b >= h.t - 6 && Math.min(o.r, h.r) > Math.max(o.l, h.l); return o.t >= t.b - 1 && o.t <= h.b + 6 && Math.min(o.r, h.r) > Math.max(o.l, h.l); });
      const edge = { l: h.l <= 1, r: h.r >= W - 1, t: h.t <= 1, b: h.b >= H - 1 };
      if (th.kind === "word" || th.kind === "card") {
        if (inter(h, t) < (th.kind === "card" ? CARD_PART : 0.25) * area(t)) return; // (a light on a part of it: contract-97's)
        if (area(h) > REGION * area(t)) { seen.add(id); add("contract-105", e.t, `the light ${fmt(h)} frames a region ${Math.round(area(h) / area(t) * 10) / 10} times the size of ${id} ${fmt(t)}: it hugs the one thing`); return; }
        const poke = [["left", t.l < h.l - WHOLE_PX && !edge.l], ["right", t.r > h.r + WHOLE_PX && !edge.r], ["top", t.t < h.t - WHOLE_PX && !edge.t], ["bottom", t.b > h.b + WHOLE_PX && !edge.b]].filter((x) => x[1]).map((x) => x[0]);
        if (poke.length) { seen.add(id); add("contract-105", e.t, `the light ${fmt(h)} is not whole round ${id} ${fmt(t)} (its picture and pill): it pokes out at the ${poke.join(" and ")}`); return; }
        const dx = hm.x - tm.x, dy = hm.y - tm.y;
        const offX = Math.abs(dx) > CENTRE_PX && !(dx > 0 ? edge.l || near("l") : edge.r || near("r"));
        // (a shelf item's light holds its hop's room above it, Shelf.hop: a tenth of its height; chai at 1920x1080, 8 Nov)
        const hopRoom = th.shelf ? 0.1 * (t.b - t.t) : 0;
        const offY = Math.abs(dy) > CENTRE_PX + hopRoom && !(dy > 0 ? edge.t || near("t") : edge.b || near("b"));
        if (offX || offY) { seen.add(id); add("contract-105", e.t, `the light ${fmt(h)} is off the middle of ${id} ${fmt(t)} by ${Math.round(dx)}, ${Math.round(dy)} px (within ${CENTRE_PX} px)`); }
        return;
      }
      // a canvas picture with no word (a pan, a board, a pot)
      // (Zafar, 29 Oct: "the highlight box on the chai tray should go under the face circle so the face circle sits on top": a face
      // badge mostly inside the light, touching the thing, is part of what it lights; the thing and its face are measured together)
      (e.faces || []).forEach((f0) => {
        const f = box(f0);
        if (inter(h, f) >= 0.5 * area(f) && f.l <= t.r + 4 && f.r >= t.l - 4 && f.t <= t.b + 4 && f.b >= t.t - 4) t.l = Math.min(t.l, f.l), t.t = Math.min(t.t, f.t), t.r = Math.max(t.r, f.r), t.b = Math.max(t.b, f.b);
      });
      const tm2 = mid(t);
      tm.x = tm2.x, tm.y = tm2.y;
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
    // (s19-checks-1, the probe fault in orch-overlay-gone, eggs 740x320: a tap's move starts when the game takes it, its act note,
    // which comes as the finger lifts; the light goes within GOES_MS of that, not of the finger going down)
    const act = life(tl, "act").find((a) => a.t >= p.t && a.t <= p.t + 1500);
    const until = Math.max(p.t, act ? act.t : p.t) + GOES_MS + SAMPLE_SLACK_MS;
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
      // (s19-checks-1, the probe fault s19-wave-d saw in chaat: the coach lights a shelf thing about 200 ms before its glow and hop,
      // and the glow is sampled every 100 ms: a hop any time from the light to HOLD_MS + 400 ms after it counts)
      const hop = glows.some((x) => x.t >= e.t - 100 && x.t <= e.t + HOLD_MS + 400 && (x.list || []).some((y) => y.bounce && inBox(mid(box(y.box)), box(hb), 2)));
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
  const sh = ev(tl, "s19shelf");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  for (let i = 0; i < sh.length; i++) {
    const e = sh[i];
    // (s19-checks-1, the probe fault s19-wave-d saw in baking#mistake: the kit's wrong-pick wiggle turns a thing for a moment, and its
    // turned box crosses the line; a shelf held HOLD_MS, its turned things left out, is the shelf's line)
    if (held(sh, i, tEnd) < HOLD_MS) continue;
    const it = (e.items || []).filter((x) => !x.rot);
    if (it.length < 3) continue;
    const base = med(it.map((x) => x.foot)), chip = it.some((x) => x.chip != null) ? med(it.filter((x) => x.chip != null).map((x) => x.chip)) : null;
    const off = it.find((x) => Math.abs(x.foot - base) > BASE_TOL);
    if (off) { add("contract-109", e.t, `the shelf item ${off.id} stands ${Math.round(off.foot - base)} px off the base line (${Math.round(base)} px): one line for every item`); return; }
    const offc = chip == null ? null : it.find((x) => x.chip != null && Math.abs(x.chip - chip) > CHIP_TOL);
    if (offc) { add("contract-109", e.t, `the pill under ${offc.id} sits ${Math.round(offc.chip - chip)} px off the chip line (${Math.round(chip)} px): one line for every pill`); return; }
  }
}

// 110
export function check110(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const seen = new Set();
  const ks = ev(tl, "s19knob");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  // (the knob never moves in a round: a pan that shares the width at any held moment of the page shares it; the serve's last moments,
  // the dial gone, are not a layout of their own)
  const shared = new Set();
  ks.forEach((e, ki) => { if (held(ks, ki, tEnd) >= HOLD_MS && (e.n || 1) === 1) for (const q of e.list || []) if ((q.beside || []).length) shared.add(q.i || 0); });
  for (let ki = 0; ki < ks.length; ki++) {
    const e = ks[ki];
    // (a moment between two things, the bowl gone and the dial not yet up, is not a layout: held 300 ms)
    if (held(ks, ki, tEnd) < HOLD_MS) continue;
    const W = e.vw || 1e9, H = e.vh || 1e9;
    const single = (e.n || 1) === 1;
    for (const q of e.list || []) {
      if (!q.knob || !q.burner) continue;
      const kb = box(q.knob), fb = q.face ? box(q.face) : null, bn = q.burner, pan = q.pan ? box(q.pan) : null;
      const alone = single && !(q.beside || []).length && !shared.has(q.i || 0);
      const key = (alone ? "alone:" : "below:") + (q.i || 0);
      if (seen.has(key)) continue;
      const bad = [];
      const parts = [["knob", kb]].concat(fb ? [["face", fb]] : []);
      if (alone) {
        const left = Math.min(bn.x - bn.r, pan ? pan.l : Infinity) - KNOB_CLEAR;
        for (const [n, b] of parts) if (b.r > left) bad.push(`the ${n} ${fmt(b)} is not left of the pan${pan ? ` ${fmt(pan)}` : ""} (its flames reach ${Math.round(bn.x - bn.r)}): it stands alone in the width`);
        const u = parts.reduce((a, [, b]) => ({ t: Math.min(a.t, b.t), b: Math.max(a.b, b.b) }), { t: Infinity, b: -Infinity });
        const ph = pan ? pan.b - pan.t : 2 * bn.r;
        const dy = (u.t + u.b) / 2 - bn.y;
        if (Math.abs(dy) > Math.max(8, KNOB_MID * ph)) bad.push(`the knob${fb ? " and face" : ""} sit ${Math.round(dy)} px ${dy > 0 ? "below" : "above"} the pan's middle (centred on its height, within ${Math.round(Math.max(8, KNOB_MID * ph))} px)`);
        for (const [n, b] of parts) {
          if ((e.panels || []).some((p0) => inter(b, box(p0)) > 0)) bad.push(`the ${n} ${fmt(b)} is under the side panel`);
          if (b.l < 0 || b.t < 0 || b.r > W || b.b > H) bad.push(`the ${n} ${fmt(b)} leaves the screen`);
        }
      } else {
        if (mid(kb).y <= bn.y) bad.push(`the knob ${fmt(kb)} is not below its burner (its middle at ${Math.round(bn.y)}): ${single ? `${(q.beside || []).slice(0, 2).join(", ")} share${(q.beside || []).length > 1 ? "" : "s"} the width` : "several pans"}, so it sits below`);
        // clear of the pan's body: the knob's nearest point outside 85% of the flame ring
        const nx = Math.max(kb.l, Math.min(bn.x, kb.r)), ny = Math.max(kb.t, Math.min(bn.y, kb.b));
        if (Math.hypot(nx - bn.x, ny - bn.y) < 0.85 * bn.r) bad.push(`the knob ${fmt(kb)} is on the pan's body (within ${Math.round(0.85 * bn.r)} px of its middle)`);
      }
      if (!bad.length) continue;
      seen.add(key);
      add("contract-110", e.t, `${alone ? "one pan alone in the width" : single ? "one pan sharing the width" : "several pans"}: ${bad.join("; ")}`);
    }
  }
}

// 111
export function check111(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const st = stations(tl);
  const seen = new Set();
  const own = (x, it) => x && (x.who === "item" || (x.who === "word" && String(x.id) === String(it.id)));
  const taps = ev(tl, "s19tap");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  for (let i = 0; i < taps.length; i++) {
    const e = taps[i];
    if (st.length && !inStation(st, e.t)) continue;
    // (s19-checks-1, the probe fault s19-wave-d saw in chaat#hint at 740x320: sampled in the moment before the shelf takes taps, all
    // pass a second later: a tap area is judged once it has stood TAP_HOLD_MS)
    if (held(taps, i, tEnd) < TAP_HOLD_MS) continue;
    for (const it of e.items || []) {
      if (seen.has(it.id)) continue;
      const bad = [];
      if (it.foot && !own(it.foot, it)) bad.push(`a tap at its foot (${it.foot.x}, ${it.foot.y}) picks ${it.foot.who === "pill" ? "its pill: it says the word" : it.foot.who === "none" ? "nothing" : it.foot.who + " " + (it.foot.id || "")}`);
      if (it.gap && !own(it.gap, it)) bad.push(`a tap just above its pill (${it.gap.x}, ${it.gap.y}) picks ${it.gap.who === "pill" ? "the pill: it says the word" : it.gap.who === "none" ? "nothing" : it.gap.who + " " + (it.gap.id || "")}`);
      if (it.pill && it.pill.who !== "pill") bad.push(`a tap on its pill (${it.pill.x}, ${it.pill.y}) picks ${it.pill.who === "none" ? "nothing" : it.pill.who}: the pill says the word`);
      if (!bad.length) continue;
      seen.add(it.id);
      add("contract-111", e.t, `the shelf item ${it.id}: ${bad.join("; ")} (the item's tap area reaches down its slot to its pill's top)`);
    }
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
  check110(r, tl, add);
  check111(r, tl, add);
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
      // (a picture the card hides, the L3 lesson's eye in its place, is not loaded yet: only its file is read then)
      const hidden = !!(w.closest(".wc14-hide-pic") || (img && !shown(img)));
      pics.push({ word, src: src.replace(location.origin + "/", "").split("?")[0], ok, hidden });
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
      // (a grey to-record English line is going away, Zafar 6 Nov, SH-224: "I don't care about the grey grown up adult lines")
      const REC = ".rec, .cl-rec, .oc-rec, .to-record, [data-rec], .oc-rec-line";
      const rec = !!(line.closest(REC) || line.querySelector(REC));
      Object.assign(out, { text: probe.textContent.slice(0, 80), floor, need: Math.round(need), room: Math.round(room), fits1: need <= room - 1, rec });
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
          // (a thing that names its lit body, litBounds, is judged by it: eggs' pan without its handle, CK-63; s19-games, 8 Nov)
          const lb = typeof o.litBounds === "function" ? safe(() => o.litBounds()) : null;
          const b = lb && lb.right != null ? { x: lb.x, y: lb.y, right: lb.right, bottom: lb.bottom } : safe(() => o.getBounds());
          if (!b) continue;
          const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom);
          if (o.wordId && o.input && o.input.enabled) {
            const ch = o.chip;
            let chipBox = null;
            // (the kitchen's chip keeps its card's size as pillW / pillH, Kit.chip's keepBox: its pill is part of the thing all the same;
            // s19-stoves, the lights' leftover: mishkaki's veg-03 at 1920x1080 was judged without its pill, 20 px low)
            const cw = ch && (ch.cardW || ch.pillW), chh = ch && (ch.cardH || ch.pillH);
            if (ch && ch.active && cw) { const sx = Math.abs(ch.scaleX || 1), sy = Math.abs(ch.scaleY || 1), hw = (cw / 2) * sx, hh = ((chh || 46) / 2) * sy; const [cl, ct] = P(ch.x - hw, ch.y - hh), [cr2, cb] = P(ch.x + hw, ch.y + hh); chipBox = [cl, ct, cr2, cb]; }
            // (a glowing thing hops: its foot is read from where it stands, glowFx.y, not mid-hop)
            const foot = o.glowFx && o.glowFx.y != null ? bt + (o.glowFx.y - o.y) * ky * cam.zoom : bt;
            const rot = Math.abs(o.rotation || 0) > 0.02 || (o.parentContainer && Math.abs(o.parentContainer.rotation || 0) > 0.02) ? 1 : 0;
            words.push({ id: String(o.wordId), pic: [l, t, r, bt], chip: chipBox, foot, glow: !!o.glowFx, rot });
          } else if (o.texture && o.texture.key && !/^__/.test(o.texture.key) && !/shadow|shade|halo|glow|dim|light/i.test(o.texture.key) && (o.type === "Image" || o.type === "Sprite")) {
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
    // (a whole-canvas light, chop's swipe, is a region, not a thing: skipped, s19-games 8 Nov)
    const things = holes.filter((h) => (h[2] - h[0]) * (h[3] - h[1]) <= cvA / 2).map((h) => {
      const cx = (h[0] + h[2]) / 2, cy = (h[1] + h[3]) / 2;
      const inside = (b) => cx >= b[0] && cx <= b[2] && cy >= b[1] && cy <= b[3];
      const ar0 = (b) => Math.max(1, (b[2] - b[0]) * (b[3] - b[1]));
      const fit0 = (b) => { const i = Math.max(0, Math.min(h[2], b[2]) - Math.max(h[0], b[0])) * Math.max(0, Math.min(h[3], b[3]) - Math.max(h[1], b[1])); return i / ((h[2] - h[0]) * (h[3] - h[1]) + ar0(b) - i); };
      const ws = s.words.filter((x) => inside(u(x.pic, x.chip))).sort((a, b) => fit0(u(b.pic, b.chip)) - fit0(u(a.pic, a.chip)));
      const w = ws[0];
      // (a light round a plate with a word thing lying on it, corn's served cob, CK-61: the plate the light fits is its thing, not the
      // cob in its middle; s19-stoves, the lights' leftover. A word thing wins unless a picture under the light's middle fits it clearly
      // better: twice as well and at least half the light)
      const pic0 = w ? s.pics.filter((x) => inside(x.box) && ar0(x.box) < 0.3 * cvA && ar0(x.box) > ar0(u(w.pic, w.chip))).sort((a, b) => fit0(b.box) - fit0(a.box))[0] : null;
      if (w && pic0 && fit0(pic0.box) >= 0.5 && fit0(pic0.box) > 2 * fit0(u(w.pic, w.chip))) return { kind: "pic", id: pic0.id, box: rnd(pic0.box) };
      if (w) return { kind: "word", id: w.id, box: rnd(u(w.pic, w.chip)), shelf: w.foot >= band };
      // a light in the page: the item card or order card under its middle that the box fits best (an item card, else its person's card)
      for (const el of document.elementsFromPoint(cx, cy)) {
        if (el.closest(".njg-onboard")) continue;
        const cands = [el.closest(".wc14"), el.closest(".oc-card")].filter(Boolean);
        if (!cands.length) break;
        const iou = (b) => { const i = Math.max(0, Math.min(h[2], b[2]) - Math.max(h[0], b[0])) * Math.max(0, Math.min(h[3], b[3]) - Math.max(h[1], b[1])); return i / ((h[2] - h[0]) * (h[3] - h[1]) + (b[2] - b[0]) * (b[3] - b[1]) - i); };
        const best = cands.map((c) => ({ c, b: R(c.getBoundingClientRect()) })).sort((a, b) => iou(b.b) - iou(a.b))[0];
        const name = best.c.matches(".wc14") ? "card:" + (((best.c.querySelector(".wc14-k, .wc-k") || {}).textContent || "").trim().slice(0, 20)) : "order-card:" + (best.c.dataset.who || "?");
        return { kind: "card", id: name, box: rnd(best.b) };
      }
      const ar = (b) => (b[2] - b[0]) * (b[3] - b[1]);
      // (the picture under the box's middle that the box fits best: a light meant for the dough is not judged against the rolling
      // pin lying across it, 8 Nov run; a light half on a pan's handle still fits the pan best of what is there)
      const fit = (b) => { const i = Math.max(0, Math.min(h[2], b[2]) - Math.max(h[0], b[0])) * Math.max(0, Math.min(h[3], b[3]) - Math.max(h[1], b[1])); return i / ((h[2] - h[0]) * (h[3] - h[1]) + ar(b) - i); };
      const p = s.pics.filter((x) => inside(x.box) && ar(x.box) < 0.3 * cvA && ar(x.box) > 0).sort((a, b) => fit(b.box) - fit(a.box))[0];
      return p ? { kind: "pic", id: p.id, box: rnd(p.box) } : null;
    });
    const near = s.words.map((x) => rnd(u(x.pic, x.chip)));
    // (the faces on the canvas, a person's badge on the tray: a light round a glass and its face is whole round both, contract-105)
    let faces = [];
    try { const T = window.njgTest; const h = T && T.cook && T.cook.faces ? T.cook : null; faces = h ? h.faces().filter((f) => f.kind === "badge").map((f) => [f.left, f.top, f.right, f.bottom]) : []; } catch (e) { faces = []; }
    return { holes, things, near, faces, vw: innerWidth, vh: innerHeight };
  };
  // ---- s19-checks-1: what the screen holds, for the pixel checks (lib/lightshot.mjs, lib/lightjudge.py; the overlap check below) ----
  // every drawn canvas picture (its texture, its word and pill if it has them, its box in page px), the face badges and face circles,
  // the item and order cards, the side panel, the kit's finger, the kit's light layers (only to name a variant) and the kit's numbers.
  // Which objects are which comes from here; where the light is, and its shape, is measured on the pictures.
  const screenScan = () => {
    const out = { vw: innerWidth, vh: innerHeight, cv: null, words: [], pics: [], faces: [], cards: [], panels: [], fingers: [], guide: null, gear: null, layers: [], kit: null };
    const O = window.Onboard;
    if (O) out.kit = { BOX_PAD: O.BOX_PAD, LIGHT: O.LIGHT || null, DIM: O.DIM14 != null ? O.DIM14 : O.DIM, VARIANTS: O.VARIANTS || null };
    for (const l of document.querySelectorAll(".njg-onboard.on:not(.ob-empty)")) out.layers.push({ variant: l.dataset.variant || l.dataset.light || null });
    for (const f of document.querySelectorAll(".njg-onboard .ob-ghost, .njg-onboard .ob-finger")) if (shown(f)) out.fingers.push(R(f.getBoundingClientRect()));
    out.panels = [...document.querySelectorAll("#side, .njg-side, #mission")].filter(shown).map((el) => R(el.getBoundingClientRect()));
    // (what the page draws over the dim on purpose: the grown-ups' ? pop-up and its button, the cog, the kit's skip: never the light's)
    out.above = [...document.querySelectorAll("#help-pop, .gb-pop, .njg-gb, #btn-help, .njg-cog, #cog, .ob-skip")].filter(shown).map((el) => R(el.getBoundingClientRect()));
    const gd = document.querySelector("#guide");
    if (gd && shown(gd)) out.guide = R(gd.getBoundingClientRect());
    const gear = document.querySelector("#cog, .njg-cog, #btn-cog, .cog");
    if (gear && shown(gear)) out.gear = R(gear.getBoundingClientRect());
    for (const c of document.querySelectorAll(".wc14, .oc-card")) if (shown(c) && !c.closest(".njg-results")) out.cards.push({ id: (((c.querySelector(".wc14-k, .wc-k") || {}).textContent || c.dataset.who || "").trim().slice(0, 20)), card: c.matches(".wc14"), box: R(c.getBoundingClientRect()) });
    for (const f of document.querySelectorAll(".njg-face, .cv-face, .oc-face, .face-say, .ng-face")) { if (f.querySelector(".njg-face") || !shown(f)) continue; out.faces.push({ kind: "circle", id: f.dataset.who || f.dataset.face || "", box: R(f.getBoundingClientRect()) }); }
    const g = games()[0];
    if (!g) return out;
    const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
    out.cv = R(cr);
    for (const sc of g.scene.getScenes(true)) {
      const cam = sc.cameras.main;
      const P = (x, y) => [cr.left + (x - cam.worldView.x) * kx * cam.zoom, cr.top + (y - cam.worldView.y) * ky * cam.zoom];
      const walk = (list, a0) => {
        for (const o of list) {
          if (!o || o.visible === false || o.alpha === 0) continue;
          const a = a0 * (o.alpha == null ? 1 : o.alpha);
          if (a < 0.15) continue;
          if (o.list) {
            // (a thing drawn as a group with its pill: maani's dough piles carry their pill, not a word id; s19-checks-1)
            if (o.chip && o.chip.active && o.getBounds) { const b = safe(() => o.getBounds()); if (b) { const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom); const ch = o.chip, cw = ch.cardW || ch.pillW, chh = ch.cardH || ch.pillH; let chipBox = null; if (cw) { const sx = Math.abs(ch.scaleX || 1), sy = Math.abs(ch.scaleY || 1); const [cl, ct] = P(ch.x - (cw / 2) * sx, ch.y - ((chh || 46) / 2) * sy), [cr2, cb] = P(ch.x + (cw / 2) * sx, ch.y + ((chh || 46) / 2) * sy); chipBox = rnd([cl, ct, cr2, cb]); } out.words.push({ id: String(o.wordId != null ? o.wordId : o.name || "group"), key: o.name || "group", pic: rnd([l, t, r, bt]), chip: chipBox, input: !!(o.input && o.input.enabled), glow: !!o.glowFx }); } }
            walk(o.list, a);
            continue;
          }
          if (!o.getBounds) continue;
          const key = o.texture && o.texture.key;
          if (!key || /^__/.test(key) || !(o.type === "Image" || o.type === "Sprite")) continue;
          const b = safe(() => o.getBounds());
          if (!b) continue;
          const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom);
          if (r - l < 2 || bt - t < 2) continue;
          if (/-badge|-v2round/.test(key)) { out.faces.push({ kind: "badge", id: key.split(/-badge|-v2round|-face/)[0], box: rnd([l, t, r, bt]) }); continue; }
          if (/shadow|shade|halo|glow|dim|light/i.test(key)) continue;
          if (o.wordId != null || (o.chip && o.chip.active)) {
            const ch = o.chip;
            let chipBox = null;
            const cw = ch && (ch.cardW || ch.pillW), chh = ch && (ch.cardH || ch.pillH);
            if (ch && ch.active && ch.visible !== false && cw) { const sx = Math.abs(ch.scaleX || 1), sy = Math.abs(ch.scaleY || 1), hw = (cw / 2) * sx, hh = ((chh || 46) / 2) * sy; const [cl, ct] = P(ch.x - hw, ch.y - hh), [cr2, cb] = P(ch.x + hw, ch.y + hh); chipBox = rnd([cl, ct, cr2, cb]); }
            out.words.push({ id: String(o.wordId != null ? o.wordId : key), key, pic: rnd([l, t, r, bt]), chip: chipBox, input: !!(o.input && o.input.enabled), glow: !!o.glowFx });
          } else out.pics.push({ id: key, box: rnd([l, t, r, bt]) });
        }
      };
      safe(() => walk(sc.children.list, 1));
    }
    if (out.pics.length > 160) out.pics = out.pics.slice(0, 160);
    return out;
  };
  window.__njgScreenScan = () => safe(screenScan, null);

  // ---- s19-checks-1, contract-113: a face, a word pill or a card's words covered by another drawn thing (or covering a dish) ----
  // From the pixels of what is drawn: each canvas picture's own opaque pixels (its texture's alpha, read once per texture frame), and
  // for the page's things, what the browser draws on top at each point (elementFromPoint). Not a list of named pairs.
  const SURF = /bg|wall|marble|worktop|counter|stage|panel|band|shelf|slab|tray|board|hob|stove|kitchen|floor|table|backdrop|room|^kit-flame|steam|smoke|spark|bubble/i;
  const masks = new Map();
  const maskOf = (o) => {
    const fr = o.frame;
    if (!fr || !fr.source || !fr.source.image) return null;
    const id = (o.texture && o.texture.key) + "|" + fr.name;
    if (masks.has(id)) return masks.get(id);
    let m = null;
    try {
      const N = 24, cvs = document.createElement("canvas");
      cvs.width = N; cvs.height = N;
      const cx = cvs.getContext("2d");
      cx.drawImage(fr.source.image, fr.cutX, fr.cutY, fr.cutWidth, fr.cutHeight, 0, 0, N, N);
      const d = cx.getImageData(0, 0, N, N).data;
      m = new Uint8Array(N * N);
      for (let i = 0; i < N * N; i++) m[i] = d[i * 4 + 3] > 96 ? 1 : 0;
    } catch (e) { m = null; }
    masks.set(id, m);
    return m;
  };
  const overNow = () => {
    const g = games()[0];
    const out = [];
    const vA = innerWidth * innerHeight;
    // a modal layer drawn over everything on purpose (the order pop-up, the end screen, the grown-ups' pop-up, the title): not a cover
    const MODAL = ".njg-results, .njg-rq-veil, .njg-grownup, #overlay, .gb-pop, #help-pop, .njg-gb, [role=dialog], .njg-onboard";
    const modal = (el) => { if (!el || el.closest(MODAL)) return true; for (let x = el, i = 0; x && x !== document.body && i < 6; x = x.parentElement, i++) { const b = x.getBoundingClientRect(); if (b.width * b.height >= 0.4 * vA && !(g && x.contains(g.canvas))) return true; } return false; };
    const PANEL = "#side, #mission, #guide, .oc-card, .wc14, .njg-results, .njg-rq-veil, .njg-grownup";
    const items = []; // canvas things: {o, kind: face|pill|pic, id, box, order, W}
    const area4 = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
    const inter4 = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
    if (g) {
      const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
      const cvA = cr.width * cr.height;
      let order = 0;
      for (const sc of g.scene.getScenes(true)) {
        const cam = sc.cameras.main;
        const P = (x, y) => [cr.left + (x - cam.worldView.x) * kx * cam.zoom, cr.top + (y - cam.worldView.y) * ky * cam.zoom];
        const W = (px, py) => [(px - cr.left) / (kx * cam.zoom) + cam.worldView.x, (py - cr.top) / (ky * cam.zoom) + cam.worldView.y];
        const walk = (list, a0) => {
          for (const o of list) {
            if (!o || o.visible === false) continue;
            const a = a0 * (o.alpha == null ? 1 : o.alpha);
            if (a < 0.3) continue;
            order++;
            if (o.list) {
              // a word pill: the kit's card container (cardW or pillW), or a small container holding words
              const tx = o.list.find((c) => c && c.type === "Text" && (c.text || "").trim());
              if (o.cardW || o.pillW || tx) { const b = safe(() => o.getBounds()); if (b) { const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom); if ((r - l) * (bt - t) < 0.06 * cvA) items.push({ o, kind: "pill", id: String(o.wordId || o.pillId || (tx && tx.text) || "pill").slice(0, 24), box: [l, t, r, bt], order, W }); } }
              walk(o.list, a);
              continue;
            }
            const key = o.texture && o.texture.key;
            if (!key || /^__/.test(key) || !(o.type === "Image" || o.type === "Sprite") || !o.getBounds) continue;
            if (/shadow|shade|halo|glow|dim|light|ring|frame/i.test(key)) continue;
            const b = safe(() => o.getBounds());
            if (!b) continue;
            const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom);
            if (r - l < 6 || bt - t < 6) continue;
            const ar = (r - l) * (bt - t);
            // (a person's round face: the kit's <who>-badge and <who>-v2round pictures, the well done's big face among them)
            if (/-badge|-v2round/.test(key)) items.push({ o, kind: "face", id: key.split(/-badge|-v2round|-face/)[0], box: [l, t, r, bt], order, W });
            else if (!SURF.test(key) && ar < 0.25 * cvA) items.push({ o, kind: "pic", id: String(o.wordId != null ? o.wordId : key), key, box: [l, t, r, bt], order, W, chip: o.chip || null });
          }
        };
        safe(() => walk(sc.children.list, 1));
      }
      // the page's face circles over the play area (a face the kit draws in the page over the kitchen: the well done's)
      for (const f of document.querySelectorAll(".njg-face, .cv-face")) {
        if (!shown(f) || f.closest(PANEL) || f.querySelector(".njg-face")) continue;
        const b = f.getBoundingClientRect();
        const box = [b.left, b.top, b.right, b.bottom];
        if (inter4(box, [cr.left, cr.top, cr.right, cr.bottom]) < 0.5 * area4(box)) continue;
        items.push({ kind: "face", dom: true, id: f.dataset.who || f.dataset.face || (f.closest("[data-who]") || { dataset: {} }).dataset.who || "a face", box, order: 1e9 });
      }
      // is thing x drawn (opaque) at page point (px, py)? (a page face: its circle)
      const opaque = (x, px, py) => {
        const inb = px >= x.box[0] && px <= x.box[2] && py >= x.box[1] && py <= x.box[3];
        if (!inb) return false;
        if (x.dom) { const cx = (x.box[0] + x.box[2]) / 2, cy = (x.box[1] + x.box[3]) / 2, r = Math.min(x.box[2] - x.box[0], x.box[3] - x.box[1]) / 2; return (px - cx) ** 2 + (py - cy) ** 2 <= r * r; }
        if (x.kind === "pill") return true;
        const m = maskOf(x.o);
        if (!m) return true;
        const [wx, wy] = x.W(px, py);
        const M = safe(() => x.o.getWorldTransformMatrix());
        if (!M) return false;
        const p = M.applyInverse(wx, wy);
        let u = (p.x + (x.o.displayOriginX || 0)) / (x.o.width || 1), v = (p.y + (x.o.displayOriginY || 0)) / (x.o.height || 1);
        if (x.o.flipX) u = 1 - u;
        if (x.o.flipY) v = 1 - v;
        if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;
        return m[Math.floor(v * 24) * 24 + Math.floor(u * 24)] === 1;
      };
      // the share of x's drawn points that y also draws on (a grid over x's own box)
      const share = (x, y) => {
        if (inter4(x.box, y.box) < 4) return 0;
        let mine = 0, both = 0;
        const n = 12, sx = (x.box[2] - x.box[0]) / n, sy = (x.box[3] - x.box[1]) / n;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const px = x.box[0] + (i + 0.5) * sx, py = x.box[1] + (j + 0.5) * sy;
          if (!opaque(x, px, py)) continue;
          mine++;
          if (opaque(y, px, py)) both++;
        }
        return mine ? both / mine : 0;
      };
      const iou = (a, b) => { const i = inter4(a, b); return i / (area4(a) + area4(b) - i); };
      for (const x of items.filter((q) => q.kind === "face" || q.kind === "pill")) {
        for (const y of items) {
          if (y === x || y.kind === "face" || (x.kind === "face" && y.kind === "pill")) continue;
          if (x.kind === "pill" && (y.kind === "pill" || (y.chip && y.chip === x.o))) continue; // (its own item stands on its pill)
          if (iou(x.box, y.box) > 0.6) continue; // (the face's own ring or frame)
          const above = y.order > x.order;
          if (x.kind === "pill") {
            // a pill under a picture drawn after it
            if (!above) continue;
            const s = share(x, y);
            if (s >= 0.12) out.push({ what: "pill", id: x.id, box: x.box.map(Math.round), by: "picture", byId: y.id, byBox: y.box.map(Math.round), share: Math.round(s * 100) / 100, on: "under" });
            continue;
          }
          // a face: under a picture (any share of 6%), or over a dish (15% of the dish under it: a small badge on a plate's rim is a marker)
          if (above) { const s = share(x, y); if (s >= 0.06) out.push({ what: "face", id: x.id, box: x.box.map(Math.round), by: "picture", byId: y.id, byBox: y.box.map(Math.round), share: Math.round(s * 100) / 100, on: "under" }); }
          else { const s = share(y, x); if (s >= 0.15) out.push({ what: "face", id: x.id, box: x.box.map(Math.round), by: "picture", byId: y.id, byBox: y.box.map(Math.round), share: Math.round(s * 100) / 100, on: "over" }); }
        }
      }
      // the page's own things drawn over a canvas face or pill (the settings cog over a pill, a bubble over a face)
      for (const x of items.filter((q) => (q.kind === "face" || q.kind === "pill") && !q.dom)) {
        const hits = new Map();
        let n = 0;
        for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
          const px = x.box[0] + (i + 0.5) * (x.box[2] - x.box[0]) / 5, py = x.box[1] + (j + 0.5) * (x.box[3] - x.box[1]) / 5;
          if (px < 0 || py < 0 || px >= innerWidth || py >= innerHeight) continue;
          n++;
          const top = document.elementFromPoint(px, py);
          if (!top || top === g.canvas || top.contains(g.canvas) || modal(top)) continue;
          const cs = getComputedStyle(top);
          const paints = /^(img|svg|button|path|use)$/i.test(top.tagName) || (cs.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)) || (top.textContent || "").trim();
          if (!paints) continue;
          const el = top.closest("button, [role=button], .njg-face, #guide, .oc-card, .wc14, #side, [class*=bubble]") || top;
          hits.set(el, (hits.get(el) || 0) + 1);
        }
        for (const [el, c] of hits) if (n && c / n >= 0.12) out.push({ what: x.kind, id: x.id, box: x.box.map(Math.round), by: "page", byId: desc(el), share: Math.round((c / n) * 100) / 100, on: "under" });
      }
    }
    // the page's word pills (the word pop, the kit's pills) under a button (the settings cog, the help): buttons are drawn on top
    const btns = [...document.querySelectorAll("button, [role=button]")].filter((b) => shown(b) && !modal(b) && !b.closest("#side, #mission, #guide, .oc-card, .wc14"));
    for (const p of document.querySelectorAll(".njg-wpill, .njg-pill")) {
      if (!shown(p) || modal(p)) continue;
      const pb = R(p.getBoundingClientRect());
      for (const b of btns) {
        if (b.contains(p) || p.contains(b)) continue;
        const s = inter4(pb, R(b.getBoundingClientRect())) / Math.max(1, area4(pb));
        if (s >= 0.12) { out.push({ what: "pill", id: (p.textContent || "").trim().slice(0, 24), box: pb, by: "page", byId: desc(b), share: Math.round(s * 100) / 100, on: "under" }); break; }
      }
    }
    // a card's words (the item cards, the order cards, Nani's line) under something of the page that is not in their own panel
    for (const tx of document.querySelectorAll(".wc14-k, .wc14-en, .wc-k, .oc-card .oc-name, .ng-line")) {
      if (!shown(tx) || modal(tx) || getComputedStyle(tx).pointerEvents === "none") continue;
      const card = tx.closest(".wc14, .oc-card, #guide") || tx.parentElement;
      const root = tx.closest("#side, #mission, #guide, .njg-rq-card") || card;
      const range = document.createRange();
      range.selectNodeContents(tx);
      for (const q of [...range.getClientRects()].slice(0, 3)) {
        if (q.width < 4) continue;
        const top = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
        // (a word cut off by its row's edge is clipping, not covering: the canvas or its own panel under it)
        if (!top || top.tagName === "CANVAS" || root.contains(top) || top.contains(root) || modal(top)) continue;
        out.push({ what: "text", id: (tx.textContent || "").trim().slice(0, 24), box: R(q), by: "page", byId: desc(top), share: 1, on: "under" });
        break;
      }
    }
    return out;
  };
  const shelfNow = () => {
    const s = scan();
    if (!s.cv) return null;
    const band = s.cv[1] + (630 / 900) * (s.cv[3] - s.cv[1]);
    const items = s.words.filter((x) => x.foot >= band && !x.glow).map((x) => ({ id: x.id, foot: Math.round(x.foot), chip: x.chip ? Math.round((x.chip[1] + x.chip[3]) / 2) : null, ...(x.rot ? { rot: x.rot } : {}) }));
    return items.length ? { items } : null;
  };

  // ---- the knob rule (110): every kitchen knob, its burner (the flame ring under it), the face beside it, the pan on it ----
  const knobsNow = () => {
    const g = games()[0];
    if (!g) return null;
    const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
    const knobs = [], flames = [], faces = [], pics = [];
    for (const sc of g.scene.getScenes(true)) {
      const cam = sc.cameras.main;
      const P = (x, y) => [cr.left + (x - cam.worldView.x) * kx * cam.zoom, cr.top + (y - cam.worldView.y) * ky * cam.zoom];
      const bx = (o) => { const b = safe(() => o.getBounds()); if (!b) return null; const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom); return [l, t, r, bt]; };
      const walk = (list, inv) => {
        for (const o of list) {
          if (!o || o.visible === false) continue;
          const key = o.texture && o.texture.key;
          if (o.list) { if (o.list.some((c) => c && c.texture && c.texture.key === "kit-knob-off")) { const kb = bx(o.list.find((c) => c.texture && c.texture.key === "kit-knob-off")); if (kb && !inv && o.alpha > 0) knobs.push(kb); } walk(o.list, inv || o.alpha === 0); continue; }
          // (a drawing that names its box, daar's dial: what shares the pan's width)
          if (typeof o.njgBox === "function" && !inv && o.alpha > 0) { const nb = safe(() => o.njgBox()); if (nb) { const [l, t] = P(nb.x, nb.y), [r, bt] = P(nb.right, nb.bottom); pics.push({ key: o.name || "drawing", b: [l, t, r, bt] }); } continue; }
          if (!key || !o.getBounds) continue;
          if (key === "kit-flame-high") { const b = bx(o); if (b) flames.push({ x: (b[0] + b[2]) / 2, y: (b[1] + b[3]) / 2, r: ((b[2] - b[0]) / 2) * (245 / 256) }); continue; }
          if (inv || o.alpha === 0) continue;
          if (/-badge.*v2round/.test(key)) { const b = bx(o); if (b) faces.push(b); continue; }
          if (/^(kit-|__)|shadow|shade|halo|glow|dim|light|stage|bg|wall|worktop|marble|panel|band/i.test(key) || !/Image|Sprite/.test(o.type || "")) continue;
          const b = bx(o);
          if (b) pics.push({ key, b });
        }
      };
      safe(() => walk(sc.children.list, false));
    }
    if (!knobs.length || !flames.length) return null;
    const cvA = cr.width * cr.height;
    const ar = (b) => (b[2] - b[0]) * (b[3] - b[1]);
    const list = knobs.map((kb) => {
      const km = [(kb[0] + kb[2]) / 2, (kb[1] + kb[3]) / 2];
      const d = (f) => Math.hypot(f.x - km[0], f.y - km[1]);
      const bi = flames.reduce((a, f, i) => (d(f) < d(flames[a]) ? i : a), 0);
      const bn = flames[bi];
      const face = faces.filter((f) => Math.hypot((f[0] + f[2]) / 2 - km[0], (f[1] + f[3]) / 2 - km[1]) < 2.6 * (kb[2] - kb[0])).sort((a, b) => Math.hypot((a[0] + a[2]) / 2 - km[0], (a[1] + a[3]) / 2 - km[1]) - Math.hypot((b[0] + b[2]) / 2 - km[0], (b[1] + b[3]) / 2 - km[1]))[0] || null;
      // the pan: the biggest picture (not the hob's own) whose box holds the burner's middle and that is about the flame ring's size or more
      const pan = pics.filter((p) => p.b[0] <= bn.x && p.b[2] >= bn.x && p.b[1] <= bn.y && p.b[3] >= bn.y && ar(p.b) < 0.3 * cvA && (p.b[2] - p.b[0]) >= bn.r * 1.3).sort((a, b) => ar(b.b) - ar(a.b))[0];
      return { i: bi, knob: rnd(kb), face: face ? rnd(face) : null, burner: { x: Math.round(bn.x), y: Math.round(bn.y), r: Math.round(bn.r) }, pan: pan ? rnd(pan.b) : null, panKey: pan ? pan.key : null };
    });
    const panels = [...document.querySelectorAll("#side, .njg-side, #mission")].filter(shown).map((el) => R(el.getBoundingClientRect()));
    // what shares the pan's width: a picture or an item card beside the pan (not over it, not the hob's own, not on the shelf band),
    // overlapping its height, at least 15% of its height
    const bandTop = cr.top + (630 / 900) * cr.height;
    const cards = [...document.querySelectorAll(".wc14-laps, .daar-laps")].filter(shown).map((el) => ({ key: "lap-card", b: R(el.getBoundingClientRect()) }));
    list.forEach((q) => {
      const p = q.pan || [q.burner.x - q.burner.r, q.burner.y - q.burner.r, q.burner.x + q.burner.r, q.burner.y + q.burner.r];
      const ph = p[3] - p[1];
      q.beside = [...new Set(pics.concat(cards).filter((x) => {
        const b = x.b;
        if (b[3] > bandTop + 2 || (b[3] - b[1]) < 0.15 * ph || ar(b) >= 0.3 * cvA) return false;
        if (b[3] <= p[1] || b[1] >= p[3]) return false; // (not at the pan's height)
        if (b[2] > p[0] && b[0] < p[2]) return false; // (over or under the pan: its contents, its ladle, the flag)
        return true;
      }).map((x) => x.key))].slice(0, 6);
    });
    return { n: flames.length, list, panels, vw: innerWidth, vh: innerHeight };
  };

  // ---- an item's tap area (111): Phaser's own hit test at the item's foot, just above its pill and on the pill ----
  const tapsNow = () => {
    const g = games()[0];
    if (!g) return null;
    const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
    const scenes = g.scene.getScenes(true).slice().reverse(); // (the top scene takes a tap first)
    const top = (px, py) => {
      // page px -> the game's px
      const x = (px - cr.left) / kx, y = (py - cr.top) / ky;
      for (const sc of scenes) {
        const ip = sc.input;
        if (!ip || !ip.enabled || !ip.manager || typeof ip.hitTestPointer !== "function") continue;
        const ptr = { x, y, worldX: 0, worldY: 0, camera: null };
        const hits = safe(() => ip.hitTestPointer(ptr).slice(), []).filter((o) => o && o.input && o.input.enabled);
        if (!hits.length) continue;
        if (ip.topOnly !== false) safe(() => ip.sortGameObjects(hits, ptr));
        return hits[0];
      }
      return null;
    };
    const items = [];
    for (const sc of g.scene.getScenes(true)) {
      const cam = sc.cameras.main;
      const P = (x, y) => [cr.left + (x - cam.worldView.x) * kx * cam.zoom, cr.top + (y - cam.worldView.y) * ky * cam.zoom];
      const band = cr.top + (630 / 900) * cr.height;
      const walk = (list) => {
        for (const o of list) {
          if (!o || o.visible === false || o.alpha === 0) continue;
          if (o.list) walk(o.list);
          // (a shelf thing is anything taking taps with a word pill under it: maani's dough piles carry no word id, only their pill)
          if ((!o.wordId && !o.chip) || !o.input || !o.input.enabled || !o.getBounds || o.glowFx) continue;
          const ch = o.chip;
          const cw = ch && (ch.cardW || ch.pillW);
          if (!ch || !ch.active || ch.visible === false || !cw || ch.parentContainer) continue;
          const b = safe(() => o.getBounds());
          if (!b) continue;
          const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom);
          if (bt < band) continue; // (the shelf's things alone: their foot in the band)
          const sy = Math.abs(ch.scaleY || 1), hh = ((ch.cardH || ch.pillH || 46) / 2) * sy;
          const [, pt] = P(ch.x, ch.y - hh), [pcx, pcy] = P(ch.x, ch.y);
          const cx = (l + r) / 2;
          const what = (px, py) => {
            const h = top(px, py);
            const who = !h ? "none" : h === o ? "item" : h === ch || (h.parentContainer && h.parentContainer === ch) ? "pill" : h.wordId != null ? "word" : (h.chip || h.pillId != null || (h.list && h.cardW)) ? "pill" : "other";
            return { x: Math.round(px), y: Math.round(py), who, id: h ? String(h.wordId != null ? h.wordId : (h.texture && h.texture.key) || h.type || "") : null };
          };
          const fy = Math.min(bt - FOOT, pt - 3);
          items.push({ id: String(o.wordId || o.type || (o.texture && o.texture.key) || "?"), foot: fy > t ? what(cx, fy) : null, gap: pt - 2 > bt ? what(pcx, pt - 2) : null, pill: what(pcx, pcy) });
        }
      };
      safe(() => walk(sc.children.list));
    }
    return items.length ? { items } : null;
  };
  const FOOT = 4; // (FOOT_IN: the hook is sent as source, so the number is written here too)

  // ---- SH-244's picture: njgTest.cook.taps() (the evidence tool's hook:cook.taps): every shelf item's tap area (its picture and,
  // where the shared shelf gives it, its reach down to its pill: Shelf.P.reachBox) outlined in green, each pill's in maroon, for 2 s;
  // returns the boxes in client px (the crop frames them). Only an evidence probe calls it: no contract run draws it ----
  const tapMap = () => {
    const g = games()[0];
    if (!g) return [];
    const cr = g.canvas.getBoundingClientRect(), kx = cr.width / g.scale.gameSize.width, ky = cr.height / g.scale.gameSize.height;
    const out = [];
    for (const sc of g.scene.getScenes(true)) {
      const cam = sc.cameras.main;
      const P = (x, y) => [cr.left + (x - cam.worldView.x) * kx * cam.zoom, cr.top + (y - cam.worldView.y) * ky * cam.zoom];
      const band = cr.top + (630 / 900) * cr.height;
      const walk = (list) => {
        for (const o of list) {
          if (!o || o.visible === false || o.alpha === 0) continue;
          if (o.list) walk(o.list);
          if (!o.input || !o.input.enabled || !o.getBounds || !o.chip) continue;
          const b = safe(() => o.getBounds());
          if (!b) continue;
          const [l, t] = P(b.x, b.y), [r, bt] = P(b.right, b.bottom);
          if (bt < band) continue;
          const SH = window.Shelf && window.Shelf.P;
          const rb = SH && SH.reachBox ? safe(() => SH.reachBox(o)) : null;
          let item = [l, t, r, bt];
          if (rb) { const [a, c] = P(rb.left, rb.top), [d, e] = P(rb.right, rb.bottom); item = [Math.min(l, a), Math.min(t, c), Math.max(r, d), Math.max(bt, e)]; }
          out.push({ kind: "item", b: item });
          const ch = o.chip, ha = ch.input && ch.input.hitArea;
          if (ha && ch.getWorldTransformMatrix) {
            const M = safe(() => ch.getWorldTransformMatrix());
            // (Phaser reads a container's area from its top-left: its display origin, half its size, comes off first)
            const dx = ch.displayOriginX || 0, dy = ch.displayOriginY || 0;
            if (M) { const p0 = M.transformPoint(ha.x - dx, ha.y - dy), p1 = M.transformPoint(ha.x + ha.width - dx, ha.y + ha.height - dy); const [a, c] = P(p0.x, p0.y), [d, e] = P(p1.x, p1.y); out.push({ kind: "pill", b: [Math.min(a, d), Math.min(c, e), Math.max(a, d), Math.max(c, e)] }); }
          }
        }
      };
      safe(() => walk(sc.children.list));
    }
    const old = document.getElementById("njg-tapmap");
    if (old) old.remove();
    if (!out.length) return [];
    const host = document.createElement("div");
    host.id = "njg-tapmap";
    host.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000;pointer-events:none";
    for (const x of out) {
      const d = document.createElement("div");
      const col = x.kind === "item" ? "#1f9d55" : "#a3123a";
      d.style.cssText = `position:fixed;left:${x.b[0]}px;top:${x.b[1]}px;width:${x.b[2] - x.b[0]}px;height:${x.b[3] - x.b[1]}px;border:2px ${x.kind === "item" ? "solid" : "dashed"} ${col};background:${col}22;box-sizing:border-box`;
      host.appendChild(d);
    }
    document.body.appendChild(host);
    setTimeout(() => host.remove(), 2000);
    const u = out.reduce((a, x) => [Math.min(a[0], x.b[0]), Math.min(a[1], x.b[1]), Math.max(a[2], x.b[2]), Math.max(a[3], x.b[3])], [Infinity, Infinity, -Infinity, -Infinity]);
    return [{ left: u[0], top: u[1], width: u[2] - u[0], height: u[3] - u[1] }];
  };

  let shelfAt = 0, knobAt = 0, tapAt = 0, overAt = 0;
  setInterval(() => {
    try {
      if (window.__njgFilm) return;
      if (window.njgTest && window.njgTest.cook && !window.njgTest.cook.taps) window.njgTest.cook.taps = tapMap;
      ghosts();
      const c = safe(cardsNow, null);
      if (c && !same("s19card", [c.cards > 0, c.lora, c.old, c.pics.map((p) => p.word + p.src + p.ok + p.hidden)])) emit({ k: "s19card", ...c });
      const gd = safe(guideNow, null);
      if (gd && !same("s19guide", [gd.shown, gd.s14, gd.arrow, gd.lines, gd.fits1, gd.text, gd.rec])) emit({ k: "s19guide", ...gd });
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
      if (Date.now() - knobAt > 500) {
        knobAt = Date.now();
        const kn = safe(knobsNow, null);
        if (kn && !same("s19knob", kn.list.map((q) => [q.knob.map((v) => Math.round(v / 4)), q.face && q.face.map((v) => Math.round(v / 4)), q.pan && q.pan.map((v) => Math.round(v / 4)), (q.beside || []).length > 0]))) emit({ k: "s19knob", ...kn });
      }
      if (Date.now() - overAt > 400) {
        overAt = Date.now();
        const ov = safe(overNow, null);
        if (ov && !same("s19over", ov.map((x) => [x.what, x.id, x.byId, x.on, (x.byBox || []).map((v) => Math.round(v / 6))]))) emit({ k: "s19over", list: ov.slice(0, 20) });
      }
      if (Date.now() - tapAt > 1000) {
        tapAt = Date.now();
        const tp = safe(tapsNow, null);
        if (tp && !same("s19tap", tp.items.map((x) => [x.id, x.foot && x.foot.who, x.gap && x.gap.who, x.pill && x.pill.who, x.foot && Math.round(x.foot.y / 4)]))) emit({ k: "s19tap", ...tp });
      }
    } catch (e) { /* a probe only */ }
  }, 100);
}
export const S19_HOOK = `(${s19hook.toString()})()`;
