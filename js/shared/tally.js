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
  return T;
});
