/*
 * One line, always (Zafar, 28 Sept: "nothing wraps onto two lines"; docs/cook-ui-feedback-2026-09-28.md 9).
 * Text that must stay on one line gets the class "fit" (and white-space: nowrap in its CSS):
 * FitText shrinks its font until it fits, never below a readable minimum (CSS var --fit-min,
 * default 12px; past that the CSS ellipsis takes over). A group of lines (the pills on one card)
 * can share one size, so a card never mixes sizes.
 *
 *   FitText.fit(el)                    one element (its CSS font-size is the largest it may be)
 *   FitText.run(root)                  every .fit under root; elements with a data-fit-group share its smallest size
 *   FitText.watch(root)                run again whenever root changes size or content (returns stop)
 *
 * Plain <script>: window.FitText.
 */
(function (root) {
  "use strict";
  const F = {};
  const px = (v) => parseFloat(v) || 0;

  F.fit = function (el) {
    el.style.fontSize = "";
    if (!el.isConnected || !el.clientWidth) return 0;
    const cs = getComputedStyle(el);
    const max = px(cs.fontSize);
    const min = Math.min(max, px(cs.getPropertyValue("--fit-min")) || 12);
    const over = () => el.scrollWidth > el.clientWidth + 0.5;
    if (!over()) return max;
    let lo = min;
    let hi = max;
    for (let i = 0; i < 7; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = `${mid}px`;
      if (over()) hi = mid;
      else lo = mid;
    }
    const size = Math.floor(lo * 2) / 2;
    el.style.fontSize = `${size}px`;
    return size;
  };

  F.run = function (rootEl) {
    if (!rootEl) return;
    const groups = new Map();
    rootEl.querySelectorAll(".fit").forEach((el) => {
      const size = F.fit(el);
      const g = el.closest("[data-fit-group]");
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
      });
    };
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(again) : null;
    if (ro) ro.observe(rootEl);
    const mo = typeof MutationObserver === "function" ? new MutationObserver((recs) => recs.some((r) => r.type === "childList" || r.attributeName === "class") && again()) : null;
    if (mo) mo.observe(rootEl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
    again();
    return () => {
      if (ro) ro.disconnect();
      if (mo) mo.disconnect();
    };
  };

  root.FitText = F;
})(typeof self !== "undefined" ? self : this);
