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
    const cap = k < 1 ? slotW - gap : Infinity;
    return { k: Math.max(1, k), cap };
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
      chip.setSize(hitW, hitH);
      const G = root.Phaser && root.Phaser.Geom;
      if (chip.input) chip.input.hitArea.setTo(-hitW / 2, -PL.h / 2, hitW, hitH);
      else if (G) chip.setInteractive(new G.Rectangle(-hitW / 2, -PL.h / 2, hitW, hitH), G.Rectangle.Contains);
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

  return Shelf;
});
