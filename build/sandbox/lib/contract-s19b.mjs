import { readFileSync } from "node:fs";
import { join } from "node:path";
// s19-checks-2 (build/reports/s19-check-sort.md G2, G3, G5): checks that read the screen, not a game's own note. Probed by
// lib/contract-s19b-hook.mjs (S19B_HOOK); registered in lib/contract.mjs.
//   contract-114 no-snap      an item keeps its size from step to step and never snaps: its drawn box between frames, its rests (SH-256)
//   contract-115 item-size    the main thing as big as the height allows; the shelf's items at one height (SH-245, CK-77)
//   contract-116 card-pad     the order card in the game: its cards' padding even, their gaps even, the current card whole, the card
//                             not left half empty (SH-165, Q12's measurable half; labcheck's measure in the contract run)
export const SNAP = 0.15;          // a size change over this share of the item's longer side
export const TWEEN_OK_MS = 150;    // ... is a glide only inside a tween at least this long
export const GAP_MS = 120;         // two samples this close are consecutive frames (the probe scans every 30 ms; a busy page drops some)
export const HOLD_NEW_MS = 250;    // a new size held this long is the item's size, not a frame of a flip or a squash
export const REST_MS = 300;        // an item still (within REST_PX) this long rests
export const REST_PX = 1.5;
export const PLACE = 0.6;          // two rests are at different places when their middles are this share of the item's size apart
export const MIN_ITEM_PX = 18;     // smaller pictures (a drop, a seed) are not judged

const ev = (tl, k) => tl.filter((e) => e.type === "c" && e.k === k);
const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");
const side = (b) => Math.max(b[2] - b[0], b[3] - b[1]);
// an item's own size: its drawn size unturned (the probe's w, h; a tilted jar's box grows with its angle), else its box
const size = (s) => (s.w > 0 && s.h > 0 ? Math.max(s.w, s.h) : side(s.box));
// not an item: the child's tools in the hand (a spoon, a rolling pin, a turner, a knife: they go with the finger), the stove's knobs,
// the faces and badges, the kit's hob and tray (furniture)
export const NOT_ITEM = /spoon|ladle|turner|velan|knife|tong|spatula|whisk|brush|knob|badge|face|nana|nani|^kit-hob|burner|njg-tray|cat\b|eg-cat/i;
const midOf = (b) => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const fmtB = (b) => `[${b.map(Math.round).join(",")}]`;
// one thing: the same picture (a state swap keeps its object: the probe's id); a picture swapped for another object is the same thing
// only with the same key
const sameThing = (a, b) => String(a).split("#")[0] === String(b).split("#")[0];
const tween = (s) => s.tw >= TWEEN_OK_MS;

/** The kitchen's pictures from the s19it samples: [{id, key, word, samples: [{t, key, box, a, tw}], gone}] */
export function tracks(tl) {
  const by = new Map();
  for (const e of ev(tl, "s19it")) {
    for (const c of e.ch || []) {
      const [id, key, l, t, r, b, a, tw, word, , w, h, rot, px, py] = c;
      let k = by.get(id);
      if (!k) by.set(id, (k = { id, key, word: word || null, samples: [], gone: null, at: e.t }));
      k.samples.push({ t: e.t, key, box: [l, t, r, b], a, tw: tw > 1e7 ? 0 : tw, w: w || 0, h: h || 0, rot: rot || 0, pill: px || py ? [px, py] : null });
      k.key = key;
    }
    for (const id of e.gone || []) { const k = by.get(id); if (k && k.gone == null) k.gone = e.t; }
  }
  return [...by.values()];
}
// the rests of one track: [{t0, t1, box}] (still within REST_PX for REST_MS; its box the last of the rest)
export function rests(samples, tEnd) {
  const out = [];
  let i = 0;
  while (i < samples.length) {
    let j = i;
    while (j + 1 < samples.length && Math.max(...samples[j + 1].box.map((v, q) => Math.abs(v - samples[i].box[q]))) <= REST_PX) j++;
    const t1 = j + 1 < samples.length ? samples[j + 1].t : tEnd;
    if (t1 - samples[i].t >= REST_MS && samples[j].a >= 50) out.push({ t0: samples[i].t, t1, box: samples[j].box, key: samples[j].key, size: size(samples[j]) });
    i = j + 1;
  }
  return out;
}

export const S19B_CHECKS = {
  "contract-114": { item: "no-snap", title: "an item keeps its size and never snaps", how: `Cook flows: every picture in the kitchen (lib/contract-s19b-hook.mjs s19it: its drawn box on screen every 30 ms, its alpha, the tweens on it; not the people, the effects or the backdrop). A snap is a break: between two frames an item's longer side changes by more than ${SNAP * 100}% with no tween of ${TWEEN_OK_MS} ms or more on it, and the new size holds (${HOLD_NEW_MS} ms: a flip or a squash comes back); or an item vanishes and the same thing (its key's name) appears in the same frame elsewhere or at another size, with no fade (a jump from the hand to the plate). And from step to step: the same item resting (still ${REST_MS} ms) at one place and next at another (its middle ${PLACE} of its size away) must keep its longer side within ${SNAP * 100}% (SH-256: maani's bread halves on the plate, corn's cob a speck on the tray then large on the plate, eggs' egg). Zafar's accepted designs pass there in a smooth tweened change (a tween of ${TWEEN_OK_MS} ms or more on the picture itself, no untweened jump): maani's board, tawa and plate sizes and samosa's close-up fold (Zafar, 11 Nov morning: "fine as they are (a smooth tweened change)"); an untweened change or a jump there still fails. Once per item per page, at most 4.` },
};

// Zafar's accepted designs (s19-shared-checks): an item that changes size from step to step there, in a smooth tweened change (a tween of
// at least TWEEN_OK_MS on the picture itself while it changes, no frame-to-frame jump without one), is right; an untweened change or a
// jump still fails. Each with his words.
export const ACCEPTED_SIZES = [
  { flow: /maani/, key: /^mv-(raw|cooked)-/, words: "Zafar, 11 Nov morning: \"Maani's board, tawa and plate sizes ... fine as they are (a smooth tweened change)\"; 9 Nov (MAA-24, P8): \"you roll the mani the size of the rolling board ... it just shrinks down into the small tray ... probably one we just have to accept\"" },
  { flow: /samosa/, key: /^sv3-fold/, words: "Zafar, 11 Nov morning: \"samosa's close-up fold: fine as they are (a smooth tweened change)\"" },
];
export function acceptedSize(flow, ...keys) {
  return ACCEPTED_SIZES.some((x) => x.flow.test(flow || "") && keys.some((k) => x.key.test(String(k || ""))));
}
// a smooth tweened change between two rests: a tween of TWEEN_OK_MS or more on the picture while it changed, and no frame-to-frame size
// change over SNAP without one (samples from the end of the first rest to the start of the next)
export function glided(samples, t0, t1) {
  const w = samples.filter((x) => x.t >= t0 - GAP_MS && x.t <= t1);
  if (!w.some(tween)) return false;
  for (let i = 1; i < w.length; i++) {
    const p = w[i - 1], q = w[i];
    if (p.a < 50 || q.a < 50 || size(p) < MIN_ITEM_PX) continue;
    if (Math.abs(size(q) / size(p) - 1) > SNAP && !tween(p) && !tween(q)) return false;
  }
  return true;
}

