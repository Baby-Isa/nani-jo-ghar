/*
 * cook.html, Cook's own page (C4, decision 45): Cook mounted in the page's one element, with its own title, story
 * days, shop and book (the shell has no shared screens for them yet: build/reports/archive/c4-cook-host.md, task 3). The house
 * opens Cook here (?app=1, js/cook/app.js); the game host mounts the same plug-in for labs and rounds (js/cook/main.js).
 *
 * TEST HOOK (marked). window.njgTest.cook is Cook's test hook (window.njgTest is the one hook name, S13) (flow.js Cook.testHook: lab, order, expectation,
 * gauge (with its screen box), glowing (what is highlighted now), state...). Under automation only (navigator.webdriver: the sandbox's player, the leak bot and the canvas lint, which
 * are not Cook's files, still read Cook.speed, Cook.UI, Cook.save, Cook.Order ...), Cook's namespace is also
 * window.Cook. No other Cook global: the rest of the page reaches Cook through this module.
 */
import { Cook, mount } from "./mount.js";

(window.njgTest = window.njgTest || {}).cook = Cook.testHook;
if (navigator.webdriver) window.Cook = Cook;
// the app frame's way home asks first mid-round (js/shared/app.js; its default looked for a Cook global)
if (window.NjgApp && window.NjgApp.mount) window.NjgApp.mount({ busy: () => !!Cook.inDay });
// inside the app shell: the first launch (straight into the pantry) and the way home
import("./app.js");
mount(document.getElementById("cook-root")).catch((e) => console.error("Cook didn't start", e));
