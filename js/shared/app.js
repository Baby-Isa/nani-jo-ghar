/*
 * The app frame ("one app, one save", phase B): what makes the separate
 * mode pages feel like one app. docs/shared-api.md section 12.
 *
 * NAVIGATION IS BY PAGE. The house (index.html) and each mode (cook.html,
 * find.html, clinic.html, the labs) stay separate pages; the house opens a
 * mode with ?app=1, and the mode's way home goes back to index.html. Why not
 * mount the modes inside one page: Cook and Find it both define the same
 * globals (window.Cook, UI, the Phaser game), the clinic has its own, and
 * Phaser's WebGL context and timers don't unmount cleanly; a fresh page per
 * mode frees all of it, keeps every mode's code and tests unchanged, and the
 * old URLs keep working for testing. What makes it feel like one app:
 *   - the same save (js/shared/save.js) on every page;
 *   - the same house colour painted before anything else (css/shared/app.css,
 *     render-blocking in every page's head), and a cross-fade between pages
 *     (cross-document view transitions where the browser has them, a short
 *     fade-out otherwise), so there is no white or unstyled flash;
 *   - the same way home: the mode's own ⌂ rail button goes home (Cook, Find it),
 *     and where a mode has none, or while its menu covers the rail, the same ⌂
 *     button with the player's colour sits in the top-left corner.
 * Opened on its own (no ?app=1) a page behaves exactly as before, apart from
 * reading and writing the one save.
 *
 *   NjgApp.isApp()           opened from the house (?app=1)
 *   NjgApp.go(url)           fade out and open url (another page of the app)
 *   NjgApp.home()            back to the house
 *   NjgApp.link(url)         url with app=1 added
 *   NjgApp.mount({busy, rest, confirm})   called by the frame itself on load; a mode may call it again:
 *       busy()   true mid-round: leaving asks first (default: Cook.inDay, which Find it shares)
 *       rest()   true when the corner ⌂ should show (default: the page has no rail ⌂, or it isn't busy)
 */
(function (global) {
  "use strict";
  const doc = global.document;
  const params = new URLSearchParams(global.location.search);
  const HOME = "index.html";

  const NjgApp = (global.NjgApp = global.NjgApp || {});
  NjgApp.isApp = () => params.get("app") === "1";
  NjgApp.link = (url) => url + (url.includes("?") ? "&" : "?") + "app=1";

  let leaving = false;
  NjgApp.go = function (url) {
    if (leaving) return;
    leaving = true;
    // browsers with cross-document view transitions cross-fade by themselves (css/shared/app.css)
    const vt = global.CSS && CSS.supports && CSS.supports("selector(::view-transition)") && "onpagereveal" in global;
    if (vt) return void (global.location.href = url);
    doc.documentElement.classList.add("njg-leaving");
    setTimeout(() => (global.location.href = url), 160);
  };
  NjgApp.home = (from) => NjgApp.go(HOME + (from ? `?from=${encodeURIComponent(from)}` : ""));
  // back from the browser's own history: never keep the faded page
  global.addEventListener("pageshow", () => {
    leaving = false;
    doc.documentElement.classList.remove("njg-leaving");
  });

  const opts = {
    busy: () => !!(global.Cook && global.Cook.inDay),
    rest: null,
    confirm: "Leave and go back to Nani's house? You'll start this again next time.",
  };
  const page = () => (global.location.pathname.split("/").pop() || "").replace(/\.html$/, "") || "page";
  const rail = () => doc.getElementById("btn-home");

  function colour() {
    try {
      const p = global.Save && global.Save.current();
      return (p && p.colour) || "#b5523b";
    } catch (e) {
      return "#b5523b";
    }
  }
  function leave() {
    if (opts.busy() && !global.confirm(opts.confirm)) return;
    NjgApp.home(page());
  }

  let btn = null;
  function corner() {
    btn = doc.createElement("button");
    btn.id = "njg-home";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to Nani's house");
    btn.title = "Back to Nani's house";
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5.5v-5.5h-5V21H4a1 1 0 0 1-1-1z"/></svg>';
    btn.style.setProperty("--njg-player", colour());
    doc.body.appendChild(btn);
    const tick = () => {
      const show = opts.rest ? !!opts.rest() : !rail() || !opts.busy();
      btn.classList.toggle("hidden", !show);
    };
    tick();
    setInterval(tick, 300);
  }

  NjgApp.mount = function (o = {}) {
    Object.assign(opts, o);
    if (!NjgApp.isApp()) return;
    doc.documentElement.classList.add("njg-app");
    if (!btn) corner();
    btn.style.setProperty("--njg-player", colour());
  };

  // The way home is handled on the window, in the capture phase, registered before any mode
  // code runs, so nothing can swallow it: not the onboarding kit's "only the lit thing" blocker
  // (js/shared/onboard.js), and not the mode's own ⌂ handler (it went to the mode's menu before).
  // It acts on pointerup (a blocked touchstart would cancel the click on a phone); the click
  // that follows is dropped, and a keyboard's click (no pointer) still works.
  let upAt = 0;
  const homeTarget = (e) => NjgApp.isApp() && e.target && e.target.closest && e.target.closest("#njg-home, #btn-home");
  global.addEventListener(
    "pointerup",
    (e) => {
      if (!homeTarget(e) || (e.button != null && e.button > 0)) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      upAt = Date.now();
      leave();
    },
    true
  );
  ["pointerdown", "mousedown", "touchstart", "click"].forEach((t) =>
    global.addEventListener(
      t,
      (e) => {
        if (!homeTarget(e)) return;
        e.stopImmediatePropagation();
        if (t === "click") {
          e.preventDefault();
          if (Date.now() - upAt > 800) leave();
        }
      },
      { capture: true, passive: false }
    )
  );

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", () => NjgApp.mount());
  else NjgApp.mount();
})(window);