export function check114(r, tl, add) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19it").length) return;
  const tEnd = r.t0 && r.ms ? r.t0 + r.ms : tl.length ? tl[tl.length - 1].t : 0;
  const ts = tracks(tl).filter((k) => !NOT_ITEM.test(k.key));
  const said = new Set();
  let n = 0;
  const out = (t, k, what) => { if (n >= 4 || said.has(k)) return; said.add(k); n++; add("contract-114", t, what); };
  for (const k of ts) {
    const S = k.samples;
    // 1. a snap in place: the same picture, two frames apart, a jump in size with no tween, held
    for (let i = 1; i < S.length; i++) {
      const a = S[i - 1], b = S[i];
      if (b.t - a.t > GAP_MS || a.a < 50 || b.a < 50 || size(a) < MIN_ITEM_PX) continue;
      const ratio = size(b) / size(a);
      if (Math.abs(ratio - 1) <= SNAP || tween(a) || tween(b)) continue;
      const until = S.slice(i + 1).find((x) => Math.abs(size(x) / size(b) - 1) > 0.05);
      const held = (until ? until.t : k.gone != null ? k.gone : tEnd) - b.t;
      if (held < HOLD_NEW_MS) continue;
      out(b.t, `${k.id}|size`, `${b.key} snaps from ${Math.round(size(a))} to ${Math.round(size(b))} px (${ratio > 1 ? "+" : ""}${Math.round((ratio - 1) * 100)}%) between two frames, no tween (${a.key !== b.key ? `the picture ${a.key} swapped for it; ` : ""}at ${fmtB(b.box)})`);
    }
  }
  // 2. a jump: a picture vanishes and the same thing appears in the same frame elsewhere or at another size, neither fading
  const byStart = new Map();
  for (const k of ts) { const t = k.samples[0].t; (byStart.get(t) || byStart.set(t, []).get(t)).push(k); }
  for (const k of ts) {
    if (k.gone == null) continue;
    const last = k.samples[k.samples.length - 1];
    if (last.a < 50 || size(last) < MIN_ITEM_PX) continue;
    const born = (byStart.get(k.gone) || []).filter((x) => x !== k && sameThing(x.key, k.key) && x.samples[0].a >= 50);
    for (const y of born) {
      const f = y.samples[0];
      const d = dist(midOf(f.box), midOf(last.box)), ratio = size(f) / size(last);
      if (d <= 0.5 * size(last) && Math.abs(ratio - 1) <= SNAP) continue;
      if (tween(f) && d <= 0.5 * size(last)) continue;
      out(k.gone, `${k.id}|jump`, `${last.key} at ${fmtB(last.box)} is swapped in one frame for ${f.key} at ${fmtB(f.box)} (${Math.round(d)} px away, ${Math.round(size(last))} to ${Math.round(size(f))} px): no glide, no fade`);
    }
  }
  // 3. step to step: one item's rests at two places keep its size (one item: a track, or a track and the one that took its place)
  const chains = [];
  const taken = new Set();
  for (const k of ts) {
    if (taken.has(k)) continue;
    const chain = [k];
    let cur = k;
    while (cur.gone != null) {
      const last = cur.samples[cur.samples.length - 1];
      const next = (byStart.get(cur.gone) || []).find((x) => x !== cur && !taken.has(x) && sameThing(x.key, cur.key));
      if (!next || last.a < 50) break;
      taken.add(next);
      chain.push(next);
      cur = next;
    }
    chains.push(chain);
  }
  for (const chain of chains) {
    const rs = chain.flatMap((k) => rests(k.samples, k.gone != null ? k.gone : tEnd).map((x) => ({ ...x, id: k.id })));
    const all = chain.flatMap((k) => k.samples).sort((p, q) => p.t - q.t);
    for (let i = 1; i < rs.length; i++) {
      const a = rs[i - 1], b = rs[i];
      if (a.size < MIN_ITEM_PX || b.size < MIN_ITEM_PX) continue;
      if (dist(midOf(a.box), midOf(b.box)) < PLACE * Math.max(a.size, b.size)) continue;
      const ratio = b.size / a.size;
      if (Math.abs(ratio - 1) <= SNAP) continue;
      // (Zafar's accepted designs, his words below: there a smooth tweened change passes; an untweened one, or a jump, still fails)
      if (acceptedSize(r.flow, a.key, b.key) && glided(all, a.t1, b.t0)) continue;
      out(b.t0, `${chain[0].id}|step${i}`, `${b.key} rests at ${Math.round(b.size)} px at ${fmtB(b.box)}, ${ratio > 1 ? "+" : ""}${Math.round((ratio - 1) * 100)}% of its ${Math.round(a.size)} px at its last place ${fmtB(a.box)} (${a.key}): an item keeps its size from step to step`);
    }
  }
}

