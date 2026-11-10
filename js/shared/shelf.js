/*
 * The shelf (Sprint 18, the shared kit, module map pieces 9 and 10; decision 13: every game that lays things out to pick needs it):
 * the band things stand in, the decoys by level, the size classes, the slots, and the word pills under each thing. Moved out of
 * the reference game's station file and the station library (js/cook/station-lib.js St.tableDecoys, St.classFit, the band rule),
 * which now call this file. No game is named here (STD-F1-02): a game passes its own pool, data and numbers.
 * Loads on a page without js/cook/ (a plain <script>, or imported for its side effect by an ES module); Node: require().
 *
 * The band (29 Sept, X7; SH-112): the bottom 30% of a 1600x900 design (630-900), the word pills centred at 860 (46 high). The gap
 * from the band's top to the tallest thing equals the gap under the pills; a thing's hop (when it is pointed at) and its glow keep
 * inside it.
 *   Shelf.BAND                                {top, bottom, chipY, chipH, glow, base} in design px (base: the line things stand on)
 *   Shelf.pad(), Shelf.itemTop(), Shelf.hop(h) the band's top gap, the highest a thing reaches, how far a thing h tall hops
 *   Shelf.band(H)                             the same band at H px tall (a DOM shelf): {pad, itemTop, base, chipY, chipH, u}
 *
 * Decoys by level (CK-49, SH-155; contract-37: 1, 2, 3, 4 from the central rules, data/rules.json, one a lookalike at L4):
 *   Shelf.levelRow(level)                     {level, decoys, lookalike} from js/shared/rules.js (Rules.level), else its defaults
 *   Shelf.decoys(pool, not, level, o) -> ids  n of pool (leaving out `not`), at a lookalike level one of them a lookalike of a
 *                                             wanted thing where the pool has one. o: {want, ok(id), n, also, alsoLook, what, row,
 *                                             lookalikes {id: [ids]}, groups [[ids]], shuffle, note}. Reports through o.note
 *                                             (default Shelf.decoyNote: Lifecycle "decoys", what contract-37 reads)
 *   Shelf.decoyNote(n, {what, lookalike})     the report alone (a game that picks its own)
 *
 * Size classes (Zafar, 6 Nov; Fable's method, build/reports/size-classes-method-2026-11-06.md): token steps, never true sizes.
 *   Shelf.CLASS_K {L 1, M .91, S .84}, Shelf.FLOOR_CSS 40
 *   Shelf.sizeClass(id, {words, sizes})       {size, flag, given}: words[id].size first, then sizes[id].size; missing = M
 *   Shelf.classFit(pic, cls, o)               the scale for a picture {ph (its opaque height), pw (its width)} of class cls
 *                                             standing on o.base: {scale, cls, flag, k, h, hL, floored, capped}
 *                                             o: {base, ppw (CSS px per design px), slotW, hop, floorCss}
 *
 * Slots (SH-208, SH-219: Zafar 1-6 Nov): a row of groups centred on a span, widening evenly to the view's margins where
 * the pills would touch, then the groups' gaps closing to minGap, then the pills sitting close.
 *   Shelf.slots(groups, {span:[l, r], view:[l, r], pitch, groupGap, pillRoom, minGap}) -> {slotW, gapW, width, x0, mid, x: {id: x}}
 *
 * Word pills (SH-159, SH-219): `speaker word` while the word is written (the core's pill ladder: progress.pillShows), the speaker
 * alone after; at least PILL.min CSS px of word on screen, at most PILL.max times, never touching (gap apart).
 *   Shelf.PILL                                {min, max, text, pad, spkW, w, h, hitW, hitH}
 *   Shelf.faceW(word, textW)                  one pill's width (textW: the word's measured width at PILL.text px)
 *   Shelf.pillWant(ppw), Shelf.pillGap(ppw)   the scale the floor asks for; the least gap between two pills
 *   Shelf.pillRoom(widths, want, gap)         the slot a row of pills needs (widths in row order)
 *   Shelf.pillScale(row, {want, gap, slotW}) -> {k, cap}   row: [{x, w}] in order; k never under 1; cap: the width a long word
 *                                             narrows to where even 1 would touch
 *
 * Drawn on the page (DOM: a game drawn on the page, the lab): styles in css/shared/tally.css (the count pills' sheet).
 *   Shelf.speakerSvg()                        the flat speaker icon (currentColor)
 *   Shelf.chip(text, {word, missing, onTap}) -> el   one pill (a <button>): el.setWord(bool)
 *   Shelf.mount(host, {groups, pic(id), text(id), missing(id), shows(id), size(id), onTap(id), pad}) -> shelf
 *                                             a whole shelf in host's box: shelf.setWord(id, bool), .layout(), .items, .destroy()
 * Drawn on a canvas (Phaser; Cook's stations): the same pill and speaker.
 *   Shelf.P.speaker(g, x, y, s, color)        the speaker into a Graphics, about s px tall
 *   Shelf.P.chip(S, x, y, text, {word, w, cap, depth, onTap}) -> container   chip.face(word, cap), chip.hit(slotW)
 *   Shelf.P.reach(obj)                        an item's tap area reaching its pill (below): obj.chip read at each tap
 *
 * The stone tray (ART-69, SH-243; Zafar, 9 Nov: "if the game is top down, and we're showing the items top down as well ... we have the
 * items on a tray at the bottom ... the tray is in the game space, kind of sitting on the countertop"; then "a modern stone version";
 * Fable's spec, build/reports/s19-stone-tray-fable.md): top-down things lie on ONE honed warm-grey limestone slab along the whole band
 * (field #C4B8AD shading to #B5A99E at its edges, a fine even speckle, no veins; a low soft lip 3-4% of its depth in the same stone,
 * lit on its upper-left; corner radius an eighth of its depth; a soft contact shadow lower-right), inset from the view's sides by 3%.
 * Side-on things keep the stone shelf (the stone band's base). One painter for the page and the canvas:
 *   Shelf.TRAY                                its colours and proportions
 *   Shelf.trayBox({left, right, top, bottom}) the slab's box in the band: {x, y, w, h, r, lip, sh, pad} (sh: the shadow's offset;
 *                                             pad: the room round it the shadow needs)
 *   Shelf.trayPaint(ctx, box, {scale, seed})  paints the slab and its shadow on a 2D canvas whose (0, 0) is the box's corner less pad;
 *                                             returns {w, h}, the canvas size it needs (ctx null: only the size)
 *   Shelf.P.tray(S, {top, bottom, view, depth}) the slab on a Phaser scene (a canvas texture at the screen's own resolution), redrawn
 *                                             when the view changes shape; view() -> {left, right, bottom} (the visible world)
 *
 * Tap areas (SH-244; Zafar, 9 Nov, his tester on his phone: "She thought she was pressing the items, but she was pressing the speaker
 * buttons below the items"): ONE rule for every shelf. An item's tap area is its picture and, below it, its slot down to its pill's
 * top, across the slot's width (Shelf.P.reach; Cook's S.tappable gives it to everything it makes tappable). The pill's is its card
 * and a small margin (PILL.margin) at its sides and foot; where the two meet, at the pill's top edge, the item wins: the pill's area
 * starts at its card's top. So a tap at an item's foot, or in the gap above its pill, picks the item; only the card says the word.
 */
