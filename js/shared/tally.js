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

  T.mount = function (el, { extraClass = "" } = {}) {
    el.classList.add("njg-tally", "empty");
    if (extraClass) el.classList.add(...extraClass.split(" ").filter(Boolean));
    el.setAttribute("aria-live", "polite");
    const t = { el, counts: {} };
    t.set = function (id, n, { icon } = {}) {
      t.counts[id] = n;
      let chip = Array.from(el.children).find((c) => c.dataset.tally === String(id));
      if (!chip) {
        chip = root.document.createElement("div");
        chip.className = "njg-tally-chip";
        chip.dataset.tally = String(id);
        const pic = root.document.createElement("span");
        pic.className = "njg-tally-pic";
        if (typeof icon === "function") icon(pic);
        else if (icon) pic.innerHTML = `<img alt="" src="${esc(icon)}">`;
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
      el.innerHTML = "";
      el.classList.add("empty");
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
  T.place = function (el, host, x, y, { anchor = null, gap = 8 } = {}) {
    if (!el) return;
    if (x == null) {
      el.classList.remove("at", "at-r");
      el.style.left = el.style.top = "";
      return;
    }
    el.classList.add("at");
    el.classList.toggle("at-r", anchor === "right");
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (!host || !el.getBoundingClientRect) return;
    const { dx, dy } = T.keep(el.getBoundingClientRect(), host.getBoundingClientRect(), gap);
    if (dx) el.style.left = `${x + dx}px`;
    if (dy) el.style.top = `${y + dy}px`;
  };
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