// ---- shared helpers for the screen checks below ----
const stationOf = (flow) => { const m = /^(?:cook:(?:recipe:)?|lab:cook\/(?:recipe-)?)([\w-]+)/.exec(flow || ""); return m ? m[1] : null; };
const levelOf = (flow) => { const m = /@L(\d)/.exec(flow || "") || /level=(\d)/.exec(flow || ""); return m ? +m[1] : 1; };
const life = (tl, w) => tl.filter((e) => e.type === "c" && e.k === "life" && e.what === w);
// the station stages [{t0, t1, key}] (as lib/contract-s19.mjs stations)
export function stationsOf(tl) {
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
/** The kitchen's pictures on screen at time t (from the s19it samples): {cv, list: [{id, key, box, a, w, h, word, pill}]} */
export function sceneAt(tl, t) {
  const live = new Map();
  let cv = null;
  for (const e of tl) {
    if (e.t > t) break;
    if (e.type !== "c" || e.k !== "s19it") continue;
    if (e.cv) cv = e.cv;
    for (const c of e.ch || []) live.set(c[0], c);
    for (const id of e.gone || []) live.delete(id);
  }
  const list = [...live.values()].filter((c) => c[6] >= 50).map(([id, key, l, t0, r, b, a, tw, word, , w, h, , px, py]) => ({ id, key, box: [l, t0, r, b], a, w: w || r - l, h: h || b - t0, word: word || null, pill: px || py ? [px, py] : null }));
  return { cv, list };
}
// samples of kind k that stood at least ms (the next sample of that kind came no sooner): [{e, until}]
function heldSamples(tl, k, ms, tEnd) {
  const s = ev(tl, k);
  return s.map((e, i) => ({ e, until: s[i + 1] ? s[i + 1].t : tEnd })).filter((x) => x.until - x.e.t >= ms);
}
const inSt = (st, t) => st.find((s) => t >= s.t0 && t < s.t1);
const BAND = 0.3;       // js/shared/shelf.js Shelf.BAND: the bottom 270 of the 1600x900 design is the shelf band

// ---- 115: the main thing as big as the height allows; the shelf's items at one height (SH-245, CK-77) ----
export const MAIN_ROOM = 0.7;      // the main thing's height at least this share of the room above the band (chai's hob: 0.75, 0.86)
export const MAIN_WIDE = 0.85;     // ... unless its width already takes this share of the play area (a wide thing is width-bound)
// a shelf item stands at chai's height for its size class (data/cook.json words[id].size: L, M, S; M when none; Shelf.CLASS_K L 1, M .91,
// S .84), measured on chai at HEAD (11 Nov) as its L jars' height over the band's at each size; within SHELF_TOL under it. Chai's own
// jars sit within 2% of these; the eye judge's eggs bowl (CK-77, 3c4882609) stood at 86% of chai's M
export const CHAI_L = { "740x320": 0.568, "930x430": 0.578, "1280x665": 0.494, "1920x1080": 0.492 };
export const CLASS_K = { L: 1, M: 0.91, S: 0.84 };
export const SHELF_TOL = 0.1;
const CLASSES = new Map();
export function sizeClasses(root) {
  if (CLASSES.has(root)) return CLASSES.get(root);
  let w = {};
  try { w = JSON.parse(readFileSync(join(root, "data/cook.json"), "utf8")).words || {}; } catch (e) { /* none: every item M */ }
  const m = new Map(Object.entries(w).map(([id, x]) => [id, (x && x.size) || "M"]));
  CLASSES.set(root, m);
  return m;
}
export const SIZE_AT_MS = 3000;    // judged this long into each station (laid out; the order in)
// not the main thing: the shelf band's own tray, the knobs, faces and badges, the tools in the hand, the cat
export const NOT_MAIN = /njg-tray|knob|badge|face|nana|nani|spoon|ladle|turner|velan|knife|tong|spatula|whisk|cat\b|eg-cat/i;
Object.assign(S19B_CHECKS, {
  "contract-115": { item: "item-size", title: "the main thing as big as the height allows; the shelf's items at one height", how: `Cook flows, ${SIZE_AT_MS / 1000} s into each station, from the kitchen's pictures as drawn (s19it): the main thing (the tallest of the pictures above the shelf band at least half the biggest one's area: the hob, pot, board or grill) must stand at least ${MAIN_ROOM} of the room above the band (chai's hob: 0.75 at 1280x665, 0.86 at 740x320), unless its width already takes ${MAIN_WIDE} of the play area (SH-245, Zafar 9 Nov: 'maximize the vertical height of these stoves'). Each shelf item with a word stands at chai's height for its size class (data/cook.json words' size L, M or S; chai's L jars measured at each of the four sizes, M 0.91 and S 0.84 of it), no more than ${SHELF_TOL * 100}% under (chai's own jars sit within 2%; CK-77: eggs' bowl a speck on an empty band, 86% of chai's M). Once per station.` },
});
export function check115(r, tl, add, { root = "." } = {}) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19it").length) return;
  for (const s of stationsOf(tl)) {
    const t = s.t0 + SIZE_AT_MS;
    if (!(s.t1 > t)) continue;
    const { cv, list } = sceneAt(tl, t);
    if (!cv || !list.length) continue;
    const H = cv[3] - cv[1], W = cv[2] - cv[0], bandTop = cv[1] + (1 - BAND) * H, room = bandTop - cv[1];
    const above = list.filter((x) => !x.word && !NOT_MAIN.test(x.key) && (x.box[1] + x.box[3]) / 2 < bandTop);
    const area = (x) => (x.box[2] - x.box[0]) * (x.box[3] - x.box[1]);
    const big = above.length ? Math.max(...above.map(area)) : 0;
    const main = above.filter((x) => area(x) >= 0.5 * big).sort((a, b) => (b.box[3] - b.box[1]) - (a.box[3] - a.box[1]))[0];
    if (main) {
      const h = main.box[3] - main.box[1], w = main.box[2] - main.box[0];
      if (h < MAIN_ROOM * room && w < MAIN_WIDE * W) add("contract-115", t, `${s.key}: the main thing ${main.key} stands ${Math.round(h)} px, ${Math.round((100 * h) / room)}% of the ${Math.round(room)} px above the shelf band (at least ${MAIN_ROOM * 100}%: as big as the height allows; it is ${Math.round((100 * w) / W)}% of the width)`);
    }
    const shelf = list.filter((x) => x.word && (x.box[1] + x.box[3]) / 2 > bandTop - 0.05 * H);
    const ref = CHAI_L[r.size];
    if (shelf.length && ref) {
      const bandH = BAND * H, cls = sizeClasses(root);
      for (const x of shelf) {
        const c = cls.get(x.word) || "M", want = ref * CLASS_K[c] * bandH, h = x.h;
        if (h < (1 - SHELF_TOL) * want) { add("contract-115", t, `${s.key}: the shelf item ${x.word} (${x.key}, class ${c}) stands ${Math.round(h)} px, ${Math.round((100 * h) / want)}% of chai's ${c} height at ${r.size} (${Math.round(want)} px): one height per size class, within ${SHELF_TOL * 100}%`); break; }
      }
    }
  }
}

