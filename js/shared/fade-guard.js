/*
 * SH-317: the pages cross-fade into each other (css/shared/app.css, @view-transition). When the browser skips a fade on the
 * page arriving (it was not ready to show it), the fade's promises reject with nobody listening: a page error for nothing,
 * since the child only sees no fade. This runs first in each app page's <head>, before the page can be revealed (version.js,
 * further down, was too late: the reveal came first).
 */
(function (global) {
  if (!global.addEventListener) return;
  const quiet = (e) => {
    const t = e.viewTransition;
    if (t) [t.ready, t.finished, t.updateCallbackDone].forEach((p) => p && p.catch(() => {}));
  };
  ["pagereveal", "pageswap"].forEach((type) => global.addEventListener(type, quiet));
})(window);