(function (root, factory) {
  const Shelf = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Shelf;
  else {
    root.Shelf = Shelf;
    (root.Shared = root.Shared || {}).shelf = Shelf;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const Shelf = {};

  /* ---------------- the band ---------------- */
  const BAND = { top: 630, bottom: 900, chipY: 860, chipH: 46, glow: 4, base: 818 };
  Shelf.BAND = BAND;
  Shelf.pad = () => BAND.bottom - (BAND.chipY + BAND.chipH / 2);
  Shelf.itemTop = () => BAND.top + Shelf.pad();
  Shelf.hop = (h) => Math.max(6, Math.min(16, h * 0.07));
  /** The band at H px tall (u: px per design px). */
  Shelf.band = function (H) {
    const u = H / (BAND.bottom - BAND.top);
    return { u, pad: Shelf.pad() * u, itemTop: Shelf.pad() * u, base: (BAND.base - BAND.top) * u, chipY: (BAND.chipY - BAND.top) * u, chipH: BAND.chipH * u, glow: BAND.glow * u };
  };

  /* ---------------- decoys by level ---------------- */
  const DEFAULT_ROW = { decoys: [1, 2, 3, 4], lookalike: [false, false, false, true] };
  const lvOf = (lv) => Math.min(4, Math.max(1, Math.round(Number(lv)) || 1));
  Shelf.levelRow = function (level) {
    const lv = lvOf(level);
    const R = root.Rules && root.Rules.level ? root.Rules.level(lv) : null;
    if (R) return { level: lv, decoys: R.decoys, lookalike: !!R.lookalike };
    return { level: lv, decoys: DEFAULT_ROW.decoys[lv - 1], lookalike: DEFAULT_ROW.lookalike[lv - 1] };
  };
  Shelf.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  Shelf.decoyNote = function (n, { what = "", lookalike = false } = {}) {
    try {
      if (root.Lifecycle && root.Lifecycle.note) root.Lifecycle.note("decoys", { step: String(n), by: `${what}${what ? " " : ""}lookalike:${lookalike ? 1 : 0}` });
    } catch (e) {
      /* only a log */
    }
  };
  Shelf.decoys = function (pool, not, level, { want = not, ok = () => true, what = "", n = null, also = 0, alsoLook = false, row = null, lookalikes = {}, groups = [], shuffle = Shelf.shuffle, note = Shelf.decoyNote } = {}) {
    const r = row || Shelf.levelRow(level);
    const need = n == null ? r.decoys : n;
    const left = [...new Set((pool || []).filter((x) => !not.includes(x) && ok(x)))];
    const out = [];
    let look = false;
    if (r.lookalike && need > 0 && !alsoLook) {
      // (a lookalike the game can draw: its lookalikes, else a picture from the same lookalike group, from the pool)
      const gs = (groups || []).filter(Array.isArray);
      const mates = (w) => ((lookalikes || {})[w] || []).concat(...gs.filter((g) => g.includes(w)));
      const cand = shuffle([].concat(...[].concat(want || []).map(mates))).find((x) => left.includes(x));
      if (cand) {
        out.push(cand);
        look = true;
      }
    }
    shuffle(left).forEach((x) => out.length < need && !out.includes(x) && out.push(x));
    // (also: things on offer nobody asked for besides these, counted; a pool with no more to offer says so, room:n, for contract-37)
    if (note) note(out.length + also, { what: out.length < need ? `${what} room:${out.length + also}` : what, lookalike: look || (r.lookalike && alsoLook) });
    return out;
  };

  /* ---------------- size classes ---------------- */
  Shelf.CLASS_K = { L: 1, M: 0.91, S: 0.84 };
  Shelf.FLOOR_CSS = 40;
  Shelf.sizeClass = function (id, { words = {}, sizes = {} } = {}) {
    const w = (words || {})[id];
    const a = (sizes || {})[id];
    const e = w && w.size ? w : a && a.size ? a : null;
    return { size: e && Shelf.CLASS_K[e.size] ? e.size : "M", flag: (e && e.sizeFlag) || null, given: !!e };
  };
  Shelf.classFit = function (pic, cls, { base = BAND.base, ppw = 1, slotW = Infinity, hop = true, floorCss = Shelf.FLOOR_CSS, itemTop = Shelf.itemTop(), glow = BAND.glow } = {}) {
    const c = typeof cls === "string" ? { size: cls, flag: null } : cls || { size: "M", flag: null };
    const size = Shelf.CLASS_K[c.size] ? c.size : "M";
    const k = Shelf.CLASS_K[size];
    const room = base - itemTop - glow;
    let hL = room;
    for (let n = 0; n < 4; n++) hL = room - (hop ? Shelf.hop(hL) : 0);
    const out = { scale: 1, cls: size, flag: c.flag || null, k, h: 0, hL, floored: false, capped: false };
    if (!pic || !(pic.ph > 0) || !(pic.pw > 0)) return out;
    const { ph, pw } = pic;
    let s;
    if (c.flag === "W" && isFinite(slotW)) s = (slotW * k) / pw;
    else if (c.flag === "LONG") s = (hL * k) / Math.max(ph, pw);
    else s = (hL * k) / ph;
    const floor = floorCss / Math.max(1e-6, ppw);
    if (ph * s < floor) {
      s = floor / ph;
      out.floored = true;
    }
    if (isFinite(slotW) && pw * s > slotW) {
      s = slotW / pw;
      out.capped = true;
    }
    out.scale = Math.max(0.05, s);
    out.h = ph * out.scale;
    return out;
  };

  /* ---------------- slots ---------------- */
  Shelf.slots = function (groups, { span, view, pitch, groupGap, pillRoom = 0, minGap = 20 }) {
    const gs = groups.filter((g) => g && g.length);
    const [spanL, spanR] = span;
    const [VL, VR] = view || span;
    const mid = (spanL + spanR) / 2;
    const roomW = 2 * Math.min(mid - VL, VR - mid, (spanR - spanL) / 2);
    const n = gs.reduce((a, g) => a + g.length, 0) || 1;
    const nG = Math.max(0, gs.length - 1);
    let gapW = groupGap;
    let slotW = Math.min(Math.max(pitch, pillRoom), (roomW - nG * gapW) / n);
    if (slotW < pillRoom) {
      const roomMid = 2 * Math.min(mid - VL, VR - mid);
      const fit = (g) => (roomMid - nG * g) / n;
      if (fit(gapW) < pillRoom) gapW = Math.max(minGap, Math.min(groupGap, (roomMid - n * pillRoom) / Math.max(1, nG)));
      slotW = Math.min(pillRoom, fit(gapW));
    }
    const width = n * slotW + nG * gapW;
    const x0 = mid - width / 2;
    const x = {};
    let sx = x0 + slotW / 2;
    gs.forEach((g) => {
      g.forEach((id) => {
        x[id] = sx;
        sx += slotW;
      });
      sx += gapW;
    });
    return { slotW, gapW, width, x0, mid, x };
  };

  /* ---------------- word pills ---------------- */
  Shelf.PILL = { min: 13, max: 1.5, text: 25, pad: 48, spkW: 62, w: 128, h: 46, hitW: 142, hitH: 80, margin: 8 };
  Shelf.faceW = (word, textW) => (word ? textW + Shelf.PILL.pad : Shelf.PILL.spkW);
  Shelf.pillWant = (ppw) => Math.max(1, Math.min(Shelf.PILL.max, Shelf.PILL.min / (Shelf.PILL.text * ppw)));
  Shelf.pillGap = (ppw) => Math.max(12, 5 / ppw);
  Shelf.pillRoom = function (widths, want, gap) {
    const pairs = widths.slice(1).map((w, i) => (widths[i] + w) / 2);
    return Math.max(Shelf.PILL.spkW, ...pairs) * want + gap;
  };
  Shelf.pillScale = function (row, { want = 1, gap = 12, slotW = Infinity } = {}) {
    let k = want;
    row.slice(1).forEach((c, i) => {
      const b = row[i];
      k = Math.min(k, (c.x - b.x - gap) / ((b.w + c.w) / 2));
    });
    // (a pill at its own size, k 1, keeps inside its slot as well: a long word there reached under the next thing's picture on a big
    // screen, so the light round that thing could not be whole; s19-stoves, SH-243's leftover)
    const cap = k <= 1 ? slotW - gap : Infinity;
    return { k: Math.max(1, k), cap };
  };

  /* ---------------- the stone tray (ART-69, SH-243) ---------------- */
  /*
   * The tray's stone is the house stone token's own (--njg-stone, the panel and the shelf: Fable, "one family ... the tray a thicker,
   * darker cut of the same honed stone; same hue and finish, only the value differs"): each colour is the token's channels times a
   * cut, so Fable's values come out of it (field #C4B8AD, its edges #B5A99E, the lit lip #DAD0C7) and the tray follows the stone.
   */
  Shelf.TRAY = {
    cuts: {
      field: [0.879, 0.864, 0.844], // the field's middle
      edge: [0.812, 0.794, 0.772], // the field towards its edges
      lit: [0.978, 0.977, 0.971], // the lip's lit upper-left face
      rim: [1.05, 1.066, 1.073], // the lip's thin lighter outer edge
      speck: [0.637, 0.61, 0.58], // the speckle, a few percent darker in sum (it is fine and faint)
      ao: [0.498, 0.46, 0.429], // the crease inside the lip
    },
    inset: 0.03, // of the view's width, at each side
    gapTop: 4, // design px between the band's top and the slab
    gapBottom: 6, // design px between the slab and the view's foot
    lipK: 0.035, // the lip's width, of the slab's depth (3-4%)
    radiusK: 1 / 8, // the corner radius, of the depth
    shadowK: 0.02, // the shadow's offset (lower-right) and its blur, of the depth
  };
  // the stone token's channels (null with no page: nothing is painted then), each colour a cut of it as "r, g, b"
  Shelf.trayInk = function () {
    const t = T();
    const rgb = t && t.rgb ? t.rgbOf(t.rgb("stone")) : null;
    if (!rgb) return null;
    const out = {};
    Object.entries(Shelf.TRAY.cuts).forEach(([k, c]) => (out[k] = rgb.map((v, i) => Math.max(0, Math.min(255, Math.round(v * c[i])))).join(", ")));
    const sh = t.rgb("shade-rgb");
    out.shadow = sh || out.ao;
    return out;
  };
  Shelf.trayBox = function ({ left, right, top, bottom }) {
    const T = Shelf.TRAY;
    const ins = (right - left) * T.inset;
    const x = left + ins;
    const y = top + T.gapTop;
    const w = Math.max(10, right - left - 2 * ins);
    const h = Math.max(10, bottom - T.gapBottom - y);
    const sh = h * T.shadowK;
    return { x, y, w, h, r: h * T.radiusK, lip: Math.max(3, h * T.lipK), sh, pad: Math.ceil(sh * 3 + 2) };
  };
  // (a small seeded random: the speckle is the same on every draw, so a redraw on resize, or a replay, never differs)
  const rnd = (seed) => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const rrect = (ctx, x, y, w, h, r, ccw = false) => {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    if (!ccw) {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x, y, x, y + h, r);
      ctx.arcTo(x, y + h, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x + w, y, r);
      ctx.arcTo(x + w, y, x, y, r);
    }
    ctx.closePath();
  };
  const path = (ctx, ...a) => {
    ctx.beginPath();
    rrect(ctx, ...a);
  };
  Shelf.trayPaint = function (ctx, box, { scale = 1, seed = 7, ink = Shelf.trayInk() } = {}) {
    const s = scale;
    const pad = box.pad * s;
    const W = Math.ceil(box.w * s + 2 * pad);
    const H = Math.ceil(box.h * s + 2 * pad);
    if (!ctx || !ink) return { w: W, h: H };
    const c = (k, a = 1) => `rgba(${ink[k]}, ${a})`;
    const x = pad, y = pad, w = box.w * s, h = box.h * s, r = box.r * s, lip = box.lip * s, sh = box.sh * s;
    ctx.clearRect(0, 0, W, H);
    // the contact shadow: lower-right, soft, fading over about its own offset again
    ctx.save();
    ctx.shadowColor = c("shadow", 0.3);
    ctx.shadowBlur = Math.max(2, sh * 2);
    ctx.shadowOffsetX = sh * 0.6;
    ctx.shadowOffsetY = sh;
    path(ctx, x, y, w, h, r);
    ctx.fillStyle = c("edge");
    ctx.fill();
    ctx.restore();
    ctx.save();
    path(ctx, x, y, w, h, r);
    ctx.clip();
    // the field: the lighter middle shading to the edges (an ellipse of the slab's own shape)
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(1, h / w);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, w / 2);
    gr.addColorStop(0, c("field"));
    gr.addColorStop(0.62, c("field"));
    gr.addColorStop(1, c("edge"));
    ctx.fillStyle = gr;
    ctx.fillRect(-w / 2 - 2, -w / 2 - 2, w + 4, w + 4);
    ctx.restore();
    // the speckle: very fine and even, a few percent darker (a few lighter), no veins; at phone size it is below a pixel and goes
    const R = rnd(seed);
    const n = Math.round((w * h) / (90 * s * s));
    const d = Math.max(0.6, 0.9 * s);
    for (let i = 0; i < n; i++) {
      const light = R() < 0.25;
      ctx.globalAlpha = light ? 0.1 + R() * 0.08 : 0.07 + R() * 0.1;
      ctx.fillStyle = light ? c("lit") : c("speck");
      const k = d * (0.6 + R() * 0.8);
      ctx.fillRect(x + R() * w, y + R() * h, k, k);
    }
    ctx.globalAlpha = 1;
    // the lip: the same stone, its ring lit on the upper-left (a light wash fading towards the lower-right)
    const xi = x + lip, yi = y + lip, wi = w - 2 * lip, hi = h - 2 * lip, ir = Math.max(0, r - lip);
    const reach = Math.min(w, h * 3);
    const lg = ctx.createLinearGradient(x, y, x + reach, y + h);
    lg.addColorStop(0, c("lit", 0.6));
    lg.addColorStop(0.5, c("lit", 0.25));
    lg.addColorStop(1, c("lit", 0.04));
    ctx.beginPath();
    rrect(ctx, x, y, w, h, r);
    rrect(ctx, xi, yi, wi, hi, ir, true);
    ctx.fillStyle = lg;
    ctx.fill();
    // its thin lighter outer edge on the upper-left (softly radiused, not a sharp step)
    let lw = Math.max(1, lip * 0.28);
    const eg = ctx.createLinearGradient(x, y, x + reach * 0.6, y + h);
    eg.addColorStop(0, c("rim", 0.95));
    eg.addColorStop(1, c("rim", 0));
    ctx.lineWidth = lw;
    ctx.strokeStyle = eg;
    path(ctx, x + lw / 2, y + lw / 2, w - lw, h - lw, r - lw / 2);
    ctx.stroke();
    // the crease inside the lip: a thin ambient-occlusion line, darkest on the lower-right
    lw = Math.max(0.8, lip * 0.18);
    const ag = ctx.createLinearGradient(xi, yi, xi + reach, yi + hi);
    ag.addColorStop(0, c("ao", 0.12));
    ag.addColorStop(1, c("ao", 0.34));
    ctx.lineWidth = lw;
    ctx.strokeStyle = ag;
    path(ctx, xi, yi, wi, hi, ir);
    ctx.stroke();
    ctx.restore();
    return { w: W, h: H };
  };

  /* ---------------- drawn on the page ---------------- */
  const doc = root && root.document;
  const SPEAKER_PATH = "M4 9h4l5-5v16l-5-5H4z";
  Shelf.speakerSvg = () =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${SPEAKER_PATH}" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 5.5a8.5 8.5 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  Shelf.chip = function (text, { word = true, missing = false, onTap = null } = {}) {
    if (!doc) return null;
    const el = doc.createElement("button");
    el.type = "button";
    el.className = "njg-wpill";
    el.style.setProperty("--njg-wpill-min", Shelf.PILL.min + "px");
    el.innerHTML = `<span class="njg-wpill-spk">${Shelf.speakerSvg()}</span><span class="njg-wpill-w"></span>`;
    const w = el.querySelector(".njg-wpill-w");
    w.textContent = text;
    // (missing Kutchi: its English in grey italic, Zafar 3 Nov)
    el.classList.toggle("njg-wpill-missing", !!missing);
    w.classList.toggle("njg-ph", !!missing);
    el.setWord = (b) => {
      el.classList.toggle("njg-wpill-spk-only", !b);
      el.setAttribute("aria-label", text);
    };
    el.setWord(word);
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      el.classList.remove("njg-wpill-tap");
      void el.offsetWidth;
      el.classList.add("njg-wpill-tap");
      if (onTap) onTap(ev);
    });
    return el;
  };
  /*
   * A whole shelf on the page, in host's box (host is positioned; the shelf fills it, the band's proportions kept): each thing
   * stands on the base line at its class's height, its pill under it. The slots follow Shelf.slots with the host's width as the
   * span; the pills follow the floor (css/shared/tally.css) and Shelf.pillScale. Re-laid on resize.
   */
  Shelf.mount = function (host, { groups = [], pic = () => null, text = (id) => id, missing = () => false, shows = () => true, size = () => "M", onTap = null, pad = 16 } = {}) {
    if (!doc || !host) return null;
    const el = doc.createElement("div");
    el.className = "njg-shelf";
    host.appendChild(el);
    const items = {};
    groups.flat().forEach((id) => {
      const it = doc.createElement("div");
      it.className = "njg-shelf-item";
      it.dataset.id = id;
      const src = pic(id);
      let img = null;
      if (src) {
        img = doc.createElement("img");
        img.alt = "";
        img.draggable = false;
        img.src = src;
        img.addEventListener("load", () => shelf.layout());
        it.appendChild(img);
      } else {
        img = doc.createElement("div");
        img.className = "njg-shelf-box";
        it.appendChild(img);
      }
      const chip = Shelf.chip(text(id), { word: shows(id), missing: missing(id), onTap: onTap ? () => onTap(id) : null });
      el.appendChild(it);
      el.appendChild(chip);
      items[id] = { id, el: it, img, chip, cls: size(id) };
    });
    const shelf = { el, items, groups };
    shelf.setWord = (id, b) => {
      if (items[id]) items[id].chip.setWord(b);
      shelf.layout();
    };
    shelf.layout = function () {
      const W = host.clientWidth, H = host.clientHeight;
      if (!(W > 0 && H > 0)) return null;
      const B = Shelf.band(H);
      el.style.setProperty("--njg-shelf-u", B.u + "px");
      const ids = groups.flat();
      ids.forEach((id) => {
        const c = items[id].chip;
        c.style.maxWidth = "";
        c.querySelector(".njg-wpill-w").style.fontSize = "";
      });
      const widths = ids.map((id) => items[id].chip.offsetWidth);
      const gap = Math.max(5, B.u * 12);
      const L = Shelf.slots(groups, { span: [pad, W - pad], view: [pad, W - pad], pitch: B.u * 172, groupGap: B.u * 44, pillRoom: Shelf.pillRoom(widths, 1, gap), minGap: B.u * 20 });
      const fit = Shelf.pillScale(ids.map((id, i) => ({ x: L.x[id], w: widths[i] })), { want: 1, gap, slotW: L.slotW });
      // (a pill at its floor may stand taller than the band's own: it keeps inside the band's bottom, and the line things stand on
      // keeps the band's gap above it, as on the canvas)
      const ch = Math.max(0, ...ids.map((id) => items[id].chip.offsetHeight));
      const chipY = Math.min(B.chipY, H - B.pad / 2 - ch / 2);
      const base = Math.min(B.base, chipY - ch / 2 - (B.chipY - B.chipH / 2 - B.base));
      ids.forEach((id, i) => {
        const o = items[id];
        const x = L.x[id];
        const nat = o.img.naturalWidth ? { ph: o.img.naturalHeight, pw: o.img.naturalWidth } : { ph: 100, pw: 100 };
        const f = Shelf.classFit(nat, o.cls, { base, ppw: 1, slotW: L.slotW - 8 * B.u, itemTop: B.itemTop, glow: B.glow, hop: true });
        o.fit = f;
        Object.assign(o.el.style, { left: x - (nat.pw * f.scale) / 2 + "px", top: base - f.h + "px", width: nat.pw * f.scale + "px", height: f.h + "px" });
        const c = o.chip;
        // (where even the least scale would touch, a long word narrows to its slot: its text a size smaller, never cut)
        let w = widths[i];
        if (w > fit.cap) {
          const word = c.querySelector(".njg-wpill-w");
          const ww = word.offsetWidth || 1;
          word.style.fontSize = Math.max(0.5, (fit.cap - (w - ww)) / ww) + "em";
          w = c.offsetWidth;
        }
        c.style.left = x - w / 2 + "px";
        c.style.top = chipY - c.offsetHeight / 2 + "px";
      });
      shelf.slot = L;
      return L;
    };
    let ro = null;
    if (root.ResizeObserver) {
      ro = new root.ResizeObserver(() => shelf.layout());
      ro.observe(host);
    }
    shelf.destroy = () => {
      if (ro) ro.disconnect();
      el.remove();
    };
    shelf.layout();
    // (the word's face may come in after the first lay-out: the pills are measured again then)
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => el.isConnected && shelf.layout());
    return shelf;
  };

  /* ---------------- drawn on a canvas (Phaser) ---------------- */
  const T = () => root.Tokens || null;
  const ink = (name, fb) => {
    const t = T();
    const v = t && t.int ? t.int(name) : null;
    return v == null ? fb : v;
  };
  const P = (Shelf.P = {});
  P.speaker = function (g, x, y, s, color) {
    const k = s / 24;
    g.fillStyle(color == null ? ink("ink-text", 0) : color, 1);
    g.fillRect(x - 8 * k, y - 3.5 * k, 5 * k, 7 * k);
    g.fillTriangle(x - 4 * k, y - 3.5 * k, x + 2 * k, y - 9 * k, x + 2 * k, y + 9 * k);
    g.fillTriangle(x - 4 * k, y + 3.5 * k, x + 2 * k, y - 9 * k, x - 4 * k, y - 3.5 * k);
    g.lineStyle(2.2 * k, color == null ? ink("ink-text", 0) : color, 1);
    g.beginPath();
    g.arc(x + 3 * k, y, 5 * k, -0.9, 0.9);
    g.strokePath();
    g.beginPath();
    g.arc(x + 3 * k, y, 9.5 * k, -0.9, 0.9);
    g.strokePath();
  };
  /*
   * One word pill on a canvas: a white card, the speaker and the word (or the speaker alone), its width its own face's (w: a fixed
   * width instead), never wider than cap (a long word narrows its text). chip.face(word, cap) redraws it; chip.hit(slotW) sets the
   * tap area (SH-244): the card and PILL.margin at its sides and foot, never past the slot; none above the card, where the item's
   * own tap area (Shelf.P.reach) comes down to meet it.
   * o: {word, w, cap, depth, onTap, font, weight, color (the word's, "#rrggbb"), shade, card (the card's colours, ints: the tokens'
   * by default), pad (the room beside the word, PILL.pad)}; the scene's S.track keeps it, when the scene has one
   */
  P.chip = function (S, x, y, text, o = {}) {
    const PL = Shelf.PILL;
    const t0 = T();
    const font = o.font || (t0 && t0.font ? t0.font("word") : "");
    const weight = o.weight || (t0 && t0.weight ? t0.weight("drawn", "800") : "800");
    const color = o.color || (t0 && t0.hex ? t0.hex("ink-kutchi") : "");
    const c0 = S.add.container(x, y);
    const chip = S.track ? S.track(c0) : c0;
    if (o.depth != null) chip.setDepth(o.depth);
    let natW = null;
    const measure = () => {
      if (natW == null) {
        const t = S.add.text(0, 0, text, { fontFamily: font, fontSize: `${PL.text}px`, fontStyle: weight });
        natW = t.width;
        t.destroy();
      }
      return natW;
    };
    chip.faceW = (word) => (o.w ? o.w : Shelf.faceW(word, measure()));
    chip.face = function (word, cap = chip.capW != null ? chip.capW : Infinity) {
      (chip.parts || []).forEach((p) => chip.remove(p, true));
      const w = Math.min(chip.faceW(word), cap);
      const bg = S.add.graphics();
      bg.fillStyle(o.shade != null ? o.shade : ink("shade-rgb", 0), 0.1);
      bg.fillRoundedRect(-w / 2, -PL.h / 2 + 2, w, PL.h, 12);
      bg.fillStyle(o.card != null ? o.card : ink("card", 0), 1);
      bg.fillRoundedRect(-w / 2, -PL.h / 2, w, PL.h, 12);
      const icon = S.add.graphics();
      if (word) {
        const t = S.add.text(0, 0, text, { fontFamily: font, fontSize: `${PL.text}px`, fontStyle: weight, color }).setOrigin(0, 0.5);
        const maxT = w - (o.pad || PL.pad);
        if (t.width > maxT) t.setScale(maxT / t.width);
        const cw = 22 + 8 + t.displayWidth;
        P.speaker(icon, -cw / 2 + 10, 0, 24);
        t.x = -cw / 2 + 30;
        chip.parts = [bg, icon, t];
      } else {
        P.speaker(icon, 1, 0, 26);
        chip.parts = [bg, icon];
      }
      chip.add(chip.parts);
      chip.cardW = w;
      chip.cardH = PL.h;
      chip.capW = cap;
      chip.showsWord = !!word;
      chip.hit(chip.slotW);
      return chip;
    };
    chip.hit = function (slotW = Infinity) {
      chip.slotW = slotW;
      const k = chip.k || 1;
      // SH-244: the card and a small margin at its sides and foot (never past its slot); its top edge is the card's, the item's above
      const m = PL.margin;
      const hitW = Math.max(chip.cardW, Math.min(chip.cardW + 2 * m, (slotW - 2) / k));
      const hitH = PL.h + m;
      // (a container's hit area is read from its top-left corner: Phaser adds its display origin, half its size, to the point first;
      // the old area, drawn about the middle, was the box up and left of the pill: its left half, and 72 px above it into the item)
      chip.setSize(hitW, PL.h);
      const G = root.Phaser && root.Phaser.Geom;
      if (chip.input) chip.input.hitArea.setTo(0, 0, hitW, hitH);
      else if (G) chip.setInteractive(new G.Rectangle(0, 0, hitW, hitH), G.Rectangle.Contains);
      return chip;
    };
    chip.on("pointerdown", (ptr, lx, ly, ev) => {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      if (o.onTap) o.onTap();
      S.tweens.add({ targets: chip, scale: (chip.k || 1) * 1.08, duration: 90, yoyo: true });
    });
    chip.face(o.word !== false, o.cap == null ? Infinity : o.cap);
    return chip;
  };

  /*
   * SH-244: an item's tap area reaching its pill. The item (any interactive Phaser object) keeps its own area and, while it has a
   * pill under it (obj.chip, read at each tap, so a game may give it the pill after this), also takes taps in its slot below its
   * picture: from its picture's top down to the pill card's top, across the slot's width (the pill's slotW, else the wider of the
   * picture and the pill's tap area). Installed once per object; returns obj.
   */
  P.reachBox = function (obj) {
    const ch = obj && obj.chip;
    if (!ch || !ch.active || ch.visible === false || ch.parentContainer || obj.parentContainer || !obj.getBounds) return null;
    const cw = ch.cardW || ch.pillW;
    if (!cw) return null;
    const kx = Math.abs(ch.scaleX || 1);
    const ky = Math.abs(ch.scaleY || 1);
    const top = ch.y - ((ch.cardH || ch.pillH || Shelf.PILL.h) / 2) * ky;
    const b = obj.getBounds();
    // (only a pill below the thing: its card's top under the picture's middle)
    if (!(top > b.y + b.height / 2)) return null;
    const slot = isFinite(ch.slotW) && ch.slotW > 0 ? ch.slotW - 2 : Math.max(b.width, (cw + 2 * Shelf.PILL.margin) * kx);
    return { left: ch.x - slot / 2, right: ch.x + slot / 2, top: b.y, bottom: top };
  };
  P.reach = function (obj) {
    if (!obj || !obj.input || obj.input.njgReach) return obj;
    const own = obj.input.hitAreaCallback;
    if (typeof own !== "function") return obj;
    obj.input.njgReach = true;
    obj.input.hitAreaCallback = function (area, x, y, o) {
      if (own(area, x, y, o)) return true;
      const r = P.reachBox(o);
      if (!r) return false;
      // (the hit test's local point, back to the world: the inverse of what Phaser did, its display origin added back first)
      let wx = x;
      let wy = y;
      try {
        const M = o.getWorldTransformMatrix();
        const p = M.transformPoint(x - (o.displayOriginX || 0), y - (o.displayOriginY || 0));
        wx = p.x;
        wy = p.y;
      } catch (e) {
        return false;
      }
      return wx >= r.left && wx <= r.right && wy >= r.top && wy <= r.bottom;
    };
    return obj;
  };

  /*
   * ART-69, SH-243: the stone tray on a Phaser scene, under the band's things. top: the band's top (design px); bottom: the slab's
   * foot line (default: the view's foot); view: the visible world, {left, right, bottom} or a function returning it (read again
   * when the scene's scale changes shape, and the slab redrawn); depth. Painted once into a canvas texture at the screen's own
   * resolution (never zoomed), the image placed at the slab's box; the scene's S.track keeps it, when it has one. Returns the image,
   * with img.trayBox (the slab's box, design px).
   */
  P.tray = function (S, { top, bottom = null, view = null, depth = 0, seed = 7 } = {}) {
    if (!Shelf.trayInk()) return null;
    const viewOf = () => (typeof view === "function" ? view() : view) || { left: 0, right: 1600, bottom: 900 };
    let img = null;
    let key = null;
    const draw = () => {
      // (never after the game is gone: a resize during the unmount found the texture manager without its game, a page error)
      if (!S.sys || !S.sys.game || !S.textures || S.textures.game === null || !doc) return;
      const v = viewOf();
      const box = Shelf.trayBox({ left: v.left, right: v.right, top, bottom: bottom != null ? bottom : v.bottom });
      const cv = S.game && S.game.canvas;
      const rect = cv && cv.getBoundingClientRect ? cv.getBoundingClientRect() : null;
      const gw = (S.scale && S.scale.gameSize && S.scale.gameSize.width) || 1600;
      let sc = rect && rect.width ? (rect.width / gw) * (root.devicePixelRatio || 1) : 1;
      sc = Math.max(0.5, Math.min(2, Math.ceil(sc * 4) / 4));
      let size = Shelf.trayPaint(null, box, { scale: sc });
      if (size.w > 4096) {
        sc *= 4096 / size.w;
        size = Shelf.trayPaint(null, box, { scale: sc });
      }
      const k = `njg-tray@${Math.round(box.w)}x${Math.round(box.h)}@${Math.round(sc * 100)}`;
      if (!S.textures.exists(k)) {
        const c = doc.createElement("canvas");
        c.width = size.w;
        c.height = size.h;
        Shelf.trayPaint(c.getContext("2d"), box, { scale: sc, seed });
        S.textures.addCanvas(k, c);
      }
      if (!img) {
        const i0 = S.add.image(0, 0, k);
        img = S.track ? S.track(i0) : i0;
      } else if (key !== k) {
        const old = key;
        img.setTexture(k);
        if (old && S.textures.exists(old)) S.textures.remove(old);
      }
      key = k;
      img.setOrigin(0).setPosition(box.x - box.pad, box.y - box.pad).setScale(1 / sc).setDepth(depth);
      img.trayBox = box;
    };
    draw();
    if (!img) return null;
    const onResize = () => img && img.active && draw();
    if (S.scale && S.scale.on) {
      S.scale.on("resize", onResize);
      img.once("destroy", () => S.scale && S.scale.off && S.scale.off("resize", onResize));
    }
    return img;
  };

  return Shelf;
});