// ---- 116: the order card's padding and gaps, in the game (SH-165; labcheck's measure in the contract run) ----
export const PAD_EVEN = 2;      // px: a card's inner padding equal on all sides within this
export const GAP_EVEN = 2;      // px: the gaps between cards equal within this
export const ROW_FILL = 2 / 3;  // the cards fill at least this share of their row (one card in a box for 2.5 is a half-empty card)
export const PAD_HOLD_MS = 400;
export const CUR_HOLD_MS = 1000;
Object.assign(S19B_CHECKS, {
  "contract-116": { item: "card-pad", title: "the order card's padding and gaps, in the game", how: `Cook flows, in a station, every s19pad sample held ${PAD_HOLD_MS} ms (the side panel's order card, its row and each item card with its content's box: picture, words, speaker; lib/contract-s19b-hook.mjs): each item card's inner padding equal on all four sides within ${PAD_EVEN} px at 1280x665 (scaled with the screen's height); the gaps between cards equal within ${GAP_EVEN} px (scaled the same); the current card (the first not ticked) whole inside the row once the order is in, where it stands a second; and the cards filling at least two thirds of their row (corn's and maani's one card in a box made for 2.5: two thirds blank). Once per kind per page (SH-165, Q12's measurable half; labcheck measured it on lab pages only).` },
});
export function check116(r, tl, add) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19pad").length) return;
  const st = stationsOf(tl);
  const tEnd = r.t0 && r.ms ? r.t0 + r.ms : tl.length ? tl[tl.length - 1].t : 0;
  const said = new Set();
  const out = (k, t, m) => { if (said.has(k)) return; said.add(k); add("contract-116", t, m); };
  // (the 2 px are chai's at 1280x665: at another size the card is drawn at its own scale, so the tolerance is too)
  const H = (+(String(r.size || "").split("x")[1]) || 665);
  const tolPad = Math.max(PAD_EVEN, (PAD_EVEN * H) / 665), tolGap = Math.max(GAP_EVEN, (GAP_EVEN * H) / 665);
  const ord = ev(tl, "s19ord"), rowsS = ev(tl, "s19row");
  const ordering = (t) => { const o = ord.filter((x) => x.t <= t).pop(); return !!o && (o.away > 0 || o.pop > 0 || o.fly > 0); };
  for (const { e, until } of heldSamples(tl, "s19pad", PAD_HOLD_MS, tEnd)) {
    const s = inSt(st, e.t);
    if (!s || !e.box || !(e.cards || []).length || !e.row) continue;
    const cards = e.cards.slice().sort((a, b) => a.box[0] - b.box[0]);
    for (const c of cards) {
      if (!c.in) continue;
      const pads = [c.in[0] - c.box[0], c.in[1] - c.box[1], c.box[2] - c.in[2], c.box[3] - c.in[3]];
      if (Math.max(...pads) - Math.min(...pads) > tolPad) out("pad", e.t, `${s.key}: the order card "${c.w}" has padding ${pads.map((p) => Math.round(p * 2) / 2).join("/")} px (left/top/right/bottom): equal on every side within ${Math.round(tolPad * 10) / 10} px`);
    }
    const gaps = cards.slice(1).map((c, i) => c.box[0] - cards[i].box[2]);
    if (gaps.length > 1 && Math.max(...gaps) - Math.min(...gaps) > tolGap) out("gap", e.t, `${s.key}: the order cards' gaps are ${gaps.map(Math.round).join(", ")} px: equal within ${Math.round(tolGap * 10) / 10} px`);
    // (while the order is given the row follows the cards as they are said: the current card is judged once the order is in)
    const cur = cards.find((c) => !c.done);
    // (and the row still: a glide caught between two samples of a busy page is not where the card stands)
    // (a card ticked moves the row on after its tick, about 600 ms: the current card is judged where it stands a second)
    const gliding = rowsS.some((x) => x.t >= e.t - 300 && x.t <= e.t + CUR_HOLD_MS) || until - e.t < CUR_HOLD_MS;
    if (cur && !ordering(e.t) && !gliding && (cur.box[0] < e.row[0] - 1 || cur.box[2] > e.row[2] + 1)) out("cur", e.t, `${s.key}: the current order card "${cur.w}" at [${cur.box.map(Math.round)}] is cut by its row [${e.row.map(Math.round)}]: the current card whole in view`);
    const span = cards[cards.length - 1].box[2] - cards[0].box[0], rowW = e.row[2] - e.row[0];
    if (rowW > 0 && span < ROW_FILL * rowW) out("fill", e.t, `${s.key}: the order card's ${cards.length} card${cards.length > 1 ? "s" : ""} fill${cards.length > 1 ? "" : "s"} ${Math.round((100 * span) / rowW)}% of its ${Math.round(rowW)} px row: ${Math.round(100 - (100 * span) / rowW)}% of the card is blank (at least ${Math.round(ROW_FILL * 100)}% filled)`);
  }
}

// ---- 73 (rewritten): the bubble's speaker, from its own box (SH-153 as Zafar replaced it, 1 Nov: no speaker button in a speech bubble) ----
export const SPK_TAP = 47.5;
export function check73(r, tl, add) {
  if (!ev(tl, "s19spk").length) return;
  const tEnd = r.t0 && r.ms ? r.t0 + r.ms : tl.length ? tl[tl.length - 1].t : 0;
  const said = new Set();
  for (const { e } of heldSamples(tl, "s19spk", 300, tEnd)) {
    for (const x of e.list || []) {
      const w = x.box[2] - x.box[0], h = x.box[3] - x.box[1];
      if (/wp-say/.test(x.cls || "")) { if (!said.has("line")) { said.add("line"); add("contract-73", e.t, `a speaker button (${x.cls}) in the speech bubble "${x.text}": no speaker button in any speech bubble (SH-153, Zafar 1 Nov: 'remove the speaker buttons')`); } continue; }
      if (Math.min(w, h) < SPK_TAP && !said.has("tap")) { said.add("tap"); add("contract-73", e.t, `the speech bubble "${x.text}" has its speaker (${x.cls || "?"}) ${Math.round(w)}x${Math.round(h)} px, under the 48 px tap`); }
    }
  }
}

