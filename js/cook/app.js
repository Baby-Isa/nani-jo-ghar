/*
 * Cook with Nani inside the app shell (index.html; js/shared/app.js).
 * Only does anything when the house opened Cook (?app=1).
 *
 * FIRST LAUNCH (docs/UX-PRINCIPLES.md 7: no tutorial). A new player lands
 * here before they've seen any menu:
 *   - Nani's kitchen with one big round play button covers the page at once
 *     (the Cook title never shows). One tap, and that tap is what unlocks the
 *     sound on phones (a page can't play audio before the child touches it);
 *   - ?first=1: the tap starts day 1, whose first order is Nani's pantry list,
 *     the smallest round there is; when it's served (after the end-of-round
 *     screen) the player is marked as started (Save flag "firstDone") and goes
 *     to the house. (The shell's own first launch, before the story existed.)
 *   - ?first=pantry&then=<page>: the same pantry round, with Nani's list fixed
 *     to the chai things (chai, dudh, khun); then back to <page> (the first-
 *     launch story, first.html), which goes on from there. firstDone isn't set.
 *   - ?first=chai&then=<page>: one order of Nani's own, a single cup of chai
 *     (the chai tray at level 1, guided the first time as usual); then <page>.
 * Nothing in Cook's own mechanics or levels changes; the hooks are one line in
 * flow.js (Cook.afterOrder) and Cook.startDay.
 */
(function (global) {
  "use strict";
  const App = global.NjgApp;
  if (!App || !App.isApp()) return;
  const params = new URLSearchParams(global.location.search);
  const Save = global.Save;
  const kind = params.get("first");
  // where a story round goes back to: a page of this app only (first.html?app=1&done=pantry)
  const then = /^[\w-]+\.html(\?[\w=&%.,-]*)?$/.test(params.get("then") || "") ? params.get("then") : null;
  const first = kind === "1" ? !(Save && Save.flag("firstDone")) : !!(then && (kind === "pantry" || kind === "chai"));

  Cook.afterOrder = async function (spec, day, o) {
    if (!first) return;
    if (kind === "1") {
      if (o.free || day.id !== 1 || spec.who !== "nani") return;
      try {
        Save.setFlag("firstDone", true);
      } catch (e) {
        /* still go home */
      }
      await Cook.wait(400);
      App.home("cook-first");
      return "leave";
    }
    if (spec.who !== "nani") return;
    await Cook.wait(400);
    App.go(then);
    return "leave";
  };
  // the story's own rounds (Cook's data, only for this visit)
  const CHAI_THINGS = ["cook-chai", "cook-dudh", "cook-khun"];
  const CHAI_DAY = { id: "first-chai", title: "Chai for Nani", gist: "Nani would love a cup of chai!", orders: [{ who: "nani", dishes: ["chai"], level: 1 }] };
  function begin(titleStart) {
    if (kind === "pantry") {
      const basics = Cook.data.recipes.pantry.lists.basics;
      if (CHAI_THINGS.every((id) => basics.includes(id))) Cook.data.recipes.pantry.lists.basics = CHAI_THINGS.slice();
      Cook.startDay(Object.assign({}, Cook.data.days[0], { gist: "Nani needs the chai things from the pantry." }));
    } else if (kind === "chai") {
      // the one cup is Nani's own (the tray's people come from the recipe's family list)
      Cook.data.recipes.chai.lists.family = ["nani"];
      Cook.startDay(CHAI_DAY);
    }
    else titleStart.click();
  }
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
      const b = document.getElementById("t-start") || document.getElementById("t-free");
      if (!b) return setTimeout(start, 120);
      begin(b);
      setTimeout(() => {
        cover.remove();
        document.documentElement.classList.remove("njg-first");
      }, 350);
    };
    start();
  });
})(window);
