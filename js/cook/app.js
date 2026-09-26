/*
 * Cook with Nani inside the app shell (index.html; js/shared/app.js).
 * Only does anything when the house opened Cook (?app=1).
 *
 * FIRST LAUNCH (?app=1&first=1; docs/UX-PRINCIPLES.md 7: no tutorial). A new
 * player lands here straight from the house, before they've seen any menu:
 *   - Nani's kitchen with one big round play button covers the page at once
 *     (the Cook title never shows). One tap, and that tap is what unlocks the
 *     sound on phones (a page can't play audio before the child touches it);
 *   - the tap starts day 1, whose first order is Nani's pantry list, the
 *     smallest round there is;
 *   - when that order is served (after the end-of-round screen), the player
 *     is marked as started (Save flag "firstDone") and goes to the house.
 * Nothing in Cook's own mechanics or levels changes; the hook is one line in
 * flow.js (Cook.afterOrder).
 */
(function (global) {
  "use strict";
  const App = global.NjgApp;
  if (!App || !App.isApp()) return;
  const params = new URLSearchParams(global.location.search);
  const Save = global.Save;
  const first = params.get("first") === "1" && !(Save && Save.flag("firstDone"));

  Cook.afterOrder = async function (spec, day, o) {
    if (!first || o.free || day.id !== 1 || spec.who !== "nani") return;
    try {
      Save.setFlag("firstDone", true);
    } catch (e) {
      /* still go home */
    }
    await Cook.wait(400);
    App.home("cook-first");
    return "leave";
  };
  if (!first) return;

  // the play button, over everything, from the first paint
  const cover = document.createElement("div");
  cover.id = "njg-first";
  cover.innerHTML = `<button type="button" id="njg-play" aria-label="Play"><img alt="" src="${Cook.v("assets/cook/characters/nani-badge.webp")}"><span class="njg-tri" aria-hidden="true"></span></button>`;
  cover.style.backgroundImage = `url("${Cook.v("assets/backgrounds/bg-nani-kitchen-e-v1.webp")}")`;
  const put = () => document.body.appendChild(cover);
  if (document.body) put();
  else document.addEventListener("DOMContentLoaded", put);
  document.documentElement.classList.add("njg-first");

  let tapped = false;
  cover.addEventListener("click", () => {
    if (tapped) return;
    tapped = true;
    Cook.unlockAudio();
    cover.classList.add("go");
    // Cook's title puts its "Start cooking" button up once the kitchen has loaded; press it
    const start = () => {
      const b = document.getElementById("t-start");
      if (!b) return setTimeout(start, 120);
      b.click();
      setTimeout(() => {
        cover.remove();
        document.documentElement.classList.remove("njg-first");
      }, 350);
    };
    start();
  });
})(window);