// ---- 72 (rewritten): the order row glides, from its scroll as drawn, frame by frame ----
export const JUMP_PX = 2;
export const FRAME_MS = 60;
export function check72(r, tl, add) {
  const all = ev(tl, "s19row");
  const glides = [];
  let g = null;
  all.forEach((e, i) => {
    const prev = all[i - 1];
    if (e.x == null || !e.vis || e.px == null) { g = null; return; }
    // (a row that shows already scrolled was hidden as it moved; a card added moves the scroll by layout, not by a glide)
    if (!prev || prev.x == null || !prev.vis || prev.n !== e.n) { g = null; return; }
    // (a frame that came late, the page busy, may hold a whole short glide: only a move within one ordinary frame is a jump)
    const step = { t: e.t, from: e.px, to: e.x, w: e.w, gap: e.pt != null ? e.t - e.pt : Infinity };
    if (g && e.pt != null && e.pt <= g.last + 25) { g.steps.push(step); g.last = e.t; }
    else { g = { steps: [step], last: e.t }; glides.push(g); }
  });
  for (const gl of glides) {
    const a = gl.steps[0].from, b = gl.steps[gl.steps.length - 1].to, w = gl.steps[0].w, d = Math.abs(b - a);
    // (SH-152's own measure: never more than a card's width in one frame; a smooth glide of a short way can finish in one slow frame)
    if (gl.steps.length === 1 && d > Math.max(JUMP_PX, w) && gl.steps[0].gap <= FRAME_MS) { add("contract-72", gl.steps[0].t, `the order row jumped ${Math.round(d)} px in one frame (${a} to ${b}), more than a card (${w} px): it glides, never jumps`); return; }
    if (w > 0 && d > 2.5 * w && b > 2) { add("contract-72", gl.steps[0].t, `the order row glided ${Math.round(d)} px at once, more than 2.5 cards (${w} px each)`); return; }
  }
}

