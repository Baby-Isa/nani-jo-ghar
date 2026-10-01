/*
 * The focus pulse and dimming (rule F17, the focal rule; docs/architecture/target-model.md 4.2): the next thing to
 * act on pulses gently (a centred glow and bounce, never an off-centre ring); inactive things dim about 10%.
 * One look for every mode (css/shared/focus.css); a mode says WHAT is next, never how it pulses.
 *
 *   Focus.pulse(el)          el pulses (only one thing at a time: the last one pulsing stops)
 *   Focus.stop([el])         stop el (or whatever pulses now)
 *   Focus.dim(els, on)       dim (or undim) these elements
 *   Focus.only(el, among)    el pulses, the rest of `among` dim; returns a function that clears both
 *   Focus.current            the element pulsing now
 *
 * Plain <script>: window.Focus (and Shared.focus).
 */
(function (root, factory) {
  const F = factory(root);
  if (typeof module === "object" && module.exports) module.exports = F;
  else {
    root.Focus = F;
    (root.Shared = root.Shared || {}).focus = F;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const F = { current: null };
  F.pulse = function (el) {
    if (F.current && F.current !== el) F.current.classList.remove("njg-pulse");
    F.current = el || null;
    if (el) el.classList.add("njg-pulse");
    return el;
  };
  F.stop = function (el) {
    const t = el || F.current;
    if (t) t.classList.remove("njg-pulse");
    if (!el || el === F.current) F.current = null;
  };
  F.dim = function (els, on = true) {
    Array.from(els || []).forEach((e) => e && e.classList.toggle("njg-dim", !!on));
  };
  F.only = function (el, among) {
    const rest = Array.from(among || []).filter((e) => e !== el);
    F.dim(rest, true);
    F.pulse(el);
    return () => {
      F.dim(rest, false);
      F.stop(el);
    };
  };
  return F;
});
