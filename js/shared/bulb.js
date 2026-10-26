/*
 * The light bulb (rule E25, decision 1; docs/architecture/target-model.md 4.2): the one help. A tap flips the
 * words to English for 5 / 3 / 2 / 1 s by level, then back; each use costs a lightbulb on the hints badge.
 * One component for every mode, replacing Cook's UI.bulb and the clinic's Kit.Bulb (their behaviour kept):
 *   - one at a time: a tap while it's on does nothing;
 *   - while on: the button has classes "on" (Cook's look) and "lit" (the clinic's), --bulb-ms runs its bar down,
 *     every target gets class "english", <body> gets bodyClass (the clinic's "cl-english");
 *   - every use counts (onUse(uses)), then onOn(ms); after ms (divided by speed) it turns off and calls onOff().
 *
 *   const b = Bulb.create(btn, {level, ms, speed, fast, targets, bodyClass, onUse, onOn, onOff})
 *       ms: a table by level (default Bulb.MS: data/shared.json bulbMs, 8 s at every level: SH-86), a number, or a function
 *       speed: accepted but ignored since S05 (SH-41: a test speed never shortens reading time); fast: true -> 300 ms
 *       (the clinic's ?fast=1)
 *       targets: () -> elements that show English while it's on
 *   b.use([btn]) -> true if it turned on      b.off()      b.on      b.uses      b.level      b.destroy()
 *   Bulb.MS                                     the level table (E25)
 *   Bulb.KitBulb(Kit)                           a drop-in for the clinic's Kit.Bulb(btn, opts) (thin shim, until R5)
 *
 * Plain <script>: window.Bulb (and Shared.bulb).
 */
(function (root, factory) {
  const B = factory(root);
  if (typeof module === "object" && module.exports) module.exports = B;
  else {
    root.Bulb = B;
    (root.Shared = root.Shared || {}).bulb = B;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const B = {};
  // SH-86 (Zafar, D11 / SH-41): every bulb shows its English for 8 s at every level: the ONE ladder table's bulbMs
  // (data/shared.json, through js/shared/tokens.js; S13-A1), no copy here ([] until it has loaded)
  Object.defineProperty(B, "MS", {
    enumerable: true,
    get: () => {
      const T = root.Tokens || (typeof module === "object" && module.exports && typeof require === "function" ? require("./tokens.js") : null);
      return (T && T.ladder && T.ladder.bulbMs) || [];
    },
  });
  const val = (v) => (typeof v === "function" ? v() : v);

  B.msFor = function (ms, level) {
    const m = val(ms);
    if (typeof m === "number") return m;
    const t = Array.isArray(m) ? m : B.MS;
    return t[Math.min(t.length, Math.max(1, level || 1)) - 1];
  };

  B.create = function (btn, o = {}) {
    const b = { btn: btn || null, level: o.level || 1, uses: 0, on: false, timer: null };
    const each = (fn) => {
      const t = o.targets ? Array.from(o.targets()) : [];
      t.forEach(fn);
    };
    // SH-41 (S05-S): the bulb's time is reading time, so a test speed never shortens it (a child, or a probe, gets the
    // whole of it: 8 s on a closed card); only a host's explicit fast mode (the clinic's ?fast=1) does
    b.duration = () => (o.fast ? 300 : B.msFor(o.ms, b.level));
    b.use = function (el) {
      if (el) b.btn = el;
      if (b.on) return false;
      b.on = true;
      b.uses++;
      const ms = b.duration();
      if (b.btn) {
        b.btn.style.setProperty("--bulb-ms", `${ms}ms`);
        b.btn.classList.remove("on", "lit");
        void b.btn.offsetWidth;
        b.btn.classList.add("on", "lit");
      }
      each((c) => c.classList.add("english"));
      if (o.bodyClass && root.document) root.document.body.classList.add(o.bodyClass);
      if (o.onUse) o.onUse(b.uses);
      if (o.onOn) o.onOn(ms);
      clearTimeout(b.timer);
      b.timer = setTimeout(() => b.off(), ms);
      return true;
    };
    b.off = function () {
      clearTimeout(b.timer);
      b.timer = null;
      const was = b.on;
      b.on = false;
      if (b.btn) b.btn.classList.remove("on", "lit");
      each((c) => c.classList.remove("english"));
      if (o.bodyClass && root.document) root.document.body.classList.remove(o.bodyClass);
      if (was && o.onOff) o.onOff();
    };
    b.destroy = function () {
      clearTimeout(b.timer);
      if (b.btn && b._h) b.btn.removeEventListener("click", b._h);
    };
    if (btn && o.click !== false) {
      b._h = () => b.use();
      btn.addEventListener("click", b._h);
    }
    return b;
  };

  /** The clinic's Kit.Bulb(btn, opts), on the shared bulb: same options, same fields (uses, on, level), same look. */
  B.KitBulb = function (Kit) {
    function KitBulb(btn, opts = {}) {
      this.btn = btn;
      this.onUse = opts.onUse || null;
      const self = this;
      const keep = !!opts.keepArt; // the shared guide box draws the bulb and calls use()
      if (!keep && btn) {
        btn.classList.add("cl-bulb");
        btn.type = "button";
        btn.setAttribute("aria-label", "Light bulb: show it in English for a moment");
        btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" fill="currentColor"/><rect x="9" y="19" width="6" height="2.4" rx="1" fill="currentColor"/></svg>';
      }
      this._b = B.create(btn, {
        click: !keep,
        level: opts.level || 1,
        ms: () => B.MS,
        fast: !!Kit.fast,
        targets: opts.targets || (() => root.document.querySelectorAll(".cl-card")),
        bodyClass: "cl-english",
        onUse: (n) => self.onUse && self.onUse(n),
        // R5 (D11): the clinic opens a closed card for the bulb's whole time
        onOn: (ms) => opts.onOn && opts.onOn(ms),
        onOff: () => opts.onOff && opts.onOff(),
      });
    }
    Object.defineProperties(KitBulb.prototype, {
      level: { get() { return this._b.level; }, set(v) { this._b.level = v; } },
      uses: { get() { return this._b.uses; } },
      on: { get() { return this._b.on; } },
    });
    KitBulb.prototype.use = function () {
      return this._b.use();
    };
    KitBulb.prototype.destroy = function () {
      this._b.destroy();
    };
    return KitBulb;
  };
  return B;
});