// ---- 74 (rewritten): a tap during the order lands the whole order at once, from the page itself ----
export function check74(r, tl, segs, add) {
  if (!isCookFlow(r.flow) || /#replay/.test(r.flow || "")) return;
  const ord = ev(tl, "s19ord");
  if (!ord.length) return;
  const at = (t) => { let o = null; for (const e of ord) { if (e.t > t) break; o = e; } return o; };
  const ordering = (o) => !!o && (o.away > 0 || o.pop > 0 || o.fly > 0);
  const tap = ev(tl, "input").find((e) => e.play !== false && ordering(at(e.t)) && at(e.t).rows > 0);
  if (!tap) return;
  const after = at(tap.t + 1000);
  if (ordering(after)) add("contract-74", tap.t, `a tap during the order and 1 s later ${[after.pop ? `${after.pop} big card` : "", after.fly ? `${after.fly} card in flight` : "", after.away ? `${after.away} card${after.away > 1 ? "s" : ""} not yet in its row` : ""].filter(Boolean).join(", ")}: the tap lands the whole order at once`);
  const seg = (segs || []).find((x) => /(^|\|)cook:station/.test(x.key) && x.t0 >= tap.t - 50);
  const note = life(tl, "stage-start").find((x) => /^cook:station/.test(x.reason || "") && x.t >= tap.t - 50);
  const stage = ev(tl, "stage").find((x) => /(^|\|)cook:station/.test(x.key || "") && x.t >= tap.t - 50);
  const t0 = Math.min(...[seg && seg.t0, note && note.t, stage && stage.t].filter((x) => x != null));
  // (already in the station when the order was tapped: a lab round that gives its order at the station)
  const inside = (segs || []).some((x) => /(^|\|)cook:station/.test(x.key) && x.t0 < tap.t && (x.t1 == null || x.t1 > tap.t));
  if (!inside && !Number.isFinite(t0)) add("contract-74", tap.t, "a tap during the order and the station never started");
  else if (!inside && t0 - tap.t > 1000) add("contract-74", t0, `the station started ${Math.round(t0 - tap.t)} ms after the tap during the order (within 1 s)`);
}

// ---- G5: steps, decoys and no opt-ins (the check sort; s19-checks-2) ----
const lines = (v) => (v && v.lines) || [];
const calls = (v) => lines(v).filter((l) => l.role === "call" && (l.text || "").trim() && l.plays && l.plays.length);

// 36 (rewritten): Nani calls each step as it opens, the steps taken from the screen: each new lit thing (the kit's light on a thing it
// did not light just before) and each new current card on the order card (the first card not ticked), in a station
export const CALL_WITHIN = 6000;
export const CALL_BEFORE = 2000;   // a call may come just before its light (the call opens the step; the light follows)
export function screenSteps(tl) {
  const st = stationsOf(tl);
  const out = [];
  let lastThing = null;
  for (const e of ev(tl, "s19lit")) {
    const th = (e.things || [])[0];
    // (a light on a card is the help pointing at the order card's next item, contract-90's, not a step of the kitchen)
    if (!th || th.kind === "card" || !inSt(st, e.t)) continue;
    const m = midOf(th.box);
    if (lastThing && (lastThing.id === th.id || dist(m, lastThing.m) < 30)) { lastThing.m = m; continue; }
    lastThing = { id: th.id, m };
    out.push({ t: e.t, why: `the light on ${th.id}` });
  }
  let cur = null;
  for (const e of ev(tl, "s19pad")) {
    if (!inSt(st, e.t) || !(e.cards || []).length) continue;
    const c = e.cards.find((x) => !x.done);
    const k = c ? c.w : null;
    if (cur !== null && k && k !== cur) out.push({ t: e.t, why: `the order card's next card "${k}"`, card: 1 });
    if (k) cur = k;
  }
  // (a card that becomes current and a light that follows within 3 s are one step: the card names it, the light shows where)
  const lights = out.filter((x) => !x.card);
  return out.filter((x) => !x.card || !lights.some((l) => l.t >= x.t - 500 && l.t <= x.t + 3000)).sort((a, b) => a.t - b.t);
}
export function check36(r, tl, segs, v, add) {
  if (!isCookFlow(r.flow) || !(ev(tl, "s19lit").length || ev(tl, "s19pad").length)) return;
  const steps = screenSteps(tl);
  const cs = calls(v);
  const skips = life(tl, "step-call").filter((n) => /^skip/.test(n.by || ""));
  const used = new Set();
  steps.forEach((s, i) => {
    const next = steps[i + 1];
    const until = Math.min(s.t + CALL_WITHIN, next ? Math.max(next.t, s.t + 1500) : Infinity);
    const said = cs.find((l) => !used.has(l) && l.t0 >= s.t - CALL_BEFORE && l.t0 <= until);
    if (said) { used.add(said); return; }
    // (the game's own skip, logged as the step opened: no voiced line for it (a recording to make), Nani muted)
    if (skips.some((n) => n.t >= s.t - 1000 && n.t <= s.t + 3000)) return;
    add("contract-36", s.t, `a step opened on screen (${s.why}) and Nani did not call it (no call line from ${CALL_BEFORE / 1000} s before to ${Math.round((until - s.t) / 100) / 10} s after, no skip logged)`);
  });
}

// 37 (rewritten): decoys counted on the shelf: the shelf's things with a word that the order does not ask for
const LEX = new Map();
const GLOSS = new Map();
const PARTS = new Map();
export function itemWords(root) {
  if (LEX.has(root)) return LEX.get(root);
  const map = new Map();
  try {
    const lex = JSON.parse(readFileSync(join(root, "data/lang/lexicon.json"), "utf8"));
    let par = {};
    try { par = JSON.parse(readFileSync(join(root, "data/lang/paradigms.json"), "utf8")).paradigms || {}; } catch (e) { /* the lemma and its listed forms only */ }
    const split = (x) => String(x || "").toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || [];
    const own = new Map();
    for (const e of lex.entries || []) {
      const forms = new Set();
      const add = (x) => split(x).forEach((w) => forms.add(w));
      add(e.lemma);
      const walk = (x) => { if (typeof x === "string") add(x); else if (x && typeof x === "object") { if (typeof x.t === "string") add(x.t); else Object.values(x).forEach(walk); } };
      walk(e.forms || {});
      // (and the forms its paradigm makes, as the language engine does: samosa's card says ba bataata, n.potato's plural; s19-shared-checks)
      const pd = par[e.paradigm];
      if (pd && e.lemma) {
        let stem = e.lemma; const dr = pd.stem && pd.stem.drop; if (dr && stem.endsWith(dr)) stem = stem.slice(0, -dr.length);
        Object.values(pd.cells || {}).map((c) => (c && typeof c === "object" ? c.make : c)).filter((m) => typeof m === "string").forEach((m) => add(m.replace(/\{stem\}/g, stem).replace(/\{lemma\}/g, e.lemma)));
      }
      own.set(e.id, { forms, pos: e.pos });
      for (const a of e.aliases || []) map.set(String(a), new Set([...(map.get(String(a)) || []), ...forms]));
      // (a word with no Kutchi yet stands on its card as its English, grey: its gloss, whole)
      if (e.gloss) for (const a of e.aliases || []) GLOSS.set(`${root}|${a}`, String(e.gloss).toLowerCase().trim());
    }
    // (a word built of parts, chaat's mint chutney, fudino ji chutney: its nouns, each in any of its forms, on one card)
    for (const e of lex.entries || []) {
      const nouns = (e.parts || []).map((p) => own.get(p.lex)).filter((x) => x && x.pos === "N" && x.forms.size).map((x) => x.forms);
      if (nouns.length) for (const a of e.aliases || []) PARTS.set(`${root}|${a}`, nouns);
    }
  } catch (e) { /* no lexicon: every shelf thing reads as a decoy unless its id is a word on the card */ }
  LEX.set(root, map);
  return map;
}
// (stations whose rows are full by design: the pantry's shelf and the daar's chop hold at least the table's count)
export const DECOY_AT_LEAST = /^(fetch|pantry|daar|daal)$/;
// s19-shared-checks (Zafar, 11 Nov: contract-37 judged by the levels table): the count a station wants at a level is the levels table's
// (data/rules.json levels.decoys, read from the game being judged), a station's own row first where it has one (data/cook.json
// levelTable.stations[game].decoys, as js/cook/station-lib.js Cook.levelRow reads it), and none for chop's hop at L1 (CK-71). The game
// is each station's own, not the flow's: chaat's first station is chop's game (its chop-* notes), its second the toppings.
const TABLES = new Map();
export function decoyTable(root, fallback = {}) {
  if (TABLES.has(root)) return TABLES.get(root);
  let lv = null, own = {};
  try { lv = (JSON.parse(readFileSync(join(root, "data/rules.json"), "utf8")).levels || {}).decoys || null; } catch (e) { /* the fallback */ }
  try { own = (JSON.parse(readFileSync(join(root, "data/cook.json"), "utf8")).levelTable || {}).stations || {}; } catch (e) { /* none */ }
  const t = { levels: Array.isArray(lv) && lv.length ? lv : [1, 2, 3, 4].map((l) => fallback[l]).filter((x) => x != null), own };
  TABLES.set(root, t);
  return t;
}
export function decoysWanted(t, game, level) {
  if (game === "chop" && level === 1) return 0; // (CK-71: chop's hop has no decoys at L1)
  const at = (list) => (Array.isArray(list) && list.length ? list[Math.min(list.length, level) - 1] : list);
  const own = (t.own || {})[game];
  if (own && own.decoys != null) return at(own.decoys);
  return at(t.levels);
}
// the game a station stage plays: chop's where chop's own notes run in it (chop-strip, chop-hop, chop-throw), else the flow's
// (daar's chop keeps daar's row: its rows are full by design, DECOY_AT_LEAST)
export function gameOfStation(tl, s, flowGame) {
  if (DECOY_AT_LEAST.test(flowGame || "")) return flowGame;
  return tl.some((e) => e.type === "c" && e.k === "life" && /^chop-/.test(e.what || "") && e.t >= s.t0 && e.t < s.t1) ? "chop" : flowGame;
}
export function check37(r, tl, add, { root = ".", table = {} } = {}) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19shelf").length) return;
  const st0 = stationOf(r.flow), level = levelOf(r.flow);
  const T = decoyTable(root, table);
  const words = itemWords(root);
  const tEnd = r.t0 && r.ms ? r.t0 + r.ms : tl.length ? tl[tl.length - 1].t : 0;
  const st = stationsOf(tl);
  const pads = ev(tl, "s19pad").filter((e) => (e.cards || []).length);
  const said = new Set();
  for (const { e } of heldSamples(tl, "s19shelf", 1000, tEnd)) {
    const s = inSt(st, e.t);
    if (!s || said.has(s.key) || !(e.items || []).length) continue;
    const pad = pads.filter((p) => p.t <= e.t).pop();
    if (!pad) continue;
    const game = gameOfStation(tl, s, st0);
    const want = decoysWanted(T, game, Math.min(4, level));
    if (want == null) continue;
    const card = new Set(pad.cards.flatMap((c) => String(c.w).toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []));
    // (a card names its thing by its word id where the probe has it, data-word, s19-shared-checks: a word with no Kutchi yet shows its English, grey,
    // which no lexicon form matches, chaat's mint chutney, ph-lili; its words where the probe is older)
    const keys = new Set(pad.cards.map((c) => c.id).filter(Boolean).map(String));
    const texts = new Set(pad.cards.map((c) => String(c.w).toLowerCase().replace(/\s+/g, " ").trim()));
    const cardWords = pad.cards.map((c) => new Set(String(c.w).toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []));
    const byParts = (id) => { const ns = PARTS.get(`${root}|${id}`); return !!ns && cardWords.some((cw) => ns.every((f) => [...f].some((w) => cw.has(w)))); };
    const asked = (id) => keys.has(String(id)) || texts.has(GLOSS.get(`${root}|${id}`)) || byParts(id) || [...(words.get(id) || [])].some((w) => card.has(w)) || card.has(String(id).replace(/^(cook|n|v|a)[-.]/, "").toLowerCase());
    const decoys = e.items.filter((x) => !asked(x.id));
    const atLeast = DECOY_AT_LEAST.test(game || "");
    const ok = atLeast ? decoys.length >= want : decoys.length === want;
    said.add(s.key);
    if (!ok) add("contract-37", e.t, `${s.key} (${game} at L${level}): ${decoys.length} decoy${decoys.length === 1 ? "" : "s"} on the shelf (${e.items.map((x) => x.id + (decoys.includes(x) ? "*" : "")).join(", ")}; * not in the order), the table wants ${atLeast ? "at least " : ""}${want}`);
  }
}

