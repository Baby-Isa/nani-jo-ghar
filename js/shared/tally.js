/*
 * The tally (rules F25, E11; docs/architecture/target-model.md 4.2): a flat row of chips, a picture and how many
 * you've done so far, in the play area's top-right corner. It shows what you did, never the target, and never
 * takes a tap. One component for every mode (Cook's #count-badge and the clinic's Kit.Tally draw the same thing
 * today; R4 and R5 move them onto this).
 *
 *   const t = Tally.mount(el)         el: an empty element in the play area (positioned by css/shared/tally.css)
 *   t.set(id, n, {icon})              one thing's count (icon: an <img> URL, or a function(chipEl) that draws it)
 *   t.clear()                         t.counts
 *   Tally.KitTally(Kit)               a drop-in for the clinic's Kit.Tally(el) (thin shim, until R5)
 *
 * The count pills (Sprint 18, module map piece 11: moved here from js/cook/ui.js's UI.count and UI.tallyAt, which call it):
 *   Tally.label(n, {level, word})     what a count pill reads (SH-39): the number's word at L1-L2 (word(n): the game's own,
 *                                     agreeing with its thing), dots from L3 (never a digit to match); nothing yet: the picture alone
 *   Tally.keep(r, box, gap)           {dx, dy}: how far a box r must move to sit wholly inside box (gap px in), never cut
 *   Tally.place(el, host, x, y, {anchor})   the tally centred on a point of host (x, y: px in host's box), kept inside host;
 *                                     anchor "right": grows to the left of the point (the at-r class); null x: its usual corner
 *   Tally.row(sizes, {at, span, view, bottom, top, gap, avoid}) -> [{x, y}]   SH-294's placing (pure): each pill's top-left
 *   Tally.room                        null, or a page kit's (pt, host, {anchor}) -> {at, span, top, bottom, avoid} | null: the stove
 *                                     under a point (js/cook/kitchen-kit.js sets it from Cook.Kit.hob): Tally.place lays the pills
 *                                     over it by Tally.row
 *   Tally.PIC, Tally.picFor(id, given)  ART-81: the tally's own close-up for a thing (one place to swap the pictures), else given
 *   Tally.counter(el, {level, icon(id), word(n, id), onCount(n, id)}) -> c   the pills' state on the shared tally:
 *                                     c.set(id, n, {icon}), c.up(id) -> n, c.down(id), c.of(id), c.clear(), c.at(x, y, {anchor}),
 *                                     c.level(lv); onCount: the moment to say the count (the game's voice, never this file)
 *
 * Plain <script>: window.Tally (and Shared.tally). Styles: css/shared/tally.css.
 */
