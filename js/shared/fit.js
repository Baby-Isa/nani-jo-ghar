/*
 * Text fitting (rule F7, non-negotiable 9; docs/architecture/target-model.md 4.1): text is never clipped,
 * cut or ellipsised. A line SHRINKS to fit, never below the 14 px floor (TXT-05), and THEN WRAPS.
 *
 *   class "fit"            one line, shrunk to fit; at the floor it wraps onto more lines (never "...")
 *   class "fit fit2"       up to two lines (Nani's line, a guide box), shrunk to fit in two; at the floor more lines
 *   class "fit fit-wrap"   the same as "fit" (kept for older call sites)
 *   class "fit fit-head"   SH-107 (Zafar, 18 Oct): the order pop-up's headline ONLY (order-card.js sets it on a big card's headline): it wraps at
 *                          full size first, up to two lines, and shrinks only when two lines don't fit; and every such headline on the
 *                          pop-up takes one size (the smallest any of them needs). Everywhere else keeps shrink, then wrap (non-negotiable 9)
 *   --fit-min (CSS)        the smallest size it may shrink to; never below FitText.FLOOR (14 px), whatever it says
 *
 *   FitText.fit(el)        one element (its CSS font-size is the largest it may be); returns the size used
 *   FitText.run(root)      every .fit under root; elements inside a [data-fit-group] share the group's smallest size
 *   FitText.watch(root)    run again whenever root changes size or content (returns stop)
 *   FitText.FLOOR          14
 *
 * The element's own CSS should be `white-space: nowrap` (fit) or `normal` (fit2), `overflow: visible`,
 * `min-width: 0`, and a row around it should take `min-height`, not a fixed `height`, so a wrapped line
 * makes the row taller instead of being cut.
 *
 * Plain <script>: window.FitText.
 */
(function (root) {
  "use strict";
  const F = { FLOOR: 14 };
  const px = (v) => parseFloat(v) || 0;

  F.fit = function (el) {
    const two = el.classList.contains("fit2") || el.classList.contains("fit-head");
    el.style.whiteSpace = "";
    el.style.overflowWrap = "";
    const size = F.fit1(el, two);
    if (!size || !el._fitOver) return size;
    // at the floor and still too long for one line: wrap, at the largest size that fits two lines (the line
    // stays as big as it can), and at the floor more lines (inline styles, so the watcher's class observer doesn't loop)
    el.style.whiteSpace = "normal";
    if (!two) F.fit1(el, true);
    el._fitOver = F.wide(el, true);
    // a single word wider than the box even at the floor: let it break rather than be cut
    if (el._fitOver) el.style.overflowWrap = "break-word";
    return size;
  };

  // sub-pixel: scrollWidth and clientWidth are whole pixels, so text a fraction too wide is measured by a range too
  F.wide = function (el, wrapped) {
    if (el.scrollWidth > el.clientWidth + 0.5) return true;
    if (wrapped || typeof document === "undefined" || !document.createRange) return false;
    const cs = getComputedStyle(el);
    const room = el.getBoundingClientRect().width - px(cs.paddingLeft) - px(cs.paddingRight) - px(cs.borderLeftWidth) - px(cs.borderRightWidth);
    const r = document.createRange();
    r.selectNodeContents(el);
    return r.getBoundingClientRect().width > room + 0.1;
  };

  F.fit1 = function (el, two) {
    el.style.fontSize = "";
    el._fitOver = false;
    if (!el.isConnected || !el.clientWidth) return 0;
    const cs = getComputedStyle(el);
    const max = px(cs.fontSize);
    const min = Math.min(max, Math.max(F.FLOOR, px(cs.getPropertyValue("--fit-min")) || F.FLOOR));
    // two lines: taller than 2 line-heights (the line-height follows the size)
    const lines = () => {
      const lh = px(getComputedStyle(el).lineHeight) || px(getComputedStyle(el).fontSize) * 1.2;
      return el.scrollHeight > lh * 2 + 1;
    };
    const over = () => F.wide(el, two) || (two && lines());
    if (!over()) return max;
    let lo = min;
    let hi = max;
    for (let i = 0; i < 7; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = `${mid}px`;
      if (over()) hi = mid;
      else lo = mid;
    }
    const size = Math.max(min, Math.floor(lo * 2) / 2);
    el.style.fontSize = `${size}px`;
    el._fitOver = over();
    return size;
  };

  F.run = function (rootEl) {
    if (!rootEl) return;
    const groups = new Map();
    rootEl.querySelectorAll(".fit").forEach((el) => {
      const size = F.fit(el);
      const g = el.closest("[data-fit-group]") || (el.classList.contains("fit-head") ? el.closest(".njg-rq-card, #intro") : null); // (the pop-up's headlines are one group)
      if (!g || !size) return;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push([el, size]);
    });
    groups.forEach((list) => {
      const least = Math.min(...list.map((x) => x[1]));
      list.forEach(([el, size]) => size > least && (el.style.fontSize = `${least}px`));
    });
  };

  F.watch = function (rootEl) {
    if (!rootEl) return () => {};
    let queued = false;
    const again = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        F.run(rootEl);
        watchBoxes();
      });
    };
    // PAN-01 (a served card folding at 1366x768: its head narrowed for the stamp, the root's size never changed, and the headline
    // kept the size it was fitted at, under the tick): the box each fitted line sits in is watched too, so any change of the room a
    // line has fits it again
    const boxes = new WeakSet();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(again) : null;
    const watchBoxes = () => {
      if (!ro) return;
      rootEl.querySelectorAll(".fit").forEach((el) => {
        // (a sidebar card's head only: it is as wide as the sidebar, never as wide as its words, so a refit can't feed itself)
        const b = el.closest(".oc-card:not(.oc-big) .oc-head");
        if (b && rootEl.contains(b) && !boxes.has(b)) {
          boxes.add(b);
          ro.observe(b);
        }
      });
    };
    if (ro) ro.observe(rootEl);
    const mo = typeof MutationObserver === "function" ? new MutationObserver((recs) => recs.some((r) => r.type === "childList" || r.attributeName === "class") && again()) : null;
    if (mo) mo.observe(rootEl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
    // the frame's sizes changed (a rotate, a resize past a form factor)
    const off = root.Frame && root.Frame.onChange ? root.Frame.onChange(again) : null;
    again();
    return () => {
      if (ro) ro.disconnect();
      if (mo) mo.disconnect();
      // (C4: and the frame's callback, so a mode unmounted from the page leaves nothing behind)
      if (typeof off === "function") off();
    };
  };

  root.FitText = F;
})(typeof self !== "undefined" ? self : this);