// 109 (one or two items): each on chai's base and chip lines at that size; a lone item over its pill
// (chai at HEAD, measured by this check's probe, 11 Nov: its shelf's feet and pills' middles, px from the canvas top)
export const CHAI_LINE = { "740x320": { foot: 296, chip: 307 }, "930x430": { foot: 397, chip: 412 }, "1280x665": { foot: 621, chip: 642 }, "1920x1080": { foot: 1008, chip: 1042 } };
export function check109few(r, tl, add) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19shelf").length) return;
  const line = CHAI_LINE[r.size];
  const tEnd = r.t0 && r.ms ? r.t0 + r.ms : tl.length ? tl[tl.length - 1].t : 0;
  for (const { e } of heldSamples(tl, "s19shelf", 300, tEnd)) {
    const it = (e.items || []).filter((x) => !x.rot);
    if (!it.length || it.length >= 3) continue;
    if (line) {
      const off = it.find((x) => Math.abs(x.foot - line.foot) > 4);
      if (off) { add("contract-109", e.t, `the shelf item ${off.id} stands ${Math.round(off.foot - line.foot)} px off chai's base line (${line.foot} px at ${r.size}): one line for every shelf`); return; }
      const offc = it.find((x) => x.chip != null && Math.abs(x.chip - line.chip) > 2);
      if (offc) { add("contract-109", e.t, `the pill under ${offc.id} sits ${Math.round(offc.chip - line.chip)} px off chai's chip line (${line.chip} px at ${r.size})`); return; }
    }
    if (it.length === 1) {
      const sc = sceneAt(tl, e.t).list.find((x) => x.word === it[0].id && x.pill);
      if (sc && Math.abs(midOf(sc.box)[0] - sc.pill[0]) > 4) { add("contract-109", e.t, `the lone shelf item ${it[0].id} stands ${Math.round(midOf(sc.box)[0] - sc.pill[0])} px off its pill's middle: a lone item centred in its slot`); return; }
    }
  }
}