(function (root, factory) {
  const T = factory(root);
  if (typeof module === "object" && module.exports) module.exports = T;
  else {
    root.Tally = T;
    (root.Shared = root.Shared || {}).tally = T;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const T = {};
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  T.FADE = 250;
  T.mount = function (el, { extraClass = "" } = {}) {
    el.classList.add("njg-tally", "empty");
    if (extraClass) el.classList.add(...extraClass.split(" ").filter(Boolean));
    el.setAttribute("aria-live", "polite");
    const t = { el, counts: {} };
    // (SH-294, Zafar 14 Nov: the pills "disappear" when the pan is emptied, fading as the pour starts: t.clear fades the pills out,
    // T.FADE ms, their data-tally gone so nothing reads them as counts; a count set meanwhile, another pan's, drops them at once)
    let fading = null;
    const dropFaded = () => {
      if (fading) clearTimeout(fading);
      fading = null;
      Array.from(el.children).filter((c) => c.classList.contains("njg-tally-out")).forEach((c) => c.remove());
    };
    t.set = function (id, n, { icon } = {}) {
      dropFaded();
      t.counts[id] = n;
      let chip = Array.from(el.children).find((c) => c.dataset.tally === String(id));
      if (!chip) {
        chip = root.document.createElement("div");
        chip.className = "njg-tally-chip";
        chip.dataset.tally = String(id);
        const pic = root.document.createElement("span");
        pic.className = "njg-tally-pic";
        // (ART-81: the tally's own close-up where one has landed, T.PIC; else the picture the game gives)
        const src = T.picFor(id, icon);
        if (typeof src === "function") src(pic);
        else if (src) pic.innerHTML = `<img alt="" src="${esc(src)}">`;
        chip.appendChild(pic);
        const num = root.document.createElement("span");
        num.className = "njg-tally-n";
        chip.appendChild(num);
        el.appendChild(chip);
      }
      chip.querySelector(".njg-tally-n").textContent = String(n);
      chip.classList.remove("bump");
      void chip.offsetWidth;
      chip.classList.add("bump");
      el.classList.toggle("empty", !Object.keys(t.counts).length);
    };
    t.clear = function () {
      t.counts = {};
      const live = Array.from(el.children).filter((c) => c.dataset.tally != null);
      const less = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
      if (!live.length || less || !(T.FADE > 0)) {
        dropFaded();
        el.innerHTML = "";
        el.classList.add("empty");
        return;
      }
      live.forEach((c) => {
        delete c.dataset.tally;
        c.classList.remove("bump");
        c.classList.add("njg-tally-out");
      });
      if (fading) clearTimeout(fading);
      fading = setTimeout(() => {
        fading = null;
        Array.from(el.children).filter((c) => c.classList.contains("njg-tally-out")).forEach((c) => c.remove());
        if (!Object.keys(t.counts).length) el.classList.add("empty");
      }, T.FADE);
    };
    return t;
  };

  /** The clinic's Kit.Tally(el) on the shared tally: same set(itemId, n) / clear(), its own item icons, its own classes kept. */
  T.KitTally = function (Kit) {
    function KitTally(el) {
      el.classList.add("cl-tally");
      this.el = el;
      this._t = T.mount(el);
    }
    Object.defineProperty(KitTally.prototype, "counts", { get() { return this._t.counts; } });
    KitTally.prototype.set = function (itemId, n) {
      this._t.set(itemId, n, { icon: (pic) => Kit.icon(itemId, pic, "tiny") });
      const chip = Array.from(this.el.children).find((c) => c.dataset.tally === String(itemId));
      if (chip) {
        chip.classList.add("cl-tally-chip");
        const num = chip.querySelector(".njg-tally-n");
        if (num) num.classList.add("cl-tally-n");
      }
    };
    KitTally.prototype.clear = function () {
      this._t.clear();
    };
    return KitTally;
  };
  /* ---------------- the count pills (piece 11) ---------------- */
  T.label = function (n, { level = 1, word = null } = {}) {
    if (level >= 3) return "\u25cf".repeat(Math.max(0, Math.min(n, 12)));
    const w = n >= 1 && n <= 10 && word ? word(n) : null;
    // (DAAR-12: nothing counted yet is the picture alone, never a "0")
    return w || (n >= 1 ? String(n) : "");
  };
  T.keep = function (r, box, gap = 8) {
    const dx = r.left < box.left + gap ? box.left + gap - r.left : r.right > box.right - gap ? Math.max(box.left + gap - r.left, box.right - gap - r.right) : 0;
    const dy = r.top < box.top + gap ? box.top + gap - r.top : r.bottom > box.bottom - gap ? Math.max(box.top + gap - r.top, box.bottom - gap - r.bottom) : 0;
    return { dx, dy };
  };
  /*
   * SH-294 (Zafar, 14 Nov: "above the teapot, in fact above the whole stove, you have those counting pills starting from ... the closest
   * to the teapot you're currently working on, and then moving sensibly either side to fill the space, limited to the space directly
   * above the entire stove ... When it's a single stove, then you might need to extend past the stove area ... having two rows above
   * the pans would be helpful, but if there isn't, you can go left and right"): the pills of the thing in use (the game shows only
   * its pills) laid in rows upward from `bottom`: the first centred on `at` (the pan's middle), the next ones alternately right and
   * left of the row, as close to it as they fit, inside `span` (the stove's width); a pill that fits no side starts a row above while
   * one fits under `top` (two rows at most), else the row runs on past the stove, inside `view`, the side nearer the pan first. Never over an `avoid`
   * box (the cog). All px in one box (the host's).
   *   sizes [{w, h}] in order -> [{x, y}] each pill's top-left
   */
  T.ROW = { gap: 6, rowGap: 6, rows: 2 };
  T.row = function (sizes, { at, span, view, bottom, top = -Infinity, gap = T.ROW.gap, rowGap = T.ROW.rowGap, rows = T.ROW.rows, avoid = [] } = {}) {
    const out = [];
    if (!sizes || !sizes.length) return out;
    const V = view || span;
    const S = span || V;
    const H = Math.max(...sizes.map((s) => s.h));
    const hits = (x, y, w, h) => (avoid || []).some((b) => b && x < b.right && x + w > b.left && y < b.bottom && y + h > b.top);
    let row = null;
    let nRows = 0;
    const open = (yB) => (nRows++, (row = { yB, l: null, r: null, n: 0 }));
    open(bottom);
    const inside = (x, w, lim) => x >= lim[0] - 0.5 && x + w <= lim[1] + 0.5;
    const first = (s) => {
      const x = Math.max(V[0], Math.min(V[1] - s.w, at - s.w / 2));
      row.l = x;
      row.r = x + s.w;
      row.n = 1;
      return { x, y: row.yB - s.h };
    };
    sizes.forEach((s, i) => {
      if (!row.n) return out.push(first(s));
      const y = row.yB - s.h;
      const R = { x: row.r + gap, side: "r" };
      const L = { x: row.l - gap - s.w, side: "l" };
      // alternately right and left (the first after the middle one goes right), the other side when that one does not fit
      const order = row.n % 2 ? [R, L] : [L, R];
      const fit = (lim) => order.find((c) => inside(c.x, s.w, lim) && !hits(c.x, y, s.w, s.h));
      let c = fit(S);
      if (!c && nRows < rows && top <= row.yB - H - rowGap - s.h) {
        open(row.yB - H - rowGap);
        return out.push(first(s));
      }
      // past the stove: the side nearer the pan first
      if (!c) c = [R, L].filter((k) => inside(k.x, s.w, V) && !hits(k.x, y, s.w, s.h)).sort((a, b) => Math.abs(a.x + s.w / 2 - at) - Math.abs(b.x + s.w / 2 - at))[0];
      if (!c) c = R; // (no room anywhere: on the right, as before; the box rules will say)
      if (c.side === "r") row.r = c.x + s.w;
      else row.l = c.x;
      row.n++;
      out.push({ x: c.x, y });
    });
    return out;
  };
  T.room = null;
  // the pills laid over the stove (T.row): the tally's box is their union, each pill placed inside it
  T.layOut = function (el, host, pt, r) {
    const chips = Array.from(el.children).filter((c) => c.classList && c.classList.contains("njg-tally-chip") && c.dataset.tally != null);
    if (!chips.length) return false;
    el.classList.add("at", "laid");
    el.classList.remove("at-r");
    const sizes = chips.map((c) => ({ w: c.offsetWidth, h: c.offsetHeight }));
    const H = Math.max(...sizes.map((s) => s.h));
    const top = r.top != null ? r.top : 0;
    // above the stove where a row fits there, else on the line the game gave (over the pan's rim), never above the top
    let bottom = r.bottom != null && r.bottom - H >= top ? r.bottom : pt.y;
    bottom = Math.max(bottom, top + H);
    const at = T.row(sizes, { at: r.at != null ? r.at : pt.x, span: r.span, view: r.view, bottom, top, avoid: r.avoid });
    const x0 = Math.min(...at.map((p) => p.x));
    const y0 = Math.min(...at.map((p) => p.y));
    const x1 = Math.max(...at.map((p, i) => p.x + sizes[i].w));
    const y1 = Math.max(...at.map((p, i) => p.y + sizes[i].h));
    Object.assign(el.style, { left: `${x0}px`, top: `${y0}px`, width: `${x1 - x0}px`, height: `${y1 - y0}px`, transform: "none" });
    chips.forEach((c, i) => Object.assign(c.style, { left: `${at[i].x - x0}px`, top: `${at[i].y - y0}px` }));
    return true;
  };
  const unlay = (el) => {
    if (!el.classList.contains("laid")) return;
    el.classList.remove("laid");
    el.style.width = el.style.height = el.style.transform = "";
    Array.from(el.children).forEach((c) => (c.style.left = c.style.top = ""));
  };
  T.place = function (el, host, x, y, { anchor = null, gap = 8 } = {}) {
    if (!el) return;
    if (x == null) {
      unlay(el);
      el.classList.remove("at", "at-r");
      el.style.left = el.style.top = "";
      return;
    }
    // SH-294: over the stove the point lies on (the page kit's T.room), the pills laid by T.row
    if (typeof T.room === "function" && host && host.getBoundingClientRect) {
      let r = null;
      try {
        r = T.room({ x, y }, host, { anchor, gap });
      } catch (e) {
        r = null;
      }
      if (r && T.layOut(el, host, { x, y }, r)) return;
    }
    unlay(el);
    el.classList.add("at");
    el.classList.toggle("at-r", anchor === "right");
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (!host || !el.getBoundingClientRect) return;
    const { dx, dy } = T.keep(el.getBoundingClientRect(), host.getBoundingClientRect(), gap);
    if (dx) el.style.left = `${x + dx}px`;
    if (dy) el.style.top = `${y + dy}px`;
  };
  /* ---------------- the pictures (ART-81) ---------------- */
  // (Zafar, 14 Nov: "an easy to see piece of ginger, garlic etc." in its round circle: the art run's close-ups, by the thing's id, go
  // here when they land; until then each thing shows the picture its game gives)
  T.PIC = {};
  T.picFor = (id, given) => (id != null && T.PIC[id]) || given;
  T.counter = function (el, { level = 1, icon = () => null, word = null, onCount = null } = {}) {
    const t = T.mount(el);
    const state = new Map(); // id -> {n, icon}
    let lv = level;
    let pt = null;
    const draw = () => {
      if (!state.size) return t.clear();
      state.forEach((s, id) => {
        const lab = T.label(s.n, { level: lv, word: word ? (n) => word(n, id) : null });
        if (t.counts[id] !== lab) t.set(id, lab, { icon: s.icon });
      });
    };
    const c = { el, tally: t };
    c.set = function (id, n, { icon: ic = null, say = true } = {}) {
      const prev = state.get(id);
      state.set(id, { n, icon: ic || (prev && prev.icon) || icon(id) });
      draw();
      if (pt) c.at(pt[0], pt[1], pt[2]);
      if (say && onCount) onCount(n, id);
      return n;
    };
    c.of = (id) => (state.get(id) || {}).n || 0;
    c.up = (id, o) => c.set(id, c.of(id) + 1, o);
    c.down = function (id) {
      const n = Math.max(0, c.of(id) - 1);
      if (n > 0) return c.set(id, n, { say: false });
      state.delete(id);
      t.clear();
      draw();
      return 0;
    };
    c.clear = () => {
      state.clear();
      t.clear();
    };
    c.level = (l) => {
      lv = l;
      t.clear();
      draw();
    };
    c.at = (x, y, o = {}) => {
      pt = x == null ? null : [x, y, o];
      T.place(el, el.offsetParent || el.parentElement, x, y, o);
    };
    return c;
  };
  return T;
});