// ---- the timed windows, from the kit's heat ring as drawn (70, 77, 96): every game that cooks with heat draws Cook.Kit.heatRing ----
/** Each ring's runs: [{id, t0, tIn (entered the green), lo, hi, samples, cleared, tOut}] */
export function ringRuns(tl) {
  const runs = [];
  const cur = new Map();
  for (const e of ev(tl, "s19ring")) {
    let run = cur.get(e.id);
    if (e.clear) { if (run) { run.cleared = e.t; cur.delete(e.id); } continue; }
    if (run && e.lv < 0.05 && run.samples.length && run.samples[run.samples.length - 1].lv > 0.3) { run.reset = e.t; cur.delete(e.id); run = null; }
    if (!run) { run = { id: e.id, t0: e.t, lo: e.lo, hi: e.hi, samples: [], tIn: null, cleared: null, reset: null }; cur.set(e.id, run); runs.push(run); }
    run.samples.push({ t: e.t, lv: e.lv });
    if (run.tIn == null && e.lv >= e.lo) run.tIn = e.t;
  }
  return runs;
}
// 70 (rewritten): the turn-off call at the green, every timed window: a call line starts as the ring enters its green
export const SLOW_LATE = 0.06;
export function check70(r, tl, v, add) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19ring").length) return;
  const cs = calls(v);
  const covered = [];
  const speed = +((/#speed(\d+)/.exec(r.flow || "") || [])[1] || 3);
  for (const run of ringRuns(tl)) {
    if (run.tIn == null) continue;
    if (covered.some((t) => Math.abs(t - run.tIn) < 1500)) continue;
    // (Cook's test speed fills the ring that many times faster while a voice keeps its own length: the window in level is scaled by it,
    // as contract-79 scales its beat; at speed 1 it is chai's 0.06)
    const late = run.samples.find((s) => s.lv >= run.lo + SLOW_LATE * speed);
    // (a ring the child ends before it is late owes its call only if it stood in the green 1.5 s: the call had its time)
    const end = run.cleared || run.reset || (run.samples.length ? run.samples[run.samples.length - 1].t : run.tIn);
    if (!late && end - run.tIn < 1500) continue;
    const tLate = (late ? late.t : run.tIn + 1500) + 400;
    const said = cs.find((l) => l.t0 >= run.tIn - 300 && l.t0 <= tLate);
    if (said) { covered.push(run.tIn); continue; }
    const early = cs.filter((l) => l.t0 < run.tIn - 300 && l.t0 >= run.t0).pop();
    const lvAt = (t) => (run.samples.filter((s) => s.t <= t).pop() || { lv: 0 }).lv;
    if (early && lvAt(early.t0) >= run.lo - 0.15) add("contract-70", early.t0, `"${early.text.trim()}" at ${lvAt(early.t0).toFixed(3)}, before the green (it starts at ${run.lo}): called early`);
    else add("contract-70", run.tIn, `the heat ring entered its green (${run.lo}-${run.hi}) and no call was said by ${(run.lo + SLOW_LATE * speed).toFixed(2)} (the turn-off call as the bar enters the green${speed > 1 ? `; 0.06 a speed, at speed ${speed}` : ""})`);
    return;
  }
}
// 77 (rewritten): the first-time hold, from the ring: a new player's first timed window holds in the middle of its green until the tap
export function check77(r, tl, add) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19ring").length) return;
  const runs = ringRuns(tl).filter((x) => x.tIn != null);
  if (!runs.length) return;
  const inputs = ev(tl, "input").map((e) => e.t);
  const tapAfter = (t) => inputs.find((x) => x >= t);
  const returning = /#returning/.test(r.flow || "");
  const mid = (x) => x.lo + (x.hi - x.lo) * 0.5;
  if (!returning) {
    const run = runs[0];
    const tap = tapAfter(run.tIn);
    const past = run.samples.find((s) => s.t > run.tIn && s.lv > mid(run) + 0.015 && (tap == null || s.t < tap));
    if (past) add("contract-77", past.t, `a new player's first timed window: the ring went on past the middle of its green (${mid(run).toFixed(2)}, at ${past.lv}) before the tap (the first-time hold waits in the green until the child acts)`);
    return;
  }
  for (const run of runs) {
    const at = run.samples.filter((s) => Math.abs(s.lv - mid(run)) < 0.01);
    if (at.length < 2) continue;
    const held = at[at.length - 1].t - at[0].t;
    if (held >= 1500) { add("contract-77", at[0].t, `a returning player's heat held in the middle of its green ${Math.round(held / 100) / 10} s (the first-time hold is a new player's only)`); return; }
  }
}
// 96 (rewritten): after a boil-over (a ring past its green that empties by itself: cleared or back to 0 with no tap), the card's rows
// open again and its row is back at the first item
export const REOPEN_MS = 1500;
export function check96(r, tl, add) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19ring").length) return;
  const inputs = ev(tl, "input").map((e) => e.t);
  const pads = ev(tl, "s19pad"), rows = ev(tl, "s19row");
  for (const run of ringRuns(tl)) {
    const over = run.samples.find((s) => s.lv > run.hi + 0.02 || s.lv >= 0.999);
    const end = run.cleared || run.reset;
    if (!over || !end || inputs.some((t) => t >= end - 400 && t <= end)) continue;
    const doneAt = (t) => { const p = pads.filter((x) => x.t <= t).pop(); return p && p.cards ? p.cards.filter((c) => c.done).length : 0; };
    const before = doneAt(end - 1);
    if (!before) continue;
    const win = pads.filter((p) => p.t >= end && p.t <= end + REOPEN_MS);
    if (!win.some((p) => (p.cards || []).filter((c) => c.done).length < before)) { add("contract-96", end, `a pot boiled over and emptied, and ${before} card${before > 1 ? "s" : ""} stayed ticked for ${REOPEN_MS} ms (its rows open again)`); return; }
    const rw = rows.filter((x) => x.t >= end && x.t <= end + REOPEN_MS && x.x != null);
    if (rw.length && !rw.some((x) => x.x <= 2)) { add("contract-96", end, `a pot boiled over and its card is scrolled ${rw[rw.length - 1].x} px along, not back at the first item within ${REOPEN_MS} ms`); return; }
  }
}
// 71 (rewritten): once each: Cook's tick path finds an open row for every add (an add with no row that wants it is a second one) and a
// row never counts past its need; the add notes a station writes (chai's chai-add: who:count) still read
export function check71(r, tl, add) {
  if (!isCookFlow(r.flow) || !ev(tl, "s19tick").length) return;
  const st = stationsOf(tl);
  const ticks = ev(tl, "s19tick"), taps = ev(tl, "input").map((e) => e.t);
  for (const e of ticks) {
    if (e.un || !inSt(st, e.t)) continue;
    // (an add is the child's: one tick, within 1.5 s of a tap; a batch of ticks at once is the station's own bookkeeping, chai's serve)
    const batch = ticks.some((x) => x !== e && Math.abs(x.t - e.t) <= 100);
    if (!e.row && !batch && taps.some((t) => t <= e.t && t >= e.t - 1500)) { add("contract-71", e.t, `${e.id} went in again with no row on the card wanting it (a second tap adds nothing)`); return; }
    if (e.got > e.need) { add("contract-71", e.t, `${e.id} counted ${e.got} of ${e.need} on its row (once each: a second tap adds nothing)`); return; }
  }
  for (const n of tl.filter((x) => x.type === "c" && x.k === "life" && /-add$/.test(x.what || ""))) {
    const [who, count, again] = String(n.by || "").split(":");
    if (again === "again" || again === "capped") continue;
    if (Number(count) > 1) { add("contract-71", n.t, `${n.reason} went into ${who}'s pan a ${Number(count) === 2 ? "second" : `${count}th`} time (a second tap adds nothing)`); return; }
  }
}
// 90: chai's first-time pointer (its design: after the tea, the card's next item lit for a new player who pauses); the card light of
// every game is the check sort's G6 (the light over time, from the frames), so 90 keeps chai's own notes, with no games.json field
export const CARD_LIGHT = { note: "chai-add", first: "cook-chai", stations: /^chai-tray$/ };
export function check90(r, tl, add) {
  const f = r.flow || "";
  if (!isCookFlow(f) || /#(returning|mistake|takeback)/.test(f) || !/^cook:/.test(f) || !CARD_LIGHT.stations.test(stationOf(f) || "")) return;
  const adds = life(tl, CARD_LIGHT.note).filter((n) => !/:(again|capped)$/.test(String(n.by || "")));
  const first = adds.find((n) => n.reason === CARD_LIGHT.first);
  if (!first) return;
  const after = adds.find((n) => n.t > first.t && n.reason !== CARD_LIGHT.first);
  if (!after) return;
  const next = ev(tl, "input").find((e) => e.t > first.t);
  if (next && next.t - first.t < 2500) return;
  if (!life(tl, "card-light").length) add("contract-90", after.t, `a new player at L${levelOf(f)}: the first item (${CARD_LIGHT.first}) went in and the next item followed, but the order card's next item was never lit (no card-light note): the first time's pointer to the third item is missing`);
}

// 78's control calls, from the page (no opt-in, s19-checks-2; it was games.json controlCalls, chai's "chulo bar" and "slow kar"): a call
// line said while a heat ring is up in its green (the turn-off), or in the 2.5 s before a stove's knob turns on (the turn-on): its words
const normCall = (x) => String(x || "").toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, " ").replace(/\s+/g, " ").trim(); // (contract-s14's norm)
export function controlCallsOf(tl, v) {
  const out = new Set();
  const cs = calls(v);
  for (const run of ringRuns(tl)) {
    if (run.tIn == null) continue;
    const end = run.cleared || run.reset || (run.samples.length ? run.samples[run.samples.length - 1].t + 2000 : run.tIn);
    for (const l of cs) if (l.t0 >= run.tIn - 300 && l.t0 <= end) out.add(normCall(l.text));
  }
  const ons = [];
  const keys = new Map();
  for (const e of ev(tl, "s19it")) for (const c of e.ch || []) { const was = keys.get(c[0]); if (/knob-on/.test(c[1]) && !(was && /knob-on/.test(was))) ons.push(e.t); keys.set(c[0], c[1]); }
  for (const t of ons) for (const l of cs) if (l.t0 <= t && l.t0 >= t - 2500) out.add(normCall(l.text));
  return [...out];
}
